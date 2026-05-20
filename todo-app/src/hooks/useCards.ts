import { useState } from 'react';
import useLocalStorage from './useLocalStorageTodos';
import type { Todo, TodoCard } from '../types/todo';

interface UseCardsReturn {
  cards: TodoCard[];
  editingCardTitleId: string | null;
  setEditingCardTitleId: (id: string | null) => void;
  addCard: (title: string) => void;
  deleteCard: (cardId: string) => void;
  updateCardTitle: (cardId: string, title: string) => void;
  updateCardTodos: (cardId: string, todos: Todo[]) => void;
}

function useCards(): UseCardsReturn {
  const [cards, setCards] = useLocalStorage<TodoCard[]>('cards', []);
  const [editingCardTitleId, setEditingCardTitleId] = useState<string | null>(null);

  function addCard(title: string): void {
    const trimmed = title.trim();
    const newCard: TodoCard = {
      id: crypto.randomUUID(),
      title: trimmed || 'Untitled',
      todos: [],
      createdAt: Date.now(),
    };
    setCards((prev) => [...prev, newCard]);
  }

  function deleteCard(cardId: string): void {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
    setEditingCardTitleId((current) => (current === cardId ? null : current));
  }

  function updateCardTitle(cardId: string, title: string): void {
    const trimmed = title.trim();
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, title: trimmed || 'Untitled' } : c))
    );
  }

  function updateCardTodos(cardId: string, todos: Todo[]): void {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, todos } : c))
    );
  }

  return {
    cards,
    editingCardTitleId,
    setEditingCardTitleId,
    addCard,
    deleteCard,
    updateCardTitle,
    updateCardTodos,
  };
}

export default useCards;
