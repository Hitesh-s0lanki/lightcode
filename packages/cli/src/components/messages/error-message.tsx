import { useTheme } from "../../providers/theme";

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  const { colors } = useTheme();

  return (
    <box width="100%" flexDirection="row" gap={2} paddingY={1}>
      <text fg={colors.error}>✕</text>
      <box
        flexGrow={1}
        backgroundColor={colors.surface}
        borderStyle="single"
        borderColor={colors.error}
        paddingX={2}
        paddingY={1}
      >
        <text fg={colors.error} selectable>{message}</text>
      </box>
    </box>
  );
}
