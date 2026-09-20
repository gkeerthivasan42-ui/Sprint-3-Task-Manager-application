import { Task } from "./Task.js";

export class TaskManager {
  constructor(storageKey = "taskManagerTasks") {
    this.storageKey = storageKey;
    this.tasks = [];
    this.loadTasks();
  }

  add(taskData) {
    const task = taskData instanceof Task ? taskData : new Task(taskData);
    this.tasks.push(task);
    this.saveTasks();
    return task;
  }

  delete(id) {
    const oldLength = this.tasks.length;
    this.tasks = this.tasks.filter(task => task.id !== id);
    const changed = this.tasks.length !== oldLength;
    if (changed) this.saveTasks();
    return changed;
  }

  update(id, taskData) {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) return null;

    const updatedTask = new Task({ ...taskData, id });
    this.tasks[index] = updatedTask;
    this.saveTasks();
    return updatedTask;
  }

  assignTo(id, assignedTo) {
    const task = this.tasks.find(task => task.id === id);
    if (!task) return null;

    task.assignedTo = assignedTo;
    this.saveTasks();
    return task;
  }

  getAll() {
    return [...this.tasks];
  }

  getById(id) {
    return this.tasks.find(task => task.id === id) || null;
  }

  saveTasks() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
  }

  loadTasks() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      this.tasks = stored ? JSON.parse(stored) : [];
    } catch {
      this.tasks = [];
    }
  }

  clearAll() {
    this.tasks = [];
    localStorage.removeItem(this.storageKey);
  }
}
