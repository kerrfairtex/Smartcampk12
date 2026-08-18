# Command Deck — Futuristic School Ops Console

A full redesign of a legacy Student Information System admin dashboard into a **galactic command-console interface**. Every module (School, Students, Users, Scheduling, Grades, Attendance, Activities, Discipline, Accounting, Billing, Food Service, Resources) is reimagined as a physical instrument docked on a ship's console rather than a flat clip-art icon in a list.

---

## 1. Concept

The source app was a standard mobile admin list: circular clip-art icons, a plain white/black list, default Material-style rows. The brief was to move it toward a **"futureverse" aesthetic** — professional, realistic, sci-fi — without literally re-skinning it as "space school." The result treats the dashboard as a **ship's ops deck**: each module is a hexagonal docking port with an orbiting ring, a breathing status pulse, and a live data readout, sitting on a dark HUD grid with an ambient scanline sweep.

**Design thesis:** *the interface is a control panel you operate, not a menu you scroll.*

---

## 2. Design tokens

| Token | Value | Usage |
|---|---|---|
| `--bg-void` | `#05070D` | Base background |
| `--bg-panel` | `#0D1220` @ 60–70% opacity + blur | Glass panels, HUD bar |
| `--signal-cyan` | `#4CE0D2` | Primary / neutral-informational accent |
| `--signal-violet` | `#7C5CFC` | Secondary accent, admin/system modules |
| `--signal-amber` | `#FFB454` | Needs-attention state (billing, grades pending) |
| `--signal-red` | `#FF6B6B` | Alert state (discipline, open cases) |
| `--text-primary` | `#E8ECF7` | Body text |
| `--text-muted` | `#7C88A6` | Secondary labels, units |

**Typography roles**
- **Display** — Space Grotesk or Orbitron. Used only for the HUD title and large numerals. Never for body copy.
- **Body** — Inter. All labels, descriptions, UI chrome.
- **Data/mono** — JetBrains Mono. Stat readouts, IDs, timestamps, anything numeric — mono gives it an instrument-panel feel and stat digits don't jitter in width as they count up.

**Color-as-status system:** the accent color assigned to each module isn't decorative — it doubles as a status signal (cyan = informational, violet = system/admin, amber = attention needed, red = active alert). This means the palette itself communicates urgency at a glance, before the user reads a single label.

---

## 3. Icon system

Legacy icons were flat, cartoon-style clip-art (chalkboard, graduation cap, calendar with a bell, etc.), inconsistent in style and weight. These are replaced with a **single generated icon set**, rendered once in a batch/session to guarantee visual consistency across the whole console.

### Master prompt template
```
A single centered icon of [SUBJECT], rendered as a physical instrument
on a starship command console — brushed titanium and dark glass housing,
edge-lit with a thin cyan or violet emissive line, soft volumetric rim
light, subtle holographic data readout floating just above the object,
45° isometric angle, dark void background with faint grid, physically
based rendering, high detail, no text, no people, square 1:1 crop,
consistent lighting across a set.
```

### Subject substitutions

| Module | Subject swap |
|---|---|
| School | Obsidian hexagonal institution seal / beacon |
| Students | Cluster of three glowing biometric ID chips |
| Users | Rotating access-key / keycard hologram |
| Scheduling | Floating ring-calendar with orbiting time markers |
| Grades | Faceted crystal shard with internal rank-glow |
| Attendance | Scan-gate arch with fingerprint/retina beam |
| Activities | Orbit diagram — small satellites around a core |
| Discipline | Shield etched with a single warning chevron |
| Accounting | Stacked ledger plates with a glowing balance line |
| Student Billing | Floating credit chip with a value readout |
| Food Service | Sealed ration capsule on a heating pad glow |
| Resources | Rotating globe/hologram of a network |

**Rule:** generate the full set in one session with the same seed/style reference so lighting, material, and framing stay identical across all twelve icons. Mixing styles across icons is the single fastest way to make the console feel unfinished.

---

## 4. Signature interaction — the "docking port"

Rather than an icon + label card, each module is a **hex docking port**:

1. **Idle** — orbit ring sits at ~30% opacity, dashed, static. Status pulse dot breathes on a 2.2s cycle.
2. **Hover / focus** — the ring completes to full opacity, switches from dashed to solid, and rotates 90°. The tile lifts 2px and gains a soft glow in its assigned accent color. A data readout (live count, e.g. "97% today") is always visible beneath the label, animated with a count-up on first render.
3. **Active / pressed** — reserved for a brief "warp" transition into the module (scale down + fade, not implemented in the static demo — see Roadmap).

