import type { Filter } from '../types/todo';

interface TodoFiltersProps {
  activeFilter: Filter;
  activeCount: number;
  completedCount: number;
  onFilterChange: (filter: Filter) => void;
  onClearCompleted: () => void;
}

function TodoFilters({
  activeFilter,
  activeCount,
  completedCount,
  onFilterChange,
  onClearCompleted,
}: TodoFiltersProps): React.JSX.Element {
  return (
    <div className="todo-filters">
      <span className="todo-filters__counter">
        {activeCount} {activeCount === 1 ? 'item' : 'items'} left
      </span>
      <div className="todo-filters__buttons">
        {(['all', 'active', 'completed'] as Filter[]).map((filter) => (
          <button
            key={filter}
            className="todo-filters__btn"
            aria-pressed={activeFilter === filter}
            onClick={() => onFilterChange(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>
      {completedCount > 0 && (
        <button className="todo-filters__clear" onClick={onClearCompleted}>
          Clear completed
        </button>
      )}
    </div>
  );
}

export default TodoFilters;
