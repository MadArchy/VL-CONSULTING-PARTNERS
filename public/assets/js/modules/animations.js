/**
 * VL CONSULTING PARTNERS - Entradas al hacer scroll
 * Respeta prefers-reduced-motion
 */

export function initAnimations() {
  document.querySelectorAll('.hero-content').forEach((el) => {
    el.classList.add('is-visible');
  });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.fade-in-element').forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const elements = document.querySelectorAll('.fade-in-element:not(.hero-content)');
  if (!elements.length) return;

  const reveal = (el) => el.classList.add('is-visible');

  elements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.82 && rect.bottom > 40) reveal(el);
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
      threshold: 0.16,
      rootMargin: '0px 0px -8% 0px'
    }
  );

  elements.forEach((el) => {
    if (!el.classList.contains('is-visible')) observer.observe(el);
  });
}
