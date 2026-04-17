import { useState, useTransition } from 'react';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import {
  CompositeComponent,
  type Renderable,
} from '@tanstack/react-start/rsc';

import {
  addTodo,
  getTodoList,
  getTodoSummary,
  toggleTodo,
} from '../lib/todo-rsc';

export const Route = createFileRoute('/')({
  loader: async () => {
    const [summary, todoList] = await Promise.all([
      getTodoSummary(),
      getTodoList(),
    ]);

    return {
      summary,
      todoList,
    };
  },
  component: HomePage,
});

function HomePage() {
  const { summary, todoList } = Route.useLoaderData();

  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">TanStack Start</p>
        <h1>RSC TODO</h1>
        <p className="lede">
          The route loader fetches React Server Components as data and keeps the
          client router in control.
        </p>
        <p className="note">
          This follows the current TanStack Start RSC guide, which documents the
          feature as experimental.
        </p>
        <div className="summary-wrap">{summary as Renderable}</div>
      </section>

      <section className="panel">
        <TodoForm />
        <CompositeComponent
          src={todoList}
          renderToggle={(todo) => <TodoToggle {...todo} />}
        />
      </section>
    </main>
  );
}

function TodoForm() {
  const [title, setTitle] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <form
      className="todo-form"
      onSubmit={(event) => {
        event.preventDefault();

        startTransition(async () => {
          await addTodo({ data: { title } });
          setTitle('');
          await router.invalidate();
        });
      }}
    >
      <input
        aria-label="Todo title"
        className="text-input"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Compare RSC as data"
        required
      />
      <button className="primary-button" type="submit" disabled={isPending}>
        {isPending ? 'Adding...' : 'Add todo'}
      </button>
    </form>
  );
}

function TodoToggle({
  id,
  completed,
}: {
  id: string;
  completed: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      className={completed ? 'toggle done' : 'toggle'}
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleTodo({ data: { id } });
          await router.invalidate();
        });
      }}
    >
      {completed ? 'Done' : 'Open'}
    </button>
  );
}
