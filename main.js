document.addEventListener("DOMContentLoaded", function () {
  // Handle all nav-toggle buttons (there may be one per page)
  document.querySelectorAll(".nav-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var nav = document.getElementById(btn.getAttribute("aria-controls"));
      var expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      if (nav) nav.classList.toggle("nav--open");
    });
  });

  // Close mobile nav when clicking a link inside it
  document.querySelectorAll("#primary-navigation a").forEach(function (link) {
    link.addEventListener("click", function () {
      var nav = link.closest(".nav");
      if (nav && nav.classList.contains("nav--open")) {
        nav.classList.remove("nav--open");
        var toggle = document.querySelector(
          '.nav-toggle[aria-controls="' + nav.id + '"]'
        );
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  // Close nav on outside click (mobile)
  document.addEventListener("click", function (e) {
    var nav = document.getElementById("primary-navigation");
    var toggle = document.querySelector(
      '.nav-toggle[aria-controls="primary-navigation"]'
    );
    if (!nav || !toggle) return;
    if (
      nav.classList.contains("nav--open") &&
      !nav.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      nav.classList.remove("nav--open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  /* Service modal handling */
  var modal = document.getElementById("service-modal");
  if (modal) {
    var modalTitle = modal.querySelector("#service-modal-title");
    var modalLead = modal.querySelector(".modal-lead");
    var modalBody = modal.querySelector(".modal-body");
    var closeBtn = modal.querySelector(".modal-close");
    var lastFocus = null;

    function openModal(data) {
      lastFocus = document.activeElement;
      modalTitle.textContent = data.title || "";
      modalLead.textContent = data.lead || "";
      modalBody.innerHTML = data.description || "";
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      closeBtn.focus();
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    document.querySelectorAll('.card[role="button"]').forEach(function (card) {
      card.addEventListener("click", function () {
        openModal({
          title: card.dataset.title,
          lead: card.dataset.lead,
          description: card.dataset.description,
        });
      });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });
    });

    closeBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.classList.contains("modal-backdrop"))
        closeModal();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    });
  }
  /* Light parallax for home hero (mouse movement) */
  (function () {
    var hero = document.querySelector(".page-hero.home-hero");
    if (!hero) return;
    var decor = hero.querySelector(".hero-decor");
    var inner = hero.querySelector(".hero-inner");
    var prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;
    var raf = null;
    var tx = 0,
      ty = 0;
    function onMove(e) {
      var rect = hero.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      tx = x * 12;
      ty = y * 10;
      if (!raf) raf = requestAnimationFrame(update);
    }
    function update() {
      raf = null;
      if (decor)
        decor.style.transform =
          "translate(" + tx + "px, " + ty + "px) rotate(" + tx * 0.06 + "deg)";
      if (inner)
        inner.style.transform =
          "translate(" + tx * 0.18 + "px, " + ty * 0.12 + "px)";
    }
    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", function () {
      if (decor) decor.style.transform = "";
      if (inner) inner.style.transform = "";
    });
  })();
});
