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
      renderLabel={(theme, isSelected) =>
        `${currentTheme.name === theme.name ? "● " : "  "}${theme.name}`
      }
      renderLabelColor={(theme, isSelected, colors) =>
        isSelected ? colors.primary : colors.info
      }
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
