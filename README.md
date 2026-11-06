# VL Consulting Partners — Plataforma Web Corporativa

> **Lema:** *Integridad, confianza y crecimiento.*  
> **Fase 3:** Consolidación, validación local y preparación staging (ver `VL_CONSULTING_FASE3_VALIDACION.md`).

---

## 🌟 Descripción del Proyecto

Plataforma web institucional desarrollada desde cero para la firma de consultoría **VL Consulting Partners**, especializada en **Auditoría Financiera, Planeación Tributaria, Consultoría Estratégica y Cumplimiento Normativo (Compliance)**.

La plataforma implementa un diseño corporativo sobrio, elegante y de alto prestigio basado en el logotipo y mockups oficiales de la marca, utilizando tecnologías web estándar (HTML5 semántico, CSS3 modular con variables, JavaScript ES Modules y un generador estático ligero para publicaciones en Markdown).

---

## 🚀 Inicio Rápido en Entorno Local

### 1. Requisitos
- Node.js v18 o superior instalado.

### 2. Instalación de Dependencias de Compilación
```bash
npm install
```

### 3. Compilación de Assets y Artículos Markdown
```bash
npm run build
```

### 4. Servidor de Previsualización Local
```bash
npm run serve
```
Abra su navegador en: `http://localhost:3000`

### 5. Auditoría Técnica Automatizada (Validación)
```bash
npm run validate
npm run test:e2e
```

Informes: `VL_CONSULTING_PRODUCTION_READINESS.md`, `VL_CONSULTING_FASE3_VALIDACION.md`.  
Dominio y contacto oficiales se configuran solo en `content/site-config.json` (no inventar datos).

---

## 📁 Estructura del Código

- `content/`: Artículos de análisis en Markdown y archivo central de configuración `site-config.json`.
- `docs/`: Documentación de arquitectura, manual de publicaciones, guía de despliegue e informe de seguridad.
- `public/`: Sitio que se publica. Cloudflare, Netlify y GitHub Pages deben servir esta carpeta, no la raíz del repositorio.
- `public/assets/fonts/`: Tipografías Cinzel, Playfair Display y Plus Jakarta Sans, incluidas en el proyecto.
- `public/assets/images/`: Logotipo, fotografía principal y demás imágenes del sitio.
- `brand/`: Archivos maestros del logotipo.
- `scripts/`: Herramientas en Node.js (`build.js`, `serve.js`, `validate.js`).
- `src/`: Código fuente de estilos CSS y módulos JavaScript. El servidor local sirve la copia que está en `public/`.

---

## 🔐 Seguridad y Cumplimiento Normativo

- **Cero dependencias pesadas en producción:** Salida HTML/CSS/JS estática pura.
- **Preparado para Backend Spring Boot:** Estructura DTO de solicitudes comerciales lista para `POST /api/v1/contacto`.
- **Cabeceras HTTP de Seguridad:** CSP, HSTS, X-Frame-Options y X-Content-Type-Options configuradas en `public/_headers`.
