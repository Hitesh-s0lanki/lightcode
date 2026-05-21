import { useRef, useEffect } from "react";
import { useDialog } from "../../providers/dialog";
import { useTheme } from "../../providers/theme";
import { DialogSearchList } from "../dialog-search-list";
import { THEMES, type Theme } from "../../theme";

export function ThemeDialogContent() {
  const { close } = useDialog();
  const { currentTheme, setTheme } = useTheme();
  const originalThemeRef = useRef(currentTheme);
  const confirmedRef = useRef(false);

  // Revert to original theme if dialog is dismissed without confirming
  useEffect(() => {
    return () => {
      if (!confirmedRef.current) setTheme(originalThemeRef.current);
    };
  }, [setTheme]);

  return (
    <DialogSearchList<Theme>
      items={THEMES}
      filterFn={(theme, query) =>
        theme.name.toLowerCase().includes(query.toLowerCase())
      }
      renderItem={(theme, isSelected) => (
        <box flexDirection="row" gap={1}>
          <text fg={isSelected ? "#CDD6F4" : "#666677"}>
            {currentTheme.name === theme.name ? "●" : " "}
          </text>
          <text fg={isSelected ? "#CDD6F4" : "#AAAACC"}>{theme.name}</text>
        </box>
      )}
      onHighlight={(theme) => setTheme(theme)}
      onSelect={(theme) => {
        setTheme(theme);
        confirmedRef.current = true;
        close();
      }}
      getKey={(theme) => theme.name}
      placeholder="Search themes..."
    />
  );
}
