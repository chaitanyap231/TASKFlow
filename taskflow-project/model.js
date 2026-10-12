export function addTask(tasks, title, status = "todo") {
    const task = {
        id: tasks.reduce((largestId, task) => Math.max(largestId, task.id), 0) + 1,
        title: title.trim(),
        status,
        createdAt: Date.now(),
    };
    return [...tasks, task];
}
export function advanceTask(tasks, id) {
    const nextStatus = {
        "todo": "in-progress",
        "in-progress": "done",
        "done": "todo",
    };
    return tasks.map((task) => task.id === id ? { ...task, status: nextStatus[task.status] } : task);
}
export function completeTask(tasks, id) {
    return tasks.map((task) => task.id === id ? { ...task, status: "done" } : task);
}
export function deleteTask(tasks, id) {
    return tasks.filter((task) => task.id !== id);
}
export function filterByStatus(tasks, status) {
    return status === "all" ? tasks : tasks.filter((task) => task.status === status);
}
export function isTaskStatus(value) {
    return value === "todo" || value === "in-progress" || value === "done";
}
