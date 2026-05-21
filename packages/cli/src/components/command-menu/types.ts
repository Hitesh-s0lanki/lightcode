import type { ToastOptions } from "../../providers/toast/types";
import type { DialogConfig } from "../../providers/dialog/types";

export interface CommandContext {
  exit: () => void;
  toast: { show: (opts: ToastOptions) => void };
  dialog: { open: (config: DialogConfig) => void; close: () => void };
}

export interface Command {
  name: string;
  description: string;
  value: string;
  action?: (ctx: CommandContext) => void | Promise<void>;
}
