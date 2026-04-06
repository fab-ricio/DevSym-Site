// API base URLs
const SERVICES_API = "/api/services";
const PROJETS_API = "/api/projets";
const PORTFOLIO_API = "/api/portfolio";

// DOM elements - will be initialized after DOM loads
let servicesContainer,
  serviceForm,
  serviceId,
  serviceTitle,
  serviceLead,
  serviceDescription;
let submitBtn, cancelBtn, serviceFormTitle;
let projetsContainer,
  projetForm,
  projetId,
  projetTitle,
  projetLead,
  projetType,
  projetYear;
let projetDescription, projetContext, projetImage;
let projetSubmitBtn, projetCancelBtn, projetFormTitle;
let portfolioContainer,
  portfolioForm,
  portfolioId,
  portfolioTitle,
  portfolioLead,
  portfolioType,
  portfolioYear,
  portfolioSummary,
  portfolioDescription,
  portfolioImage;
let portfolioSubmitBtn, portfolioCancelBtn, portfolioFormTitle;
let tabButtons;

// Initialize all DOM elements and event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Get DOM elements for Services
  servicesContainer = document.getElementById("services-container");
  serviceForm = document.getElementById("service-form");
  serviceId = document.getElementById("service-id");
  serviceTitle = document.getElementById("service-title");
  serviceLead = document.getElementById("service-lead");
  serviceDescription = document.getElementById("service-description");
  submitBtn = document.getElementById("submit-btn");
  cancelBtn = document.getElementById("cancel-btn");
  serviceFormTitle = document.getElementById("service-form-title");

  // Get DOM elements for Projects
  projetsContainer = document.getElementById("projets-container");
  projetForm = document.getElementById("projet-form");
  projetId = document.getElementById("projet-id");
  projetTitle = document.getElementById("projet-title");
  projetLead = document.getElementById("projet-lead");
  projetType = document.getElementById("projet-type");
  projetYear = document.getElementById("projet-year");
  projetDescription = document.getElementById("projet-description");
  projetContext = document.getElementById("projet-context");
  projetImage = document.getElementById("projet-image");
  projetSubmitBtn = document.getElementById("projet-submit-btn");
  projetCancelBtn = document.getElementById("projet-cancel-btn");
  projetFormTitle = document.getElementById("projet-form-title");

  // Get DOM elements for Portfolio
  portfolioContainer = document.getElementById("portfolio-container");
  portfolioForm = document.getElementById("portfolio-form");
  portfolioId = document.getElementById("portfolio-id");
  portfolioTitle = document.getElementById("portfolio-title");
  portfolioLead = document.getElementById("portfolio-lead");
  portfolioType = document.getElementById("portfolio-type");
  portfolioYear = document.getElementById("portfolio-year");
  portfolioSummary = document.getElementById("portfolio-summary");
  portfolioDescription = document.getElementById("portfolio-description");
  portfolioImage = document.getElementById("portfolio-image");
  portfolioSubmitBtn = document.getElementById("portfolio-submit-btn");
  portfolioCancelBtn = document.getElementById("portfolio-cancel-btn");
  portfolioFormTitle = document.getElementById("portfolio-form-title");

  // Get tab buttons
  tabButtons = document.querySelectorAll(".tab-btn");

  // Setup event listeners
  if (serviceForm)
    serviceForm.addEventListener("submit", handleServiceFormSubmit);
  if (cancelBtn) cancelBtn.addEventListener("click", resetServiceForm);
  if (projetForm) projetForm.addEventListener("submit", handleProjetFormSubmit);
  if (projetCancelBtn)
    projetCancelBtn.addEventListener("click", resetProjetForm);
  if (portfolioForm)
    portfolioForm.addEventListener("submit", handlePortfolioFormSubmit);
  if (portfolioCancelBtn)
    portfolioCancelBtn.addEventListener("click", resetPortfolioForm);

  // Initialize tabs and load data
  setupTabs();
  loadServices();
  loadProjets();
  loadPortfolio();

  // Initialize image uploads for all sections
  initializeImageUpload("service");
  initializeImageUpload("projet");
  initializeImageUpload("portfolio");
});

// ==================== TABS ====================
function setupTabs() {
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      // Add active class to clicked button
      button.classList.add("active");

      // Hide all tabs
      document.querySelectorAll(".tab-content").forEach((tab) => {
        tab.classList.remove("active");
      });
      // Show selected tab
      const tabId = button.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");
    });
  });
}

