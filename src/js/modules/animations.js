/**
 * VL CONSULTING PARTNERS - Módulo de Animaciones Scroll-Reveal
 * Respeta rigurosamente prefers-reduced-motion
 */

export function initAnimations() {
  document.querySelectorAll('.hero-content, .hero-content.fade-in-element').forEach((el) => {
    el.classList.add('is-visible');
  });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('.fade-in-element').forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const elements = document.querySelectorAll('.fade-in-element:not(.hero-content)');
  if (!elements.length) return;

  const reveal = (el) => el.classList.add('is-visible');

  // Reveal inmediato de lo ya visible o cercano al viewport (capturas / SSR-like)
  elements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 1.35) reveal(el);
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reveal(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '80px 0px 80px 0px'
    }
  );

  elements.forEach((el) => {
    if (!el.classList.contains('is-visible')) observer.observe(el);
  });

  // Fallback: si el usuario no interactúa, revelar el resto tras idle
  window.setTimeout(() => {
    elements.forEach((el) => {
      if (!el.classList.contains('is-visible')) reveal(el);
    });
  }, 2500);
}
