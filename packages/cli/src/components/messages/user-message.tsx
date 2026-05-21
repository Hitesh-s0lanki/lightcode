import { useTheme } from "../../providers/theme";

interface UserMessageProps {
  message: string;
}

export function UserMessage({ message }: UserMessageProps) {
  const { colors } = useTheme();

  return (
    <box width="100%" flexDirection="row" gap={2} paddingX={1} paddingY={1}>
      <box width={3} alignItems="center" paddingTop={1}>
        <text fg={colors.primary}>›</text>
      </box>
      <box
        flexGrow={1}
        flexDirection="column"
        backgroundColor={colors.surface}
        paddingX={2}
        paddingY={1}
        borderStyle="single"
        borderColor={colors.primary}
      >
        <text fg={colors.primary} selectable>{message}</text>
      </box>
    </box>
  );
}
