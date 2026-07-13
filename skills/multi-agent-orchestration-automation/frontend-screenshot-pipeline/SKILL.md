---
name: frontend-screenshot-pipeline
description: >
  Automated frontend screenshot pipeline blueprint. Guides worker models to
  launch sandboxed headless browsers, simulate varied responsive viewport
  dimensions, inject dynamic DOM interaction triggers (opening menus,
  forcing hover and focus states), and save categorized screenshots with
  timestamp-sorted naming patterns. Use for visual verification of UI
  changes, responsive design audits, and before/after visual evidence.
---

# Automated Frontend Screenshot Pipeline

You are a worker model producing **visual evidence** of a frontend's real
rendered state. A screenshot set is only useful if it is *reproducible*
(same script → same shots), *complete* (all viewports and interaction
states that matter), and *navigable* (a human can find the right image
from its filename alone). This framework enforces all three.

## Prime Directives (non-negotiable)

1. **SANDBOXED HEADLESS ONLY.** Launch the browser headless with the
   environment's sandbox settings; never attach to a user's live browser
   session or profile. Use the pre-installed browser if the environment
   provides one — do not download a new browser binary.
2. **SCRIPT, DON'T CLICK.** All capture runs through one idempotent
   script (Playwright preferred; Puppeteer acceptable). Ad-hoc one-off
   captures are prohibited — if a shot matters, it goes in the script so
   it can be re-run after the next code change.
3. **WAIT FOR STABILITY, NOT TIME.** Every capture is preceded by explicit
   readiness conditions (network idle, selector visible, fonts loaded,
   animations settled). Bare `sleep(3000)` waits are a last resort and
   must be commented with why no condition was available.
4. **EVERY IMAGE IS CATEGORIZED AND TIMESTAMPED.** No `screenshot1.png`.
   The naming contract below is mandatory.
5. **NEVER CAPTURE SECRETS.** Before capturing authenticated or form
   views, confirm no real credentials, tokens, or personal data are
   visible. Use seeded test data.

## Phase 1 — Target Inventory

Before writing the script, enumerate what must be captured:

- **Pages/routes:** list every URL under test.
- **Viewports:** default matrix (override per task):

  | Class | Width×Height | Notes |
  |-------|--------------|-------|
  | mobile | 375×812 | portrait, deviceScaleFactor 3, mobile UA |
  | tablet | 768×1024 | portrait |
  | laptop | 1366×768 | most common desktop |
  | desktop | 1920×1080 | full HD |
  | wide | 2560×1440 | only when layout has max-width behavior to verify |

- **Interaction states per page:** the states a static load never shows —
  open navigation menu, hover on primary buttons/links, focus on inputs,
  open modals/dropdowns, expanded accordions, error/validation states,
  dark mode if supported.

Write this inventory as a data structure at the top of the script (array
of `{route, states, viewports}`), so coverage is declared, not implied.

## Phase 2 — The Capture Script

Skeleton (Playwright, Node):

```js
const { chromium } = require('playwright');
const RUN_ID = new Date().toISOString().replace(/[:.]/g, '-'); // sortable
const OUT = `screenshots/${RUN_ID}`;

const VIEWPORTS = { mobile: {width:375,height:812}, tablet: {width:768,height:1024},
                    laptop: {width:1366,height:768}, desktop: {width:1920,height:1080} };

const TARGETS = [
  { route: '/', name: 'home', states: ['default','nav-open','cta-hover'] },
  { route: '/settings', name: 'settings', states: ['default','form-focus','form-error'] },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
    const ctx = await browser.newContext({ viewport: vp,
      deviceScaleFactor: vpName === 'mobile' ? 3 : 1 });
    const page = await ctx.newPage();
    for (const t of TARGETS) {
      await page.goto(BASE_URL + t.route, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      for (const state of t.states) {
        await applyState(page, state);          // see Phase 3
        await settle(page);                     // animation/layout settle
        await page.screenshot({
          path: `${OUT}/${vpName}/${t.name}/${stamp()}_${t.name}_${state}_${vpName}.png`,
          fullPage: state === 'default',        // interaction states: viewport-only
        });
        await resetState(page, state);          // return to neutral
      }
    }
    await ctx.close();
  }
  await browser.close();
})();
```

