# Branch 11 — The End (Production Ready)

**Branch:** `11-the-end`  
**Previous branch:** `10-client-side-tool-execution`  
**Goal:** CLI is installable as a global binary. Final polish, cleanup, and production readiness.

---

## Files Added

| File | What it does |
|---|---|
| `packages/cli/bin/nightcode` | The CLI executable entry point. A shell shebang script (`#!/usr/bin/env bun`) that calls `src/index.tsx`. This is what gets symlinked into `PATH` when the package is installed globally. No TypeScript — just a thin launcher. |

---

## Files Modified

| File | Change |
|---|---|
| `packages/cli/package.json` | Adds `"bin": { "nightcode": "./bin/nightcode" }` field so `bun install -g` (or `npm install -g`) registers the `nightcode` command globally. May also add a `"files"` field to control what's published to npm. |

---

## What "The End" Branch Represents

This branch is a final cleanup pass on top of branch 10. Beyond the `bin/` addition, it typically includes:

- **Code cleanup**: removing dead code, unused imports, console.logs left from development
- **Error handling audit**: ensuring all API errors surface as toasts rather than crashing
- **README update**: installation instructions (`bun install -g @lightcode/cli`), required env vars, quickstart
- **Environment validation**: server warns on startup if required env vars are missing
- **Final command list**: ensuring all command palette entries are correct and functional

---

## Installing the CLI Globally

```sh
# From the repo (development)
cd packages/cli
bun link                    # registers the package locally
bun link @lightcode/cli     # links it into your global bin

# Or install globally via npm registry (after publishing)
npm install -g @lightcode/cli

# Run
nightcode
```

## Complete File Tree (Final State)

```
packages/
  cli/
    bin/nightcode             ← NEW: global binary entry
    src/
      index.tsx               ← router + providers
      theme.ts
      components/
        border.tsx
        header.tsx
        input-bar.tsx
        spinner.tsx
        status-bar.tsx
        session-shell.tsx
        command-menu/         ← index, commands, types, filter, hook
        dialogs/              ← index, theme, sessions, models, agents
        messages/             ← index, user, bot, error
      hooks/
        use-chat.ts           ← full agentic loop + streaming
      layouts/
        root-layout.tsx
        themed-root.tsx
      lib/
        api-client.ts         ← typed HTTP client + auth injection
        auth.ts               ← local credential storage
        http-errors.ts        ← response error parser
        local-tools.ts        ← client-side tool execution
        oauth.ts              ← Clerk OAuth flow
        upgrade.ts            ← Polar checkout/portal opener
      providers/
        dialog/               ← modal overlay context
        keyboard-layer/       ← keybinding registry
        prompt-config/        ← mode + model context
        theme/                ← theme context
        toast/                ← notification context
      screens/
        home.tsx              ← session list + auth gate
        new-session.tsx       ← mode/model picker
        session.tsx           ← main chat view

  server/
    src/
      index.ts                ← Hono app + route mounts
      system-prompt.ts        ← dynamic system prompt builder
      lib/
        auth.ts               ← Clerk JWT verification
        credits.ts            ← token → credit converter
        models.ts             ← AI SDK model resolver
        polar.ts              ← Polar billing SDK wrapper
      middleware/
        require-auth.ts       ← JWT auth guard
        require-credits-balance.ts ← credit gate
      routes/
        auth.ts               ← OAuth callback
        billing.ts            ← checkout / portal / webhook
        chat.ts               ← streaming chat endpoint
        sessions.ts           ← session CRUD

  database/
    prisma/schema.prisma      ← Session model
    src/
      client.ts               ← Prisma singleton
      index.ts

  shared/
    src/
      index.ts
      models.ts               ← MODELS array + default
      schemas.ts              ← Zod schemas + tool lists
```

## End-to-End Feature Checklist

| Feature | Status |
|---|---|
| Terminal UI with OpenTUI | ✓ |
| Theme switching | ✓ |
| Toast notifications | ✓ |
| Dialog layer | ✓ |
| Keyboard bindings | ✓ |
| Screen routing | ✓ |
| Session list + resume | ✓ |
| AI streaming (Anthropic + OpenAI) | ✓ |
| Interrupt streaming with Esc | ✓ |
| PLAN / BUILD mode | ✓ |
| Model selection | ✓ |
| Tool calling (client-side) | ✓ |
| readFile / writeFile / editFile | ✓ |
| bash / glob / grep / listDirectory | ✓ |
| Clerk OAuth authentication | ✓ |
| Credit-based billing (Polar) | ✓ |
| Upgrade flow from CLI | ✓ |
| Global `nightcode` binary | ✓ |
