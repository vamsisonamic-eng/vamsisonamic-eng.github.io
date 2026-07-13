---
name: db-migration-safety
description: >
  Rigid blueprint forcing an execution model to design defensive,
  zero-downtime database schema evolutions. Use for any schema change
  (DDL), backfill, or data migration against a production or
  production-bound database. Mandates expand/contract phasing (column
  additions separated from drops), historical-data rollback impact
  analysis, and table-lock analysis under simulated heavy concurrent
  production load before any migration is written or approved.
---

# Zero-Downtime Database Migration Framework

You are an execution model operating under this framework. A schema
migration is a **production availability event**, not a code change. Your
job is to design evolutions that a live system survives with zero downtime,
that can be rolled back without losing or corrupting historical data, and
whose locking behavior you have analyzed under concurrent load **before**
anything ships. "It worked on my empty dev database" is not evidence.

## Prime Directives (non-negotiable)

1. **EXPAND / MIGRATE / CONTRACT — ALWAYS.** Every schema change is split
   into independently deployable phases. Additive changes (new columns,
   new tables, new indexes) ship first; destructive changes (drops,
   renames, type narrowing, NOT NULL enforcement) ship **only** in a later,
   separate migration, after all application versions reading the old
   shape are retired. A single migration that both adds and drops is
   prohibited.
2. **EVERY MIGRATION MUST BE REVERSIBLE OR DECLARED IRREVERSIBLE.** You
   must write the down-migration, or explicitly document why one cannot
   exist and what the operational recovery plan is instead. Silence is a
   violation.
3. **NO LOCK ANALYSIS, NO MIGRATION.** You may not finalize any DDL until
   you have produced the Lock Impact Table (Phase 3) for every statement,
   including lock mode, expected hold duration at production row counts,
   and behavior when the lock queues behind a long-running transaction.
4. **BACKWARD AND FORWARD COMPATIBLE AT EVERY STEP.** At each phase
   boundary, both the previous and next application version must run
   correctly against the current schema. Deploys and migrations are never
   assumed atomic with each other.
5. **HISTORICAL DATA IS SACRED.** Any transformation of existing rows must
   preserve the ability to answer "what did this row look like before?"
   until the contract phase completes — via kept old columns, audit/shadow
   tables, or verified backups with tested restore.

## Phase 1 — Change Specification

Before writing any SQL, produce:

- **Logical change**: what the schema must express afterward, in one
  paragraph.
- **Current-state evidence**: actual table definitions (`\d+` / `SHOW
  CREATE TABLE`), row counts, table and index sizes, and write/read rates
  (QPS, peak vs. average) for every affected table. Estimates must be
  labeled as estimates.
- **Consumers inventory**: every application service, job, view,
  trigger, replication consumer (CDC/ETL), and report that reads or
  writes the affected columns. A column is never "unused" without a
  query-log or code-search citation.

## Phase 2 — Expand/Contract Plan (the phased design)

Lay out the migration as an ordered sequence of phases, each one
independently deployable and safe to pause on:

| Phase | Type | Contents | Blocked until |
|-------|------|----------|---------------|
| E1 | Expand | additive DDL only | — |
| E2 | Dual-write | app writes old+new shape | E1 verified |
| B1 | Backfill | batched copy/transform of historical rows | E2 deployed everywhere |
| V1 | Verify | old vs new shape reconciliation query = 0 diffs | B1 complete |
| S1 | Switch reads | app reads new shape (old still written) | V1 green |
| C1 | Contract prep | stop writing old shape | S1 stable in prod |
| C2 | Contract | destructive DDL (drops/renames/constraints) | C1 + retention window |

Rules for the plan:

- **Column drop discipline**: a drop appears only in C2, in its own
  migration file, deployed no sooner than one full release cycle (or the
  stated retention window) after C1. Renames are modeled as add-new +
  dual-write + drop-old — never a direct `RENAME` on a hot table unless
  proven metadata-only for the specific engine version.
- **Backfill discipline**: backfills run in bounded batches (state batch
  size and pacing), are idempotent and resumable (record the watermark),
  never inside the DDL migration, and never in a single transaction over
  the whole table.
- **Constraint discipline**: `NOT NULL`, foreign keys, and check
  constraints are added as NOT VALID / unvalidated first, then validated
  in a separate step; state the engine-specific mechanism you are using.
- **Index discipline**: index builds use the engine's non-blocking path
  (`CREATE INDEX CONCURRENTLY`, online DDL, gh-ost/pt-osc, etc.); name
  the tool and its failure mode (e.g. invalid index left behind — and the
  cleanup step for it).

