import { chromium } from "playwright-core";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
for (const [name, width, height, reduced] of [
  ["desktop", 1440, 1000, false],
  ["mobile", 390, 844, false],
  ["compact", 360, 640, false],
  ["reduced", 1440, 1000, true],
]) {
  const page = await browser.newPage({
    viewport: { width, height },
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => {
    Element.prototype.requestPointerLock = () => {};
    Element.prototype.setPointerCapture = () => {};
  });
  await page.goto(process.env.TEST_URL || "http://127.0.0.1:4173/", {
    waitUntil: "networkidle",
  });
  const link = page.getByRole("link", { name: "Launch ProgrammaticOS" });
  if ((await link.getAttribute("href")) !== "https://programmaticos.ai.studio/")
    throw Error("Incorrect project link");
  if ((await link.getAttribute("target")) !== "_blank")
    throw Error("Project target missing");
  await page
    .getByRole("button", {
      name: "Read case study: Following a creative rejection back to its source.",
    })
    .click();
  await page.waitForTimeout(reduced ? 50 : 900);
  for (const stage of ["Detect", "Diagnose", "Validate", "Follow through"]) {
    await page
      .locator(".investigation-controls")
      .getByRole("button", { name: new RegExp(stage) })
      .click();
    if ((await page.locator(".investigation-node").count()) !== 3)
      throw Error("Diagram incomplete");
    if (
      await page
        .locator(".investigation-visual")
        .evaluate((el) => el.scrollWidth > el.clientWidth)
    )
      throw Error("Diagram overflow");
  }
  await page
    .locator(".investigation-controls")
    .getByRole("button", { name: /Validate/ })
    .click();
  await page.locator(".investigation-visual").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `artifacts/${name}-creative-case.png` });
  await page.getByText("Evidence & attribution", { exact: true }).click();
  await page.getByText("Reviewed source material:", { exact: false }).waitFor();
  if (
    await page
      .locator("dialog")
      .evaluate((el) => el.scrollWidth > el.clientWidth)
  )
    throw Error("Dialog overflow");
  await page.keyboard.press("Escape");
  await page.locator("dialog").waitFor({ state: "detached" });
  await page.getByRole("button", { name: "Switch to Day vision" }).click();
  await page
    .getByRole("button", {
      name: "Read case study: Following a creative rejection back to its source.",
    })
    .click();
  await page
    .locator(".investigation-controls")
    .getByRole("button", { name: /Diagnose/ })
    .click();
  await page.locator(".investigation-visual").scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `artifacts/${name}-creative-case-day.png` });
  await page.keyboard.press("Escape");
  await page.locator("dialog").waitFor({ state: "detached" });
  if (errors.length) throw Error(errors.join("\n"));
  console.log(name + ": case stages, diagram, evidence, themes, link passed");
  await page.close();
}
await browser.close();
