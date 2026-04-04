document.addEventListener("DOMContentLoaded", function () {
  // page transition on nav link click
  document.querySelectorAll(".nav a").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.href;
      if (href && href !== window.location.href) {
        e.preventDefault();
        document.body.classList.add("fade-out");
        setTimeout(() => {
          window.location = href;
        }, 300);
      }
    });
  });

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
          '.nav-toggle[aria-controls="' + nav.id + '"]',
        );
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  // Close nav on outside click (mobile)
  document.addEventListener("click", function (e) {
    var nav = document.getElementById("primary-navigation");
    var toggle = document.querySelector(
      '.nav-toggle[aria-controls="primary-navigation"]',
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

  /* Service modal handling - VERSION CORRIGÉE */
  const serviceModal = document.getElementById("service-modal");
  let serviceLastFocus = null;

  function openServiceModal(data) {
    if (!serviceModal) return;
    const modalTitle = serviceModal.querySelector("#service-modal-title");
    const modalLead = serviceModal.querySelector(".modal-lead");
    const modalBody = serviceModal.querySelector(".modal-body");
    const contactBtn = serviceModal.querySelector("#service-contact-btn");

    serviceLastFocus = document.activeElement;
    modalTitle.textContent = data.title || "";
    modalLead.textContent = data.lead || "";

    if (data.description && data.description.includes("§")) {
      const items = data.description.split("§");
      let html = "<ul>";
      items.forEach((item) => {
        if (item.trim() !== "") {
          html += "<li>" + item.trim() + "</li>";
        }
      });
      html += "</ul>";
      modalBody.innerHTML = html;
    } else {
      modalBody.innerHTML = data.description || "";
    }

    if (contactBtn && data.title) {
      contactBtn.href =
        "contact.html?service=" + encodeURIComponent(data.title);
    }

    serviceModal.classList.add("open");
    serviceModal.setAttribute("aria-hidden", "false");
    serviceModal.querySelector(".modal-close").focus();
    document.body.style.overflow = "hidden";
  }

  let serviceModalEventsInitialized = false;

  function closeServiceModal() {
    if (!serviceModal) return;
    serviceModal.classList.remove("open");
    serviceModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (serviceLastFocus && serviceLastFocus.focus) serviceLastFocus.focus();
  }

  function initializeServiceCards() {
    if (!serviceModal) return;
    const closeBtn = serviceModal.querySelector(".modal-close");
    const cards = document.querySelectorAll('.card[role="button"]');

    cards.forEach((card) => {
      card.removeEventListener("click", card._serviceClick);
      card.removeEventListener("keydown", card._serviceKeydown);

      card._serviceClick = () =>
        openServiceModal({
          title: card.dataset.title,
          lead: card.dataset.lead,
          description: card.dataset.description,
        });
      card._serviceKeydown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card._serviceClick();
        }
      };

      card.addEventListener("click", card._serviceClick);
      card.addEventListener("keydown", card._serviceKeydown);
      card.tabIndex = 0;
    });

    if (closeBtn) {
      closeBtn.removeEventListener("click", closeServiceModal);
      closeBtn.addEventListener("click", closeServiceModal);
    }

    if (!serviceModalEventsInitialized) {
      serviceModal.addEventListener("click", function (e) {
        if (
          e.target === serviceModal ||
          e.target.classList.contains("modal-backdrop")
        )
          closeServiceModal();
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && serviceModal.classList.contains("open"))
          closeServiceModal();
      });
      serviceModalEventsInitialized = true;
    }
  }

  if (serviceModal) {
    initializeServiceCards();
    window.addEventListener("dynamic-content-updated", initializeServiceCards);
  }

  /* Projects interactive: filters, lazy-load, pagination, modal */
  (function projectsInteractive() {
    const section = document.getElementById("missions");
    if (!section) return;
    const pageSize = 6;
    let currentLimit = pageSize;
    let cards = [];
    const loadMoreBtn = document.getElementById("load-more");
    const projectModal = document.getElementById("project-modal");
    const titleEl = projectModal?.querySelector("#modal-title");
    const leadEl = projectModal?.querySelector("#modal-lead");
    const bodyEl = projectModal?.querySelector("#modal-body");
    const galleryEl = projectModal?.querySelector("#modal-gallery");
    const closeProjectBtn = projectModal?.querySelector(".modal-close");
    let lastFocus = null;

    function applyFiltersAndPagination() {
      const type = (document.getElementById("filter-type") || {}).value || "";
      const year = (document.getElementById("filter-year") || {}).value || "";
      let shown = 0;
      cards.forEach((card) => {
        const matchesType = !type || card.dataset.type === type;
        const matchesYear = !year || card.dataset.year === year;
        if (matchesType && matchesYear && shown < currentLimit) {
          card.style.display = "";
          shown++;
        } else {
          card.style.display = "none";
        }
      });
      if (loadMoreBtn) {
        const remaining =
          cards.filter((c) => {
            const matchesType = !type || c.dataset.type === type;
            const matchesYear = !year || c.dataset.year === year;
            return matchesType && matchesYear;
          }).length - shown;
        loadMoreBtn.style.display = remaining > 0 ? "" : "none";
      }
    }

    function openProject(card) {
      if (
        !projectModal ||
        !titleEl ||
        !leadEl ||
        !bodyEl ||
        !galleryEl ||
        !closeProjectBtn
      )
        return;
      lastFocus = document.activeElement;
      titleEl.textContent = card.dataset.title || "";
      leadEl.textContent = card.dataset.lead || "";
      bodyEl.innerHTML =
        card.dataset.description || card.querySelector("p")?.innerHTML || "";
      galleryEl.innerHTML = "";
      const imgs = (card.dataset.images || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      imgs.forEach((src) => {
        const i = document.createElement("img");
        i.src = src;
        i.alt = "";
        galleryEl.appendChild(i);
      });
      projectModal.classList.add("open");
      projectModal.setAttribute("aria-hidden", "false");
      closeProjectBtn.focus();
      document.body.style.overflow = "hidden";
    }

    function closeProject() {
      if (!projectModal) return;
      projectModal.classList.remove("open");
      projectModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    function attachProjectCardEvents() {
      cards.forEach((card) => {
        card.removeEventListener("click", card._projectClick);
        card.removeEventListener("keydown", card._projectKeydown);

        card._projectClick = () => openProject(card);
        card._projectKeydown = (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            card._projectClick();
          }
        };

        card.addEventListener("click", card._projectClick);
        card.addEventListener("keydown", card._projectKeydown);
        card.tabIndex = 0;
      });
    }

    function refreshProjectCards() {
      cards = Array.from(section.querySelectorAll(".mission-card"));
      attachProjectCardEvents();
      applyFiltersAndPagination();
      const lazyImgs = section.querySelectorAll("img.lazy");
      if ("IntersectionObserver" in window && lazyImgs.length) {
        const io = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                  img.src = img.dataset.src;
                  img.removeAttribute("data-src");
                  img.classList.remove("lazy");
                }
                obs.unobserve(img);
              }
            });
          },
          { rootMargin: "200px 0px" },
        );
        lazyImgs.forEach((i) => io.observe(i));
      }
    }

    const filters = ["filter-type", "filter-year"];
    filters.forEach((id) => {
      const el = document.getElementById(id);
      if (el)
        el.addEventListener("change", () => {
          currentLimit = pageSize;
          applyFiltersAndPagination();
        });
    });
    const resetBtn = document.getElementById("reset-filters");
    if (resetBtn)
      resetBtn.addEventListener("click", () => {
        if (document.getElementById("filter-type"))
          document.getElementById("filter-type").value = "";
        if (document.getElementById("filter-year"))
          document.getElementById("filter-year").value = "";
        currentLimit = pageSize;
        applyFiltersAndPagination();
      });

    if (loadMoreBtn)
      loadMoreBtn.addEventListener("click", () => {
        currentLimit += pageSize;
        applyFiltersAndPagination();
      });

    if (projectModal) {
      if (closeProjectBtn)
        closeProjectBtn.addEventListener("click", closeProject);
      projectModal.addEventListener("click", (e) => {
        if (e.target === projectModal) closeProject();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && projectModal.classList.contains("open"))
          closeProject();
      });
    }

    refreshProjectCards();
    window.addEventListener("dynamic-content-updated", refreshProjectCards);
  })();

  /* Light parallax for home hero (mouse movement) */
  (function () {
    var hero = document.querySelector(".page-hero.home-hero");
    if (!hero) return;
    var decor = hero.querySelector(".hero-decor");
    var inner = hero.querySelector(".hero-inner");
    var prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
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

  /* --- DYNAMIC PARTNERS INJECTION --- */
  (function dynamicPartners() {
    const container = document.getElementById("partners-container");
    if (!container) return;

    // Modifie cette liste avec tes vrais chemins d'images
    const partners = [
      { name: "Partenaire 1", logo: "images/Asticude.png" },
      { name: "Partenaire 2", logo: "images/alcs.png" },
      { name: "Partenaire 3", logo: "images/ddm.png" },
      { name: "Partenaire 4", logo: "images/ims.png" },
      { name: "Partenaire 5", logo: "images/fundación-sevilla-acoge.png" },
      { name: "Partenaire 6", logo: "images/mzc.png" },
      { name: "Partenaire 7", logo: "images/oim.png" },
      { name: "Partenaire 8", logo: "images/ulcg-africa.png" },
      { name: "Partenaire 9", logo: "images/innovate.png" },
      { name: "Partenaire 10", logo: "images/innovate.png" },
    ];

    container.innerHTML = partners
      .map(
        (partner) => `
      <div class="partner-item">
        <img src="${partner.logo}" alt="Logo ${partner.name}" title="${partner.name}">
      </div>
    `,
      )
      .join("");
  })();
});