Rules embedded above that you must keep:

- **Fresh context per viewport** — prevents cache/state bleed between
  viewport classes.
- **fullPage for default state only** — an open dropdown or hover state
  is positioned relative to the viewport; full-page capture distorts it.
- **Reset after each state** — every interaction is undone (close the
  menu, blur the input) before the next state is applied, so states are
  independent, not cumulative.

## Phase 3 — Dynamic DOM Interaction Triggers

Static loads miss most UI. Implement `applyState` with these techniques:

- **Menus / dropdowns / modals:** real interaction first —
  `page.click('[data-testid=nav-toggle]')` and wait for the panel
  selector to be visible. Prefer stable selectors (`data-testid`, ARIA
  roles) over CSS classes.
- **Hover states:** `page.hover(selector)` for true hover. When you need
  hover styling to *persist* through capture (or on multiple elements at
  once), force it by injecting a class and a stylesheet that mirrors the
  `:hover` rules:
  ```js
  await page.addStyleTag({ content: '.--force-hover{ /* copied :hover rules */ }' });
  await page.evaluate(sel =>
    document.querySelector(sel).classList.add('--force-hover'), selector);
  ```
  Note in the run manifest that the state was forced, not native.
- **Focus states:** `page.focus(selector)`; for `:focus-visible` styling,
  reach the element with `page.keyboard.press('Tab')` navigation instead,
  since programmatic focus may not trigger it.
- **Validation/error states:** submit with invalid seeded input and wait
  for the error selector — never screenshot a hand-edited DOM as if it
  were a real error.
- **Scroll-triggered content:** scroll incrementally to the target
  section and wait for lazy content (`page.locator(sel).scrollIntoViewIfNeeded()`).
- **Animation settle:** either disable animations globally for pixel
  stability (`addStyleTag` with `*{animation:none!important;transition:none!important}`)
  — recording that you did — or wait for `transitionend`/fixed settle
  helper. Choose per task: disabled animations for regression diffing,
  natural animations for design review.

## Phase 4 — Naming, Categorization, and Manifest

**Directory layout** (category axes: run → viewport → page):

```
screenshots/<RUN_ID>/<viewport>/<page>/<timestamp>_<page>_<state>_<viewport>.png
```

**Naming contract:**

- `RUN_ID` and `timestamp` are ISO-8601 with `:`/`.` replaced by `-` —
  lexicographic sort equals chronological sort. This is the
  "timestamp-sorted pattern" and it is non-negotiable.
- Every filename is self-describing without its directory: page, state,
  and viewport are all in the name.
- One `manifest.json` per run recording: base URL, git commit of the
  frontend, viewport matrix, per-image entries `{file, route, state,
  viewport, forced_states:[], captured_at}`, and any capture failures.

## Phase 5 — Verification and Delivery

- After the run, verify the count: images on disk must equal
  `routes × states × viewports` minus explicitly-recorded skips. A silent
  shortfall is a pipeline bug.
- Spot-check at least one image per viewport class by actually viewing it
  (blank white captures from premature shots are the #1 failure).
- Report to the caller: output directory, image count, the manifest path,
  and any states that could not be captured with reasons.

## Failure Modes to Avoid

- Screenshotting before hydration/fonts/data — the blank-or-flash capture.
- Reusing one browser context across viewports (sticky caches, cookies).
- Hover captures where the hover was lost the moment `screenshot()` ran —
  use the forced-class technique when persistence is needed.
- Uncontrolled animations making every run differ pixel-wise.
- Filenames that need a README to decode, or unsortable timestamps.
- Downloading a browser when the sandbox already provides one.
