'use client';

import { useTransition } from 'react';
import { useRouter } from 'waku';

import { toggleTodoAction } from '../actions/todos';
import type { Todo } from '../lib/todo-store';

export function TodoItem({ todo }: { todo: Todo }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <li className="todo-item">
      <button
        type="button"
        className={todo.completed ? 'toggle done' : 'toggle'}
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            await toggleTodoAction(todo.id);
            router.reload();
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
