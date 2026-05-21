import { TextAttributes } from "@opentui/core";
import { useTheme } from "../../providers/theme";

interface UserMessageProps {
  message: string;
}

export function UserMessage({ message }: UserMessageProps) {
  const { colors } = useTheme();

  return (
    <box width="100%" flexDirection="row" gap={2} paddingY={1} alignItems="flex-start">
      <text fg={colors.primary} attributes={TextAttributes.BOLD} paddingTop={1}>›</text>
      <box
        flexGrow={1}
        backgroundColor={colors.surface}
        borderStyle="single"
        borderColor={colors.primary}
        paddingX={2}
        paddingY={1}
      >
        <text fg={colors.thinking} selectable>{message}</text>
      </box>
    </box>
  );
}
