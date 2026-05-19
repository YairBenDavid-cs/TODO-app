# Architecture.md — Todo App

## What We're Building

A single-page Todo app. No backend. All state lives in the browser (React state + localStorage). The user can add, edit, complete, delete, and filter todos — and they survive a full page reload.

---

## Component Tree

```
src/main.tsx
└── src/App.tsx  (re-export shim)
    └── src/components/App.tsx          ← root: owns no state directly, wires useTodos to UI
        ├── TodoInput                   ← add new todos (controlled input)
        ├── TodoList                    ← renders filtered list or empty state
        │   └── TodoItem (× N)         ← single row: toggle / inline edit / delete
        └── TodoFilters                 ← filter tabs + item counter + clear completed
```

---

## Data Flow

```
useTodos()
  ├── useLocalStorage<Todo[]>('todos', [])   ← reads/writes localStorage
  ├── useState<Filter>('all')
  └── useState<string | null>(null)          ← editingId

        │
        ▼
components/App.tsx
  │  calls useTodos(), destructures everything
  │
  ├──► TodoInput       receives: onAdd
  ├──► TodoList        receives: todos (filtered), editingId, all CRUD callbacks
  │      └──► TodoItem receives: todo, isEditing, onToggle, onDelete, onStartEdit, onSaveEdit, onCancelEdit
  └──► TodoFilters     receives: activeFilter, activeCount, completedCount, onFilterChange, onClearCompleted
```

State flows **down** as props. Events flow **up** as callbacks. No sibling components share state directly — everything routes through `App` via `useTodos`.

---

## Custom Hooks

### `useLocalStorage<T>` — `src/hooks/useLocalStorageTodos.ts`

Generic localStorage persistence. Drop-in replacement for `useState`.

```ts
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>]
```

- Lazy initializer reads from `localStorage` on mount
- `useEffect` syncs state to `localStorage` on every change
- Wraps reads and writes in `try/catch` (private browsing, quota errors)

### `useTodos` — `src/hooks/useTodos.ts`

Owns all business logic. Internally uses `useLocalStorage` and two `useState` calls.

Returns:

| Name | Type | Description |
|---|---|---|
| `todos` | `Todo[]` | Full unfiltered list |
| `filteredTodos` | `Todo[]` | Filtered by `activeFilter` (memoized) |
| `activeCount` | `number` | Count of incomplete todos (memoized) |
| `completedCount` | `number` | Count of completed todos (memoized) |
| `activeFilter` | `Filter` | Current filter tab |
| `setFilter` | function | Change the active filter |
| `editingId` | `string \| null` | ID of the todo currently being edited |
| `setEditingId` | function | Start or cancel editing |
| `addTodo` | function | Create a new todo |
| `toggleTodo` | function | Toggle completed state |
| `deleteTodo` | function | Remove a todo |
| `updateTodoText` | function | Save edit (empty text → delete instead) |
| `clearCompleted` | function | Remove all completed todos |

---

## Type Definitions — `src/types/todo.ts`

```ts
interface Todo {
  id: string;         // crypto.randomUUID() — globally unique
  text: string;
  completed: boolean;
  createdAt: number;  // Date.now() — stable insertion order
}

type Filter = 'all' | 'active' | 'completed';
```

---

## Component Responsibilities

### `TodoInput`
- Owns only the current input string (`useState<string>`)
- Calls `onAdd(text)` on Enter, then resets to `''`
- Knows nothing about the todo list

### `TodoItem`
- Owns `editValue` (the in-progress edit text) — local, not persisted until save
- Owns a `ref` to the edit input for `.focus()` on edit start
- Renders either the read view (checkbox + label) or the edit view (input field)
- Never reads from `useTodos` directly — all data comes through props

### `TodoList`
- Purely presentational — no state, no logic
- Renders the empty state message when `todos.length === 0`
- Maps `todos` to `TodoItem` components, passing `isEditing={editingId === todo.id}`

### `TodoFilters`
- Purely presentational — no state, no logic
- Three filter buttons with active state via `aria-pressed`
- "Clear completed" only renders when `completedCount > 0`
- Counter text with correct pluralization

### `App` (components/App.tsx)
- Calls `useTodos()`, destructures everything
- Passes callbacks and state down as props
- Imports all CSS files (single import point)
- Hides `<footer>` when `todos.length === 0`

---

## CSS Strategy

**No CSS framework. No CSS Modules. Vanilla CSS with custom properties.**

One stylesheet per component concern, all imported from `components/App.tsx`:

| File | Covers |
|---|---|
| `src/index.css` | Reset, `body`, `#root`, CSS custom property tokens |
| `src/styles/app.css` | `.app` card layout, `header`, `main`, `footer` |
| `src/styles/todo-input.css` | Input field, placeholder, focus ring |
| `src/styles/todo-list.css` | `<ul>`, `<li>` wrapper, `.empty-state` |
| `src/styles/todo-item.css` | Checkbox, label, strikethrough, edit input, delete button |
| `src/styles/todo-filters.css` | Filter button row, active state, counter, clear button |

CSS custom properties defined in `index.css`:
```css
--color-bg
--color-primary
--color-border
--color-completed       /* text color for completed todos */
--color-filter-active   /* active filter button indicator */
```

---

## Inline Editing Detail

The trickiest piece. Here's the exact state flow:

```
User double-clicks label
  → TodoItem calls onStartEdit(todo.id)
  → App passes setEditingId as onStartEdit
  → editingId = "abc123"
  → TodoItem with id "abc123" receives isEditing={true}
  → useEffect([isEditing]) fires: reset editValue, focus input

User types...

User presses Enter
  → onKeyDown fires: calls onSaveEdit(id, editValue)
  → updateTodoText sets editingId = null (always, at end)
  → isEditing flips to false
  → onBlur fires: guard `if (!isEditing) return` prevents double-save

User presses Escape
  → onKeyDown fires: calls onCancelEdit()
  → App's onCancelEdit = () => setEditingId(null)
  → editValue is stale but harmless — reset next time editing starts
```

---

## Tradeoffs

| Decision | Why |
|---|---|
| `editingId` lives in `useTodos` (not `TodoItem`) | Ensures only one item edits at a time without sibling communication |
| `editValue` stays local in `TodoItem` | Avoids list re-renders on every keystroke |
| `src/App.tsx` is a re-export shim | Keeps `main.tsx` untouched; `components/App.tsx` is the real root |
| No CSS Modules | Overkill for a small app; global CSS with custom properties is sufficient |
| String union for `Filter` (not enum) | Avoids TypeScript enum footguns; plays better with strict mode |
| `createdAt: number` on `Todo` | Stable sort key — editing a todo doesn't change its position in the list |
