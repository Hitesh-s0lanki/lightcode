# Branch 10 — Client-Side Tool Execution

**Branch:** `10-client-side-tool-execution`  
**Previous branch:** `09-billing`  
**Goal:** Tools execute in the CLI process (with local filesystem access), not on the server. Server-side tool files are removed. Chat loop is simplified.

---

## Files Added

### `packages/cli/src/lib/`

| File | What it does |
|---|---|
| `src/lib/local-tools.ts` | All tool implementations, now running in the CLI process. Implements: `readFile`, `writeFile`, `editFile`, `bash`, `listDirectory`, `glob`, `grep`. Uses `Bun.file`, `Bun.write`, `Bun.$` directly — accessing the user's local filesystem. Enforces PLAN/BUILD mode restrictions: throws if a write/edit/bash tool is called in PLAN mode. Applies a max file size limit (~100KB) on reads. Exports `executeLocalTool(toolName, args, mode)`. |

---

## Files Removed

| File | Why removed |
|---|---|
| `packages/server/src/tools/bash.ts` | Tool execution moved to CLI |
| `packages/server/src/tools/edit-file.ts` | Tool execution moved to CLI |
| `packages/server/src/tools/glob.ts` | Tool execution moved to CLI |
| `packages/server/src/tools/grep.ts` | Tool execution moved to CLI |
| `packages/server/src/tools/index.ts` | Tool execution moved to CLI |
| `packages/server/src/tools/list-directory.ts` | Tool execution moved to CLI |
| `packages/server/src/tools/read-file.ts` | Tool execution moved to CLI |
| `packages/server/src/tools/write-file.ts` | Tool execution moved to CLI |
| `packages/database/src/enums.ts` | Enums consolidated or inlined; no longer needed as a separate file |

---

## Files Modified

### Server

| File | Change |
|---|---|
| `packages/server/src/routes/chat.ts` | Major simplification. No longer passes `tools` to `streamText()` or runs a tool loop. Instead: passes `tools` as **definitions only** (schema + description, no execute function) so the model still knows which tools exist and can emit tool-call blocks. Returns tool-call blocks to the client as part of the stream alongside text deltas. Does **not** execute tools. |
| `packages/server/src/index.ts` | Removes the `idleTimeout: 255` — no longer needed since the server doesn't wait for tool execution. |

### CLI

| File | Change |
|---|---|
| `packages/cli/src/hooks/use-chat.ts` | The **major change** of this branch. Now implements the full agentic tool loop client-side: stream from server → detect tool-call blocks in stream → call `executeLocalTool()` → append tool-result messages → send back to server with updated history → repeat until no more tool calls. Also handles mode-restricted tool errors gracefully (shows error in chat). |
| `packages/cli/src/lib/api-client.ts` | `streamChat()` updated to accept and send `toolResults` in subsequent requests (for the multi-turn tool loop). |
| `packages/database/src/index.ts` | No longer re-exports `enums`. |

---

## Architecture Before vs After

### Before (Branch 09 — server-side tools)

```
CLI                          Server
───                          ──────
send message         →       streamText(model, messages, tools: with execute fns)
                               ↓ tool loop runs on server
                               ↓ tools access server filesystem (not user's!)
stream text back     ←       final response
```

### After (Branch 10 — client-side tools)

```
CLI                          Server
───                          ──────
send message         →       streamText(model, messages, tools: definitions only)
                             ←  stream: text deltas + tool-call blocks
detect tool-call
executeLocalTool()             ← runs in CLI, accesses USER'S filesystem
send message + toolResults  →  streamText(model, messages + results)
                             ←  stream: more text/tool-calls or stop
... loop until stop
```

## Why This Matters

- Server-side tools accessed the **server's** filesystem — useless for a local coding agent
- Client-side tools access the **user's** local project files — the whole point of the app
- Simpler server: no more long-running tool loops, no idle timeout hack
- CLI handles retries, aborts, and mode enforcement locally with full context

## Tool Execution in `local-tools.ts`

```ts
executeLocalTool(name, args, mode):
  if mode === 'PLAN' && isDestructiveTool(name):
    throw new Error('Tool not available in PLAN mode')
  
  switch name:
    'readFile'      → Bun.file(args.path).text()
    'writeFile'     → Bun.write(args.path, args.content)
    'editFile'      → read → replace → write (error if oldString not found)
    'bash'          → Bun.$`${args.command}` with timeout
    'listDirectory' → readdir + stat
    'glob'          → new Bun.Glob(args.pattern).scan()
    'grep'          → glob files → search lines
```

## Notes

- The server still sends tool **definitions** to the model (so the model knows what tools it can call) but `execute` functions are omitted from the server's `tool()` definitions.
- `use-chat.ts` is now the central orchestrator of the entire agentic loop — most complexity lives in the CLI.
- Tool results are included in the message history sent back to the server on each turn of the loop.
- `Esc` to abort still works — `abortController.abort()` cancels the current server fetch at any point in the loop.
