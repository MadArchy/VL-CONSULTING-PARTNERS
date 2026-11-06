/**
 * Quita enlaces de menú/footer a Contacto.
 * Conserva CTAs con data-open-modal (cambia href a #).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "public");

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

let n = 0;
for (const file of walk(root)) {
  if (path.basename(file) === "contacto.html") continue;
  let text = fs.readFileSync(file, "utf8");
  const before = text;

  // Enlaces de navegación/footer cuyo texto es Contacto
  text = text.replace(/\s*<a href="(?:\.\.\/)?contacto\.html"[^>]*>\s*Contacto\s*<\/a>\s*/gi, "\n");

  // CTAs que apuntan a contacto.html pero abren modal → href="#"
  text = text.replace(
    /href="(?:\.\.\/)?contacto\.html"/gi,
    'href="#"'
  );
  text = text.replace(/href="#contacto"/gi, 'href="#"');

  if (text !== before) {
    fs.writeFileSync(file, text, "utf8");
    n += 1;
    console.log("updated", path.relative(root, file));
  }
}
console.log("files updated:", n);
