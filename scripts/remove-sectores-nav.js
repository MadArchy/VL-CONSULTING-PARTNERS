/**
 * Quita enlaces de navegación/footer a Sectores en public/*.html
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

const patterns = [
  /\s*<a href="(?:\.\.\/)?sectores\.html"[^>]*>\s*Sectores\s*<\/a>\s*/gi,
  /\s*<a href="(?:\.\.\/)?sectores\.html"[^>]*>[\s\S]*?sectores\s*[›>]?\s*<\/a>\s*/gi
];

let n = 0;
for (const file of walk(root)) {
  let text = fs.readFileSync(file, "utf8");
  const before = text;
  for (const p of patterns) text = text.replace(p, "\n");
  if (text !== before) {
    fs.writeFileSync(file, text, "utf8");
    n += 1;
    console.log("updated", path.relative(root, file));
  }
}
console.log("files updated:", n);
