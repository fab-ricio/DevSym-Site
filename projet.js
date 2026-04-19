// Load projects from static JSON file and dynamically generate cards
async function loadProjects() {
  try {
    const response = await fetch("projets.json");
    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }
    const projects = await response.json();

    const container = document.getElementById("missions-container");
    if (!container) {
      console.error("Projects container not found");
      return;
    }

    // Clear existing content
    container.innerHTML = "";

    // Generate project cards
    projects.forEach((project) => {
      const article = document.createElement("article");
      article.className = "mission-card";
      article.setAttribute("data-type", project.type);
      article.setAttribute("data-year", project.year);
      article.setAttribute("data-title", project.title);
      article.setAttribute("data-lead", project.lead);
      article.setAttribute("data-description", project.description);
      article.setAttribute("data-images", project.image);

      article.innerHTML = `
        <img data-src="${project.image}" alt="Vignette ${project.title}" class="project-thumb lazy" />
        <h4>${project.title}</h4>
        <p class="muted">${project.context}</p>
        <p>${project.description}</p>
      `;

      container.appendChild(article);
    });

    window.dispatchEvent(new Event("dynamic-content-updated"));
  } catch (error) {
    console.error("Error loading projects:", error);
  }
}

// Load projects when DOM is ready
document.addEventListener("DOMContentLoaded", loadProjects);
