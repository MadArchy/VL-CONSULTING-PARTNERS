/**
 * Sanitiza HTML en public/ para eliminar datos institucionales no confirmados
 * y alinear dominio con content/site-config.json.
 *
 * Uso: node scripts/sanitize-public.js
 * También invocado desde build.js
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const config = JSON.parse(fs.readFileSync(path.join(root, "content", "site-config.json"), "utf8"));

const SITE_URL = (config.brand?.url || "https://www.example.com").replace(/\/$/, "");
const CONTACT_CONFIRMED = Boolean(config.contact?.isOfficialContactConfirmed);

const REPLACEMENTS = [
  [/Av\.\s*Empresarial\s*123,\s*Piso\s*10,\s*Distrito\s*Financiero/gi, "Dirección institucional pendiente de confirmación oficial"],
  [/Av\.\s*Empresarial\s*123,\s*Piso\s*10/gi, "Dirección institucional pendiente de confirmación oficial"],
  [/Ciudad Empresarial/gi, "Sede pendiente de confirmación oficial"],
  [/\+52\s*\(55\)\s*1234\s*5678(?:\s*\(Canal corporativo\))?/gi, "Teléfono pendiente de confirmación oficial"],
  [/contacto@vlconsultingpartners\.com/gi, CONTACT_CONFIRMED && config.contact.email ? config.contact.email : "Correo pendiente de confirmación oficial"],
  [/https:\/\/www\.vlconsultingpartners\.com/gi, SITE_URL],
  [/https:\/\/vlconsultingpartners\.com/gi, SITE_URL],
  [
    /https:\/\/www\.linkedin\.com\/company\/vl-consulting-partners/gi,
    config.social?.linkedin || ""
  ],
  [
    /https:\/\/www\.youtube\.com\/@vlconsultingpartners/gi,
    config.social?.youtube || ""
  ]
];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(html|xml|txt|js)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

function sanitizeJsonLd(html) {
  return html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi, (block, jsonText) => {
    try {
      const data = JSON.parse(jsonText);
      const clean = (obj) => {
        if (!obj || typeof obj !== "object") return;
        if (Array.isArray(obj)) {
          obj.forEach(clean);
          return;
        }
        delete obj.email;
        delete obj.telephone;
        delete obj.address;
        if (obj.url && typeof obj.url === "string" && obj.url.includes("vlconsultingpartners.com")) {
          obj.url = SITE_URL + (obj.url.endsWith("/") ? "/" : "");
        }
        if (obj.logo && typeof obj.logo === "string") {
          obj.logo = obj.logo.replace(/https:\/\/www\.vlconsultingpartners\.com/g, SITE_URL);
        }
        if (Array.isArray(obj.sameAs)) {
          obj.sameAs = (config.social?.linkedin || config.social?.youtube)
            ? [config.social.linkedin, config.social.youtube].filter(Boolean)
            : [];
        }
        Object.values(obj).forEach(clean);
      };
      clean(data);
      if (data["@type"] === "Organization" || data["@type"] === "ProfessionalService") {
        data.url = SITE_URL;
        data.name = config.brand?.name || data.name;
        data.slogan = config.brand?.lema || data.slogan;
      }
      return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`;
    } catch {
      return block;
    }
  });
}

function sanitizeFile(filePath) {
  let text = fs.readFileSync(filePath, "utf8");
  const original = text;
  for (const [pattern, value] of REPLACEMENTS) {
    text = text.replace(pattern, value);
  }
  if (filePath.endsWith(".html")) {
    text = sanitizeJsonLd(text);
    // Corregir placeholders literales rotos y redes no confirmadas
    text = text.replace(
      /<a href="\$\{config\.social\?\.linkedin[^"]*"[^>]*>LinkedIn<\/a>/gi,
      '<span class="footer-link" aria-disabled="true">LinkedIn (pendiente)</span>'
    );
    text = text.replace(
      /<a href="\$\{config\.social\?\.youtube[^"]*"[^>]*>YouTube<\/a>/gi,
      '<span class="footer-link" aria-disabled="true">YouTube (pendiente)</span>'
    );
    if (!config.social?.linkedin) {
      text = text.replace(
        /<a href="(?:|#social-pendiente)"[^>]*class="footer-link">LinkedIn<\/a>/gi,
        '<span class="footer-link" aria-disabled="true">LinkedIn (pendiente)</span>'
      );
    }
    if (!config.social?.youtube) {
      text = text.replace(
        /<a href="(?:|#social-pendiente)"[^>]*class="footer-link">YouTube<\/a>/gi,
        '<span class="footer-link" aria-disabled="true">YouTube (pendiente)</span>'
      );
    }
    // Open Graph canónico local
    text = text.replace(
      /(property="og:image" content=")[^"]+(")/gi,
      `$1${SITE_URL}/assets/images/og/og-default.jpg$2`
    );
    text = text.replace(
      /(name="twitter:image" content=")[^"]+(")/gi,
      `$1${SITE_URL}/assets/images/og/og-default.jpg$2`
    );
    // Neutralizar métricas numéricas ilustrativas en homepage
    text = text.replace(
      /<div class="metrics-stack">[\s\S]*?<\/div>\s*(?=<div style="margin-top: 2rem;">)/,
      `<div class="metrics-stack" role="list">
              <div class="metric-item" role="listitem">
                <div>
                  <div class="metric-number">Integridad</div>
                  <div class="metric-label">Decisiones con evidencia y transparencia</div>
                </div>
              </div>
              <div class="metric-item" role="listitem">
                <div>
                  <div class="metric-number">Confianza</div>
                  <div class="metric-label">Acompañamiento ejecutivo y confidencial</div>
                </div>
              </div>
              <div class="metric-item" role="listitem">
                <div>
                  <div class="metric-number">Crecimiento</div>
                  <div class="metric-label">Cuatro líneas de servicio coordinadas</div>
                </div>
              </div>
            </div>

            `
    );
  }
  if (text !== original) {
    fs.writeFileSync(filePath, text, "utf8");
    return true;
  }
  return false;
}

const files = walk(publicDir);
let changed = 0;
for (const file of files) {
  if (sanitizeFile(file)) {
    changed += 1;
    console.log("sanitized:", path.relative(root, file));
  }
}
console.log(`Sanitize complete. Files updated: ${changed}/${files.length}. Domain=${SITE_URL}`);
