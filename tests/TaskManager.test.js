import { TaskManager } from "../js/TaskManager.js";

describe("TaskManager", () => {
  let manager;

  beforeEach(() => {
    localStorage.clear();
    manager = new TaskManager("testTasks");
  });

  test("Add creates a task", () => {
    const task = manager.add({
      name: "Test Task",
      description: "Testing add",
      assignedTo: "Keerthivasan",
      dueDate: "2026-09-25",
      status: "Pending"
    });

    expect(task.name).toBe("Test Task");
    expect(manager.getAll()).toHaveLength(1);
  });

  test("Delete removes a task", () => {
    const task = manager.add({
      name: "Delete Me",
      description: "Testing delete",
      assignedTo: "User",
      dueDate: "2026-09-25",
      status: "Pending"
    });

    expect(manager.delete(task.id)).toBe(true);
    expect(manager.getAll()).toHaveLength(0);
  });

  test("Update changes the task", () => {
    const task = manager.add({
      name: "Old Name",
      description: "Old description",
      assignedTo: "User",
      dueDate: "2026-09-25",
      status: "Pending"
    });

    const updated = manager.update(task.id, {
      name: "New Name",
      description: "New description",
      assignedTo: "Admin",
      dueDate: "2026-09-30",
      status: "Completed"
    });

    expect(updated.name).toBe("New Name");
    expect(manager.getById(task.id).status).toBe("Completed");
  });

  test("Assign To changes assigned user", () => {
    const task = manager.add({
      name: "Assign Task",
      description: "Testing assignment",
      assignedTo: "User A",
      dueDate: "2026-09-25",
      status: "Pending"
    });

    const result = manager.assignTo(task.id, "User B");

    expect(result.assignedTo).toBe("User B");
    expect(manager.getById(task.id).assignedTo).toBe("User B");
  });

  test("Tasks persist in LocalStorage", () => {
    manager.add({
      name: "Persistent Task",
      description: "Storage test",
      assignedTo: "User",
      dueDate: "2026-09-25",
      status: "Pending"
    });

    const newManager = new TaskManager("testTasks");
    expect(newManager.getAll()).toHaveLength(1);
    expect(newManager.getAll()[0].name).toBe("Persistent Task");
  });
});