// ==================== SERVICES ====================
async function loadServices() {
  try {
    const response = await fetch(SERVICES_API);
    if (!response.ok) {
      throw new Error("Failed to load services");
    }
    const services = await response.json();
    displayServices(services);
  } catch (error) {
    console.error("Error loading services:", error);
    servicesContainer.innerHTML =
      "<p>Erreur lors du chargement des services.</p>";
  }
}

function displayServices(services) {
  servicesContainer.innerHTML = "";

  if (services.length === 0) {
    servicesContainer.innerHTML = "<p>Aucun service trouvé.</p>";
    return;
  }

  services.forEach((service) => {
    const serviceItem = document.createElement("div");
    serviceItem.className = "service-item";
    serviceItem.innerHTML = `
            <h3>${service.title}</h3>
            <p><strong>Lead:</strong> ${service.lead}</p>
            <p><strong>Description:</strong> ${service.description.substring(0, 100)}...</p>
            <div class="service-actions">
                <button class="btn btn-secondary" onclick="editService(${service.id})">Modifier</button>
                <button class="btn btn-danger" onclick="deleteService(${service.id})">Supprimer</button>
            </div>
        `;
    servicesContainer.appendChild(serviceItem);
  });
}

// Handle service form submission (add or update)
async function handleServiceFormSubmit(event) {
  event.preventDefault();

  const serviceData = {
    title: serviceTitle.value.trim(),
    lead: serviceLead.value.trim(),
    description: serviceDescription.value.trim(),
  };

  const id = serviceId.value;

  try {
    let response;
    if (id) {
      // Update existing service
      response = await fetch(`${SERVICES_API}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      });
    } else {
      // Add new service
      response = await fetch(SERVICES_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      });
    }

    if (!response.ok) {
      throw new Error("Failed to save service");
    }

    // Reset form and reload services
    resetServiceForm();
    loadServices();
  } catch (error) {
    console.error("Error saving service:", error);
    alert("Erreur lors de la sauvegarde du service.");
  }
}

// Edit service (populate form)
function editService(id) {
  fetch(SERVICES_API)
    .then((response) => response.json())
    .then((services) => {
      const service = services.find((s) => s.id === id);
      if (service) {
        // Scroll to the form first
        scrollToForm("services-tab");

        serviceId.value = service.id;
        serviceTitle.value = service.title;
        serviceLead.value = service.lead;
        serviceDescription.value = service.description;
        serviceImage.value = service.image || "";

        // Show existing image if available
        showExistingImage("service", service.image);

        serviceFormTitle.textContent = "Modifier le Service";
        submitBtn.textContent = "Mettre à jour";
      }
    })
    .catch((error) => {
      console.error("Error fetching service for edit:", error);
    });
}

// Delete service
async function deleteService(id) {
  if (!confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
    return;
  }

  try {
    const response = await fetch(`${SERVICES_API}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete service");
    }

    // Reload services
    loadServices();
  } catch (error) {
    console.error("Error deleting service:", error);
    alert("Erreur lors de la suppression du service.");
  }
}

// Reset service form to add new service
function resetServiceForm() {
  serviceId.value = "";
  serviceTitle.value = "";
  serviceLead.value = "";
  serviceDescription.value = "";
  serviceImage.value = "";
  showExistingImage("service", null);
  serviceFormTitle.textContent = "Ajouter un Nouveau Service";
  submitBtn.textContent = "Ajouter";
}

// ==================== PORTFOLIO ====================
async function loadPortfolio() {
  try {
    const response = await fetch(PORTFOLIO_API);
    if (!response.ok) {
      throw new Error("Failed to load portfolio items");
    }
    const items = await response.json();
    displayPortfolio(items);
  } catch (error) {
    console.error("Error loading portfolio:", error);
    portfolioContainer.innerHTML =
      "<p>Erreur lors du chargement du portfolio.</p>";
  }
}

function displayPortfolio(items) {
  portfolioContainer.innerHTML = "";

  if (!items || items.length === 0) {
    portfolioContainer.innerHTML = "<p>Aucun article de portfolio trouvé.</p>";
    return;
  }

  items.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.className = "service-item";
    itemElement.innerHTML = `
            <h3>${item.title}</h3>
            <p><strong>Lead:</strong> ${item.lead || "-"}</p>
            <p><strong>Type:</strong> ${item.type || "-"} • <strong>Année:</strong> ${item.year || "-"}</p>
            <p><strong>Résumé:</strong> ${item.summary || "-"}</p>
            <p><strong>Description:</strong> ${item.description.substring(0, 100)}...</p>
            <div class="service-actions">
                <button class="btn btn-secondary" onclick="editPortfolio(${item.id})">Modifier</button>
                <button class="btn btn-danger" onclick="deletePortfolio(${item.id})">Supprimer</button>
            </div>
        `;
    portfolioContainer.appendChild(itemElement);
  });
}

