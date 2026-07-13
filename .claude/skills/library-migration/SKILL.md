---
name: library-migration
description: >
  Execute sweeping library or version migrations (framework upgrades, dependency
  major-version bumps, API replacements) across a large repository. Use when the
  user asks to migrate, upgrade, or replace a library/runtime/framework version
  repo-wide, or to plan such a migration. Enforces a full mapping phase before
  any code change, surfaces hidden breaking points and backward-compatibility
  risks, and structures execution as decoupled, incrementally testable PRs with
  strict rollback criteria.
---

# Library / Version Migration Skill

You are performing a repository-wide migration. The failure mode of large
migrations is not "hard code" — it is **unmapped blast radius**: call sites you
never found, behavioral changes with no compile error, and one giant PR nobody
can review or revert. This skill exists to prevent those three failures.

**Hard rules (non-negotiable):**

1. **No code changes until Phase 1 (Mapping) and Phase 2 (Risk Assessment) are
   complete and written to the migration ledger.**
2. **Never ship the migration as one PR.** Every PR must be independently
   mergeable, independently testable, and independently revertible.
3. **Every PR declares its rollback criteria before it is opened.**
4. **Old and new must coexist** during the migration window unless the ledger
   proves coexistence is impossible (then say so explicitly and get user
   sign-off on a big-bang cutover).

---

## Phase 0 — Scope Contract

Before anything else, pin down and echo back to the user:

- **Source → target**: exact package(s) and versions (e.g. `react@17.0.2 →
  react@18.3.x`). Resolve the *actual* installed versions from lockfiles, not
  from manifest ranges.
- **Definition of done**: old dependency fully removed? Or coexistence
  acceptable long-term?
- **Constraints**: freeze windows, release cadence, minimum supported
  runtimes/consumers, whether the repo publishes packages others depend on.

If any of these are ambiguous, ask now — not mid-migration.

## Phase 1 — Mapping (mandatory, read-only)

Produce a **migration ledger** at `docs/migrations/<name>/LEDGER.md` (create
the directory). No source edits in this phase.

### 1.1 Enumerate affected modules

- Grep for every import form: named imports, default imports, namespace
  imports, `require()`, dynamic `import()`, re-exports, and **string-based
  references** (DI tokens, config files, codegen templates, docs, Dockerfiles,
  CI workflows).
- Include lockfiles and transitive constraints: run the package manager's
  dependency-tree command (`npm ls`, `pnpm why`, `pip show`/`pipdeptree`,
  `mvn dependency:tree`, `go mod graph`, etc.) to find **transitive consumers**
  of the migrating library — these break silently when you bump the root.
- Record every hit in the ledger as a table: `path | usage kind | APIs used |
  owning area | test coverage (yes/partial/none)`.

### 1.2 Build the API usage inventory

For each *distinct API* of the old library that the repo touches, record:
usage count, whether the target version keeps / renames / removes / changes
semantics of it, and the replacement. Read the target's official changelog and
migration guide — do not migrate from memory. If network access allows, fetch
the actual release notes for every major version being crossed (crossing 2
majors means reading 2 changelogs).

### 1.3 Hidden breaking points checklist

Explicitly check and record findings for each of these — they are the classic
silent killers:

- **Behavioral changes with identical signatures** (default option changes,
  ordering/stability changes, timezone/locale defaults, error types thrown).
- **Type-level breaks**: stricter generics, removed type exports, `any` →
  concrete narrowing that surfaces latent bugs.
- **Peer/transitive conflicts**: two versions of the library hoisted at once
  (singleton libraries — React, Prisma, ORMs, DI containers — break here).
- **Serialization/wire formats**: anything persisted (DB rows, caches, queues,
  cookies, snapshots) written by the old version and read by the new.
- **Runtime floor changes**: new library requiring newer Node/Python/JVM than
  CI, prod images, or downstream consumers run.
- **Build/tooling coupling**: bundler plugins, lint rules, codemods, mocks and
  test doubles that encode old internals (deep imports into `lib/…` paths).
- **Monkey-patches and internal-API usage**: grep for deep imports and
  `@ts-ignore`/`# type: ignore` near the library — these have zero upgrade
  guarantees.

### 1.4 Dependency graph & cut lines

Group the affected modules into **migration units**: clusters that must move
together (shared types, singleton providers) vs. clusters that can move
independently. Draw the cut lines in the ledger. Each unit becomes one PR (or
a small chain). Order units leaf-first: migrate modules with no dependents
before their consumers.

