# Branch 01 — Project Setup & Component Architecture

**Branch:** `01-project-setup-component-architecture`  
**Starting from:** empty repo  
**Goal:** Monorepo boots, CLI renders a shell in the terminal with a command menu wired up.

---

## Files Created

### Root

| File | What it does |
|---|---|
| `package.json` | Bun workspace root. Declares `packages/*` as workspaces. No shared scripts yet. |
| `tsconfig.base.json` | Base TypeScript config inherited by all packages. Sets `moduleResolution: bundler`, `jsx: react-jsx`, strict mode. |
| `.gitignore` | Ignores `node_modules`, `.env`, `dist`. |
| `bun.lock` | Lockfile generated after first `bun install`. |

### `packages/cli/`

| File | What it does |
|---|---|
| `package.json` | CLI package config. Entry: `src/index.tsx`. Depends on `@opentui/core`, `@opentui/react`, `react`. Dev script: `bun run --watch src/index.tsx`. |
| `tsconfig.json` | Extends `../../tsconfig.base.json`. Includes `src/**/*`. |
| `src/index.tsx` | App entry point. Initializes OpenTUI renderer, mounts the root component at 60 FPS. At this stage renders a single full-screen view with Header, InputBar, StatusBar, and CommandMenu. |
| `src/components/header.tsx` | Top bar component. Renders app name and current working directory. |
| `src/components/input-bar.tsx` | Bottom input component. Captures keystrokes, handles multi-line input, emits on Enter. |
| `src/components/status-bar.tsx` | Very bottom bar showing keyboard hint labels (e.g. `Ctrl+K` to open menu). |
| `src/components/border.tsx` | Utility component that draws a single-character border line (horizontal or vertical) using OpenTUI Box. |
| `src/components/command-menu/index.tsx` | The command palette overlay. Renders a filtered list of commands. Opened with `Ctrl+K`, closed with `Esc`. |
| `src/components/command-menu/commands.tsx` | Declares the static list of available commands (objects with `id`, `label`, `description`, `action`). No commands do anything real yet. |
| `src/components/command-menu/types.ts` | TypeScript types: `Command`, `CommandGroup`. |
| `src/components/command-menu/filter-commands.ts` | Pure function: takes a query string and command list, returns fuzzy-filtered results. |
| `src/components/command-menu/use-command-menu.ts` | React hook: manages open/close state, current query, filtered results, and selected index. |

---

## Key Setup Steps

1. `bun init` at repo root, then edit `package.json` to add `"workspaces": ["packages/*"]`
2. `mkdir packages/cli && cd packages/cli && bun init`
3. `bun add @opentui/core @opentui/react react` inside `packages/cli`
4. Create `tsconfig.base.json` at root, `tsconfig.json` in `packages/cli` extending it
5. Run `bun run dev` from `packages/cli` — terminal should render the UI shell

## Notes

- OpenTUI uses a React reconciler that renders to the terminal instead of the DOM — component APIs look identical to React.
- `src/index.tsx` calls `@opentui/core`'s render function (not `ReactDOM.createRoot`).
- The command menu is purely presentational at this stage — actions are stubs.
- No routing, no providers, no theme yet.
