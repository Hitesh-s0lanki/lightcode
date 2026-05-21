import { TextAttributes } from "@opentui/core";

interface HeaderProps {
  model?: string;
}

export function Header({ model = "claude-sonnet-4-6" }: HeaderProps) {
  return (
    <box
      width="100%"
      height={1}
      flexDirection="row"
      alignItems="center"
      paddingX={2}
      backgroundColor="#111119"
    >
      <box flexGrow={1} flexDirection="row" gap={1} alignItems="center">
        <text fg="#89B4FA" attributes={TextAttributes.BOLD}>
          ✦
        </text>
        <text fg="#CDD6F4" attributes={TextAttributes.BOLD}>
          LightCode
        </text>
      </box>
      <box flexDirection="row" gap={2} alignItems="center">
        <text fg="#2A2A3A">│</text>
        <text fg="#444466">{model}</text>
      </box>
    </box>
  );
}
