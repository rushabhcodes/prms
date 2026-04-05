"use client";

import { Check, Palette } from "lucide-react";

import { useTheme } from "@/components/theme/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme, themes } = useTheme();
  const activeTheme = themes.find((item) => item.value === theme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0"
          aria-label="Change color theme"
          title={activeTheme ? `Theme: ${activeTheme.label}` : "Change color theme"}
        >
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[18rem]">
        <DropdownMenuLabel>Choose theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((item) => {
          const isActive = item.value === theme;

          return (
            <DropdownMenuItem
              key={item.value}
              className="gap-3 py-3"
              onSelect={() => setTheme(item.value)}
            >
              <div className="flex items-center gap-1.5">
                {item.swatches.map((swatch) => (
                  <span
                    key={swatch}
                    className="h-3.5 w-3.5 rounded-full border border-black/5"
                    style={{ backgroundColor: swatch }}
                  />
                ))}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-[color:var(--foreground)]">{item.label}</p>
                <p className="truncate text-xs text-[color:var(--muted-foreground)]">
                  {item.description}
                </p>
              </div>
              <Check
                className={cn(
                  "h-4 w-4 text-[color:var(--primary)] transition-opacity",
                  isActive ? "opacity-100" : "opacity-0",
                )}
              />
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
