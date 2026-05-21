import { useState, useCallback, useRef } from "react";
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

  const {
    showCommandMenu,
    selectedIndex,
    navigateUp,
    navigateDown,
    resolveCommand,
  } = useCommandMenu(value);

  const clearTextarea = useCallback(() => {
    valueRef.current = "";
    setValue("");
    textareaRef.current?.editBuffer.setText("");
  }, []);

  const syncValue = useCallback(() => {
    // Defer read so the edit buffer has been updated by the time we read
    setTimeout(() => {
      const text = textareaRef.current?.editBuffer.getText() ?? "";
      valueRef.current = text;
      setValue(text);
    }, 0);
  }, []);

  useKeyboard((key) => {
    if (!showCommandMenu) return;
    if (key.name === "up") navigateUp();
    else if (key.name === "down") navigateDown();
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
        return;
      }
      // For all other keys, sync value after the buffer updates
      syncValue();
    },
    [showCommandMenu, selectedIndex, resolveCommand, disabled, onSubmit, clearTextarea, syncValue],
  );

  return (
    <box flexDirection="column" width="100%">
      {showCommandMenu && (
        <CommandMenu query={value.slice(1)} selectedIndex={selectedIndex} />
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
