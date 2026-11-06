# VL Consulting Partners — Phase 4 Redesign Report

**Autorización:** `AUTHORIZE_VL_CORPORATE_REDESIGN_PHASE_4_LOCAL_ONLY`  
**Fecha:** 2026-11-05  
**Alcance:** Rediseño visual local (rojo / negro / blanco / mármol). Sin deploy, push ni merge remoto.

---

## 1. Estado inicial del repositorio

- Superficie canónica: `public/` (espejo `dist/` vía `npm run build`).
- Stack: HTML5 + CSS3 + JS ESM + SSG Markdown (`scripts/build.js`).
- Identidad previa: azul marino / dorado (luego mix burdeos).
- Páginas `nosotros.html`, `sectores.html`, `contacto.html` estaban como redirects a inicio (remociones de fases anteriores).
- Sistema editorial Markdown operativo en `content/publicaciones/`.

## 2. Rama y HEAD

| Campo | Valor |
|-------|--------|
| Rama | `master` |
| HEAD (inicio Phase 4) | `b3210d51ecc9ee7d4cb9b4854468723995111818` |
| Remoto | Sin push en esta fase |

## 3. Archivos modificados / nuevos (resumen)

### CSS (SoT `src/css/` → `public/assets/css/`)
- `variables.css` — tokens oficiales `--vl-*`
- `components.css` — botones, tarjetas alternadas, CTA, formularios
- `layout.css` — header/footer/nav rojo-carbón
- `main.css` — hero V2, mármol, about, publicaciones light
- `typography.css`, `animations.css` — acentos rojos

### HTML
- `public/index.html` — homepage completa V2
- `public/nosotros.html`, `sectores.html`, `contacto.html` — restauradas con contenido real (sin métricas inventadas)
- Páginas de servicio, legal, 404, publicaciones — logo V2 + nav unificada
- Artículos regenerados por build

### Logos (original intacto)
- `vl-logo-v2-dark.svg`, `vl-logo-v2-light.svg`, `vl-monogram-v2.svg`, `favicon-v2.svg`
- Conservados: `logo-original.jpg`, `vl-logo.svg`

### Scripts / docs
- `scripts/build.js` — nav Phase 4 + logos V2
- `scripts/apply-phase4-nav.js`, `scripts/patch-build-phase4.js`, `scripts/capture-phase4.js`
- `docs/VL_DESIGN_SYSTEM_V2.md`
- `docs/VL_CONSULTING_PHASE4_REDESIGN_REPORT.md` (este archivo)
- Evidencia: `docs/evidence/phase4/*.png`

## 4. Nuevos tokens CSS

Ver `docs/VL_DESIGN_SYSTEM_V2.md` y `:root` en `src/css/variables.css`:

- Primary `#B51226` / dark `#8C0D1D` / light `#D62C43`
- Black `#17191D`, charcoal `#282B30` / `#373A40`
- White / off-white / marble
- Alias de compatibilidad para `--color-gold-*` → rojo

## 5. Cambios de branding

- Acento principal: rojo corporativo (sustituye dorado).
- Fondos ejecutivos: negro / carbón (sustituye navy).
- Superficies: blanco / mármol.
- Logo web V2: monograma plata + diagonal roja; tipografía clara; lema en rojo.
- Favicon V2.
- **No** se sobrescribió el logo original.

## 6. Cambios de componentes

| Componente | Cambio |
|------------|--------|
| Header | Negro, hover/activo rojo, CTA rojo, nav restaurada |
| Hero | Panel oscuro + foto; highlight “crecer con solidez y confianza” en rojo |
| Servicios | Sección mármol; tarjetas clara/carbón alternadas |
| Nosotros (home) | Imagen + copy + valores cualitativos (sin cifras fake) |
| Por qué elegirnos | Fondo oscuro, 4 pilares |
| Publicaciones | Editorial claro; artículos reales del SSG |
| CTA contacto | “Hablemos de sus objetivos” → `contacto.html` |
| Footer | Negro + línea roja; datos oficiales pendientes |
| Formulario | Estilos V2; validación cliente; sin éxito simulado de backend |

## 7. Cambios por página

| Página | Estado |
|--------|--------|
| Inicio | Rediseño completo V2 |
| Nosotros | Página real restaurada |
| Auditoría / Impuestos / Consultoría / Cumplimiento | Tema + nav V2 |
| Sectores | Página real desde `site-config.sectors` |
| Publicaciones + artículos | Tema V2; contenido Markdown intacto |
| Contacto | Formulario restaurado |
| Privacidad / Términos / 404 | Logo + nav V2 |

