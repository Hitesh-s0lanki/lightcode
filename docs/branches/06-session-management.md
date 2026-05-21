# Branch 06 — Session Management & Config

**Branch:** `06-session-management-config`  
**Previous branch:** `05-ai-chat-streamiing`  
**Goal:** Sessions persist and can be resumed. Model and mode are selectable per-session. Session list, agents dialog, and models dialog are all wired up.

---

## Files Added

### Providers

| File | What it does |
|---|---|
| `src/providers/prompt-config/index.tsx` | React context that holds the active **mode** (`PLAN` or `BUILD`) and active **model** (one of the MODELS from `@lightcode/shared`). Exposes `usePromptConfig()` hook with `mode`, `model`, `setMode()`, `setModel()`. Persisted to localStorage so settings survive restarts. |

### Dialogs

| File | What it does |
|---|---|
| `src/components/dialogs/sessions-dialog.tsx` | Shows a searchable list of past sessions fetched from `GET /sessions`. Each item shows session title and relative timestamp (using `date-fns` `formatDistanceToNow`). Selecting one calls the router's `push` to navigate to `/session/:id`. |
| `src/components/dialogs/models-dialog.tsx` | Shows a searchable list of models from `MODELS` (shared package). Each item shows model label and provider. Selecting one calls `usePromptConfig().setModel()`. |
| `src/components/dialogs/agents-dialog.tsx` | Shows PLAN vs BUILD mode selection with descriptions. Selecting one calls `usePromptConfig().setMode()`. Renamed "agents" in the UI to surface the concept of agentic BUILD mode vs read-only PLAN mode. |

---

## Files Modified

| File | Change |
|---|---|
| `src/components/dialogs/index.tsx` | Registers the three new dialogs: `sessions`, `models`, `agents`. Routes `useDialog().open('sessions')` etc. to the correct component. |
| `src/components/command-menu/commands.tsx` | Adds three new working commands: "Switch Session" (`open('sessions')`), "Switch Model" (`open('models')`), "Switch Mode" (`open('agents')`). |
| `src/screens/home.tsx` | Displays session list fetched from API using `getSessions()`. Each session is keyboard-navigable. Pressing Enter on a session navigates to `/session/:id` directly (skips new-session screen). Pressing Enter on the InputBar still creates a new session. |
| `src/screens/new-session.tsx` | Reads defaults from `usePromptConfig()` for pre-selected mode and model. Lets user change them inline before creating the session. |
| `src/screens/session.tsx` | Reads `mode` and `model` from `usePromptConfig()` and passes them to `use-chat`. Also loads existing session from `GET /sessions/:id` on mount (for resumed sessions), initialising the message history from DB. |
| `src/hooks/use-chat.ts` | Updated to accept `sessionId` and pass it in the `POST /chat` body. On first message in a new session, calls `createSession()` and stores the returned ID. |
| `packages/cli/package.json` | Adds `date-fns` dependency. |

---

## Session Resume Flow

```
home.tsx: user selects past session
  → router.push('/session/cuid123')

session.tsx: on mount
  → getSession('cuid123') via api-client
  → set message history from session.messages
  → subsequent sendMessage calls include sessionId
  → server merges with DB history automatically
```

## New Session Creation Flow

```
home.tsx: user types message, presses Enter
  → router.push('/new-session', { initialMessage })

new-session.tsx: user picks mode + model
  → router.push('/session/new', { initialMessage, mode, model })

session.tsx: on first sendMessage
  → createSession(title) → gets sessionId
  → all subsequent messages reference that sessionId
```

## PromptConfig Context Shape

```ts
{
  mode: 'PLAN' | 'BUILD'
  model: Model  // from @lightcode/shared MODELS
  setMode: (mode) => void
  setModel: (model) => void
}
```

## Notes

- `date-fns` `formatDistanceToNow` is used in `sessions-dialog` to show "2 hours ago" style labels.
- The `agents-dialog` naming is intentional: "PLAN" = read-only analysis mode, "BUILD" = full agentic mode with destructive tools. The word "agents" signals to users they're choosing the AI's capability level.
- `usePromptConfig` persists to localStorage so switching terminal tabs doesn't reset your model selection.
- Sessions are not auto-titled at this stage — title comes from the first message text, truncated to ~50 chars, set when `createSession()` is called.
