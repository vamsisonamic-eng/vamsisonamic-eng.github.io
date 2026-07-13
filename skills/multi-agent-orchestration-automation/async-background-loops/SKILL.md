---
name: async-background-loops
description: >
  Master framework for managing long-running background loops and
  asynchronous task execution. Trains an execution model to launch work in
  the background, communicate with sub-agents and external processes via
  non-blocking periodic check-ins, and never freeze its own processing
  thread waiting on a single process to return. Use whenever a task
  involves builds, test suites, deploys, watchers, polling external
  systems, or coordinating multiple concurrent sub-agents.
---

# Asynchronous Execution & Background Loop Management Framework

You are an execution model operating under this framework. Your core
resource is **your own foreground turn**. Every second you spend blocked on
a synchronous wait is a second in which nothing else advances. The
discipline here is simple to state and hard to keep: **launch, detach,
check in, continue.**

## Prime Directives (non-negotiable)

1. **NEVER BLOCK ON A SINGLE PROCESS.** Any command expected to run longer
   than ~30 seconds (builds, test suites, deploys, downloads, servers,
   sub-agent tasks) must be launched in the background, not awaited inline.
2. **NO SLEEP-POLLING IN THE FOREGROUND.** `sleep 60 && check` loops burn
   your turn doing nothing. Use the harness's background/notification
   mechanism: launch detached work, end or continue your turn, and act
   when the completion signal arrives.
3. **EVERY BACKGROUND TASK GETS A LEDGER ENTRY.** The moment you launch
   something, record it (see Task Ledger). Untracked background work is
   leaked work — it will finish silently and its result will be lost.
4. **CHECK-INS ARE PERIODIC AND CHEAP.** A check-in reads status, logs a
   one-line assessment, and returns to other work. It never turns into a
   blocking wait "because it's almost done."
5. **PARALLELIZE BY DEFAULT.** While background task A runs, you work on
   B. Idle waiting is only acceptable when literally every remaining step
   depends on the pending result — and you must state that explicitly.

## The Task Ledger

Maintain a running ledger for the session — in your working notes or a
scratch file — with one row per asynchronous task:

```
| ID | What | Launched | How to check | Expected duration | Status | Result |
|----|------|----------|--------------|-------------------|--------|--------|
| T1 | full test suite | 14:02 | tail test.log / task output | ~6 min | RUNNING | — |
| T2 | security sub-agent | 14:03 | agent completion signal | ~10 min | RUNNING | — |
```

Update the ledger at every check-in and every completion. Before ending
any turn, review the ledger: every RUNNING task must have a defined wake
mechanism (completion notification, scheduled check-in, or watcher).
A RUNNING task with no wake mechanism is a bug in your orchestration.

## Launch Discipline

For each unit of long work, choose the right launch mode:

- **Background shell command** — for builds, tests, servers, watchers.
  Launch detached with output redirected to a log file so progress is
  inspectable at any time (`... > /path/task.log 2>&1`). Never rely on
  scrollback; the log file *is* the interface.
- **Background sub-agent** — for analysis or implementation work you are
  delegating. Give it a complete standalone prompt (sub-agents start
  cold) and an explicit output location. Run in background so multiple
  agents proceed concurrently.
- **Scheduled wake-up / timer** — for external state the harness cannot
  notify you about (a CI run on a remote service, a deploy pipeline, a
  queue draining). Schedule a check-in matched to how fast that state
  actually changes; do not poll a 10-minute pipeline every 20 seconds.

**Dependency rule:** independent tasks launch together in one step.
Dependent tasks are chained — either by launching the successor at the
predecessor's completion check-in, or by wrapping the chain in a single
background script so the chain itself is one detached unit.

## The Check-in Protocol

A check-in is a fixed, bounded routine. When a completion signal or
scheduled wake-up fires, or between units of foreground work:

1. **Read status, not vibes.** Tail the log / read the task output /
   read the sub-agent's report file. Get concrete state: still running,
   succeeded, failed, stalled.
2. **Classify:**
   - `SUCCEEDED` → harvest the result into the ledger, launch any
     dependent tasks now, mark DONE.
   - `FAILED` → capture the actual error text into the ledger. Decide:
     retry (with what change?), reroute, or surface to the user. A silent
     retry of the identical command is allowed exactly once, for flaky
     infrastructure only.
   - `RUNNING, healthy` → note progress evidence (log advancing, phase
     changed), return to other work.
   - `RUNNING, suspicious` → no log output past its expected duration ×
     1.5. Investigate before killing: is it CPU-bound, waiting on input,
     or deadlocked? Kill and restart only with evidence, and record why.
3. **Re-arm.** If the task is still running and has no completion
   notification, schedule the next check-in before moving on. Space
   check-ins to the task's timescale (a 6-minute test run merits perhaps
   two check-ins, not twelve).
4. **Continue foreground work.** The check-in ends here. Total budget:
   well under a minute of attention.

## Coordinating Multiple Sub-agents Asynchronously

When several sub-agents run concurrently:

- **Fan-out once:** dispatch all independent agents in a single step with
  self-contained prompts and per-agent output files.
- **Do not serialize on the slowest:** as each agent completes, process
  its result immediately — validate its output contract, harvest
  findings, dispatch any follow-up question back to *that* agent — while
  the others keep running.
- **Follow-ups are messages, not respawns:** to continue a sub-agent's
  work with its context intact, message the existing agent; spawning a
  fresh one re-pays its entire cold-start cost.
- **Join point:** synthesis or any step needing *all* results is the only
  legitimate full-join. Name it in advance ("synthesis blocks on T2, T3,
  T4") so the wait is a decision, not a drift.

## Stall, Timeout, and Abandonment Policy

- Every ledger entry gets an expected duration at launch (estimate is
  fine). A task at 1.5× expected with no progress evidence is SUSPICIOUS;
  at 3× it is presumed STALLED.
- Stalled tasks are killed only after inspecting their state, and the
  kill + reason is recorded in the ledger.
- Never end the session with RUNNING ledger entries unaccounted for:
  each must be completed, killed-with-reason, or explicitly handed to the
  user as "still running, here is how to check it."

## Failure Modes to Avoid

- Running a 10-minute test suite in the foreground and doing nothing else.
- `sleep`-loop polling that burns the whole turn watching a log file.
- Launching background work and forgetting it (no ledger entry, no wake).
- Checking a slow external pipeline every 30 seconds out of anxiety.
- Killing a healthy long task because "it felt stuck" — demand evidence.
- Holding all results until the end and discovering a failed dependency
  hours after it failed. Harvest at completion, always.
