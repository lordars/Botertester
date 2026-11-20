'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { TaskStore } = require('../src/task-store');

test('creates a task with the default todo status', () => {
  const store = new TaskStore();
  const task = store.create({ title: 'Write tests' });
  assert.equal(task.id, 1);
  assert.equal(task.title, 'Write tests');
  assert.equal(task.status, 'todo');
  assert.ok(task.createdAt);
});

test('trims task titles', () => {
  const store = new TaskStore();
  assert.equal(store.create({ title: '  Review PR  ' }).title, 'Review PR');
});

test('rejects an empty title', () => {
  const store = new TaskStore();
  assert.throws(() => store.create({ title: '   ' }), /Title is required/);
});

test('rejects a title longer than 120 characters', () => {
  const store = new TaskStore();
  assert.throws(() => store.create({ title: 'x'.repeat(121) }), /120 characters/);
});

test('rejects an unsupported status', () => {
  const store = new TaskStore();
  assert.throws(() => store.create({ title: 'Task', status: 'blocked' }), /Status must be/);
});

test('updates status and removes a task', () => {
  const store = new TaskStore();
  const task = store.create({ title: 'Run QA' });
  assert.equal(store.update(task.id, { status: 'doing' }).status, 'doing');
  assert.equal(store.remove(task.id), true);
  assert.equal(store.remove(task.id), false);
});

test('returns null when updating an unknown task', () => {
  const store = new TaskStore();
  assert.equal(store.update(999, { status: 'done' }), null);
});

test('creates a task with default medium priority', () => {
  const store = new TaskStore();
  const task = store.create({ title: 'Write tests' });
  assert.equal(task.priority, 'medium');
});

test('creates tasks with valid priorities', () => {
  const store = new TaskStore();
  assert.equal(store.create({ title: 'A', priority: 'low' }).priority, 'low');
  assert.equal(store.create({ title: 'B', priority: 'high' }).priority, 'high');
});

test('rejects invalid priority on create', () => {
  const store = new TaskStore();
  assert.throws(() => store.create({ title: 'Task', priority: 'urgent' }), /Priority must be/);
  assert.throws(() => store.create({ title: 'Task', priority: null }), /Priority must be/);
  assert.throws(() => store.create({ title: 'Task', priority: 5 }), /Priority must be/);
});

test('updates priority', () => {
  const store = new TaskStore();
  const task = store.create({ title: 'Run QA' });
  assert.equal(store.update(task.id, { priority: 'high' }).priority, 'high');
});

test('rejects invalid priority on update without mutating task', () => {
  const store = new TaskStore();
  const task = store.create({ title: 'Run QA', priority: 'low' });
  assert.throws(() => store.update(task.id, { priority: null }), /Priority must be/);
  assert.equal(store.list().find((t) => t.id === task.id).priority, 'low');
});

test('update without priority keeps current priority', () => {
  const store = new TaskStore();
  const task = store.create({ title: 'Run QA', priority: 'high' });
  const updated = store.update(task.id, { status: 'done' });
  assert.equal(updated.priority, 'high');
});

test('normalizes legacy tasks without priority', () => {
  const store = new TaskStore([{ id: 1, title: 'Legacy', status: 'todo', createdAt: new Date().toISOString() }]);
  assert.equal(store.list()[0].priority, 'medium');
});
