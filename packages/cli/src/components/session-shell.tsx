import type { ReactNode } from "react";
import { useKeyboard, useRenderer } from "@opentui/react";
import { useTheme } from "../providers/theme";
import { InputBar } from "./input-bar";
import { Spinner } from "./spinner";
import { StatusBar } from "./status-bar";
import { Header } from "./header";

interface SessionShellProps {
  children?: ReactNode;
  onSubmit: (text: string) => void;
  inputDisabled?: boolean;
  loading?: boolean;
  model?: string;
}

export function SessionShell({
  children,
  onSubmit,
  inputDisabled = false,
  loading = false,
  model = "claude-sonnet-4-6",
}: SessionShellProps) {
  const { colors } = useTheme();
  const renderer = useRenderer();

  useKeyboard((key) => {
    if (key.ctrl && key.name === "c") renderer.destroy();
  });

  return (
    <box width="100%" height="100%" flexDirection="column">
      <Header model={model} />

      <scrollbox
        flexGrow={1}
        width="100%"
        flexDirection="column"
        paddingX={2}
        stickyScroll
        stickyStart="bottom"
      >
        {children}
      </scrollbox>

      <box
        width="100%"
        flexDirection="column"
        alignItems="center"
        paddingX={2}
        paddingBottom={1}
      >
        <InputBar onSubmit={onSubmit} disabled={inputDisabled} />
      </box>

      <box
        width="100%"
        height={1}
        flexDirection="row"
        alignItems="center"
        paddingX={2}
        gap={2}
        backgroundColor={colors.surface}
      >
        {loading ? (
          <box flexDirection="row" gap={1} alignItems="center" flexGrow={1}>
            <Spinner />
            <text fg={colors.dimSeparator}>thinking…</text>
          </box>
        ) : (
          <StatusBar />
        )}
      </box>
    </box>
  );
}
