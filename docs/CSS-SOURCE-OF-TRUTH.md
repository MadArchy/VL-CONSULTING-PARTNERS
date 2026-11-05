# Fuente de verdad CSS

| Ubicación | Rol | Estado |
|---|---|---|
| `src/css/` | Tokens y estilos modulares Antigravity | **Fuente activa** |
| `public/assets/css/` | Copia publicada (generada por `npm run build`) | Salida de despliegue |
| `assets/css/styles.css` | Hoja monolítica de la Fase 2 (raíz) | **Legacy / no desplegar** |

## Reglas

1. Editar únicamente `src/css/*`.
2. Ejecutar `npm run build` para sincronizar a `public/assets/css` y `dist/`.
3. No enlazar `assets/css/styles.css` desde páginas de `public/`.
4. Tokens de marca viven en `src/css/variables.css`.

## Orden de carga (`public`)

`main.css` importa: reset → variables → typography → layout → components → animations.
