import type { Command } from "./types";
import { ThemeDialogContent } from "../dialogs";

export const COMMANDS: Command[] = [
  {
    name: "new",
    description: "Start a new conversation",
    value: "/new",
    action: ({ toast }) => toast.show({ message: "Starting new conversation…", variant: "info" }),
  },
  {
    name: "agents",
    description: "Switch agents",
    value: "/agents",
    action: ({ toast }) => toast.show({ message: "Agents — coming soon", variant: "info" }),
  },
  {
    name: "models",
    description: "Select AI model for generation",
    value: "/models",
    action: ({ toast }) => toast.show({ message: "Models — coming soon", variant: "info" }),
  },
  {
    name: "sessions",
    description: "Browse past sessions",
    value: "/sessions",
    action: ({ toast }) => toast.show({ message: "Sessions — coming soon", variant: "info" }),
  },
  {
    name: "theme",
    description: "Change color theme",
    value: "/theme",
    action: ({ dialog }) =>
      dialog.open({ title: "Select Theme", children: <ThemeDialogContent /> }),
  },
  {
    name: "login",
    description: "Sign in with your browser",
    value: "/login",
    action: ({ toast }) => toast.show({ message: "Opening login…", variant: "info" }),
  },
  {
    name: "logout",
    description: "Sign out of your account",
    value: "/logout",
    action: ({ toast }) => toast.show({ message: "Logged out", variant: "success" }),
  },
  {
    name: "upgrade",
    description: "Buy more credits",
    value: "/upgrade",
    action: ({ toast }) => toast.show({ message: "Opening upgrade page…", variant: "info" }),
  },
  {
    name: "usage",
    description: "Open billing portal in your browser",
    value: "/usage",
    action: ({ toast }) => toast.show({ message: "Loading usage stats…", variant: "info" }),
  },
  {
    name: "exit",
    description: "Quit the application",
    value: "/exit",
    action: ({ exit }) => exit(),
  },
];
