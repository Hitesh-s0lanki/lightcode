# Branch 02 — UI Infrastructure

**Branch:** `02-ui-infrastructure`  
**Previous branch:** `01-project-setup-component-architecture`  
**Goal:** Theme system, toast notifications, dialog layer, and keyboard provider all wired into the app.

---

## Files Added

### Providers (new directory `src/providers/`)

| File | What it does |
|---|---|
| `src/providers/theme/index.tsx` | React context that holds the active theme object. Provides `useTheme()` hook. Reads initial theme from localStorage (or default). |
| `src/providers/toast/index.tsx` | React context for toast notifications. Provides `useToast()` hook with `show(message, type)`. Renders ephemeral toast messages overlaid on screen. Auto-dismisses after a timeout. |
| `src/providers/toast/types.ts` | TypeScript types: `Toast`, `ToastType` (`'info' \| 'warning' \| 'error' \| 'success'`). |
| `src/providers/dialog/index.tsx` | React context for the modal dialog layer. Provides `useDialog()` hook with `open(component)` and `close()`. Renders whatever component is passed to `open()` in a centered overlay. |
| `src/providers/dialog/types.ts` | TypeScript types: `DialogContext`, `DialogState`. |
| `src/providers/keyboard-layer/index.tsx` | Global keyboard event registry. Provides `useKeyboardLayer()` hook to register/unregister named key bindings. Dispatches keydown events to the correct handler based on current focus layer. |

### Components

| File | What it does |
|---|---|
| `src/components/dialog-search-list.tsx` | Reusable search+list dialog UI. Renders a text input and a scrollable filtered list. Used by theme picker and later by session/model/agent dialogs. Accepts `items`, `onSelect`, `onClose` props. |
| `src/components/dialogs/index.tsx` | Dialog registry — maps dialog names to their components. When `useDialog().open('theme')` is called, this decides which component to render. |
| `src/components/dialogs/theme-dialog.tsx` | Theme picker dialog. Uses `dialog-search-list` to show available themes. On selection calls `useTheme().setTheme()`. |

### Theme

| File | What it does |
|---|---|
| `src/theme.ts` | Defines all theme color tokens as TypeScript objects. Contains at least two themes (e.g. `dark`, `light`). Each theme object has keys like `background`, `foreground`, `border`, `accent`, `muted`, `error`, `success`. |

### Config

| File | What it does |
|---|---|
| `.vscode/settings.json` | VS Code workspace settings — typically sets `editor.formatOnSave`, TypeScript SDK path. |

---

## Files Modified

| File | Change |
|---|---|
| `src/index.tsx` | Wraps the app in all new providers: `ThemeProvider > KeyboardLayerProvider > ToastProvider > DialogProvider`. |
| `src/components/command-menu/commands.tsx` | Adds a working "Change Theme" command that calls `useDialog().open('theme')`. |

---

## Provider Nesting Order

```
ThemeProvider          ← outermost, theme tokens available to all
  KeyboardLayerProvider  ← keyboard registry available before any UI
    ToastProvider        ← toasts can be triggered from anywhere
      DialogProvider     ← dialogs sit on top of everything
        <App />
```

## Notes

- `dialog-search-list` is the backbone reusable component — it's reused in 4 different dialogs later (theme, sessions, models, agents).
- The keyboard layer provider is the source of truth for all keybindings — components register bindings on mount and unregister on unmount.
- Toast messages render at a fixed position in the terminal, overlaid on current content.
- Theme tokens are consumed via `useTheme()` in every component that needs colors — no hard-coded color strings anywhere else in the codebase.
