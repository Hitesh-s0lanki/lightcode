import type { ReactNode } from "react";
import { useKeyboard, useRenderer, useTerminalDimensions } from "@opentui/react";
import { TextAttributes } from "@opentui/core";
import { useTheme } from "../providers/theme";
import { InputBar } from "./input-bar";
import { Spinner } from "./spinner";
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
  const { width } = useTerminalDimensions();
  const renderer = useRenderer();
  const panelWidth = Math.min(100, width - 4);

  useKeyboard((key) => {
    if (key.ctrl && key.name === "c") renderer.destroy();
  });

  return (
    <box
      width="100%"
      height="100%"
      flexDirection="column"
      backgroundColor={colors.background}
    >
      {/* ── Header ── */}
      <Header model={model} />

      {/* ── Messages ── */}
      <scrollbox
        flexGrow={1}
        width="100%"
        flexDirection="column"
        stickyScroll
        stickyStart="bottom"
        paddingTop={1}
      >
        <box
          width="100%"
          flexDirection="column"
          alignItems="center"
        >
          <box width={panelWidth} flexDirection="column">
            {children}
          </box>
        </box>
      </scrollbox>

      {/* ── Divider ── */}
      <box width="100%" height={1} backgroundColor={colors.dimSeparator} />

      {/* ── Input area ── */}
      <box
        width="100%"
        flexDirection="column"
        alignItems="center"
        paddingY={1}
        backgroundColor={colors.background}
      >
        <box width={panelWidth}>
          <InputBar onSubmit={onSubmit} disabled={inputDisabled} />
        </box>
      </box>

      {/* ── Status row ── */}
      <box
        width="100%"
        height={1}
        flexDirection="row"
        alignItems="center"
        paddingX={3}
        gap={2}
        backgroundColor={colors.surface}
      >
        {loading ? (
          <>
            <Spinner />
            <text fg={colors.dimSeparator}>thinking…</text>
          </>
        ) : (
          <>
            <text fg={colors.primary} attributes={TextAttributes.BOLD}>/</text>
            <text fg={colors.dimSeparator}>commands</text>
            <text fg={colors.dimSeparator}>│</text>
            <text fg={colors.primary} attributes={TextAttributes.BOLD}>enter</text>
            <text fg={colors.dimSeparator}>submit</text>
            <text fg={colors.dimSeparator}>│</text>
            <text fg={colors.primary} attributes={TextAttributes.BOLD}>esc</text>
            <text fg={colors.dimSeparator}>interrupt</text>
          </>
        )}
      </box>
    </box>
  );
}
