import { ThemeProvider } from "../providers/theme";
import { KeyboardLayerProvider } from "../providers/keyboard-layer";
import { DialogProvider } from "../providers/dialog";
import { ToastProvider } from "../providers/toast";
import { RouterProvider, useLocation } from "../providers/router";
import { ThemedRoot } from "./themed-root";
import { Home } from "../screens/home";
import { NewSession } from "../screens/new-session";
import { Session } from "../screens/session";

function Routes() {
  const { route } = useLocation();

  if (route === "/") return <Home />;
  if (route === "/sessions/new") return <NewSession />;
  if (route.startsWith("/sessions/")) return <Session />;
  return <Home />;
}

function Providers() {
  return (
    <ThemeProvider>
      <KeyboardLayerProvider>
        <DialogProvider>
          <ToastProvider>
            <ThemedRoot>
              <Routes />
            </ThemedRoot>
          </ToastProvider>
        </DialogProvider>
      </KeyboardLayerProvider>
    </ThemeProvider>
  );
}

export function RootLayout() {
  return (
    <RouterProvider>
      <Providers />
    </RouterProvider>
  );
}
