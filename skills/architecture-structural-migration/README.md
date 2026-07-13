# Architecture & Structural Migration Skills

Master SKILL.md blueprints that constrain worker/execution models when
changing system structure. Each skill is a gated, phase-ordered prompt
framework with mandatory verification hooks.

| Skill | Purpose |
|-------|---------|
| [`dataflow-tracing`](dataflow-tracing/SKILL.md) | Trace and diagram data-flows across 5+ interconnected files (execution thread + object state diagrams) before altering shared abstract classes or interfaces. Prohibits blind refactoring. |
| [`no-gold-plating`](no-gold-plating/SKILL.md) | Bind patches strictly to the requested bug/requirement via a Scope Contract and six diff-verification hooks. Blocks unrequested abstractions, premature optimization, and styling churn. |
| [`db-migration-safety`](db-migration-safety/SKILL.md) | Design defensive zero-downtime schema evolutions: expand/migrate/contract phasing, lock-impact analysis under concurrent production simulation, and rollback / historical-data impact gates. |

Common contract across all three: evidence over assumption, mandatory
written gates before mutation, a fixed required output order, and hard
prohibitions the worker must repeat back before starting.
