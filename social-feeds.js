/**
 * Social Feeds Integration
 * Initializes Facebook, Instagram, and LinkedIn embeds
 */

(function () {
  "use strict";

  /**
   * Load Facebook SDK
   */
  function initFacebook() {
    const fbRoot = document.getElementById("fb-root");
    if (!fbRoot) return;

    window.fbAsyncInit = function () {
      FB.XFBML.parse();
    };

    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.src =
      "https://connect.facebook.net/fr_FR/sdk.js#xfbml=1&version=v18.0";
    document.body.appendChild(script);
  }

  /**
   * Load Instagram Embed
   */
  function initInstagram() {
    const instagramFeed = document.querySelector(".instagram-feed");
    if (!instagramFeed) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = "//www.instagram.com/embed.js";
    document.body.appendChild(script);
  }

  /**
   * Load LinkedIn Badge/Embed
   */
  function initLinkedIn() {
    const linkedinBadge = document.querySelector(".LI-profile-badge");
    if (!linkedinBadge) return;

    const script = document.createElement("script");
    script.src = "https://platform.linkedin.com/badges/js/profile.js";
    script.async = true;
    script.defer = true;
    script.type = "text/javascript";
    document.body.appendChild(script);
  }

  /**
   * Initialize all social feeds when DOM is ready
   */
  function init() {
    initFacebook();
    initInstagram();
    initLinkedIn();
  }

  // Run when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