async function handlePortfolioFormSubmit(event) {
  event.preventDefault();

  const portfolioData = {
    title: portfolioTitle.value.trim(),
    lead: portfolioLead.value.trim(),
    type: portfolioType.value.trim(),
    year: portfolioYear.value.trim(),
    summary: portfolioSummary.value.trim(),
    description: portfolioDescription.value.trim(),
    image: portfolioImage.value.trim(),
  };

  const id = portfolioId.value;

  try {
    let response;
    if (id) {
      response = await fetch(`${PORTFOLIO_API}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(portfolioData),
      });
    } else {
      response = await fetch(PORTFOLIO_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(portfolioData),
      });
    }

    if (!response.ok) {
      throw new Error("Failed to save portfolio item");
    }

    resetPortfolioForm();
    loadPortfolio();
  } catch (error) {
    console.error("Error saving portfolio item:", error);
    alert("Erreur lors de la sauvegarde de l'article portfolio.");
  }
}

function editPortfolio(id) {
  fetch(PORTFOLIO_API)
    .then((response) => response.json())
    .then((items) => {
      const item = items.find((i) => i.id === id);
      if (item) {
        portfolioId.value = item.id;
        portfolioTitle.value = item.title;
        portfolioLead.value = item.lead;
        portfolioType.value = item.type;
        portfolioYear.value = item.year;
        portfolioSummary.value = item.summary;
        portfolioDescription.value = item.description;
        portfolioImage.value = item.image || "";

        // Show existing image if available
        showExistingImage("portfolio", item.image);

        portfolioFormTitle.textContent = "Modifier l'Article";
        portfolioSubmitBtn.textContent = "Mettre à jour";

        // Scroll to the form
        scrollToForm("portfolio-tab");
      }
    })
    .catch((error) => {
      console.error("Error fetching portfolio item for edit:", error);
    });
}

async function deletePortfolio(id) {
  if (
    !confirm("Êtes-vous sûr de vouloir supprimer cet article de portfolio ?")
  ) {
    return;
  }

  try {
    const response = await fetch(`${PORTFOLIO_API}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete portfolio item");
    }

    loadPortfolio();
  } catch (error) {
    console.error("Error deleting portfolio item:", error);
    alert("Erreur lors de la suppression de l'article portfolio.");
  }
}

function resetPortfolioForm() {
  portfolioId.value = "";
  portfolioTitle.value = "";
  portfolioLead.value = "";
  portfolioType.value = "";
  portfolioYear.value = "";
  portfolioSummary.value = "";
  portfolioDescription.value = "";
  portfolioImage.value = "";
  showExistingImage("portfolio", null);
  portfolioFormTitle.textContent = "Ajouter un Nouvel Article";
  portfolioSubmitBtn.textContent = "Ajouter";
}

// ==================== PROJETS ====================
async function loadProjets() {
  try {
    const response = await fetch(PROJETS_API);
    if (!response.ok) {
      throw new Error("Failed to load projects");
    }
    const projets = await response.json();
    displayProjets(projets);
  } catch (error) {
    console.error("Error loading projects:", error);
    projetsContainer.innerHTML =
      "<p>Erreur lors du chargement des projets.</p>";
  }
}

function displayProjets(projets) {
  projetsContainer.innerHTML = "";

  if (projets.length === 0) {
    projetsContainer.innerHTML = "<p>Aucun projet trouvé.</p>";
    return;
  }

  projets.forEach((projet) => {
    const projetItem = document.createElement("div");
    projetItem.className = "service-item";
    projetItem.innerHTML = `
            <h3>${projet.title}</h3>
            <p><strong>Lead:</strong> ${projet.lead}</p>
            <p><strong>Type:</strong> ${projet.type} • <strong>Année:</strong> ${projet.year}</p>
            <p><strong>Description:</strong> ${projet.description.substring(0, 100)}...</p>
            <div class="service-actions">
                <button class="btn btn-secondary" onclick="editProjet(${projet.id})">Modifier</button>
                <button class="btn btn-danger" onclick="deleteProjet(${projet.id})">Supprimer</button>
            </div>
        `;
    projetsContainer.appendChild(projetItem);
  });
}

// Handle projet form submission (add or update)
async function handleProjetFormSubmit(event) {
  event.preventDefault();

  const projetData = {
    title: projetTitle.value.trim(),
    lead: projetLead.value.trim(),
    type: projetType.value.trim(),
    year: projetYear.value.trim(),
    description: projetDescription.value.trim(),
    context: projetContext.value.trim(),
    image: projetImage.value.trim(),
  };

  const id = projetId.value;

  try {
    let response;
    if (id) {
      // Update existing project
      response = await fetch(`${PROJETS_API}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projetData),
      });
    } else {
      // Add new project
      response = await fetch(PROJETS_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projetData),
      });
    }

    if (!response.ok) {
      throw new Error("Failed to save project");
    }

    // Reset form and reload projects
    resetProjetForm();
    loadProjets();
  } catch (error) {
    console.error("Error saving project:", error);
    alert("Erreur lors de la sauvegarde du projet.");
  }
}

// Edit projet (populate form)
function editProjet(id) {
  fetch(PROJETS_API)
    .then((response) => response.json())
    .then((projets) => {
      const projet = projets.find((p) => p.id === id);
      if (projet) {
        projetId.value = projet.id;
        projetTitle.value = projet.title;
        projetLead.value = projet.lead;
        projetType.value = projet.type;
        projetYear.value = projet.year;
        projetDescription.value = projet.description;
        projetContext.value = projet.context;
        projetImage.value = projet.image || "";

        // Show existing image if available
        showExistingImage("projet", projet.image);

        projetFormTitle.textContent = "Modifier le Projet";
        projetSubmitBtn.textContent = "Mettre à jour";

        // Scroll to the form
        scrollToForm("projets-tab");
      }
    })
    .catch((error) => {
      console.error("Error fetching project for edit:", error);
    });
}

// Delete projet
async function deleteProjet(id) {
  if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
    return;
  }

  try {
    const response = await fetch(`${PROJETS_API}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete project");
    }

    // Reload projects
    loadProjets();
  } catch (error) {
    console.error("Error deleting project:", error);
    alert("Erreur lors de la suppression du projet.");
  }
}

// Reset projet form to add new project
function resetProjetForm() {
  projetId.value = "";
  projetTitle.value = "";
  projetLead.value = "";
  projetType.value = "";
  projetYear.value = "";
  projetDescription.value = "";
  projetContext.value = "";
  projetImage.value = "";
  showExistingImage("projet", null);
  projetFormTitle.textContent = "Ajouter un Nouveau Projet";
  projetSubmitBtn.textContent = "Ajouter";
}

// ====================
// IMAGE UPLOAD FUNCTIONS
// ====================

// Initialize image upload for a specific section
function initializeImageUpload(section) {
  const uploadZone = document.getElementById(`${section}-image-upload`);
  const fileInput = document.getElementById(`${section}-image-file`);
  const preview = document.getElementById(`${section}-image-preview`);
  const progress = document.getElementById(`${section}-upload-progress`);
  const progressFill = document.getElementById(`${section}-upload-fill`);
  const status = document.getElementById(`${section}-upload-status`);
  const imagePathInput = document.getElementById(`${section}-image`);

  if (!uploadZone || !fileInput) return;

  // Drag and drop events
  uploadZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadZone.classList.add("dragover");
  });

  uploadZone.addEventListener("dragleave", () => {
    uploadZone.classList.remove("dragover");
  });

  uploadZone.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadZone.classList.remove("dragover");
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(
        files[0],
        section,
        preview,
        progress,
        progressFill,
        status,
        imagePathInput,
      );
    }
  });

  // File input change
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(
        file,
        section,
        preview,
        progress,
        progressFill,
        status,
        imagePathInput,
      );
    }
  });
}

