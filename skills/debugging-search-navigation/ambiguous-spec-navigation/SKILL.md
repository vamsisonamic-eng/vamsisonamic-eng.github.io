---
name: ambiguous-spec-navigation
description: >
  Strict logic path for working from complex, conflicting, or poorly defined
  engineering specs. Use whenever requirements are vague, internally
  contradictory, silent on critical behavior, or conflict with the existing
  codebase. Forces the worker to map hidden gaps, surface every load-bearing
  assumption, and present structured decision points to the user instead of
  executing on blind guesses. Prohibits inventing requirements.
---

# Ambiguous Specification Navigation Framework

You are a worker model operating under this framework. Your job is NOT to
"do something plausible with a vague spec." Your job is to **turn an
under-specified request into an explicit, user-ratified contract before
writing code — or to proceed only on assumptions you have declared and the
user could veto.**

## Prime Directives (non-negotiable)

1. **NO BLIND GUESSES ON LOAD-BEARING DECISIONS.** If two reasonable
   engineers would build observably different systems from the same spec
   sentence, that sentence is a decision point for the user, not for you.
2. **GAPS ARE FINDINGS, NOT OBSTACLES.** Every hole you find in the spec is
   a deliverable: name it, classify it, and either resolve it from evidence
   or escalate it as a structured choice.
3. **ASSUMPTIONS MUST BE WRITTEN, RANKED, AND VISIBLE.** An assumption you
   act on silently is a guess. An assumption you state, justify, and mark
   as reversible is engineering.
4. **THE CODEBASE IS PART OF THE SPEC.** Existing conventions, tests, data
   shapes, and adjacent features are evidence of intent. Read them before
   asking the user anything they've already answered in code.
5. **CONFLICTS ARE NEVER RESOLVED BY PICKING SILENTLY.** When two spec
   statements (or spec vs. codebase) contradict, both interpretations go to
   the user unless one is provably impossible.

## Phase 1 — Decompose the spec

Restate the request as an inventory of atomic requirements, each tagged:

- **EXPLICIT** — stated directly in the spec (quote it).
- **IMPLIED** — not stated, but necessary for any stated requirement to
  function (justify the implication).
- **ABSENT** — needed to build, but neither stated nor implied.

Anything you cannot tag is itself a gap. List inputs, outputs, actors,
error behavior, performance/scale expectations, and lifecycle (create/
update/delete/migrate) even when the spec is silent on them — silence on
these is where hidden gaps live.

## Phase 2 — Interrogate the codebase

Before formulating any question, search the existing code for answers:
prior art for similar features, naming and layering conventions, existing
data models the feature must coexist with, and tests that encode current
expectations. Record each answer as **RESOLVED-BY-CODE** with file:line
citations. A question answerable from the codebase must never reach the
user.

## Phase 3 — Gap and conflict map

Produce a table of everything still unresolved:

| # | Gap / Conflict | Type | Why it matters | Blast radius if guessed wrong |

Types: `MISSING-BEHAVIOR`, `UNDEFINED-EDGE-CASE`, `INTERNAL-CONTRADICTION`,
`SPEC-VS-CODEBASE`, `UNDEFINED-SCOPE-BOUNDARY`, `NONFUNCTIONAL-SILENCE`
(perf/security/compat unstated).

Then classify each row:

- **Tier A (blocking):** changes the architecture, public API, data model,
  or user-visible behavior. → must go to the user.
- **Tier B (declarable):** any reasonable choice is cheap to reverse later.
  → proceed on a stated default assumption.
- **Tier C (immaterial):** does not affect observable behavior. → resolve
  yourself, note it.

## Phase 4 — Structured escalation (Tier A)

For every Tier A item, present a structured choice — never an open-ended
"what do you want?" question. Each choice must contain:

1. The gap, in one sentence, quoting the conflicting/missing spec text.
2. **2–4 concrete options**, each with: what gets built, trade-offs, and
   what it forecloses later.
3. Your **recommended option and why**, marked as such.

Batch all Tier A questions into one round so the user is interrupted once,
not serially. If an interactive question tool is available, use it; if not,
end your turn with the decision list — **do not begin implementation of any
Tier A-dependent work while questions are open.** Work that is independent
of every open question may proceed in the meantime.

## Phase 5 — Declared-assumption execution (Tier B)

Before implementing, publish an **Assumption Register**:

| # | Assumption | Basis (spec quote / code cite / convention) | Reversal cost |

Then implement against it. Every assumption must be traceable in the final
summary; if later evidence contradicts a registered assumption, stop and
re-classify it (it may have become Tier A).

## Phase 6 — Contract echo

Before writing code, restate the now-resolved spec as a short numbered
contract: what will be built, what is explicitly out of scope, and which
behaviors are pinned by which decision (user answer, code evidence, or
registered assumption). This echo is the acceptance baseline — the final
deliverable is checked against it, not against your memory of the original
vague request.

## Failure modes this framework exists to prevent

- Building the wrong feature confidently because the first plausible
  interpretation was adopted without surfacing alternatives.
- Asking the user questions the codebase already answers.
- Resolving a spec contradiction by silently favoring whichever sentence
  was read last.
- Burying a load-bearing assumption in a code comment instead of the
  decision record.
