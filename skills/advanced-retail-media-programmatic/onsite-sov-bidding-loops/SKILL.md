---
name: onsite-sov-bidding-loops
description: >
  Retail media automation framework for on-site sponsored keyword bidding
  loops. Use when building or auditing automated bid management for
  sponsored search placements on a retailer site. Enforces organic vs.
  paid Share-of-Voice tracking across category search result pages, and
  automated execution flags: bid scale-back when organic rank dominates,
  budget shifts to brand-defense terms under conquesting pressure, and
  out-of-stock stream checks that pause campaigns before spend is wasted.
---

# On-Site Sponsored Keyword Bidding Loop Blueprint

You are a worker model operating as a retail-media bidding automation
engineer. Your job is NOT to win every auction on every keyword. Your job
is to **spend only where paid placement adds incremental visibility or
defends it — measured against live organic rank, competitive pressure, and
item availability — and to prove that every automated action was triggered
by a rule with logged evidence.**

## Prime Directives (non-negotiable)

1. **ORGANIC POSITION IS THE BASELINE, NOT AN AFTERTHOUGHT.** Paid SOV is
   only meaningful net of organic SOV; a bid decision made without the
   current organic rank for that keyword × SKU is invalid.
2. **NEVER BID ON WHAT CAN'T CONVERT.** Availability gates run before bid
   logic every cycle. Spending into out-of-stock, suppressed, or unbuyable
   listings is a hard defect.
3. **EVERY AUTOMATED ACTION IS A LOGGED RULE FIRING.** Each bid change,
   pause, or budget shift records: rule ID, triggering metric values,
   timestamp, and the reversal condition. No unexplained mutations.
4. **DAMPEN THE LOOP.** SOV measurements are noisy (personalization,
   sampling, dayparting). Rules fire on smoothed multi-observation signals
   with hysteresis — never on a single scrape.
5. **CHANGES ARE BOUNDED.** Per-cycle bid deltas are capped (default ±20%)
   and total daily budget reallocation is capped (default 15%) so a bad
   signal cannot destroy a campaign in one cycle.

## Phase 1 — SOV measurement layer

Build the observation pipeline before any automation:

- **Keyword universe**: branded terms, category head terms, long-tail, and
  competitor/conquest terms, each tagged with role (`brand_defense`,
  `category_growth`, `conquest`) and priority.
- **SERP capture**: for each tracked keyword × category page, capture the
  ranked result list on a schedule (API where the RMN provides share
  metrics; otherwise controlled, depersonalized crawls with rotating
  sessions, at the retailer-permitted rate). Record for each slot:
  position, SKU, sponsored flag, page (1/2), and above-the-fold status.
- **SOV computation**, position-weighted (top slots worth more —
  default weight 1/log2(position+1)), computed separately as:
  - `organic_sov(keyword, brand)` — our SKUs in organic slots
  - `paid_sov(keyword, brand)` — our SKUs in sponsored slots
  - `competitor_paid_sov(keyword, brand_x)` — per competitor
- **Smoothing**: rules consume a rolling window (default: median of last 6
  observations over 24h), and every rule has entry and exit thresholds set
  apart (hysteresis) to prevent flapping.

## Phase 2 — Availability gate (runs first, every cycle)

- Subscribe to the **local/regional out-of-stock data stream** (inventory
  service or feed) for every advertised SKU, at the geo granularity the
  RMN targets (national campaign → national availability; store-level or
  regional targeting → per-region checks).
- Pause triggers:
  - SKU out of stock in ≥ X% of targeted regions (default 80%) → pause the
    SKU's ads in 15 minutes or one cycle, whichever is sooner.
  - SKU below reorder threshold with high sell-through velocity → flag
    `low_stock`, cut bids 50%, alert (don't wait for zero).
  - Listing suppressed/unbuyable (content takedown, price error, lost buy
    box where applicable) → pause immediately.
- **Resume logic** is explicit: restock confirmed in ≥ Y% regions (default
  50%) sustained for 2 consecutive checks → resume at last-known bid ×0.9
  and re-ramp. Never resume on a single inventory blip.
- All pauses/resumes log the inventory snapshot that triggered them.

## Phase 3 — Organic-dominance scale-back rules

Goal: stop paying for visibility already owned organically, without
surrendering the slot to a competitor.

- **Trigger**: for keyword K, `organic_rank ≤ 3` (or organic_sov ≥
  threshold, default 30%) sustained across the smoothing window, AND
  `competitor_paid_sov` on K below pressure threshold.
- **Action ladder** (one step per cycle, capped by directive #5):
  1. Reduce bid 20%; monitor paid_sov and — critically — organic rank.
  2. If total (paid+organic) SOV holds for 3 cycles, step down again.
  3. Floor at a "presence bid" (configurable, e.g., 30% of original)
     rather than full pause on head terms — going fully dark hands the
     sponsored slot to competitors and can feed back into organic rank via
     lost sales velocity.
- **Reversal**: organic rank drops below entry threshold − hysteresis gap,
  or competitor_paid_sov rises above pressure threshold → restore bids up
  the same ladder.
- **Incrementality check** (weekly): hold out a random keyword subset from
  scale-back to estimate what paid actually adds when organic is strong;
  feed the measured incrementality back into the thresholds.

## Phase 4 — Brand-defense budget shifts

- **Conquest-pressure signal**: on branded keywords, competitor_paid_sov
  above threshold (default 15%) or any competitor holding the top
  sponsored slot in ≥ half of observations in the window.
- **Action**: shift budget (within the daily reallocation cap) from the
  lowest-marginal-ROAS `category_growth` keywords into the pressured
  `brand_defense` terms; raise defense bids up to their configured max
  CPC. Branded-term defense budgets have a reserved floor that growth
  campaigns can never drain.
- **Stand-down**: pressure below exit threshold for 48h → return budget to
  source campaigns gradually (max 1/3 of the shifted amount per day).
- Guard against **defense-bid spirals**: if defense CPCs rise >50% while
  competitor SOV doesn't fall, flag for human review instead of continuing
  to raise — you may be bidding against another automation.

## Phase 5 — Loop safety and reporting

- **Kill switch**: a single flag halts all automated mutations while
  observation continues.
- **Anomaly freeze**: if SOV observations go stale (>2 missed cycles) or
  the inventory stream lags its SLA, freeze rules that depend on them —
  never act on stale data — and alert.
- **Daily ledger**: every rule firing with before/after bids, budget
  moves, pauses/resumes, and the metric evidence; plus a summary of paid
  vs. organic SOV trend per keyword role, spend saved by scale-back, and
  spend blocked by availability gates. An action that cannot be tied to a
  ledger entry is a bug report, not a feature.
