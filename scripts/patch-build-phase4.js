import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const p = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'build.js');
let s = fs.readFileSync(p, 'utf8');

s = s.replaceAll('assets/images/logo/vl-logo.svg', 'assets/images/logo/vl-logo-v2-dark.svg');

const articleNav = `      <nav class="nav-desktop" aria-label="Navegación principal">
        <a href="../index.html" class="nav-link">Inicio</a>
<div class="nav-item-dropdown">
          <a href="../index.html#servicios" class="nav-link" aria-haspopup="true">Servicios ▾</a>
          <div class="dropdown-menu">
            <a href="../auditoria.html" class="dropdown-link">Auditoría Financiera y Procesos</a>
            <a href="../impuestos.html" class="dropdown-link">Planeación y Gestión de Impuestos</a>
            <a href="../consultoria.html" class="dropdown-link">Consultoría y Estrategia Empresarial</a>
            <a href="../cumplimiento.html" class="dropdown-link">Cumplimiento y Regulación</a>
          </div>
        </div>
<a href="../publicaciones.html" class="nav-link active">Publicaciones</a>
</nav>`;

const listingNav = `      <nav class="nav-desktop" aria-label="Navegación principal">
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
<a href="publicaciones.html" class="nav-link active">Publicaciones</a>
</nav>`;

// Replace first nav (article template with ../) then listing
let seen = 0;
s = s.replace(/<nav class="nav-desktop"[\s\S]*?<\/nav>/g, () => {
  seen += 1;
  return seen === 1 ? articleNav : listingNav;
});

s = s.replace(
  /<aside class="mobile-nav-drawer" aria-label="Menú móvil">[\s\S]*?<\/aside>/,
  `<aside class="mobile-nav-drawer" aria-label="Menú móvil">
    <a href="../index.html" class="mobile-nav-link">Inicio</a>
<a href="../auditoria.html" class="mobile-nav-link">Auditoría</a>
    <a href="../impuestos.html" class="mobile-nav-link">Impuestos</a>
    <a href="../consultoria.html" class="mobile-nav-link">Consultoría</a>
    <a href="../cumplimiento.html" class="mobile-nav-link">Cumplimiento</a>
<a href="../publicaciones.html" class="mobile-nav-link active">Publicaciones</a>
<div style="margin-top: 2rem;">
      <a href="#" class="btn btn-gold" data-open-modal="agenda-modal" style="width: 100%;">Agenda una consulta</a>
    </div>
  </aside>`
);

s = s.replace(
  /<aside class="mobile-nav-drawer" aria-label="Menú móvil">[\s\S]*?<\/aside>/,
  (m) => {
    if (m.includes('../index')) return m;
    return `<aside class="mobile-nav-drawer" aria-label="Menú móvil">
    <a href="index.html" class="mobile-nav-link">Inicio</a>
<a href="auditoria.html" class="mobile-nav-link">Auditoría</a>
    <a href="impuestos.html" class="mobile-nav-link">Impuestos</a>
    <a href="consultoria.html" class="mobile-nav-link">Consultoría</a>
    <a href="cumplimiento.html" class="mobile-nav-link">Cumplimiento</a>
<a href="publicaciones.html" class="mobile-nav-link active">Publicaciones</a>
<div style="margin-top: 2rem;">
      <a href="#" class="btn btn-gold" data-open-modal="agenda-modal" style="width: 100%;">Agenda una consulta</a>
    </div>
  </aside>`;
  }
);

s = s.replace(/href="#" class="btn btn-gold btn-sm" data-open-modal="agenda-modal"/g, 'href="#" class="btn btn-gold btn-sm" data-open-modal="agenda-modal"');
s = s.replace(/href="#" class="btn btn-gold" style="width: 100%;" data-open-modal="agenda-modal"/g, 'href="#" class="btn btn-gold" data-open-modal="agenda-modal" style="width: 100%;"');

// Fix article CTA that should use ../contacto — after previous replace may be wrong in article header
s = s.replace(
  /(<a href="\.\.\/index\.html" class="header-logo"[\s\S]*?<div style="display: flex; align-items: center; gap: 1rem;">\s*)<a href="contacto\.html"/,
  '$1<a href="../contacto.html"'
);

s = s.replace(
  /(<a href="publicaciones\.html" class="footer-link">)Actualidad(<\/a>)/g,
  '$1Publicaciones$2'
);
s = s.replace(
  /(<a href="\.\.\/publicaciones\.html" class="footer-link">)Actualidad(<\/a>)/g,
  '$1Publicaciones$2'
);

// Enrich footer quick links in listing template
s = s.replace(
  `<div class="footer-links">
          <a href="index.html" class="footer-link">Inicio</a>
          <a href="publicaciones.html" class="footer-link">Publicaciones</a>
        </div>`,
  `<div class="footer-links">
          <a href="index.html" class="footer-link">Inicio</a>
<a href="publicaciones.html" class="footer-link">Publicaciones</a>
</div>`
);

s = s.replace(
  `<div class="footer-links">
          <a href="../index.html" class="footer-link">Inicio</a>
          <a href="../publicaciones.html" class="footer-link">Publicaciones</a>
        </div>`,
  `<div class="footer-links">
          <a href="../index.html" class="footer-link">Inicio</a>
<a href="../publicaciones.html" class="footer-link">Publicaciones</a>
</div>`
);

s = s.replace('Actualidad y Conocimiento Empresarial', 'Publicaciones e insights');
s = s.replace('>Actualidad</a>', '>Publicaciones</a>');
s = s.replace('color: var(--color-gold-warm)', 'color: var(--vl-primary-light)');

fs.writeFileSync(p, s);
console.log('build.js patched for Phase 4');
