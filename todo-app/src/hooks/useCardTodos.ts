import { useState, useMemo } from 'react';
import type { Todo, Filter } from '../types/todo';

interface UseCardTodosReturn {
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
  reorderTodos: (fromIndex: number, toIndex: number) => void;
}

function useCardTodos(
  cardId: string,
  todos: Todo[],
  onUpdate: (cardId: string, todos: Todo[]) => void
): UseCardTodosReturn {
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
    const firstCompletedIndex = todos.findIndex((t) => t.completed);
    if (firstCompletedIndex === -1) {
      onUpdate(cardId, [...todos, newTodo]);
    } else {
      const updated = [...todos];
      updated.splice(firstCompletedIndex, 0, newTodo);
      onUpdate(cardId, updated);
    }
  }

  function toggleTodo(id: string): void {
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) return;
    const updated = todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    const [moved] = updated.splice(index, 1);
    updated.push(moved);
    onUpdate(cardId, updated);
  }

  function deleteTodo(id: string): void {
    onUpdate(cardId, todos.filter((t) => t.id !== id));
    setEditingId((current) => (current === id ? null : current));
  }

  function updateTodoText(id: string, text: string): void {
    const trimmed = text.trim();
    if (!trimmed) {
      deleteTodo(id);
      return;
    }
    onUpdate(cardId, todos.map((t) => (t.id === id ? { ...t, text: trimmed } : t)));
    setEditingId(null);
  }

  function clearCompleted(): void {
    onUpdate(cardId, todos.filter((t) => !t.completed));
  }

  function reorderTodos(fromIndex: number, toIndex: number): void {
    if (fromIndex === toIndex) return;
    const updated = [...todos];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onUpdate(cardId, updated);
  }

  return {
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
    reorderTodos,
  };
}

export default useCardTodos;
