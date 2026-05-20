import { useState } from 'react';
import type { Todo } from '../types/todo';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  editingId: string | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onStartEdit: (id: string) => void;
  onSaveEdit: (id: string, text: string) => void;
  onCancelEdit: () => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
}

function TodoList({
  todos,
  editingId,
  onToggle,
  onDelete,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onReorder,
}: TodoListProps): React.JSX.Element {
  const [dragSourceIndex, setDragSourceIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  function handleDragStart(index: number): void {
    setDragSourceIndex(index);
  }

  function handleDragOver(e: React.DragEvent<HTMLLIElement>, index: number): void {
    e.preventDefault();
    setDragOverIndex(index);
  }

  function handleDrop(index: number): void {
    if (dragSourceIndex !== null && onReorder) {
      onReorder(dragSourceIndex, index);
    }
    setDragSourceIndex(null);
    setDragOverIndex(null);
  }

  function handleDragEnd(): void {
    setDragSourceIndex(null);
    setDragOverIndex(null);
  }

  if (todos.length === 0) {
    return <p className="todo-list__empty">No todos here!</p>;
  }

  return (
    <ul className="todo-list">
      {todos.map((todo, index) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          index={index}
          isEditing={editingId === todo.id}
          onToggle={onToggle}
          onDelete={onDelete}
          onStartEdit={onStartEdit}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          onDragStart={onReorder ? handleDragStart : undefined}
          onDragOver={onReorder ? handleDragOver : undefined}
          onDrop={onReorder ? handleDrop : undefined}
          onDragEnd={onReorder ? handleDragEnd : undefined}
          isDragging={dragSourceIndex === index}
          isDragOver={dragOverIndex === index}
        />
      ))}
    </ul>
  );
}

export default TodoList;
