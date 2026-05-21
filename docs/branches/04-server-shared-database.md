# Branch 04 — Server, Shared Package & Database

**Branch:** `04-server-shared-database`  
**Previous branch:** `03-routing-screen-layout`  
**Goal:** Hono server running, Prisma + Neon database connected, CLI can list/create sessions via API.

---

## Files Added

### Root

| File | What it does |
|---|---|
| `.env.example` | Template with all required env vars. At this stage: `DATABASE_URL` (Neon connection string), `API_URL` (server URL for CLI to call). |

### `packages/shared/` (new package)

| File | What it does |
|---|---|
| `package.json` | Package name `@lightcode/shared`. No runtime dependencies — pure types/schemas. |
| `tsconfig.json` | Extends root base config. |
| `src/index.ts` | Re-exports everything from `models.ts` and `schemas.ts`. |
| `src/models.ts` | Defines the `MODELS` constant — an array of supported AI model objects (`{ id, label, provider, tier }`). Default model is Claude Sonnet. Used by both CLI and server. |
| `src/schemas.ts` | Zod schemas for API request/response shapes. Defines `CreateSessionSchema`, `SendMessageSchema`. Also defines `PLAN_TOOLS` and `BUILD_TOOLS` arrays listing which tool names are allowed per mode. |

### `packages/database/` (new package)

| File | What it does |
|---|---|
| `package.json` | Package name `@lightcode/database`. Depends on `@prisma/client`, `prisma`. |
| `tsconfig.json` | Extends root base config. |
| `.gitignore` | Ignores generated Prisma client (`node_modules/.prisma`). |
| `prisma.config.ts` | Prisma config file. Sets `schema` path and `output` for generated client. |
| `prisma/schema.prisma` | Database schema. Models: **`Session`** (`id`, `userId`, `title`, `messages` JSON array, `createdAt`, `updatedAt`). Uses PostgreSQL provider with Neon connection string. |
| `src/client.ts` | Creates and exports the Prisma client singleton. Uses `new PrismaClient()`. |
| `src/enums.ts` | TypeScript enums shared with the rest of the app (e.g. `MessageRole.User`, `MessageRole.Assistant`). |
| `src/index.ts` | Re-exports `client` and `enums`. |

### `packages/server/` (new package)

| File | What it does |
|---|---|
| `package.json` | Package name `@lightcode/server`. Depends on `hono`, `@hono/zod-validator`, `@lightcode/database`, `@lightcode/shared`. |
| `tsconfig.json` | Extends root base config. |
| `src/index.ts` | Entry point. Creates a Hono app, mounts `/sessions` route, starts `Bun.serve()` on port 3000. Sets a long idle timeout (255s) to handle long-running LLM tool calls. |
| `src/routes/sessions.ts` | Session CRUD routes: `GET /sessions` (list all for userId), `GET /sessions/:id` (fetch one with messages), `POST /sessions` (create new with title). Uses Prisma client and Zod validation. |

### `packages/cli/src/lib/` (new directory)

| File | What it does |
|---|---|
| `src/lib/api-client.ts` | Typed HTTP client wrapping `fetch`. Reads `API_URL` from env. At this stage: plain fetch with no auth headers (auth added in branch 08). Exports typed functions: `getSessions()`, `getSession(id)`, `createSession(title)`. |
| `src/lib/http-errors.ts` | Helper that parses a non-OK `Response` and throws a typed error with status code and message. Used throughout the CLI to handle API failures. |

---

## Files Modified

| File | Change |
|---|---|
| `package.json` (root) | Adds `packages/database`, `packages/server`, `packages/shared` as workspace members. |
| `packages/cli/package.json` | Adds `@lightcode/shared` as a dependency. |

---

## Database Setup Steps

```sh
# Inside packages/database
bunx prisma init --datasource-provider postgresql
# Edit prisma/schema.prisma to add Session model
bunx prisma generate       # generates the Prisma client
bunx prisma migrate dev    # creates tables in Neon DB
```

## Prisma Schema (shape only)

```prisma
model Session {
  id        String   @id @default(cuid())
  userId    String
  title     String
  messages  Json     @default("[]")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@index([userId])
}
```

## Server Route Shape

```
GET  /sessions          → Session[]
GET  /sessions/:id      → Session (with messages)
POST /sessions          → Session  (body: { title: string })
```

## Notes

- `Bun.serve()` is used directly — no Express, no Fastify.
- Hono's `@hono/zod-validator` middleware validates request bodies inline with the route definition.
- The `messages` field in Prisma is a `Json` column — the server parses/serializes it on every read/write.
- The shared package is the single source of truth for types consumed by both CLI and server — never duplicate schemas.
- `packages/cli` calls the API using `API_URL` env var; this will be `http://localhost:3000` in development.
- No auth yet — userId is hardcoded or omitted at this stage.
