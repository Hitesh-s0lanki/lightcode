import { useState, useCallback, useMemo, useEffect } from "react";
import { getFilteredCommands } from "./filter-commands";
import type { Command } from "./types";

export function useCommandMenu(textValue: string) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const showCommandMenu =
    textValue.startsWith("/") && !textValue.includes(" ");

  const query = showCommandMenu ? textValue.slice(1) : "";

  const filteredCommands = useMemo(
    () => getFilteredCommands(query),
    [query],
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const navigateUp = useCallback(() => {
    setSelectedIndex((prev) =>
      prev > 0 ? prev - 1 : filteredCommands.length - 1,
    );
  }, [filteredCommands.length]);

  const navigateDown = useCallback(() => {
    setSelectedIndex((prev) =>
      prev < filteredCommands.length - 1 ? prev + 1 : 0,
    );
  }, [filteredCommands.length]);

  const resolveCommand = useCallback(
    (index: number): Command | undefined => {
      const command = filteredCommands[index];
      if (command?.action) {
        command.action({ exit: () => process.exit(0) });
      }
      return command;
    },
    [filteredCommands],
  );

  return {
    showCommandMenu,
    selectedIndex,
    filteredCommands,
    navigateUp,
    navigateDown,
    resolveCommand,
  };
}
