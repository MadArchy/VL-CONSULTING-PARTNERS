/**
 * Elimina pestaña/página Contacto del nav y footer.
 * CTAs "Agenda una consulta" → modal agenda-modal.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

const navRe = /\s*<a href="(?:\.\.\/)?contacto\.html"[^>]*>\s*Contacto\s*<\/a>\s*/gi;
const formLinkRe = /\s*<a href="(?:\.\.\/)?contacto\.html"[^>]*>\s*Formulario de contacto\s*<\/a>\s*/gi;

let n = 0;
for (const file of walk(publicDir)) {
  if (path.basename(file) === 'contacto.html') continue;
  let text = fs.readFileSync(file, 'utf8');
  const before = text;

  text = text.replace(navRe, '\n');
  text = text.replace(formLinkRe, '\n');

  // CTAs que apuntaban a contacto → modal
  text = text.replace(
    /href="(?:\.\.\/)?contacto\.html"(\s+class="btn[^"]*")/g,
    'href="#"$1 data-open-modal="agenda-modal"'
  );
  text = text.replace(
    /href="(?:\.\.\/)?contacto\.html"/g,
    'href="#"'
  );

  if (text !== before) {
    fs.writeFileSync(file, text);
    n += 1;
    console.log('✓', path.relative(root, file));
  }
}
console.log(`Contacto removido / CTAs a modal en ${n} archivos`);
