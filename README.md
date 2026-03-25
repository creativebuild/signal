# Signal — Token-driven Design System POC

A Next.js 15 proof of concept: **shadcn-style components styled with native CSS** and **design tokens** aligned for Figma Variables. Token **definitions** live under **`app/styles/tokens/`** and **`app/styles/components/<name>/*.tokens.css`**. **`app/tokens.css`** is a thin **barrel** that imports those layers. **`app/globals.css`** is the **app shell**: import order, keyframes, third-party tweaks, and small utilities — not the token source of truth.

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

## Where do `globals.css` and `tokens.css` live — and why?

| File | Location | Role |
|------|----------|------|
| **`app/globals.css`** | Next to **`app/layout.tsx`** | **Single stylesheet the layout imports** (`@/app/globals.css`). Defines cascade order: layers → tokens barrel → reset → base → every component stylesheet, then keyframes, Sonner tweaks, and `@layer utilities`. This matches the usual App Router pattern: one obvious global entry next to the root layout. |
| **`app/tokens.css`** | Same **`app/`** folder | **Barrel only** — three `@import`s: `styles/tokens/primitives.css`, `semantic.css`, `component-tokens.css`. No variables declared here. Keeps one stable name to grep (“where are tokens loaded?”) while the real content lives under **`app/styles/`**. |

**Why not move both files into `app/styles/` only?** You could. Import `@/app/styles/globals.css` from `layout.tsx` and it would work the same. This project **keeps barrels at `app/`** so “global CSS” and “token import root” sit beside `layout.tsx`; **all implementation** (primitives, semantics, component token maps, per-component CSS) stays under **`app/styles/`**.

**Summary for new developers**

1. **Edit theme values** in **`app/styles/tokens/primitives.css`** (raw palette) and **`app/styles/tokens/semantic.css`** (meaningful names, light `:root` + **`.dark`** overrides). Do not put component-specific names in semantic (e.g. no `--sidebar-bg` there — use component tokens).  
2. **Component-only mappings** (semantic → `--dialog-overlay-bg`, `--data-table-*`, etc.) live in **`app/styles/components/<name>/<name>.tokens.css`**, aggregated by **`app/styles/tokens/component-tokens.css`**.  
3. **Component appearance rules** live in **`app/styles/components/<name>/<name>.css`** — classes only; use **`var(--…)`** tokens (globals or component-prefixed), never raw hex from the palette in those files.  
4. **`app/globals.css`** — do not add `:root` token definitions here; add keyframes, vendor overrides, and utilities only.

---

## Architecture: layers, naming, and CSS files

### Mental model

| Piece | Responsibility |
|--------|----------------|
| **`app/styles/tokens/primitives.css`** | **Raw values only** — `--primitive-*` palette (OKLCH), black/white. No semantic meaning. |
| **`app/styles/tokens/semantic.css`** | **Global semantic tokens** — prefixed names: `--color-*`, `--space-*`, `--size-*`, `--radius-*`, `--shadow-*`, `--duration-*`, `--z-*`, typography, containers, transitions. References **only** primitives (or other semantic tokens). **`.dark`** overrides colors (and related) so components inherit theme without duplicating component tokens. **`--chart-1` … `--chart-14`** stay as global chart indices (exception). |
| **`app/styles/tokens/component-tokens.css`** | **`@import`s** every **`*.tokens.css`** under `components/<name>/`. |
| **`app/tokens.css`** | Imports the three token layers above (barrel). |
| **`app/globals.css`** | **Import order** + keyframes + unlayered hacks + **`@layer utilities`**. |
| **`app/styles/layers.css`** | `@layer` order: `reset, base, components, utilities`. |
| **`app/styles/reset.css`**, **`base.css`** | Global box model, typography defaults, `:focus-visible`. |
| **`app/styles/components/<name>/<name>.tokens.css`** | Maps semantics → **`--<name>-*`** (no rules, no raw palette). Optional `.dark` only when unavoidable (e.g. switch thumb). |
| **`app/styles/components/<name>/<name>.css`** | **`@layer components`** — class / `[data-slot]` rules using **`var(--token)`** (semantic or that component’s `--name-*` tokens). |

### Token naming (quick reference)

- **Global:** `--color-bg`, `--color-fg`, `--color-primary`, `--color-border`, `--font-size-sm`, `--size-control-md`, `--space-card`, `--radius-control`, …  
- **Data syntax:** `--color-data-currency`, `--color-data-status-positive`, …  
- **Primary tints:** `--color-primary-alpha-10`, …  
- **Charts:** `--chart-1` … `--chart-14` (unchanged).  
- **Component examples:** `--dialog-overlay-bg`, `--input-bg`, `--data-table-row-height-sm`, `--sidebar-width` (maps from `--layout-rail-width`).

### Example

```css
/* app/styles/components/button/button.css */
.btn {
  border-radius: var(--radius-control);
  transition: var(--transition-control);
  background-color: var(--color-primary);
  color: var(--color-primary-fg);
}
```

```tsx
<ButtonPrimitive className={cn("btn focus-ring", variantClass, className)} />
```

**Dark mode:** `next-themes` sets `.dark` on `<html>`. Overrides in **`semantic.css`** under `.dark { … }` flow into all `var(--color-*)` uses; component token files usually need no dark duplicate.

