// ============================================================================
// Birthday surprise — interaction logic
// ============================================================================

(function () {
  "use strict";

  var presentBtn = document.getElementById("present-btn");
  var video = document.getElementById("birthday-video");
  var opened = false;

  // --- iOS Safari real viewport height fix ---------------------------------
  // Older iOS Safari doesn't support 100dvh, and 100vh includes the area
  // hidden behind the address bar. We measure the real height in JS and
  // expose it as --vh for CSS to use as a fallback.
  function setViewportHeight() {
    document.documentElement.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
  }
  setViewportHeight();
  window.addEventListener("resize", setViewportHeight);
  window.addEventListener("orientationchange", setViewportHeight);

  // --- Opening the present --------------------------------------------------
  function openPresent(event) {
    if (opened) return;
    opened = true;

    // IMPORTANT (iOS Safari): video.play() must be called synchronously
    // inside the user gesture handler, not after a setTimeout/delay, or
    // iOS will silently block it. Because this call is a direct result of
    // her tap, iOS allows it to play with sound — no mute/unmute step needed.
    if (video) {
      video.play().catch(function () {
        // If autoplay is still blocked for any reason, the native
        // controls (already visible once revealed) let her press play.
      });
    }

    document.body.classList.add("is-opening");
    presentBtn.classList.add("is-opening");
    presentBtn.setAttribute("aria-hidden", "true");
    presentBtn.disabled = true;

    // Once the lid/box finish animating away, remove the button from the
    // layout entirely so it can never be tapped again or block the video.
    var handled = false;
    presentBtn.addEventListener("transitionend", function onEnd(e) {
      if (handled) return;
      handled = true;
      presentBtn.removeEventListener("transitionend", onEnd);
      presentBtn.classList.add("fade-out");
      window.setTimeout(function () {
        presentBtn.classList.add("is-hidden");
      }, 650);
    });
  }

  presentBtn.addEventListener("click", openPresent);
})();
