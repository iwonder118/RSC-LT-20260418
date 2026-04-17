'use client';

import { useRef } from 'react';
import { useRouter } from 'waku';

import { createTodo } from '../actions/todos';

export function TodoForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  return (
    <form
      ref={formRef}
      className="todo-form"
      action={async (formData) => {
        await createTodo(formData);
        formRef.current?.reset();
        router.reload();
      }}
    >
      <input
        aria-label="Todo title"
        className="text-input"
        name="title"
        placeholder="Compare Waku server actions"
        required
      />
      <button className="primary-button" type="submit">
        Add todo
      </button>
    </form>
  );
}
