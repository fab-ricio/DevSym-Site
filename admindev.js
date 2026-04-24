/**
 * Admin Interface for Projects and Portfolio Management
 * With Password Authentication
 */
let projects = [];
let portfolio = [];
let images = [];
let currentEditingProject = null;
let currentEditingPortfolio = null;

// ============================================
// AUTHENTICATION
// ============================================
const ADMIN_PASSWORD = "DevSymCoop@Admin2026!"; // Change this to your password

// Check authentication on page load
document.addEventListener("DOMContentLoaded", async () => {
  checkAuthentication();
});

function checkAuthentication() {
  const isAuthenticated = sessionStorage.getItem("admin_authenticated");
  const loginModal = document.getElementById("loginModal");

  if (!isAuthenticated) {
    // Show login modal
    loginModal.classList.remove("hidden");
    document.getElementById("password").focus();

    // Allow Enter key to submit
    document.getElementById("password").addEventListener("keypress", (e) => {
      if (e.key === "Enter") checkPassword();
    });
  } else {
    // User is authenticated, hide login modal and show admin panel
    loginModal.classList.add("hidden");
    document.getElementById("logoutBtn").style.display = "block";
    initializeAdmin();
  }
}

function checkPassword() {
  const password = document.getElementById("password").value;
  const errorDiv = document.getElementById("loginError");

  if (password === ADMIN_PASSWORD) {
    // Correct password
    sessionStorage.setItem("admin_authenticated", "true");
    errorDiv.style.display = "none";
    document.getElementById("password").value = "";
    checkAuthentication();
  } else {
    // Wrong password
    errorDiv.textContent = "❌ Mot de passe incorrect";
    errorDiv.style.display = "block";
    document.getElementById("password").value = "";
    document.getElementById("password").focus();
  }
}

function logout() {
  sessionStorage.removeItem("admin_authenticated");
  document.getElementById("logoutBtn").style.display = "none";
  document.getElementById("loginModal").classList.remove("hidden");
  document.getElementById("password").value = "";
  document.getElementById("password").focus();
  showSuccess("✅ Vous avez été déconnecté");
}

function initializeAdmin() {
  setupTabNavigation();
  loadAllData();
  renderProjectsList();
  renderPortfolioList();
  setupImageSelectors();
  loadImages();
}

// ============================================
// TAB NAVIGATION
// ============================================
function setupTabNavigation() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const tabName = e.target.dataset.tab;
      switchTab(tabName);
    });
  });
}

function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Remove active from all buttons
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Show selected tab
  document.getElementById(tabName).classList.add("active");

  // Mark button as active
  event.target.classList.add("active");
}

// ============================================
// DATA LOADING
// ============================================
async function loadAllData() {
  try {
    // Load from localStorage first
    const cachedProjects = localStorage.getItem("projects");
    const cachedPortfolio = localStorage.getItem("portfolio");

    if (cachedProjects) {
      projects = JSON.parse(cachedProjects);
    } else {
      // Load from JSON files
      const projectsResponse = await fetch("projets.json");
      projects = await projectsResponse.json();
    }

    if (cachedPortfolio) {
      portfolio = JSON.parse(cachedPortfolio);
    } else {
      const portfolioResponse = await fetch("portfolio.json");
      const portfolioHtml = await portfolioResponse.text();
      // Extract JSON from HTML if needed (fallback to empty array)
      try {
        portfolio = JSON.parse(portfolioHtml);
      } catch {
        portfolio = [];
      }
    }

    showSuccess("✅ Données chargées avec succès");
  } catch (error) {
    console.error("Erreur lors du chargement:", error);
    showSuccess("⚠️ Erreur lors du chargement des données", "error");
  }
}

async function loadImages() {
  try {
    // Try to get list of images from images directory
    // Since we can't list directories statically, we'll look for common images
    const commonImages = [
      "ddm.png",
      "Logo-UAF-jpg-1775320346381.jpeg",
      "Sebkha-mairie-1775320181416.jpg",
      "APISF.png",
      "caritas.png",
      "Asticude.png",
      "Logo-UAF.jpg",
      "fundación-sevilla-acoge.png",
      "jammin.png",
    ];

    images = commonImages.map((img) => `images/${img}`);
  } catch (error) {
    console.error("Erreur lors du chargement des images:", error);
  }
}

