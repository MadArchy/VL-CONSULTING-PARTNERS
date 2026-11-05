/**
 * VL CONSULTING PARTNERS - Generador Estático Ligero (SSG)
 * Convierte Markdown a HTML estático puro, inyecta metadatos SEO,
 * genera el catálogo de publicaciones y produce sitemap.xml y robots.txt.
 * Cero dependencias pesadas de runtime, 100% estándar.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'node:child_process';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const contentDir = path.join(rootDir, 'content', 'publicaciones');
const configPath = path.join(rootDir, 'content', 'site-config.json');
const publicDir = path.join(rootDir, 'public');
const articlesOutDir = path.join(publicDir, 'publicaciones');

// Asegurar directorios
if (!fs.existsSync(articlesOutDir)) {
  fs.mkdirSync(articlesOutDir, { recursive: true });
}

// Cargar configuración de marca
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Parseador simple de Frontmatter (sin dependencias extra)
function parseFrontmatter(fileContent) {
  const match = fileContent.match(/^---([\s\S]*?)---([\s\S]*)$/);
  if (!match) return { meta: {}, body: fileContent };

  const frontmatterStr = match[1];
  const body = match[2].trim();
  const meta = {};

  frontmatterStr.split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.slice(0, colonIdx).trim();
      let val = line.slice(colonIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (val.startsWith('[') && val.endsWith(']')) {
        val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
      }
      meta[key] = val;
    }
  });

  return { meta, body };
}

// 1. Copiar assets CSS y JS de src a public
function syncAssets() {
  const srcCss = path.join(rootDir, 'src', 'css');
  const pubCss = path.join(publicDir, 'assets', 'css');
  const srcJs = path.join(rootDir, 'src', 'js');
  const pubJs = path.join(publicDir, 'assets', 'js');

  fs.cpSync(srcCss, pubCss, { recursive: true });
  fs.cpSync(srcJs, pubJs, { recursive: true });

  // Exponer configuración institucional al frontend (fetch /content/site-config.json)
  const pubContent = path.join(publicDir, 'content');
  fs.mkdirSync(pubContent, { recursive: true });
  fs.copyFileSync(configPath, path.join(pubContent, 'site-config.json'));

  // Mantener logos fuente SVG en public (si existen en docs/references no se sobrescribe el original JPG)
  console.log('✓ Assets CSS y JS sincronizados en public/assets/');
  console.log('✓ content/site-config.json expuesto en public/content/');

  // Sincronizar directorio dist para compatibilidad con plataformas de despliegue
  const distDir = path.join(rootDir, 'dist');
  fs.cpSync(publicDir, distDir, { recursive: true });
  console.log('✓ Directorio dist/ actualizado con salida estática universal');
}

// 2. Compilar artículos individuales
function buildArticles() {
  if (!fs.existsSync(contentDir)) {
    console.log('No hay directorio de contenido');
    return [];
  }

  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
  const articles = [];

  files.forEach(file => {
    const filePath = path.join(contentDir, file);
    const raw = fs.readFileSync(filePath, 'utf8');
    const { meta, body } = parseFrontmatter(raw);

    const slug = meta.slug || file.replace('.md', '');
    const htmlBody = marked.parse(body);
    const articleData = { ...meta, slug, htmlBody, fileName: file };
    articles.push(articleData);

    const articleHtml = generateArticleTemplate(articleData, config);
    const outPath = path.join(articlesOutDir, `${slug}.html`);
    fs.writeFileSync(outPath, articleHtml, 'utf8');
    console.log(`✓ Artículo generado: publicaciones/${slug}.html`);
  });

  articles.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  return articles;
}

// 3. Generar catálogo de publicaciones (publicaciones.html)
function buildPublicationCatalog(articles) {
  const catalogHtml = generateCatalogTemplate(articles, config);
  fs.writeFileSync(path.join(publicDir, 'publicaciones.html'), catalogHtml, 'utf8');
  console.log('✓ Catálogo de publicaciones generado: public/publicaciones.html');
}

// 4. Generar sitemap.xml
function buildSitemap(articles) {
  const baseUrl = config.brand.url;
  const staticPages = [
    '',
    'nosotros.html',
    'auditoria.html',
    'impuestos.html',
    'consultoria.html',
    'cumplimiento.html',
    'sectores.html',
    'publicaciones.html',
    'contacto.html',
    'privacidad.html',
    'terminos.html'
  ];

  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  staticPages.forEach(page => {
    const loc = page === '' ? `${baseUrl}/` : `${baseUrl}/${page}`;
    const priority = page === '' ? '1.0' : '0.8';
    xml += `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
  });

  articles.forEach(art => {
    xml += `  <url>\n    <loc>${baseUrl}/publicaciones/${art.slug}.html</loc>\n    <lastmod>${art.date || today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  });

  xml += `</urlset>`;
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf8');
  console.log('✓ Sitemap XML generado: public/sitemap.xml');
}

// 5. Generar robots.txt
function buildRobotsTxt() {
  const content = `# Robots.txt - VL Consulting Partners
User-agent: *
Allow: /

Sitemap: ${config.brand.url}/sitemap.xml
`;
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), content, 'utf8');
  console.log('✓ Robots.txt generado: public/robots.txt');
}

function generateArticleTemplate(article, config) {
  const fullUrl = `${config.brand.url}/publicaciones/${article.slug}.html`;
  const coverImgUrl = `${config.brand.url}/${article.coverImage || 'assets/images/about/about-skyscraper.jpg'}`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(article.title)} | ${config.brand.name}</title>
  <meta name="description" content="${escapeHtml(article.metaDescription || article.excerpt)}">
  <link rel="canonical" href="${fullUrl}">

  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(article.title)}">
  <meta property="og:description" content="${escapeHtml(article.excerpt)}">
  <meta property="og:url" content="${fullUrl}">
  <meta property="og:image" content="${coverImgUrl}">
  <meta property="og:site_name" content="${config.brand.name}">
  <meta property="article:published_time" content="${article.date}">
  <meta property="article:section" content="${escapeHtml(article.category || 'Consultoría')}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(article.title)}">
  <meta name="twitter:description" content="${escapeHtml(article.excerpt)}">
  <meta name="twitter:image" content="${coverImgUrl}">

  <link rel="icon" type="image/svg+xml" href="../assets/images/logo/favicon.svg">
  <link rel="alternate icon" href="../favicon.ico">
  <link rel="stylesheet" href="../assets/css/main.css">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${escapeHtml(article.title)}",
    "description": "${escapeHtml(article.excerpt)}",
    "image": "${coverImgUrl}",
    "datePublished": "${article.date}",
    "author": {
      "@type": "Organization",
      "name": "${escapeHtml(article.author || config.brand.name)}"
    },
    "publisher": {
      "@type": "Organization",
      "name": "${config.brand.name}",
      "logo": {
        "@type": "ImageObject",
        "url": "${config.brand.url}/assets/images/logo/vl-logo.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "${fullUrl}"
    }
  }
  </script>
</head>
<body class="section-dark">
  <a href="#main-content" class="skip-to-content">Saltar al contenido principal</a>

  <header class="site-header" role="banner">
    <div class="container header-inner">
      <a href="../index.html" class="header-logo" aria-label="VL Consulting Partners - Volver al Inicio">
        <img src="../assets/images/logo/vl-logo.svg" alt="VL Consulting Partners Logo" width="220" height="42">
      </a>

      <nav class="nav-desktop" aria-label="Navegación principal">
        <a href="../index.html" class="nav-link">Inicio</a>
        <a href="../nosotros.html" class="nav-link">Nosotros</a>
        
        <div class="nav-item-dropdown">
          <a href="../index.html#servicios" class="nav-link" aria-haspopup="true">Servicios ▾</a>
          <div class="dropdown-menu">
            <a href="../auditoria.html" class="dropdown-link">Auditoría Financiera y Procesos</a>
            <a href="../impuestos.html" class="dropdown-link">Planeación y Gestión de Impuestos</a>
            <a href="../consultoria.html" class="dropdown-link">Consultoría y Estrategia Empresarial</a>
            <a href="../cumplimiento.html" class="dropdown-link">Cumplimiento y Regulación</a>
          </div>
        </div>

        <a href="../sectores.html" class="nav-link">Sectores</a>
        <a href="../publicaciones.html" class="nav-link active">Actualidad</a>
        <a href="../contacto.html" class="nav-link">Contacto</a>
      </nav>

      <div style="display: flex; align-items: center; gap: 1rem;">
        <a href="../contacto.html" class="btn btn-gold btn-sm" data-open-modal="agenda-modal">
          Agenda una consulta <span class="btn-arrow">›</span>
        </a>
        <button class="mobile-menu-btn" aria-label="Abrir menú de navegación" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>

  <div class="mobile-backdrop"></div>
  <aside class="mobile-nav-drawer" aria-label="Menú móvil">
    <a href="../index.html" class="mobile-nav-link">Inicio</a>
    <a href="../nosotros.html" class="mobile-nav-link">Nosotros</a>
    <a href="../auditoria.html" class="mobile-nav-link">Auditoría</a>
    <a href="../impuestos.html" class="mobile-nav-link">Impuestos</a>
    <a href="../consultoria.html" class="mobile-nav-link">Consultoría</a>
    <a href="../cumplimiento.html" class="mobile-nav-link">Cumplimiento</a>
    <a href="../sectores.html" class="mobile-nav-link">Sectores</a>
    <a href="../publicaciones.html" class="mobile-nav-link active">Actualidad y Conocimiento</a>
    <a href="../contacto.html" class="mobile-nav-link">Contacto</a>
    <div style="margin-top: 2rem;">
      <a href="../contacto.html" class="btn btn-gold" style="width: 100%;" data-open-modal="agenda-modal">Agenda una consulta</a>
    </div>
  </aside>

  <main id="main-content" style="padding-top: calc(var(--header-height) + 2rem); padding-bottom: 5rem;">
    <article class="container container-narrow">
      <nav aria-label="Migas de pan" style="margin-bottom: 1.5rem; font-size: 0.85rem; color: var(--color-text-dim);">
        <a href="../index.html" style="color: var(--color-gold-warm);">Inicio</a> ›
        <a href="../publicaciones.html" style="color: var(--color-gold-warm);">Actualidad</a> ›
        <span>${escapeHtml(article.category || 'Artículo')}</span>
      </nav>

      <header style="margin-bottom: 2.5rem;">
        <span class="section-kicker">${escapeHtml(article.category || 'Actualidad')}</span>
        <h1 style="font-size: 2.5rem; line-height: 1.2; margin-bottom: 1.25rem;">${escapeHtml(article.title)}</h1>
        
        <p class="lead-text" style="font-size: 1.2rem; line-height: 1.6; color: var(--color-text-muted-light); margin-bottom: 1.5rem;">
          ${escapeHtml(article.excerpt)}
        </p>

        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; border-top: 1px solid var(--color-border-card); border-bottom: 1px solid var(--color-border-card); padding: 1rem 0;">
          <div>
            <strong style="color: var(--color-text-main-light); display: block;">${escapeHtml(article.author || config.brand.name)}</strong>
            <span style="font-size: 0.85rem; color: var(--color-text-dim);">${escapeHtml(article.authorRole || 'Especialistas')} • ${formatDate(article.date)}</span>
          </div>

          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 0.8rem; color: var(--color-text-dim); text-transform: uppercase; letter-spacing: 0.05em;">Compartir:</span>
            <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}" target="_blank" rel="noopener noreferrer" style="color: var(--color-gold-warm); font-size: 0.9rem;" title="Compartir en LinkedIn">LinkedIn</a>
            <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(article.title)}" target="_blank" rel="noopener noreferrer" style="color: var(--color-gold-warm); font-size: 0.9rem;" title="Compartir en X">X</a>
            <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + ' ' + fullUrl)}" target="_blank" rel="noopener noreferrer" style="color: var(--color-gold-warm); font-size: 0.9rem;" title="Compartir en WhatsApp">WhatsApp</a>
          </div>
        </div>
      </header>

      <figure style="margin-bottom: 3rem; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--color-border-card);">
        <img src="../${article.coverImage || 'assets/images/about/about-skyscraper.jpg'}" alt="${escapeHtml(article.title)}" style="width: 100%; max-height: 440px; object-fit: cover;">
      </figure>

      <div class="article-content" style="font-size: 1.1rem; line-height: 1.8; color: #D1DCE8;">
        ${article.htmlBody}
      </div>

      <div class="cta-banner" style="margin-top: 4rem;">
        <div class="cta-banner-content">
          <h2 class="cta-banner-title">¿Desea asesoría especializada para su empresa?</h2>
          <p class="cta-banner-desc">Nuestro equipo de consultores seniors analiza su situación particular con total confidencialidad y rigor estratégico.</p>
        </div>
        <a href="../contacto.html" class="btn btn-gold" data-open-modal="agenda-modal">
          Agenda una consulta <span class="btn-arrow">›</span>
        </a>
      </div>
    </article>
  </main>

  <footer class="site-footer" role="contentinfo">
    <div class="container footer-grid">
      <div class="footer-col">
        <a href="../index.html" class="header-logo" style="margin-bottom: 1.25rem;">
          <img src="../assets/images/logo/vl-logo.svg" alt="VL Consulting Partners" width="220" height="42">
        </a>
        <p style="font-size: 0.875rem; line-height: 1.6; color: var(--color-text-dim); margin-bottom: 1rem;">
          ${config.brand.shortDescription}
        </p>
      </div>

      <div class="footer-col">
        <h4>Enlaces rápidos</h4>
        <div class="footer-links">
          <a href="../index.html" class="footer-link">Inicio</a>
          <a href="../nosotros.html" class="footer-link">Nosotros</a>
          <a href="../sectores.html" class="footer-link">Sectores</a>
          <a href="../publicaciones.html" class="footer-link">Actualidad</a>
          <a href="../contacto.html" class="footer-link">Contacto</a>
        </div>
      </div>

      <div class="footer-col">
        <h4>Servicios</h4>
        <div class="footer-links">
          <a href="../auditoria.html" class="footer-link">Auditoría</a>
          <a href="../impuestos.html" class="footer-link">Impuestos</a>
          <a href="../consultoria.html" class="footer-link">Consultoría</a>
          <a href="../cumplimiento.html" class="footer-link">Cumplimiento</a>
        </div>
      </div>

      <div class="footer-col">
        <h4>Contáctenos</h4>
        <div class="footer-contact-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>${config.contact.address}</span>
        </div>
        <div class="footer-contact-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <span>${config.contact.email}</span>
        </div>
      </div>

      <div class="footer-col">
        <h4>Síganos</h4>
        <div class="footer-links">
          <a href="${config.social.linkedin}" target="_blank" rel="noopener noreferrer" class="footer-link">LinkedIn</a>
          <a href="${config.social.youtube}" target="_blank" rel="noopener noreferrer" class="footer-link">YouTube</a>
        </div>
      </div>
    </div>

    <div class="container footer-bottom">
      <p>© <span class="current-year">2025</span> ${config.brand.name}. Todos los derechos reservados.</p>
      <div class="footer-legal-links">
        <a href="../privacidad.html" class="footer-link">Aviso de Privacidad</a>
        <a href="../terminos.html" class="footer-link">Términos de Uso</a>
      </div>
    </div>
  </footer>

  <div id="agenda-modal" class="modal-overlay" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="modal-title">
    <div class="modal-dialog">
      <button class="modal-close-btn" aria-label="Cerrar ventana emergente">✕</button>
      <h3 id="modal-title" style="font-size: 1.75rem; margin-bottom: 0.5rem; color: var(--color-gold-warm);">Agende una Consulta</h3>
      <p style="font-size: 0.9rem; color: var(--color-text-muted-light); margin-bottom: 1.5rem;">
        Complete sus datos corporativos y un socio especialista de VL Consulting Partners coordinará una sesión personalizada.
      </p>

      <form class="vl-contact-form" novalidate>
        <div class="form-group">
          <label class="form-label" for="modal-nombre">Nombre y Apellido <span class="required">*</span></label>
          <input type="text" id="modal-nombre" name="nombre" class="form-input" required placeholder="Ej. Lic. Carlos Mendoza">
        </div>
        <div class="form-group">
          <label class="form-label" for="modal-empresa">Empresa u Organización <span class="required">*</span></label>
          <input type="text" id="modal-empresa" name="empresa" class="form-input" required placeholder="Ej. Grupo Industrial S.A.">
        </div>
        <div class="form-group">
          <label class="form-label" for="modal-email">Correo Electrónico Corporativo <span class="required">*</span></label>
          <input type="email" id="modal-email" name="email" class="form-input" required placeholder="carlos@empresa.com">
        </div>
        <div class="form-group">
          <label class="form-label" for="modal-servicio">Servicio de Interés <span class="required">*</span></label>
          <select id="modal-servicio" name="servicio" class="form-select" required>
            <option value="">Seleccione un área...</option>
            <option value="auditoria">Auditoría Financiera y Operativa</option>
            <option value="impuestos">Planeación y Cumplimiento Tributario</option>
            <option value="consultoria">Consultoría y Estrategia Empresarial</option>
            <option value="cumplimiento">Cumplimiento Normativo (Compliance)</option>
            <option value="integral">Asesoría Integral Multidisciplinaria</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="modal-mensaje">Requerimientos o Breve Descripción <span class="required">*</span></label>
          <textarea id="modal-mensaje" name="mensaje" rows="3" class="form-textarea" required placeholder="Describa brevemente el contexto de su empresa..."></textarea>
        </div>
        <div class="form-checkbox-group">
          <input type="checkbox" id="modal-consentimiento" name="consentimiento" required>
          <label for="modal-consentimiento">
            Acepto el tratamiento de mis datos de contacto conforme al <a href="../privacidad.html" style="color: var(--color-gold-warm); text-decoration: underline;">Aviso de Privacidad</a> (pendiente de validación jurídica).
          </label>
        </div>
        <div style="margin-top: 1.5rem;">
          <button type="submit" class="btn btn-gold" style="width: 100%;">Solicitar Sesión Consultiva ›</button>
        </div>
      </form>
    </div>
  </div>

  <script type="module" src="../assets/js/main.js"></script>
</body>
</html>`;
}

function generateCatalogTemplate(articles, config) {
  const fullUrl = `${config.brand.url}/publicaciones.html`;

  const articlesCardsHtml = articles.map(art => `
    <article class="article-card">
      <img src="${art.coverImage || 'assets/images/about/about-skyscraper.jpg'}" alt="${escapeHtml(art.title)}" class="article-card-cover" loading="lazy">
      <div class="article-card-body">
        <span class="article-category">${escapeHtml(art.category || 'Consultoría')}</span>
        <h3 class="article-card-title">
          <a href="publicaciones/${art.slug}.html">${escapeHtml(art.title)}</a>
        </h3>
        <p class="article-card-excerpt">${escapeHtml(art.excerpt)}</p>
        <div class="article-meta">
          <span>${formatDate(art.date)}</span>
          <a href="publicaciones/${art.slug}.html" class="service-card-action" style="font-size: 0.8rem;">
            Leer análisis <span class="action-arrow">›</span>
          </a>
        </div>
      </div>
    </article>
  `).join('\n');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Actualidad y Conocimiento | ${config.brand.name}</title>
  <meta name="description" content="Análisis estratégicos, novedades fiscales, gobierno corporativo y tendencias de auditoría desarrollados por los especialistas de VL Consulting Partners.">
  <link rel="canonical" href="${fullUrl}">

  <meta property="og:type" content="website">
  <meta property="og:title" content="Actualidad y Conocimiento | ${config.brand.name}">
  <meta property="og:description" content="Análisis estratégicos y regulatorios para la alta dirección empresarial.">
  <meta property="og:url" content="${fullUrl}">
  <meta property="og:image" content="${config.brand.url}/assets/images/hero/hero-boardroom.jpg">

  <link rel="icon" type="image/svg+xml" href="assets/images/logo/favicon.svg">
  <link rel="stylesheet" href="assets/css/main.css">
</head>
<body class="section-dark">
  <a href="#main-content" class="skip-to-content">Saltar al contenido principal</a>

  <header class="site-header" role="banner">
    <div class="container header-inner">
      <a href="index.html" class="header-logo" aria-label="VL Consulting Partners - Inicio">
        <img src="assets/images/logo/vl-logo.svg" alt="VL Consulting Partners Logo" width="220" height="42">
      </a>

      <nav class="nav-desktop" aria-label="Navegación principal">
        <a href="index.html" class="nav-link">Inicio</a>
        <a href="nosotros.html" class="nav-link">Nosotros</a>
        
        <div class="nav-item-dropdown">
          <a href="index.html#servicios" class="nav-link" aria-haspopup="true">Servicios ▾</a>
          <div class="dropdown-menu">
            <a href="auditoria.html" class="dropdown-link">Auditoría</a>
            <a href="impuestos.html" class="dropdown-link">Impuestos</a>
            <a href="consultoria.html" class="dropdown-link">Consultoría</a>
            <a href="cumplimiento.html" class="dropdown-link">Cumplimiento</a>
          </div>
        </div>

        <a href="sectores.html" class="nav-link">Sectores</a>
        <a href="publicaciones.html" class="nav-link active">Actualidad</a>
        <a href="contacto.html" class="nav-link">Contacto</a>
      </nav>

      <div style="display: flex; align-items: center; gap: 1rem;">
        <a href="contacto.html" class="btn btn-gold btn-sm" data-open-modal="agenda-modal">
          Agenda una consulta <span class="btn-arrow">›</span>
        </a>
        <button class="mobile-menu-btn" aria-label="Abrir menú de navegación" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>

  <div class="mobile-backdrop"></div>
  <aside class="mobile-nav-drawer" aria-label="Menú móvil">
    <a href="index.html" class="mobile-nav-link">Inicio</a>
    <a href="nosotros.html" class="mobile-nav-link">Nosotros</a>
    <a href="auditoria.html" class="mobile-nav-link">Auditoría</a>
    <a href="impuestos.html" class="mobile-nav-link">Impuestos</a>
    <a href="consultoria.html" class="mobile-nav-link">Consultoría</a>
    <a href="cumplimiento.html" class="mobile-nav-link">Cumplimiento</a>
    <a href="sectores.html" class="mobile-nav-link">Sectores</a>
    <a href="publicaciones.html" class="mobile-nav-link active">Actualidad y Conocimiento</a>
    <a href="contacto.html" class="mobile-nav-link">Contacto</a>
    <div style="margin-top: 2rem;">
      <a href="contacto.html" class="btn btn-gold" style="width: 100%;" data-open-modal="agenda-modal">Agenda una consulta</a>
    </div>
  </aside>

  <main id="main-content" style="padding-top: calc(var(--header-height) + 3rem); padding-bottom: 6rem;">
    <section class="container">
      <div style="text-align: center; margin-bottom: 3.5rem;">
        <span class="section-kicker">CONOCIMIENTO ESTRATÉGICO</span>
        <h1 class="section-title" style="margin-left: auto; margin-right: auto;">Actualidad y Conocimiento Empresarial</h1>
        <p class="section-subtitle" style="margin-left: auto; margin-right: auto;">
          Perspectivas multidisciplinarias sobre normatividad tributaria, auditoría financiera, gobierno corporativo y tendencias de mercado para líderes de negocio.
        </p>
      </div>

      <div class="grid-3">
        ${articlesCardsHtml}
      </div>
    </section>
  </main>

  <footer class="site-footer" role="contentinfo">
    <div class="container footer-grid">
      <div class="footer-col">
        <a href="index.html" class="header-logo" style="margin-bottom: 1.25rem;">
          <img src="assets/images/logo/vl-logo.svg" alt="VL Consulting Partners" width="220" height="42">
        </a>
        <p style="font-size: 0.875rem; line-height: 1.6; color: var(--color-text-dim); margin-bottom: 1rem;">
          ${config.brand.shortDescription}
        </p>
      </div>
      <div class="footer-col">
        <h4>Enlaces rápidos</h4>
        <div class="footer-links">
          <a href="index.html" class="footer-link">Inicio</a>
          <a href="nosotros.html" class="footer-link">Nosotros</a>
          <a href="sectores.html" class="footer-link">Sectores</a>
          <a href="publicaciones.html" class="footer-link">Actualidad</a>
          <a href="contacto.html" class="footer-link">Contacto</a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Servicios</h4>
        <div class="footer-links">
          <a href="auditoria.html" class="footer-link">Auditoría</a>
          <a href="impuestos.html" class="footer-link">Impuestos</a>
          <a href="consultoria.html" class="footer-link">Consultoría</a>
          <a href="cumplimiento.html" class="footer-link">Cumplimiento</a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Contáctenos</h4>
        <div class="footer-contact-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>${config.contact.address}</span>
        </div>
        <div class="footer-contact-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <span>${config.contact.email}</span>
        </div>
      </div>
      <div class="footer-col">
        <h4>Síganos</h4>
        <div class="footer-links">
          <a href="${config.social.linkedin}" target="_blank" rel="noopener noreferrer" class="footer-link">LinkedIn</a>
          <a href="${config.social.youtube}" target="_blank" rel="noopener noreferrer" class="footer-link">YouTube</a>
        </div>
      </div>
    </div>
    <div class="container footer-bottom">
      <p>© <span class="current-year">2025</span> ${config.brand.name}. Todos los derechos reservados.</p>
      <div class="footer-legal-links">
        <a href="privacidad.html" class="footer-link">Aviso de Privacidad</a>
        <a href="terminos.html" class="footer-link">Términos de Uso</a>
      </div>
    </div>
  </footer>

  <div id="agenda-modal" class="modal-overlay" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="modal-catalog-title">
    <div class="modal-dialog">
      <button class="modal-close-btn" aria-label="Cerrar ventana emergente">✕</button>
      <h3 id="modal-catalog-title" style="font-size: 1.75rem; margin-bottom: 0.5rem; color: var(--color-gold-warm);">Agende una Consulta</h3>
      <p style="font-size: 0.9rem; color: var(--color-text-muted-light); margin-bottom: 1.5rem;">
        Complete sus datos corporativos y un socio especialista de VL Consulting Partners coordinará una sesión personalizada.
      </p>

      <form class="vl-contact-form" novalidate>
        <div class="form-group">
          <label class="form-label" for="cat-modal-nombre">Nombre y Apellido <span class="required">*</span></label>
          <input type="text" id="cat-modal-nombre" name="nombre" class="form-input" required placeholder="Ej. Lic. Carlos Mendoza">
        </div>
        <div class="form-group">
          <label class="form-label" for="cat-modal-empresa">Empresa u Organización <span class="required">*</span></label>
          <input type="text" id="cat-modal-empresa" name="empresa" class="form-input" required placeholder="Ej. Grupo Industrial S.A.">
        </div>
        <div class="form-group">
          <label class="form-label" for="cat-modal-email">Correo Electrónico Corporativo <span class="required">*</span></label>
          <input type="email" id="cat-modal-email" name="email" class="form-input" required placeholder="carlos@empresa.com">
        </div>
        <div class="form-group">
          <label class="form-label" for="cat-modal-servicio">Servicio de Interés <span class="required">*</span></label>
          <select id="cat-modal-servicio" name="servicio" class="form-select" required>
            <option value="">Seleccione un área...</option>
            <option value="auditoria">Auditoría Financiera y Operativa</option>
            <option value="impuestos">Planeación y Cumplimiento Tributario</option>
            <option value="consultoria">Consultoría y Estrategia Empresarial</option>
            <option value="cumplimiento">Cumplimiento Normativo (Compliance)</option>
            <option value="integral">Asesoría Integral Multidisciplinaria</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="cat-modal-mensaje">Requerimientos o Breve Descripción <span class="required">*</span></label>
          <textarea id="cat-modal-mensaje" name="mensaje" rows="3" class="form-textarea" required placeholder="Describa brevemente el contexto de su empresa..."></textarea>
        </div>
        <div class="form-checkbox-group">
          <input type="checkbox" id="cat-modal-consentimiento" name="consentimiento" required>
          <label for="cat-modal-consentimiento">
            Acepto el tratamiento de mis datos de contacto conforme al <a href="privacidad.html" style="color: var(--color-gold-warm); text-decoration: underline;">Aviso de Privacidad</a> (pendiente de validación jurídica).
          </label>
        </div>
        <div style="margin-top: 1.5rem;">
          <button type="submit" class="btn btn-gold" style="width: 100%;">Solicitar Sesión Consultiva ›</button>
        </div>
      </form>
    </div>
  </div>

  <script type="module" src="assets/js/main.js"></script>
</body>
</html>`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  return `${d.getDate() + 1} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
}

console.log('--- Iniciando compilación estática de VL Consulting Partners ---');
syncAssets();
const articles = buildArticles();
buildPublicationCatalog(articles);
buildSitemap(articles);
buildRobotsTxt();

// Sanitizar datos no confirmados y alinear dominio desde site-config.json
const sanitize = spawnSync(process.execPath, [path.join(__dirname, 'sanitize-public.js')], {
  stdio: 'inherit'
});
if (sanitize.status !== 0) {
  console.error('✗ Sanitización falló');
  process.exit(1);
}

// Copiar todo el contenido final de public a dist
const distDir = path.join(rootDir, 'dist');
fs.cpSync(publicDir, distDir, { recursive: true });
console.log('✓ Directorio de distribución dist/ sincronizado');
console.log('--- Compilación estática completada exitosamente ---');
