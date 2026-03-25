# Signal — Token-driven Design System POC

A Next.js 15 proof of concept: **shadcn-style components styled with native CSS** and **design tokens** aligned for Figma Variables. Semantic variables live in **`app/tokens.css`**. **`app/globals.css`** wires the cascade (imports, derived variables, keyframes, a few utilities) — it is not the token source of truth.

Run **`npm run tokens`** to export JSON for Figma (see [Figma export](#figma-export)).

---

## Stack

- **Next.js 15** — App Router, React 19  
- **Native CSS** — `@layer` (reset → base → components → utilities), no Tailwind runtime  
- **shadcn/ui–compatible components** — Radix and Base UI primitives; **`clsx`** for `cn()` (no `tailwind-merge` / CVA)  
- **next-themes** — Light / dark via the `class` strategy (`ThemeProvider` on `<html>`)

---

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the component gallery. Use the theme toggle (top-right) for light and dark.

---

## Architecture: shadcn + design tokens + native CSS

### Mental model

| Piece | Responsibility |
|--------|------------------|
| **`app/tokens.css`** | **Figma-oriented theme tokens:** `:root` (light + shared structure), **`.dark`** (color overrides), **`--primitive-*` palette**, typography scale, motion **durations/eases**, radius, shadows, spacing, data-syntax colors, z-index, etc. No component rules. |
| **`app/globals.css`** | **Application shell:** `@import` order (layers → tokens → reset → base → **per-component CSS**), **derived** `:root` values (e.g. `--transition-colors` built from duration/ease), **keyframes**, **Sonner** overrides (unlayered), **`@layer utilities`** (`.focus-ring`, `sr-only`, minimal text/align helpers). |
| **`app/styles/layers.css`** | Declares `@layer` order: `reset, base, components, utilities`. |
| **`app/styles/reset.css`**, **`base.css`** | Global box model, typography defaults, `:focus-visible`. |
| **`app/styles/components/*.css`** | **One file per UI area** (e.g. `button.css`, `input.css`). Rules target **semantic class names** (`.btn`, `.input`, `[data-slot="…"]`) that match what **`components/ui/*`** apply via `className={cn("…")}`. |

shadcn components are **not** themed with Tailwind utility strings. They use **token-backed declarations**:

```css
/* Example: app/styles/components/button.css */
.btn {
  border-radius: var(--radius-control);
  transition: var(--transition-colors);
}
```

…and **TSX** attaches those classes:

```tsx
<ButtonPrimitive className={cn("btn focus-ring", variantClass, className)} />
```

**Dark mode:** `next-themes` adds `.dark` on `<html>`. Variables overridden in **`tokens.css`** under `.dark { … }` flow into every `var(--…)` usage automatically.

### Import order (critical)

`globals.css` must load **`tokens.css` before** component CSS so `var(--background)`, `var(--radius-control)`, etc. resolve. Order today:

1. `layers.css`  
2. `tokens.css`  
3. `reset.css` → `base.css`  
4. All `styles/components/*.css` (alphabetical is fine; keep list maintainable)  
5. Unlayered blocks in `globals.css` (keyframes, Sonner, selected-row checkbox tweak)  
6. `@layer utilities` (focus ring, animations, small helpers)

`app/layout.tsx` imports **`@/app/globals.css`** once; that pulls in the whole tree.

### What belongs in `tokens.css` vs `globals.css`

- **`tokens.css`:** Values you want **1:1 (or close) with Figma Variables** — colors, type scale, radii, shadows, spacing, motion **primitives** (`--duration-fast`, `--ease-standard`), focus **primitives** (`--focus-ring-width`, `--ring`), z-index scale, data-table dimensions, etc.  
- **`globals.css`:** **CSS-only conveniences** that **compose** tokens — e.g. `--transition-colors`, keyframes, third-party widget fixes, `.focus-ring`.

---

## Transferring this setup to another shadcn project

Use this as a checklist when porting the pattern (not necessarily every file verbatim).

### 1. Dependencies

- Keep **`clsx`** and a small **`cn()`** in `lib/utils.ts`.  
- You do **not** need Tailwind for this approach. Remove Tailwind from PostCSS/build if you are fully native.  
- Keep **`next-themes`** (or equivalent) if you want `.dark` class theming.

### 2. Add the CSS skeleton

- Copy or recreate **`app/styles/layers.css`** with `@layer reset, base, components, utilities;`.  
- Add **`reset.css`** and **`base.css`** (or merge into one file) and import them after tokens.  
- Create **`app/tokens.css`**: start with `:root` semantic aliases (`--background`, `--foreground`, `--primary`, …), **`--primitive-*`**, then **`.dark`** with color overrides only where needed.

### 3. Create `app/globals.css`

- `@import` **layers → tokens → reset → base**.  
- Add `@import` for each **`app/styles/components/<name>.css`** you maintain.  
- Append a **second `:root`** block only for **non-Figma** derived variables (e.g. transition shorthands).  
- Add **keyframes** and any **unlayered** overrides (toast libraries, etc.).  
- Add **`@layer utilities`** for `.focus-ring:focus-visible`, `sr-only`, and any tiny classes you need from TSX strings.

### 4. Wire the layout

- In **`app/layout.tsx`**, import **`./globals.css`** (or `@/app/globals.css`) **once**.  
- Use **`ThemeProvider`** with `attribute="class"` so **`.dark`** matches **`tokens.css`**.

### 5. Restyle each shadcn component

For each `components/ui/*.tsx`:

1. Replace Tailwind class strings with **stable semantic classes** (`btn`, `btn--outline`, `dialog-content`, …).  
2. Put the corresponding rules in **`app/styles/components/<component>.css`** inside `@layer components { … }`.  
3. Use **`var(--token)`** for every visual that should theme (colors, radius, shadow, spacing).  
4. Add **`focus-ring`** (or your utility) on focusable controls.  
5. Prefer **`data-slot="…"`** selectors when the primitive supports them, for stable styling hooks.

### 6. Figma parity (optional)

- Copy **`scripts/export-tokens.js`** and **`export-tokens-figma.js`** and adapt parsing if your `tokens.css` structure differs.  
- Run **`npm run tokens`** in CI or before handoff so **`tokens/*.json`** stay current.

### 7. Verify

- Toggle **light/dark** and confirm only **token-driven** values change (no hardcoded hex in components).  
- Run **`npm run build`** — CSS must parse and all `var(--…)` references must exist on `:root` or `.dark`.

---

## Usage priority when styling

1. **Semantic tokens** — `var(--background)`, `var(--primary)`, `var(--muted-foreground)`, …  
2. **Domain extensions** — `var(--data-currency)`, chart colors, overlay scrims, …  
3. **Structural tokens** — `var(--radius-control)`, `var(--card-padding)`, `var(--shadow-md)`, …  
4. **One-offs** — Only when not worth tokenising.

---

## Token reference (where to look)

All sections are commented in **`app/tokens.css`**. In outline:

- **Semantic colors** — Surfaces, brand, state, borders, data-syntax, charts, primary alpha scales, overlays.  
- **Motion** — Durations and easing curves (used by `globals.css` shorthands and components).  
- **Focus** — `--ring`, `--focus-ring-width`, `--focus-ring-offset`.  
- **Typography** — Font stacks, scale, weights, leading.  
- **Radius / shadows** — Stepped and semantic radius; shadow scale.  
- **Spacing** — Control heights, padding, gaps, card/menu padding, avatar sizes.  
- **Components / data table** — Sidebar, inputs, switches, table selection, dense grid typography and sizing.

**dataSyntax** — Semantic text colors for tables and dense data (`--data-currency`, `--data-entity`, `--data-status-positive`, …).

---

## Figma export

```bash
npm run tokens
```

This runs **two** exporters:

| Output | Format | Use case |
|--------|--------|----------|
| **`tokens/variables-pro.json`** | Variables Pro (Light + Dark modes in one file) | [Variables Pro](https://variables.pro/) plugin → Import |
| **`tokens/light.json`** & **`tokens/dark.json`** | DTCG-style trees **per mode** (primitives + semantic resolved for that mode) | Figma’s **native Variables** import (import each file into the matching mode / collection workflow) |

Optional scripts:

- `npm run tokens:variables-pro` — only `variables-pro.json`  
- `npm run tokens:figma` — only `light.json` + `dark.json`

**API (dev server):**

- `GET /api/tokens` — download `variables-pro.json`  
- `GET /api/tokens/figma` — `light.json` (default)  
- `GET /api/tokens/figma?mode=dark` — `dark.json`  

Generate files with `npm run tokens` before using these routes.

---

## Adding shadcn components

```bash
npx shadcn@latest add <component-name>
```

If prompted to overwrite customised files, choose **no** for anything already wired to this CSS. For new components, merge manually:

1. Add **TSX** under `components/ui/`.  
2. Add **`app/styles/components/<name>.css`** and **`@import`** it from **`globals.css`**.  
3. Use **`var(--…)`** from **`tokens.css`** for themed values.

---

## Project structure

```
app/
  tokens.css              # Design tokens: :root, .dark, primitives (Figma-aligned)
  globals.css             # Imports, derived vars, keyframes, utilities
  layout.tsx              # ThemeProvider, single globals.css import

app/styles/
  layers.css              # @layer declaration
  reset.css, base.css     # Global defaults
  components/             # Per-component CSS (button, dialog, input, …)

tokens/                   # Generated JSON (Figma)
scripts/                  # export-tokens*.js

components/
  gallery/                # Gallery sections
  ui/                     # shadcn-compatible components
```

---

## Component gallery

The gallery lists components by category: Buttons, Typography, Form controls, Feedback, Data display, Navigation, Layout, Overlay, and Selection. **Data display** includes a Trading Blotter (TanStack Table) using **data-syntax** tokens on a dense financial grid.