## 8. Preservación de funcionalidades

- Stack sin frameworks nuevos.
- SSG Markdown, frontmatter, sitemap, robots, canonical, JSON-LD.
- Validación de formulario cliente preservada.
- Sin datos de contacto inventados (`isOfficialContactConfirmed: false`).
- `metrics: []` — sin cifras ilustrativas del mockup.
- Sin deploy / Wrangler / push.

## 9. Resultados de pruebas

| Prueba | Resultado |
|--------|-----------|
| `npm run build` | PASS |
| `npm run validate` | PASS (0 errores, 0 advertencias) |
| Playwright desktop (5 tests) | PASS (1 skip: mobile menu) |
| Playwright mobile (5 tests) | PASS (1 skip: desktop nav) |
| Formulario validación + pending backend | PASS |
| Overflow 375/768/1024/1440 | PASS |
| Capturas Phase 4 | Generadas en `docs/evidence/phase4/` |

Servidor: puerto 3000 ya en uso (sesión previa); pruebas contra `http://localhost:3000`.

## 10. Evidencia visual

| Archivo | Vista |
|---------|-------|
| `docs/evidence/phase4/homepage-desktop.png` | Home 1440 |
| `docs/evidence/phase4/homepage-mobile.png` | Home 375 |
| `docs/evidence/phase4/servicios-auditoria.png` | Servicio |
| `docs/evidence/phase4/publicaciones.png` | Publicaciones |
| `docs/evidence/phase4/contacto.png` | Contacto |
| `docs/evidence/phase4/nosotros.png` | Nosotros |
| `docs/evidence/home-*.png` / `responsive-*.png` | Smoke e2e |

## 11. Diferencias pendientes vs mockup

- Mockup de referencia en repo (`docs/references/mockup-sitio-lujo.png`) sigue siendo navy/gold; la implementación sigue la **paleta Phase 4 autorizada** y la estructura del mockup remapeada a rojo/carbón/blanco.
- No hay fotografía de oficina con sillas rojas/mármol autorizada aparte de assets existentes (boardroom / desk / skyscraper); pendiente recurso fotográfico alineado a Referencia B si se aporta con derechos.
- Monograma V2 es adaptación SVG; refinamiento pixel-perfect del original pendiente de diseño gráfico.
- Equipo: omitido (sin contenido real en config).
- Redes y datos de contacto: placeholders “pendiente”, no inventados.
- CTA hero/header apuntan a `contacto.html` (página real) en lugar del modal como destino primario; modal permanece en index para compatibilidad.

## 12. Problemas encontrados

- Fade-in con `opacity: 0` ocultaba secciones en capturas full-page; mitigado con revelado por viewport + fallback + forzado en script de captura.
- Puerto 3000 ocupado al relanzar `serve` (`EADDRINUSE`); se reutilizó el servidor existente.
- Archivo vacío `Contacto` (0 bytes) en raíz del workspace — no forma parte del sitio; revisar/eliminar manualmente si fue accidental.
- Scripts históricos `remove-*-nav.js` siguen en `scripts/` pero **no** se ejecutaron en Phase 4.

## 13. Riesgos

- Re-ejecutar scripts de remoción de nav desharía Nosotros/Sectores/Contacto.
- Build regenera `publicaciones.html` desde plantilla; mantener `scripts/build.js` alineado.
- Contraste rojo sobre blanco: botones OK; texto rojo largo sobre blanco debe limitarse a acentos.
- Dominio `www.example.com` sigue como placeholder institucional.

## 14. Recomendación para siguiente fase

1. Incorporar mockup rojo oficial y fotografía de oficina con licencia.
2. Confirmar datos de contacto/redes en `site-config.json` y publicar.
3. Refinar monograma con diseño gráfico a partir de `logo-original.jpg`.
4. Lighthouse CI + contraste WCAG automatizado.
5. Integración backend Java del formulario (sin simular éxito hasta entonces).
6. Autorización explícita para commit/push/deploy cuando corresponda.

---

**Estado de aceptación Phase 4 (local):** diseño V2 aplicado, navegación operativa, editorial intacto, formulario validado, pruebas documentadas, sin producción.
