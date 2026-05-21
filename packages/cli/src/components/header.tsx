import { TextAttributes } from "@opentui/core";
import { useTheme } from "../providers/theme";

interface HeaderProps {
  model?: string;
}

export function Header({ model }: HeaderProps) {
  const { colors } = useTheme();

  return (
    <box
      width="100%"
      height={1}
      flexDirection="row"
      alignItems="center"
      paddingX={2}
      backgroundColor={colors.surface}
    >
      <box flexGrow={1} flexDirection="row" gap={1} alignItems="center">
        <text fg={colors.primary} attributes={TextAttributes.BOLD}>✦</text>
        <text fg={colors.thinking} attributes={TextAttributes.BOLD}>LightCode</text>
      </box>
      {model && (
        <box flexDirection="row" gap={2} alignItems="center">
          <text fg={colors.dimSeparator}>│</text>
          <text fg={colors.dimSeparator}>{model}</text>
        </box>
      )}
    </box>
  );
}
