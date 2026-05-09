export type ColumnId = 'todo' | 'in-progress' | 'blocked' | 'completed';

export interface Task {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  dueDate: string; // ISO date string
  column: ColumnId;
  createdAt: string;
}

export const COLUMNS: { id: ColumnId; label: string }[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'blocked', label: 'Blocked' },
  { id: 'completed', label: 'Completed' },
];
