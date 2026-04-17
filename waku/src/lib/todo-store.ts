import { promises as fs } from 'node:fs';
import path from 'node:path';

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

const filePath = path.join(process.cwd(), 'data', 'todos.json');

async function ensureFile() {
  try {
    await fs.access(filePath);
  } catch {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, '[]\n', 'utf8');
  }
}

export async function getTodos() {
  await ensureFile();
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw) as Todo[];
}

async function saveTodos(todos: Todo[]) {
  await fs.writeFile(filePath, `${JSON.stringify(todos, null, 2)}\n`, 'utf8');
}

export async function addTodo(title: string) {
  const todos = await getTodos();
  const nextTodo: Todo = {
    id: crypto.randomUUID(),
    title,
    completed: false,
  };

  await saveTodos([nextTodo, ...todos]);
}

export async function toggleTodo(id: string) {
  const todos = await getTodos();
  const nextTodos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo,
  );

  await saveTodos(nextTodos);
}
