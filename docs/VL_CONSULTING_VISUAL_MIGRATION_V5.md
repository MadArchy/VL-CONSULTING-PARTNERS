# VL Consulting Partners — Migración visual V5

**Identidad:** azul corporativo, azul profundo, gris metálico, grafito y blanco.  
**Alcance:** sistema visual activo. Sin despliegue, sin push y sin merge.  
**Fecha:** 6 de noviembre de 2026.

La composición sigue la especificación escrita de la fase 5. En el repositorio no había un archivo de mockup nuevo que pudiera usarse como imagen de fondo o como plantilla pixel a pixel.

## Estado inicial

| Dato | Valor |
|---|---|
| Rama | `master` |
| HEAD | `0b4cb60d000c5c3c644209e3a67dcece5e936c92` |
| Mensaje | `feat: iluminar el monograma de entrada con un borde blanco suave` |
| Worktree | Limpio antes de esta intervención |

La fuente activa de estilos era `src/css/` (sincronizada a `public/assets/css/` por `npm run build`). La paleta vigente era rojo ejecutivo `#B51226`, negro `#17191D` y mármol. El header era oscuro. `nosotros.html`, `sectores.html` y `contacto.html` eran redirecciones a inicio; se restauró su último contenido institucional (commit `b3210d5`), sin teléfono, correo ni dirección confirmados.

## Nueva paleta

| Token | Valor | Uso |
|---|---|---|
| `--vl-primary` | `#00558B` | Botones, enlaces, iconos, estado activo |
| `--vl-primary-hover` | `#00416E` | Hover de botón |
| `--vl-blue-deep` | `#002C4D` | Hero secundario, tarjetas oscuras, llamada a la acción |
| `--vl-blue-night` | `#071E33` | Texto principal, footer, intro |
| `--vl-blue-light` | `#A9DDF5` | Fragmento del hero y acentos sobre oscuro |
| `--vl-gray-metallic` | `#85898D` | Divisores |
| `--vl-gray-graphite` | `#353A40` | Fechas y texto neutro |
| `--vl-gray-light` | `#E9EDF0` | Fondos suaves |
| `--vl-gray-border` | `#D7DEE4` | Bordes y header |
| `--vl-white` | `#FFFFFF` | Header y tarjetas claras |
| `--vl-off-white` | `#F7F9FB` | Secciones claras |
| `--vl-text-primary` | `#071E33` | Texto sobre claro |
| `--vl-text-secondary` | `#505B65` | Texto secundario |
| `--vl-text-on-dark` | `#FFFFFF` | Texto sobre azul |
| `--vl-focus` | `#00558B` | Foco visible |
| `--vl-header-bg` | `#FFFFFF` | Header |
| `--vl-footer-bg` | `#071E33` | Footer |
| `--vl-card-light` | `#FFFFFF` | Tarjeta clara |
| `--vl-card-dark` | `#002C4D` | Tarjeta oscura |

Los alias históricos (`--vl-black`, `--vl-charcoal`, `--color-gold-*`, `--color-crimson-*`) apuntan a estos tokens para que el CSS existente herede la paleta. El rojo de marca `#B51226` salió de la interfaz activa. Los errores de formulario usan `#8E2F2F`, un rojo funcional distinto de la marca anterior.

## Variantes del logotipo

Los originales no se sobrescribieron: `vl-logo-header.png`, `vl-logo-corporativo.png`, `vl-mark.png`, `logo-original.jpg` y los SVG V2.

Las variantes V5 se derivaron del raster oficial (fondo negro retirado, acento rojo pasado a azul, wordmark claro conservado o pasado a azul nocturno). No son un redibujo tipográfico.

| Archivo | Uso |
|---|---|
| `vl-logo-v5-header.png` | Header blanco. Monograma metálico, swoosh azul, wordmark y lema en azul nocturno |
| `vl-logo-v5-footer.png` | Footer azul nocturno. Wordmark y lema claros |
| `vl-logo-v5-horizontal.png` | Versión horizontal sin lema, wordmark nocturno |
| `vl-logo-v5-mark.png` | Monograma completo sobre transparente |
| `favicon-v5.png` | Monograma recortado para favicon, intro y header móvil |

El script reproducible es `scripts/derive-logo-v5.mjs`.

