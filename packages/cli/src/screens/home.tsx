import { useCallback } from "react";
import { useKeyboard, useRenderer, useTerminalDimensions } from "@opentui/react";
import { TextAttributes } from "@opentui/core";
import { useTheme } from "../providers/theme";
import { useNavigate } from "../providers/router";
import { InputBar } from "../components/input-bar";
import { StatusBar } from "../components/status-bar";

export function Home() {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const { width } = useTerminalDimensions();
  const renderer = useRenderer();
  const inputWidth = Math.min(76, width - 6);

  useKeyboard((key) => {
    if (key.ctrl && key.name === "c") renderer.destroy();
  });

  const handleSubmit = useCallback(
    (text: string) => {
      navigate("/sessions/new", { state: { message: text } });
    },
    [navigate],
  );

  return (
    <box width="100%" height="100%" flexDirection="column" backgroundColor={colors.background}>
      {/* Top bar */}
      <box
        width="100%"
        height={1}
        flexDirection="row"
        alignItems="center"
        paddingX={3}
        backgroundColor={colors.surface}
      >
        <text fg={colors.primary} attributes={TextAttributes.BOLD}>✦ LightCode</text>
      </box>

      {/* Centered content */}
      <box
        flexGrow={1}
        width="100%"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {/* ASCII logo — side by side on same row */}
        <box flexDirection="row" alignItems="flex-start">
          <ascii-font font="tiny" text="Light" color={colors.dimSeparator} />
          <ascii-font font="tiny" text="Code" color={colors.primary} />
        </box>

        {/* Tagline */}
        <box
          flexDirection="column"
          alignItems="center"
          gap={1}
          paddingTop={2}
          paddingBottom={2}
        >
          <text fg={colors.dimSeparator}>Your AI coding assistant</text>
          <box flexDirection="row" gap={1} alignItems="center">
            <text fg={colors.dimSeparator}>type</text>
            <text fg={colors.primary} attributes={TextAttributes.BOLD}>/</text>
            <text fg={colors.dimSeparator}>to browse commands · or just start typing</text>
          </box>
        </box>

        {/* Input */}
        <box width={inputWidth}>
          <InputBar onSubmit={handleSubmit} />
        </box>
      </box>

      <StatusBar />
    </box>
  );
}
