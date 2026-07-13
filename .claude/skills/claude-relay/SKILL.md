---
name: claude-relay
description: >
  Route one task through model-specific Claude subagents (Haiku, Sonnet, Opus,
  Fable) with explicit tiers and checkable handoffs. Use when the user invokes
  /claude-relay, or explicitly asks to split a task across model tiers /
  subagents with a coordinator. Invocation authorizes the subagent spawns the
  route requires.
disable-model-invocation: true
---

# Claude Relay

Turn the user's task into a **relay** of Claude subagents: a coordinator plans,
then spawns children on the model tier that can complete each phase reliably.
Each child receives a concrete brief and returns evidence to the coordinator.
Model names describe capability tiers, not fixed job titles.

Invocation of this skill explicitly authorizes the subagent spawns required by
the route, including their model settings. The coordinator (the session running
this skill) owns the whole outcome, keeps the canonical task state, verifies
every handoff, and reports the route actually used.

## Preflight

1. Restate the requested outcome, acceptance criteria, constraints, allowed
   mutations, and deployment authority. Infer ordinary implementation details,
   but do **not** infer permission for destructive or external actions.
2. Confirm the `Agent` tool is available with model override support, and that
   `SendMessage` exists for continuing a child with its context intact. If
   subagents are unavailable in this harness, show the proposed route and stop;
   do not simulate the relay with hidden inline work while claiming delegation.
3. Record the starting state. In a git repository, capture branch, revision,
   and dirty files so the relay can distinguish its work from pre-existing
   changes.
4. Classify the work by **uncertainty, not apparent size**:
   - **Clear**: solution and finish line already known.
   - **Judgment-heavy**: tractable implementation, but tradeoffs or failure
     modes need thought.
   - **Open-ended**: the problem, architecture, or safe path must be
     discovered.

Preflight is complete when the finish line is checkable and every proposed
external side effect is authorized.

## The roster

| Tier | Model (`model` param) | Reach for it when | Escalate when |
| --- | --- | --- | --- |
| **Scout** | `haiku` | Fast reconnaissance, deterministic edits, formatting, focused checks, release mechanics, monitoring | The operation has branching failure modes — hand the phase to Builder |
| **Builder** | `sonnet` | Everyday implementation, tests, refactors, code review, bounded debugging, turning a settled plan into working artifacts | The change crosses ownership boundaries, has subtle invariants, or failed once for a non-obvious reason — escalate to Architect |
| **Architect** | `opus` | Ambiguous planning, architecture, hard diagnosis, high-risk review, resolving disagreement between children | The decision is costly to reverse, evidence conflicts, or a failed route must be rebuilt — escalate to Apex |
| **Apex** | `fable` | Hardest reasoning: conflicting evidence, costly-to-reverse decisions, rebuilding a failed route | Top tier — if Apex cannot settle it, return to the user with the evidence |

Notes on fidelity to the harness:

- Claude Code's `Agent` tool exposes a **model override**, not a per-call
  effort dial. Reasoning effort comes from the agent definition
  (`.claude/agents/*.md` frontmatter). Where the original relay pattern says
  "raise effort," in Claude the equivalent moves are: (a) escalate one model
  tier, or (b) use a project agent definition with higher configured effort.
  Never silently *lower* a tier.
- `fable` may not be enabled on every account. See **Availability and
  substitution** below.
- Use read-only agent types (`Explore`, `Plan`) for reconnaissance and
  planning phases when they fit — they cannot write, which is itself a scope
  guarantee.

## Build the route

The coordinator writes a short route table before delegating:

```markdown
| Phase | Owner | Agent type | Model | Deliverable | Gate |
| --- | --- | --- | --- | --- | --- |
| ... | coordinator / new child | claude / Explore / Plan / general-purpose | haiku / sonnet / opus / fable | ... | ... |
```

Prefer these starting routes, then adapt:

- **Mechanical task:** one Scout (`haiku`) child executes and runs a focused
  check.
- **Normal feature or fix:** coordinator settles the route; a Builder
  (`sonnet`) child implements and tests; a Scout child runs mechanical
  closeout; a Scout child releases **only when authorized**.
- **Ambiguous or cross-system work:** an Architect (`opus`, agent type `Plan`)
  child produces the plan and risks; a Builder child implements and tests; the
  coordinator reviews risky decisions; a Scout child releases when authorized.
