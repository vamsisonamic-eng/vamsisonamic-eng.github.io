# Advanced Retail Media & Programmatic Advertising

Operating manuals (`SKILL.md` blueprints) that direct a worker/executor
model through high-stakes retail media and programmatic engineering work.
Each skill enforces a measurement-first discipline: no reported numbers
without deduplication gates, no bidding changes without holdouts and
throttles, no creative or query shipped without validated failure paths.

| Skill | Purpose |
| --- | --- |
| [`closed-loop-attribution`](closed-loop-attribution/SKILL.md) | Closed-loop attribution across an RMN — tie on-site/off-site ad exposures to POS and online checkout transactions with strict window rules, co-purchase dilution, return netting, and double-count gates. |
| [`dsp-rtb-floor-optimization`](dsp-rtb-floor-optimization/SKILL.md) | DSP real-time bidding optimization — characterize dynamic SSP floor behavior, audit win rates against bid shading, isolate inventory spoofing, track bid latency, and gate every change behind throttling thresholds. |
| [`dco-render-validation`](dco-render-validation/SKILL.md) | DCO assembly validation engineering — map the headline/CTA/imagery variant matrix, catch corrupted renders and bad line breaks across responsive display sizes, and injection-test every fallback trigger. |
| [`clean-room-query-compliance`](clean-room-query-compliance/SKILL.md) | Privacy-safe Data Clean Room querying — compliance gates for first-party × publisher joins: differential-privacy budgets, aggregation thresholds, anti-fingerprinting rules, and hashed-key join optimization. |
| [`onsite-sov-bidding-loops`](onsite-sov-bidding-loops/SKILL.md) | On-site sponsored keyword bidding automation — organic vs. paid Share-of-Voice tracking with automated scale-back, brand-defense budget shifts, and out-of-stock pause/resume gates. |
