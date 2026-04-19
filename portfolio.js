// Portfolio filtering functionality
document.addEventListener("DOMContentLoaded", function () {
  initializeFilters();
  updateResultsCount();
});

// Initialize filter event listeners
function initializeFilters() {
  const typeFilter = document.getElementById("type-filter");
  const yearFilter = document.getElementById("year-filter");

  if (typeFilter) {
    typeFilter.addEventListener("change", applyFilters);
  }

  if (yearFilter) {
    yearFilter.addEventListener("change", applyFilters);
  }

  // Setup modal listeners
  setupModalListeners();

  // Add click events to mission cards
  setupMissionCardListeners();
}

// Setup click listeners for mission cards to open modal
function setupMissionCardListeners() {
  const missionCards = document.querySelectorAll(".mission-card");

  missionCards.forEach((card) => {
    card.addEventListener("click", function () {
      const item = {
        type: this.getAttribute("data-type"),
        year: this.getAttribute("data-year"),
        title: this.getAttribute("data-title"),
        lead: this.getAttribute("data-lead"),
        description: this.getAttribute("data-description"),
        image: this.getAttribute("data-images"),
      };
      openPortfolioModal(item);
    });
  });
}

// Apply filters to mission cards
function applyFilters() {
  const typeFilter = document.getElementById("type-filter");
  const yearFilter = document.getElementById("year-filter");
  const missionCards = document.querySelectorAll(".mission-card");

  const selectedType = typeFilter ? typeFilter.value.toLowerCase() : "all";
  const selectedYear = yearFilter ? yearFilter.value : "all";

  let visibleCount = 0;

  missionCards.forEach((card) => {
    const cardType = card.getAttribute("data-type").toLowerCase();
    const cardYear = card.getAttribute("data-year");

    const typeMatch = selectedType === "all" || cardType === selectedType;
    const yearMatch = selectedYear === "all" || cardYear === selectedYear;

    if (typeMatch && yearMatch) {
      card.style.display = "block";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  updateResultsCount(visibleCount);
}

// Update the results count display
function updateResultsCount(count) {
  const resultsCount = document.getElementById("results-count");
  if (resultsCount) {
    if (count !== undefined) {
      resultsCount.textContent = `${count} mission${count !== 1 ? "s" : ""} affichée${count !== 1 ? "s" : ""}`;
    } else {
      const visibleCards = document.querySelectorAll(
        '.mission-card[style*="display: block"], .mission-card:not([style*="display"])',
      );
      const totalCards = document.querySelectorAll(".mission-card").length;
      resultsCount.textContent = `${visibleCards.length} mission${visibleCards.length !== 1 ? "s" : ""} affichée${visibleCards.length !== 1 ? "s" : ""}`;
    }
  }
}

// Format description with bullet points for § separators
function formatDescription(description) {
  if (!description) return "";

  // Split by § and filter out empty parts
  const parts = description.split("§").filter(part => part.trim().length > 0);

  if (parts.length <= 1) {
    return description; // Return as-is if no § found
  }

  // Create HTML list with bullet points
  const listItems = parts.map(part => `<li>${part.trim()}</li>`).join("");
  return `<ul class="description-list">${listItems}</ul>`;
}

// Open portfolio modal with item details
function openPortfolioModal(item) {
  const modal = document.getElementById("portfolio-modal");

  document.getElementById("modal-image").src = item.image || "";
  document.getElementById("modal-type").textContent = item.type || "";
  document.getElementById("modal-year").textContent = item.year || "";
  document.getElementById("modal-title").textContent = item.title || "";
  document.getElementById("modal-lead").textContent = item.lead || "";
  document.getElementById("modal-description").innerHTML =
    formatDescription(item.description);

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

// Load portfolio from localStorage or portfolio.json
async function loadPortfolio() {
  try {
    let portfolioData;

    // Check localStorage first
    const cachedPortfolio = localStorage.getItem("portfolio");
    if (cachedPortfolio) {
      portfolioData = JSON.parse(cachedPortfolio);
      console.log("✅ Portfolio chargé depuis localStorage");
    } else {
      // Fallback to JSON file
      const response = await fetch("portfolio.json");
      if (!response.ok) {
        throw new Error("Failed to fetch portfolio");
      }
      portfolioData = await response.json();
      console.log("✅ Portfolio chargé depuis portfolio.json");
    }

    const container = document.querySelector(".missions-grid");
    if (!container) {
      console.error("Missions grid container not found");
      return;
    }

    // Clear existing content
    container.innerHTML = "";

    // Generate mission cards
    portfolioData.forEach((item) => {
      const article = document.createElement("article");
      article.className = "mission-card";
      article.setAttribute("data-type", item.type);
      article.setAttribute("data-year", item.year);
      article.setAttribute("data-title", item.title);
      article.setAttribute("data-lead", item.lead);
      article.setAttribute("data-description", item.description);
      article.setAttribute("data-images", item.image);

      article.innerHTML = `
        <img data-src="${item.image}" alt="Vignette ${item.title}" class="project-thumb lazy" />
        <h4>Missions Réalisées</h4>
        <p class="muted">${item.year}</p>
        <p>${item.summary || item.description?.substring(0, 100) || ""}</p>
      `;

      container.appendChild(article);
    });

    // Re-setup mission card listeners after content is loaded
    setupMissionCardListeners();
    updateResultsCount();

    window.dispatchEvent(new Event("dynamic-content-updated"));
  } catch (error) {
    console.error("Error loading portfolio:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadPortfolio();
  setupModalListeners();
});
