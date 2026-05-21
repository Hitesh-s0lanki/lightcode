import { useMemo, useRef, useEffect } from "react";
import type { ScrollBoxRenderable } from "@opentui/core";
import { getFilteredCommands } from "./filter-commands";
import type { Command } from "./types";

interface CommandMenuProps {
  query: string;
  selectedIndex: number;
}

const MAX_VISIBLE = 7;

export function CommandMenu({ query, selectedIndex }: CommandMenuProps) {
  const scrollboxRef = useRef<ScrollBoxRenderable>(null);
  const filteredCommands = useMemo(
    () => getFilteredCommands(query),
    [query],
  );

  useEffect(() => {
    const selected = filteredCommands[selectedIndex];
    if (selected) {
      scrollboxRef.current?.scrollChildIntoView(`cmd-${selected.value}`);
    }
  }, [selectedIndex, filteredCommands]);

  // +2 accounts for top and bottom border rows
  const itemCount = filteredCommands.length === 0 ? 1 : filteredCommands.length;
  const boxHeight = Math.min(itemCount, MAX_VISIBLE) + 2;

  return (
    <box
      flexDirection="column"
      width="100%"
      height={boxHeight}
      backgroundColor="#13131E"
      borderStyle="rounded"
      borderColor="#CBA6F7"
      marginBottom={1}
    >
      <scrollbox ref={scrollboxRef} flexDirection="column" height="100%">
        {filteredCommands.length === 0 ? (
          <text fg="#666677" paddingX={1}>
            No matching commands
          </text>
        ) : (
          filteredCommands.map((command: Command, index: number) => (
            <box
              key={command.value}
              id={`cmd-${command.value}`}
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