### Import order (critical)

`globals.css` must load **`tokens.css` before** any component CSS so variables exist. Order:

1. `layers.css`  
2. **`tokens.css`** (primitives → semantic → component token maps)  
3. `reset.css` → `base.css`  
4. **`styles/components/<name>/<name>.css`** for each UI area (list in `globals.css`)  
5. Unlayered blocks in `globals.css` (keyframes, Sonner, table checkbox tweak)  
6. `@layer utilities` (`.focus-ring`, `sr-only`, etc.)

`app/layout.tsx` imports **`@/app/globals.css`** once.

### What belongs where

| In token CSS | In `globals.css` only |
|--------------|------------------------|
| Colors, type scale, radii, shadows, spacing, motion, z-index, data/chart tokens | Keyframes, third-party widget overrides, small utility classes |
| **`--transition-control`** — one shared `transition` value (duration + easing) for properties that change together on hover/focus: color, background, border, box-shadow, opacity. Not “colors only”; name reflects interactive controls. | Anything that is not a design token |

---

## Transferring this setup to another shadcn project

### 1. Dependencies

- **`clsx`** + **`cn()`** in `lib/utils.ts`.  
- **`next-themes`** with `attribute="class"` if you use `.dark`.

### 2. CSS skeleton

- **`app/styles/layers.css`** — `@layer reset, base, components, utilities;`  
- **`app/styles/tokens/primitives.css`**, **`semantic.css`**, **`component-tokens.css`**  
- **`app/tokens.css`** — `@import` those three  
- **`reset.css`** / **`base.css`**  
- **`app/globals.css`** — import layers → tokens → reset → base → each **`components/<name>/<name>.css`**

### 3. Wire the layout

- **`app/layout.tsx`** — `import "@/app/globals.css"` once.

### 4. Per component

- **`components/ui/*.tsx`** — semantic classes + `cn()`.  
- **`app/styles/components/<name>/<name>.css`** — rules with `var(--…)`.  
- Optional **`app/styles/components/<name>/<name>.tokens.css`** + register in **`component-tokens.css`**.

### 5. Figma

- **`scripts/export-tokens-figma.js`** reads merged **`primitives.css`** + **`semantic.css`** (+ selected `*.tokens.css`). Run **`npm run tokens`**.

---

## Usage priority when styling

1. **Semantic tokens** — `var(--color-bg)`, `var(--color-primary)`, `var(--color-muted-fg)`, …  
2. **Domain** — `var(--color-data-currency)`, `var(--chart-1)`, overlay tokens via component maps, …  
3. **Structure** — `var(--radius-control)`, `var(--space-card)`, `var(--shadow-md)`, …  
4. **One-offs** — only when not worth tokenising.

---

## Token reference (where to look)

| File | Contents |
|------|-----------|
| **`app/styles/tokens/primitives.css`** | Full `--primitive-*` scale |
| **`app/styles/tokens/semantic.css`** | `--color-*`, motion, radius, shadows, spacing, typography, **`.dark`** |
| **`app/styles/tokens/component-tokens.css`** | Import list for `*.tokens.css` |
| **`app/styles/components/*/*.tokens.css`** | Component-specific `--foo-*` aliases |

---

## Figma export

```bash
npm run tokens
```

| Output | Format | Use case |
|--------|--------|----------|
| **`tokens/variables-pro.json`** | Variables Pro (Light + Dark) | [Variables Pro](https://variables.pro/) import |
| **`tokens/light.json`** & **`tokens/dark.json`** | DTCG-style per mode | Figma native Variables |

Optional: `npm run tokens:variables-pro`, `npm run tokens:figma`.

**API:** `GET /api/tokens`, `GET /api/tokens/figma` (+ `?mode=dark`). Run `npm run tokens` before using.

---

## Adding shadcn components

```bash
npx shadcn@latest add <component-name>
```

1. TSX under `components/ui/`.  
2. **`app/styles/components/<name>/<name>.css`** (+ optional **`<name>.tokens.css`**).  
3. **`@import`** the `.css` from **`globals.css`**.  
4. If you add **`.tokens.css`**, **`@import`** it from **`component-tokens.css`**.

---

## Project structure

```
app/
  layout.tsx              # import @/app/globals.css once
  globals.css             # Cascade: layers → tokens → reset → base → components; keyframes; utilities
  tokens.css              # Barrel: @import styles/tokens/*.css (primitives, semantic, component-tokens)

app/styles/
  layers.css
  reset.css
  base.css
  tokens/
    primitives.css
    semantic.css
    component-tokens.css    # @import ../components/*/*.tokens.css
  components/
    <name>/
      <name>.tokens.css   # optional: semantic → --name-*
      <name>.css          # @layer components { … }

tokens/                   # Generated JSON (npm run tokens)
scripts/
  export-tokens*.js
  apply-token-renames.mjs # one-off / reference for bulk var() renames

components/
  gallery/
  ui/
```

---

## Component gallery

Categories: Buttons, Typography, Form controls, Feedback, Data display, Navigation, Layout, Overlay, Selection. **Data display** includes a Trading Blotter (TanStack Table) using **data-syntax** tokens on a dense grid.
