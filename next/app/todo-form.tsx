'use client';

import { useRef } from 'react';
import { useFormStatus } from 'react-dom';

import { createTodoAction } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="primary-button" type="submit" disabled={pending}>
      {pending ? 'Adding...' : 'Add todo'}
    </button>
  );
}

export function TodoForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      className="todo-form"
      action={async (formData) => {
        await createTodoAction(formData);
        formRef.current?.reset();
      }}
    >
      <input
        aria-label="Todo title"
        className="text-input"
        name="title"
        placeholder="Compare server boundaries"
        required
      />
      <SubmitButton />
    </form>
  );
}
