'use server';

import { addTodo, toggleTodo } from '../lib/todo-store';

export async function createTodo(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim();

  if (!title) {
    return;
  }

  await addTodo(title);
}

export async function toggleTodoAction(id: string) {
  await toggleTodo(id);
}