// Handle file upload
async function handleFileUpload(
  file,
  section,
  preview,
  progress,
  progressFill,
  status,
  imagePathInput,
) {
  // Validate file type
  if (!file.type.startsWith("image/")) {
    status.textContent = "❌ Seuls les fichiers image sont acceptés";
    status.className = "upload-status upload-error";
    progress.style.display = "none";
    return;
  }

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    status.textContent = "❌ Le fichier est trop volumineux (max 5MB)";
    status.className = "upload-status upload-error";
    progress.style.display = "none";
    return;
  }

  // Show preview
  const reader = new FileReader();
  reader.onload = (e) => {
    preview.src = e.target.result;
    preview.style.display = "block";
  };
  reader.readAsDataURL(file);

  // Show progress
  progress.style.display = "block";
  progressFill.style.width = "0%";
  status.textContent = "⏳ Upload en cours...";
  status.className = "upload-status";

  try {
    // Create FormData
    const formData = new FormData();
    formData.append("image", file);

    // Upload file
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok && result.success) {
      // Success
      progressFill.style.width = "100%";
      status.textContent = "✅ Upload réussi !";
      status.className = "upload-status upload-success";
      imagePathInput.value = result.imagePath;

      setTimeout(() => {
        progress.style.display = "none";
      }, 2000);
    } else {
      // Error
      throw new Error(result.error || "Upload failed");
    }
  } catch (error) {
    console.error("Upload error:", error);
    progressFill.style.width = "0%";
    status.textContent = `❌ Erreur: ${error.message}`;
    status.className = "upload-status upload-error";
    progress.style.display = "none";
  }
}

