import '../index.css';
import '../styles/app.css';
import '../styles/todo-input.css';
import '../styles/todo-list.css';
import '../styles/todo-item.css';
import '../styles/todo-filters.css';
import useTodos from '../hooks/useTodos';
import TodoInput from './TodoInput';
import TodoList from './TodoList';
import TodoFilters from './TodoFilters';

export default function App(): React.JSX.Element {
  const {
    todos,
    filteredTodos,
    activeCount,
    completedCount,
    activeFilter,
    editingId,
    setFilter,
    setEditingId,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodoText,
    clearCompleted,
  } = useTodos();

  return (
    <div className="app">
      <header>
        <h1>Todos</h1>
        <TodoInput onAdd={addTodo} />
      </header>
      <main>
        <TodoList
          todos={filteredTodos}
          editingId={editingId}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onStartEdit={setEditingId}
          onSaveEdit={updateTodoText}
          onCancelEdit={() => setEditingId(null)}
        />
      </main>
      {todos.length > 0 && (
        <footer>
          <TodoFilters
            activeFilter={activeFilter}
            activeCount={activeCount}
            completedCount={completedCount}
            onFilterChange={setFilter}
            onClearCompleted={clearCompleted}
          />
        </footer>
      )}
    </div>
  );
}
