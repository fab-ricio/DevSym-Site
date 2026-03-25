// Fetch services from API and dynamically generate cards
async function loadServices() {
  try {
    const response = await fetch("/api/services");
    if (!response.ok) {
      throw new Error("Failed to fetch services");
    }
    const services = await response.json();

    const container = document.getElementById("services-container");
    if (!container) {
      console.error("Services container not found");
      return;
    }

    // Clear existing content
    container.innerHTML = "";

    // Generate cards
    services.forEach((service) => {
      const card = document.createElement("div");
      card.className = "card";
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-haspopup", "dialog");
      card.setAttribute("data-title", service.title);
      card.setAttribute("data-lead", service.lead);
      card.setAttribute("data-description", service.description);

      card.innerHTML = `
        <span class="card-icon" aria-hidden="true">
          ${service.icon}
        </span>
        <div class="card-body">
          <h4>${service.title}</h4>
          <p>${service.shortDescription}</p>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading services:", error);
  }
}

// Load services when DOM is ready
document.addEventListener("DOMContentLoaded", loadServices);