// ============================================
// PROJECTS MANAGEMENT
// ============================================
function renderProjectsList() {
  const list = document.getElementById("projectsList");
  list.innerHTML = "";

  projects.forEach((project, index) => {
    const itemRow = document.createElement("div");
    itemRow.className = "item-row";
    itemRow.innerHTML = `
      <span class="item-title">${project.title || "Sans titre"}</span>
      <div class="item-actions">
        <button class="btn btn-sm btn-secondary" onclick="editProject(${index})">✏️ Éditer</button>
        <button class="btn btn-sm btn-danger" onclick="deleteProjectDirect(${index})">🗑️ Supprimer</button>
      </div>
    `;
    list.appendChild(itemRow);
  });
}

function addNewProject() {
  currentEditingProject = null;
  document.getElementById("projectFormSection").style.display = "block";
  document.getElementById("projectFormTitle").textContent = "Nouveau Projet";
  document.getElementById("deleteProjectBtn").style.display = "none";
  document.getElementById("projectForm").reset();
}

function editProject(index) {
  currentEditingProject = index;
  const project = projects[index];

  document.getElementById("projectFormSection").style.display = "block";
  document.getElementById("projectFormTitle").textContent =
    `Éditer: ${project.title}`;
  document.getElementById("deleteProjectBtn").style.display = "inline-block";

  document.getElementById("projectType").value = project.type || "";
  document.getElementById("projectYear").value = project.year || "";
  document.getElementById("projectTitle").value = project.title || "";
  document.getElementById("projectLead").value = project.lead || "";
  document.getElementById("projectDescription").value =
    project.description || "";
  document.getElementById("projectImage").value = project.image || "";

  if (project.image) {
    const preview = document.getElementById("projectImagePreview");
    preview.src = project.image;
    preview.style.display = "block";
  }

  // Scroll to form
  document
    .getElementById("projectFormSection")
    .scrollIntoView({ behavior: "smooth" });
}

function saveProject() {
  const project = {
    id:
      currentEditingProject !== null
        ? projects[currentEditingProject].id
        : Date.now(),
    type: document.getElementById("projectType").value,
    year: document.getElementById("projectYear").value,
    title: document.getElementById("projectTitle").value,
    lead: document.getElementById("projectLead").value,
    description: document.getElementById("projectDescription").value,
    image: document.getElementById("projectImage").value,
    summary: document.getElementById("projectTitle").value, // Auto-generate if needed
  };

  if (!project.title.trim()) {
    showSuccess("❌ Le titre est obligatoire", "error");
    return;
  }

  if (currentEditingProject !== null) {
    projects[currentEditingProject] = project;
  } else {
    projects.push(project);
  }

  saveToLocalStorage("projects", projects);
  renderProjectsList();
  cancelProjectEdit();
  showSuccess("✅ Projet enregistré avec succès");
}

function deleteProjectDirect(index) {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce projet?")) {
    projects.splice(index, 1);
    saveToLocalStorage("projects", projects);
    renderProjectsList();
    showSuccess("✅ Projet supprimé");
  }
}

function deleteProject() {
  deleteProjectDirect(currentEditingProject);
  cancelProjectEdit();
}

function cancelProjectEdit() {
  document.getElementById("projectFormSection").style.display = "none";
  document.getElementById("projectForm").reset();
  currentEditingProject = null;
}

// ============================================
// PORTFOLIO MANAGEMENT
// ============================================
function renderPortfolioList() {
  const list = document.getElementById("portfolioList");
  list.innerHTML = "";

  portfolio.forEach((item, index) => {
    const itemRow = document.createElement("div");
    itemRow.className = "item-row";
    itemRow.innerHTML = `
      <span class="item-title">${item.title || "Sans titre"}</span>
      <div class="item-actions">
        <button class="btn btn-sm btn-secondary" onclick="editPortfolio(${index})">✏️ Éditer</button>
        <button class="btn btn-sm btn-danger" onclick="deletePortfolioDirect(${index})">🗑️ Supprimer</button>
      </div>
    `;
    list.appendChild(itemRow);
  });
}

function addNewPortfolio() {
  currentEditingPortfolio = null;
  document.getElementById("portfolioFormSection").style.display = "block";
  document.getElementById("portfolioFormTitle").textContent =
    "Nouveau Portfolio";
  document.getElementById("deletePortfolioBtn").style.display = "none";
  document.getElementById("portfolioForm").reset();
}

