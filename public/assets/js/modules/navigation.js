/**
 * VL CONSULTING PARTNERS - Módulo de Navegación
 * Header interactivo, Drawer móvil accesible y Scroll suave
 */

export function initNavigation() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-menu-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileBackdrop = document.querySelector('.mobile-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // 1. Header pegajoso con clase reducida al scrollear
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Control del Drawer Móvil
  function openMobileNav() {
    if (!mobileDrawer || !mobileToggle) return;
    mobileToggle.classList.add('is-active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('is-open');
    if (mobileBackdrop) mobileBackdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    // Foco en el primer enlace móvil
    const firstLink = mobileDrawer.querySelector('a, button');
    if (firstLink) firstLink.focus();
  }

  function closeMobileNav() {
    if (!mobileDrawer || !mobileToggle) return;
    mobileToggle.classList.remove('is-active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('is-open');
    if (mobileBackdrop) mobileBackdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer?.classList.contains('is-open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMobileNav);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // Cerrar con Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('is-open')) {
      closeMobileNav();
      mobileToggle?.focus();
    }
  });

  // 3. Resaltar enlace activo según la URL
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const allNavLinks = document.querySelectorAll('.nav-link, .dropdown-link, .mobile-nav-link');
  
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPath = href.split('/').pop();
    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
    }
  });
}
