# Branch 08 — User Experience

**Branch:** `08-user-experience`  
**Previous branch:** `07-tool-calling`  
**Goal:** Auth flow works. Unauthenticated users are gated. CLI stores credentials locally. Server protects all routes.

---

## Files Added

### `packages/cli/src/lib/`

| File | What it does |
|---|---|
| `src/lib/auth.ts` | Local credential storage. Saves/reads auth tokens from `~/.nightcode/auth.json` with `0o600` file permissions (owner-only). Exports `saveAuth(token, userId)`, `getAuth()`, `clearAuth()`. Uses `Bun.file` and `Bun.write`. |
| `src/lib/oauth.ts` | Manages the CLI OAuth flow. Starts a temporary local HTTP server on a random port to receive the OAuth callback. Opens the browser to the Clerk OAuth URL. Waits for the callback, extracts `code` and `state`, exchanges for a JWT, saves via `auth.ts`. Exports `login()` — resolves with auth data on success. |

### `packages/server/src/lib/`

| File | What it does |
|---|---|
| `src/lib/auth.ts` | Server-side auth utilities. Verifies Clerk JWT using the Clerk SDK (`@clerk/backend`). Extracts `userId` from the verified token. Exports `verifyToken(token): Promise<{ userId }>`. |

### `packages/server/src/middleware/`

| File | What it does |
|---|---|
| `src/middleware/require-auth.ts` | Hono middleware. Reads `Authorization: Bearer <token>` header. Calls `verifyToken()`. On failure returns `401`. On success sets `c.set('userId', userId)` for use in route handlers. |

### `packages/server/src/routes/`

| File | What it does |
|---|---|
| `src/routes/auth.ts` | `GET /auth/callback` — OAuth callback handler. Reads `code` and `state` from query params. Decodes the `state` to extract the local redirect port. Redirects to `http://localhost:<port>/callback?code=...` so the CLI's local server can complete the flow. |

---

## Files Modified

| File | Change |
|---|---|
| `packages/server/src/index.ts` | Mounts `/auth` route. Applies `requireAuth` middleware to `/sessions` and `/chat` route groups. |
| `packages/server/src/routes/sessions.ts` | All handlers now read `userId` from `c.get('userId')` (set by middleware) instead of hardcoding. Queries are scoped to the authenticated user. |
| `packages/server/src/routes/chat.ts` | Protected by `requireAuth`. Passes `userId` through to session save. |
| `packages/cli/src/lib/api-client.ts` | Updated to inject `Authorization: Bearer <token>` header on every request using `getAuth()`. On receiving a `401` response, calls `clearAuth()` so stale tokens don't loop. |
| `packages/cli/src/screens/home.tsx` | On mount: calls `getAuth()`. If no credentials → shows a "Login" prompt and calls `oauth.login()`. On login success: re-renders to show the normal home screen. If credentials exist: shows session list as normal. |
| `packages/server/package.json` | Adds `@clerk/backend` dependency. |
| `packages/cli/package.json` | No new packages — `Bun.file`/`Bun.write` are built-in. |
| `.env.example` | Adds `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `CLERK_OAUTH_CLIENT_ID` to required vars. |

---

## Auth Flow

```
First run (no credentials):
  home.tsx detects no auth
    → show "Press Enter to login"
    → oauth.login()
      → start local HTTP server on random port (e.g. 51234)
      → open browser: https://clerk.com/oauth?redirect_uri=http://server/auth/callback&state=<port>
      → user logs in via browser
      → Clerk redirects to: GET /auth/callback?code=xxx&state=51234
      → server decodes state, redirects to: http://localhost:51234/callback?code=xxx
      → CLI's local server receives code
      → exchange code for JWT with Clerk
      → saveAuth(jwt, userId)
      → local server shuts down
    → home.tsx re-renders with sessions

Subsequent runs:
  home.tsx → getAuth() → token exists → proceed normally
  api-client injects Bearer token on every request
  server middleware verifies it
```

## Notes

- The OAuth `state` parameter carries the local callback port — this is how the browser's redirect finds its way back to the CLI process.
- `~/.nightcode/auth.json` is created with mode `0o600` so only the current Unix user can read it.
- `clearAuth()` is called automatically on any `401` response — forces re-login on next app start.
- Clerk handles user creation, sessions, and JWT signing — no custom user DB needed at this stage.
- The local OAuth server only runs for the duration of the login flow, then is shut down.
