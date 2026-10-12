import { Task, TaskStatus, addTask, advanceTask, deleteTask, filterByStatus, isTaskStatus } from "./model.js";

const STORAGE_KEY = "taskflow-tasks-v1";
const titleInput = document.getElementById("title") as HTMLInputElement;
const statusInput = document.getElementById("status") as HTMLSelectElement;
const addButton = document.getElementById("add") as HTMLButtonElement;
const listElement = document.getElementById("list") as HTMLUListElement;
const chipsElement = document.getElementById("chips") as HTMLDivElement;
const totalElement = document.getElementById("total-count") as HTMLSpanElement;
const todoElement = document.getElementById("todo-count") as HTMLSpanElement;
const progressElement = document.getElementById("progress-count") as HTMLSpanElement;
const doneElement = document.getElementById("done-count") as HTMLSpanElement;
const emptyElement = document.getElementById("empty-state") as HTMLDivElement;
const clearDoneButton = document.getElementById("clear-done") as HTMLButtonElement;
const searchInput = document.getElementById("search") as HTMLInputElement;

let tasks: Task[] = loadTasks();
let filter: "all" | TaskStatus = "all";
let searchTerm = "";

function loadTasks(): Task[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === null) return [];
  try {
    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item: unknown): item is Task => {
      if (typeof item !== "object" || item === null) return false;
      const candidate = item as Record<string, unknown>;
      return typeof candidate.id === "number"
        && typeof candidate.title === "string"
        && typeof candidate.createdAt === "number"
        && typeof candidate.status === "string"
        && isTaskStatus(candidate.status);
    });
  } catch {
    return [];
  }
}

function saveTasks(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function statusLabel(status: TaskStatus): string {
  if (status === "todo") return "To do";
  if (status === "in-progress") return "In progress";
  return "Done";
}

function render(): void {
  const visibleTasks = filterByStatus(tasks, filter).filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  listElement.replaceChildren();
  emptyElement.hidden = visibleTasks.length > 0;

  visibleTasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = `task-row ${task.status === "done" ? "is-done" : ""}`;

    const marker = document.createElement("span");
    marker.className = `task-marker marker-${task.status}`;
    marker.setAttribute("aria-hidden", "true");

    const copy = document.createElement("div");
    copy.className = "task-copy";
    const taskTitle = document.createElement("p");
    taskTitle.className = "task-title";
    taskTitle.textContent = task.title;
    const date = document.createElement("p");
    date.className = "task-date";
    date.textContent = `Added ${new Date(task.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
    copy.append(taskTitle, date);

    const badge = document.createElement("span");
    badge.className = `status-badge badge-${task.status}`;
    badge.textContent = statusLabel(task.status);

    const advanceButton = document.createElement("button");
    advanceButton.className = "icon-button advance-button";
    advanceButton.type = "button";
    advanceButton.textContent = task.status === "done" ? "↺" : "→";
    advanceButton.title = task.status === "done" ? "Move back to To do" : "Advance task status";
    advanceButton.setAttribute("aria-label", `${advanceButton.title}: ${task.title}`);
    advanceButton.addEventListener("click", () => {
      tasks = advanceTask(tasks, task.id);
      saveTasks();
      render();
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "icon-button delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "×";
    deleteButton.title = "Delete task";
    deleteButton.setAttribute("aria-label", `Delete ${task.title}`);
    deleteButton.addEventListener("click", () => {
      tasks = deleteTask(tasks, task.id);
      saveTasks();
      render();
    });

    item.append(marker, copy, badge, advanceButton, deleteButton);
    listElement.append(item);
  });

  totalElement.textContent = String(tasks.length);
  todoElement.textContent = String(tasks.filter((task) => task.status === "todo").length);
  progressElement.textContent = String(tasks.filter((task) => task.status === "in-progress").length);
  doneElement.textContent = String(tasks.filter((task) => task.status === "done").length);
  clearDoneButton.disabled = !tasks.some((task) => task.status === "done");

  chipsElement.querySelectorAll<HTMLButtonElement>("[data-filter]").forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function addCurrentTask(): void {
  const title = titleInput.value.trim();
  const chosenStatus = statusInput.value;
  if (title.length === 0) {
    titleInput.focus();
    titleInput.setAttribute("aria-invalid", "true");
    return;
  }
  if (!isTaskStatus(chosenStatus)) return;
  tasks = addTask(tasks, title, chosenStatus);
  titleInput.value = "";
  titleInput.removeAttribute("aria-invalid");
  saveTasks();
  render();
  titleInput.focus();
}

addButton.addEventListener("click", addCurrentTask);
titleInput.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Enter") addCurrentTask();
});
titleInput.addEventListener("input", () => titleInput.removeAttribute("aria-invalid"));
searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim();
  render();
});
chipsElement.addEventListener("click", (event: MouseEvent) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;
  const chosenFilter = target.dataset.filter;
  if (chosenFilter === "all" || (typeof chosenFilter === "string" && isTaskStatus(chosenFilter))) {
    filter = chosenFilter;
    render();
  }
});
clearDoneButton.addEventListener("click", () => {
  tasks = tasks.filter((task) => task.status !== "done");
  saveTasks();
  render();
});

render();
