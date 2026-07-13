---
name: environment-teardown-discipline
description: >
  Rigorous local-environment cleanup discipline. Use whenever work involves
  local file operations, temp files, spawned processes, dev servers, automated
  browser tools (Playwright/Puppeteer/Selenium), sockets/ports, or long-running
  scripts. Enforces explicit teardown hooks, memory release, stray-port/process
  reaping, and crash-safe cleanup. Triggers on: "clean up", "teardown",
  "port already in use", "zombie process", "temp files", browser automation
  tasks, or any script that acquires system resources.
---

# Environment Teardown Discipline

Every resource you acquire is a debt the environment collects later — as a
locked port, a full disk, a zombie process, or a flaky next run. This skill
enforces one law and four practices around it.

**The Law of Symmetric Acquisition:** the same block of code that acquires a
resource must establish its release, *before* the resource is used. If you
cannot write the release, you are not ready to write the acquisition.

"Resource" means anything the OS or a peer holds on your behalf: open files
and directories, temp files, child processes, dev servers, browser instances
and their contexts/pages, sockets and listening ports, DB connections and
transactions, locks and lockfiles, timers/intervals, event listeners, watch
handles, environment mutations (cwd changes, exported vars, modified config).

## Practice 1 — Explicit teardown hooks, always

Never rely on process exit, garbage collection, or "the script is short" to
clean up. Structure every acquisition in one of these shapes, in order of
preference:

1. **Scoped constructs** that guarantee release: `with` /
   context managers (Python), `try`/`finally`, `defer` (Go), RAII (Rust/C++),
   `using` (C#), `finally`-wrapped `await` blocks (JS/TS).
2. **Registered teardown stacks** when scope doesn't fit: push a cleanup
   closure onto a LIFO stack at acquisition time
   (`ExitStack`/`addCleanup` in Python, an array of `async () => {...}`
   disposers in JS), and drain it in reverse order in a single `finally`.
3. **Framework hooks** in tests and automation: `afterEach`/`afterAll`,
   pytest fixtures with `yield`-then-cleanup, Playwright fixtures. Cleanup in
   `afterEach` (not `afterAll`) for anything a single test acquires, so one
   failing test can't leak into the next.

Teardown ordering is LIFO — release in the reverse order of acquisition
(page → context → browser; cursor → connection → server). Every teardown step
must be individually error-guarded so one failed release doesn't abandon the
rest:

```
for dispose in reversed(cleanup_stack):
    try: dispose()
    except Exception as e: log("teardown step failed", e)  # continue anyway
```

**Browser automation specifics:** `browser.close()` is mandatory in a
`finally`, but not sufficient — also close contexts/pages you opened, stop
tracing/video if started, and remember that a crashed driver leaves orphaned
`chromium`/`chromedriver` processes: verify with `pgrep -f chromium` after
runs and reap leftovers. Launch browsers with a stored reference to the
process/PID so cleanup can `kill` it even when the API handle is wedged.

## Practice 2 — Temp files and disk hygiene

- Create temp artifacts **only** in the designated scratchpad/temp directory
  for the session, never scattered in the project tree or bare `/tmp`, and
  never with hardcoded names (collision + symlink risk) — use
  `mkdtemp`/`mkstemp` equivalents.
- Prefer one **session root** temp directory per task; put everything under
  it, so cleanup is a single recursive delete of a path you created — never
  a pattern-based delete (`rm -rf /tmp/*something*` is forbidden; you may
  only recursively delete directories your own code created this run).
- Delete on both success *and* failure paths. If an artifact must survive for
  debugging, keep it deliberately: say so, print its path, and put it in the
  scratchpad — that is retention by decision, not by leak.
- After large operations, verify: check the temp root is gone/empty and no
  unexpected files landed in the working tree (`git status` should show only
  intended changes).

## Practice 3 — Memory, handles, and in-process state

- **Release references** to large buffers, parsed documents, and result sets
  as soon as the derived answer is extracted — null them out / let them leave
  scope; don't carry a 500 MB parse tree through the rest of the run to use
  one field of it. Process large inputs as streams/chunks instead of full
  materialization where possible.
- **Unregister what you registered:** every `addEventListener`/`on()` needs a
  matching `removeListener` in teardown; every `setInterval`/`setTimeout`
  that could outlive the task needs `clear*`; watchers (`fs.watch`, chokidar,
  inotify) must be closed or the process never exits cleanly.
- **Caches and globals:** any module-level cache, singleton, or monkeypatch
  you mutate must be restored/cleared in teardown so reruns start clean.
- **Restore ambient state:** cwd, environment variables, signal handlers,
  global config you changed — snapshot before, restore in `finally`.

## Practice 4 — Ports, processes, and crash-safe teardown

**Stray ports.** Before binding a dev server, check the port; after teardown,
verify release:

```bash
lsof -iTCP:3000 -sTCP:LISTEN -Pn   # who holds it (Linux/macOS)
```

If a *previous run of your own tooling* holds it, kill that specific PID —
identify it by command line, never blind-kill everything on a port number
you don't own. Prefer ephemeral ports (bind port 0, read the assigned port)
in tests so parallel runs can't collide.

**Child processes.** Track every PID you spawn. Kill process *groups*, not
just the direct child, or shells will orphan grandchildren: start children in
their own group/session (`start_new_session=True`, `detached`+`unref`
patterns) and signal the group (`kill(-pgid, SIGTERM)`). Escalate politely:
SIGTERM → wait with a deadline (2–5 s) → SIGKILL. Always `wait()`/reap after
killing to avoid zombies, and assert the process is gone before reporting
cleanup done.

**Abrupt fatal crashes.** Teardown must run even when the run dies mid-flight:

1. Install **signal handlers** for SIGINT/SIGTERM that drain the cleanup
   stack, then re-raise/exit with the conventional code. Handlers must be
   idempotent — cleanup may be invoked twice (signal + finally); guard with a
   `already_cleaned` flag.
2. Hook **fatal-error paths**: `process.on('uncaughtException'/'unhandledRejection')`
   in Node, `atexit` + top-level `try/finally` in Python — run the same
   drain, log the original error first, then exit non-zero. Never let cleanup
   swallow or replace the original failure: report the crash *and* the
   cleanup outcome.
3. Accept that **SIGKILL/power loss can't be hooked** — design for it with
   *startup reconciliation*: on start, detect and remove your own leftovers
   (stale lockfiles with dead PIDs, session temp dirs from previous runs,
   your orphaned child processes identified by a marker in their command
   line/env). Crash-safety = teardown hooks for the deaths you can see, plus
   startup sweep for the ones you can't.

## Exit checklist (mandatory before declaring any task done)

Run and report this verification — do not assume, observe:

- [ ] All spawned processes exited or reaped (`pgrep` for your markers finds nothing)
- [ ] No listening ports left from this run (`lsof`/`ss` on the ports you used)
- [ ] Session temp directory removed, or surviving artifacts listed deliberately
- [ ] Working tree clean of unintended files (`git status`)
- [ ] Browsers/drivers fully closed, no orphaned renderer processes
- [ ] Ambient state restored (cwd, env vars, global config, monkeypatches)
- [ ] Teardown paths themselves tested: force one failure mid-run and confirm cleanup still executed

A task that "worked" but leaked is not done. Report cleanup status alongside
the result, and if anything could not be released, say exactly what, where,
and how the user can remove it.
