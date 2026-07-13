---
name: defensive-coding-master
description: >
  Master defensive-coding standard for all generated code. Enforces rigid type
  guards, explicit runtime schema validation at trust boundaries, strict
  null/undefined safety, and comprehensive input boundary sanitization. Use
  whenever writing or modifying production code — handlers, parsers, services,
  CLI tools, data pipelines. Triggers on: "defensive coding", "validate input",
  "type safety", "harden this code", or any code generation task where
  reliability matters.
---

# Defensive Coding Master Skill

All code produced under this skill follows one principle: **no data is
trusted until proven, and every proof is enforced at runtime.** Compile-time
types are documentation; runtime validation is defense. Generated code that
merely *annotates* types without *enforcing* them at boundaries does not meet
this standard.

The four pillars below are mandatory, not advisory. Apply them to every
function that receives data you did not construct in the same scope.

## Pillar 1 — Rigid type guards

Never assume a value's shape; prove it, and make the proof reusable and
narrow-typed.

- **Write named guard functions**, not inline `typeof` scatter. In TypeScript,
  guards must use type predicates (`function isOrder(v: unknown): v is Order`)
  so the compiler narrows with you; in Python, use `TypeGuard`/`TypeIs`-annotated
  functions and `isinstance` against concrete types, never duck-typed attribute
  poking.
- **Guard the whole shape, not one field.** Checking `obj.id !== undefined`
  proves nothing about `obj.items`. A guard verifies every field the consuming
  code touches: presence, type, and — for containers — element types
  (`Array.isArray(v) && v.every(isLineItem)`).
- **Ban unsound escapes.** `as any`, bare `as T` casts on external data,
  `// @ts-ignore`, `Object` / `any` parameters, and Python's untyped `**kwargs`
  pass-throughs are prohibited on boundary paths. The only sanctioned way to
  turn `unknown` into `T` is through a guard or schema parse.
- **Exhaustiveness is enforced, not hoped for.** Every `switch`/`match` over a
  union or enum ends with an `assertNever(x)` default (TS) or raises on
  unmatched case (Python `match` with a final `case _: raise`), so adding a
  variant breaks the build/tests instead of silently falling through.
- **Distinguish absence from invalidity from emptiness.** `undefined`,
  `null`, `""`, `0`, `[]`, and `NaN` are six different facts. Guards must not
  collapse them with truthiness checks (`if (value)` rejects legitimate `0`
  and `""`); test the exact condition that matters.

## Pillar 2 — Explicit runtime schema validation

Every trust boundary gets a schema, and nothing crosses without parsing
through it. Trust boundaries include: HTTP request/response bodies, query
params and headers, CLI arguments, environment variables and config files,
message-queue payloads, webhook bodies, database rows feeding
security-relevant logic, LLM/tool outputs, and any third-party API response.

- **Parse, don't validate-and-forget.** Use schema libraries that *return a
  typed value* on success — Zod / Valibot (TS), Pydantic / msgspec (Python),
  JSON Schema validators elsewhere — so downstream code receives the parsed
  type, not the raw input with a "checked" comment on it. Raw input dies at
  the boundary; only the parsed object travels inward.
- **Schemas are strict by default.** Unknown fields are rejected or explicitly
  stripped (`.strict()` / `extra="forbid"`), never silently absorbed into the
  object. Every field declares its type *and* its constraints: string
  min/max length, numeric ranges, enum membership, format (UUID, email, ISO
  8601), array length bounds. `z.string()` with no bounds on user input is a
  finding, not a schema.
