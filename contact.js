// ============================================
// EmailJS Configuration
// ============================================
// Les clés sont chargées depuis config.js (non versionnée pour la sécurité)
// Voir config.example.js pour les instructions

const EMAILJS_SERVICE_ID =
  window.EMAILJS_CONFIG?.SERVICE_ID || "service_84ttemr";
const EMAILJS_PUBLIC_KEY =
  window.EMAILJS_CONFIG?.PUBLIC_KEY || "uMmHH5kV5jwu2OilT";
const EMAILJS_TEMPLATE_ID =
  window.EMAILJS_CONFIG?.TEMPLATE_ID || "template_24gp5h9";
const EMAILJS_TO_EMAIL =
  window.EMAILJS_CONFIG?.TO_EMAIL || "coopdevsym1@gmail.com";

// Initialiser EmailJS au chargement de la page
document.addEventListener("DOMContentLoaded", function () {
  emailjs.init(EMAILJS_PUBLIC_KEY);

  // Récupérer le formulaire et ajouter l'event listener
  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }
});

// ============================================
// Gestionnaire du formulaire
// ============================================
async function handleFormSubmit(e) {
  e.preventDefault();

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;

  try {
    // Changer le texte du bouton
    submitBtn.disabled = true;
    submitBtn.textContent = "Envoi en cours...";

    // Préparer les données
    const formData = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        from_name: document.getElementById("name").value,
        from_email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
        to_email: EMAILJS_TO_EMAIL,
      },
    };

    // Envoyer via EmailJS
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      formData.template_params,
      EMAILJS_PUBLIC_KEY,
    );

    // Succès
    submitBtn.textContent = "Message envoyé! ✓";
    submitBtn.style.backgroundColor = "#28a745";

    // Réinitialiser le formulaire
    setTimeout(() => {
      e.target.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.style.backgroundColor = "";
    }, 3000);

    // Afficher un message de confirmation
    showNotification(
      "Message envoyé avec succès! Nous vous répondrons sous 48h.",
      "success",
    );
  } catch (error) {
    console.error("Erreur d'envoi:", error);

    // Erreur
    submitBtn.textContent = "Erreur - Réessayez";
    submitBtn.style.backgroundColor = "#dc3545";

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.style.backgroundColor = "";
    }, 3000);

    showNotification(
      "Erreur lors de l'envoi. Vérifiez vos paramètres EmailJS.",
      "error",
    );
  }
}

// ============================================
// Notification visuelle
// ============================================
function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    font-weight: 500;
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
    background-color: ${type === "success" ? "#28a745" : "#dc3545"};
    color: white;
    max-width: 400px;
  `;

  notification.textContent = message;
  document.body.appendChild(notification);

  // Ajouter animation CSS
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  // Supprimer après 4 secondes
  setTimeout(() => {
    notification.remove();
  }, 4000);
}
