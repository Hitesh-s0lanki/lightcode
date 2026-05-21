import {
  createContext, useContext, useState, useCallback, type ReactNode,
} from "react";
import { useKeyboard, useTerminalDimensions } from "@opentui/react";
import type { DialogConfig } from "./types";
import { useKeyboardLayer } from "../keyboard-layer";
import { useTheme } from "../theme";

type DialogContextValue = {
  open: (config: DialogConfig) => void;
  close: () => void;
  isOpen: boolean;
};

const DialogContext = createContext<DialogContextValue | null>(null);

const LAYER_ID = "dialog";

export function DialogProvider({ children }: { children: ReactNode }) {
  const [currentDialog, setCurrentDialog] = useState<DialogConfig | null>(null);
  const { push, pop } = useKeyboardLayer();
  const { colors } = useTheme();
  const { width, height: terminalHeight } = useTerminalDimensions();
  const dialogWidth = Math.min(66, width - 4);

  const open = useCallback((config: DialogConfig) => {
    setCurrentDialog(config);
    push(LAYER_ID);
  }, [push]);

  const close = useCallback(() => {
    setCurrentDialog(null);
    pop(LAYER_ID);
  }, [pop]);

  useKeyboard((key) => {
    if (currentDialog && key.name === "escape") close();
  });

  return (
    <DialogContext.Provider value={{ open, close, isOpen: !!currentDialog }}>
      {children}
      {currentDialog && (
        <box
          position="absolute"
          top={0}
          left={0}
          width={width}
          height={terminalHeight}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          backgroundColor={colors.background}
        >
          <box
            width={dialogWidth}
            backgroundColor={colors.dialogSurface}
            borderStyle="rounded"
            borderColor={colors.primary}
            paddingX={2}
            paddingY={1}
            flexDirection="column"
            gap={1}
          >
            {currentDialog.title && (
              <text fg={colors.primary} attributes={1 /* BOLD */}>{currentDialog.title}</text>
            )}
            {currentDialog.children}
          </box>
        </box>
      )}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialog must be used within DialogProvider");
  return ctx;
}
