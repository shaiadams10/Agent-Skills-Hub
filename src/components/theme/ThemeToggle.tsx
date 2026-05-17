"use client";

import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useTheme } from "@/components/theme/ThemeProvider";

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleColorScheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="flex items-center justify-center border-[3px] border-on-background p-2 shadow-brutal-sm transition-all hover:bg-primary-container active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
    >
      <MaterialIcon name={isDark ? "light_mode" : "dark_mode"} />
    </button>
  );
}
