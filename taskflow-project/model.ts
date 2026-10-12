export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  createdAt: number;
}

export function addTask(tasks: Task[], title: string, status: TaskStatus = "todo"): Task[] {
  const task: Task = {
    id: tasks.reduce((largestId, task) => Math.max(largestId, task.id), 0) + 1,
    title: title.trim(),
    status,
    createdAt: Date.now(),
  };
  return [...tasks, task];
}

export function advanceTask(tasks: Task[], id: number): Task[] {
  const nextStatus: Record<TaskStatus, TaskStatus> = {
    "todo": "in-progress",
    "in-progress": "done",
    "done": "todo",
  };
  return tasks.map((task) => task.id === id ? { ...task, status: nextStatus[task.status] } : task);
}

export function completeTask(tasks: Task[], id: number): Task[] {
  return tasks.map((task) => task.id === id ? { ...task, status: "done" } : task);
}

export function deleteTask(tasks: Task[], id: number): Task[] {
  return tasks.filter((task) => task.id !== id);
}

export function filterByStatus(tasks: Task[], status: "all" | TaskStatus): Task[] {
  return status === "all" ? tasks : tasks.filter((task) => task.status === status);
}

export function isTaskStatus(value: string): value is TaskStatus {
  return value === "todo" || value === "in-progress" || value === "done";
}
