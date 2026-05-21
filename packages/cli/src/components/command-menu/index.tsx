import { useMemo } from "react";
import { getFilteredCommands } from "./filter-commands";
import type { Command } from "./types";

interface CommandMenuProps {
  query: string;
  selectedIndex: number;
}

export function CommandMenu({ query, selectedIndex }: CommandMenuProps) {
  const filteredCommands = useMemo(
    () => getFilteredCommands(query),
    [query],
  );

  return (
    <box
      flexDirection="column"
      width="100%"
      maxHeight={9}
      backgroundColor="#13131E"
      borderStyle="rounded"
      borderColor="#CBA6F7"
      marginBottom={1}
    >
      <scrollbox flexDirection="column" height="100%">
        {filteredCommands.length === 0 ? (
          <text fg="#666677" paddingX={1}>
            No matching commands
          </text>
        ) : (
          filteredCommands.map((command: Command, index: number) => (
            <box
              key={command.value}
              flexDirection="row"
              gap={1}
              paddingX={1}
              backgroundColor={
                index === selectedIndex ? "#89B4FA" : "transparent"
              }
            >
              <text
                fg={index === selectedIndex ? "#0D0D12" : "#89B4FA"}
                width={14}
              >
                /{command.name}
              </text>
              <text fg={index === selectedIndex ? "#1A1A24" : "#666677"}>
                {command.description}
              </text>
            </box>
          ))
        )}
      </scrollbox>
    </box>
  );
}
