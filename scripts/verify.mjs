import { chromium } from "playwright-core";
import fs from "node:fs/promises";
await fs.mkdir("artifacts", { recursive: true });
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--disable-gpu-sandbox"],
});
const results = [];
for (const [name, width, height, reduced] of [
  ["desktop", 1440, 1000, false],
  ["mobile", 390, 844, false],
  ["compact", 360, 640, false],
  ["reduced", 1440, 1000, true],
]) {
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion: reduced ? "reduce" : "no-preference",
    acceptDownloads: true,
  });
  await context.addInitScript(() => {
    Element.prototype.requestPointerLock = () => {};
    Element.prototype.setPointerCapture = () => {};
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(process.env.TEST_URL || "http://127.0.0.1:5173/", {
    waitUntil: "networkidle",
  });
  await page.screenshot({ path: `artifacts/${name}-hero.png` });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  );
  await page.getByRole("button", { name: "Retail media", exact: true }).click();
  await page.getByText("ONSITE / OFFSITE", { exact: true }).waitFor();
  for (const id of ["engine", "experience", "lab", "contact"]) {
    await page.locator("#" + id).scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `artifacts/${name}-${id}.png` });
  }
  await page.getByRole("button", { name: "Next project", exact: true }).click();
  await page
    .locator(".project-copy h3")
    .filter({ hasText: "Myvash" })
    .waitFor();
  await page
    .getByRole("button", { name: "Show ProgrammaticOS", exact: true })
    .click();
  const downloadEvent = page.waitForEvent("download");
  await page
    .getByRole("link", { name: "Download ATS-Optimized Resume" })
    .click();
  const download = await downloadEvent;
  await download.saveAs(`artifacts/${name}-resume.pdf`);
  const pdf = await fs.readFile(`artifacts/${name}-resume.pdf`);
  if (pdf.subarray(0, 4).toString() !== "%PDF") throw Error("Invalid PDF");
  await page.getByLabel("YOUR NAME", { exact: false }).fill("Preview Test");
  await page
    .getByLabel("EMAIL ADDRESS", { exact: false })
    .fill("preview@example.com");
  await page
    .getByLabel("YOUR IDEA", { exact: false })
    .fill("Local form verification.");
  const validation = await page
    .locator("form")
    .evaluate((f) => f.checkValidity());
  if (width < 760) {
    await page.getByRole("button", { name: "Open menu", exact: true }).click();
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "The engine" })
      .click();
    if (await page.getByRole("button", { name: "Close menu" }).count())
      throw Error("Menu remained open");
  }
  results.push({
    name,
    overflow,
    errors,
    pdfBytes: pdf.length,
    formValid: validation,
  });
  await context.close();
}
await browser.close();
await fs.writeFile(
  "artifacts/verification.json",
  JSON.stringify(results, null, 2),
);
console.log(JSON.stringify(results, null, 2));
