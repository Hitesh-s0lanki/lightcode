import { createCliRenderer } from "@opentui/core";
import { createRoot, useKeyboard, useRenderer, useTerminalDimensions } from "@opentui/react";
import { useState } from "react";
import { ThemeProvider, useTheme } from "./providers/theme";
import { KeyboardLayerProvider } from "./providers/keyboard-layer";
import { DialogProvider } from "./providers/dialog";
import { ToastProvider } from "./providers/toast";
import { Header } from "./components/header";
import { InputBar } from "./components/input-bar";
import { StatusBar } from "./components/status-bar";
import { MessagesArea, type Message } from "./components/messages";

const MODEL = "claude-sonnet-4-6";

function ThemedApp() {
  const renderer = useRenderer();
  const { colors } = useTheme();
  const { width } = useTerminalDimensions();
  const panelWidth = Math.min(80, width - 4);
  const [messages, setMessages] = useState<Message[]>([]);

  useKeyboard((key) => {
    if (key.ctrl && key.name === "c") renderer.destroy();
  });

  return (
    <box width="100%" height="100%" flexDirection="column" backgroundColor={colors.background}>
      <Header model={MODEL} />

      <box flexGrow={1} width="100%" flexDirection="column" alignItems="center">
        <MessagesArea messages={messages} width={panelWidth} />
      </box>

      <box
        width="100%"
        flexDirection="column"
        alignItems="center"
        paddingX={2}
        paddingBottom={1}
      >
        <box width={panelWidth}>
          <InputBar
            onSubmit={(text) =>
              setMessages((prev) => [
                ...prev,
                { id: crypto.randomUUID(), role: "user", content: text },
              ])
            }
          />
        </box>
      </box>

      <StatusBar />
    </box>
  );
}

function App() {
  return (
    <ThemeProvider>
      <KeyboardLayerProvider>
        <DialogProvider>
          <ToastProvider>
            <ThemedApp />
          </ToastProvider>
        </DialogProvider>
      </KeyboardLayerProvider>
    </ThemeProvider>
  );
}

const renderer = await createCliRenderer({ exitOnCtrlC: false });

// Guarantee terminal cleanup even if the React app hasn't mounted yet
// or the process is killed externally.
const cleanup = () => {
  try { renderer.destroy(); } catch {}
  process.exit(0);
};
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
process.on("uncaughtException", (err) => {
  try { renderer.destroy(); } catch {}
  console.error(err);
  process.exit(1);
});

createRoot(renderer).render(<App />);
