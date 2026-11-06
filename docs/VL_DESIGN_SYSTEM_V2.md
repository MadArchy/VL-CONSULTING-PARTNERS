# VL Consulting Partners — Design System V2

**Identidad:** Rojo ejecutivo / Negro / Carbón / Blanco / Mármol  
**Autorización:** `AUTHORIZE_VL_CORPORATE_REDESIGN_PHASE_4_LOCAL_ONLY`  
**Fuente de tokens:** `src/css/variables.css` (sincronizado a `public/assets/css/`)

---

## 1. Colores

| Token | Hex | Uso |
|-------|-----|-----|
| `--vl-primary` | `#B51226` | Acento principal, CTA, líneas activas |
| `--vl-primary-dark` | `#8C0D1D` | Hover de botones primarios |
| `--vl-primary-light` | `#D62C43` | Highlight tipográfico, iconos sobre oscuro |
| `--vl-black` | `#17191D` | Header, footer, paneles hero |
| `--vl-charcoal` | `#282B30` | Tarjetas oscuras, modales |
| `--vl-charcoal-light` | `#373A40` | Hover superficies oscuras |
| `--vl-white` | `#FFFFFF` | Superficies claras |
| `--vl-off-white` | `#F8F8F6` | Fondos de sección |
| `--vl-marble` | `#E9EAEC` | Textura / fondo mármol sutil |
| `--vl-text-dark` | `#202227` | Texto sobre claro |
| `--vl-text-muted` | `#626770` | Texto secundario |
| `--vl-text-light` | `#F8F8F6` | Texto sobre oscuro |
| `--vl-border-light` | `#DFE1E4` | Bordes claros |
| `--vl-border-dark` | `#494C52` | Bordes oscuros |
| `--vl-focus` | `#B51226` | Focus visible |

**Regla:** el rojo reemplaza al dorado. No reintroducir azul marino ni dorado en UI activa.

Compatibilidad: las variables históricas (`--color-gold-*`, `--color-primary-navy`, etc.) aliasan a tokens V2.

---

## 2. Tipografías

| Rol | Familia | Notas |
|-----|---------|-------|
| Display / títulos | `Cinzel`, `Playfair Display`, Georgia | Serif institucional |
| Énfasis hero | `Playfair Display` italic | Fragmento destacado en rojo |
| Cuerpo / UI | `Plus Jakarta Sans` | Sans legible |

Jerarquía: kicker uppercase → título serif → subtítulo sans → cuerpo.

---

## 3. Componentes

### Header
- Fondo negro ejecutivo (`--vl-black`), borde inferior rojo sutil.
- Logo V2 dark a la izquierda.
- Nav desktop: Inicio, Nosotros, Servicios ▾, Sectores, Publicaciones, Contacto.
- CTA rojo “Agenda una consulta”.
- Menú móvil: cajón accesible con `aria-expanded` / backdrop.

### Botones
- **Primario (`.btn-gold` / `.btn-primary`):** fondo `--vl-primary`, texto blanco, hover `--vl-primary-dark`.
- **Outline claro (`.btn-outline`):** borde claro, texto blanco, hover rojo suave.
- **Outline oscuro (`.btn-outline-dark`):** para fondos mármol.

### Tarjetas de servicio
- Fondo sección: mármol / off-white.
- Alternancia: impar clara, par carbón.
- Línea roja decorativa, icono rojo, CTA “Conocer más”.

### Pilares / por qué elegirnos
- Fondo negro/carbón.
- Iconos rojos, título blanco, descripción gris claro, separadores verticales rojos.

### Publicaciones
- Fondo mármol; tarjetas blancas; categoría en rojo; tipografía editorial.

### Formularios
- Focus rojo (`--vl-focus`).
- Errores con borde + mensaje textual (no solo color).
- No simular éxito de backend.

### Footer
- Negro, borde superior rojo 3px.
- Columnas: logo/lema, enlaces, servicios, contacto, redes.
- Año dinámico vía `.current-year`.

---

## 4. Espaciados

Escala: `--spacing-1` … `--spacing-32` (0.25rem base).  
Secciones: `--spacing-16` / `--spacing-20` / `--spacing-24` según breakpoint.  
Contenedor: máx. `1240px`. Header: `84px` (scrolled `72px`).

---

## 5. Estados visuales

| Estado | Comportamiento |
|--------|----------------|
| Hover nav | Color rojo claro + underline |
| Activo | Underline rojo completo |
| Focus | `outline: 2px solid var(--vl-focus)` |
| Hover tarjeta | `translateY(-6px)`, borde rojo, sombra suave |
| Reduced motion | Respetar `prefers-reduced-motion` (animations.css) |

---

## 6. Responsive

Breakpoints de referencia: **375 / 768 / 1024 / 1440**.

- Hero: stack vertical en móvil; split texto/imagen en desktop.
- Grid servicios: 1 → 2 → 4 columnas.
- Header CTA oculto bajo 640px (queda en menú móvil).
- Áreas táctiles mín. ~44px (hamburguesa, botones).

---

## 7. Logotipos

| Archivo | Uso |
|---------|-----|
| `logo-original.jpg` | Histórico — **no sobrescribir** |
| `vl-logo.svg` | Versión previa (conservada) |
| `vl-logo-v2-dark.svg` | Header/footer sobre oscuro (plata + rojo) |
| `vl-logo-v2-light.svg` | Fondos claros |
| `vl-monogram-v2.svg` | Monograma VL |
| `favicon-v2.svg` | Favicon |

Refinamiento gráfico del monograma pendiente si se requiere fidelidad pixel-perfect al archivo original.

---

## 8. Contenido restringido

- No inventar teléfono, correo, dirección ni redes.
- No publicar métricas (`metrics: []` en `site-config.json`).
- Sustituir por metodología / enfoque / valores cualitativos.
