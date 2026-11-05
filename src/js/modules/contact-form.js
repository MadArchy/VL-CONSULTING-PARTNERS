/**
 * VL CONSULTING PARTNERS - Módulo de Formulario de Contacto
 * Validación accesible, estructuración DTO para Java Spring Boot
 * e información transparente de estado en Fase 1
 */

export function initContactForms() {
  const forms = document.querySelectorAll('.vl-contact-form');

  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Limpiar estados previos
      clearFormErrors(form);

      const nombreInput = form.querySelector('[name="nombre"]');
      const empresaInput = form.querySelector('[name="empresa"]');
      const emailInput = form.querySelector('[name="email"]');
      const telefonoInput = form.querySelector('[name="telefono"]');
      const servicioInput = form.querySelector('[name="servicio"]');
      const mensajeInput = form.querySelector('[name="mensaje"]');
      const consentimientoInput = form.querySelector('[name="consentimiento"]');
      const submitBtn = form.querySelector('button[type="submit"]');
      const feedbackContainer = form.querySelector('.form-feedback') || createFeedbackContainer(form);

      let isValid = true;

      // Validación: Nombre
      if (!nombreInput || !nombreInput.value.trim() || nombreInput.value.trim().length < 3) {
        showFieldError(nombreInput, 'Por favor, ingrese su nombre y apellido completo (mínimo 3 caracteres).');
        isValid = false;
      }

      // Validación: Empresa
      if (!empresaInput || !empresaInput.value.trim()) {
        showFieldError(empresaInput, 'Por favor, ingrese el nombre de su empresa u organización.');
        isValid = false;
      }

      // Validación: Correo electrónico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
        showFieldError(emailInput, 'Por favor, ingrese un correo electrónico corporativo válido.');
        isValid = false;
      }

      // Validación: Servicio
      if (!servicioInput || !servicioInput.value) {
        showFieldError(servicioInput, 'Por favor, seleccione el área de servicio de su interés.');
        isValid = false;
      }

      // Validación: Mensaje
      if (!mensajeInput || mensajeInput.value.trim().length < 10) {
        showFieldError(mensajeInput, 'Por favor, describa brevemente sus objetivos o requerimientos (mínimo 10 caracteres).');
        isValid = false;
      }

      // Validación: Consentimiento
      if (!consentimientoInput || !consentimientoInput.checked) {
        showFieldError(consentimientoInput, 'Debe aceptar la política de tratamiento de datos (pendiente de validación jurídica).');
        isValid = false;
      }

      if (!isValid) {
        feedbackContainer.innerHTML = `
          <div class="alert alert-error" role="alert" style="padding: 12px; background: rgba(239, 68, 68, 0.15); border: 1px solid #EF4444; border-radius: 6px; color: #FCA5A5; font-size: 0.875rem; margin-top: 16px;">
            <strong>Campos incompletos o inválidos:</strong> Por favor revise los campos señalados en rojo antes de continuar.
          </div>
        `;
        return;
      }

      // Estructura de datos preparada para el backend Spring Boot
      const payload = {
        nombre: nombreInput.value.trim(),
        empresa: empresaInput.value.trim(),
        email: emailInput.value.trim(),
        telefono: telefonoInput ? telefonoInput.value.trim() : null,
        servicio: servicioInput.value,
        mensaje: mensajeInput.value.trim(),
        consentimientoAceptado: true,
        origen: window.location.pathname,
        timestamp: new Date().toISOString()
      };

      // Estado de carga en botón
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Enviar';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span style="display:inline-block; animation: spin 1s linear infinite; margin-right: 8px;">⏳</span>
          Validando solicitud...
        `;
      }

      try {
        // Intento de conexión al endpoint del backend Spring Boot
        const response = await fetch('/api/v1/contacto', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          feedbackContainer.innerHTML = `
            <div class="alert alert-success" role="alert" style="padding: 14px; background: rgba(16, 185, 129, 0.15); border: 1px solid #10B981; border-radius: 6px; color: #6EE7B7; font-size: 0.875rem; margin-top: 16px;">
              <strong>Solicitud recibida:</strong> Su requerimiento ha sido registrado formalmente. Un socio consultor se comunicará a la brevedad.
            </div>
          `;
          form.reset();
        } else {
          throw new Error('Endpoint no disponible');
        }
      } catch (err) {
        // Manejo transparente conforme a la especificación de Fase 1:
        // No simular envíos exitosos falsos sin backend configurado.
        feedbackContainer.innerHTML = `
          <div class="alert alert-info" role="alert" style="padding: 16px; background: rgba(18, 59, 96, 0.4); border: 1px solid var(--color-gold-premium); border-radius: 6px; color: var(--color-ivory); font-size: 0.875rem; margin-top: 16px; line-height: 1.5;">
            <div style="display: flex; align-items: flex-start; gap: 10px;">
              <span style="font-size: 1.25rem; color: var(--color-gold-warm);">ℹ️</span>
              <div>
                <strong style="color: var(--color-gold-warm); display: block; margin-bottom: 4px;">Información de Fase 1 (Frontend):</strong>
                La validación de sus datos se completó con éxito. La interfaz de integración con el servicio backend Java Spring Boot (<code>POST /api/v1/contacto</code>) está arquitectada y preparada.
                <br><br>
                <em>Conforme a los lineamientos del proyecto, no se simulan confirmaciones ficticias mientras el servidor backend de producción no esté activo.</em>
                <br><br>
                Cuando exista un canal de contacto oficial confirmado por la firma, se publicará aquí. Mientras tanto, use el formulario una vez conectado el backend.
              </div>
            </div>
          </div>
        `;
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  });

  function showFieldError(field, message) {
    if (!field) return;
    field.classList.add('is-invalid');
    let errorElem = field.parentElement?.querySelector('.form-error-msg');
    if (!errorElem) {
      errorElem = document.createElement('span');
      errorElem.className = 'form-error-msg';
      field.parentElement?.appendChild(errorElem);
    }
    errorElem.textContent = message;
    errorElem.style.display = 'block';
  }

  function clearFormErrors(form) {
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    form.querySelectorAll('.form-error-msg').forEach(el => el.style.display = 'none');
  }

  function createFeedbackContainer(form) {
    const div = document.createElement('div');
    div.className = 'form-feedback';
    form.appendChild(div);
    return div;
  }
}
