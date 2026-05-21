import { TextAttributes } from "@opentui/core";
import { useTheme } from "../providers/theme";

function KeyHint({ keys, label }: { keys: string; label: string }) {
  const { colors } = useTheme();
  return (
    <box flexDirection="row" gap={1} alignItems="center">
      <text fg={colors.primary} attributes={TextAttributes.BOLD}>{keys}</text>
      <text fg={colors.dimSeparator}>{label}</text>
    </box>
  );
}

export function StatusBar() {
  const { colors } = useTheme();

  return (
    <box
      width="100%"
      height={1}
      flexDirection="row"
      alignItems="center"
      paddingX={2}
      gap={3}
      backgroundColor={colors.surface}
    >
      <KeyHint keys="/" label="commands" />
      <text fg={colors.dimSeparator}>│</text>
      <KeyHint keys="enter" label="submit" />
      <text fg={colors.dimSeparator}>│</text>
      <KeyHint keys="↑↓" label="navigate" />
      <text fg={colors.dimSeparator}>│</text>
      <KeyHint keys="ctrl+c" label="exit" />
    </box>
  );
}
