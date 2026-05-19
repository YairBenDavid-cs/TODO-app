import { useState, useEffect, useRef } from 'react';
import type { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  isEditing: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onStartEdit: (id: string) => void;
  onSaveEdit: (id: string, text: string) => void;
  onCancelEdit: () => void;
}

function TodoItem({
  todo,
  isEditing,
  onToggle,
  onDelete,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
}: TodoItemProps): React.JSX.Element {
  const [editValue, setEditValue] = useState<string>(todo.text);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      setEditValue(todo.text);
      editInputRef.current?.focus();
    }
  }, [isEditing, todo.text]);

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

  return (
    <li className={`todo-item${todo.completed ? ' todo-item--completed' : ''}`}>
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
