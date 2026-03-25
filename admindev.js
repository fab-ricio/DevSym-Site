// API base URL
const API_BASE = '/api/services';

// DOM elements
const servicesContainer = document.getElementById('services-container');
const serviceForm = document.getElementById('service-form');
const serviceId = document.getElementById('service-id');
const serviceTitle = document.getElementById('service-title');
const serviceLead = document.getElementById('service-lead');
const serviceDescription = document.getElementById('service-description');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');

// Load services when page loads
document.addEventListener('DOMContentLoaded', loadServices);

// Form submit handler
serviceForm.addEventListener('submit', handleFormSubmit);

// Cancel button handler
cancelBtn.addEventListener('click', resetForm);

// Load all services from API
async function loadServices() {
    try {
        const response = await fetch(API_BASE);
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

// Display services in the list
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

// Handle form submission (add or update)
async function handleFormSubmit(event) {
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
            response = await fetch(`${API_BASE}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(serviceData)
            });
        } else {
            // Add new service
            response = await fetch(API_BASE, {
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
        resetForm();
        loadServices();
    } catch (error) {
        console.error('Error saving service:', error);
        alert('Erreur lors de la sauvegarde du service.');
    }
}

// Edit service (populate form)
function editService(id) {
    // Find service data (we need to fetch all and find by id)
    fetch(API_BASE)
        .then(response => response.json())
        .then(services => {
            const service = services.find(s => s.id === id);
            if (service) {
                serviceId.value = service.id;
                serviceTitle.value = service.title;
                serviceLead.value = service.lead;
                serviceDescription.value = service.description;
                formTitle.textContent = 'Modifier le Service';
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
        const response = await fetch(`${API_BASE}/${id}`, {
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

// Reset form to add new service
function resetForm() {
    serviceId.value = '';
    serviceTitle.value = '';
    serviceLead.value = '';
    serviceDescription.value = '';
    formTitle.textContent = 'Ajouter un Nouveau Service';
    submitBtn.textContent = 'Ajouter';
}