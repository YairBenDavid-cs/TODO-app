import { useState, useMemo } from 'react';
import useLocalStorage from './useLocalStorageTodos';
import type { Todo, Filter } from '../types/todo';

interface UseTodosReturn {
  todos: Todo[];
  filteredTodos: Todo[];
  activeCount: number;
  completedCount: number;
  activeFilter: Filter;
  editingId: string | null;
  setFilter: (filter: Filter) => void;
  setEditingId: (id: string | null) => void;
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodoText: (id: string, text: string) => void;
  clearCompleted: () => void;
}

function useTodos(): UseTodosReturn {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);
  const [activeFilter, setFilter] = useState<Filter>('all');
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredTodos = useMemo<Todo[]>(() => {
    if (activeFilter === 'active') return todos.filter((t) => !t.completed);
    if (activeFilter === 'completed') return todos.filter((t) => t.completed);
    return todos;
  }, [todos, activeFilter]);

  const activeCount = useMemo<number>(
    () => todos.filter((t) => !t.completed).length,
    [todos]
  );

  const completedCount = useMemo<number>(
    () => todos.filter((t) => t.completed).length,
    [todos]
  );

  function addTodo(text: string): void {
    const trimmed = text.trim();
    if (!trimmed) return;
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos((prev) => [...prev, newTodo]);
  }

  function toggleTodo(id: string): void {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function deleteTodo(id: string): void {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    setEditingId((current) => (current === id ? null : current));
  }

  function updateTodoText(id: string, text: string): void {
    const trimmed = text.trim();
    if (!trimmed) {
      deleteTodo(id);
      return;
    } 
    setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t))
      );
    setEditingId(null);
  }

  function clearCompleted(): void {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }

  return {
    todos,
    filteredTodos,
    activeCount,
    completedCount,
    activeFilter,
    setFilter,
    editingId,
    setEditingId,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodoText,
    clearCompleted,
  };
}

export default useTodos;
