export interface CommandContext {
  exit: () => void;
}

export interface Command {
  name: string;
  description: string;
  value: string;
  action?: (ctx: CommandContext) => void | Promise<void>;
}
