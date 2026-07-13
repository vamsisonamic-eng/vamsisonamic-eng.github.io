---
name: git-regression-forensics
description: >
  Systematic framework for troubleshooting software regressions by auditing
  git history. Use whenever behavior that previously worked is now broken,
  a bug report says "this used to work," or a change window must be
  identified. Enforces evidence-driven blame tracing, reconstruction of the
  architectural intent behind historical code, and an explicit causal map
  from a specific past mutation to the present-day defect. Prohibits fixing
  the symptom before the introducing commit is identified.
---

# Git Regression Forensics Framework

You are a worker model operating under this framework. Your job is NOT to
"patch the broken line." Your job is to **prove which historical change broke
the system, understand why that change was made, and only then design a fix
that honors both the original intent and the intent of the change that broke
it.**

## Prime Directives (non-negotiable)

1. **NO FIX BEFORE CAUSE.** You may not modify product code until you have
   named a specific commit (or a bounded set of ≤3 candidate commits) as the
   regression source, with cited evidence.
2. **BLAME IS A STARTING POINT, NOT AN ANSWER.** `git blame` shows the last
   touch, not the guilty touch. Every blame result must be re-blamed past
   formatting, renames, and refactors (`git blame -w -C -C -M`, `git log
   --follow`) until you reach a commit that changed *behavior*.
3. **INTENT BEFORE JUDGMENT.** Before declaring any historical change wrong,
   reconstruct what its author was trying to achieve — from the commit
   message, the PR/issue it references, the tests it added, and the sibling
   changes in the same commit. A change that looks wrong in isolation is
   usually load-bearing for something else.
4. **EVERY CLAIM CITES A COMMIT.** Statements about history must cite a
   commit hash and file:line. "It was probably changed during the refactor"
   is not evidence.
5. **REPRODUCE OR DISQUALIFY.** A candidate commit is only confirmed when
   the bug reproduces at that commit and does not reproduce at its parent
   (or when the causal mechanism is proven by direct code reading and stated
   as such).

## Phase 1 — Define the regression precisely

Produce a **Regression Statement** before touching git:

- **Observed behavior now** (exact command/input → exact wrong output).
- **Expected behavior** and *evidence it ever actually worked* — a version,
  tag, date, CI run, or user report. If you cannot establish that it ever
  worked, STOP: this is a latent bug, not a regression, and you must say so.
- **Known-good boundary**: the most recent point (tag/commit/date) where the
  behavior was correct, and the earliest point where it is known broken.

## Phase 2 — Narrow the change window

Choose the cheapest sufficient tool, in this order:

1. **Targeted log**: `git log --oneline <good>..<bad> -- <suspect paths>` —
   when the affected code surface is known.
2. **Content search**: `git log -S '<symbol or literal>' --oneline` /
   `git log -G '<regex>'` — when a specific value, constant, or condition
   changed.
3. **Bisect**: `git bisect start <bad> <good>` with a scripted repro
   (`git bisect run <script>`) — when the window is wide and a cheap,
   deterministic repro exists. Write the repro script first; a bisect with
   a flaky test produces a confidently wrong answer.

Log the window and the tool used. If the window contains merges from
long-lived branches, bisect with `--first-parent` first to find the merge,
then descend into it.

## Phase 3 — Blame trace with archaeology

For each suspect line/block in the current code:

1. `git blame -w -C -C -M <file>` at the relevant lines.
2. For each hit, read the **full commit**: message, all hunks, tests
   added/removed, and any linked PR/issue text.
3. If the commit is cosmetic (rename, move, reformat), re-blame the parent
   (`git blame <hash>^ -- <old-path>`) and repeat until you hit a behavioral
   change.
4. Record the chain in a **Blame Ledger** table:

   | Line(s) | Commit | Date | Author intent (1 sentence) | Behavioral change? |

## Phase 4 — Reconstruct architectural intent

For the introducing commit and the code it modified, answer in writing:

- What invariant or contract did the *original* code (pre-mutation) enforce,
  and where else in the system does code still assume that invariant?
  (Cite file:line for each assuming call site.)
- What was the mutating commit *for* — what did it fix or enable, and does
  that need still exist today?
- **Causal map**: a short chain of the form
  *commit `abc123` changed X (file:line) → invariant Y no longer holds →
  call site Z (file:line) still assumes Y → observed failure.*
  Every arrow must cite code or a commit.

## Phase 5 — Confirm

- Check out the candidate commit and its parent; run the repro at both.
  State the results verbatim.
- If checkout/build at historical commits is impractical, prove the
  mechanism by reading: quote the before/after hunks and walk the failing
  input through both versions.

## Phase 6 — Fix design (only now)

Present, before implementing:

1. The confirmed root cause (commit + mechanism).
2. **Fix options** with trade-offs — at minimum: (a) restore the broken
   invariant while preserving what the mutating commit achieved, (b) update
   the assuming call sites to the new invariant, (c) revert. State which
   sites each option touches and which regressions each could itself cause.
3. Your recommendation and the regression test that pins the behavior so
   this cannot silently break again.

## Output contract

Your final report must contain: the Regression Statement, the change window
and tool used, the Blame Ledger, the causal map, confirmation evidence, and
the fix design. A report missing the causal map is incomplete — do not
declare the investigation done without it.
