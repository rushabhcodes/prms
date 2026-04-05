"use client";

import { MoonStar, SunMedium } from "lucide-react";

import { useTheme } from "@/components/theme/theme-provider";
import { Button } from "@/components/ui/button";

export function DarkModeToggle() {
  const { mode, toggleMode } = useTheme();
  const isDark = mode === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      className="shrink-0"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      onClick={toggleMode}
    >
      {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
    </Button>
  );
}
