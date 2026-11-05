# Manual Editorial y Gestión de Publicaciones
## Sección: "Actualidad y Conocimiento" — VL Consulting Partners

Este manual describe el procedimiento para redactar, editar y publicar nuevos artículos de análisis estratégico en el portal web sin necesidad de tocar código HTML ni componentes de diseño.

---

### 1. Dónde se guardan los artículos

Todos los artículos se gestionan como archivos individuales en formato Markdown dentro de la carpeta:
`content/publicaciones/`

Cada archivo debe tener la extensión `.md`.

---

### 2. Estructura de un Artículo

Cada archivo Markdown comienza con un bloque de metadatos (Frontmatter) delimitado por `---` al inicio y al final:

```markdown
---
title: "Título Impactante del Análisis Estratégico"
slug: "titulo-impactante-analisis-estrategico"
category: "Impuestos"
date: "2025-03-01"
author: "Equipo Tributario VL Consulting"
authorRole: "División de Asesoría Fiscal"
excerpt: "Resumen conciso de 2 o 3 líneas que explica el valor del artículo para los directivos."
coverImage: "assets/images/about/about-skyscraper.jpg"
tags: ["Impuestos", "Estrategia", "Finanzas"]
readTime: "5 min de lectura"
metaDescription: "Descripción breve optimizada para los resultados de búsqueda de Google (máximo 155 caracteres)."
---

## Primer subtítulo del artículo

Escriba aquí los párrafos de su artículo. Puede utilizar formato Markdown estándar:

- **Negritas** para conceptos clave.
- *Cursivas* para términos técnicos o en otros idiomas.
- Listas con viñetas para enumerar recomendaciones.

> "Puede incluir citas destacadas utilizando el símbolo mayor que."

### Subtítulo de segundo nivel

Desarrolle las conclusiones y recomendaciones directivas.
```

---

### 3. Categorías Disponibles

Para mantener la coherencia institucional, utilice preferentemente las siguientes categorías:

- `Auditoría`
- `Impuestos`
- `Consultoría`
- `Cumplimiento`
- `Gobierno Corporativo`

---

### 4. Cómo Publicar o Actualizar el Sitio

Una vez guardado o modificado el archivo `.md`, ejecute en su terminal:

```bash
npm run build
```

El compilador automático realizará las siguientes tareas en menos de un segundo:
1. Leerá el archivo Markdown y validará los metadatos.
2. Generará la página HTML del artículo en `public/publicaciones/<slug>.html`.
3. Inyectará automáticamente:
   - Cabecera y pie corporativo.
   - Metadatos Open Graph para LinkedIn, X y WhatsApp.
   - Datos estructurados Schema.org para Google.
   - Botones para compartir en redes.
   - Bloque de llamada a la acción para agendar consulta.
4. Actualizará la página de catálogo general: `public/publicaciones.html`.
5. Actualizará `public/sitemap.xml` con la fecha y URL del nuevo artículo.
