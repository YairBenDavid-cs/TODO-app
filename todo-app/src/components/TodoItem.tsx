import { useState, useEffect, useRef } from 'react';
import type { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  index: number;
  isEditing: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onStartEdit: (id: string) => void;
  onSaveEdit: (id: string, text: string) => void;
  onCancelEdit: () => void;
  onDragStart?: (index: number) => void;
  onDragOver?: (e: React.DragEvent<HTMLLIElement>, index: number) => void;
  onDrop?: (index: number) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
  isDragOver?: boolean;
}

function TodoItem({
  todo,
  index,
  isEditing,
  onToggle,
  onDelete,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging,
  isDragOver,
}: TodoItemProps): React.JSX.Element {
  const [editValue, setEditValue] = useState<string>(todo.text);
  const [prevIsEditing, setPrevIsEditing] = useState<boolean>(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  if (prevIsEditing !== isEditing) {
    setPrevIsEditing(isEditing);
    if (isEditing) {
      setEditValue(todo.text);
    }
  }

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  function handleBlur(): void {
    if (!isEditing) return;
    onSaveEdit(todo.id, editValue);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter') {
      onSaveEdit(todo.id, editValue);
    } else if (e.key === 'Escape') {
      onCancelEdit();
    }
  }

  const isDragEnabled = onDragStart !== undefined;

  const classNames = [
    'todo-item',
    todo.completed ? 'todo-item--completed' : '',
    isDragging ? 'todo-item--dragging' : '',
    isDragOver ? 'todo-item--drag-over' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li
      className={classNames}
      draggable={isDragEnabled && !isEditing}
      onDragStart={isDragEnabled ? () => onDragStart(index) : undefined}
      onDragOver={onDragOver ? (e) => onDragOver(e, index) : undefined}
      onDrop={onDrop ? () => onDrop(index) : undefined}
      onDragEnd={onDragEnd}
    >
      {isEditing ? (
        <input
          ref={editInputRef}
          className="todo-item__edit-input"
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <>
          {isDragEnabled && (
            <span className="todo-item__drag-handle" aria-hidden="true" />
          )}
          <input
            type="checkbox"
            className="todo-item__checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
          />
          <label
            className="todo-item__label"
            onDoubleClick={() => onStartEdit(todo.id)}
          >
            {todo.text}
          </label>
          <button
            className="todo-item__delete"
            onClick={() => onDelete(todo.id)}
            aria-label="Delete todo"
          >
            ×
          </button>
        </>
      )}
    </li>
  );
}

export default TodoItem;
