# TODO.md — Week 1 Project Checklist

Track every requirement from the spec. Check off items as they are completed and verified.

---

## Setup

- [x] Vite + React + TypeScript project is scaffolded
- [x] `tsconfig.app.json` has `"strict": true` enabled
- [x] `npx tsc --noEmit` passes with zero errors on an empty project
- [x] `npm run dev` starts the dev server without errors

---

## Step-by-Step Build

### Step 0 — TypeScript strict mode
- [x] `"strict": true` added to `tsconfig.app.json`

### Step 1 — Type definitions (`src/types/todo.ts`)
- [x] `Todo` interface defined (`id`, `text`, `completed`, `createdAt`)
- [x] `Filter` type defined as `'all' | 'active' | 'completed'`

### Step 2 — `useLocalStorage<T>` hook
- [x] Generic hook exported from `src/hooks/useLocalStorageTodos.ts`
- [x] Lazy `useState` initializer reads from localStorage
- [x] `useEffect` syncs value to localStorage on change
- [x] Both read and write wrapped in `try/catch`
- [x] Returns `[T, Dispatch<SetStateAction<T>>]` tuple

### Step 3 — `useTodos` hook
- [x] Uses `useLocalStorage` for `todos` persistence
- [x] `addTodo` — creates todo with UUID + timestamp, guards empty text
- [x] `toggleTodo` — flips `completed`
- [x] `deleteTodo` — removes by id, resets `editingId` if needed
- [x] `updateTodoText` — saves edit or deletes if text is empty; always resets `editingId`
- [x] `clearCompleted` — removes all completed todos
- [x] `filteredTodos` — memoized, filtered by `activeFilter`
- [x] `activeCount` and `completedCount` — memoized
- [x] `editingId` state lifted here (not in components)

### Step 4 — Rewrite `src/index.css`
- [x] Vite boilerplate styles removed
- [x] Box-sizing reset applied
- [x] CSS custom property tokens defined
- [x] `body` and `#root` base styles set

### Step 5 — `TodoInput` component
- [x] Renders a controlled `<input>`
- [x] Adds todo on Enter key press
- [x] Clears input after adding
- [x] Does not add empty/whitespace-only todos

### Step 6 — `TodoItem` component
- [ ] Shows checkbox (toggle), text label, delete button
- [ ] Completed todos show strikethrough text
- [ ] Double-click on label starts inline edit
- [ ] Edit input pre-filled with current text and auto-focused
- [ ] Enter saves the edit
- [ ] Escape cancels the edit
- [ ] Blur saves the edit (with race condition guard)
- [ ] Saving empty text deletes the todo instead

### Step 7 — `TodoList` component
- [ ] Renders list of `TodoItem` components
- [ ] Passes `isEditing={editingId === todo.id}` to each item
- [ ] Shows empty state message when filtered list is empty

### Step 8 — `TodoFilters` component
- [ ] Three filter buttons: All / Active / Completed
- [ ] Active filter button is visually highlighted
- [ ] Counter shows "N item(s) left" with correct pluralization
- [ ] "Clear completed" button only shows when completed todos exist

### Step 9 — Layout styles (`src/styles/app.css`)
- [ ] App centered, max-width ~550px
- [ ] Card-style container with shadow

### Step 10 — `components/App.tsx` full wiring
- [ ] Calls `useTodos()` and passes all props/callbacks down
- [ ] All CSS files imported here
- [ ] Footer hidden when todo list is empty

### Step 11 — `src/App.tsx` re-export shim
- [ ] Replaced with `export { default } from './components/App'`
- [ ] Old `App.css` import removed
- [ ] `App.css` file deleted

---

## Acceptance Criteria (from Spec)

- [ ] App scaffolded with Vite + React + TypeScript template
- [ ] All CRUD operations work end-to-end (add, toggle, edit, delete)
- [ ] Filter view (All / Active / Completed) works correctly
- [ ] Todos persist across full page reload
- [ ] At least one custom hook used (named meaningfully) → `useTodos` + `useLocalStorage`
- [ ] State for the todo list lives at the appropriate level (lifted, not duplicated)
- [ ] At least 3 distinct components, each single-responsibility → `TodoInput`, `TodoItem`, `TodoList`, `TodoFilters`
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] No `any` anywhere in the codebase

---

## Final Verification

- [ ] `npx tsc --noEmit` → 0 errors
- [ ] `npm run lint` → 0 warnings
- [ ] Add a todo → reload page → todo still there
- [ ] Toggle works, counter updates
- [ ] Inline edit: double-click → type → Enter saves
- [ ] Inline edit: Escape cancels
- [ ] Inline edit: click away (blur) saves
- [ ] Delete removes the todo
- [ ] Filter "Active" shows only incomplete todos
- [ ] Filter "Completed" shows only completed todos
- [ ] "Clear completed" removes all completed in one click
- [ ] Empty state shown when no todos match current filter
- [ ] "1 item left" (singular) vs "2 items left" (plural)

---

## Stretch Goals (Optional — Not Required for Submission)

- [ ] Keyboard navigation between todos
- [ ] "Toggle all" checkbox (mark all complete/incomplete at once)
- [ ] Drag to reorder todos
- [ ] Due dates on todos
- [ ] Dark mode toggle
- [ ] Animations on add/remove

---

## PR Submission Checklist

- [ ] Branch created and pushed to assigned GitHub repo
- [ ] PR description includes:
  - [ ] Short summary of what was built
  - [ ] Architecture note (component tree + custom hooks and why)
  - [ ] Tradeoffs and shortcuts taken
