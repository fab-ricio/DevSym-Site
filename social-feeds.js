/**
 * DevSym - Social feeds loader
 */

// liens par défaut lorsque l’administrateur n’a rien renseigné
const DEFAULT_LINKS = {
  facebook: "https://web.facebook.com/profile.php?id=100090623652091",
  youtube: "https://www.youtube.com/channel/UCndcjUOurpeU4ozqoGG1d-A",
  linkedin: "https://www.linkedin.com/in/cooperative-devsym-consulting/",
};

async function loadSocialFeeds() {
  const dataUrl = "social-links.json";
  let links;

  try {
    const response = await fetch(dataUrl);
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }
    links = await response.json();
  } catch (error) {
    console.warn(
      "Impossible de charger social-links.json, utilisation des liens par défaut.",
      error,
    );
    links = [];
  }

  const seen = { facebook: false, linkedin: false, youtube: false };

  if (Array.isArray(links)) {
    links.forEach((link) => {
      if (!link || !link.platform || !link.url) return;
      const pl = link.platform.toLowerCase();
      if (pl === "facebook" || pl === "linkedin" || pl === "youtube") {
        renderFeed(pl, link.url);
        seen[pl] = true;
      }
    });
  }

  if (!seen.facebook) renderFeed("facebook", DEFAULT_LINKS.facebook);
  if (!seen.youtube) {
    renderFeed("youtube", DEFAULT_LINKS.youtube);
    renderFeed("youtube-2", DEFAULT_LINKS.youtube); // 2ème zone YouTube (même chaîne)
  }
  if (!seen.linkedin) renderFeed("linkedin", DEFAULT_LINKS.linkedin);

  setTimeout(() => {
    if (window.FB) {
      window.FB.XFBML.parse();
    }
  }, 800);
}

// Lancer la fonction quand le document est prêt
document.addEventListener("DOMContentLoaded", () => {
  loadSocialFeeds();
});

function renderFeed(platform, url) {
  platform = platform.toLowerCase();
  if (platform === "facebook") {
    const el = document.querySelector(".fb-page");
    if (el) {
      el.setAttribute("data-href", url);
    }
  } else if (platform === "youtube" || platform === "youtube-2") {
    const selector = platform === "youtube" ? ".youtube-feed" : ".youtube-feed-2";
    const container = document.querySelector(selector);
    if (container) {
      let videoId = "";
      let channelId = "";
      if (url.includes("youtube.com/watch?v=")) {
        videoId = url.split("v=")[1].split("&")[0];
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
      } else if (url.includes("youtube.com/embed/")) {
        videoId = url.split("embed/")[1].split("?")[0];
      } else if (url.includes("youtube.com/channel/")) {
        channelId = url.split("youtube.com/channel/")[1].split(/[\/?]/)[0];
      } else if (url.includes("youtube.com/@")) {
        const username = url.split("youtube.com/@")[1].split(/[\/?&]/)[0];
        if (username) {
          channelId = username;
        }
      }
      if (videoId) {
        renderYouTubeThumbnail(container, videoId);
      } else if (channelId) {
        renderLatestYouTubeChannelVideo(container, channelId, url);
      } else {
        container.innerHTML = `<h3>YouTube</h3><p><a href="${url}" target="_blank">Voir sur YouTube</a></p>`;
      }
    }
  } else if (platform === "linkedin") {
    const container = document.querySelector(".linkedin-feed");
    if (container) {
      if (url.includes("linkedin.com/in/") || url.includes("profile.php")) {
        let vanity = "";
        if (url.includes("linkedin.com/in/")) {
          vanity = url.split("linkedin.com/in/")[1].split("/")[0];
        }
        if (vanity) {
          container.innerHTML = `<h3>LinkedIn</h3><div class="LI-profile-badge" data-version="v1" data-size="medium" data-locale="fr_FR" data-type="vertical" data-vanity="${vanity}" data-theme="light"><a class="badge-base__link linc-link" href="${url}">Voir notre profil LinkedIn</a></div>`;
        } else {
          container.innerHTML = `<h3>LinkedIn</h3><p><a href="${url}" target="_blank">Voir notre profil LinkedIn</a></p>`;
        }
        setTimeout(() => {
          if (window.IN && typeof IN.parse === "function") IN.parse();
        }, 200);
      } else {
        const encoded = encodeURIComponent(url);
        container.innerHTML = `<h3>LinkedIn</h3><iframe src="https://www.linkedin.com/embed/feed/update?url=${encoded}" height="600" width="100%" frameborder="0" allowfullscreen="" title="Post LinkedIn"></iframe>`;
      }
    }
  }
}

function renderYouTubeThumbnail(container, videoId) {
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  container.innerHTML = `
    <h3>YouTube</h3>
    <a href="${videoUrl}" target="_blank" class="youtube-video-link">
      <img src="${thumbnailUrl}" alt="Dernière vidéo YouTube" style="width:100%; height:auto; display:block; border-radius: 14px;" />
    </a>
    <p style="margin-top: 12px; text-align:center;"><a href="${videoUrl}" target="_blank">Voir la dernière vidéo sur YouTube</a></p>
  `;
}

async function renderLatestYouTubeChannelVideo(container, channelId, channelUrl) {
  container.innerHTML = `<h3>YouTube</h3><p>Chargement de la dernière vidéo...</p>`;
  const videoId = await fetchLatestYouTubeVideoId(channelId, channelUrl);
  if (videoId) {
    renderYouTubeThumbnail(container, videoId);
  } else {
    renderYouTubeFallbackThumbnail(container, channelUrl || `https://www.youtube.com/channel/${channelId}`);
  }
}

function renderYouTubeFallbackThumbnail(container, url) {
  const fallbackImage = "https://via.placeholder.com/1200x675.png?text=Dernière+vid%C3%A9o+YouTube";
  container.innerHTML = `
    <h3>YouTube</h3>
    <a href="${url}" target="_blank" class="youtube-video-link">
      <img src="${fallbackImage}" alt="Vignette YouTube de secours" style="width:100%; height:auto; display:block; border-radius: 14px;" />
    </a>
    <p style="margin-top: 12px; text-align:center;"><a href="${url}" target="_blank">Voir notre chaîne YouTube</a></p>
  `;
}

async function fetchLatestYouTubeVideoId(channelId, channelUrl) {
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`;

  try {
    const response = await fetch(proxyUrl);
    if (response.ok) {
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "application/xml");
      const videoIdElement = xmlDoc.getElementsByTagName("videoId")[0] || xmlDoc.getElementsByTagName("yt:videoId")[0] || xmlDoc.querySelector("videoId");
      const videoId = videoIdElement ? videoIdElement.textContent.trim() : null;
      if (videoId) {
        return videoId;
      }
    }
  } catch (error) {
    console.warn("Flux RSS YouTube non récupéré, tentative alternative :", error);
  }

  const fallbackUrl = channelUrl || `https://www.youtube.com/channel/${channelId}`;
  return fetchLatestYouTubeVideoIdFromPage(fallbackUrl);
}

async function fetchLatestYouTubeVideoIdFromPage(pageUrl) {
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(pageUrl)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }
    const html = await response.text();
    const match = html.match(/\/watch\?v=([A-Za-z0-9_-]{11})/);
    if (match && match[1]) {
      return match[1];
    }
    const jsonMatch = html.match(/"videoId"\s*:\s*"([A-Za-z0-9_-]{11})"/);
    return jsonMatch ? jsonMatch[1] : null;
  } catch (error) {
    console.warn("Impossible de récupérer le HTML YouTube pour trouver la dernière vidéo.", error);
    return null;
  }
}
