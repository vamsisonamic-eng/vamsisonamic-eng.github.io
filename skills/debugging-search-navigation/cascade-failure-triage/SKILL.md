---
name: cascade-failure-triage
description: >
  Root-cause isolation framework for cascading microservice failures and
  verbose production crash logs. Use whenever the input is a wall of logs,
  a multi-service outage, a crash dump, or an error that appears in many
  places at once. Enforces noise filtering, upstream stack-trace tracing to
  the first fault, and proof of the diagnostic hypothesis via a targeted,
  isolated reproduction script before any fix is proposed.
---

# Cascading Failure & Crash-Log Triage Framework

You are a worker model operating under this framework. Your job is NOT to
"fix the error that appears most often in the logs." Your job is to **find
the first domino — the earliest genuine fault from which every other error
follows — and prove it with an isolated reproduction before touching
anything.**

## Prime Directives (non-negotiable)

1. **VOLUME IS NOT CAUSALITY.** The loudest, most repeated error is almost
   always a downstream victim. Frequency ranks noise; *time and dependency
   order* rank causes.
2. **TRACE UPSTREAM, NOT DOWN.** Every error you examine gets one question:
   "what failed *before* this that could explain it?" You stop tracing only
   when nothing upstream can explain the fault — that is your root-cause
   candidate.
3. **HYPOTHESIS BEFORE FIX, PROOF BEFORE HYPOTHESIS IS TRUSTED.** A root
   cause is a *claim* until a minimal, isolated script reproduces the
   failure through that exact mechanism. No proof, no fix.
4. **ONE ROOT CAUSE AT A TIME.** If evidence suggests multiple independent
   faults, split them into separate investigations with separate proofs —
   never a combined fix for an unproven combination.
5. **REPORT WHAT THE LOGS SAY, NOT WHAT THEY IMPLY.** Quote log lines
   verbatim with timestamps; paraphrased evidence is not evidence.

## Phase 1 — Establish the failure timeline

Before reading any stack trace in depth:

- Identify the **incident window**: first anomalous line → last. Normalize
  timezones/clock skew across services before ordering anything.
- Build a **first-occurrence table**: for each distinct error signature,
  its earliest timestamp, emitting service, and count. Sort by *first
  occurrence*, never by count.
- Note deploys, config changes, scaling events, and dependency status
  changes inside or just before the window — these are prior probability,
  not proof.

## Phase 2 — Filter the noise

Explicitly discard, with a one-line justification each:

- **Echo errors**: the same failure re-logged by retries, health checks, or
  every caller up a call chain.
- **Victim errors**: timeouts, connection-refused, circuit-breaker opens,
  and 5xx responses whose target is itself already failing.
- **Chronic noise**: warnings/errors that also appear *outside* the
  incident window at the same rate (grep a pre-incident window to check).

What survives is the **candidate set** — typically 1–3 signatures. If more
than 3 survive, your filter is too loose; re-apply it.

## Phase 3 — Trace the stack upstream

For each candidate:

1. Read the **innermost frame** of the deepest/original exception (follow
   `Caused by:` / `__cause__` / wrapped-error chains to the bottom — the
   outermost exception is packaging, not cause).
2. Open the cited code at file:line. Determine what inputs or state make
   that exact line fail that exact way.
3. Walk **one hop upstream** — the caller, the message producer, the
   service that supplied the bad input — and check the timeline for a
   correlated earlier anomaly there. Repeat until the hop finds nothing
   earlier.
4. Record the chain: *service A emitted X at T0 (quote) → caused B's Y at
   T1 (quote) → surfaced as the reported crash at T2.* Every arrow cites a
   log line or file:line.

Cross-service, prefer hard correlation (trace IDs, request IDs) over
timestamp adjacency; say which you used.

## Phase 4 — State the hypothesis

Write it in falsifiable form:

> **Hypothesis:** `<specific input/state>` reaching `<file:line>` in
> `<service>` causes `<precise failure>`, which cascades via `<mechanism>`
> to produce the reported symptoms.
> **This is false if:** `<observable check that would disprove it>`.

## Phase 5 — Prove it in isolation

Write the smallest script that exercises **only the suspected mechanism**:

- A unit test that feeds the reconstructed bad input to the suspect
  function directly — no network, no full service boot, stub every
  collaborator that isn't part of the mechanism.
- It must **fail for the hypothesized reason** (assert on the specific
  exception/behavior, not just "it errors") and **pass when the input is
  corrected** — both directions, or the proof is one-sided.
- If the trigger is environmental (connection-pool exhaustion, clock,
  resource limit), simulate that one condition explicitly in the harness.

If the script won't reproduce the failure, the hypothesis is **rejected**:
return to Phase 3 with what the attempt taught you. Do not widen the script
until it "catches something" — that proves nothing.

## Phase 6 — Report

Deliverable, in order:

1. **Root cause** (one sentence) and the proven causal chain with quoted
   evidence.
2. The reproduction script, its failing output verbatim, and its passing
   output after correction.
3. **Blast map**: which observed errors were downstream victims of this
   cause (so responders stop chasing them) and which, if any, remain
   unexplained.
4. Proposed fix and the regression test (usually the Phase 5 script,
   promoted into the suite).

An investigation that ends with "the logs suggest…" and no reproduction is
unfinished. Say so explicitly and state what access or data is needed to
finish it.
