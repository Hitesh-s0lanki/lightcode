# Branch 03 — Routing & Screen Layout

**Branch:** `03-routing-screen-layout`  
**Previous branch:** `02-ui-infrastructure`  
**Goal:** Navigation between screens works. Home → New Session → Session view with message list structure in place.

---

## Files Added

### Layouts (new directory `src/layouts/`)

| File | What it does |
|---|---|
| `src/layouts/root-layout.tsx` | The persistent shell wrapping every screen. Renders Header at the top and StatusBar at the bottom. The middle region is a slot where the current screen renders. Also mounts CommandMenu as an overlay. |
| `src/layouts/themed-root.tsx` | Thin wrapper that reads the active theme from `useTheme()` and applies global terminal background/foreground colors via OpenTUI's root Box. Wraps `root-layout`. |

### Screens (new directory `src/screens/`)

| File | What it does |
|---|---|
| `src/screens/home.tsx` | The landing screen. Renders the Header and the InputBar. Pressing Enter on the InputBar navigates to `new-session` with the typed message as initial state. No session list yet (added in branch 06). |
| `src/screens/new-session.tsx` | Intermediate screen shown when creating a session. Captures mode (PLAN/BUILD) and model selection before starting. On confirm, navigates to `session` with the config. |
| `src/screens/session.tsx` | The main chat screen. Renders the message history via `<Messages>` and the InputBar. Stub at this stage — no real AI call yet, just renders hardcoded/empty message list. |

### Components

| File | What it does |
|---|---|
| `src/components/messages/index.tsx` | Container component for the scrollable message list. Renders a list of `Message` objects, delegating to `BotMessage`, `UserMessage`, or `ErrorMessage` based on role. Handles scroll position. |
| `src/components/messages/user-message.tsx` | Renders a single user message. Shows the message text with a distinct left-border accent color. |
| `src/components/messages/bot-message.tsx` | Renders a single assistant message. Parses markdown (bold, code blocks, lists) and renders with syntax highlighting using `marked`. Shows a spinner while streaming. |
| `src/components/messages/error-message.tsx` | Renders an error state message with error color styling. Used when a request fails. |
| `src/components/session-shell.tsx` | The layout wrapper specific to the session screen: positions message list above input bar, handles the height math for OpenTUI's fixed-height terminal. |
| `src/components/spinner.tsx` | Animated spinner component (cycles through `⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏` frames). Used in bot-message while waiting for response. |

---

## Files Modified

| File | Change |
|---|---|
| `src/index.tsx` | Replaces single-component render with a router. Uses OpenTUI's built-in route matching to render `home`, `new-session`, and `session` screens. Wraps everything in `ThemedRoot`. |

---

## Router Structure

OpenTUI's router is stack-based and driven by state. The route setup in `index.tsx` looks like:

```
/ → home.tsx
/new-session → new-session.tsx  (receives: initialMessage, mode, model)
/session/:id → session.tsx      (receives: sessionId, initialMessage, mode, model)
```

Navigation is done by calling the router's `push`/`replace` functions (from OpenTUI's `useRouter` hook) — no URL bar, purely in-memory.

## Notes

- `session-shell.tsx` does the height calculation for the message list: `totalHeight - inputBarHeight - headerHeight - statusBarHeight`.
- `bot-message.tsx` uses the `marked` package (already in the CLI's `node_modules` via OpenTUI) to render markdown.
- The spinner component uses a `setInterval` inside a `useEffect` to cycle frames — clean up the interval on unmount.
- At this stage the session screen is a shell: it renders the layout but `use-chat` hook doesn't exist yet (added in branch 05).
