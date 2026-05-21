import { createCliRenderer } from "@opentui/core";
import { createRoot, useKeyboard, useRenderer, useTerminalDimensions } from "@opentui/react";
import { useState } from "react";
import { Header } from "./components/header";
import { InputBar } from "./components/input-bar";
import { StatusBar } from "./components/status-bar";
import { MessagesArea, type Message } from "./components/messages";

const MODEL = "claude-sonnet-4-6";

function App() {
  const renderer = useRenderer();
  const { width } = useTerminalDimensions();
  const panelWidth = Math.min(80, width - 4);
  const [messages, setMessages] = useState<Message[]>([]);

  useKeyboard((key) => {
    if (key.ctrl && key.name === "c") {
      renderer.destroy();
    }
  });

  const handleSubmit = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: text },
    ]);
  };

  return (
    <box
      width="100%"
      height="100%"
      flexDirection="column"
      backgroundColor="#0D0D12"
    >
      <Header model={MODEL} />

      <box
        flexGrow={1}
        width="100%"
        flexDirection="column"
        alignItems="center"
      >
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
          <InputBar onSubmit={handleSubmit} />
        </box>
      </box>

      <StatusBar />
    </box>
  );
}

const renderer = await createCliRenderer({ exitOnCtrlC: false });
createRoot(renderer).render(<App />);
