/**
 * Deriva variantes V5 del logotipo oficial sin sobrescribir los originales.
 * Recolorea el acento rojo a azul corporativo y retira el fondo negro.
 * El wordmark claro se conserva para fondo oscuro y se pasa a azul nocturno
 * para el header blanco. No es una recreación tipográfica.
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logoDir = path.resolve(__dirname, '..', 'public', 'assets', 'images', 'logo');

function isRed(r, g, b) {
  return r > 70 && r > g * 1.35 && r > b * 1.15 && r - b > 25;
}

function clamp(n) {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function toBlue(r, g, b) {
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return [
    clamp(0 + lum * 40),
    clamp(40 + lum * 150),
    clamp(90 + lum * 165)
  ];
}

function toNavy(r, g, b) {
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const shade = 1 - lum;
  return [
    clamp(7 + shade * 28),
    clamp(30 + shade * 22),
    clamp(51 + shade * 18)
  ];
}

function findSplitX(data, width, height, channels) {
  const density = new Array(width).fill(0);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (Math.max(r, g, b) > 36) density[x]++;
    }
  }
  const start = Math.floor(width * 0.18);
  const end = Math.floor(width * 0.55);
  let bestX = Math.floor(width * 0.34);
  let best = Infinity;
  const window = 6;
  for (let x = start; x < end; x++) {
    let sum = 0;
    for (let k = 0; k < window; k++) sum += density[x + k] || 0;
    if (sum < best) {
      best = sum;
      bestX = x + Math.floor(window / 2);
    }
  }
  return bestX;
}

async function processLogo(inputName, outputName, { recolorWordmark }) {
  const input = path.join(logoDir, inputName);
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const splitX = recolorWordmark ? findSplitX(data, width, height, channels) : width;
  const out = Buffer.from(data);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      let r = out[i];
      let g = out[i + 1];
      let b = out[i + 2];
      let a = out[i + 3];
      const max = Math.max(r, g, b);

      if (max < 16) {
        out[i + 3] = 0;
        continue;
      }

      const nearWhite = r > 170 && g > 170 && b > 170 && (max - Math.min(r, g, b)) < 40;
      const inSlogan = y > height * 0.8;
      if (isRed(r, g, b)) {
        [r, g, b] = toBlue(r, g, b);
      } else if (recolorWordmark && ((x > splitX && max > 90) || (nearWhite && inSlogan))) {
        [r, g, b] = toNavy(r, g, b);
      }

      if (max < 48 && !isRed(data[i], data[i + 1], data[i + 2])) {
        a = clamp(((max - 16) / 32) * 255);
      }

      out[i] = r;
      out[i + 1] = g;
      out[i + 2] = b;
      out[i + 3] = a;
    }
  }

  const outPath = path.join(logoDir, outputName);
  await sharp(out, { raw: { width, height, channels } }).png().toFile(outPath);
  console.log(`✓ ${outputName} (${width}x${height}) splitX=${splitX}`);
  return { width, height, splitX };
}

async function markAndFavicon() {
  const input = path.join(logoDir, 'vl-mark.png');
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const out = Buffer.from(data);
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      let r = out[i];
      let g = out[i + 1];
      let b = out[i + 2];
      const max = Math.max(r, g, b);
      if (max < 16) {
        out[i + 3] = 0;
        continue;
      }
      if (isRed(r, g, b)) [r, g, b] = toBlue(r, g, b);
      let a = out[i + 3];
      if (max < 48 && !isRed(data[i], data[i + 1], data[i + 2])) {
        a = clamp(((max - 16) / 32) * 255);
      }
      out[i] = r;
      out[i + 1] = g;
      out[i + 2] = b;
      out[i + 3] = a;
      if (a > 24) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  const markPath = path.join(logoDir, 'vl-logo-v5-mark.png');
  await sharp(out, { raw: { width, height, channels } }).png().toFile(markPath);

  const pad = 18;
  const left = Math.max(0, minX - pad);
  const top = Math.max(0, minY - pad);
  const cropW = Math.min(width - left, maxX - minX + pad * 2);
  const cropH = Math.min(height - top, maxY - minY + pad * 2);
  await sharp(markPath)
    .extract({ left, top, width: cropW, height: cropH })
    .resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(logoDir, 'favicon-v5.png'));
  console.log(`✓ vl-logo-v5-mark.png y favicon-v5.png`);
}

const header = await processLogo('vl-logo-corporativo.png', 'vl-logo-v5-header.png', { recolorWordmark: true });
await processLogo('vl-logo-corporativo.png', 'vl-logo-v5-footer.png', { recolorWordmark: false });
await processLogo('vl-logo-header.png', 'vl-logo-v5-horizontal.png', { recolorWordmark: true });
await markAndFavicon();
console.log('header split', header.splitX);
