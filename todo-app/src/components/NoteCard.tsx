import { useState, useEffect, useRef } from 'react';
import useCardTodos from '../hooks/useCardTodos';
import TodoInput from './TodoInput';
import TodoList from './TodoList';
import TodoFilters from './TodoFilters';
import type { TodoCard, Todo } from '../types/todo';

interface NoteCardProps {
  card: TodoCard;
  isEditingTitle: boolean;
  onSetEditingTitle: (id: string | null) => void;
  onUpdateTitle: (cardId: string, title: string) => void;
  onDelete: (cardId: string) => void;
  onUpdateTodos: (cardId: string, todos: Todo[]) => void;
}

export default function NoteCard({
  card,
  isEditingTitle,
  onSetEditingTitle,
  onUpdateTitle,
  onDelete,
  onUpdateTodos,
}: NoteCardProps): React.JSX.Element {
  const cardTodos = useCardTodos(card.id, card.todos, onUpdateTodos);
  const [titleValue, setTitleValue] = useState<string>(card.title);
  const [prevIsEditingTitle, setPrevIsEditingTitle] = useState<boolean>(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  if (prevIsEditingTitle !== isEditingTitle) {
    setPrevIsEditingTitle(isEditingTitle);
    if (isEditingTitle) {
      setTitleValue(card.title);
    }
  }

  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
    }
  }, [isEditingTitle]);

  function handleTitleBlur(): void {
    if (!isEditingTitle) return;
    onUpdateTitle(card.id, titleValue);
    onSetEditingTitle(null);
  }

  function handleTitleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter') {
      onUpdateTitle(card.id, titleValue);
      onSetEditingTitle(null);
    } else if (e.key === 'Escape') {
      onSetEditingTitle(null);
    }
  }

  return (
    <div className="note-card">
      <div className="note-card__header">
        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            className="note-card__title-input"
            type="text"
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
          />
        ) : (
          <h2
            className="note-card__title"
            onDoubleClick={() => onSetEditingTitle(card.id)}
          >
            {card.title}
          </h2>
        )}
        <button
          className="note-card__delete"
          onClick={() => onDelete(card.id)}
          aria-label="Delete card"
        >
          ×
        </button>
      </div>
      <TodoInput onAdd={cardTodos.addTodo} />
      <TodoList
        todos={cardTodos.filteredTodos}
        editingId={cardTodos.editingId}
        onToggle={cardTodos.toggleTodo}
        onDelete={cardTodos.deleteTodo}
        onStartEdit={cardTodos.setEditingId}
        onSaveEdit={cardTodos.updateTodoText}
        onCancelEdit={() => cardTodos.setEditingId(null)}
        onReorder={cardTodos.activeFilter === 'all' ? cardTodos.reorderTodos : undefined}
      />
      {card.todos.length > 0 && (
        <TodoFilters
          activeFilter={cardTodos.activeFilter}
          activeCount={cardTodos.activeCount}
          completedCount={cardTodos.completedCount}
          onFilterChange={cardTodos.setFilter}
          onClearCompleted={cardTodos.clearCompleted}
        />
      )}
    </div>
  );
}
