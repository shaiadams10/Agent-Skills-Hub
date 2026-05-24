# Motion design system — Agent Skills Hub

Unified motion language for the Cyber‑Vandal / neo‑brutalist UI. Implementation lives in `src/lib/motion/` and `src/components/motion/`.

## Principles

1. **Motion communicates meaning** — expand/collapse shows hierarchy; modals focus attention; press states confirm input.
2. **Fast feels instant** — microinteractions ≤ 200ms; never block clicks.
3. **Large transitions guide** — modals/sections 300–600ms with expo-out easing.
4. **Reinforce spatial relationships** — panels scale/slide from origin; cards lift on hover.
5. **Never slow power users** — no mandatory delays; `prefers-reduced-motion` collapses to instant opacity or none.
6. **Alive, not distracting** — one primary easing curve; no parallax or gratuitous bounce.

## Technical standards

| Rule | Rationale |
|------|-----------|
| Animate **transform** and **opacity** first | Compositor-friendly, 60 FPS |
| Avoid **width/height/top/left** when possible | Layout thrashing |
| Use **CSS grid `grid-template-rows`** for accordions | Collapse without JS height |
| Framer **`layout`** only when needed | List reflow; disable when `reduced` |
| **`height: auto`** only for small text reveals | `ReadMoreReveal` — keep content short |
| **`motion-reduce:`** on all decorative CSS transitions | Tailwind respects OS setting |
| **`useReducedMotion` / `useMotionPrefs`** in Framer components | Instant durations when reduced |
| Theme morph **skipped** when reduced | `playThemeMorphTransition` |

## Tokens

| Token | Value | Use |
|-------|-------|-----|
| `instant` | 80ms | Reduced-motion substitute |
| `fast` | 180ms | Icon spin feel, tooltip |
| `normal` | 300ms | Fades, modal enter |
| `moderate` | 380ms | Grid item enter |
| `slow` | 520ms | Theme content restore |
| `section` | 600ms | Accordions, chevrons |
| Ease out | `cubic-bezier(0.22, 1, 0.36, 1)` | Default enter |
| Ease in | `cubic-bezier(0.4, 0, 0.2, 1)` | Exit |

Import from `@/lib/motion` or `@/lib/motion/tokens`.

## Primitives

| Component / export | Purpose |
|--------------------|---------|
| `MotionFade` | Opacity (+ optional slide) enter/exit |
| `MotionCollapse` | Grid-row accordion panel |
| `MotionChevron` | Rotating expand icon |
| `ReadMoreReveal` | Short description expand (height — exception) |
| `ExpandableRevealGrid` | Show more + staggered grid items |
| `BrutalModal` | Dialog overlay + panel |
| `brutalLift` / `brutalPress` / `brutalPressSm` | Button affordance classes |
| `fadeVariants`, `fadeScalePanelVariants`, … | Framer preset objects |

## When to use what

- **Buttons, links, cards** → `brutalPress` / `brutalLift` + `brutalColorHover`
- **Modal, drawer** → `BrutalModal` (do not hand-roll fixed overlays)
- **Section hide/show** → `MotionCollapse` + `MotionChevron`
- **Inline tooltip / banner body** → `MotionFade` with `slide`
- **Show more grid** → `ExpandableRevealGrid`
- **Read more text (1–3 lines)** → `ReadMoreReveal`
- **Loading** → `animate-spin` on icon only (no full-page spinners)
- **Page route change** → none today (Next.js RSC); optional later with shared layout fade

---

## UX motion audit (full app)

Legend: ✅ animated · ⚠️ partial / inconsistent · ❌ abrupt · 🔮 recommended

### Global / shell

| Interaction | Location | Status | Notes |
|-------------|----------|--------|-------|
| Theme toggle morph | `ThemeMorphOverlay`, `globals.css` | ✅ | SVG path + color crossfade; respects reduced motion |
| Theme content scale | `#theme-content-root` | ✅ | transform + filter restore |
| Nav link hover/active | `AppShell` | ⚠️ | `transition-colors` only |
| Mobile menu open/close | `AppShell` | ❌ → 🔮 | Instant mount; use `MotionFade` + backdrop |
| Page transitions | Next routes | ❌ | Acceptable for local tool; optional layout fade |
| Scrollbar | `globals.css` | ⚠️ | Color only, no motion |
| Selection highlight | `globals.css` | — | Static |

### Home (`/`)

