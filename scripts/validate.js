/**
 * VL CONSULTING PARTNERS - Script de Validación Técnica
 * Comprueba integridad de enlaces internos, imágenes, metadatos SEO y sintaxis básica.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

let errorCount = 0;
let warnCount = 0;

console.log('======================================================');
console.log('  VL CONSULTING PARTNERS - AUDITORÍA TÉCNICA');
console.log('======================================================\n');

// 1. Listar todos los archivos HTML
function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const htmlFiles = getHtmlFiles(publicDir);
console.log(`[1] Verificando ${htmlFiles.length} páginas HTML encontradas...`);

htmlFiles.forEach(filePath => {
  const relPath = path.relative(publicDir, filePath);
  const content = fs.readFileSync(filePath, 'utf8');

  // Plantillas de captura OG no son páginas publicables
  if (relPath.includes(`${path.sep}og${path.sep}`) || relPath.endsWith('og-template.html')) {
    console.log(`  · omitido (plantilla): ${relPath}`);
    return;
  }

  // Check 1: DOCTYPE
  if (!content.includes('<!DOCTYPE html>')) {
    console.error(`  ❌ [${relPath}]: Falta <!DOCTYPE html>`);
    errorCount++;
  }

  // Check 2: lang="es"
  if (!content.includes('lang="es"')) {
    console.warn(`  ⚠️ [${relPath}]: Falta atributo lang="es" en <html>`);
    warnCount++;
  }

  // Check 3: <title>
  if (!/<title>[\s\S]+<\/title>/.test(content)) {
    console.error(`  ❌ [${relPath}]: Falta etiqueta <title> descriptiva`);
    errorCount++;
  }

  // Check 4: meta description
  if (!content.includes('name="description"')) {
    console.warn(`  ⚠️ [${relPath}]: Falta <meta name="description">`);
    warnCount++;
  }

  // Check 5: viewport
  if (!content.includes('name="viewport"')) {
    console.error(`  ❌ [${relPath}]: Falta <meta name="viewport"> para responsive`);
    errorCount++;
  }

  // Check 6: Enlaces internos (href="...")
  const hrefMatches = content.matchAll(/href="([^"#:]+?)(?:#[^"]*)?"/g);
  for (const match of hrefMatches) {
    const target = match[1];
    if (target.includes('${')) {
      console.error(`  ❌ [${relPath}]: href con placeholder no resuelto '${target}'`);
      errorCount++;
      continue;
    }
    if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('mailto:') || target.startsWith('tel:')) {
      continue;
    }
    const currentDir = path.dirname(filePath);
    const resolvedPath = path.resolve(currentDir, target);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`  ❌ [${relPath}]: Enlace roto hacia '${target}' (Ruta resuelta no existe: ${resolvedPath})`);
      errorCount++;
    }
  }

  // Check 7: Imágenes internas (src="...")
  const srcMatches = content.matchAll(/src="([^":]+)"/g);
  for (const match of srcMatches) {
    const target = match[1];
    if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('data:')) {
      continue;
    }
    const currentDir = path.dirname(filePath);
    const resolvedPath = path.resolve(currentDir, target);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`  ❌ [${relPath}]: Imagen faltante '${target}'`);
      errorCount++;
    }
  }
});

// 2. Verificar Sitemap y Robots
console.log('\n[2] Verificando archivos SEO centrales...');
const sitemapPath = path.join(publicDir, 'sitemap.xml');
const robotsPath = path.join(publicDir, 'robots.txt');

if (fs.existsSync(sitemapPath)) {
  console.log('  ✓ sitemap.xml presente');
} else {
  console.error('  ❌ sitemap.xml ausente');
  errorCount++;
}

if (fs.existsSync(robotsPath)) {
  console.log('  ✓ robots.txt presente');
} else {
  console.error('  ❌ robots.txt ausente');
  errorCount++;
}

// 3. Resultado final
console.log('\n======================================================');
if (errorCount === 0) {
  console.log(`  ✓ AUDITORÍA SUPERADA CON ÉXITO: 0 Errores, ${warnCount} Advertencias.`);
  console.log('======================================================\n');
  process.exit(0);
} else {
  console.error(`  ❌ AUDITORÍA FALLIDA: ${errorCount} Errores encontrados.`);
  console.log('======================================================\n');
  process.exit(1);
}
