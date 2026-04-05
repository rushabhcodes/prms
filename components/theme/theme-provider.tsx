"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  defaultMode,
  defaultTheme,
  isColorMode,
  isThemeName,
  modeStorageKey,
  themeOptions,
  themeStorageKey,
  type ColorMode,
  type ThemeName,
} from "@/lib/themes";

type ThemeContextValue = {
  theme: ThemeName;
  mode: ColorMode;
  setTheme: (theme: ThemeName) => void;
  setMode: (mode: ColorMode) => void;
  toggleMode: () => void;
  themes: typeof themeOptions;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: ThemeName, mode: ColorMode) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.mode = mode;
  window.localStorage.setItem(themeStorageKey, theme);
  window.localStorage.setItem(modeStorageKey, mode);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    if (typeof window === "undefined") {
      return defaultTheme;
    }

    const storedTheme = window.localStorage.getItem(themeStorageKey);
    return isThemeName(storedTheme) ? storedTheme : defaultTheme;
  });
  const [mode, setModeState] = useState<ColorMode>(() => {
    if (typeof window === "undefined") {
      return defaultMode;
    }

    const storedMode = window.localStorage.getItem(modeStorageKey);

    if (isColorMode(storedMode)) {
      return storedMode;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : defaultMode;
  });

  useEffect(() => {
    applyTheme(theme, mode);
  }, [theme, mode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      mode,
      setTheme: (nextTheme) => {
        setThemeState(nextTheme);
        applyTheme(nextTheme, mode);
      },
      setMode: (nextMode) => {
        setModeState(nextMode);
        applyTheme(theme, nextMode);
      },
      toggleMode: () => setModeState((current) => (current === "dark" ? "light" : "dark")),
      themes: themeOptions,
    }),
    [mode, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider.");
  }

  return context;
}
