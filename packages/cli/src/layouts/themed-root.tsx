import type { ReactNode } from "react";
import { useTheme } from "../providers/theme";

export function ThemedRoot({ children }: { children: ReactNode }) {
  const { colors } = useTheme();

  return (
    <box
      width="100%"
      height="100%"
      flexDirection="column"
      backgroundColor={colors.background}
    >
      {children}
    </box>
  );
}
