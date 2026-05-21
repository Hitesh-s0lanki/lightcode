import {
  createContext, useContext, useState, useCallback, useRef, type ReactNode,
} from "react";
import { useKeyboard, useTerminalDimensions } from "@opentui/react";
import type { DialogConfig } from "./types";
import { useKeyboardLayer } from "../keyboard-layer";

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
  const { width } = useTerminalDimensions();
  const dialogWidth = Math.min(62, width - 4);

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
          width="100%"
          height="100%"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          backgroundColor="#0D0D12"
        >
          <box
            width={dialogWidth}
            backgroundColor="#191B23"
            borderStyle="single"
            borderColor="#56D6C2"
            paddingX={2}
            paddingY={1}
            flexDirection="column"
            gap={1}
          >
            {currentDialog.title && (
              <text fg="#CDD6F4" attributes={1 /* BOLD */}>{currentDialog.title}</text>
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
