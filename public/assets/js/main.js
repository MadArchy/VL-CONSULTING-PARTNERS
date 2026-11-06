/**
 * VL CONSULTING PARTNERS - Orquestador Principal ES Modules
 */

import { initNavigation } from './modules/navigation.js';
import { initModal } from './modules/modal.js';
import { initContactForms } from './modules/contact-form.js';
import { initWhatsApp } from './modules/whatsapp.js';
import { initAnimations } from './modules/animations.js';
import { initIntro } from './modules/intro.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Cargar configuración institucional centralizada si está disponible
  let siteConfig = window.VL_CONFIG || null;

  if (!siteConfig) {
    try {
      const response = await fetch('/content/site-config.json');
      if (response.ok) {
        siteConfig = await response.json();
        window.VL_CONFIG = siteConfig;
      }
    } catch (e) {
      // Fallback seguro silencioso si se abre directo con file://
      console.info('VL Consulting Partners: Configuración local en memoria activa.');
    }
  }

  // Inicializar componentes modulares
  initNavigation();
  initModal();
  initContactForms();
  initWhatsApp(siteConfig);
  initIntro();
  initAnimations();

  // Actualizar año dinámico en footer
  const currentYear = new Date().getFullYear();
  document.querySelectorAll('.current-year').forEach(el => {
    el.textContent = currentYear;
  });
});
