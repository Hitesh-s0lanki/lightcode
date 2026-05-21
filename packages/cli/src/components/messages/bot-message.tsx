import { TextAttributes } from "@opentui/core";
import { useTheme } from "../../providers/theme";
import { Spinner } from "../spinner";

interface BotMessageProps {
  content: string;
  model?: string;
  loading?: boolean;
}

export function BotMessage({ content, model, loading = false }: BotMessageProps) {
  const { colors } = useTheme();

  if (loading) {
    return (
      <box width="100%" flexDirection="row" gap={2} paddingY={1} alignItems="center">
        <Spinner />
        <text fg={colors.dimSeparator}>thinking…</text>
      </box>
    );
  }

  return (
    <box width="100%" flexDirection="column" paddingY={1} gap={1}>
      <box flexDirection="row" gap={2} alignItems="flex-start">
        <text fg={colors.success}>✦</text>
        <text fg={colors.thinking} selectable>{content}</text>
      </box>
      {model && (
        <text
          fg={colors.dimSeparator}
          attributes={TextAttributes.DIM}
          paddingLeft={4}
        >
          {model}
        </text>
      )}
    </box>
  );
}
