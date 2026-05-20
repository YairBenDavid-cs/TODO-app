import { useState } from 'react';

interface CardCreatorProps {
  onAdd: (title: string) => void;
}

export default function CardCreator({ onAdd }: CardCreatorProps): React.JSX.Element {
  const [title, setTitle] = useState<string>('');

  function handleAdd(): void {
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setTitle('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter') {
      handleAdd();
    }
  }

  return (
    <div className="card-creator">
      <input
        className="card-creator__input"
        type="text"
        placeholder="New card title…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