## Phase 3 — Lock Impact Analysis (MANDATORY GATE)

For **every DDL and backfill statement** in every phase, fill in the Lock
Impact Table:

| Stmt | Lock mode acquired | Blocks reads? | Blocks writes? | Expected hold time @ prod size | Queued behind long txn → effect | Mitigation |
|------|--------------------|---------------|----------------|-------------------------------|----------------------------------|------------|

Then answer, in writing, for the target engine and version:

1. Which statements take a full-table or metadata lock, even briefly, and
   what happens to the connection pool while that lock waits in queue
   (lock-queue pile-up: a brief lock behind a slow query blocks *all*
   subsequent readers)?
2. What `lock_timeout` / `statement_timeout` (or engine equivalent) will
   each migration statement run with, and what is the retry policy when it
   times out? Migrations without a lock timeout on a hot table are
   prohibited.
3. Does any statement rewrite the table (type changes, defaults on old
   engine versions, charset changes)? Cite the engine documentation
   behavior for the specific version, not folklore.

### Concurrent Production Simulation (required before approval)

Design and run (or, if no environment exists, fully specify so an operator
can run) a load simulation against a production-sized copy:

- **Dataset**: restore or synthesize to production row counts and index
  sizes for affected tables — state the sizes used.
- **Load profile**: replay or synthesize the production mix — concurrent
  readers and writers at peak QPS on the affected tables, including at
  least one deliberately long-running transaction/read to expose
  lock-queue pile-ups.
- **Execute each phase under load** and record: p99 latency before/during/
  after each statement, lock waits observed, errors/timeouts returned to
  simulated clients, replication lag induced by the backfill.
- **Pass criteria** (state them up front): e.g. no statement holds a
  blocking lock > N ms, no client-visible errors, replication lag < M s.
  A phase that fails criteria goes back to Phase 2 for redesign — it is
  not "probably fine in prod."

## Phase 4 — Rollback & Historical Data Impact (MANDATORY GATE)

For each phase, document:

1. **Down path**: the exact down-migration SQL, or the declaration
   "irreversible because X" plus the operational recovery plan (restore
   source, PITR window, shadow-table replay).
2. **Historical data impact of rolling back**: if this phase is reverted
   *after* new-shape data has been written, what happens to rows created
   or mutated in the interim? Enumerate: data written only to the new
   column/table (lost? re-derivable? drained back how?), transformed rows
   (is the transform invertible — e.g. a lossy type narrowing or a
   normalization is NOT), and downstream consumers that already ingested
   the new shape (CDC, caches, warehouses — how are they reconciled?).
3. **Point of no return**: identify the exact phase after which rollback
   means data reconstruction rather than a down-migration (typically C2,
   sometimes B1 for lossy transforms). This phase must be explicitly
   labeled **POINT OF NO RETURN** in the plan, with the verified backup /
   retention prerequisite that must be true before crossing it.
4. **Rollback rehearsal**: the down path for every pre-contract phase must
   be executed at least once in the simulation environment, with the
   old-version application verified working afterward.

## Phase 5 — Execution Runbook

Produce the operator-facing runbook: per phase — preconditions to check,
the exact commands, live health metrics to watch (lock waits, error rate,
replication lag), abort criteria and the abort command, and the
verification query proving the phase succeeded. Include the reconciliation
query (V1) verbatim.

## Hard Prohibitions (repeat back before starting work)

- ❌ Adding and dropping in the same migration; dropping anything outside
  a dedicated contract-phase migration.
- ❌ Any DDL without a completed Lock Impact Table row and a lock timeout.
- ❌ Backfilling inside a schema migration or in one whole-table transaction.
- ❌ Direct in-place renames or type changes on hot tables without proving
  the operation is non-rewriting for the exact engine version.
- ❌ Shipping a migration with no down path and no irreversibility
  declaration.
- ❌ Approving a plan whose destructive phase precedes verified retirement
  of all old-shape readers and writers.
- ❌ Skipping the concurrent-load simulation, or running it on a toy-sized
  dataset and calling it representative.

## Required Output Order

1. Change Specification with current-state evidence (Phase 1)
2. Expand/Contract phase plan (Phase 2)
3. Lock Impact Table + simulation design/results (Phase 3)
4. Rollback & historical-data impact analysis with POINT OF NO RETURN (Phase 4)
5. Execution runbook (Phase 5)

Skipping or reordering these sections is a framework violation.
