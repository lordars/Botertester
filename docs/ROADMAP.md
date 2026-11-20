# Roadmap

## Current (feature/task-priority)

- [x] Add `priority` field (`low` | `medium` | `high`) to tasks.
- [x] Default new tasks to `medium`.
- [x] Validate priority on create and PATCH (invalid → 422).
- [x] UI selector on create form, badge in list, AND filter by priority.
- [x] Automated tests (14/14 passing).
- [x] QA local PASS.

## Known limitations / open items

- No automated test for PATCH with invalid priority or AND filter `status`+`priority` in UI (out of current test scope).
- No visual verification of badge/filter in browser (out of automated scope).
- In-memory data resets on restart.
