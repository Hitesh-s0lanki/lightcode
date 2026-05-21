import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { RootLayout } from "./layouts/root-layout";

const renderer = await createCliRenderer({ exitOnCtrlC: false });

// Guarantee terminal cleanup regardless of how the process exits
const cleanup = () => {
  try { renderer.destroy(); } catch {}
  process.exit(0);
};
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
process.on("uncaughtException", (err) => {
  try { renderer.destroy(); } catch {}
  console.error(err);
  process.exit(1);
});

createRoot(renderer).render(<RootLayout />);
