import { TextAttributes } from "@opentui/core";
import { useTheme } from "../../providers/theme";

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  const { colors } = useTheme();

  return (
    <box width="100%" flexDirection="row" gap={2} paddingX={1} paddingY={1}>
      <box width={3} alignItems="center" paddingTop={1}>
        <text fg={colors.error}>✕</text>
      </box>
      <box
        flexGrow={1}
        flexDirection="column"
        backgroundColor={colors.surface}
        paddingX={2}
        paddingY={1}
        borderStyle="single"
        borderColor={colors.error}
      >
        <text
          fg={colors.error}
          attributes={TextAttributes.DIM}
          selectable
        >
          {message}
        </text>
      </box>
    </box>
  );
}
