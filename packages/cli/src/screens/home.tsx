import { useCallback } from "react";
import { useKeyboard, useRenderer, useTerminalDimensions } from "@opentui/react";
import { TextAttributes } from "@opentui/core";
import { useTheme } from "../providers/theme";
import { useNavigate } from "../providers/router";
import { Header } from "../components/header";
import { InputBar } from "../components/input-bar";
import { StatusBar } from "../components/status-bar";

export function Home() {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const { width } = useTerminalDimensions();
  const renderer = useRenderer();
  const panelWidth = Math.min(80, width - 4);

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
    <box width="100%" height="100%" flexDirection="column">
      <Header />

      <box
        flexGrow={1}
        width="100%"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={2}
      >
        <box flexDirection="column" alignItems="center" gap={1}>
          <ascii-font font="tiny" text="Light" color={colors.dimSeparator} />
          <ascii-font font="tiny" text="Code" color={colors.primary} />
          <text fg={colors.dimSeparator}>Your AI coding assistant</text>
        </box>

        <box
          flexDirection="row"
          gap={1}
          alignItems="center"
        >
          <text fg={colors.dimSeparator}>type</text>
          <text fg={colors.primary} attributes={TextAttributes.BOLD}>/</text>
          <text fg={colors.dimSeparator}>to browse commands</text>
        </box>

        <box width={panelWidth}>
          <InputBar onSubmit={handleSubmit} />
        </box>
      </box>

      <StatusBar />
    </box>
  );
}
