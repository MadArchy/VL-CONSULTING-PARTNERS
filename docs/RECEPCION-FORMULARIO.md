# Recepción segura de solicitudes de contacto

## Estado actual

- Validación en cliente: **activa**
- Envío a servidor: **bloqueado** hasta configurar endpoint real
- Éxito ficticio: **prohibido** (no se muestra)

## Solución recomendada (sencilla y segura)

1. Mantener el frontend estático.
2. Exponer un endpoint HTTPS en el mismo dominio o subdominio API, por ejemplo:
   - `POST /api/v1/contacto`
3. Implementar el receptor en el servidor (Java Spring Boot u otro), **nunca** con claves SMTP en el navegador.
4. Configurar en `content/site-config.json`:

```json
"api": {
  "endpoint": "/api/v1/contacto",
  "environment": "production"
}
```

O en el formulario:

```html
<form class="vl-contact-form" data-endpoint="/api/v1/contacto" novalidate>
```

5. Controles mínimos del servidor:
   - Validación de campos
   - Rate limiting / CAPTCHA o honeypot reforzado
   - CORS restringido al dominio oficial
   - Almacenamiento o reenvío de correo con secretos en variables de entorno
   - Registro de auditoría sin datos sensibles innecesarios

## Alternativa temporal (sin backend propio)

Usar un servicio de formularios con contrato y DPA (p. ej. Formspree, Basin, Getform) solo si:
- la firma aprueba el proveedor,
- no se exponen secretos en frontend más allá de un endpoint público controlado,
- y la política de privacidad lo refleja.

## Bloqueo actual

Faltan:
- Endpoint de producción
- Credenciales de correo / API
- Datos de contacto oficiales confirmados

Hasta entonces el formulario valida y explica el estado pendiente.
