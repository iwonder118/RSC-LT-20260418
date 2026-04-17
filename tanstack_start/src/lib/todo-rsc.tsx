import type { ReactNode } from 'react';

import { createServerFn } from '@tanstack/react-start';
import {
  createCompositeComponent,
  renderServerComponent,
} from '@tanstack/react-start/rsc';

import { createTodo, flipTodo, readTodos } from './todo-store';

type ToggleSlot = (todo: { id: string; completed: boolean }) => ReactNode;

async function TodoSummary() {
  const todos = await readTodos();
  const openCount = todos.filter((todo) => !todo.completed).length;

  return (
    <p className="summary">
      {todos.length} todos total, {openCount} still open.
    </p>
  );
}

export const getTodoSummary = createServerFn({ method: 'GET' }).handler(
  async () => {
    return renderServerComponent(<TodoSummary />);
  },
);

export const getTodoList = createServerFn({ method: 'GET' }).handler(
  async () => {
    const todos = await readTodos();

    return createCompositeComponent(
      ({
        renderToggle,
      }: {
        renderToggle?: ToggleSlot;
      }) => (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <span
                className={
                  todo.completed ? 'todo-title completed' : 'todo-title'
                }
              >
                {todo.title}
              </span>
              {renderToggle?.({
                id: todo.id,
                completed: todo.completed,
              })}
            </li>
          ))}
        </ul>
      ),
    );
  },
);

export const addTodo = createServerFn({ method: 'POST' })
  .inputValidator((input: { title: string }) => input)
  .handler(async ({ data }) => {
    const title = data.title.trim();

    if (!title) {
      return;
    }

    await createTodo(title);
  });

export const toggleTodo = createServerFn({ method: 'POST' })
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    await flipTodo(data.id);
  });
