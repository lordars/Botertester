'use strict';

const VALID_STATUSES = new Set(['todo', 'doing', 'done']);
const VALID_PRIORITIES = new Set(['low', 'medium', 'high']);

class TaskStore {
  constructor(initialTasks = []) {
    this.tasks = initialTasks.map((task) => ({ ...task, priority: VALID_PRIORITIES.has(task?.priority) ? task.priority : 'medium' }));
    this.nextId = this.tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;
  }

  list() {
    return this.tasks.map((task) => ({ ...task, priority: VALID_PRIORITIES.has(task?.priority) ? task.priority : 'medium' }));
  }

  create(input) {
    const title = typeof input?.title === 'string' ? input.title.trim() : '';
    if (!title) {
      throw new TypeError('Title is required.');
    }
    if (title.length > 120) {
      throw new RangeError('Title must be 120 characters or fewer.');
    }

    const status = input?.status ?? 'todo';
    if (!VALID_STATUSES.has(status)) {
      throw new TypeError('Status must be todo, doing, or done.');
    }

    const priority = input?.priority === undefined ? 'medium' : input.priority;
    if (!VALID_PRIORITIES.has(priority)) {
      throw new TypeError('Priority must be low, medium, or high.');
    }

    const task = {
      id: this.nextId++,
      title,
      status,
      priority,
      createdAt: new Date().toISOString()
    };
    this.tasks.push(task);
    return { ...task };
  }

  update(id, changes) {
    const task = this.tasks.find((item) => item.id === Number(id));
    if (!task) return null;

    if (Object.hasOwn(changes, 'title')) {
      const title = typeof changes.title === 'string' ? changes.title.trim() : '';
      if (!title) throw new TypeError('Title cannot be empty.');
      if (title.length > 120) throw new RangeError('Title must be 120 characters or fewer.');
      task.title = title;
    }

    if (Object.hasOwn(changes, 'status')) {
      if (!VALID_STATUSES.has(changes.status)) {
        throw new TypeError('Status must be todo, doing, or done.');
      }
      task.status = changes.status;
    }

    if (Object.hasOwn(changes, 'priority')) {
      if (!VALID_PRIORITIES.has(changes.priority)) {
        throw new TypeError('Priority must be low, medium, or high.');
      }
      task.priority = changes.priority;
    }

    return { ...task };
  }

  remove(id) {
    const index = this.tasks.findIndex((item) => item.id === Number(id));
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    return true;
  }
}

module.exports = { TaskStore, VALID_STATUSES, VALID_PRIORITIES };
