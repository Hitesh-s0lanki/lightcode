import { useState, useCallback, useRef, useEffect } from "react";
import { useKeyboard } from "@opentui/react";
import type { TextareaRenderable, KeyEvent } from "@opentui/core";
import { CommandMenu } from "./command-menu";
import { useCommandMenu } from "./command-menu/use-command-menu";

interface InputBarProps {
  onSubmit?: (text: string) => void;
  disabled?: boolean;
}

export function InputBar({ onSubmit, disabled = false }: InputBarProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<TextareaRenderable>(null);
  const valueRef = useRef("");
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
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

  // Refs so useKeyboard always sees current values without re-subscribing
  const showCommandMenuRef = useRef(false);
  const navigateUpRef = useRef(navigateUp);
  const navigateDownRef = useRef(navigateDown);
  showCommandMenuRef.current = showCommandMenu;
  navigateUpRef.current = navigateUp;
  navigateDownRef.current = navigateDown;

  const clearTextarea = useCallback(() => {
    valueRef.current = "";
    setValue("");
    try {
      textareaRef.current?.editBuffer.setText("");
    } catch {
      // editBuffer may already be destroyed (e.g. after /exit command)
    }
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
          resolveCommand(selectedIndex);
          clearTextarea();
        } else if (text.trim() && !disabled) {
          onSubmit?.(text);
          clearTextarea();
        }
        // Textarea still processes Enter and appends \n after this handler.
        // Clear again on the next tick to remove it.
        setTimeout(() => {
          try {
            textareaRef.current?.editBuffer.setText("");
          } catch {}
          valueRef.current = "";
        }, 0);
        return;
      }
      syncValue();
    },
    [showCommandMenu, selectedIndex, resolveCommand, disabled, onSubmit, clearTextarea, syncValue],
  );

  return (
    <box flexDirection="column" width="100%">
      {showCommandMenu && (
        <CommandMenu
          filteredCommands={filteredCommands}
          selectedIndex={selectedIndex}
        />
      )}
      <box
        borderStyle="rounded"
        borderColor={
          disabled ? "#2A2A3A" : showCommandMenu ? "#CBA6F7" : "#89B4FA"
        }
        width="100%"
        paddingX={1}
      >
        <textarea
          ref={textareaRef}
          focused={!disabled}
          onKeyDown={handleKeyDown}
          placeholder="Ask lightcode anything..."
          backgroundColor="#13131E"
          focusedBackgroundColor="#1A1A24"
          width="100%"
        />
      </box>
    </box>
  );
}
