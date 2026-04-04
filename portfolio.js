// Fetch portfolio items from JSON and render mission cards
async function loadPortfolio() {
  try {
    const response = await fetch("/portfolio.json");
    if (!response.ok) {
      throw new Error("Failed to fetch portfolio items");
    }

    const items = await response.json();
    const container = document.querySelector(".missions-grid");
    if (!container) {
      console.error("Portfolio container not found");
      return;
    }

    container.innerHTML = "";

    items.forEach((item) => {
      const article = document.createElement("article");
      article.className = "mission-card";
      article.setAttribute("data-type", item.type || "");
      article.setAttribute("data-year", item.year || "");
      article.setAttribute("data-title", item.title || "");
      article.setAttribute("data-lead", item.lead || "");
      article.setAttribute("data-description", item.description || "");
      article.setAttribute("data-images", item.image || "");

      article.innerHTML = `
        <img data-src="${item.image || ""}" alt="Vignette ${item.title || "portfolio"}" class="project-thumb lazy" />
        <h4>Missions Réalisées</h4>
        <p class="muted">${item.year || ""}</p>
        <p>${item.summary || item.title || ""}</p>
      `;

      container.appendChild(article);
    });

    window.dispatchEvent(new Event("dynamic-content-updated"));
  } catch (error) {
    console.error("Error loading portfolio items:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadPortfolio);
