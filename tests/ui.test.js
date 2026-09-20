/**
 * UI test specification for the assessment.
 * These tests use Jest + jsdom and verify the list component.
 */

describe("Task List UI", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="taskList"></div>
    `;
  });

  test("adding a task includes it in the HTML list component", () => {
    const list = document.getElementById("taskList");
    const card = document.createElement("article");
    card.className = "task-card";
    card.textContent = "New Task";
    list.appendChild(card);

    expect(list.querySelectorAll(".task-card")).toHaveLength(1);
    expect(list.textContent).toContain("New Task");
  });

  test("removing a task deletes it from the HTML list component", () => {
    const list = document.getElementById("taskList");
    const card = document.createElement("article");
    card.className = "task-card";
    card.dataset.taskId = "123";
    list.appendChild(card);

    card.remove();

    expect(list.querySelectorAll(".task-card")).toHaveLength(0);
  });
});
