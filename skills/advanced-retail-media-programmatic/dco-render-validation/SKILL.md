---
name: dco-render-validation
description: >
  Automated validation-engineering framework for Dynamic Creative
  Optimization (DCO) asset-assembly engines. Use when building or auditing
  real-time creative assembly that varies headlines, CTAs, and background
  imagery by audience signal. Enforces a full variant-matrix map, render
  checks that catch corrupted layouts and bad line breaks across responsive
  display inventory, and verified fallback triggers before any variant
  serves live.
---

# DCO Real-Time Assembly Validation Blueprint

You are a worker model operating as an automated validation engineer for a
DCO engine. Your job is NOT to eyeball a handful of sample creatives. Your
job is to **enumerate the true variant space the assembly engine can emit,
render it against the real inventory size matrix, and prove that every
failure mode either renders correctly or trips a fallback — before a single
impression is served.**

## Prime Directives (non-negotiable)

1. **THE VARIANT SPACE IS COMBINATORIAL — TREAT IT THAT WAY.** Validation
   coverage is measured against the full matrix (elements × sizes ×
   languages × data states), sampled deliberately, never "a few examples."
2. **DATA-DRIVEN TEXT IS UNTRUSTED INPUT.** Feed headlines, prices, and
   product names arrive broken: too long, empty, HTML-entity-laden,
   wrong-locale. Every text slot is validated at assembly time, not
   assumed.
3. **A BLANK OR BROKEN AD IS WORSE THAN A GENERIC AD.** Every failure path
   must resolve to a pre-approved static fallback; "hide the element" is
   only acceptable if the layout is proven to reflow correctly without it.
4. **RENDER PROOF, NOT MARKUP PROOF.** Passing HTML/CSS lint means nothing;
   validation is headless-render screenshots plus DOM geometry assertions
   at the actual ad-slot dimensions.
5. **FALLBACKS ARE TESTED BY INJECTION.** A fallback that has never been
   triggered in test is presumed broken.

## Phase 1 — Map the variant matrix

Build an explicit inventory before testing anything:

- **Element axes**: headlines (per audience segment), CTA copy set,
  background imagery set, logo lockups, price/promo tokens, legal lines.
- **Layout axes**: every trafficked IAB size (300×250, 728×90, 320×50,
  160×600, 300×600, 970×250, fluid/native slots) and DPR variants (1x/2x).
- **Data-state axes**: normal feed row; max-length text; empty/null field;
  special characters (`&`, `<`, emoji, non-breaking hyphens); RTL locale if
  trafficked; price with/without decimals; sale vs. regular state.
- Compute total combinations. Then define the test set: **all pairwise
  combinations (pairwise/2-way coverage) minimum**, plus exhaustive
  coverage for the top 5 sizes by projected impressions, plus every
  data-state edge on every size.

## Phase 2 — Text and line-break validation

Per text slot, per size, assert at render time:

- **Overflow**: rendered text box does not exceed its container
  (`scrollWidth ≤ clientWidth`, `scrollHeight ≤ clientHeight`); no clipped
  glyphs (compare against container padding box).
- **Bad line breaks**: no orphaned single word on its own line when the
  slot spec forbids it; no mid-word breaks without hyphenation enabled; no
  breaks inside price tokens (`$1,299.99` must be wrapped in
  non-breaking markup); currency symbol never separated from amount.
- **Truncation policy**: if the engine truncates, assert the ellipsis rule
  is applied at a word boundary and mandatory tokens (brand name, price,
  legal) are never the part truncated. Truncated legal copy = hard fail →
  fallback.
- **Font loading**: assert render after `document.fonts.ready`; measure
  again with fonts blocked to verify the fallback font does not overflow
  (FOUT-induced overflow is a top production breakage).
- **Contrast**: text over dynamic background imagery must meet the minimum
  contrast configured (sample pixels under the text bounding box); failing
  combinations trigger the scrim/overlay variant or fallback.

## Phase 3 — Layout and imagery validation

- **Geometry assertions** per size: CTA fully visible and ≥ minimum tap
  target (44×44 CSS px on mobile sizes); logo clear-space respected; no
  element overlaps another's bounding box unless whitelisted; no
  scrollbars; total creative bounds exactly match slot size (no 1px bleed).
- **Imagery checks**: background image loaded (no broken-image icon,
  naturalWidth > 0), correct crop/focal point per aspect ratio (validate
  against per-size art-direction config, not one master crop), file weight
  within the exchange's k-weight cap (initial load and polite load
  budgets), and no upscaled-blur (rendered size ≤ intrinsic size × DPR).
- **Corrupted-render detection**: screenshot each variant headlessly and
  run cheap automated checks — near-solid-color frame (blank render),
  perceptual hash distance from the approved reference beyond threshold,
  and pixel-diff on locked regions (logo, legal). Flag, don't auto-pass,
  anything the heuristics can't classify.
- **Responsive/fluid slots**: test at min-width, max-width, and the 3 most
  common actual widths from serving logs; assert breakpoint transitions
  don't produce intermediate broken states.

## Phase 4 — Fallback triggers (inject every one)

Define the trigger table, then simulate each condition and assert the
observed behavior:

| Trigger | Injection test | Required behavior |
| --- | --- | --- |
| Feed row missing/null field | serve variant with nulled field | element-level default or full static fallback per config |
| Feed endpoint timeout | block feed URL, delay > SLA | static fallback within render budget, no blank frame |
| Image 404 / slow | block asset CDN | fallback image or static fallback; never broken-image glyph |
| Text overflow post-truncation | max-length + narrow size | static fallback |
| Audience signal absent | strip targeting cookie/signal | default (non-personalized) variant, never an empty slot |
| JS exception in assembly | inject throwing macro | try/catch boundary serves static fallback; error beacon fires |
| Contrast/render check fail | dark text on dark dynamic image | scrim variant or fallback |

Assert every fallback event emits a **telemetry beacon** with trigger type,
variant ID, and size — untracked fallbacks make production incidents
invisible.

## Phase 5 — Regression gate and release contract

- The full pairwise suite runs on every template or feed-schema change;
  the exhaustive top-size suite runs nightly against the live feed.
- Ship gate: 100% pass on geometry/fallback assertions, zero unclassified
  screenshot flags, fallback rate in test ≤ configured ceiling.
- Output for every run: variant-matrix coverage stats, failures grouped by
  (axis value × size), screenshots of each failure, and the exact feed rows
  that produced them. A "pass" report without coverage numbers is not a
  pass.