## Phase 2 — Backward-Compatibility Risk Assessment

For each migration unit, assign a risk grade in the ledger:

- **GREEN** — mechanical rename/codemod, full test coverage, no behavior change.
- **YELLOW** — behavior change covered by tests, or mechanical change with
  partial coverage. Requires added tests *before* the migration commit.
- **RED** — behavior change with weak/no coverage, persisted-data implications,
  or public-API impact on external consumers. Requires: characterization tests
  written first, a compat shim or feature flag, and explicit user sign-off.

Also decide the **coexistence strategy** (pick one per unit, record it):

1. **Adapter/facade**: wrap the library behind an internal interface; swap the
   implementation per-unit. Preferred for RED units.
2. **Dual-dependency aliasing** (`old-lib` + `new-lib` installed under aliases)
   where the ecosystem allows it.
3. **Feature flag / env switch** for runtime-selectable paths.
4. **Leaf-first direct migration** when the library is not a singleton and
   versions can coexist safely.

If the repo publishes packages, enumerate downstream consumers and state
whether the migration is semver-major for them.

**Gate:** present the ledger summary (unit list, risk grades, PR sequence,
estimated count) to the user before writing any migration code.

## Phase 3 — Execution as decoupled PRs

Standard PR sequence (adapt, but keep the shape):

1. **PR 0 — Scaffolding (no behavior change):** add the new dependency
   side-by-side, adapters/interfaces, feature flags, lint rule forbidding *new*
   usage of the old API (ratchet), CI job running both old and new paths where
   applicable. Merges green trivially.
2. **PRs 1..N — One migration unit each**, leaf-first, in ledger order. Each PR:
   - Touches only its unit (plus generated lockfile churn).
   - Adds/updates tests **in the same PR**; YELLOW/RED units land their new
     tests as a *preceding* PR against the old version so the tests prove
     equivalence, not just "new code passes new tests".
   - Contains a `## Rollback` section in its description (see below).
   - Is small enough to review in one sitting (~≤400 lines of hand-written
     diff; codemod output may be larger but must be regenerable via a script
     committed in the PR).
3. **PR N+1 — Cutover:** flip flags/defaults to the new path. No other changes.
4. **PR N+2 — Removal:** delete the old dependency, shims, flags, and the
   ratchet lint rule's allowlist. Only after a soak period defined in Phase 0.

**Codemods:** for mechanical changes across many files, write the codemod,
commit the script, and note the exact command in the PR body so the diff is
reproducible and re-runnable after rebases. Never hand-edit codemod output —
fix the codemod.

**Incremental verification per PR:** typecheck + lint + unit tests for the
unit, the repo's full CI suite, and — for YELLOW/RED — an end-to-end exercise
of the affected flow. Record the verification commands run in the PR body.

## Phase 4 — Rollback criteria (per PR, written before opening it)

Every migration PR's description must contain:

- **Revert mechanism**: `git revert` of the single PR merge commit must
  restore the previous behavior with no follow-up edits. If it can't (e.g.
  data written in a new format), the PR is misdesigned — split it or add a
  compat reader first.
- **Trip conditions** (any one triggers rollback, no debate in the moment):
  - CI or canary error rate above the unit's stated threshold.
  - Any data-corruption or wire-format incident, however small.
  - A RED-unit behavioral regression reported by any consumer.
- **Rollback owner and window**: who reverts, and within what time.
- **Data considerations**: whether anything persisted during the window must
  be migrated back or is dual-readable.

Flag-based units roll back by flipping the flag first, reverting second.

## Ledger maintenance & completion

- Update `LEDGER.md` status column (`pending / in-PR / merged / reverted`) as
  each unit lands; the ledger is the single source of truth for progress.
- The migration is **complete** only when: old dependency absent from all
  lockfiles, zero grep hits for old imports (including strings/docs/CI), the
  ratchet rule and shims removed, and the ledger closed out with a final
  summary of deviations from plan.

## Anti-patterns (refuse and re-plan if you catch yourself doing these)

- Starting edits before the ledger exists.
- "While I'm here" refactors inside migration PRs — migration diffs must be
  boring and mechanical.
- Bumping the version first and chasing compile errors as the discovery
  mechanism.
- A PR whose revert requires another PR.
- Treating a green typecheck as proof of behavioral equivalence.
