---
name: dataflow-tracing
description: >
  Master framework for tracing and synthesizing complex data-flows across five
  or more interconnected files before modifying shared abstract classes or
  interfaces. Use whenever a task touches a shared abstraction, a cross-module
  data pipeline, or any code whose behavior the worker has not yet mapped.
  Enforces a strict trace-diagram-then-modify discipline and prohibits blind
  refactoring.
---

# Multi-File Data-Flow Tracing & Synthesis Framework

You are a worker model operating under this framework. Your job is NOT to
"improve code you see." Your job is to **understand a running system as a
single execution thread across many files, prove that understanding in
writing, and only then change it.**

## Prime Directives (non-negotiable)

1. **NO BLIND REFACTORING.** You are strictly prohibited from refactoring,
   renaming, restructuring, "cleaning up," or deleting any code whose callers,
   callees, and runtime state transitions you have not personally traced in
   this session. If you have not read it and mapped it, you may not touch it.
2. **TRACE BEFORE TOUCH.** No edit to any shared abstract class, interface,
   base class, protocol, trait, or public contract is permitted until you have
   produced the two mandatory diagrams in Phase 3 (Execution Thread Diagram
   and Object State Diagram) and they cover every concrete implementor.
3. **MINIMUM SCOPE: 5 FILES.** A trace is invalid unless it follows the data
   through at least 5 interconnected files simultaneously — entry point,
   intermediate transformations, the shared abstraction, its implementors,
   and the terminal consumer(s). If the flow genuinely spans fewer files,
   state that explicitly and prove it by listing every importer of the
   abstraction.
4. **EVIDENCE, NOT ASSUMPTION.** Every arrow in your diagrams must cite a
   `file:line` reference. An arrow you cannot cite is an arrow you must go
   read the code to verify or delete.
5. **BEHAVIOR PRESERVATION IS THE DEFAULT.** Unless the task explicitly
   requests a behavior change, every observable input/output pair, side
   effect, and error path you diagrammed must remain identical after your
   edit.

## Phase 1 — Scope the Flow (discovery)

Before reading deeply, build the file set:

1. Identify the **entry point** of the data-flow relevant to the task (HTTP
   handler, CLI command, event consumer, scheduler tick, test harness, etc.).
2. Grep for the shared abstraction(s) involved: every `implements`/`extends`/
   subclass/registration site, every import, every dependency-injection or
   factory wiring point.
3. Produce the **File Manifest**: a table of ≥5 files with columns
   `path | role in flow (source / transform / abstraction / implementor / sink) | why it is in scope`.
4. If the manifest has fewer than 5 files, widen the search (config wiring,
   serializers, tests that pin behavior) before concluding the flow is small.

You may not proceed to Phase 2 until the manifest is written out in your
response.

## Phase 2 — Trace the Data (deep read)

Read every file in the manifest. For each hop the data takes, record:

- **Producer** → **Consumer** (`file:line` → `file:line`)
- **Shape of the data at that hop**: type, key fields, nullability, units,
  and any invariants (sorted? deduped? validated? mutated in place?)
- **Ownership & mutation**: who allocates the object, who mutates it, whether
  it is shared by reference across hops (aliasing hazards).
- **Concurrency context**: which thread/task/async context executes the hop;
  note every await point, lock, queue, or callback boundary the data crosses.
- **Error paths**: what each hop does on failure (throw, log-and-continue,
  return sentinel), and who upstream depends on that behavior.

Dynamic dispatch rule: when a call goes through the abstract class or
interface, you must enumerate **every** concrete implementation that can
receive it at runtime and trace each one — not just the one the task mentions.

## Phase 3 — Diagram the Current System (MANDATORY GATE)

You must output both diagrams **before proposing any edit**. These describe
the system **as it exists now**, not as you intend it to be.

### 3a. Execution Thread Diagram

A sequence diagram (Mermaid `sequenceDiagram` preferred, ASCII acceptable)
showing the full call chain across all manifest files, including:

- every cross-file call, in order, annotated with `file:line`
- dynamic-dispatch fan-out through the abstraction (one branch per implementor)
- async/thread boundaries marked explicitly (e.g. `-- await --`, `[worker pool]`)
- the return/error path, not just the happy path

### 3b. Object State Diagram

For each significant object flowing through the system (especially instances
of the shared abstraction and the payload it processes), a state table or
Mermaid `stateDiagram-v2` showing:

- states the object passes through (e.g. `constructed → validated → enriched → persisted`)
- which file/function performs each transition (`file:line`)
- fields set/mutated at each transition
- terminal states, including error/partial states

### Gate check (answer all, in writing)

- Does every implementor of the abstraction appear in both diagrams?
- Is every arrow cited to `file:line`?
- Are there call sites or importers you found in Phase 1 that do not appear
  in the diagrams? If yes, the diagrams are incomplete — go back to Phase 2.

**If you cannot complete the diagrams, you may not edit. Report what is
unknown and what you would need to resolve it.**

## Phase 4 — Synthesize & Plan the Change

Only now design the modification:

1. **Impact list**: for each proposed edit, list every diagram node/arrow it
   alters, and every file in the manifest that must change in lockstep.
2. **Contract delta**: if a shared abstract class or interface changes, write
   the before/after signature and enumerate how *each* implementor and *each*
   caller absorbs the change. "The others should be fine" is prohibited.
3. **Invariant audit**: restate the invariants from Phase 2 and confirm each
   one is preserved, or explicitly flag the intended behavior change.
4. **Blast-radius statement**: name the code you are deliberately NOT
   touching, so incidental "drive-by" refactors are visibly out of scope.

## Phase 5 — Execute & Verify

- Make the minimal edits from the Phase 4 plan — nothing outside it. If you
  discover mid-edit that the plan is wrong, stop, update the diagrams, and
  re-plan; do not improvise.
- After editing, re-walk the Execution Thread Diagram against the new code
  and state what changed hop-by-hop.
- Run the narrowest tests covering every implementor and every hop you
  touched; then the broader suite if available. Report actual output, not
  expectations.

## Hard Prohibitions (repeat back before starting work)

- ❌ Refactoring code you have not traced ("blind code").
- ❌ Editing an abstract class/interface before both Phase 3 diagrams exist.
- ❌ Tracing fewer than 5 interconnected files without proving the flow is smaller.
- ❌ Uncited arrows, assumed call chains, or "probably" in a diagram.
- ❌ Drive-by cleanups, renames, or formatting changes outside the Phase 4 plan.
- ❌ Skipping any concrete implementor of a dispatched call.

## Required Output Order

Every response performing this skill must contain, in order:
1. File Manifest (Phase 1)
2. Hop-by-hop trace notes (Phase 2)
3. Execution Thread Diagram + Object State Diagram + gate check (Phase 3)
4. Change plan with contract delta and blast radius (Phase 4)
5. Edits and verification results (Phase 5)

Skipping or reordering these sections is a framework violation.
