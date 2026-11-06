import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = [
  path.join(root, 'scripts', 'build.js'),
  path.join(root, 'scripts', 'apply-phase4-nav.js'),
  path.join(root, 'scripts', 'patch-build-phase4.js')
];
const re = /\s*<a href="(?:\.\.\/)?nosotros\.html"[^>]*>\s*Nosotros\s*<\/a>\s*/gi;

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let s = fs.readFileSync(file, 'utf8');
  const next = s.replace(re, '\n');
  if (next !== s) {
    fs.writeFileSync(file, next);
    console.log('✓', path.relative(root, file));
  }
}
