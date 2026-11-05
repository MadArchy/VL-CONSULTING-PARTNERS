/**
 * VL CONSULTING PARTNERS - Módulo de Animaciones Scroll-Reveal
 * Respeta rigurosamente prefers-reduced-motion
 */

export function initAnimations() {
  // Asegurar que cualquier elemento en el hero sea visible de inmediato
  document.querySelectorAll('.hero-content, .hero-content.fade-in-element').forEach(el => {
    el.classList.add('is-visible');
  });

  // Si el usuario prefiere movimiento reducido, salir marcando todo visible
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('.fade-in-element').forEach(el => el.classList.add('is-visible'));
    return;
  }

  const elements = document.querySelectorAll('.fade-in-element:not(.hero-content)');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}