function editPortfolio(index) {
  currentEditingPortfolio = index;
  const item = portfolio[index];

  document.getElementById("portfolioFormSection").style.display = "block";
  document.getElementById("portfolioFormTitle").textContent =
    `Éditer: ${item.title}`;
  document.getElementById("deletePortfolioBtn").style.display = "inline-block";

  document.getElementById("portfolioType").value = item.type || "";
  document.getElementById("portfolioYear").value = item.year || "";
  document.getElementById("portfolioTitle").value = item.title || "";
  document.getElementById("portfolioLead").value = item.lead || "";
  document.getElementById("portfolioDescription").value =
    item.description || "";
  document.getElementById("portfolioSummary").value = item.summary || "";
  document.getElementById("portfolioImage").value = item.image || "";

  if (item.image) {
    const preview = document.getElementById("portfolioImagePreview");
    preview.src = item.image;
    preview.style.display = "block";
  }

  document
    .getElementById("portfolioFormSection")
    .scrollIntoView({ behavior: "smooth" });
}

function savePortfolio() {
  const item = {
    id:
      currentEditingPortfolio !== null
        ? portfolio[currentEditingPortfolio].id
        : Date.now(),
    type: document.getElementById("portfolioType").value,
    year: document.getElementById("portfolioYear").value,
    title: document.getElementById("portfolioTitle").value,
    lead: document.getElementById("portfolioLead").value,
    description: document.getElementById("portfolioDescription").value,
    summary: document.getElementById("portfolioSummary").value,
    image: document.getElementById("portfolioImage").value,
  };

  if (!item.title.trim()) {
    showSuccess("❌ Le titre est obligatoire", "error");
    return;
  }

  if (currentEditingPortfolio !== null) {
    portfolio[currentEditingPortfolio] = item;
  } else {
    portfolio.push(item);
  }

  saveToLocalStorage("portfolio", portfolio);
  renderPortfolioList();
  cancelPortfolioEdit();
  showSuccess("✅ Portfolio enregistré avec succès");
}

function deletePortfolioDirect(index) {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce portfolio?")) {
    portfolio.splice(index, 1);
    saveToLocalStorage("portfolio", portfolio);
    renderPortfolioList();
    showSuccess("✅ Portfolio supprimé");
  }
}

function deletePortfolio() {
  deletePortfolioDirect(currentEditingPortfolio);
  cancelPortfolioEdit();
}

function cancelPortfolioEdit() {
  document.getElementById("portfolioFormSection").style.display = "none";
  document.getElementById("portfolioForm").reset();
  currentEditingPortfolio = null;
}

// ============================================
// IMAGE SELECTION
// ============================================
function setupImageSelectors() {
  document
    .getElementById("projectImageSelector")
    .addEventListener("click", () => {
      showImageModal("project");
    });

  document
    .getElementById("portfolioImageSelector")
    .addEventListener("click", () => {
      showImageModal("portfolio");
    });
}

