/**
 * Contact form validation and submission interface.
 * No fake success: without a backend endpoint, the form stays in a
 * "ready for integration" state and explains next steps to the user.
 *
 * Future Java/backend contract (POST JSON or form-urlencoded):
 * {
 *   name: string,
 *   email: string,
 *   company?: string,
 *   phone?: string,
 *   service?: string,
 *   message: string,
 *   website?: string  // honeypot; must be empty
 * }
 */
(function () {
  "use strict";

  var form = document.querySelector("[data-contact-form]");
  if (!form) return;

  var endpoint = form.getAttribute("data-endpoint") || "";
  var statusBox = form.querySelector("[data-form-status]");
  var submitBtn = form.querySelector('[type="submit"]');

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  function setStatus(type, message) {
    if (!statusBox) return;
    statusBox.hidden = !message;
    statusBox.className = "form__notice form__notice--" + (type || "info");
    statusBox.textContent = message || "";
    statusBox.setAttribute("role", type === "error" ? "alert" : "status");
  }

  function fieldError(input, message) {
    var wrap = input.closest(".form-field");
    var err = wrap ? wrap.querySelector(".field-error") : null;
    input.setAttribute("aria-invalid", message ? "true" : "false");
    if (err) err.textContent = message || "";
  }

  function clearErrors() {
    form.querySelectorAll("[aria-invalid]").forEach(function (el) {
      fieldError(el, "");
    });
  }

  function validate() {
    clearErrors();
    var valid = true;
    var name = form.elements.namedItem("name");
    var email = form.elements.namedItem("email");
    var message = form.elements.namedItem("message");
    var honeypot = form.elements.namedItem("website");

    if (honeypot && String(honeypot.value || "").trim() !== "") {
      setStatus("error", "No se pudo enviar la solicitud.");
      return false;
    }

    if (!name || String(name.value).trim().length < 2) {
      fieldError(name, "Indique su nombre completo.");
      valid = false;
    }

    if (!email || !EMAIL_RE.test(String(email.value).trim())) {
      fieldError(email, "Indique un correo electrónico válido.");
      valid = false;
    }

    if (!message || String(message.value).trim().length < 20) {
      fieldError(message, "Describa su consulta (mínimo 20 caracteres).");
      valid = false;
    }

    if (!valid) {
      setStatus("error", "Revise los campos marcados e intente de nuevo.");
      var firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
    }

    return valid;
  }

  function payloadFromForm() {
    return {
      name: String(form.elements.namedItem("name").value || "").trim(),
      email: String(form.elements.namedItem("email").value || "").trim(),
      company: String((form.elements.namedItem("company") || {}).value || "").trim(),
      phone: String((form.elements.namedItem("phone") || {}).value || "").trim(),
      service: String((form.elements.namedItem("service") || {}).value || "").trim(),
      message: String(form.elements.namedItem("message").value || "").trim(),
      website: String((form.elements.namedItem("website") || {}).value || "").trim()
    };
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validate()) return;

    if (!endpoint) {
      setStatus(
        "info",
        "El formulario está validado, pero el envío aún no está conectado a un servidor. Configure data-endpoint o un backend (por ejemplo Java) para recibir mensajes. No se ha simulado un envío exitoso."
      );
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.setAttribute("aria-busy", "true");
    }
    setStatus("info", "Enviando su consulta…");

    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payloadFromForm())
    })
      .then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        form.reset();
        clearErrors();
        setStatus(
          "info",
          "Su consulta fue recibida. El equipo se pondrá en contacto a la brevedad."
        );
      })
      .catch(function () {
        setStatus(
          "error",
          "No fue posible enviar la consulta en este momento. Intente más tarde o use otro canal de contacto."
        );
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.removeAttribute("aria-busy");
        }
      });
  });

  ["blur", "input"].forEach(function (evt) {
    form.addEventListener(evt, function (event) {
      var target = event.target;
      if (!target || !target.name) return;
      if (["name", "email", "message"].indexOf(target.name) === -1) return;
      if (evt === "input" && target.getAttribute("aria-invalid") !== "true") return;
      // lightweight revalidation of touched invalid fields
      if (target.name === "name" && String(target.value).trim().length >= 2) fieldError(target, "");
      if (target.name === "email" && EMAIL_RE.test(String(target.value).trim())) fieldError(target, "");
      if (target.name === "message" && String(target.value).trim().length >= 20) fieldError(target, "");
    }, true);
  });
})();
