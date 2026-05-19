# CLAUDE.md — Todo App Project Guide

@Architecture.md
@TODO.md

## Project Overview

A single-page Todo app built with **React 19 + TypeScript 6 + Vite**. No backend, no CSS framework, no Redux. State lives in localStorage via a custom hook.

---

## Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 19.x | UI rendering |
| TypeScript | 6.x | Type safety (strict mode) |
| Vite | 8.x | Dev server + build |
| ESLint | 9.x | Lint enforcement |

---

## Key Commands

```bash
cd todo-app
npm run dev          # start dev server
npm run build        # production build
npm run lint         # run ESLint
npx tsc --noEmit     # type-check without emitting (run this before every commit)
```

---

## Folder Layout

```
todo-app/
├── src/
│   ├── main.tsx                  # React entry point — do not touch
│   ├── App.tsx                   # Re-export shim → ./components/App
│   ├── index.css                 # Global reset + CSS custom properties
│   ├── types/
│   │   └── todo.ts               # Todo interface + Filter type
│   ├── hooks/
│   │   ├── useLocalStorageTodos.ts  # Generic useLocalStorage<T> hook
│   │   └── useTodos.ts              # All business logic (CRUD, filter, editing)
│   ├── components/
│   │   ├── App.tsx               # Root component — wires hooks to UI
│   │   ├── TodoInput.tsx         # Controlled input, Enter to add
│   │   ├── TodoList.tsx          # Filtered list + empty state
│   │   ├── TodoItem.tsx          # Single todo row (toggle/edit/delete)
│   │   └── TodoFilters.tsx       # Filter tabs + counter + clear button
│   └── styles/
│       ├── app.css
│       ├── todo-input.css
│       ├── todo-list.css
│       ├── todo-item.css
│       └── todo-filters.css
```

---

## Coding Rules (Non-Negotiable)

- **No `any`** — TypeScript strict mode is on. Every value must be typed.
- **Explicit return types** — every function and component must declare its return type.
- **No CSS frameworks** — vanilla CSS with custom properties only.
- **No Redux / Zustand / external state** — React state + custom hooks only.
- **No `enum`** — use string union types instead (`type Filter = 'all' | 'active' | 'completed'`).
- **No `// @ts-ignore`** — fix the real type error instead.
- **Imports always use explicit paths** — never rely on index barrel files.

---

## Where State Lives

| State | Owner | Why |
|---|---|---|
| `todos[]` | `useLocalStorage` inside `useTodos` | Persisted to localStorage |
| `activeFilter` | `useTodos` | Shared across filter buttons and list |
| `editingId` | `useTodos` | Lifted so only one item edits at a time |
| `inputValue` | `TodoInput` (local) | Transient — not needed outside this component |
| `editValue` | `TodoItem` (local) | Transient — only committed on save |

---

## Inline Editing — Blur Race Condition

When the user presses **Enter** inside an edit input:
1. `onKeyDown` fires → calls `onSaveEdit` → parent sets `editingId = null` → `isEditing = false`
2. `onBlur` fires immediately after (Enter causes a blur)

**Guard required in `onBlur`:** `if (!isEditing) return;`
Without this, the save fires twice — the second save runs on a stale `editValue`.

---

## CSS Import Strategy

All CSS files are imported in `src/components/App.tsx` — single import point. Do not scatter CSS imports across components; it makes it hard to track what's loaded.

---

## Verification Before Submitting

```bash
npx tsc --noEmit   # must show 0 errors
npm run lint       # must show 0 warnings
```

Manual checks:
- Add a todo → reload → it persists
- Toggle / edit (double-click) / delete all work
- Filters All / Active / Completed show correct subsets
- "Clear completed" only appears when completed todos exist
- Counter pluralizes correctly ("1 item left" vs "2 items left")
- Empty state shows when filtered list is empty

---

---

# Mistakes Log

> This section is a living record. Every time something goes wrong during development — a type error, a logic bug, a wrong assumption — log it here with: what happened, why it happened, and the rule to follow going forward.

---

## [TEMPLATE — copy this block for each new entry]

### Mistake: [short title]
- **What happened:** [describe the symptom]
- **Why it happened:** [root cause]
- **Rule going forward:** [concrete behavioral change to prevent recurrence]

---

## Logged Mistakes

### Mistake: Empty catch block triggers ESLint no-empty
- **What happened:** `catch {}` in `useLocalStorage` write path passed `tsc` but failed `npm run lint` with `no-empty`.
- **Why it happened:** An intentionally swallowed error (localStorage quota / private browsing) was written as a bare empty block, which ESLint's `no-empty` rule rejects even when the intent is deliberate.
- **Rule going forward:** Never write a bare `catch {}`. Always place at least a short comment inside — `catch { /* reason */ }` — so ESLint's `no-empty` rule is satisfied and the intent is clear.

---
