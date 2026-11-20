# TaskFlow QA Lab

A tiny local task manager designed to test an AI-assisted GitHub Pull Request workflow.

## Requirements

- Node.js 20 or newer
- npm (included with Node.js)

There are no third-party runtime or development dependencies.

## Run locally

```bash
npm start
```

Open <http://127.0.0.1:3000>.

To stop the server, press `Ctrl+C` in the terminal where it is running.

## Run checks

```bash
npm test
npm run check
```

## API

- `GET /api/health` — health check
- `GET /api/tasks` — list tasks
- `POST /api/tasks` — create a task (`{"title":"Example"}` or `{"title":"Example","priority":"high"}`)
- `PATCH /api/tasks/:id` — update title, status, or priority
- `DELETE /api/tasks/:id` — delete a task

Allowed statuses: `todo`, `doing`, `done`.
Allowed priorities: `low`, `medium`, `high`. New tasks default to `medium`. Invalid priorities return HTTP 422.

## Suggested PR exercise

Read `docs/PR_TEST.md`. Create a feature branch, ask your developer agent to implement the task, run the checks, push the branch, and open a Pull Request. The test workflow should then activate on the PR.

## Safety

The app uses in-memory data. Restarting the server resets the sample tasks. Do not connect it to production databases or real services.
