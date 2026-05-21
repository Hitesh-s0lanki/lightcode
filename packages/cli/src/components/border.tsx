import type { BorderConfig } from "@opentui/core";

export const NoBorder: BorderConfig = {
  borderStyle: "single",
  border: false,
};

export const SideBorder: BorderConfig = {
  borderStyle: "single",
  border: ["left", "right"],
};
