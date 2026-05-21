# Lightcode — Build Plan

A chapter-by-chapter roadmap for building Lightcode: an AI coding agent and CLI-based SaaS application, modeled after Claude Code.

---

## Chapter 1: Project Setup

**Goal:** Scaffold the monorepo and establish the CLI foundation.

### Tasks
- Initialize a Bun monorepo (`packages/` workspace layout)
- Create `packages/cli` with OpenTUI as the terminal rendering layer
- Wire up `bun run dev` with `--hot` for fast iteration
- Set up `packages/server` and `packages/shared` as empty stubs
- Configure `tsconfig.json` across all packages
- Add `.gitignore`, `CLAUDE.md`, and root `package.json` workspace config

### Key Decisions
- Runtime: **Bun** throughout — no Node.js, no npm
- TUI framework: **OpenTUI + React** bindings (`@opentui/react`)
- Monorepo: Bun workspaces (no Turborepo/Nx)

---

## Chapter 2: UI Infrastructure

**Goal:** Build reusable terminal UI primitives.

### Tasks
- **Toast notifications** — ephemeral status messages (info / warning / error)
- **Dialog component** — modal prompts with confirm/cancel keyboard handling
- **Theme system** — centralized color tokens, dark terminal palette
- **Keyboard interaction layer** — global keybinding registry, focus management
- **Layout primitives** — Box, Text, Divider components via OpenTUI

### Key Decisions
- All styling via theme tokens (no hard-coded colors anywhere else)
- Keyboard shortcuts declared in one place and dispatched via a context

---

## Chapter 3: Routing & Screen Layout

**Goal:** Implement navigation and establish the main screen skeletons.

### Tasks
- Define a client-side router for the TUI (stack-based or flat state machine)
- Screens to scaffold:
  - **Welcome / Login** screen
  - **Chat** screen (primary view)
  - **Session list** screen
  - **Settings** screen
- Persistent header/footer shell with shortcuts hint bar
- Keyboard nav between screens (`Tab`, arrow keys, `Esc` to go back)

---

## Chapter 4: Server, Shared Package & Database

**Goal:** Stand up the backend API, end-to-end types, and persistence layer.

### Tasks
- **`packages/server`** — Hono app with typed routes
  - `Bun.serve()` as the HTTP server (no Express)
  - Route groups: `/auth`, `/sessions`, `/chat`, `/billing`
- **`packages/shared`** — shared TypeScript types and Zod schemas consumed by both CLI and server
- **Database** — Prisma ORM + Neon (serverless PostgreSQL)
  - Schema: `User`, `Session`, `Message`, `UsageRecord`
  - Run migrations with `bunx prisma migrate dev`
- Wire `packages/cli` to call the server via `fetch`

### Key Decisions
- `Bun.sql` / Prisma for DB access (no `pg` directly)
- Shared package ensures CLI and server never drift on request/response shapes

---

## Chapter 5: Sentry Monitoring

**Goal:** Add error tracking and performance monitoring.

### Tasks
- Install and configure `@sentry/bun` on the server
- Install `@sentry/browser` (or equivalent) scoped to the CLI process
- Capture unhandled errors and promise rejections
- Add a performance transaction around AI chat requests
- Configure DSN via environment variable (`SENTRY_DSN`)

---

## Chapter 6: AI Chat Streaming

**Goal:** Real-time, interruptible AI responses with multi-provider support.

### Tasks
- Server-side streaming endpoint (`POST /chat`) using Server-Sent Events or chunked response
- Client streaming reader in the CLI — render tokens as they arrive
- **Interrupt support** — `Ctrl+C` cancels the in-flight stream cleanly
- Provider abstraction layer:
  - **Anthropic** (`claude-sonnet-4-6` default)
  - **OpenAI** (optional, toggled by config)
- Render markdown in the terminal (code blocks, bold, lists) using `marked`
- Handle stream errors gracefully with toast feedback

