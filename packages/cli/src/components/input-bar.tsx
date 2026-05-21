import { useState, useCallback, useRef, useEffect } from "react";
import { useKeyboard } from "@opentui/react";
import type { TextareaRenderable, KeyEvent } from "@opentui/core";
import { useToast } from "../providers/toast";
import { useDialog } from "../providers/dialog";
import { useTheme } from "../providers/theme";
import { CommandMenu } from "./command-menu";
import { useCommandMenu } from "./command-menu/use-command-menu";

interface InputBarProps {
  onSubmit?: (text: string) => void;
  disabled?: boolean;
}

export function InputBar({ onSubmit, disabled = false }: InputBarProps) {
  const { show: toastShow } = useToast();
  const { open: dialogOpen, close: dialogClose } = useDialog();
  const { colors } = useTheme();

  const [value, setValue] = useState("");
  const textareaRef = useRef<TextareaRenderable>(null);
  const valueRef = useRef("");
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    // Imperatively focus on mount so the textarea is active immediately
    textareaRef.current?.focus();
    return () => { mountedRef.current = false; };
  }, []);

  const {
    showCommandMenu,
    selectedIndex,
    filteredCommands,
    navigateUp,
    navigateDown,
    resolveCommand,
  } = useCommandMenu(value);

  const showCommandMenuRef = useRef(false);
  const navigateUpRef = useRef(navigateUp);
  const navigateDownRef = useRef(navigateDown);
  showCommandMenuRef.current = showCommandMenu;
  navigateUpRef.current = navigateUp;
  navigateDownRef.current = navigateDown;

  const clearTextarea = useCallback(() => {
    valueRef.current = "";
    setValue("");
    try { textareaRef.current?.editBuffer.setText(""); } catch {}
  }, []);

  const syncValue = useCallback(() => {
    setTimeout(() => {
      if (!mountedRef.current) return;
      const text = textareaRef.current?.editBuffer.getText() ?? "";
      valueRef.current = text;
      setValue(text);
    }, 0);
  }, []);

  useKeyboard((key) => {
    if (!showCommandMenuRef.current) return;
    if (key.name === "up") navigateUpRef.current();
    else if (key.name === "down") navigateDownRef.current();
  });

  const handleKeyDown = useCallback(
    (event: KeyEvent) => {
      if (event.name === "return") {
        const text = valueRef.current;
        if (showCommandMenu) {
          resolveCommand(selectedIndex, {
            toast: { show: toastShow },
            dialog: { open: dialogOpen, close: dialogClose },
          });
          clearTextarea();
        } else if (text.trim() && !disabled) {
          onSubmit?.(text);
          clearTextarea();
        }
        setTimeout(() => {
          try { textareaRef.current?.editBuffer.setText(""); } catch {}
          valueRef.current = "";
        }, 0);
        return;
      }
      syncValue();
    },
    [showCommandMenu, selectedIndex, resolveCommand, toastShow, dialogOpen, dialogClose,
     disabled, onSubmit, clearTextarea, syncValue],
  );

  return (
    <box flexDirection="column" width="100%">
      {showCommandMenu && (
        <CommandMenu filteredCommands={filteredCommands} selectedIndex={selectedIndex} />
      )}
      <box
        borderStyle="rounded"
        borderColor={
          disabled
            ? colors.dimSeparator
            : showCommandMenu
              ? colors.planMode
              : colors.primary
        }
        width="100%"
      >
        <box paddingX={2} width="100%" backgroundColor={colors.surface}>
          <textarea
            ref={textareaRef}
            focused={!disabled}
            onKeyDown={handleKeyDown}
            placeholder="Ask lightcode anything…"
            backgroundColor={colors.surface}
            focusedBackgroundColor={colors.surface}
            width="100%"
            height={2}
          />
        </box>
      </box>
    </box>
  );
}
