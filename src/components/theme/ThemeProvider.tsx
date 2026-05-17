"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { applySchemeToDocument } from "@/lib/theme/apply-scheme";
import { type ColorScheme, THEME_STORAGE_KEY } from "@/lib/theme/constants";
import { playThemeMorphTransition } from "@/lib/theme/play-morph-transition";
import { ThemeMorphOverlay, THEME_CONTENT_ROOT_ID } from "@/components/theme/ThemeMorphOverlay";

type ThemeContextValue = {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleColorScheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readDomScheme(): ColorScheme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(readDomScheme);

  const setColorScheme = useCallback((scheme: ColorScheme) => {
    setColorSchemeState(scheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, scheme);
    } catch {
      /* private browsing */
    }

    void playThemeMorphTransition(scheme);

    void fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ colorScheme: scheme }),
    }).catch(() => undefined);
  }, []);

  const toggleColorScheme = useCallback(() => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  }, [colorScheme, setColorScheme]);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      let scheme: ColorScheme = "light";

      try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored === "dark" || stored === "light") {
          scheme = stored;
        }
      } catch {
        /* ignore */
      }

      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = (await res.json()) as { colorScheme?: string };
          if (data.colorScheme === "dark" || data.colorScheme === "light") {
            scheme = data.colorScheme;
            try {
              localStorage.setItem(THEME_STORAGE_KEY, scheme);
            } catch {
              /* ignore */
            }
          }
        }
      } catch {
        /* offline */
      }

      if (cancelled) return;

      setColorSchemeState(scheme);
      applySchemeToDocument(scheme);
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      colorScheme,
      setColorScheme,
      toggleColorScheme,
    }),
    [colorScheme, setColorScheme, toggleColorScheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <ThemeMorphOverlay />
      <div id={THEME_CONTENT_ROOT_ID} className="theme-content-root min-h-screen">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