function showImageModal(type) {
  const imageList = images
    .map(
      (
        img,
      ) => `<div style="cursor: pointer; padding: 0.5rem; border: 1px solid #ddd; margin: 0.5rem 0; border-radius: 4px;" onclick="selectImage('${img}', '${type}')">
      <img src="${img}" style="max-width: 100%; height: 100px; object-fit: cover; border-radius: 4px; margin-bottom: 0.5rem;">
      <div style="font-size: 0.85rem; word-break: break-all;">${img}</div>
    </div>`,
    )
    .join("");

  const modal = `
    <div id="imageModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000;">
      <div style="background: white; border-radius: 8px; padding: 2rem; max-width: 600px; max-height: 80vh; overflow-y: auto; width: 90%;">
        <h3>Sélectionnez une image</h3>
        <div>${imageList}</div>
        <button class="btn btn-secondary" onclick="closeImageModal()" style="width: 100%; margin-top: 1rem;">Fermer</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modal);
}

function selectImage(imagePath, type) {
  const input =
    type === "project"
      ? document.getElementById("projectImage")
      : document.getElementById("portfolioImage");
  const preview =
    type === "project"
      ? document.getElementById("projectImagePreview")
      : document.getElementById("portfolioImagePreview");
  const selector =
    type === "project"
      ? document.getElementById("projectImageSelector")
      : document.getElementById("portfolioImageSelector");

  input.value = imagePath;
  preview.src = imagePath;
  preview.style.display = "block";
  selector.classList.add("selected");

  closeImageModal();
}

function closeImageModal() {
  const modal = document.getElementById("imageModal");
  if (modal) modal.remove();
}

// ============================================
// EXPORT/IMPORT
// ============================================
function exportProjects() {
  const dataStr = JSON.stringify(projects, null, 2);
  downloadJSON(dataStr, "projets.json");
}

function exportPortfolio() {
  const dataStr = JSON.stringify(portfolio, null, 2);
  downloadJSON(dataStr, "portfolio.json");
}

function downloadJSON(data, filename) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/json;charset=utf-8," + encodeURIComponent(data),
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  showSuccess(`✅ ${filename} téléchargé`);
}

function showProjectsImport() {
  document.getElementById("projectsImportInput").click();
}

function showPortfolioImport() {
  document.getElementById("portfolioImportInput").click();
}

function importProjects(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        projects = Array.isArray(data) ? data : [];
        saveToLocalStorage("projects", projects);
        renderProjectsList();
        showSuccess("✅ Projets importés avec succès");
      } catch (error) {
        showSuccess("❌ Erreur: JSON invalide", "error");
      }
    };
    reader.readAsText(file);
  }
}

function importPortfolio(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        portfolio = Array.isArray(data) ? data : [];
        saveToLocalStorage("portfolio", portfolio);
        renderPortfolioList();
        showSuccess("✅ Portfolio importé avec succès");
      } catch (error) {
        showSuccess("❌ Erreur: JSON invalide", "error");
      }
    };
    reader.readAsText(file);
  }
}

function loadProjectsToEditor() {
  document.getElementById("projectsJsonEditor").value = JSON.stringify(
    projects,
    null,
    2,
  );
  showSuccess("✅ Projets chargés dans l'éditeur");
}

function loadPortfolioToEditor() {
  document.getElementById("portfolioJsonEditor").value = JSON.stringify(
    portfolio,
    null,
    2,
  );
  showSuccess("✅ Portfolio chargé dans l'éditeur");
}

function saveProjectsJson() {
  try {
    const data = JSON.parse(
      document.getElementById("projectsJsonEditor").value,
    );
    projects = Array.isArray(data) ? data : [];
    saveToLocalStorage("projects", projects);
    renderProjectsList();
    showSuccess("✅ Projets mis à jour depuis l'éditeur");
  } catch (error) {
    showSuccess("❌ Erreur: JSON invalide", "error");
  }
}

function savePortfolioJson() {
  try {
    const data = JSON.parse(
      document.getElementById("portfolioJsonEditor").value,
    );
    portfolio = Array.isArray(data) ? data : [];
    saveToLocalStorage("portfolio", portfolio);
    renderPortfolioList();
    showSuccess("✅ Portfolio mis à jour depuis l'éditeur");
  } catch (error) {
    showSuccess("❌ Erreur: JSON invalide", "error");
  }
}

// ============================================
// SAVE TO FILES (API)
// ============================================

/**
 * Save projects to JSON file via API
 */
async function saveProjectsToFile() {
  try {
    const response = await fetch("http://localhost:3001/api/save-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dataType: "projects",
        items: projects,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      showSuccess(`✅ ${result.message}`);
      console.log("💾 Projets sauvegardés:", result);
    } else {
      const error = await response.json();
      showSuccess(`❌ Erreur: ${error.error}`, "error");
    }
  } catch (error) {
    showSuccess(
      `❌ Erreur de connexion au serveur API (http://localhost:3001)`,
      "error",
    );
    console.error("Erreur:", error);
  }
}

/**
 * Save portfolio to JSON file via API
 */
async function savePortfolioToFile() {
  try {
    const response = await fetch("http://localhost:3001/api/save-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dataType: "portfolio",
        items: portfolio,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      showSuccess(`✅ ${result.message}`);
      console.log("💾 Portfolio sauvegardé:", result);
    } else {
      const error = await response.json();
      showSuccess(`❌ Erreur: ${error.error}`, "error");
    }
  } catch (error) {
    showSuccess(
      `❌ Erreur de connexion au serveur API (http://localhost:3001)`,
      "error",
    );
    console.error("Erreur:", error);
  }
}

// ============================================
// UTILITIES
// ============================================
function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function showSuccess(message, type = "success") {
  const msgEl = document.getElementById("successMessage");
  msgEl.textContent = message;
  msgEl.classList.add("show");
  msgEl.style.background = type === "error" ? "#f8d7da" : "#d4edda";
  msgEl.style.color = type === "error" ? "#721c24" : "#155724";

  setTimeout(() => {
    msgEl.classList.remove("show");
  }, 3000);
}