### Key Decisions
- Use the Anthropic Messages API with `stream: true`
- Provider selected per-session or per-user preference

---

## Chapter 7: Session Management

**Goal:** Persist, list, and resume chat sessions.

### Tasks
- Create a new session on first message; store in DB
- Session list screen pulls from `GET /sessions`
- Resume a session: load message history and replay context window
- Format timestamps with `date-fns` (`formatDistanceToNow`, `format`)
- Auto-title sessions from the first user message (via a quick LLM call)
- System prompt configuration per session (editable in Settings screen)

---

## Chapter 8: Tool Calling

**Goal:** Give the AI agentic capabilities to operate on the local filesystem and shell.

### Tasks
Implement the following tools as structured function calls:

| Tool | Description |
|---|---|
| `read_file` | Read a file by path |
| `write_file` | Create or overwrite a file |
| `edit_file` | Apply a targeted string replacement |
| `bash` | Run a shell command via `Bun.$` |
| `list_dir` | List directory contents |
| `search_files` | Grep/ripgrep across the codebase |

- Parse tool-use blocks from the Anthropic response stream
- Render tool calls in the TUI with a distinct UI (name, args, status)
- Show tool output inline in the chat thread
- Handle multi-turn tool loops (tool result → next model call) until final answer

### Key Decisions
- Tools execute **client-side** (in the CLI process) with full filesystem access
- User sees and can interrupt any tool execution

---

## Chapter 9: Completing the User Experience

**Goal:** Polish the end-to-end UX and wire up authentication.

### Tasks
- **File mention support** — type `@filename` to attach file content to the prompt
- **Auth flow** — email/password or OAuth login screen; JWT stored locally
- **System integration** — detect project root, auto-load `CLAUDE.md`-style context files
- **Error states** — graceful handling of network failures, auth expiry, rate limits
- **Onboarding flow** — first-run wizard that collects API keys and creates a user account
- Final keyboard shortcut audit and help overlay (`?` to open)

---

## Chapter 10: Usage-Based Billing

**Goal:** Credit-based billing so users can self-serve and upgrade from the CLI.

### Tasks
- Integrate **Polar** as the payment/billing provider
- Track token usage per message; write `UsageRecord` rows to DB
- Billing screen in the CLI: shows current credit balance and plan
- `POST /billing/upgrade` → redirect to Polar checkout URL, open in browser
- Webhook handler (`POST /webhooks/polar`) to credit accounts on successful payment
- Hard-stop when credits reach zero (with a clear upgrade prompt)
- Admin dashboard endpoint to view usage across users

---

## Chapter 11: Client-Side Tool Execution (Architecture Refinement)

**Goal:** Finalize the architecture for production — simplify and optimize tool execution.

### Tasks
- Migrate all tool execution fully client-side (remove any server-proxied tool calls)
- Refactor the chat loop: single responsibility per function, remove dead code paths
- Validate the tool permission model (user must approve destructive operations)
- End-to-end test of the full agentic loop: user prompt → tool calls → final answer
- Performance pass: reduce startup time, lazy-load heavy modules
- Final code review and cleanup before release
- Update `README.md` with installation and usage instructions

---

## Milestone Summary

| Chapter | Milestone |
|---|---|
| 1 | Monorepo boots, CLI renders "Hello World" in the terminal |
| 2 | All UI primitives working with keyboard interaction |
| 3 | Navigation between screens works |
| 4 | Server running, DB connected, CLI can call API |
| 5 | Errors reported to Sentry from both CLI and server |
| 6 | Streaming chat works end-to-end with Anthropic |
| 7 | Sessions persist and can be resumed |
| 8 | AI can read/write files and run bash commands |
| 9 | Auth, file mentions, and onboarding complete |
| 10 | Credits deducted per message, upgrade flow works |
| 11 | Production-ready: clean architecture, full tool loop |