This one interaction is the console's signature element — everything else (grid, HUD bar, background grid) stays quiet and disciplined around it.

---

## 5. Motion principles

| Moment | Motion | Notes |
|---|---|---|
| Page load | Docking ports stagger in, ~60ms offset each, 480ms ease, translateY(10px) → 0 | Orchestrated, not scattered |
| Ambient | Scanline sweep drifts top-to-bottom across the background every 6s | Very low opacity — atmosphere, not distraction |
| Idle status | Pulse dot breathes (scale + opacity) every 2.2s | Signals "live," not decorative |
| Hover | Ring completes + rotates, tile lifts, glow appears | 220ms ease, no bounce/overshoot |
| Data | Stat numbers count up from 0 on mount (cubic ease-out, ~700ms) | Never re-triggers on hover — only on data change |

**Accessibility:** every animated rule is wrapped so `prefers-reduced-motion: reduce` disables the ambient sweep and pulse entirely and collapses transitions to instant state changes. Motion is additive polish, never load-bearing for understanding the UI.

---

## 6. Component architecture (React + shadcn/ui)

```
src/
  components/
    ui/                     # shadcn/ui primitives (Card, Tooltip, Command, Badge)
    console/
      HudBar.tsx             # top status bar — school/cycle/phase selectors, jump-to search
      DockingPort.tsx        # single module tile (icon, ring, pulse, readout)
      ConsoleGrid.tsx        # responsive grid of DockingPort instances
      Counter.tsx            # animated count-up primitive used in readouts
  lib/
    modules.ts                # module registry: key, label, icon, color, stat source
    motion.ts                 # shared easing curves / durations
  styles/
    tokens.css                # design tokens as CSS custom properties
    console.css                # docking-port + HUD keyframes
```

**Module registry pattern:** modules are defined as data, not JSX — `{ key, label, icon, color, statQuery }` — so adding a new console module (e.g. "Health Records") means adding one object, not writing new markup.

---

## 7. Tech stack

- **React** (Vite) — component runtime
- **shadcn/ui** — `Command` (⌘K module search), `Tooltip` (readout details on hover), `Badge` (status chips in HUD bar)
- **Tailwind CSS** — utility layer; design tokens wired in as CSS variables so Tailwind arbitrary values (`bg-[var(--signal-cyan)]`) stay consistent with the token table above
- **lucide-react** — interim/base icon set until the generated instrument icons are dropped in
- **framer-motion** *(recommended addition)* — replaces the raw CSS keyframes used in the static demo with spring-based stagger and page-load orchestration
- **JetBrains Mono / Space Grotesk / Inter** — via `next/font` or self-hosted `@font-face`

---

## 8. Getting started

```bash
npm create vite@latest command-deck -- --template react-ts
cd command-deck
npx shadcn@latest init
npx shadcn@latest add card tooltip command badge
npm install lucide-react framer-motion
npm run dev
```

Drop `tokens.css` in `src/styles`, import it once in `main.tsx`, then build `DockingPort.tsx` against the design spec in Section 4–5 above.

---

## 9. Roadmap

- [ ] Swap `lucide-react` placeholders for the generated instrument icon set (Section 3)
- [ ] "Warp" transition on module activation (scale/fade into the sub-page)
- [ ] Live data binding — replace static `stat` values with real API/query results
- [ ] Dark/void theme is default; evaluate a "daylight ops" high-contrast alt palette for accessibility preference
- [ ] ⌘K command palette wired to `shadcn/Command` for keyboard-first navigation across all modules
- [ ] Per-module detail view inheriting the same docking-port visual language (ring, glow, mono readouts) at a larger scale

---

## 10. Design rationale (why not literal school iconography)

The original screens (chalkboard, graduation cap, calendar-with-bell) read as generic edtech clip-art — instantly forgettable and inconsistent in weight/style. Reframing every module as a piece of ship instrumentation:

- Gives the icon set a **single coherent material language** (titanium, glass, emissive line) instead of twelve unrelated illustration styles
- Turns routine admin data (attendance %, open discipline cases, invoice count) into **live console readouts**, which makes the same information feel operational rather than administrative
- Lets **color do double duty** as both brand accent and status signal, which a literal school palette (reds, blues, mascot colors) can't do without looking arbitrary
