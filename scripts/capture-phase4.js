/**
 * Capturas visuales Phase 4 — evidencia obligatoria
 */
import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'docs', 'evidence', 'phase4');
fs.mkdirSync(outDir, { recursive: true });

const base = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';

async function waitForServer() {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(base + '/');
      if (res.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('Server not ready at ' + base);
}

const shots = [
  { name: 'homepage-desktop', url: '/', width: 1440, height: 900, full: true },
  { name: 'homepage-mobile', url: '/', width: 375, height: 812, full: true },
  { name: 'servicios-auditoria', url: '/auditoria.html', width: 1440, height: 900, full: true },
  { name: 'publicaciones', url: '/publicaciones.html', width: 1440, height: 900, full: true },
  { name: 'contacto', url: '/contacto.html', width: 1440, height: 900, full: true },
  { name: 'nosotros', url: '/nosotros.html', width: 1440, height: 900, full: false }
];

const browser = await chromium.launch({ channel: 'chrome', headless: true });
await waitForServer();

for (const shot of shots) {
  const page = await browser.newPage({ viewport: { width: shot.width, height: shot.height } });
  await page.goto(base + shot.url, { waitUntil: 'networkidle' });
  // Forzar revelado de fade-in y pasar por el scroll (IntersectionObserver)
  await page.evaluate(async () => {
    document.querySelectorAll('.fade-in-element').forEach((el) => el.classList.add('is-visible'));
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y < h; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
  const file = path.join(outDir, `${shot.name}.png`);
  await page.screenshot({ path: file, fullPage: shot.full });
  console.log('✓', shot.name, '→', file);
  await page.close();
}

await browser.close();
console.log('Phase 4 screenshots complete:', outDir);
