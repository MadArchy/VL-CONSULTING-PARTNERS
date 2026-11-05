/**
 * VL CONSULTING PARTNERS - Módulo Modal Accesible
 * Manejo de foco, teclado Escape y apertura universal
 */

export function initModal() {
  const modalTriggers = document.querySelectorAll('[data-open-modal="agenda-modal"]');
  const modal = document.getElementById('agenda-modal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close-btn');
  let lastActiveElement = null;

  function openModal() {
    lastActiveElement = document.activeElement;
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Foco en el primer campo del formulario
    const firstInput = modal.querySelector('input, select, textarea');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }

  function closeModal() {
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  }

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Cerrar al hacer clic en el overlay exterior
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Cerrar con Escape y atrapar tabulación
  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-active')) return;

    if (e.key === 'Escape') {
      closeModal();
    }

    if (e.key === 'Tab') {
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  });

  // Exportar funciones globales controladas si se requieren
  window.VL_Modal = { open: openModal, close: closeModal };
}
