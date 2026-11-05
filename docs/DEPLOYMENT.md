# Guía de despliegue — VL Consulting Partners

Sitio estático (HTML/CSS/JS). No requiere build. Preparado para hosting estático y para añadir Java más adelante sin reconstruir el frontend.

## 1. Requisitos previos

- Dominio propio confirmado por la firma.
- Hosting con HTTPS (Netlify, Cloudflare Pages, S3+CloudFront, Apache/Nginx, etc.).
- Acceso a DNS del dominio.
- Logotipo oficial (reemplazar `assets/img/logo.svg` si corresponde).
- Revisión jurídica de la política de privacidad.

## 2. Sustituir placeholders

Buscar y reemplazar en todo el proyecto:

| Placeholder | Uso |
|---|---|
| `https://www.example.com` | Canonical, Open Graph, JSON-LD, sitemap, robots |
| `data-endpoint=""` en el formulario | URL del API de contacto (futuro Java u otro backend) |

Archivos clave: `index.html`, páginas internas, `sitemap.xml`, `robots.txt`.

## 3. Dominio personalizado

1. Crear registro DNS según el proveedor (A/AAAA o CNAME).
2. Apuntar el apex y `www` al hosting.
3. Preferir redirección canónica única (`www` → apex o viceversa).
4. Actualizar canonical/OG/sitemap con la URL final.

## 4. HTTPS

1. Activar certificado TLS gestionado por el hosting o Let's Encrypt.
2. Forzar HTTPS (redirect 301).
3. En Apache, descomentar reglas HTTPS en `.htaccess` solo cuando TLS esté activo.
4. Verificar HSTS tras confirmar estabilidad del dominio.

## 5. Google Search Console

1. Verificar propiedad del dominio (DNS TXT o archivo HTML).
2. Enviar `sitemap.xml`.
3. Inspeccionar URL de inicio y solicitar indexación.
4. Revisar cobertura y experiencia de página tras el despliegue.

## 6. Google Analytics / Ads (opcional)

1. Crear propiedad GA4.
2. Descomentar el bloque de analytics en `index.html` (y réplicas si se desea medición global).
3. Usar Consent Mode si la jurisdicción lo exige.
4. No conectar Google Ads hasta tener baseline de tráfico y conversiones del formulario.

## 7. Procedimiento de actualización

1. Editar HTML/CSS/JS en local.
2. Probar con servidor local (`npx serve .` o equivalente).
3. Verificar enlaces, formulario y responsive.
4. Actualizar `sitemap.xml` si hay URLs nuevas.
5. Publicar al hosting (arrastrar carpeta, CLI o CI).
6. Purgar CDN/caché si aplica.
7. Verificar la homepage en producción.

## 8. Rollback

1. Conservar la versión anterior del sitio (tag Git, snapshot del hosting o carpeta comprimida).
2. Republicar el snapshot previo.
3. Si DNS cambió, revertir registros solo si el fallo es de apuntado.
4. Documentar causa y corrección.

## 9. Checklist de salida a producción

- [ ] Dominio y HTTPS activos
- [ ] Placeholders `example.com` eliminados
- [ ] Logo oficial validado
- [ ] Privacidad revisada por asesoría jurídica
- [ ] Formulario conectado a backend real **o** mensaje de estado no engañoso verificado
- [ ] `robots.txt` y `sitemap.xml` con dominio real
- [ ] Search Console verificado y sitemap enviado
- [ ] Headers de seguridad activos en el hosting
- [ ] Prueba móvil 375 / 768 / 1024 / 1440
- [ ] Sin datos institucionales inventados
- [ ] Backup / rollback disponible
- [ ] Autorización explícita de publicación

## 10. Integración futura con Java

El frontend puede permanecer estático. El backend Java debería:

1. Exponer `POST /api/contact` (JSON) con validación servidor.
2. Configurarse en `data-endpoint` del formulario.
3. Aplicar rate limiting, CAPTCHA/honeypot reforzado y almacenamiento seguro.
4. Nunca exponer secretos SMTP o API keys al navegador.
