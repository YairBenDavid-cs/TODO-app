## Final Description 

### Summary
Built a multi-card todo app where each card is an independent, filterable todo list. Users can create and title cards, add/edit/delete/complete todos within each card, filter per card, reorder todos via drag-and-drop, and all card+todo data persists across page reloads via localStorage.

### Component Tree
```
App (useCards)
├── CardCreator
└── CardGrid
    └── NoteCard[] (useCardTodos)
        ├── TodoInput        ← add new todos
        ├── TodoList
        │   └── TodoItem[]  ← toggle / inline edit / delete / drag
        └── TodoFilters      ← filter tabs + counter + clear completed
```

### Custom Hooks

**`useLocalStorage<T>`** — generic persistence layer. A drop-in replacement for `useState` that syncs to localStorage on every state change. It's generic so it can persist any type without duplication cards, todos, or future data.

**`useCards`** — owns card-level state and card CRUD operations (add, delete, update title, update todos). Lives at the App level because cards are global, the only state that needs to exist above a single card.

**`useCardTodos(cardId, todos, onUpdate)`** — owns all todo business logic for one card: add, toggle, delete, edit, filter, reorder. Lives inside `NoteCard`, not App, because each card's todos are independent. When todos change, it calls `onUpdate` to bubble up to `useCards`, which persists via `useLocalStorage`.

**Why three hooks ?** Single responsibility. Each hook owns one layer of concern. `useLocalStorage` doesn't know what a card is. `useCards` doesn't know what a filter is. `useCardTodos` doesn't know how persistence works.

### What Gets Persisted vs. What Stays Ephemeral

Only data that should survive a page reload is persisted to localStorage: the cards array and all their todos. UI interaction state which todo is being edited (`editingId`), which filter tab is active (`activeFilter`), drag indices is ephemeral React state. Losing it on reload is correct behavior, not a gap.

### Component Separation

`TodoInput`, `TodoItem`, `TodoList`, and `TodoFilters` are separate components for two reasons:
1. **Single responsibility** — each component owns exactly one job
2. **Render isolation** — typing in `TodoInput` (local state) does not re-render `TodoList` or `TodoFilters`, since they receive no props that change during input

### Tradeoffs

| Decision | Why | Cost |
|---|---|---|
| Filter state lives per-card (not global) | Cards are independent filtering one must not affect others | No cross-card filter view possible |
| No Context API or Redux | Props + hooks keep data flow explicit and traceable | Prop drilling through NoteCard → TodoList → TodoItem |
| Drag only works in 'all' filter | Reordering in a filtered view would produce confusing results (items disappear mid-drag) | User can't reorder while a filter is active |