| Interaction | Status | Notes |
|-------------|--------|-------|
| CTA buttons hover/press | ⚠️ | Inline `transition-all` — migrate to `brutalPress` |
| Hero image | — | `transition: none` on media (intentional) |

### Setup (`/setup`)

| Interaction | Status | Notes |
|-------------|--------|-------|
| Agent card select | ⚠️ | Hover lift + active press; no selected-state motion |
| Save button | ⚠️ | Press only |
| Toggle selection | ❌ | Border/color snap — 🔮 brief scale or ring pulse |

### Installed (`/installed`)

| Interaction | Status | Notes |
|-------------|--------|-------|
| Initial load | ❌ | Text-only "Scanning…" — 🔮 skeleton or pulse |
| Sync / Re-check buttons | ⚠️ | Spin icon when loading; no button state morph |
| Error banner | ❌ | Abrupt appear — use `MotionFade` |
| `CollapsibleSkillSection` | ✅ | Grid collapse + chevron 600ms |
| `ExpandableRevealGrid` | ✅ | Framer enter/exit + layout |
| `UnselectedAgentNotice` collapse | ❌ → ✅ | Was instant; now `MotionCollapse` |
| `InfoTip` tooltip | ❌ → ✅ | Was instant; now `MotionFade` |
| Empty hints | — | Static dashed box (OK) |
| Scan status line update | ❌ | Text swap — 🔮 crossfade optional |

### Skill card / detail

| Interaction | Status | Notes |
|-------------|--------|-------|
| Card hover lift | ⚠️ | `transition-all` — prefer `brutalLift` |
| Git update glow | ✅ | `skill-update-glow` keyframes (decorative; OK) |
| Delete confirm | ❌ → 🔮 | Inline overlay without `BrutalModal` — migrate |
| Read more description | ✅ | `ReadMoreReveal` (height exception) |
| Delete in-flight | ⚠️ | Spinner only |
| Detail back link | ⚠️ | Arrow `group-hover` translate |
| Skill detail actions | ⚠️ | Press/hover colors |

### Project library

| Interaction | Status | Notes |
|-------------|--------|-------|
| `ProjectLibraryCard` | ⚠️ | Hover lift + arrow nudge |
| Project detail grid | — | Static render |

### Modals & forms

| Interaction | Status | Notes |
|-------------|--------|-------|
| `AddProjectModal` | ✅ | `BrutalModal` |
| `AddProjectForm` browse/submit | ⚠️ | Press + spinners |
| Native folder picker | — | OS dialog (no app motion) |
| Form validation | ❌ | Error text snap — 🔮 `MotionFade` on errors |

### System modules / badges

| Interaction | Status | Notes |
|-------------|--------|-------|
| `SystemModuleCard` | ⚠️ | Same as skill card |
| `InstallOriginBadge` | — | Static |
| Agent icons | — | Static |

### Not in app yet (future)

| Interaction | Recommendation |
|-------------|----------------|
| Toasts | `MotionFade` slide from top; 3s auto dismiss |
| Drag reorder | Only if needed; use transform |
| Sort/filter lists | `AnimatePresence` + `layout` or FLIP |
| Skeleton loading | Pulse opacity on placeholder blocks |
---

## Performance checklist

- [ ] Only `transform` / `opacity` on hot paths (scroll, hover storms)
- [ ] `will-change` sparingly (theme morph wrap only)
- [ ] No `transition-all` on large cards (lists repaint)
- [ ] Disable Framer `layout` when `useMotionPrefs().reduced`
- [ ] Portal modals (`BrutalModal`) to avoid clipping
- [ ] Test with **Reduce motion** enabled in OS settings
- [ ] Test on low-end laptop: Installed page with 20+ cards

## Adding motion to a new feature

1. Pick tier: **micro** (press) · **feedback** (fade) · **structural** (collapse/modal).
2. Import tokens/presets — do not copy cubic-bezier literals.
3. Wrap enter/exit in `MotionFade` or use `BrutalModal`.
4. Add `motion-reduce:` variants for CSS transitions.
5. Document exceptions in component JSDoc if animating height.

## Migration backlog (priority)

1. **P0** — SkillCard delete → `BrutalModal`
2. **P1** — Standardize buttons: `installed-toolbar`, CTAs → `brutalPress`
3. **P1** — `AppShell` mobile drawer animation
4. **P2** — Loading skeleton on `/installed`
5. **P2** — Setup card selection feedback
6. **P3** — Optional route fade via `template.tsx`
