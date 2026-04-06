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

// Open portfolio modal with item details
function openPortfolioModal(item) {
  const modal = document.getElementById("portfolio-modal");

  document.getElementById("modal-image").src = item.image || "";
  document.getElementById("modal-type").textContent = item.type || "";
  document.getElementById("modal-year").textContent = item.year || "";
  document.getElementById("modal-title").textContent = item.title || "";
  document.getElementById("modal-lead").textContent = item.lead || "";
  document.getElementById("modal-description").textContent =
    item.description || "";

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
