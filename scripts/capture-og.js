/**
 * Captura OG 1200x630 desde la plantilla HTML oficial.
 */
import { chromium } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const template = path.join(root, "public/assets/images/og/og-template.html");
const outPng = path.join(root, "public/assets/images/og/og-default.png");
const outJpg = path.join(root, "public/assets/images/og/og-default.jpg");

fs.mkdirSync(path.dirname(outPng), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto("file://" + template.replace(/\\/g, "/"));
await page.waitForTimeout(500);
await page.screenshot({ path: outPng, type: "png" });
await page.screenshot({ path: outJpg, type: "jpeg", quality: 86 });
await browser.close();
console.log("OG generated:", outPng, outJpg);
