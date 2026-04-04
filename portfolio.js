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

      // Add click event to open modal
      article.addEventListener("click", () => openPortfolioModal(item));

      container.appendChild(article);
    });

    window.dispatchEvent(new Event("dynamic-content-updated"));
  } catch (error) {
    console.error("Error loading portfolio items:", error);
  }
}

// Open portfolio modal with item details
function openPortfolioModal(item) {
  const modal = document.getElementById("portfolio-modal");
  
  document.getElementById("modal-image").src = item.image || "";
  document.getElementById("modal-type").textContent = item.type || "";
  document.getElementById("modal-year").textContent = item.year || "";
  document.getElementById("modal-title").textContent = item.title || "";
  document.getElementById("modal-lead").textContent = item.lead || "";
  document.getElementById("modal-description").textContent = item.description || "";

  modal.classList.add("active");
}

// Close portfolio modal
function closePortfolioModal() {
  const modal = document.getElementById("portfolio-modal");
  modal.classList.remove("active");
}

// Setup modal event listeners
function setupModalListeners() {
  const modal = document.getElementById("portfolio-modal");
  const closeBtn = document.querySelector(".portfolio-modal-close");
  const overlay = document.querySelector(".portfolio-modal-overlay");

  // Close button
  closeBtn?.addEventListener("click", closePortfolioModal);

  // Click on overlay to close
  overlay?.addEventListener("click", closePortfolioModal);

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closePortfolioModal();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadPortfolio();
  setupModalListeners();
});
