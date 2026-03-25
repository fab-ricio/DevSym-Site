// API base URLs
const SERVICES_API = '/api/services';
const PROJETS_API = '/api/projets';

// DOM elements - will be initialized after DOM loads
let servicesContainer, serviceForm, serviceId, serviceTitle, serviceLead, serviceDescription;
let submitBtn, cancelBtn, serviceFormTitle;
let projetsContainer, projetForm, projetId, projetTitle, projetLead, projetType, projetYear;
let projetDescription, projetContext, projetImage;
let projetSubmitBtn, projetCancelBtn, projetFormTitle;
let tabButtons;

// Initialize all DOM elements and event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements for Services
    servicesContainer = document.getElementById('services-container');
    serviceForm = document.getElementById('service-form');
    serviceId = document.getElementById('service-id');
    serviceTitle = document.getElementById('service-title');
    serviceLead = document.getElementById('service-lead');
    serviceDescription = document.getElementById('service-description');
    submitBtn = document.getElementById('submit-btn');
    cancelBtn = document.getElementById('cancel-btn');
    serviceFormTitle = document.getElementById('service-form-title');

    // Get DOM elements for Projects
    projetsContainer = document.getElementById('projets-container');
    projetForm = document.getElementById('projet-form');
    projetId = document.getElementById('projet-id');
    projetTitle = document.getElementById('projet-title');
    projetLead = document.getElementById('projet-lead');
    projetType = document.getElementById('projet-type');
    projetYear = document.getElementById('projet-year');
    projetDescription = document.getElementById('projet-description');
    projetContext = document.getElementById('projet-context');
    projetImage = document.getElementById('projet-image');
    projetSubmitBtn = document.getElementById('projet-submit-btn');
    projetCancelBtn = document.getElementById('projet-cancel-btn');
    projetFormTitle = document.getElementById('projet-form-title');

    // Get tab buttons
    tabButtons = document.querySelectorAll('.tab-btn');

    // Setup event listeners
    if (serviceForm) serviceForm.addEventListener('submit', handleServiceFormSubmit);
    if (cancelBtn) cancelBtn.addEventListener('click', resetServiceForm);
    if (projetForm) projetForm.addEventListener('submit', handleProjetFormSubmit);
    if (projetCancelBtn) projetCancelBtn.addEventListener('click', resetProjetForm);

    // Initialize tabs and load data
    setupTabs();
    loadServices();
    loadProjets();
});

// ==================== TABS ====================
function setupTabs() {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            // Show selected tab
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// ==================== SERVICES ====================
async function loadServices() {
    try {
        const response = await fetch(SERVICES_API);
        if (!response.ok) {
            throw new Error('Failed to load services');
        }
        const services = await response.json();
        displayServices(services);
    } catch (error) {
        console.error('Error loading services:', error);
        servicesContainer.innerHTML = '<p>Erreur lors du chargement des services.</p>';
    }
}

function displayServices(services) {
    servicesContainer.innerHTML = '';

    if (services.length === 0) {
        servicesContainer.innerHTML = '<p>Aucun service trouvé.</p>';
        return;
    }

    services.forEach(service => {
        const serviceItem = document.createElement('div');
        serviceItem.className = 'service-item';
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
        description: serviceDescription.value.trim()
    };

    const id = serviceId.value;

    try {
        let response;
        if (id) {
            // Update existing service
            response = await fetch(`${SERVICES_API}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(serviceData)
            });
        } else {
            // Add new service
            response = await fetch(SERVICES_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(serviceData)
            });
        }

        if (!response.ok) {
            throw new Error('Failed to save service');
        }

        // Reset form and reload services
        resetServiceForm();
        loadServices();
    } catch (error) {
        console.error('Error saving service:', error);
        alert('Erreur lors de la sauvegarde du service.');
    }
}

// Edit service (populate form)
function editService(id) {
    fetch(SERVICES_API)
        .then(response => response.json())
        .then(services => {
            const service = services.find(s => s.id === id);
            if (service) {
                serviceId.value = service.id;
                serviceTitle.value = service.title;
                serviceLead.value = service.lead;
                serviceDescription.value = service.description;
                serviceFormTitle.textContent = 'Modifier le Service';
                submitBtn.textContent = 'Mettre à jour';
            }
        })
        .catch(error => {
            console.error('Error fetching service for edit:', error);
        });
}

// Delete service
async function deleteService(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
        return;
    }

    try {
        const response = await fetch(`${SERVICES_API}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete service');
        }

        // Reload services
        loadServices();
    } catch (error) {
        console.error('Error deleting service:', error);
        alert('Erreur lors de la suppression du service.');
    }
}

// Reset service form to add new service
function resetServiceForm() {
    serviceId.value = '';
    serviceTitle.value = '';
    serviceLead.value = '';
    serviceDescription.value = '';
    serviceFormTitle.textContent = 'Ajouter un Nouveau Service';
    submitBtn.textContent = 'Ajouter';
}

// ==================== PROJETS ====================
async function loadProjets() {
    try {
        const response = await fetch(PROJETS_API);
        if (!response.ok) {
            throw new Error('Failed to load projects');
        }
        const projets = await response.json();
        displayProjets(projets);
    } catch (error) {
        console.error('Error loading projects:', error);
        projetsContainer.innerHTML = '<p>Erreur lors du chargement des projets.</p>';
    }
}

function displayProjets(projets) {
    projetsContainer.innerHTML = '';

    if (projets.length === 0) {
        projetsContainer.innerHTML = '<p>Aucun projet trouvé.</p>';
        return;
    }

    projets.forEach(projet => {
        const projetItem = document.createElement('div');
        projetItem.className = 'service-item';
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
        image: projetImage.value.trim()
    };

    const id = projetId.value;

    try {
        let response;
        if (id) {
            // Update existing project
            response = await fetch(`${PROJETS_API}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(projetData)
            });
        } else {
            // Add new project
            response = await fetch(PROJETS_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(projetData)
            });
        }

        if (!response.ok) {
            throw new Error('Failed to save project');
        }

        // Reset form and reload projects
        resetProjetForm();
        loadProjets();
    } catch (error) {
        console.error('Error saving project:', error);
        alert('Erreur lors de la sauvegarde du projet.');
    }
}

// Edit projet (populate form)
function editProjet(id) {
    fetch(PROJETS_API)
        .then(response => response.json())
        .then(projets => {
            const projet = projets.find(p => p.id === id);
            if (projet) {
                projetId.value = projet.id;
                projetTitle.value = projet.title;
                projetLead.value = projet.lead;
                projetType.value = projet.type;
                projetYear.value = projet.year;
                projetDescription.value = projet.description;
                projetContext.value = projet.context;
                projetImage.value = projet.image;
                projetFormTitle.textContent = 'Modifier le Projet';
                projetSubmitBtn.textContent = 'Mettre à jour';
            }
        })
        .catch(error => {
            console.error('Error fetching project for edit:', error);
        });
}

// Delete projet
async function deleteProjet(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
        return;
    }

    try {
        const response = await fetch(`${PROJETS_API}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete project');
        }

        // Reload projects
        loadProjets();
    } catch (error) {
        console.error('Error deleting project:', error);
        alert('Erreur lors de la suppression du projet.');
    }
}

// Reset projet form to add new project
function resetProjetForm() {
    projetId.value = '';
    projetTitle.value = '';
    projetLead.value = '';
    projetType.value = '';
    projetYear.value = '';
    projetDescription.value = '';
    projetContext.value = '';
    projetImage.value = '';
    projetFormTitle.textContent = 'Ajouter un Nouveau Projet';
    projetSubmitBtn.textContent = 'Ajouter';
}