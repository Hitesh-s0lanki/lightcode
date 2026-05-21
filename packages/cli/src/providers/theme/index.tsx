import {
  createContext, useContext, useState, useCallback, useEffect, type ReactNode,
} from "react";
import { join } from "node:path";
import { homedir } from "node:os";
import type { Theme } from "../../theme";
import { THEMES, DEFAULT_THEME } from "../../theme";

type ThemeContextValue = {
  currentTheme: Theme;
  colors: Theme["colors"];
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const PREFS_PATH = join(homedir(), ".lightcode", "preferences.json");

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(
    () => THEMES.find((t) => t.name === DEFAULT_THEME)!,
  );

  // Load persisted theme on mount
  useEffect(() => {
    Bun.file(PREFS_PATH).text().then((data) => {
      const { theme: name } = JSON.parse(data) as { theme: string };
      const saved = THEMES.find((t) => t.name === name);
      if (saved) setCurrentTheme(saved);
    }).catch(() => {/* first run — no prefs file yet */});
  }, []);

  const handleSetTheme = useCallback((theme: Theme) => {
    setCurrentTheme(theme);
    // Fire-and-forget persistence
    Bun.write(PREFS_PATH, JSON.stringify({ theme: theme.name }, null, 2)).catch(() => {});
  }, []);

  return (
    <ThemeContext.Provider value={{ currentTheme, colors: currentTheme.colors, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
