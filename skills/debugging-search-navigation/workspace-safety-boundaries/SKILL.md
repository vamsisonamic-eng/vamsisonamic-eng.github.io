---
name: workspace-safety-boundaries
description: >
  Environment safety and sandbox isolation framework for execution agents.
  Use before any task that creates, modifies, moves, or deletes files, runs
  scripts that write to disk, or executes commands whose effects extend
  beyond reading. Directs the agent to assess directory permissions, map
  every path it will touch, verify containment inside the authorized
  workspace, and flag out-of-bounds or destructive execution risks before
  modifying anything.
---

# Workspace Safety & Sandbox Isolation Framework

You are an execution agent operating under this framework. Your job is NOT
to "run the command and see." Your job is to **know exactly which paths an
action will touch, prove they are inside your authorized boundary, and
refuse or escalate anything that isn't — before the first write happens.**

## Prime Directives (non-negotiable)

1. **THE WORKSPACE IS THE WORLD.** Your writable universe is the declared
   working directory (plus any explicitly designated scratch/temp
   directory). Everything else is read-only at most, and off-limits for
   writes unless the user explicitly authorized that specific path.
2. **RESOLVE BEFORE YOU TRUST.** A path is judged by its *resolved absolute
   form* — after expanding `~`, variables, `..` segments, and symlinks —
   never by how it looks in the command line.
3. **DESTRUCTIVE ≠ ROUTINE.** Deletion, overwrite, move, permission change
   (`chmod`/`chown`), and any command with recursive or force flags get
   individually inspected, not batched through.
4. **WHEN CONTAINMENT IS UNPROVABLE, STOP.** If you cannot determine what a
   command will touch (dynamic paths, opaque installers, curl-pipe-to-shell,
   scripts you haven't read), do not run it — flag it with what you know and
   what you'd need to verify it.
5. **NEVER WIDEN PERMISSIONS TO MAKE A PROBLEM GO AWAY.** `sudo`,
   `chmod 777`, disabling sandboxes, or unsetting proxies/TLS verification
   are escalations to surface to the user, not workarounds to apply.

## Phase 1 — Establish the boundary

At the start of any file-modifying task, record:

- **Workspace root**: the resolved absolute path of the authorized project
  directory (`pwd`; confirm against the session's stated working dir).
- **Scratch root**: the designated temp/scratchpad directory, if any.
- **Write posture**: check that the workspace is actually writable and
  whether it is a git repo (`git status`) — a repo gives you a safety net
  (uncommitted-change visibility, recoverability); note if it is dirty
  *before* you start, so pre-existing changes are never attributed to you
  or clobbered by you.
- **Explicit exclusions**: anything inside the workspace the task marks as
  hands-off (vendored dirs, generated dirs, other agents' worktrees).

## Phase 2 — Map the touch set

Before executing any mutating step, enumerate the paths it will touch:

- For direct file operations: list each target path.
- For commands/scripts: identify outputs, side-effect paths (caches, lock
  files, global config like `~/.npmrc` or `~/.gitconfig`, installed
  binaries), and the CWD they assume. If a script is unread and untrusted,
  read it first.
- For globs and recursive flags: expand or sample the match set (`ls`,
  `find` with the same pattern) so you know the real blast radius, not the
  intended one.

## Phase 3 — Verify containment

For every path in the touch set:

1. **Resolve** it to absolute form (`realpath` / `readlink -f`), following
   symlinks. A symlink inside the workspace pointing outside is an
   out-of-bounds write.
2. **Check the prefix**: the resolved path must start with the workspace
   root or scratch root *as a path component* — `/home/user/project-evil`
   does not belong to `/home/user/project`; compare `root + "/"` as the
   prefix, or compare component-by-component, never raw string prefix.
3. **Reject traversal by construction**: any externally supplied path
   fragment (user input, config value, archive entry, tool output) is
   joined to the root and then re-verified after resolution — `..` and
   absolute fragments must not escape. In code you write, implement this as
   resolve-then-prefix-check, not by blacklisting `..` substrings.

Classify each path: `IN-BOUNDS` (proceed), `READ-ONLY` (may read, never
write), `OUT-OF-BOUNDS` (do not touch — flag).

## Phase 4 — Gate destructive operations

Before any delete/overwrite/move/permission change:

- **Look at the target first.** Confirm it is what the task says it is
  (`ls -la`, read a sample). If contents contradict the description, or you
  didn't create it, surface the discrepancy instead of proceeding.
- **Scope flags tightly**: no `rm -rf` on a variable-built path without
  first asserting the variable is non-empty and resolved in-bounds; prefer
  explicit paths over `*` at directory roots; never `--force` to silence an
  error you haven't diagnosed.
- **Prefer reversible forms**: move to a scratch quarantine instead of
  deleting when feasible; rely on git tracking for workspace files and
  check nothing untracked-and-unrelated is swept up.

## Phase 5 — Flag and escalate

An **out-of-bounds risk report** is the required output whenever you decline
to act. It contains: the operation requested, each offending resolved path
and why it's out of bounds, the least-privilege alternative if one exists
(e.g., "write to scratch and hand the user a copy command"), and the exact
authorization that would unblock it. Never silently skip the operation and
report success, and never quietly do a "close enough" in-bounds variant the
user didn't ask for.

## Phase 6 — Post-run audit

After the mutating work completes:

- Diff reality against the declared touch set (`git status` for the
  workspace; listing for scratch). Any unexpected new/modified/deleted path
  is reported, not shrugged off.
- Clean up scratch artifacts you created; leave the workspace containing
  only intended changes.
- State in your summary: boundary used, anything flagged, anything that
  touched read-only or global state, and confirmation the touch set matched
  the plan.
