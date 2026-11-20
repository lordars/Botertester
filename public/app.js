'use strict';

const taskList = document.querySelector('#task-list');
const taskForm = document.querySelector('#task-form');
const titleInput = document.querySelector('#task-title');
const statusFilter = document.querySelector('#status-filter');
const priorityFilter = document.querySelector('#priority-filter');
const priorityInput = document.querySelector('#task-priority');
const emptyState = document.querySelector('#empty-state');
const formMessage = document.querySelector('#form-message');
const healthLabel = document.querySelector('#health');

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  if (response.status === 204) return null;
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || 'Request failed.');
  return payload;
}

function createTaskElement(task) {
  const item = document.createElement('li');
  item.className = 'task-item';

  const title = document.createElement('span');
  title.className = 'task-title';
  title.textContent = task.title;

  const priorityBadge = document.createElement('span');
  priorityBadge.className = 'task-priority';
  priorityBadge.textContent = task.priority;

  const status = document.createElement('select');
  status.className = 'task-status';
  status.setAttribute('aria-label', `Status for ${task.title}`);
  for (const [value, label] of [['todo', 'To do'], ['doing', 'In progress'], ['done', 'Done']]) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    status.append(option);
  }
  status.value = task.status;
  status.addEventListener('change', async () => {
    try {
      await api(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: status.value })
      });
      await loadTasks();
    } catch (error) {
      formMessage.textContent = error.message;
      status.value = task.status;
    }
  });

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'remove-button';
  removeButton.textContent = 'Delete';
  removeButton.setAttribute('aria-label', `Delete ${task.title}`);
  removeButton.addEventListener('click', async () => {
    try {
      await api(`/api/tasks/${task.id}`, { method: 'DELETE' });
      await loadTasks();
    } catch (error) {
      formMessage.textContent = error.message;
    }
  });

  item.append(title, priorityBadge, status, removeButton);
  return item;
}

async function loadTasks() {
  const { tasks } = await api('/api/tasks');
  const selectedStatus = statusFilter.value;
  const selectedPriority = priorityFilter.value;
  const visibleTasks = tasks.filter((task) =>
    (selectedStatus === 'all' || task.status === selectedStatus) &&
    (selectedPriority === 'all' || task.priority === selectedPriority)
  );
  taskList.replaceChildren(...visibleTasks.map(createTaskElement));
  emptyState.hidden = visibleTasks.length !== 0;
}

async function checkHealth() {
  try {
    await api('/api/health');
    healthLabel.textContent = 'API online';
    healthLabel.classList.add('online');
  } catch {
    healthLabel.textContent = 'API unavailable';
    healthLabel.classList.remove('online');
  }
}

taskForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  formMessage.textContent = '';
  try {
    await api('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: titleInput.value, priority: priorityInput.value })
    });
    titleInput.value = '';
    await loadTasks();
    titleInput.focus();
  } catch (error) {
    formMessage.textContent = error.message;
  }
});

statusFilter.addEventListener('change', () => {
  loadTasks().catch((error) => { formMessage.textContent = error.message; });
});
priorityFilter.addEventListener('change', () => {
  loadTasks().catch((error) => { formMessage.textContent = error.message; });
});

Promise.all([checkHealth(), loadTasks()]).catch((error) => {
  formMessage.textContent = error.message;
});
