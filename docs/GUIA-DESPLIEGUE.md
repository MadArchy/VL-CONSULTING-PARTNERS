# Guía de Despliegue y Operaciones en Producción
## VL Consulting Partners — Fase 1: Hosting Estático y Configuración de Dominio

### 1. Requisitos Previos

- Dominio corporativo oficial (ej. `vlconsultingpartners.com`).
- Acceso al panel de DNS del proveedor de dominio.
- Cuenta de alojamiento estático (se recomienda **Cloudflare Workers / Pages** o infraestructura convencional Nginx / Apache / S3).

---

### 2. Opción Recomendada: Cloudflare Workers Static Assets

Cloudflare ofrece distribución perimetral global ultra rápida con certificado SSL/TLS administrado de forma gratuita.

#### Paso A: Autenticación con Wrangler CLI
```bash
npx wrangler login
```

#### Paso B: Despliegue a Producción
El archivo `wrangler.toml` ya se encuentra configurado para servir la carpeta `./public`:

```bash
npx wrangler deploy
```

#### Paso C: Vinculación del Dominio Corporativo
1. Acceda al panel de Cloudflare > **Workers & Pages**.
2. Seleccione el proyecto `vl-consulting-partners`.
3. En la pestaña **Settings > Domains & Routes**, haga clic en **Add Custom Domain**.
4. Ingrese `vlconsultingpartners.com` y `www.vlconsultingpartners.com`.
5. Cloudflare gestionará automáticamente la emisión del certificado SSL/TLS y el enrutamiento Anycast global.

---

### 3. Opción Alternativa: Servidor Web Convencional (Nginx o Apache)

Si la firma prefiere hospedar el sitio en un servidor propio Linux o VPS:

#### Configuración de Nginx (`/etc/nginx/sites-available/vlconsultingpartners.conf`):

```nginx
server {
    listen 80;
    server_name vlconsultingpartners.com www.vlconsultingpartners.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name vlconsultingpartners.com www.vlconsultingpartners.com;

    ssl_certificate /etc/letsencrypt/live/vlconsultingpartners.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vlconsultingpartners.com/privkey.pem;

    root /var/www/vl-consulting-partners/public;
    index index.html;

    # Cabeceras de seguridad
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gestión de páginas de error
    error_page 404 /404.html;

    # Reglas de caché para assets estáticos
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location / {
        try_files $uri $uri/ $uri.html =404;
    }
}
```

---

### 4. Configuración de Google Search Console y Google Analytics

1. Ingrese a [Google Search Console](https://search.google.com/search-console).
2. Añada la propiedad de dominio: `vlconsultingpartners.com`.
3. Verifique la titularidad mediante registro TXT de DNS.
4. Envíe el mapa del sitio oficial: `https://www.vlconsultingpartners.com/sitemap.xml`.
5. Verifique que el archivo `robots.txt` sea leído correctamente sin bloqueos indebidos.
