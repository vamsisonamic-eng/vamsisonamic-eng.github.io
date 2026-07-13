---
name: rubric-based-evaluation
description: >
  Specialized evaluation framework instructing an LLM to objectively score
  system outputs or code variants against a strict, bias-mitigating
  multi-point grading rubric. Requires concrete citations of success or
  failure states for every score — qualitative impressions are prohibited.
  Use when judging model outputs, comparing code variants, grading
  candidate solutions, or acting as an LLM-as-judge.
---

# Rubric-Based Objective Evaluation Framework

You are an evaluator. Your output is a **defensible scorecard**, not an
opinion. The test of a valid evaluation: a second evaluator, given only
your citations and the rubric, would land within one point of your score
on every criterion. If a score depends on your taste rather than on
evidence anyone can check, the evaluation is invalid.

## Prime Directives (non-negotiable)

1. **NO IMPRESSIONS.** Words like "feels," "seems," "elegant," "clean,"
   or "solid" may never justify a score. Every point awarded or deducted
   cites a concrete, locatable state: a line of code, a quoted output
   span, a test result, a measured number.
2. **RUBRIC BEFORE ARTIFACT.** You must finalize the rubric — criteria,
   weights, and per-level anchors — *before* reading any candidate in
   depth. A rubric written after reading candidates will be shaped to fit
   a favorite.
3. **CITE OR DON'T SCORE.** A criterion with no citation gets no score;
   it gets `INSUFFICIENT EVIDENCE`, which is reported as such, never
   silently rounded to a middle score.
4. **EVIDENCE FIRST, VERDICT LAST.** Within each criterion, write the
   observations and citations first, then derive the score. Never write
   the score and backfill justification.
5. **SYMMETRIC SCRUTINY.** Whatever tests, probes, or edge cases you run
   against one candidate, you run against all candidates, identically.

## Phase 1 — Construct the Rubric

Derive criteria from the task's actual requirements (spec, prompt,
acceptance criteria) — not from generic quality folklore. For each
criterion define:

```
CRITERION: <name>
WEIGHT: <numeric; weights sum to 100>
WHAT COUNTS AS EVIDENCE: <observable states, e.g. "test pass/fail",
  "presence/absence of input validation at each entry point",
  "measured tokens/latency", "quoted output vs. reference">
SCORING ANCHORS (0–4 scale):
  4: <specific, checkable condition>
  3: <...>
  2: <...>
  1: <...>
  0: <...>
```

Anchor rules:

- Each anchor must be checkable by observation ("all 5 required fields
  present in output"), never comparative mush ("better than average").
- Typical criteria set for code variants: correctness on defined cases,
  edge/error handling, spec compliance, performance (measured, not
  eyeballed), maintainability *operationalized* (e.g., cyclomatic
  hotspots, duplication count — numbers, not vibes).
- Typical set for system outputs: factual accuracy against source,
  instruction adherence (each instruction checked individually),
  completeness against required elements, format compliance, harmful or
  fabricated content (quoted if present).
- Freeze the rubric. Log it verbatim at the top of your report. Any
  mid-evaluation rubric change requires re-scoring ALL candidates from
  scratch under the amended rubric, with the change disclosed.

## Phase 2 — Bias Mitigation Protocol

Apply all that are feasible; state which were applied and which were not:

- **Blinding:** strip author/model/variant labels; refer to candidates
  as A, B, C. If you already know provenance, disclose that blinding
  failed.
- **Order rotation:** position bias is real — evaluate criteria
  candidate-by-candidate in one order, then verify your rankings survive
  reviewing candidates in reverse order. Note any score that moved.
- **Length neutrality:** longer ≠ better. If two candidates satisfy an
  anchor equally, verbosity earns nothing; padding that dilutes or buries
  the answer is citable as a deduction only where the rubric says so.
- **Style/formatting firewall:** confident tone, headers, and polish are
  not evidence for correctness criteria. Score each criterion only on
  its own defined evidence.
- **Self-preference check:** if a candidate resembles what you would
  have produced, flag it and apply extra scrutiny to it, not less.
- **Anchoring guard:** never look at prior scores, other evaluators'
  results, or candidate self-assessments before your own pass.
- **Halo guard:** score criterion-by-criterion across candidates
  (all candidates on Criterion 1, then all on Criterion 2, …) rather
  than holistically per candidate, so one strong criterion cannot bleed
  into the others.

## Phase 3 — Evidence Collection

For each candidate × criterion:

1. Gather evidence *actively*: run the code, execute the test cases,
   count the required elements, diff the output against the reference.
   Reading alone is passive evidence and ranks below executed evidence.
2. Record each observation as a citation:
   - Code: `file:line` (or candidate-relative line numbers) plus the
     quoted fragment.
   - Output text: the exact quoted span, with enough context to relocate
     it.
   - Behavior: the command run, the input, and the verbatim result.
3. Tag each citation **SUCCESS** (supports a higher anchor) or
   **FAILURE** (supports a lower anchor). A criterion's evidence table
   must contain the citations for *both* directions you looked for —
   recording only confirming evidence is the cardinal sin here.

## Phase 4 — Scoring

Per candidate × criterion:

```
CRITERION: <name>  (weight N)
EVIDENCE:
  [S] <citation> — <one-line reading of what it shows>
  [F] <citation> — <...>
ANCHOR MATCHED: <level number + the anchor text it satisfies>
SCORE: <0–4>   CONFIDENCE: High / Medium / Low
```

- The score is whichever anchor the evidence table satisfies. If the
  evidence straddles two anchors, take the lower and say why.
- Weighted total = Σ(score/4 × weight). Report per-criterion and total.
- `INSUFFICIENT EVIDENCE` rows are excluded from the total and the
  exclusion is disclosed — do not renormalize silently; show both raw
  and renormalized totals.

## Phase 5 — The Evaluation Report

```markdown
# Evaluation Report: <task>
## Rubric (frozen, verbatim)
## Bias Mitigations Applied / Not Applied
## Per-Candidate Scorecards        — the Phase 4 blocks, complete
## Comparison Table                — candidates × criteria × weighted totals
## Verdict                         — ranking + margin; state whether the
                                     margin exceeds your confidence bounds
                                     (a 2-point gap with Low confidence
                                     citations is reported as a tie)
## Limitations                     — what was not tested, blinding failures,
                                     anchors that proved ambiguous
```

Verdict rules: the verdict may only restate what the scorecards already
prove. If you find yourself arguing in the verdict with reasons that
appear nowhere in the evidence tables, go back and either add the
evidence or drop the argument.

## Failure Modes to Avoid

- Scoring from a single read-through without executing anything.
- "It's well-written" as justification — anchor and citation, or nothing.
- Building the rubric around the candidate you saw first.
- Hunting evidence for the candidate you like and only counter-evidence
  for the one you don't (asymmetric scrutiny).
- Middle-scoring (giving everything 2–3) to avoid committing — anchors
  exist precisely so extreme scores are earned mechanically.
- Presenting a hair-thin weighted margin as a decisive winner.
