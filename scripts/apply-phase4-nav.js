/**
 * Aplica logo V2 y navegación Phase 4 a páginas HTML estáticas existentes.
 * No toca index/nosotros/sectores/contacto (ya actualizados).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');

const NAV_DESKTOP = `      <nav class="nav-desktop" aria-label="Navegación principal">
        <a href="index.html" class="nav-link">Inicio</a>
<div class="nav-item-dropdown">
          <a href="index.html#servicios" class="nav-link" aria-haspopup="true">Servicios ▾</a>
          <div class="dropdown-menu">
            <a href="auditoria.html" class="dropdown-link">Auditoría</a>
            <a href="impuestos.html" class="dropdown-link">Impuestos</a>
            <a href="consultoria.html" class="dropdown-link">Consultoría</a>
            <a href="cumplimiento.html" class="dropdown-link">Cumplimiento</a>
          </div>
        </div>
<a href="publicaciones.html" class="nav-link">Publicaciones</a>
</nav>`;

const MOBILE_LINKS = `    <a href="index.html" class="mobile-nav-link">Inicio</a>
<a href="auditoria.html" class="mobile-nav-link">Auditoría</a>
    <a href="impuestos.html" class="mobile-nav-link">Impuestos</a>
    <a href="consultoria.html" class="mobile-nav-link">Consultoría</a>
    <a href="cumplimiento.html" class="mobile-nav-link">Cumplimiento</a>
<a href="publicaciones.html" class="mobile-nav-link">Publicaciones</a>
`;

const targets = [
  'auditoria.html',
  'impuestos.html',
  'consultoria.html',
  'cumplimiento.html',
  'publicaciones.html',
  'privacidad.html',
  'terminos.html',
  '404.html'
];

function patch(html, file) {
  let out = html;
  out = out.replace(/assets\/images\/logo\/vl-logo\.svg/g, 'assets/images/logo/vl-logo-v2-dark.svg');
  out = out.replace(/assets\/images\/logo\/favicon\.svg/g, 'assets/images/logo/favicon-v2.svg');
  out = out.replace(/\.\.\/assets\/images\/logo\/vl-logo\.svg/g, '../assets/images/logo/vl-logo-v2-dark.svg');

  out = out.replace(/<nav class="nav-desktop"[\s\S]*?<\/nav>/, NAV_DESKTOP);

  // Mark active link for known pages
  const activeMap = {
    'publicaciones.html': 'Publicaciones',
    'auditoria.html': null,
    'impuestos.html': null,
    'consultoria.html': null,
    'cumplimiento.html': null
  };
  if (file === 'publicaciones.html') {
    out = out.replace('>Publicaciones</a>', ' class="nav-link active">Publicaciones</a>'.replace(' class="nav-link active"', ''));
    out = out.replace('<a href="publicaciones.html" class="nav-link">Publicaciones</a>', '<a href="publicaciones.html" class="nav-link active">Publicaciones</a>');
  }

  // Replace mobile drawer links block (between aside open and first CTA/div or end)
  out = out.replace(
    /(<aside[^>]*class="mobile-nav-drawer"[^>]*>)([\s\S]*?)(<\/aside>)/,
    (m, open, inner, close) => {
      const cta = inner.match(/<div style="margin-top:[\s\S]*?<\/div>/);
      const logo = inner.match(/<div style="margin-bottom:[\s\S]*?<\/div>/);
      return `${open}\n${logo ? logo[0] + '\n' : ''}${MOBILE_LINKS}\n${cta ? cta[0] : '<div style="margin-top: 2rem;"><a href="#" class="btn btn-gold" data-open-modal="agenda-modal" style="width: 100%;">Agenda una consulta</a></div>'}\n  ${close}`;
    }
  );

  // CTA buttons that pointed to # modal → contacto
  out = out.replace(/href="#"[^>]*data-open-modal="agenda-modal"/g, 'href="contacto.html"');
  out = out.replace(/data-open-modal="agenda-modal"/g, '');

  // Footer quick links enrichment if only Inicio + Actualidad
  out = out.replace(
    /(<div class="footer-links">\s*)<a href="index\.html" class="footer-link">Inicio<\/a>\s*<a href="publicaciones\.html" class="footer-link">Actualidad<\/a>/,
    `$1<a href="index.html" class="footer-link">Inicio</a>
<a href="publicaciones.html" class="footer-link">Publicaciones</a>
`
  );

  out = out.replace(/>Actualidad</g, '>Publicaciones<');
  out = out.replace(/>Actualidad y Conocimiento</g, '>Publicaciones<');

  return out;
}

for (const file of targets) {
  const fp = path.join(publicDir, file);
  if (!fs.existsSync(fp)) {
    console.log('skip missing', file);
    continue;
  }
  const html = fs.readFileSync(fp, 'utf8');
  fs.writeFileSync(fp, patch(html, file), 'utf8');
  console.log('✓', file);
}

console.log('Phase 4 nav/logo patch complete');
