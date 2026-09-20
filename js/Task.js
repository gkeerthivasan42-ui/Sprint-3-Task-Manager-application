export class Task {
  constructor({ id, name, description, assignedTo, dueDate, status }) {
    this.id = id || crypto.randomUUID();
    this.name = name;
    this.description = description;
    this.assignedTo = assignedTo;
    this.dueDate = dueDate;
    this.status = status;
  }
}
