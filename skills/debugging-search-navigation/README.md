# Debugging, Search, & Navigation

Operating manuals (`SKILL.md` blueprints) that direct a worker/executor
model through high-risk investigation and modification work. Each skill
enforces an evidence-first discipline: no fixes before proven causes, no
execution on unstated assumptions, no writes outside verified boundaries.

| Skill | Purpose |
| --- | --- |
| [`git-regression-forensics`](git-regression-forensics/SKILL.md) | Troubleshoot regressions by auditing git history — blame tracing, reconstructing the architectural intent of historical code, and mapping how a past mutation produced the present bug. |
| [`ambiguous-spec-navigation`](ambiguous-spec-navigation/SKILL.md) | Navigate conflicting or poorly defined specs — map hidden gaps, surface load-bearing assumptions, and present structured choices to the user instead of guessing. |
| [`cascade-failure-triage`](cascade-failure-triage/SKILL.md) | Isolate root causes in cascading microservice failures and verbose crash logs — filter noise, trace stack traces upstream, and prove the hypothesis with a targeted isolated repro script. |
| [`workspace-safety-boundaries`](workspace-safety-boundaries/SKILL.md) | Environment safety and sandbox isolation — assess permissions, resolve and map every touched path, verify containment, and flag out-of-bounds execution risks before modifying anything. |
