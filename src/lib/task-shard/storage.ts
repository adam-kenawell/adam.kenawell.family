import type { Task } from './types';

const STORAGE_KEY = 'task-shard-tasks';

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function addTask(task: Task): Task[] {
  const tasks = loadTasks();
  tasks.push(task);
  saveTasks(tasks);
  return tasks;
}

export function updateTask(updated: Task): Task[] {
  let tasks = loadTasks();
  tasks = tasks.map((t) => (t.id === updated.id ? updated : t));
  saveTasks(tasks);
  return tasks;
}

export function deleteTask(id: string): Task[] {
  let tasks = loadTasks().filter((t) => t.id !== id);
  saveTasks(tasks);
  return tasks;
}

export function generateId(): string {
  return crypto.randomUUID();
}
