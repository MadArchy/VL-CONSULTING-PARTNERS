/**
 * Elimina enlaces "Nosotros" de nav/footer en HTML público.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const re = /\s*<a href="(?:\.\.\/)?nosotros\.html"[^>]*>\s*Nosotros\s*<\/a>\s*/gi;

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

let n = 0;
for (const file of walk(publicDir)) {
  if (path.basename(file) === 'nosotros.html') continue;
  let text = fs.readFileSync(file, 'utf8');
  const next = text.replace(re, '\n');
  if (next !== text) {
    fs.writeFileSync(file, next);
    n += 1;
    console.log('✓', path.relative(root, file));
  }
}
console.log(`Nosotros removido de nav/footer en ${n} archivos`);
