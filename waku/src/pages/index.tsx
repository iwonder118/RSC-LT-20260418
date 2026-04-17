import { TodoForm } from '../components/todo-form';
import { TodoItem } from '../components/todo-item';
import { getTodos } from '../lib/todo-store';

export default async function HomePage() {
  const todos = await getTodos();

  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Waku</p>
        <h1>RSC TODO</h1>
        <p className="lede">
          The page reads todos in a server component and calls server actions
          from small client islands.
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

export const getConfig = async () => {
  return {
    render: 'dynamic',
  } as const;
};
