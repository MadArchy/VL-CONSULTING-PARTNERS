/**
 * VL CONSULTING PARTNERS - Módulo WhatsApp
 * Botón flotante configurable, estrictamente visible sólo cuando
 * exista un número oficial confirmado y habilitado en la configuración.
 */

export function initWhatsApp(config) {
  const whatsappConfig = config?.contact?.whatsapp;

  // Regla estricta: No mostrar si no está habilitado O si no hay número confirmado
  if (!whatsappConfig || !whatsappConfig.enabled || !whatsappConfig.number || whatsappConfig.number.trim() === '') {
    // Si existe algún botón residual en el DOM, se retira por seguridad
    const existing = document.querySelector('.whatsapp-floating');
    if (existing) existing.remove();
    return;
  }

  // Si existe confirmación oficial:
  const cleanNumber = whatsappConfig.number.replace(/\D/g, '');
  const encodedMsg = encodeURIComponent(whatsappConfig.defaultMessage || 'Hola, deseo agendar una consulta con VL Consulting Partners.');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMsg}`;

  const btn = document.createElement('a');
  btn.href = whatsappUrl;
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.className = 'whatsapp-floating';
  btn.setAttribute('aria-label', 'Contactar por WhatsApp a VL Consulting Partners');
  btn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
  `;

  document.body.appendChild(btn);
}
