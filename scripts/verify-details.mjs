import { chromium } from "playwright-core";
import fs from "node:fs/promises";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
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
  });
  await context.addInitScript(() => {
    Element.prototype.requestPointerLock = () => {};
    Element.prototype.setPointerCapture = () => {};
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  const close = async () => {
    await page.keyboard.press("Escape");
    await page.locator("dialog").waitFor({ state: "detached" });
  };
  await page.locator("#platforms").scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  if ((await page.locator(".platform-chip").count()) !== 29)
    throw Error("Incorrect platform count");
  const names = await page.locator(".platform-chip strong").allTextContents();
  if (
    names.slice(0, 3).join("|") !==
    "Looker Studio|Google Analytics 4|Google Tag Manager"
  )
    throw Error("Measurement priority missing");
  if (names.some((n) => ["Python", "SQL", "Tableau"].includes(n)))
    throw Error("Removed platform present");
  await page.screenshot({ path: `artifacts/${name}-platforms.png` });
  for (const title of names) {
    const trigger = page
      .locator(".platform-chip")
      .filter({ has: page.getByText(title, { exact: true }) });
    await trigger.click();
    await page.getByRole("dialog").waitFor();
    if ((await page.locator("#detail-title").textContent()) !== title)
      throw Error("Platform dialog mismatch");
    if ((await page.evaluate(() => document.body.style.overflow)) !== "hidden")
      throw Error("Missing body lock");
    await close();
  }
  for (const group of [
    "Media activation",
    "Retail & audience",
    "AI & automation",
    "Measurement & operations",
    "All",
  ]) {
    await page
      .locator(".platform-tabs")
      .getByRole("button", { name: group, exact: group !== "All" })
      .click();
    if ((await page.locator(".platform-chip").count()) === 0)
      throw Error("Empty filter");
  }
  for (const company of [
    "Dentsu",
    "Freyr Solutions",
    "OTSI",
    "Shiftwave Technologies",
    "Independent consulting",
    "Myvash.com",
  ]) {
    const trigger = page.getByRole("button", {
      name: `Explore ${company}`,
      exact: true,
    });
    await trigger.click();
    await page.waitForTimeout(reduced ? 50 : 1100);
    if ((await page.locator("#detail-title").textContent()) !== company)
      throw Error("Company mismatch");
    const horizontal = await page
      .locator("dialog")
      .evaluate((el) => el.scrollWidth > el.clientWidth + 1);
    if (horizontal) throw Error(`${company} dialog overflow at ${width}`);
    if (company === "Dentsu") {
      await page.getByText("Jul 2026 – Present", { exact: true }).waitFor();
      await page.screenshot({ path: `artifacts/${name}-dentsu-popup.png` });
      await page.keyboard.press("Shift+Tab");
      if (
        !(await page
          .locator("dialog")
          .evaluate((el) => el.contains(document.activeElement)))
      )
        throw Error("Focus escaped modal");
    }
    await close();
    await page.waitForTimeout(50);
    if (!(await trigger.evaluate((el) => el === document.activeElement)))
      throw Error("Focus not restored");
  }
  for (const trigger of await page.locator(".case-row").all()) {
    await trigger.click();
    await page.waitForTimeout(reduced ? 50 : 1300);
    if (
      (await page.locator(".workflow-step").count()) !== 4 &&
      (await page.locator(".investigation-node").count()) !== 3
    )
      throw Error("Missing workflow");
    await close();
  }
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.getByLabel("YOUR NAME", { exact: false }).fill("QA & Preview");
  await page
    .getByLabel("EMAIL ADDRESS", { exact: false })
    .fill("qa@example.com");
  await page
    .getByLabel("YOUR IDEA", { exact: false })
    .fill("Measurement + automation inquiry");
  await page.getByRole("button", { name: "Create email draft" }).click();
  const draft = await page
    .getByRole("link", { name: "Open draft in email app" })
    .getAttribute("href");
  if (!decodeURIComponent(draft).includes("Measurement + automation inquiry"))
    throw Error("Incorrect email draft");
  if (
    await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
  )
    throw Error("Page overflow");
  if (errors.length) throw Error(errors.join("\n"));
  results.push({
    name,
    platforms: names.length,
    companyDialogs: 6,
    caseStudies: 3,
    focusTrap: true,
    focusRestore: true,
    emailDraft: true,
    noOverflow: true,
    errors,
  });
  await context.close();
}
await browser.close();
await fs.writeFile(
  "artifacts/detail-qa.json",
  JSON.stringify(results, null, 2),
);
console.log(JSON.stringify(results, null, 2));
