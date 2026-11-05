import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const evidenceDir = path.resolve("docs/evidence");
fs.mkdirSync(evidenceDir, { recursive: true });

test.describe("VL Consulting Partners — smoke", () => {
  test("homepage loads without page errors", async ({ page }, testInfo) => {
    const pageErrors = [];
    const failedRequests = [];
    page.on("pageerror", (err) => pageErrors.push(String(err)));
    page.on("requestfailed", (req) => failedRequests.push(`${req.failure()?.errorText || "fail"} ${req.url()}`));
    page.on("response", (res) => {
      if (res.status() >= 400) failedRequests.push(`${res.status()} ${res.url()}`);
    });

    await page.goto("/");
    await expect(page).toHaveTitle(/VL Consulting Partners/i);
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator(".header-logo img, .brand__mark").first()).toBeVisible();

    await page.screenshot({
      path: path.join(evidenceDir, `home-${testInfo.project.name}.png`),
      fullPage: false
    });

    expect(pageErrors, `JS page errors: ${pageErrors.join(" | ")}`).toEqual([]);
    expect(failedRequests, `Failed requests: ${failedRequests.join(" | ")}`).toEqual([]);
  });

  test("desktop navigation links resolve", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.includes("mobile"), "Desktop nav only");
    await page.goto("/");
    const links = ["nosotros.html", "sectores.html", "publicaciones.html", "contacto.html", "auditoria.html"];
    for (const href of links) {
      const res = await page.request.get("/" + href);
      expect(res.status(), href).toBe(200);
    }
  });

  test("mobile menu opens and closes", async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.includes("mobile"), "Mobile only");
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const toggle = page.locator(".mobile-menu-btn");
    const drawer = page.locator(".mobile-nav-drawer");
    await expect(toggle).toBeVisible({ timeout: 10000 });

    await page.evaluate(() => document.querySelector(".mobile-menu-btn")?.click());
    await expect.poll(async () => drawer.evaluate((el) => el.classList.contains("is-open"))).toBeTruthy();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");

    await page.evaluate(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    await expect.poll(async () => drawer.evaluate((el) => el.classList.contains("is-open"))).toBeFalsy();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  test("contact form shows validation errors", async ({ page }) => {
    await page.goto("/contacto.html");
    const form = page.locator("form.vl-contact-form").first();
    await expect(form).toBeVisible();
    await form.locator('button[type="submit"]').click();
    await expect(page.locator(".form-error-msg, .alert-error, [role='alert']").first()).toBeVisible();
  });

  test("contact form validates then reports pending backend", async ({ page }) => {
    await page.goto("/contacto.html");
    const form = page.locator("form.vl-contact-form").first();
    await form.locator('[name="nombre"]').fill("Ana Pérez Directora");
    await form.locator('[name="empresa"]').fill("Empresa Demo SA");
    await form.locator('[name="email"]').fill("ana@empresa-demo.com");
    await form.locator('[name="servicio"]').selectOption({ index: 1 });
    await form.locator('[name="mensaje"]').fill("Necesito una consulta sobre auditoría interna y controles.");
    const consent = form.locator('[name="consentimiento"]');
    if (await consent.count()) await consent.check();
    await form.locator('button[type="submit"]').click();
    await expect(page.getByText(/Validación completada|envío pendiente|backend|no se ha simulado/i).first()).toBeVisible();
    await expect(page.getByText(/Solicitud recibida/i)).toHaveCount(0);
  });

  test("responsive widths render without horizontal overflow", async ({ page }) => {
    const widths = [375, 768, 1024, 1440];
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
      });
      expect(overflow, `overflow at ${width}`).toBeFalsy();
      await page.screenshot({
        path: path.join(evidenceDir, `responsive-${width}.png`),
        fullPage: false
      });
    }
  });
});
