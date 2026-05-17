# Dark / light mode transition — where to work

This app morphs between color schemes with an SVG path animation instead of an instant class flip. Use this map when changing timing, easing, or visuals.

## Entry points (start here)

| File | Role |
|------|------|
| `src/components/theme/ThemeToggle.tsx` | Header button; calls `toggleColorScheme()` |
| `src/components/theme/ThemeProvider.tsx` | React context; `setColorScheme` → `playThemeMorphTransition` + persists to `localStorage` and `PUT /api/settings` |
| `src/lib/theme/play-morph-transition.ts` | Dispatches to registered runner or falls back to `applySchemeToDocument` |

## Morph animation (main customization surface)

| File | Role |
|------|------|
| `src/components/theme/ThemeMorphOverlay.tsx` | Full-screen overlay; registers morph runner via `setThemeMorphRunner` |
| `src/lib/theme/morph-paths.ts` | SVG path geometry for the wipe |
| `src/lib/theme/animate-path.ts` | Path interpolation / frame timing |
| `src/lib/theme/scheme-colors.ts` | Colors sampled during the transition |
| `src/lib/theme/apply-scheme.ts` | Applies `dark` class on `<html>`; `prefersReducedMotion()` shortcut |

## Flash prevention (first paint)

| File | Role |
|------|------|
| `src/lib/theme/inline-script.ts` | Inline script in root layout — reads storage before paint |
| `src/lib/theme/constants.ts` | `THEME_STORAGE_KEY`, `ColorScheme` type |

## Layout wiring

- `src/app/layout.tsx` — `ThemeProvider`, `ThemeMorphOverlay`, inline script
- Root content wrapper id: `THEME_CONTENT_ROOT_ID` in `ThemeMorphOverlay.tsx` (morph clips around main shell)

## Flow (high level)

```
ThemeToggle click
  → ThemeProvider.toggleColorScheme / setColorScheme
  → playThemeMorphTransition(nextScheme)
  → ThemeMorphOverlay runner (if mounted & motion allowed)
       → animate paths + swap scheme mid/after animation
  → applySchemeToDocument (immediate if reduced motion or no runner)
```

## Tips

- Tweak duration/easing in `animate-path.ts` and overlay styles in `ThemeMorphOverlay.tsx`.
- To disable morph globally, short-circuit in `play-morph-transition.ts` or always call `applySchemeToDocument`.
- Test with **prefers-reduced-motion** — morph is skipped and scheme applies instantly.
