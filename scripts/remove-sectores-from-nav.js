/**
 * Quita "Sectores" de nav/footer; la sección vive en Inicio (#sectores).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');

const patterns = [
  /\s*<a href="(?:\.\.\/)?sectores\.html"[^>]*>\s*Sectores\s*<\/a>\s*/gi,
  /\s*<a href="(?:\.\.\/)?index\.html#sectores"[^>]*>\s*Sectores\s*<\/a>\s*/gi
];

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

let count = 0;
for (const file of walk(publicDir)) {
  if (path.basename(file) === 'sectores.html') continue;
  let text = fs.readFileSync(file, 'utf8');
  const before = text;
  for (const re of patterns) text = text.replace(re, '\n');
  if (text !== before) {
    fs.writeFileSync(file, text);
    count += 1;
    console.log('✓', path.relative(root, file));
  }
}
console.log(`Sectores removido de nav/footer en ${count} archivos`);
