# Pull Request exercise: Task priority

## Objective

Add a priority field to tasks and make it available through the API and UI.

## Requirements

1. Each task must have a `priority` field with one of these values: `low`, `medium`, or `high`.
2. New tasks must default to `medium` when the client does not provide a priority.
3. The API must accept and validate priority when creating a task.
4. The API must accept and validate priority when updating a task with `PATCH`.
5. Invalid priorities must return HTTP 422 with a useful error message.
6. The UI form must let the user choose a priority when creating a task.
7. The task list must visibly show each task's priority.
8. The UI must allow filtering tasks by priority without breaking the existing status filter.
9. Existing task behavior must continue working.
10. Add automated tests for default priority, valid values, invalid values, update behavior, and filtering where practical.

## Acceptance criteria

- `npm test` passes.
- `npm run check` passes.
- `npm start` launches the application on `http://127.0.0.1:3000`.
- A task created without a priority has `medium` priority.
- A task can be created with `low`, `medium`, or `high` priority.
- Invalid priority values are rejected by the API.
- The interface shows priority and can filter by it.
- The existing status filter and task operations still work.

## Out of scope

- User accounts or authentication.
- Persistent database storage.
- External APIs or cloud services.
- Deployment to production.

## Instructions for the developer agent

Implement this feature in a focused change. Inspect the existing code first. Do not rewrite the application or introduce dependencies without a clear reason. Add tests, run them, and report exact commands and results. Do not commit or push unless explicitly asked.

## Instructions for the QA agent

Test the exact commit in the Pull Request, using a local checkout or isolated Git worktree. Run the automated checks and start the app locally when functional verification is needed. Do not alter the developer's working tree. Report PASS, FAIL, or BLOCKED with evidence.
