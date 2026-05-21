import { useState, useEffect, type ReactNode } from "react";
import { useKeyboard } from "@opentui/react";
import { useDialog } from "../providers/dialog";
import { useTheme } from "../providers/theme";

const MAX_VISIBLE = 6;

type DialogSearchListProps<T> = {
  items: T[];
  filterFn: (item: T, query: string) => boolean;
  renderLabel: (item: T, isSelected: boolean) => string;
  renderLabelColor: (item: T, isSelected: boolean, colors: ReturnType<typeof useTheme>["colors"]) => string;
  onSelect: (item: T) => void;
  onHighlight?: (item: T) => void;
  getKey: (item: T) => string;
  placeholder?: string;
};

export function DialogSearchList<T>({
  items,
  filterFn,
  renderLabel,
  renderLabelColor,
  onSelect,
  onHighlight,
  getKey,
  placeholder = "Search...",
}: DialogSearchListProps<T>) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { isOpen } = useDialog();
  const { colors } = useTheme();

  const filtered = items.filter((item) => filterFn(item, query));

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const item = filtered[selectedIndex];
    if (item) onHighlight?.(item);
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

  // Sliding window: keep selectedIndex visible
  const windowStart = Math.max(
    0,
    Math.min(selectedIndex - Math.floor(MAX_VISIBLE / 2), filtered.length - MAX_VISIBLE),
  );
  const visible = filtered.slice(windowStart, windowStart + MAX_VISIBLE);
  const hasMore = filtered.length > MAX_VISIBLE;

  return (
    <box flexDirection="column" gap={1}>
      <input
        focused
        onInput={setQuery}
        placeholder={placeholder}
        backgroundColor={colors.surface}
        focusedBackgroundColor={colors.surface}
        width="100%"
      />
      <box flexDirection="column" width="100%">
        {filtered.length === 0 ? (
          <text fg={colors.dimSeparator} paddingLeft={1}>No results</text>
        ) : (
          visible.map((item) => {
            const globalIndex = filtered.indexOf(item);
            const isSel = globalIndex === selectedIndex;
            return (
              <box
                key={getKey(item)}
                backgroundColor={isSel ? colors.selection : colors.dialogSurface}
                paddingLeft={1}
              >
                <text fg={renderLabelColor(item, isSel, colors)}>
                  {renderLabel(item, isSel)}
                </text>
              </box>
            );
          })
        )}
        {hasMore && (
          <text fg={colors.dimSeparator} paddingLeft={1}>
            {`↑↓ to scroll  (${selectedIndex + 1}/${filtered.length})`}
          </text>
        )}
      </box>
    </box>
  );
}