- **Production incident:** a Scout child gathers current evidence; an
  Architect child diagnoses; a Builder child fixes and adds a regression test;
  a Scout child releases and monitors.
- **Research or product design:** an Architect (or Apex) child resolves the
  hard questions; a Builder child prototypes or produces the artifact; a Scout
  child packages and publishes authorized output.

Do not force all tiers into every task. A phase earns a child only when its
deliverable reduces uncertainty or performs necessary work. Do not use
Architect/Apex for mechanical execution merely because they are stronger. Do
not leave Scout to make an ambiguous production decision merely because
deployment was assigned to Scout.

If the route includes deployment, read [`DEPLOYMENT.md`](DEPLOYMENT.md)
completely before assigning that phase. The route is complete when every phase
has one owning child, one artifact, and one checkable gate, and no child starts
before its required inputs exist.

## Spawn children

Use the `Agent` tool, not ad-hoc shell subprocesses pretending to be agents:

1. Spawn with an explicit `subagent_type`, `model`, and a self-contained
   `prompt` (the brief format below). Use `run_in_background: false` when the
   next phase depends on this result; background otherwise.
2. Record the returned agent ID/name. Creation is not completion — wait for
   the child's final message before opening a dependent phase.
3. Send corrections to the **same** child via `SendMessage` so it retains its
   role and context. Do not re-spawn to "fix" a live child.
4. Spawn a **new** child when responsibility moves to another tier. Do not
   repurpose a Builder implementation child into Scout deployment work.
5. Use `isolation: "worktree"` when the user requests isolation or when
   independent phases can safely run in parallel. A worktree route must
   include an integration gate before release. Do not include the current
   checkout's uncommitted changes in a child's assumptions unless the user
   explicitly asked for a working-tree starting state.
6. For sequential phases in the shared checkout, permit only **one writing
   child at a time**.

Children's final messages return only to the coordinator — relay what matters
to the user; the child's output is not shown directly.

## Run the relay

Send each child a self-contained brief:

```markdown
Role: <phase role, not merely the model name>
Outcome: <one concrete result>
Inputs: <paths, commits, URLs, evidence, and prior artifacts>
Constraints: <scope, invariants, authority, and forbidden actions>
Acceptance: <checks that prove this phase is done>
Return: <artifact or concise handoff, including unresolved risks>
```

Give children only the context needed for their phase — point at canonical
files and evidence rather than pasting long conversation history. Require
evidence for completion: a written plan with decisions, a patch plus test
output, a review with line-level findings, or a deployment receipt plus health
result.

After each handoff, the coordinator must:

1. Check the deliverable against its gate.
2. Update the canonical route table with the child's ID, actual model,
   artifact, and status.
3. Retry at the same tier only when the failure was transient or the brief
   lacked concrete evidence.
4. Escalate when the failure reveals a capability gap or new uncertainty:
   Scout → Builder → Architect → Apex.
5. Re-plan (Architect or Apex) when new evidence invalidates the route, rather
   than piling patches onto a broken plan.

Do not pass a summary forward as if it were the artifact. The next child must
receive the actual plan, diff, test output, commit, or production evidence
(by path or reference).

## Implementation and review gates

- A plan passes only when it identifies affected surfaces, decisions, risks,
  acceptance checks, and a safe integration path.
- Implementation passes only when the requested behavior exists, focused tests
  pass, and unrelated user changes remain untouched.
- Review passes only when every actionable finding is either fixed and
  rechecked or explicitly rejected with evidence.
- Parallelize independent implementation slices only when they have disjoint
  ownership or a declared integration seam (worktree isolation per slice). The
  coordinator integrates and tests the combined result before release.

## Availability and substitution

- If `haiku` is unavailable, `sonnet` may substitute. If `sonnet` is
  unavailable, `opus` may substitute. **Do not substitute downward.**
- `fable` requires account access; if unavailable for a phase that genuinely
  needs it, `opus` is the working ceiling — say so in the report rather than
  disguising a weaker plan as equivalent.
- If cost, latency, quota, or permission settings prevent an upward
  substitution, stop at the affected gate and return the completed artifacts.

## Final report

Lead with the finished outcome. Then report:

- the route **actually used**, including child ID/agent type/model per phase;
- artifacts produced and checks passed;
- substitutions, escalations, or skipped phases and why;
- deployment revision and health evidence, when deployment was authorized;
- any remaining blocker or risk.

Never report the planned route as the route actually run.
