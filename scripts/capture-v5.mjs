import fs from 'fs';
import path from 'path';
import { chromium } from '@playwright/test';

const outDir = path.resolve('docs/evidence/phase5');
fs.mkdirSync(outDir, { recursive: true });
const base = 'http://localhost:3000';
const report = [];

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage();
const consoleErrors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (err) => consoleErrors.push(String(err)));

async function metrics() {
  return page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
  }));
}

async function shot(name) {
  const file = path.join(outDir, name);
  await page.screenshot({ path: file, fullPage: false });
  const m = await metrics();
  report.push({ name, ...m, url: page.url() });
  console.log(name, m);
}

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(base, { waitUntil: 'networkidle' });
const intro = await page.locator('.page-intro').count();
console.log('intro present', intro);
await page.waitForTimeout(2800);
await shot('homepage-desktop-1440.png');

await page.setViewportSize({ width: 1024, height: 800 });
await page.waitForTimeout(300);
await shot('homepage-1024.png');

await page.setViewportSize({ width: 768, height: 900 });
await page.waitForTimeout(300);
await shot('homepage-768.png');

await page.setViewportSize({ width: 375, height: 812 });
await page.waitForTimeout(300);
await shot('homepage-mobile-375.png');

await page.locator('#servicios').scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await shot('servicios-mobile-375.png');

await page.setViewportSize({ width: 1440, height: 900 });
await page.locator('#servicios').scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await shot('servicios-desktop-1440.png');

await page.goto(`${base}/publicaciones.html`, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
await shot('publicaciones-desktop-1440.png');

await page.goto(`${base}/contacto.html`, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
await shot('contacto-desktop-1440.png');

await page.setViewportSize({ width: 375, height: 812 });
await page.waitForTimeout(300);
await shot('contacto-mobile-375.png');

await page.goto(`${base}/auditoria.html`, { waitUntil: 'networkidle' });
await page.setViewportSize({ width: 1440, height: 900 });
await page.waitForTimeout(300);
await shot('auditoria-desktop-1440.png');

fs.writeFileSync(path.join(outDir, 'metrics.json'), JSON.stringify({ report, consoleErrors }, null, 2));
console.log('console errors', consoleErrors.length);
consoleErrors.forEach((e) => console.log('ERR', e));
await browser.close();
