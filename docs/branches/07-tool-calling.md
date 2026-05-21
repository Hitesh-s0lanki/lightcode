# Branch 07 — Tool Calling

**Branch:** `07-tool-calling`  
**Previous branch:** `06-session-management-config`  
**Goal:** The AI can read/write files and run bash commands. Tool calls appear in the chat UI. The agentic loop runs until the model produces a final text response.

---

## Files Added

### `packages/server/src/tools/` (new directory)

| File | What it does |
|---|---|
| `src/tools/index.ts` | Exports two tool sets: `PLAN_TOOLS` (read-only) and `BUILD_TOOLS` (includes all). Each is a record of tool name → AI SDK `tool()` definition with `description`, `parameters` (Zod schema), and `execute` function. |
| `src/tools/read-file.ts` | `readFile` tool. Parameter: `path` (string). Reads file content using `Bun.file(path).text()`. Returns file contents as string. Enforces a max size limit (~100KB). |
| `src/tools/write-file.ts` | `writeFile` tool. Parameters: `path`, `content`. Writes content to disk using `Bun.write(path, content)`. Creates directories if needed. BUILD mode only. |
| `src/tools/edit-file.ts` | `editFile` tool. Parameters: `path`, `oldString`, `newString`. Reads file, replaces first occurrence of `oldString` with `newString`, writes back. Errors if `oldString` not found. BUILD mode only. |
| `src/tools/bash.ts` | `bash` tool. Parameter: `command` (string). Runs the command via `Bun.$` with a timeout. Returns stdout + stderr. BUILD mode only. |
| `src/tools/list-directory.ts` | `listDirectory` tool. Parameter: `path`. Returns a formatted directory listing (files and subdirs). |
| `src/tools/glob.ts` | `glob` tool. Parameter: `pattern`. Uses `Bun.Glob` to match files. Returns array of matching paths. |
| `src/tools/grep.ts` | `grep` tool. Parameters: `pattern`, `path`. Searches files matching `path` glob for lines matching `pattern` regex. Returns matching lines with file:line context. |

### `packages/server/src/`

| File | What it does |
|---|---|
| `src/system-prompt.ts` | Builds the system prompt string dynamically based on mode. In PLAN mode: instructs the model it can only read files and analyze. In BUILD mode: instructs the model it can modify files, run commands, and implement solutions. Includes the current working directory and date. |

---

## Files Modified

| File | Change |
|---|---|
| `packages/server/src/routes/chat.ts` | Major update. Now calls `streamText()` with `tools` (selected based on `mode`) and `system` (from `system-prompt.ts`). Implements the **tool loop**: after a `tool-call` finish reason, executes tools, appends `tool-result` messages, calls the model again. Repeats until finish reason is `stop`. Streams text deltas back to client throughout the loop. |
| `packages/server/src/index.ts` | Sets `idleTimeout: 255` on `Bun.serve()` to prevent the server from killing long-running agentic loops. |
| `packages/server/package.json` | No new deps needed — AI SDK's `tool()` is part of `ai` package already installed. |

---

## Tool Calling Loop (Server)

```
POST /chat arrives
  systemPrompt = buildSystemPrompt(mode, cwd)
  tools = mode === 'PLAN' ? PLAN_TOOLS : BUILD_TOOLS

loop:
  response = streamText({ model, messages, tools, system })

  for each delta → stream to client

  if response.finishReason === 'tool-calls':
    for each toolCall in response.toolCalls:
      result = await tools[toolCall.toolName].execute(toolCall.args)
      messages.push({ role: 'tool', toolCallId, content: result })
    continue loop

  if response.finishReason === 'stop':
    break

save final messages to session in DB
```

## Tool Mode Matrix

| Tool | PLAN | BUILD |
|---|---|---|
| `readFile` | ✓ | ✓ |
| `listDirectory` | ✓ | ✓ |
| `glob` | ✓ | ✓ |
| `grep` | ✓ | ✓ |
| `writeFile` | ✗ | ✓ |
| `editFile` | ✗ | ✓ |
| `bash` | ✗ | ✓ |

## Tool Rendering in CLI

The `bot-message.tsx` component is updated to detect tool-call content blocks in the message and render them with a distinct style — showing the tool name and a summary of args, plus the result once available.

## Notes

- The AI SDK's `tool()` function takes a Zod schema for parameters — the model is guided to produce structured JSON args that match the schema exactly.
- `bash` tool uses `Bun.$\`${command}\`` with a 30-second timeout. Stdout and stderr are both captured and returned.
- `editFile` is the safest way to modify files — it fails if `oldString` is not found, preventing silent overwrites.
- Tool results are appended as `{ role: 'tool', toolCallId, content }` messages following the AI SDK's multi-turn tool spec.
- The server streams text to the client throughout the loop, so the user sees partial responses even during multi-step tool chains.