## Cambios de componentes

- Header blanco, navegación azul nocturno, subrayado activo `#00558B`, botón azul. En móvil se muestra el monograma y el cajón abre sobre fondo blanco.
- Hero en dos zonas: panel azul nocturno y fotografía de arquitectura con diagonales azul y gris. El fragmento “crecer con solidez y confianza” va en `#A9DDF5`.
- “Agenda una consulta” enlaza a `contacto.html`. “Conoce nuestros servicios” enlaza a `#servicios`.
- Servicios: blanco, azul profundo, blanco, azul profundo. Icono azul o blanco, sombra suave y enlace real.
- Nosotros en inicio: fondo claro, arquitectura, lema y tres valores cualitativos, sin cifras.
- Por qué elegirnos: iconos azules, divisores grises, títulos azul nocturno.
- Publicaciones: fondo claro, títulos azul profundo, categoría azul, fecha grafito, tarjetas blancas.
- Contacto: sección azul profundo, campos blancos, borde gris, foco azul, botón azul. El envío no simula éxito de backend.
- Footer azul nocturno, logo claro, enlaces blancos, separador gris.

## Cambios por página

Inicio, auditoría, impuestos, consultoría, cumplimiento, publicaciones, artículos, privacidad, términos y 404 usan la misma cromía, el logo V5 y la navegación Inicio, Nosotros, Servicios, Sectores, Publicaciones y Contacto.

Nosotros, sectores y contacto volvieron a ser páginas con el contenido institucional ya existente. No se publicaron datos de contacto no confirmados.

SEO, sitemap, robots, rutas y la lógica de validación del formulario se mantienen. `scripts/build.js` genera artículos y el catálogo con el chrome V5.

## Pruebas

```text
npm run build     OK
npm run validate  0 errores, 0 advertencias
```

Capturas reales con Microsoft Edge (Playwright), después de la intro de portada. Consola: 0 errores. El menú móvil abre (`is-open`).

Desborde horizontal (`scrollWidth - clientWidth`) medido en inicio, contacto, nosotros, auditoría, publicaciones y privacidad:

| Ancho | Resultado |
|---|---|
| 375 px | 0 |
| 768 px | 0 |
| 1024 px | 0 |
| 1440 px | 0 |

## Capturas

| Archivo | Vista |
|---|---|
| `docs/evidence/phase5/homepage-desktop-1440.png` | Portada, escritorio |
| `docs/evidence/phase5/homepage-mobile-375.png` | Portada, móvil |
| `docs/evidence/phase5/homepage-1024.png` | Portada, 1024 |
| `docs/evidence/phase5/homepage-768.png` | Portada, 768 |
| `docs/evidence/phase5/servicios-desktop-1440.png` | Servicios |
| `docs/evidence/phase5/servicios-mobile-375.png` | Servicios, móvil |
| `docs/evidence/phase5/publicaciones-desktop-1440.png` | Publicaciones |
| `docs/evidence/phase5/contacto-desktop-1440.png` | Contacto |
| `docs/evidence/phase5/contacto-mobile-375.png` | Contacto, móvil |
| `docs/evidence/phase5/auditoria-desktop-1440.png` | Página interna |
| `docs/evidence/phase5/metrics.json` | Anchos y consola |

## Diferencias pendientes

- No hubo archivo de mockup en el workspace para una comparación pixel a pixel.
- El lema del header forma parte del PNG y, a la altura de la barra, se lee en tamaño reducido.
- La fotografía de arquitectura es un recurso ya existente del sitio e incluye rótulos de un edificio de stock.
- No se desplegó el sitio.

## Riesgos

- Los alias de color hacen que cualquier rojo residual que aún use variables herede azul. Un hex rojo nuevo habría que buscarlo aparte.
- Regenerar logos con `scripts/derive-logo-v5.mjs` vuelve a escribir solo los archivos `*v5*`.
- `dist/` se actualiza en cada `npm run build` y no debe publicarse sin autorización.

## Estado final

Identidad azul y gris aplicada sobre la arquitectura actual. Logo oficial recolorizado, no sustituido. Páginas existentes actualizadas. Publicaciones, SEO y validación del formulario conservados. Pruebas locales en verde. Sin publicación.
