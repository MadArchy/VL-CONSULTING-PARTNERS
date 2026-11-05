/**
 * Genera variantes WebP de fotografías clave si sharp está disponible.
 * Si no, documenta BLOCKED y no falla el build.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const require = createRequire(import.meta.url);

const sources = [
  "public/assets/images/hero/hero-boardroom.jpg",
  "public/assets/images/about/about-skyscraper.jpg",
  "public/assets/images/cta/cta-executive-desk.jpg"
];

let sharp;
try {
  sharp = require("sharp");
} catch {
  console.log("BLOCKED: sharp no instalado. Ejecute `npm i -D sharp` para generar WebP/AVIF.");
  process.exit(0);
}

for (const rel of sources) {
  const input = path.join(root, rel);
  if (!fs.existsSync(input)) {
    console.warn("SKIP missing", rel);
    continue;
  }
  const base = input.replace(/\.(jpe?g|png)$/i, "");
  await sharp(input).webp({ quality: 78 }).toFile(base + ".webp");
  await sharp(input).avif({ quality: 55 }).toFile(base + ".avif");
  console.log("OK", path.basename(base) + ".webp/.avif");
}
