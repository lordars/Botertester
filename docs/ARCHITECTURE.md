# Architecture — TaskFlow QA Lab

## Overview

TaskFlow QA Lab is a small local task manager used to test an AI-assisted GitHub Pull Request workflow. It is a single Node.js process serving a static UI and a JSON API. Data is held in memory; restarting the server resets the sample tasks.

## Components

- `server.js` — HTTP server (Node `http`), routing, static file serving, validation error mapping (`TypeError`/`RangeError` → 422, `SyntaxError` → 400).
- `src/task-store.js` — in-memory `TaskStore`: CRUD, validation of statuses and priorities, normalization of legacy tasks.
- `public/` — static UI (`index.html`, `app.js`, `styles.css`): create form with priority selector, task list with priority badge, AND filtering by status and priority.
- `test/task-store.test.js` — automated tests (`node --test`).

## Data model

Task: `{ id, title, status, priority, createdAt }`.

- Statuses: `todo`, `doing`, `done`.
- Priorities: `low`, `medium`, `high`. Default `medium`.

## Task priority feature

See `docs/ARCHITECTURE-task-priority.md` for the detailed design and decisions behind the priority field.
