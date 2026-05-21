export type ThemeColors = {
  primary: string;
  planMode: string;
  selection: string;
  thinking: string;
  success: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  dialogSurface: string;
  thinkingBorder: string;
  dimSeparator: string;
};

export type Theme = {
  name: string;
  colors: ThemeColors;
};

export const THEMES: Theme[] = [
  {
    name: "Nightfox",
    colors: {
      primary: "#56D6C2",
      planMode: "#E97F5C",
      selection: "#3D59A6",
      thinking: "#B8D4FF",
      success: "#A3BE8C",
      error: "#EE6B6B",
      info: "#86B4D6",
      background: "#0D0D12",
      surface: "#131418",
      dialogSurface: "#191B23",
      thinkingBorder: "#1A2A3A",
      dimSeparator: "#222430",
    },
  },
  {
    name: "Catppuccin Mocha",
    colors: {
      primary: "#89B4FA",
      planMode: "#F38BA8",
      selection: "#313244",
      thinking: "#D183F9",
      success: "#A6E3A1",
      error: "#F38BA8",
      info: "#89DCEB",
      background: "#1E1E2E",
      surface: "#313244",
      dialogSurface: "#45475A",
      thinkingBorder: "#313244",
      dimSeparator: "#313244",
    },
  },
  {
    name: "Dracula",
    colors: {
      primary: "#FF79C6",
      planMode: "#FFB86C",
      selection: "#44475A",
      thinking: "#BD93F9",
      success: "#50FA7B",
      error: "#FF5555",
      info: "#8BE9FD",
      background: "#282A36",
      surface: "#3E404B",
      dialogSurface: "#44475A",
      thinkingBorder: "#6272A4",
      dimSeparator: "#414458",
    },
  },
  {
    name: "Tokyo Night",
    colors: {
      primary: "#7AA2F7",
      planMode: "#F7768E",
      selection: "#3B4261",
      thinking: "#BB9AF7",
      success: "#9ECE6A",
      error: "#F7768E",
      info: "#7AA2F7",
      background: "#1A1B26",
      surface: "#24283B",
      dialogSurface: "#2F3549",
      thinkingBorder: "#3B4261",
      dimSeparator: "#3B4261",
    },
  },
  {
    name: "Nord",
    colors: {
      primary: "#88C0D0",
      planMode: "#D08770",
      selection: "#434C5E",
      thinking: "#81A1C1",
      success: "#A3BE8C",
      error: "#BF616A",
      info: "#81A1C1",
      background: "#2E3440",
      surface: "#3B4252",
      dialogSurface: "#434C5E",
      thinkingBorder: "#4C566A",
      dimSeparator: "#4C566A",
    },
  },
  {
    name: "Gruvbox Dark",
    colors: {
      primary: "#83A598",
      planMode: "#E78A4E",
      selection: "#504945",
      thinking: "#D3869B",
      success: "#B8BB26",
      error: "#FB4934",
      info: "#83A598",
      background: "#282828",
      surface: "#32302F",
      dialogSurface: "#3C3836",
      thinkingBorder: "#504945",
      dimSeparator: "#504945",
    },
  },
  {
    name: "Rosé Pine",
    colors: {
      primary: "#C4A7E7",
      planMode: "#EBBCBA",
      selection: "#2A283E",
      thinking: "#D4A5A5",
      success: "#9CCFD8",
      error: "#EB6F92",
      info: "#3E8FB0",
      background: "#191724",
      surface: "#1F1D2E",
      dialogSurface: "#26233A",
      thinkingBorder: "#2A283E",
      dimSeparator: "#2A283E",
    },
  },
  {
    name: "One Dark",
    colors: {
      primary: "#61AFEF",
      planMode: "#E06C75",
      selection: "#3E4452",
      thinking: "#C678DD",
      success: "#98C379",
      error: "#E06C75",
      info: "#56B6C2",
      background: "#282C34",
      surface: "#21252B",
      dialogSurface: "#3E4452",
      thinkingBorder: "#3E4452",
      dimSeparator: "#3E4452",
    },
  },
  {
    name: "Kanagawa",
    colors: {
      primary: "#7FB4CA",
      planMode: "#FF9E64",
      selection: "#2D3F76",
      thinking: "#938AA9",
      success: "#6EAD0E",
      error: "#E82424",
      info: "#7FB4CA",
      background: "#1F1F28",
      surface: "#2A2A37",
      dialogSurface: "#363646",
      thinkingBorder: "#2D3F76",
      dimSeparator: "#2D3F76",
    },
  },
  {
    name: "Hacker Terminal",
    colors: {
      primary: "#00FF00",
      planMode: "#00CC00",
      selection: "#003300",
      thinking: "#00AA00",
      success: "#00FF00",
      error: "#FF0000",
      info: "#00FFFF",
      background: "#000000",
      surface: "#0D0D0D",
      dialogSurface: "#1A1A1A",
      thinkingBorder: "#003300",
      dimSeparator: "#0A0A0A",
    },
  },
];

export const DEFAULT_THEME = "Nightfox";
