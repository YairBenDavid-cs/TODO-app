import { useState } from 'react';

interface TodoInputProps {
  onAdd: (text: string) => void;
}

export default function TodoInput({ onAdd }: TodoInputProps): React.JSX.Element {
  const [inputValue, setInputValue] = useState<string>('');

  function handleAdd(): void {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setInputValue('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key !== 'Enter') return;
    handleAdd();
  }

  return (
    <div className="todo-input-wrapper">
      <span className="todo-input__prefix" aria-hidden="true">›</span>
      <input
        className="todo-input"
        type="text"
        placeholder="What needs to be done?"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
