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
  var modal = document.getElementById("service-modal");
  if (modal) {
    var modalTitle = modal.querySelector("#service-modal-title");
    var modalLead = modal.querySelector(".modal-lead");
    var modalBody = modal.querySelector(".modal-body");
    var closeBtn = modal.querySelector(".modal-close");
    var contactBtn = modal.querySelector("#service-contact-btn");
    var lastFocus = null;
    var currentService = null;

    function openModal(data) {
      lastFocus = document.activeElement;
      modalTitle.textContent = data.title || "";
      modalLead.textContent = data.lead || "";

      if (data.description && data.description.includes("§")) {
        var items = data.description.split("§");
        var html = "<ul>";
        items.forEach(function (item) {
          if (item.trim() !== "") {
            html += "<li>" + item.trim() + "</li>";
          }
        });
        html += "</ul>";
        modalBody.innerHTML = html;
      } else {
        modalBody.innerHTML = data.description || "";
      }

      currentService = data.title;

      if (contactBtn && currentService) {
        contactBtn.href =
          "contact.html?service=" + encodeURIComponent(currentService);
      }

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

  /* Projects interactive: filters, lazy-load, pagination, modal */
  (function projectsInteractive() {
    const section = document.getElementById("missions");
    if (!section) return;
    const cards = Array.from(section.querySelectorAll(".mission-card"));
    const pageSize = 6;
    let currentLimit = pageSize;
    const loadMoreBtn = document.getElementById("load-more");

    function applyFiltersAndPagination() {
      const type = (document.getElementById("filter-type") || {}).value || "";
      const year = (document.getElementById("filter-year") || {}).value || "";
      const q = ((document.getElementById("filter-search") || {}).value || "")
        .trim()
        .toLowerCase();
      let shown = 0;
      cards.forEach((card) => {
        const matchesType = !type || card.dataset.type === type;
        const matchesYear = !year || card.dataset.year === year;
        const text = (card.textContent || "").toLowerCase();
        const matchesSearch = !q || text.indexOf(q) !== -1;
        if (
          matchesType &&
          matchesYear &&
          matchesSearch &&
          shown < currentLimit
        ) {
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
            const text = (c.textContent || "").toLowerCase();
            const matchesSearch = !q || text.indexOf(q) !== -1;
            return matchesType && matchesYear && matchesSearch;
          }).length - shown;
        loadMoreBtn.style.display = remaining > 0 ? "" : "none";
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
    const searchEl = document.getElementById("filter-search");
    if (searchEl)
      searchEl.addEventListener("input", () => {
        currentLimit = pageSize;
        applyFiltersAndPagination();
      });
    const resetBtn = document.getElementById("reset-filters");
    if (resetBtn)
      resetBtn.addEventListener("click", () => {
        if (document.getElementById("filter-type"))
          document.getElementById("filter-type").value = "";
        if (document.getElementById("filter-year"))
          document.getElementById("filter-year").value = "";
        if (document.getElementById("filter-search"))
          document.getElementById("filter-search").value = "";
        currentLimit = pageSize;
        applyFiltersAndPagination();
      });

    if (loadMoreBtn)
      loadMoreBtn.addEventListener("click", () => {
        currentLimit += pageSize;
        applyFiltersAndPagination();
      });

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

    const projectModal = document.getElementById("project-modal");
    if (projectModal) {
      const titleEl = projectModal.querySelector("#modal-title");
      const leadEl = projectModal.querySelector("#modal-lead");
      const bodyEl = projectModal.querySelector("#modal-body");
      const galleryEl = projectModal.querySelector("#modal-gallery");
      const closeBtn = projectModal.querySelector(".modal-close");
      let lastFocus = null;
      function openProject(card) {
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
        closeBtn.focus();
        document.body.style.overflow = "hidden";
      }
      function closeProject() {
        projectModal.classList.remove("open");
        projectModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        if (lastFocus && lastFocus.focus) lastFocus.focus();
      }
      closeBtn.addEventListener("click", closeProject);
      projectModal.addEventListener("click", (e) => {
        if (e.target === projectModal) closeProject();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && projectModal.classList.contains("open"))
          closeProject();
      });
      cards.forEach((card) => {
        card.addEventListener("click", () => openProject(card));
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openProject(card);
          }
        });
        card.tabIndex = 0;
      });
    }
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
      { name: "Partenaire 6", logo: "images/ideia.png" },
      { name: "Partenaire 7", logo: "images/innovate.png" },
      { name: "Partenaire 8", logo: "images/innovate.png" },
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
