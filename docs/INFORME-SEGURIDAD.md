# Informe de Seguridad y Privacidad
## VL Consulting Partners — Fase 1

### 1. Resumen de Postura de Seguridad

Como parte de los compromisos de excelencia institucional de **VL Consulting Partners**, la arquitectura web implementada sigue los más altos estándares de seguridad y protección de datos:

| Requisito | Estado | Mecanismo de Mitigación |
| :--- | :--- | :--- |
| **Cero Secretos en Frontend** | ✅ CUMPLIDO | No existen API keys, contraseñas ni tokens en el cliente. |
| **Prevención de XSS** | ✅ CUMPLIDO | Eliminación de `innerHTML` vulnerable con fuentes no controladas; escape estricto en el generador de plantillas. |
| **Protección contra Clickjacking** | ✅ CUMPLIDO | Cabecera `X-Frame-Options: DENY` y directiva CSP `frame-ancestors 'none'`. |
| **Protección MIME Sniffing** | ✅ CUMPLIDO | Cabecera `X-Content-Type-Options: nosniff`. |
| **Cifrado en Tránsito (HTTPS)** | ✅ CUMPLIDO | HSTS estricto (`max-age=31536000; includeSubDomains; preload`). |
| **Content Security Policy (CSP)** | ✅ CUMPLIDO | Política restrictiva que limita scripts, fuentes e imágenes a orígenes autorizados. |
| **Aislamiento de Navegación** | ✅ CUMPLIDO | Atributos `rel="noopener noreferrer"` en todos los hipervínculos externos. |
| **Consentimiento de Privacidad** | ✅ CUMPLIDO | Checkbox obligatorio con advertencia de validación jurídica pendiente. |

---

### 2. Política de Seguridad de Contenidos (CSP) Implementada

Definida en `public/_headers`:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none';
```

- **Restricción de Fuentes:** Las familias tipográficas se sirven desde el propio sitio (`public/assets/fonts`).
- **Restricción de Conexiones:** El frontend solo permite llamadas seguras mediante `fetch` al propio dominio o al endpoint configurado de la API corporativa.
- **Sin Dependencias de Terceros Inseguras:** Cero scripts de rastreo invasivos ni librerías de CDN externas vulnerables.

---

### 3. Tratamiento de Datos y Formulario Comercial

En esta primera fase:
- No se persisten datos de navegación ni información personal en `localStorage` o `cookies` de seguimiento.
- Si el backend Spring Boot no está respondiendo en el entorno de pruebas, el formulario ofrece retroalimentación transparente e informativa al visitante, sin generar falsas confirmaciones de recepción.
