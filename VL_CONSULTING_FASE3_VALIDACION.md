# VL Consulting Partners — Fase 3 Validación y Finalización

**Fecha:** 5 de noviembre de 2026  
**Superficie de despliegue:** `public/` (y espejo `dist/`)  
**Stack:** HTML5 + CSS3 + JavaScript (ESM) — sin React/Next/Vue/Angular  
**Deploy / push:** no ejecutados

---

## 1. Estado inicial

- Informe previo: `VL_CONSULTING_PRODUCTION_READINESS.md` → *READY FOR INTERNAL REVIEW / STAGING*.
- Coexistían dos superficies:
  - Páginas raíz de Fase 2 (`index.html`, `assets/`, `servicios/`, …) — legacy.
  - Sitio Antigravity en `public/` (mockup corporativo, CSS modular, SSG Markdown) — **canónico**.
- Problemas abiertos: datos de contacto inventados, métricas ilustrativas, dominio hardcodeado, CSS dual, OG raster ausente, sin e2e, Lighthouse no corrido, logo SVG recortado, `site-config.json` 404 al fetch.

---

## 2. Cambios realizados

| Área | Cambio |
|---|---|
| Contenido seguro | Sanitización automática (`scripts/sanitize-public.js`) eliminó dirección/teléfono/email/métricas inventadas y redes no confirmadas |
| Dominio | Centralizado en `content/site-config.json` → `brand.url` (`https://www.example.com`, `urlConfirmed: false`) |
| CSS | Documentada fuente de verdad: `src/css/` → `public/assets/css/` (`docs/CSS-SOURCE-OF-TRUTH.md`) |
| Logo | `viewBox` ampliado a 640; `flex-shrink: 0`; diagonal dorada conservada; `logo-original.jpg` intacto |
| Hero | `<picture>` con AVIF/WebP + JPG; preload/fetchpriority |
| OG | Generados `og-default.png` / `og-default.jpg` (1200×630) desde plantilla de marca |
| Formulario | Sin fetch si no hay endpoint; sin éxito ficticio; guía `docs/RECEPCION-FORMULARIO.md` |
| Publicaciones | Pipeline Markdown → HTML ya operativo (`npm run build`); manual existente |
| Config runtime | `public/content/site-config.json` expuesto por build |
| Menú móvil | Botón 44×44, CTA header oculto en xs, Escape/cierre verificados |
| Pruebas | Playwright smoke + Lighthouse local |
| Tooling | Scripts `sanitize`, `optimize:images`, `capture:og`, `test:e2e` |

---

## 3. Evidencia visual

Capturas en `docs/evidence/`:

| Archivo | Viewport / contexto |
|---|---|
| `home-chromium-desktop.png` | Desktop 1440 |
| `home-chromium-mobile.png` | Móvil 375 |
| `responsive-375.png` | 375 |
| `responsive-768.png` | 768 |
| `responsive-1024.png` | 1024 |
| `responsive-1440.png` | 1440 |

Observaciones vs mockup (`docs/references/`):

- Header oscuro, logo VL + diagonal dorada, CTA dorado: **alineado**.
- Hero split con fotografía boardroom: **alineado**.
- Tarjetas de servicios y pilares: **alineados**.
- Footer sin datos falsos: **corregido** (pendiente de datos oficiales reales).

---

## 4. Resultados de pruebas

| Verificación | Resultado | Evidencia |
|---|---|---|
| `npm run build` | **PASS** | Compila artículos, sitemap, robots, sanitize, dist |
| `npm run validate` | **PASS** | 0 errores / 0 warnings |
| `npm run test:e2e` | **PASS** | 10 passed, 2 skipped (proyectos cruzados) |
| Homepage sin errores JS/404 | **PASS** | Playwright |
| Navegación desktop | **PASS** | Playwright |
| Menú móvil open/Escape close | **PASS** | Playwright |
| Validación formulario + pendiente backend | **PASS** | Playwright (sin “Solicitud recibida” falsa) |
| Responsive sin overflow 375–1440 | **PASS** | Playwright |
| Lighthouse local | **PASS** | Performance **84**, Accessibility **99**, Best Practices **100**, SEO **100** (`docs/lighthouse-local.json`) |
| Headers HTTPS en hosting real | **NOT RUN** | Requiere despliegue |
| Search Console / indexación real | **NOT RUN** | Requiere dominio confirmado |
| Push / producción | **NOT RUN** | Sin autorización |

---

## 5. Problemas corregidos

1. Datos institucionales inventados en footers/JSON-LD/contacto.
2. Métricas numéricas no verificadas sustituidas por pilares cualitativos.
3. Dominio `vlconsultingpartners.com` no confirmado → `example.com` vía config.
4. 404 de `/content/site-config.json`.
5. Logo SVG truncado (“PARTNERS”).
6. OG image ausente / inadecuada.
7. Hero sin formatos modernos.
8. Formulario intentaba POST siempre; ahora exige endpoint.
9. Placeholders literales `${config.social...}` en `impuestos.html`.
10. Scripts npm incompletos respecto a sanitize/optimize/e2e.

---

## 6. Pendientes de contenido

- Confirmar y publicar email / teléfono / dirección oficiales.
- Confirmar URLs de LinkedIn / YouTube.
- Sustituir textos genéricos de sectores si la firma define foco real.
- Revisar artículos Markdown editoriales antes de go-live.
- Decidir si las páginas raíz legacy se archivan o eliminan (hoy no son la superficie `public/`).

---

## 7. Pendientes jurídicos

- Validación formal del Aviso de Privacidad y Términos.
- Base legal del formulario y encargados de tratamiento.
- Consentimiento analytics/ads cuando se activen.

---

## 8. Pendientes de dominio y hosting

1. Confirmar dominio oficial y poner `brand.urlConfirmed: true`.
2. DNS + HTTPS + redirect canónico.
3. Publicar `dist/` o `public/` en el hosting.
4. Activar headers (`public/_headers` / `.htaccess` / Cloudflare).
5. Search Console + envío de sitemap.
6. Conectar `api.endpoint` seguro para el formulario.

---

## 9. Riesgos

| Riesgo | Severidad | Mitigación |
|---|---|---|
| Publicar con `example.com` | Alta | Bloqueo de go-live hasta dominio real |
| Formulario sin backend | Media | Mensaje transparente; doc de recepción |
| Dualidad raíz vs `public/` | Media | README + arquitectura; desplegar solo `public`/`dist` |
| Hero JPG aún pesado (~745 KB) | Baja | WebP/AVIF ya prioritarios en `<picture>` |
| CSS legacy en `assets/css/styles.css` | Baja | Marcado como no desplegable |

---

## 10. Recomendación de publicación

**Recomendación:** mantener en **staging / revisión interna**.

La Fase 3 cumple el criterio técnico local (diseño consistente, desktop/móvil, build, navegación probada, publicaciones mantenibles, SEO técnico local, evidencias).

**No se recomienda producción pública** hasta resolver:

1. Dominio confirmado  
2. Datos de contacto oficiales  
3. Privacidad jurídica  
4. Endpoint de formulario o canal oficial alternativo  
5. Autorización explícita de despliegue  

### Comandos locales

```bash
npm run validate
npm run build
npm run serve          # http://localhost:3000  → public/
npm run test:e2e
npm run optimize:images
npm run capture:og
```

---

**Estado Fase 3:** COMPLETA (validación local)  
**Estado publicación:** **NO LISTO PARA PRODUCCIÓN** — bloqueantes externos documentados.
