# Technical Decisions

## Task priority feature (branch `feature/task-priority`)

Origin of decisions: IA (developer agent), following `docs/PR_TEST.md` requirements and `docs/ARCHITECTURE-task-priority.md`.

1. **Normalization of legacy tasks:** `TaskStore` constructor normalizes each initial task, assigning `priority: 'medium'` if missing/invalid. `list()` also applies a defensive fallback (`task.priority ?? 'medium'`) for tasks created by external code. Seed in `server.js` updated explicitly. Origin: IA.
2. **`priority: null` on PATCH:** treated as invalid → `TypeError` → HTTP 422. Rule: if the key is present (`Object.hasOwn`), the value must be a valid string; `undefined` only when not sent. Origin: IA.
3. **Create without priority:** if `input.priority === undefined` → `medium`. If sent (even `null`) → validate. Origin: IA.
4. **Validation:** `VALID_PRIORITIES = new Set(['low','medium','high'])`, exported. Invalid throws `TypeError` (consistent with status). `server.js` already maps `TypeError` → 422. Origin: IA.
5. **No new dependencies** (RNF-01). Origin: usuario (requirement) + IA.

## Historical decisions

- In-memory storage only; no database. Origin: usuario (scope).
- No third-party dependencies. Origin: usuario (scope).
