import { TaskManager } from "./TaskManager.js";

const manager = new TaskManager();

const form = document.getElementById("taskForm");
const taskId = document.getElementById("taskId");
const nameInput = document.getElementById("name");
const descriptionInput = document.getElementById("description");
const assignedToInput = document.getElementById("assignedTo");
const dueDateInput = document.getElementById("dueDate");
const statusInput = document.getElementById("status");
const saveButton = document.getElementById("saveButton");
const clearButton = document.getElementById("clearButton");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const taskCount = document.getElementById("taskCount");
const formTitle = document.getElementById("formTitle");

const fields = ["name", "description", "assignedTo", "dueDate", "status"];

function setError(field, message) {
  document.getElementById(`${field}Error`).textContent = message;
}

function clearErrors() {
  fields.forEach(field => setError(field, ""));
}

export function validateForm(data) {
  clearErrors();
  let valid = true;

  if (!data.name.trim()) {
    setError("name", "Task name is required.");
    valid = false;
  }

  if (!data.description.trim()) {
    setError("description", "Description is required.");
    valid = false;
  }

  if (!data.assignedTo.trim()) {
    setError("assignedTo", "Assigned To is required.");
    valid = false;
  }

  if (!data.dueDate) {
    setError("dueDate", "Due date is required.");
    valid = false;
  }

  if (!data.status) {
    setError("status", "Please select a status.");
    valid = false;
  }

  return valid;
}

function getFormData() {
  return {
    id: taskId.value,
    name: nameInput.value,
    description: descriptionInput.value,
    assignedTo: assignedToInput.value,
    dueDate: dueDateInput.value,
    status: statusInput.value
  };
}

function resetForm() {
  form.reset();
  taskId.value = "";
  clearErrors();
  saveButton.textContent = "Save";
  formTitle.textContent = "Add Task";
}

function renderTasks() {
  const tasks = manager.getAll();
  taskList.innerHTML = "";
  taskCount.textContent = `${tasks.length} task${tasks.length === 1 ? "" : "s"}`;
  emptyMessage.style.display = tasks.length ? "none" : "block";

  tasks.forEach(task => {
    const card = document.createElement("article");
    card.className = "task-card";
    card.dataset.taskId = task.id;

    const title = document.createElement("h3");
    title.textContent = task.name;

    const description = document.createElement("p");
    description.textContent = task.description;

    const meta = document.createElement("div");
    meta.className = "task-meta";
    meta.innerHTML = `
      <p><strong>Assigned To:</strong> ${escapeHtml(task.assignedTo)}</p>
      <p><strong>Due Date:</strong> ${escapeHtml(task.dueDate)}</p>
      <p><strong>Status:</strong> ${escapeHtml(task.status)}</p>
    `;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editButton = document.createElement("button");
    editButton.className = "edit";
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.dataset.action = "edit";
    editButton.dataset.id = task.id;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.id = task.id;

    actions.append(editButton, deleteButton);
    card.append(title, description, meta, actions);
    taskList.appendChild(card);
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function editTask(id) {
  const task = manager.getById(id);
  if (!task) return;

  taskId.value = task.id;
  nameInput.value = task.name;
  descriptionInput.value = task.description;
  assignedToInput.value = task.assignedTo;
  dueDateInput.value = task.dueDate;
  statusInput.value = task.status;

  clearErrors();
  saveButton.textContent = "Update";
  formTitle.textContent = "Update Task";
  nameInput.focus();
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const data = getFormData();
  if (!validateForm(data)) return;

  if (taskId.value) {
    manager.update(taskId.value, data);
  } else {
    manager.add(data);
  }

  renderTasks();
  resetForm();
});

clearButton.addEventListener("click", resetForm);

taskList.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;

  const id = button.dataset.id;
  if (button.dataset.action === "edit") editTask(id);

  if (button.dataset.action === "delete") {
    manager.delete(id);
    renderTasks();

    if (taskId.value === id) resetForm();
  }
});

renderTasks();
