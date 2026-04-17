'use server';

import { revalidatePath } from 'next/cache';

import { addTodo, toggleTodo } from '../lib/todo-store';

export async function createTodoAction(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim();

  if (!title) {
    return;
  }

  await addTodo(title);
  revalidatePath('/');
}

export async function toggleTodoAction(id: string) {
  await toggleTodo(id);
  revalidatePath('/');
}
