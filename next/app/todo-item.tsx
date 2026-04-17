'use client';

import { useTransition } from 'react';

import type { Todo } from '../lib/todo-store';
import { toggleTodoAction } from './actions';

export function TodoItem({ todo }: { todo: Todo }) {
  const [isPending, startTransition] = useTransition();

  return (
    <li className="todo-item">
      <button
        type="button"
        className={todo.completed ? 'toggle done' : 'toggle'}
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            await toggleTodoAction(todo.id);
          });
        }}
      >
        {todo.completed ? 'Done' : 'Open'}
      </button>
      <span className={todo.completed ? 'todo-title completed' : 'todo-title'}>
        {todo.title}
      </span>
    </li>
  );
}
