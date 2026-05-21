import { useTheme } from "../../providers/theme";
import { Spinner } from "../spinner";

interface BotMessageProps {
  content: string;
  model?: string;
  loading?: boolean;
}

export function BotMessage({ content, model, loading = false }: BotMessageProps) {
  const { colors } = useTheme();

  return (
    <box width="100%" flexDirection="column" paddingX={1} paddingY={1}>
      <box flexDirection="row" gap={2} paddingX={1}>
        <box width={3} alignItems="center" paddingTop={1}>
          {loading ? (
            <Spinner />
          ) : (
            <text fg={colors.primary}>✦</text>
          )}
        </box>
        <box flexGrow={1} flexDirection="column" gap={1}>
          {content ? (
            <text fg={colors.thinking} selectable>{content}</text>
          ) : (
            <text fg={colors.dimSeparator}>Thinking…</text>
          )}
          {model && !loading && (
            <text fg={colors.dimSeparator}>{model}</text>
          )}
        </box>
      </box>
    </box>
  );
}
