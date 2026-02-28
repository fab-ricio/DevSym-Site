/**
 * DevSym - Connexion Supabase & Flux Sociaux
 */

// Configuration Supabase
const SUPABASE_URL = "https://fjcqhibkmfpbukcsmigy.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jdcp_2l8Qjqrw3JX3HJoLw_-A-HcTh_";

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loadSocialFeeds() {
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
  links.forEach((link) => {
    const platform = link.platform.toLowerCase();

    if (platform === "facebook") {
      const el = document.querySelector(".fb-page");
      if (el) el.setAttribute("data-href", link.url);
    }

    if (platform === "instagram") {
      const container = document.querySelector(".instagram-feed");
      if (container) {
        container.innerHTML = `<h3>Instagram</h3><blockquote class="instagram-media" data-instgrm-permalink="${link.url}" data-instgrm-version="14"></blockquote>`;
      }
    }

    if (platform === "linkedin") {
      const container = document.querySelector(".linkedin-feed");
      if (container) {
        // On utilise le format iframe pour LinkedIn
        container.innerHTML = `<h3>LinkedIn</h3><iframe src="${link.url}" height="600" width="100%" frameborder="0" allowfullscreen="" title="Post LinkedIn"></iframe>`;
      }
    }
  });

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
document.addEventListener("DOMContentLoaded", loadSocialFeeds);
