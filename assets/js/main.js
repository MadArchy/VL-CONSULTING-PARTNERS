/**
 * VL Consulting Partners — shared UI behavior
 * Keep interactive-only; content remains available without JS.
 */
(function () {
  "use strict";

  var header = document.querySelector("[data-site-header]");
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-site-nav]");
  var navLinks = nav ? nav.querySelectorAll("a") : [];

  function setNavOpen(isOpen) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    toggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  }

  function closeNav() {
    setNavOpen(false);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = !nav.classList.contains("is-open");
      setNavOpen(open);
      if (open) {
        var first = nav.querySelector("a");
        if (first) first.focus();
      }
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      var target = event.target;
      if (header && header.contains(target)) return;
      closeNav();
    });
  }

  // Mark current section for hash links on homepage
  if (document.body.dataset.page === "home") {
    var sectionIds = ["servicios", "nosotros", "sectores", "publicaciones", "contacto"];
    var observerSupported = "IntersectionObserver" in window;

    if (observerSupported) {
      var linkMap = {};
      sectionIds.forEach(function (id) {
        var link = document.querySelector('.site-nav__link[href="#' + id + '"]');
        if (link) linkMap[id] = link;
      });

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            Object.keys(linkMap).forEach(function (id) {
              linkMap[id].classList.toggle("is-active", id === entry.target.id);
            });
          });
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 }
      );

      sectionIds.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }
  }

  // Current year in footer
  var yearNodes = document.querySelectorAll("[data-year]");
  var year = String(new Date().getFullYear());
  yearNodes.forEach(function (node) {
    node.textContent = year;
  });
})();
