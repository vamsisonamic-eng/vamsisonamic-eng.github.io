---
name: fable-gate-3-adversarial-attack
description: >
  Fable Mode Gate 3 — Adversarial Attack. Mandatory pre-completion gate that
  forces the model to actively attempt to break its own generated solution
  before declaring it done. Use whenever a nontrivial implementation, fix, or
  refactor is about to be marked complete. Triggers on: "gate 3", "adversarial
  attack", "break your own code", "red-team this solution", or any task where
  correctness under hostile or unexpected conditions matters.
---

# Fable Mode Gate 3: Adversarial Attack

You are no longer the author of this solution. You are its adversary. Your
sole objective in this gate is to make the code you just wrote fail. The
solution may not be declared complete until it has survived every phase below,
or until every discovered failure has been fixed and the gate re-run.

**Prime directive:** Assume your solution is wrong. Your job is to prove it.
Confidence generated during authorship is inadmissible evidence here.

## Operating rules

1. **Switch identity.** Before starting, write one sentence stating your new
   role: "I am now attacking this code. My success condition is a demonstrated
   failure." Do not defend the code. Do not explain why an attack "shouldn't
   matter." Either the attack fails empirically, or you fix the code.
2. **Attacks must be executed, not imagined.** Wherever the environment allows
   running code, actually run the attack (write a test, a script, a REPL
   probe). A purely mental attack is only acceptable when execution is
   impossible, and must then be documented as UNVERIFIED.
3. **Every finding blocks completion.** There is no "minor" finding at this
   gate. Fix it or explicitly surface it to the user as a known limitation
   with a concrete failure scenario. Silent acceptance is prohibited.
4. **Re-run after fixing.** Any fix made during this gate re-opens the gate.
   Repeat the phases that touched the changed code path.

## Phase 1 — Assumption interrogation

Enumerate every assumption the solution silently relies on. For each, write it
down explicitly and then challenge it:

- **Input assumptions:** Does the code assume non-empty? Sorted? Unique? UTF-8?
  Positive? Within int range? Trimmed? Present at all? For each assumption,
  construct the input that violates it and trace (or run) what happens.
- **Environment assumptions:** Does it assume the file exists, the directory is
  writable, the network is up, the clock is monotonic, the locale is en-US, the
  timezone is UTC, the dependency version matches?
- **Ordering assumptions:** Does correctness depend on calls happening in a
  particular order? What happens if a caller invokes them out of order, twice,
  or not at all (missing init, double close, use-after-teardown)?
- **State assumptions:** Does it assume it is the only writer? That cached
  state is fresh? That an ID it generated earlier still exists?

Output format for this phase: a table of `assumption | violating input |
observed result | verdict (SAFE / BROKEN / UNVERIFIED)`.

## Phase 2 — Silent edge-case failure scan

Hunt specifically for failures that produce *wrong answers without errors* —
these are worse than crashes because nothing alerts anyone:

- Off-by-one at every boundary: empty collection, single element, exactly at a
  limit, one past a limit, maximum size.
- Numeric traps: zero, negative zero, negative numbers where positives were
  expected, integer overflow, float precision (`0.1 + 0.2`), NaN and Infinity
  propagation, division by zero, truncation vs rounding.
- String traps: empty string, whitespace-only, embedded null bytes, mixed
  normalization forms (é as one codepoint vs two), surrogate pairs/emoji in
  length or slicing logic, extremely long strings.
- Time traps: DST transitions, leap years/seconds, epoch boundaries, timezone
  drift between server and client, timestamps in the past/future.
- Collection traps: duplicate keys, mutation during iteration, key collisions
  after case-folding or trimming.
- Swallowed errors: every `catch`/`except`/`rescue` block — does it hide a
  failure and let execution continue with corrupt state? Every ignored return
  value or unchecked error code.

For each category, either demonstrate safety with a concrete probe or record a
finding.

## Phase 3 — Concurrency and race-condition simulation

Even if the code "isn't concurrent," its callers may be. Attack it as if two
or more executions overlap:

- **Check-then-act windows:** Find every place the code reads state and then
  acts on it (exists-then-create, check-balance-then-debit,
  read-then-increment-then-write). For each, describe the interleaving where a
  second actor mutates state inside the window, and determine the damage.
- **Shared mutable state:** Module-level variables, caches, singletons,
  connection objects, lazily-initialized globals. Can two threads/requests
  observe half-initialized state?
- **Idempotency under retry:** Simulate the caller timing out and retrying.
  Does the operation apply twice (double charge, duplicate row, double send)?
- **Deadlock and starvation:** If locks/queues/awaits exist, attack lock
  ordering and unbounded waits.
- **Practical simulation:** Where a runtime is available, write a stress probe
  — spawn N concurrent workers hammering the same entry point with overlapping
  keys — and assert invariants afterward (totals conserved, no duplicates, no
  corruption). If the language runtime cannot express real parallelism for the
  code under test, force adversarial interleavings manually (inject sleeps or
  reorder steps) and document what you did.

## Phase 4 — Malformed and hostile payload injection

Feed the solution input crafted to hurt it. Build a payload battery and pass
each item through every external entry point (function args, HTTP handlers,
CLI flags, file parsers, message consumers):

- Structurally malformed: truncated JSON/XML, wrong types (string where number
  expected, object where array expected), missing required fields, extra
  unexpected fields, deeply nested structures (1000+ levels), circular
  references where serialization is involved.
- Boundary abuse: zero-length bodies, multi-megabyte bodies, headers/fields at
  and past documented limits.
- Injection-shaped content: `'; DROP TABLE`, `<script>`, `../../etc/passwd`,
  `$(rm -rf)`, format-string tokens, CR/LF header splitting, null bytes — not
  to exploit, but to verify the code neither executes/interprets them nor
  corrupts itself handling them.
- Encoding chaos: invalid UTF-8 sequences, BOMs, mixed encodings, URL-encoded
  and double-encoded payloads.
- Protocol lies: `Content-Type` that doesn't match the body, declared lengths
  that don't match actual lengths, compressed bombs where decompression happens.

Acceptance criterion for every payload: the code must fail *closed and loud* —
a clean, typed rejection with no partial state mutation, no hang, no resource
leak, and no stack trace leaking internals to the caller.

## Phase 5 — Verdict

Produce the gate report:

```
GATE 3 — ADVERSARIAL ATTACK REPORT
Attacks executed: <n>   (unverified mental-only: <n>)
Findings: <n> — each listed as: [severity] description → fix applied / surfaced
Surviving known limitations (user-visible): <list or none>
VERDICT: PASS | FAIL
```

The gate passes only when findings are zero or every remaining item is
explicitly surfaced to the user. A FAIL verdict returns the work to
implementation; completion may not be claimed. Never soften the report to
make the work look finished.
