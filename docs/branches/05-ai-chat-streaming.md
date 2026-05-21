# Branch 05 — AI Chat Streaming

**Branch:** `05-ai-chat-streamiing`  
**Previous branch:** `04-server-shared-database`  
**Goal:** Real-time streaming chat with Anthropic/OpenAI works end-to-end. User types → tokens stream → response renders incrementally.

---

## Files Added

### `packages/cli/src/hooks/`

| File | What it does |
|---|---|
| `src/hooks/use-chat.ts` | Central React hook for all chat state and streaming. Manages: message history array, streaming status, abort controller for interruption. Exposes `sendMessage(text)` and `abort()`. On `sendMessage`: appends user message locally, calls `POST /chat` with full history, reads the SSE/chunked stream, appends tokens to the last assistant message in state as they arrive. On abort: calls `abortController.abort()` to cancel the in-flight request. |

### `packages/server/src/lib/`

| File | What it does |
|---|---|
| `src/lib/models.ts` | Model resolver. Takes a model ID string (from `@lightcode/shared`'s MODELS list) and returns a configured AI SDK provider instance. For Anthropic models: uses `@ai-sdk/anthropic` with optional extended thinking. For OpenAI models: uses `@ai-sdk/openai` with reasoning enabled. |

### `packages/server/src/routes/`

| File | What it does |
|---|---|
| `src/routes/chat.ts` | `POST /chat` streaming endpoint. Accepts `{ messages, sessionId, model, mode }`. Merges incoming messages with the stored session messages from DB. Calls `streamText()` from the AI SDK with the resolved model. Pipes the text stream back as a chunked HTTP response. Saves the completed assistant message to the session in DB after streaming finishes. |

---

## Files Modified

| File | Change |
|---|---|
| `packages/server/package.json` | Adds `ai` (AI SDK core), `@ai-sdk/anthropic`, `@ai-sdk/openai` as dependencies. |
| `packages/server/src/index.ts` | Mounts the new `chat` route at `/chat`. |
| `packages/cli/package.json` | Adds `marked` dependency (for markdown rendering in `bot-message`). |
| `packages/cli/src/screens/session.tsx` | Wires up `use-chat` hook. Passes `sendMessage` to InputBar's `onSubmit`. Passes message list and streaming status to the `<Messages>` component. Registers `Esc` key with keyboard layer to call `abort()`. |
| `packages/cli/src/lib/api-client.ts` | Adds `streamChat(payload)` function that calls `POST /chat` and returns the raw `Response` for stream reading. |

---

## Streaming Architecture

```
CLI (use-chat.ts)                       Server (chat.ts)
─────────────────                       ──────────────────
sendMessage(text)
  → POST /chat                    →     merge messages + session history
    { messages, sessionId,              streamText(model, messages)
      model, mode }                       ↓ token chunks
                                    ←   chunked HTTP response
  read stream chunks
  append tokens to last message
  re-render on each chunk
                                          stream ends
                                          save assistant message to DB
```

## Key Implementation Details

- **AI SDK** (`ai` package): use `streamText()` for streaming, not `generateText()`. It returns an async iterable of text deltas.
- **Server streaming**: use Hono's `streamText()` helper or manually create a `ReadableStream` and return `new Response(stream, { headers: { 'Content-Type': 'text/plain' } })`.
- **Client reading**: in `use-chat.ts`, use `response.body.getReader()` and `reader.read()` in a loop to accumulate chunks.
- **Abort**: pass `signal: abortController.signal` to the `fetch` call; the same signal is passed into the AI SDK's `streamText` call on the server via request context.
- **State update**: each chunk triggers a `setState` call that replaces the last message's `content` with `prev + delta` — React batches these efficiently.

## Model Provider Config

```ts
// Anthropic (claude-* models)
import { anthropic } from '@ai-sdk/anthropic'
const model = anthropic('claude-sonnet-4-6', { thinking: { ... } })

// OpenAI (gpt-* models)
import { openai } from '@ai-sdk/openai'
const model = openai('gpt-4o', { reasoningEffort: 'high' })
```

## Environment Variables Added

```
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
```

## Notes

- No tool calling yet — `streamText` is called with only `messages` and `model`. System prompt is also absent at this stage.
- Session messages are merged on the server: the stored `messages` from DB are prepended to the incoming `messages`, so the full history is always sent to the model.
- The `mode` parameter is passed through but not yet used (used in branch 07 for tool selection).
