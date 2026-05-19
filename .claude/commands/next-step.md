You are implementing the next step of a React + TypeScript Todo app, one file at a time.

## Step 1 — Load full context

Read these three files completely before doing anything else:
- `CLAUDE.md` — coding rules, state ownership, file layout, the blur race condition guard
- `Architecture.md` — component tree, data flow diagram, hook contracts, CSS strategy, tradeoffs
- `TODO.md` — find the first unchecked item (`- [ ]`) inside the "Step-by-Step Build" section

## Step 2 — Identify the next step

The next step is the **first `- [ ]` checkbox** in the "Step-by-Step Build" section of `TODO.md`. Read its full description carefully. Do not skip ahead. Do not implement anything from future steps.

## Step 3 — Read existing files before writing

Before creating or editing any file, read it first if it exists. If it already has partial content:
- Understand what is already there
- Complete what is missing
- Fix anything that does not align with `Architecture.md` or `CLAUDE.md`
- Do not delete working code that is correct

## Step 4 — Implement the step

Implement every file the step requires. Follow these rules from `CLAUDE.md` strictly:
- No `any` — every value must be explicitly typed
- Every function and component must have an explicit return type
- No CSS frameworks — vanilla CSS only
- No `// @ts-ignore`
- No `enum` — use string union types
- State lives exactly where `Architecture.md` says it lives — do not lift or duplicate state differently

If the step includes a CSS file, create it alongside the component and import it correctly.

## Step 5 — Verify

After writing all files for this step, run:
```
npx tsc --noEmit
```

If there are type errors, fix them before continuing. Do not mark the step complete until `tsc` passes.

## Step 6 — Update TODO.md

Change the checkbox for the completed step from `- [ ]` to `- [x]` in `TODO.md`. Only mark the step you just finished — do not mark future steps.

## Step 7 — Report

Tell the user:
1. Which step was completed
2. Which files were created or modified (with relative paths)
3. A brief plain-English description of what the code does and how it fits into the app
4. What the next step will be (just name it — do not implement it)

## Rules you must never break

- Do not implement more than one step per run
- Do not add features, comments, or abstractions beyond what the step requires
- Do not refactor previous steps unless they have a type error
- If you are unsure about something, re-read `Architecture.md` before deciding
