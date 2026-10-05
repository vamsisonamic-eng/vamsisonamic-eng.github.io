import { chromium } from "playwright-core";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
await context.addInitScript(() => {
  Element.prototype.requestPointerLock = () => {};
  Element.prototype.setPointerCapture = () => {};
});
const page = await context.newPage();
await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
await page.locator(".scene canvas").waitFor();
await page.addStyleTag({content:'.scene-meta,.node-label,.visual-footer,.mode-switch,.simulation-note,.scene-poster{visibility:hidden!important}'});
await page.waitForTimeout(300);
await page.locator(".scene").screenshot({ path: "public/hero-poster.png" });
await browser.close();