- **Coerce deliberately or not at all.** Implicit coercion ("looks like a
  number") is forbidden; where coercion is needed (query strings, env vars),
  it is declared in the schema so it is visible and tested.
- **Fail closed, loudly, and usefully.** Validation failure produces a typed
  error naming the field and the violated rule, rejects the entire request
  (no partial processing of half-valid payloads), performs no state mutation,
  and never echoes secrets or entire raw payloads into logs or client-facing
  errors.
- **Validate environment/config at startup**, not at first use — a process
  with a malformed config must refuse to boot, not fail three hours later on
  the rare code path.

## Pillar 3 — Strict null/undefined safety

Null-shaped bugs are eliminated structurally, not patched reactively.

- **Turn the compiler all the way up:** `strict: true` +
  `noUncheckedIndexedAccess` (TypeScript), `Optional[T]` with mypy/pyright in
  strict mode (Python), no platform-default nullable escape hatches. Code
  generated under this skill must type-check under strict settings.
- **Non-null assertions (`!`) are banned** on data that crossed a boundary.
  If a value truly cannot be null at a given point, either the types already
  prove it or you insert a *checked* assertion that throws with a message
  (`assertDefined(user, "user must exist after auth middleware")`) — a crash
  with context beats a silent `undefined` propagating four layers.
- **Handle absence at the edge, once.** Resolve optionality as close to the
  source as possible — default it, reject it, or branch on it — so the core
  logic operates on non-optional types. Functions should demand `T`, not
  accept `T | null` and re-check in every callee.
- **Optional chaining is for reading, not for hiding.** `a?.b?.c ?? fallback`
  is acceptable when absence is a *legitimate expected state* with a correct
  fallback; it is forbidden as a way to suppress "possibly undefined" errors
  on values that indicate a bug when absent. Ask each time: if this is null,
  is that normal data or a broken invariant? Normal → default explicitly;
  broken → assert and fail loudly.
- **Model absence in return types honestly.** Functions that can fail to find
  return `T | null` / `Optional[T]` / `Result`-shaped values — never a magic
  sentinel (`-1`, `""`, `{}`) — and every caller is forced by the type system
  to handle the miss.
- **Beware null-adjacent traps:** `NaN` from failed numeric parses,
  `undefined` from out-of-bounds indexing and `Map.get`, empty-string env
  vars that are "set" but meaningless. Guards from Pillar 1 must treat these
  explicitly.

## Pillar 4 — Input boundary sanitization

Validation asks "is this well-formed?"; sanitization asks "is this safe in
the context where it will be *used*?" Both are required, and sanitization is
always context-specific — there is no universal `sanitize()`.

- **Neutralize by construction, not by cleaning:** parameterized queries /
  prepared statements for SQL (string-built queries are prohibited);
  argument-array process execution (`execFile`, `subprocess.run([...])`) —
  never shell string interpolation; contextual output encoding for HTML/JS/URL
  contexts (framework auto-escaping stays on; `innerHTML`-style sinks require
  an explicit sanitizer like DOMPurify and a written justification).
- **Path traversal defense:** resolve user-influenced paths to absolute form
  and verify the result is still inside the intended root
  (`resolved.startsWith(root + sep)` after real path resolution); reject
  `..`, null bytes, and absolute inputs where relative names are expected.
- **Bound everything before parsing:** maximum body size, string length,
  array length, JSON nesting depth, decompressed size, and per-request
  timeouts are set *before* the expensive operation — a validator that first
  parses a 2 GB payload to measure it has already lost. Regexes applied to
  user input must be linear-time-safe (no nested quantifiers over overlapping
  classes) or replaced with parsers.
- **Canonicalize before checking:** decode (URL/Unicode-normalize/case-fold)
  *once*, then validate the canonical form, then use exactly what was
  validated. Checking the encoded form and using the decoded form is the
  classic bypass. Reject double-encoded input rather than looping decodes.
- **Allowlist over blocklist, always:** define what valid input *is*
  (charset, format, enum, range) and reject everything else; never enumerate
  known-bad substrings and hope. Filenames, sort columns, redirect URLs, and
  content types are matched against fixed allowlists.
- **Sanitize on output too:** data leaving the system (logs, error messages,
  HTML, CSV exports, headers) is encoded for its destination — CR/LF stripped
  from header values, formula-injection prefixes (`=`, `+`, `-`, `@`) escaped
  in CSV cells, control characters stripped from log lines to prevent log
  forging.

## Enforcement protocol

When generating or reviewing code under this skill:

1. **Identify every trust boundary** in the task first and list them. Each
   gets a schema (Pillar 2) and guards (Pillar 1) before business logic is
   written.
2. **Write the failure paths with the same care as the happy path** — every
   validation error has a defined type, message, and non-mutating exit.
3. **Self-audit before completion** against this checklist:
   - [ ] No `any`/bare-cast/`!`/`@ts-ignore` (or language equivalents) on boundary data
   - [ ] Every external input parses through a strict, bounded schema
   - [ ] Strict null checking passes; absence handled once, at the edge
   - [ ] No string-built SQL/shell/HTML; paths root-checked; sizes bounded pre-parse
   - [ ] Exhaustive matches with enforced never-cases
   - [ ] Failure paths tested with malformed, missing, oversized, and null inputs
4. **Any deviation is declared, not hidden:** if a pillar is knowingly
   relaxed (prototype code, trusted internal path), state it in code review
   notes with the reason — silent exemption is a violation.

Code that fails the checklist is unfinished. Fix it before presenting it.
