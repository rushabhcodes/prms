export const themeStorageKey = "prms-theme";
export const defaultTheme = "command-teal";
export const modeStorageKey = "prms-mode";
export const defaultMode = "light";

export const themeOptions = [
  {
    value: "command-teal",
    label: "Command Teal",
    description: "The default secure operations palette.",
    swatches: ["#0f766e", "#0ea5e9", "#e2f6f3"],
  },
  {
    value: "slate-grid",
    label: "Slate Grid",
    description: "Muted slate with cool command-center contrast.",
    swatches: ["#475569", "#38bdf8", "#e2e8f0"],
  },
  {
    value: "graphite-amber",
    label: "Graphite Amber",
    description: "Dark graphite accents with amber highlights.",
    swatches: ["#78350f", "#f59e0b", "#fef3c7"],
  },
  {
    value: "civic-blue",
    label: "Civic Blue",
    description: "Clean blue surfaces with administrative clarity.",
    swatches: ["#1d4ed8", "#60a5fa", "#dbeafe"],
  },
  {
    value: "emerald-file",
    label: "Emerald File",
    description: "A green-forward records desk look.",
    swatches: ["#047857", "#34d399", "#dcfce7"],
  },
  {
    value: "ruby-report",
    label: "Ruby Report",
    description: "Rich red accents for a bold review console.",
    swatches: ["#be123c", "#fb7185", "#ffe4e6"],
  },
  {
    value: "violet-ledger",
    label: "Violet Ledger",
    description: "A sharper violet palette for dense admin workflows.",
    swatches: ["#7c3aed", "#a78bfa", "#ede9fe"],
  },
  {
    value: "sandstone-case",
    label: "Sandstone Case",
    description: "Warm neutrals for a softer, paper-like interface.",
    swatches: ["#92400e", "#fbbf24", "#fef3c7"],
  },
] as const;

export type ThemeName = (typeof themeOptions)[number]["value"];
export type ColorMode = "light" | "dark";

export function isThemeName(value: string | null | undefined): value is ThemeName {
  return themeOptions.some((theme) => theme.value === value);
}

export function isColorMode(value: string | null | undefined): value is ColorMode {
  return value === "light" || value === "dark";
}
