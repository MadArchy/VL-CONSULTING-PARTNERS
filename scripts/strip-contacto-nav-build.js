import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = [
  path.join(root, 'scripts', 'build.js'),
  path.join(root, 'scripts', 'apply-phase4-nav.js'),
  path.join(root, 'scripts', 'patch-build-phase4.js')
];

const navRe = /\s*<a href="(?:\.\.\/)?contacto\.html"[^>]*>\s*Contacto\s*<\/a>\s*/gi;

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let s = fs.readFileSync(file, 'utf8');
  s = s.replace(navRe, '\n');
  // CTAs en plantillas → modal
  s = s.replace(
    /href="\.\.\/contacto\.html"(\s+class="btn[^"]*")/g,
    'href="#"$1 data-open-modal="agenda-modal"'
  );
  s = s.replace(
    /href="contacto\.html"(\s+class="btn[^"]*")/g,
    'href="#"$1 data-open-modal="agenda-modal"'
  );
  fs.writeFileSync(file, s);
  console.log('✓', path.relative(root, file));
}
