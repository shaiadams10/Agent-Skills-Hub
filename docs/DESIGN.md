---
name: Cyber-Terminal Aesthetic
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#cdc3d0'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#968e9a'
  outline-variant: '#4a454f'
  surface-tint: '#dbb8ff'
  primary: '#ecd7ff'
  on-primary: '#3f2160'
  primary-container: '#d8b4fe'
  on-primary-container: '#604283'
  inverse-primary: '#6f5092'
  secondary: '#ffb0cd'
  on-secondary: '#640039'
  secondary-container: '#aa0266'
  on-secondary-container: '#ffbad3'
  tertiary: '#ffd5d1'
  on-tertiary: '#68000a'
  tertiary-container: '#ffaea8'
  on-tertiary-container: '#a40217'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#efdbff'
  primary-fixed-dim: '#dbb8ff'
  on-primary-fixed: '#29074a'
  on-primary-fixed-variant: '#573878'
  secondary-fixed: '#ffd9e4'
  secondary-fixed-dim: '#ffb0cd'
  on-secondary-fixed: '#3e0022'
  on-secondary-fixed-variant: '#8c0053'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#930013'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display:
    fontFamily: Space Mono
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Space Mono
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Mono
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Space Mono
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  title-lg:
    fontFamily: Space Mono
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Space Mono
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Space Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
  label-lg:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  code:
    fontFamily: Space Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  border_width: 3px
---

# Design system — Agent Skills Hub

Implementation: **light mode** uses the Cyber-Vandal / Retro Pixel palette in `src/app/globals.css` (`@theme`). **Dark mode** applies the **Cyber-Terminal** tokens below via the `.dark` class on `<html>` (same file). Toggle in the app header; preference persists in `~/.agent-skills-hub/settings.json` and `localStorage`.

## Brand & style

This design system uses a **Cyberpunk Terminal** aesthetic—a fusion of retro-computing “hacker” vibes and modern, high-fidelity minimalism. The atmosphere is nocturnal, technical, and high-energy, designed for power users who value precision and a distinct digital identity.

The style is defined by **Sharp Brutalism**:

- **Strict geometry:** No border radii; every element is perfectly rectangular.
- **High contrast:** Near-black backgrounds punctuated by vibrant, luminous accents.
- **Digital texture:** A “boxy” and “pixely” feel via heavy borders and monospaced typography, avoiding the softness of modern consumer SaaS.
- **Professional edge:** Clean execution with generous negative space and a rigorous layout grid for usability.

## Colors (dark / Cyber-Terminal)

The palette uses a **Total Dark** foundation. YAML front matter documents the original Stitch tokens; **runtime dark mode** in `globals.css` uses slightly **lifted surfaces** (`#1c1b22` background, not pure `#0e0e0e`) and **dark header bands** for `*-fixed` roles (`primary-fixed`, `tertiary-fixed`, etc.) with matching `on-*-fixed` text so card headers never use light-on-light.

- **Primary & secondary:** High-priority actions and brand moments. `#d8b4fe` (primary-container) is the main interactive signal; `#ecd7ff` (primary) for emphasis text and scrollbar thumb.
- **Accents:** Gradients reserved for hero elements, progress bars, or active states (not yet used app-wide).
- **Borders:** Stay visible in dark mode. Use `#000000` for structural separation on elevated surfaces; `#333333` / `outline-variant` for subtle containment on near-black backgrounds. UI borders use semantic `border-on-background` (light gray `#e5e2e1` on modules) or `border-outline` where appropriate.
- **Status:** Tertiary red tones for errors, destructive actions, and critical alerts only.

Prose sometimes references `#0c0c0c` for infinite depth; implemented **background/surface** tokens use `#131313` per the color spec.

## Typography

**Space Mono** is used exclusively (see `layout.tsx` + `--font-body` / `--font-display`).

- **Weight:** Bold (700) for headings and interactive labels; regular (400) for body copy.
- **Rhythm:** Tighter line heights on headlines for a blocky, terminal look.
- **Styling:** Uppercase for labels and small metadata.

| Token | Size | Weight | Notes |
|-------|------|--------|--------|
| display | 48px | 700 | line-height 1.1, letter-spacing -0.04em |
| headline-lg | 32px | 700 | desktop |
| headline-lg-mobile | 24px | 700 | mobile |
| headline-md | 24px | 700 | |
| title-lg | 20px | 700 | |
| body-lg | 16px | 400 | line-height 1.6 |
| body-md | 14px | 400 | |
| label-lg | 12px | 700 | uppercase, letter-spacing 0.1em |
| code | 13px | 400 | |

## Layout & spacing

Fixed-fluid hybrid: rigid grid on desktop, hard spacing.

- **4px rule:** All spacing in multiples of 4px.
- **Box model:** Containers feel like physical modules; **3px** solid borders (`border_width`).
- **Grid:** 16px gutters; max content width **1280px** on desktop (app shell uses `max-w-[1440px]` on some pages—align over time if needed).

## Elevation & depth

Depth via **physical offsets** and **tonal layering**, not soft blur.

- **Solid shadows:** Hard-edged, 0 blur. Dark mode uses `--color-shadow-brutal: #000000` for `shadow-brutal*` utilities. Optional purple tint `rgba(216, 180, 254, 0.2)` for high-level interactive elements.
- **Offset:** Standard lift = 4px shift + 4px shadow (see `shadow-brutal`, `shadow-brutal-lg`).
- **Layering (dark):**
  - Level 0: `background` (`#131313`)
  - Level 1: `surface` / `surface-container-low` with 3px border
  - Level 2: `surface-container` / `surface-container-high` for nested cards and inputs

## Shapes

- **No radii** on terminal/brutalist UI (0px). Light theme still exposes small radius tokens for legacy Tailwind defaults—prefer sharp corners on new components.
- **Line work:** 3px strokes for structure; 1px only for secondary detail, never rounded caps.

## Components

- **Buttons:** Rectangular, 3px border. Primary uses primary/primary-container; hover shifts 2px up-left with shadow collapse (see existing `active:translate` patterns).
- **Inputs:** `surface-container-low` background, 3px border (`outline` / `#333333` feel). Focus: primary-container border (`#d8b4fe`).
- **Chips:** Sharp boxes, `surface-container-high` bg; active = 3px primary border.
- **Cards:** `surface` + 3px border; featured cards may use gradient border (future).
- **Lists:** 3px separators; row hover = `surface-bright`.
- **Checkboxes/radios:** Square only; checked = primary fill (future).
- **Scrollbars (dark):** 8px wide, sharp; track `surface-bright`, thumb `primary`, hover `primary-container`.

## Theme transition

Toggling light/dark runs a **Codrops-style SVG morph** ([morphing page transition](https://tympanus.net/codrops/2017/08/08/morphing-page-transition/)): a wave overlay in the *target* background color washes over the UI (~520ms), the theme swaps on `<html>` while covered, then the wave retreats (~520ms) as `#theme-content-root` scales back up. Path morphing uses `flubber`. Respects `prefers-reduced-motion` (instant swap).
