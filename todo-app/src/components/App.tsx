import '../index.css';
import '../styles/app.css';
import '../styles/todo-input.css';
import '../styles/todo-list.css';
import '../styles/todo-item.css';
import '../styles/todo-filters.css';
import '../styles/card-creator.css';
import '../styles/note-card.css';
import '../styles/card-grid.css';
import useCards from '../hooks/useCards';
import CardCreator from './CardCreator';
import CardGrid from './CardGrid';

export default function App(): React.JSX.Element {
  const {
    cards,
    editingCardTitleId,
    setEditingCardTitleId,
    addCard,
    deleteCard,
    updateCardTitle,
    updateCardTodos,
  } = useCards();

  return (
    <div className="app">
      <header>
        <div className="app-title">
          <h1>Todos</h1>
        </div>
        <p className="app-subtitle">Stay focused. Ship fast.</p>
        <CardCreator onAdd={addCard} />
      </header>
      <main>
        <CardGrid
          cards={cards}
          editingCardTitleId={editingCardTitleId}
          onSetEditingCardTitle={setEditingCardTitleId}
          onUpdateCardTitle={updateCardTitle}
          onDeleteCard={deleteCard}
          onUpdateCardTodos={updateCardTodos}
        />
      </main>
    </div>
  );
}
