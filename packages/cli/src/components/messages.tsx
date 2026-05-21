import { TextAttributes } from "@opentui/core";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface MessagesAreaProps {
  messages: Message[];
  width: number;
}

function WelcomeScreen() {
  return (
    <box
      flexGrow={1}
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <box flexDirection="row" gap={1}>
        <ascii-font font="tiny" text="Light" color="#555566" />
        <ascii-font font="tiny" text="Code" color="#89B4FA" />
      </box>
      <box flexDirection="column" alignItems="center" gap={1}>
        <text fg="#444455">Your AI coding assistant</text>
        <box flexDirection="row" gap={1} alignItems="center">
          <text fg="#2A2A3A">type</text>
          <text fg="#89B4FA" attributes={TextAttributes.BOLD}>/</text>
          <text fg="#2A2A3A">to browse commands</text>
        </box>
      </box>
    </box>
  );
}

function MessageItem({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <box flexDirection="row" gap={2} paddingX={1} marginBottom={1}>
      <text
        fg={isUser ? "#89B4FA" : "#A6E3A1"}
        attributes={TextAttributes.BOLD}
        width={2}
      >
        {isUser ? "›" : "✦"}
      </text>
      <box flexGrow={1} flexDirection="column">
        <text fg={isUser ? "#CDD6F4" : "#B8D4B8"} selectable>
          {message.content}
        </text>
      </box>
    </box>
  );
}

export function MessagesArea({ messages, width }: MessagesAreaProps) {
  return (
    <box flexGrow={1} width={width} flexDirection="column">
      {messages.length === 0 ? (
        <WelcomeScreen />
      ) : (
        <scrollbox
          height="100%"
          width="100%"
          flexDirection="column"
          paddingY={1}
        >
          {messages.map((msg) => (
            <MessageItem key={msg.id} message={msg} />
          ))}
        </scrollbox>
      )}
    </box>
  );
}
