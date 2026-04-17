import { TodoForm } from './todo-form';
import { TodoItem } from './todo-item';
import { getTodos } from '../lib/todo-store';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const todos = await getTodos();

  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Next.js</p>
        <h1>RSC TODO</h1>
        <p className="lede">
          The list is fetched in a server component. Creating and toggling todos
          use server actions.
        </p>
      </section>

      <section className="panel">
        <TodoForm />
        <ul className="todo-list">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      </section>
    </main>
  );
}
