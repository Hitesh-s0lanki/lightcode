import { useState, useEffect, useRef, type ReactNode } from "react";
import { useKeyboard } from "@opentui/react";
import type { ScrollBoxRenderable } from "@opentui/core";
import { useDialog } from "../providers/dialog";

type DialogSearchListProps<T> = {
  items: T[];
  filterFn: (item: T, query: string) => boolean;
  renderItem: (item: T, isSelected: boolean) => ReactNode;
  onSelect: (item: T) => void;
  onHighlight?: (item: T) => void;
  getKey: (item: T) => string;
  placeholder?: string;
};

export function DialogSearchList<T>({
  items,
  filterFn,
  renderItem,
  onSelect,
  onHighlight,
  getKey,
  placeholder = "Search...",
}: DialogSearchListProps<T>) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollboxRef = useRef<ScrollBoxRenderable>(null);
  const { isOpen } = useDialog();

  const filtered = items.filter((item) => filterFn(item, query));

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const item = filtered[selectedIndex];
    if (item) {
      onHighlight?.(item);
      scrollboxRef.current?.scrollChildIntoView(`dsl-${getKey(item)}`);
    }
  }, [selectedIndex, filtered]);

  useKeyboard((key) => {
    if (!isOpen) return;
    if (key.name === "up") {
      setSelectedIndex((p) => (p > 0 ? p - 1 : filtered.length - 1));
    } else if (key.name === "down") {
      setSelectedIndex((p) => (p < filtered.length - 1 ? p + 1 : 0));
    } else if (key.name === "return") {
      const item = filtered[selectedIndex];
      if (item) onSelect(item);
    }
  });

  return (
    <box flexDirection="column" gap={1}>
      <input
        focused
        value={query}
        onInput={setQuery}
        placeholder={placeholder}
        backgroundColor="#0D0D12"
        focusedBackgroundColor="#131418"
        width="100%"
      />
      <scrollbox
        ref={scrollboxRef}
        flexDirection="column"
        maxHeight={8}
        width="100%"
      >
        {filtered.length === 0 ? (
          <text fg="#444455" paddingX={1}>No results</text>
        ) : (
          filtered.map((item, index) => (
            <box
              key={getKey(item)}
              id={`dsl-${getKey(item)}`}
              paddingX={1}
              backgroundColor={index === selectedIndex ? "#3D59A6" : "transparent"}
            >
              {renderItem(item, index === selectedIndex)}
            </box>
          ))
        )}
      </scrollbox>
    </box>
  );
}
