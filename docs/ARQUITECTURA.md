# Arquitectura Técnica y Especificación de Integración
## VL Consulting Partners — Fase 1: Plataforma Web Corporativa

### 1. Resumen Ejecutivo de Arquitectura

La plataforma web de **VL Consulting Partners** ha sido diseñada bajo una arquitectura **Jamstack pura (JavaScript, APIs y Markup)** sin frameworks monolíticos frontend. Esta decisión técnica garantiza:

- **Velocidad de carga máxima (Time To First Byte < 50ms):** Al servirse como archivos HTML estáticos pre-renderizados desde la red perimetral (Edge CDN).
- **Seguridad perimetral absoluta:** Sin superficie de ataque en base de datos ni ejecución de código vulnerable del lado del cliente.
- **Costos operativos mínimos y escalabilidad infinita:** Compatible de manera nativa con almacenamiento estático y CDN global (Cloudflare Workers Static Assets, AWS S3 + CloudFront o servidores Nginx/Apache estándar).
- **Indexación SEO perfecta:** 100% del contenido está presente en el código HTML inicial sin necesidad de renderizado JavaScript en el motor de búsqueda.

---

### 2. Estructura de Directorios

```text
VL CONSULTING PARTNERS/
├── content/                              # Contenido editable por el equipo
│   ├── publicaciones/                   # Artículos en formato Markdown (.md)
│   │   ├── auditoria-control-interno-entornos-digitales.md
│   │   ├── marcos-de-cumplimiento-y-gobierno-corporativo.md
│   │   └── planeacion-tributaria-estrategica-gestion-fiscal.md
│   └── site-config.json                  # Datos institucionales centralizados
├── docs/                                 # Documentación técnica y gobernanza
│   ├── ARQUITECTURA.md                   # Este documento
│   ├── GUIA-DESPLIEGUE.md               # Procedimientos de hosting y DNS
│   ├── INFORME-SEGURIDAD.md              # Auditoría de seguridad y políticas CSP
│   ├── MANUAL-PUBLICACIONES.md           # Guía editorial de Markdown
│   └── references/                       # Logotipo original y mockups de diseño
├── public/                               # Salida estática compilada (Directorio raíz de despliegue)
│   ├── 404.html                          # Página de error corporativa
│   ├── auditoria.html                    # Línea de servicio: Auditoría
│   ├── consultoria.html                  # Línea de servicio: Consultoría
│   ├── contacto.html                     # Canal comercial y formulario
│   ├── cumplimiento.html                 # Línea de servicio: Cumplimiento
│   ├── favicon.ico                       # Favicon estándar
│   ├── favicon.svg                       # Favicon vectorial con monograma
│   ├── impuestos.html                    # Línea de servicio: Impuestos
│   ├── index.html                        # Homepage institucional completa
│   ├── nosotros.html                     # Identidad, misión, visión y metodología
│   ├── privacidad.html                   # Aviso de privacidad
│   ├── publicaciones.html                # Catálogo de Actualidad y Conocimiento
│   ├── publicaciones/                    # Artículos generados estáticamente
│   ├── robots.txt                        # Directivas para rastreadores de Google
│   ├── sectores.html                     # Sectores económicos atendidos
│   ├── sitemap.xml                       # Mapa de sitio XML indexable
│   ├── terminos.html                     # Términos y condiciones
│   ├── _headers                          # Cabeceras de seguridad HTTP
│   └── assets/                           # Recursos multimedia
│       ├── css/                          # Hojas de estilo modulares
│       ├── js/                           # Módulos JavaScript estándar (ESM)
│       └── images/                       # Fotografías, logotipos y vectores
├── scripts/                              # Herramientas de soporte y compilación
│   ├── build.js                          # Compilador estático Markdown -> HTML
│   ├── serve.js                          # Servidor local de desarrollo
│   └── validate.js                       # Auditoría automatizada de enlaces y SEO
├── src/                                  # Código fuente modular
│   ├── css/                              # Tokens y estilos modulares
│   └── js/                               # Módulos JavaScript desacoplados
├── package.json                          # Metadatos del proyecto y comandos npm
├── wrangler.toml                         # Configuración de Cloudflare Workers
└── .gitignore                            # Exclusiones de control de versiones
```

---

### 3. Preparación para Futuro Backend: Java con Spring Boot

El frontend está preparado arquitectónicamente para comunicarse con un microservicio backend en **Java Spring Boot**.

#### Contrato de Integración de API (REST API)

- **Endpoint de Contacto:** `POST /api/v1/contacto`
- **Content-Type:** `application/json; charset=UTF-8`

#### Modelo DTO (Data Transfer Object) en Spring Boot

```java
package com.vlconsulting.platform.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public record ContactoRequestDTO(
    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 3, max = 120, message = "El nombre debe contener entre 3 y 120 caracteres")
    String nombre,

    @NotBlank(message = "La empresa es obligatoria")
    @Size(min = 2, max = 150, message = "El nombre de empresa es inválido")
    String empresa,

    @NotBlank(message = "El correo electrónico es obligatorio")
    @Email(message = "Formato de correo electrónico inválido")
    String email,

    @Size(max = 25)
    String telefono,

    @NotBlank(message = "Debe seleccionar un área de servicio")
    String servicio,

    @NotBlank(message = "El mensaje no puede estar vacío")
    @Size(min = 10, max = 2500, message = "El mensaje debe contener entre 10 y 2500 caracteres")
    String mensaje,

    @NotNull(message = "Debe aceptar la política de privacidad")
    Boolean consentimientoAceptado,

    String origen,
    Instant timestamp
) {}
```

#### Respuesta Esperada del Backend

```json
{
  "status": "success",
  "ticketId": "VLC-2025-0891",
  "receivedAt": "2025-02-15T18:30:00Z",
  "message": "Solicitud registrada formalmente. Un consultor sénior se comunicará a la brevedad."
}
```

---

### 4. Sistema Visual y Tokens de Diseño

El sistema visual respeta rigurosamente los lineamientos de marca:

| Token | Código Hexadecimal | Propósito |
| :--- | :--- | :--- |
| `--color-primary-navy` | `#081C30` | Fondo principal corporativo y barra de navegación |
| `--color-corporate-blue` | `#123B60` | Acentos de marca, fondos de tarjetas y contrastes |
| `--color-gold-premium` | `#C9A45A` | Dorado insignia para bordes, botones primarios y monograma |
| `--color-gold-warm` | `#E0C078` | Dorado luminoso para títulos destacados y estados hover |
| `--color-ivory` | `#F7F5F0` | Fondo marfil para secciones claras con alto contraste |
| `--color-deep-black` | `#080B10` | Fondo de footer y contraste profundo nocturno |

Tipografías seleccionadas:
- **Encabezados:** *Cinzel* y *Playfair Display* (Serif de distinción ejecutiva).
- **Cuerpo y UI:** *Plus Jakarta Sans* e *Inter* (Sans-serif moderna de legibilidad óptima).
