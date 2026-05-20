import type { TodoCard, Todo } from '../types/todo';
import NoteCard from './NoteCard';

interface CardGridProps {
  cards: TodoCard[];
  editingCardTitleId: string | null;
  onSetEditingCardTitle: (id: string | null) => void;
  onUpdateCardTitle: (cardId: string, title: string) => void;
  onDeleteCard: (cardId: string) => void;
  onUpdateCardTodos: (cardId: string, todos: Todo[]) => void;
}

export default function CardGrid({
  cards,
  editingCardTitleId,
  onSetEditingCardTitle,
  onUpdateCardTitle,
  onDeleteCard,
  onUpdateCardTodos,
}: CardGridProps): React.JSX.Element {
  if (cards.length === 0) {
    return <p className="card-grid__empty">No cards yet. Create one above!</p>;
  }

  return (
    <div className="card-grid">
      {cards.map((card) => (
        <NoteCard
          key={card.id}
          card={card}
          isEditingTitle={editingCardTitleId === card.id}
          onSetEditingTitle={onSetEditingCardTitle}
          onUpdateTitle={onUpdateCardTitle}
          onDelete={onDeleteCard}
          onUpdateTodos={onUpdateCardTodos}
        />
      ))}
    </div>
  );
}
