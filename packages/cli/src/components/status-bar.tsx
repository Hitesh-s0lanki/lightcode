import { TextAttributes } from "@opentui/core";

function KeyHint({ keys, label }: { keys: string; label: string }) {
  return (
    <box flexDirection="row" gap={1} alignItems="center">
      <text fg="#444466" attributes={TextAttributes.BOLD}>
        {keys}
      </text>
      <text fg="#2A2A3A">{label}</text>
    </box>
  );
}

export function StatusBar() {
  return (
    <box
      width="100%"
      height={1}
      flexDirection="row"
      alignItems="center"
      paddingX={2}
      gap={3}
      backgroundColor="#0F0F18"
    >
      <KeyHint keys="/" label="commands" />
      <text fg="#1E1E2E">│</text>
      <KeyHint keys="enter" label="submit" />
      <text fg="#1E1E2E">│</text>
      <KeyHint keys="↑↓" label="navigate" />
      <text fg="#1E1E2E">│</text>
      <KeyHint keys="ctrl+c" label="exit" />
    </box>
  );
}
