/**
 * DevSym - Connexion Supabase & Flux Sociaux
 */

// Configuration Supabase
const SUPABASE_URL = "https://fjcqhibkmfpbukcsmigy.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jdcp_2l8Qjqrw3JX3HJoLw_-A-HcTh_";

// liens par défaut lorsque l'administrateur n'a rien renseigné
const DEFAULT_LINKS = {
  facebook: "https://web.facebook.com/profile.php?id=100090623652091",
  linkedin: "https://www.linkedin.com/in/cooperative-devsym-consulting/",
};

// check that the Supabase client library is available
if (typeof supabase === "undefined") {
  console.error("Supabase SDK is not loaded — social feeds will not work.");
} else {
  var _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Reusable helper: render a single feed inside page based on platform
function renderFeed(platform, url) {
  platform = platform.toLowerCase();
  if (platform === "facebook") {
    const el = document.querySelector(".fb-page");
    if (el) {
      el.setAttribute("data-href", url);
    }
  } else if (platform === "instagram") {
    const container = document.querySelector(".instagram-feed");
    if (container) {
      container.innerHTML = `<h3>Instagram</h3><blockquote class="instagram-media" data-instgrm-permalink="${url}" data-instgrm-version="14"></blockquote>`;
    }
  } else if (platform === "linkedin") {
    const container = document.querySelector(".linkedin-feed");
    if (container) {
      // if the URL points to a profile (in/ or profile.php) show the badge
      if (url.includes("linkedin.com/in/") || url.includes("profile.php")) {
        let vanity = "";
        if (url.includes("linkedin.com/in/")) {
          vanity = url.split("linkedin.com/in/")[1].split("/")[0];
        }
        // build badge markup; for profile.php we fallback to a simple link
        if (vanity) {
          container.innerHTML = `<h3>LinkedIn</h3><div class="LI-profile-badge" data-version="v1" data-size="medium" data-locale="fr_FR" data-type="vertical" data-vanity="${vanity}" data-theme="light"><a class="badge-base__link linc-link" href="${url}">Voir notre profil LinkedIn</a></div>`;
        } else {
          container.innerHTML = `<h3>LinkedIn</h3><p><a href="${url}" target="_blank">Voir notre profil LinkedIn</a></p>`;
        }
        // request LinkedIn parser if available
        setTimeout(() => {
          if (window.IN && typeof IN.parse === "function") IN.parse();
        }, 200);
      } else {
        // treat as regular shared post
        const encoded = encodeURIComponent(url);
        container.innerHTML = `<h3>LinkedIn</h3><iframe src="https://www.linkedin.com/embed/feed/update?url=${encoded}" height="600" width="100%" frameborder="0" allowfullscreen="" title="Post LinkedIn"></iframe>`;
      }
    }
  }
}

async function loadSocialFeeds() {
  if (typeof _supabase === "undefined") {
    console.warn("_supabase client not initialized; skipping social feed load.");
    return;
  }
  console.log("Connexion à Supabase en cours...");

  // 1. Récupération des données dans la table 'social_links'
  const { data: links, error } = await _supabase
    .from("social_links")
    .select("*");

  if (error) {
    console.error("Erreur Supabase :", error.message);
    return;
  }

  if (!links || links.length === 0) {
    console.warn("La table social_links est vide sur Supabase.");
    return;
  }

  // 2. Injection des URLs dans le HTML
  // si la base contient des URLs personnalisées, on s'en sert, sinon on applique les valeurs par défaut
  const seen = { facebook: false, linkedin: false, instagram: false };
  links.forEach((link) => {
    const pl = link.platform.toLowerCase();
    if (pl === "facebook" || pl === "linkedin" || pl === "instagram") {
      renderFeed(pl, link.url);
      seen[pl] = true;
    }
  });
  if (!seen.facebook) renderFeed("facebook", DEFAULT_LINKS.facebook);
  if (!seen.linkedin) renderFeed("linkedin", DEFAULT_LINKS.linkedin);

  // 3. Réactivation des scripts (SDK) pour afficher les visuels
  setTimeout(() => {
    // Facebook
    if (window.FB) {
      window.FB.XFBML.parse();
    }
    // Instagram
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }, 800);
}

// Lancer la fonction quand le document est prêt
document.addEventListener("DOMContentLoaded", () => {
  loadSocialFeeds();

});
