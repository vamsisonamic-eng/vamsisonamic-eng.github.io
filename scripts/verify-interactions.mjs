import { chromium } from "playwright-core";
import fs from "node:fs/promises";
import crypto from "node:crypto";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
await context.addInitScript(() => {
  Element.prototype.requestPointerLock = () => {};
  Element.prototype.setPointerCapture = () => {};
});
const page = await context.newPage();
await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "MOTION ON" }).click();
await page.waitForTimeout(150);
await page.screenshot({ path: "artifacts/pointer-before.png" });
await page.getByRole("button", { name: "MOTION OFF" }).click();
await page.mouse.move(1150, 460);
await page.waitForTimeout(300);
await page.screenshot({ path: "artifacts/pointer-after.png" });
await page.locator("#engine").scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
const card = page.locator(".competency").first();
const bounds = await card.boundingBox();
await page.mouse.move(
  bounds.x + bounds.width * 0.85,
  bounds.y + bounds.height * 0.25,
);
await page.waitForTimeout(400);
const transform = await card.evaluate((el) => getComputedStyle(el).transform);
if (transform === "none") throw Error("Card did not respond to pointer");
await page.getByRole("button", { name: "MOTION ON" }).click();
if (
  (await page.evaluate(
    () => getComputedStyle(document.documentElement).scrollBehavior,
  )) !== "auto"
)
  throw Error("Motion toggle did not stop smooth scrolling");
const event = page.waitForEvent("download");
await page.getByRole("link", { name: "Download ATS-Optimized Resume" }).click();
const download = await event;
await download.saveAs("artifacts/master-resume-verified.pdf");
const hash = (p) => crypto.createHash("sha256").update(p).digest("hex");
const exactResume =
  hash(await fs.readFile("artifacts/master-resume-verified.pdf")) ===
  hash(await fs.readFile("public/Bharat-Vamsi-Reddy-Resume.pdf"));
if (!exactResume) throw Error("Resume differs from master");
await context.close();
const fallbackContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
});
await fallbackContext.addInitScript(() => {
  Element.prototype.requestPointerLock = () => {};
  Element.prototype.setPointerCapture = () => {};
  const original = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (kind, ...args) {
    return /webgl/.test(kind) ? null : original.call(this, kind, ...args);
  };
});
const fallbackPage = await fallbackContext.newPage();
await fallbackPage.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
await fallbackPage.locator(".scene-poster").waitFor();
await fallbackPage.locator(".hero-visual").scrollIntoViewIfNeeded();
await fallbackPage.screenshot({ path: "artifacts/no-webgl-mobile.png" });
const fallback = await fallbackPage
  .locator(".scene-poster")
  .evaluate((img) => img.complete && img.naturalWidth > 0);
if (!fallback) throw Error("Fallback poster did not load");
await browser.close();
console.log(
  JSON.stringify(
    {
      pointerCardTransform: transform,
      exactResume,
      webglFallback: fallback,
      motionToggle: true,
    },
    null,
    2,
  ),
);