// Show existing image in upload zone
function showExistingImage(section, imagePath) {
  const uploadZone = document.getElementById(`${section}-image-upload`);
  const preview = document.getElementById(`${section}-image-preview`);
  const uploadContent = uploadZone.querySelector(".image-upload-content");

  if (imagePath) {
    // Show existing image
    preview.src = imagePath;
    preview.style.display = "block";
    uploadContent.style.display = "none";

    // Add remove button if not already present
    let removeBtn = uploadZone.querySelector(".image-remove-btn");
    if (!removeBtn) {
      removeBtn = document.createElement("button");
      removeBtn.className = "image-remove-btn";
      removeBtn.innerHTML = "🗑️ Supprimer l'image";
      removeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(220, 53, 69, 0.9);
        color: white;
        border: none;
        border-radius: 4px;
        padding: 5px 10px;
        cursor: pointer;
        font-size: 12px;
      `;
      removeBtn.onclick = (e) => {
        e.preventDefault();
        removeExistingImage(section);
      };
      uploadZone.appendChild(removeBtn);
    }
  } else {
    // No image, show upload interface
    preview.style.display = "none";
    uploadContent.style.display = "block";

    // Remove remove button if present
    const removeBtn = uploadZone.querySelector(".image-remove-btn");
    if (removeBtn) {
      removeBtn.remove();
    }
  }
}

// Remove existing image
function removeExistingImage(section) {
  const imagePathInput = document.getElementById(`${section}-image`);
  imagePathInput.value = "";
  showExistingImage(section, null);
}

// Initialize all image uploads when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // ... existing initialization code ...

  // Initialize image uploads for all sections
  initializeImageUpload("service");
  initializeImageUpload("projet");
  initializeImageUpload("portfolio");
});

// ====================
// UTILITY FUNCTIONS
// ====================

// Scroll to the form section for the specified tab
function scrollToForm(tabId) {
  // First, switch to the correct tab
  const tabButton = document.querySelector(`[data-tab="${tabId}"]`);
  if (tabButton && !tabButton.classList.contains("active")) {
    // Only switch tabs if not already active
    // Remove active class from all tabs
    document
      .querySelectorAll(".tab-btn")
      .forEach((btn) => btn.classList.remove("active"));
    document
      .querySelectorAll(".tab-content")
      .forEach((content) => content.classList.remove("active"));

    // Add active class to the target tab
    tabButton.classList.add("active");
    const tabContent = document.getElementById(tabId);
    if (tabContent) {
      tabContent.classList.add("active");
    }
  }

  // Then scroll to the form section
  const formSection = document.querySelector(`#${tabId} .form-section`);
  if (formSection) {
    // Add a small delay to ensure the tab switch is complete
    setTimeout(() => {
      formSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }
}
