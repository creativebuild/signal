# Signal — Token-driven Design System POC

A Next.js 15 proof of concept for a token-driven design system built on shadcn/ui, with Figma Variables parity as a first-class goal. **All design tokens live in `app/tokens.css`.** `app/globals.css` holds base styles, resets, and shared utilities only — not semantic token definitions.

Run **`npm run tokens`** to export JSON for Figma (see [Figma export](#figma-export)).

---

## Stack

- **Next.js 15** — App router, React 19  
- **Tailwind CSS v4** — Utilities and `@theme inline` for design-token → class mapping  
- **shadcn/ui** — Components (Base UI + Radix primitives)  
- **next-themes** — Light / dark via the `class` strategy (`ThemeProvider`)  
- **class-variance-authority** — Variants for buttons, badges, etc.

---

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the component gallery. Use the theme toggle (top-right) for light and dark.

---

## How tokens work

### Three layers in `tokens.css`

| Layer | Role |
|--------|------|
| **`@theme inline`** | **Theme-dependent values exposed as Tailwind.** Today this is **semantic colors only** (`--color-*` → `bg-primary`, `text-foreground`, `text-data-entity`, …). These utilities resolve through CSS variables that **change** when the document is light vs dark. |
| **`:root`** | **Default (light) theme values.** All semantic CSS variables are defined here: colors, radius, shadows, spacing, data-table sizing, etc. This is the single source of truth for **light** appearance and for **non-color** tokens that are the same in every theme. |
| **`.dark`** | **Dark overrides only.** Typically **color** variables that differ from light. Structural tokens (spacing, radius, shadows, data-table row heights, …) stay in `:root` unless you intentionally override them. |

`layout.tsx` imports **`tokens.css` first**, then **`globals.css`**, so tokens exist before global base styles run.

### How this maps to components

- **Colors** — Prefer Tailwind classes generated from `@theme` (`bg-background`, `text-muted-foreground`, `border-border`, `text-data-currency`, …). They follow the active theme because they point at the same `--background`, `--primary`, … variables that `.dark` overrides.
- **Everything else** — Spacing, radius, shadows, data-table dimensions, opacity, etc. are **not** duplicated in `@theme`. Use **arbitrary values** that reference `:root` variables, e.g. `rounded-[var(--radius-control)]`, `shadow-[var(--shadow-md)]`, `h-[var(--data-table-row-height-sm)]`, `p-[var(--card-padding)]`, `gap-[var(--control-gap)]`.

That split keeps `@theme` focused on **what changes with light/dark (mostly color)** and keeps **layout and structure** in one place (`:root`).

### `globals.css`

Contains `@reference "./tokens.css"`, base resets, `@layer base` / `@layer utilities` (e.g. `.focus-ring`), and keyframes — **not** a second token file.

---

## Architecture (mental model)

```
Components
  ├── Tailwind color utilities     ← @theme inline (--color-* → bg-*, text-*, …)
  │       └── var(--background), var(--primary), …  ← :root definitions, .dark overrides
  └── Arbitrary + structural       ← var(--radius-*), var(--shadow-*), var(--control-*), …
          └── :root (and .dark only where needed)
```

---

## Usage priority when styling

1. **shadcn / semantic colors** — `bg-background`, `text-foreground`, `border-border`, `bg-primary`, …  
2. **Signal extensions** — `text-success`, `bg-press`, `text-data-entity`, chart colors, overlay tints, etc.  
3. **Structural tokens** — `var(--radius-container)`, `var(--card-padding)`, `shadow-[var(--shadow-sm)]`, …  
4. **Raw palette / one-offs** — Only when something is not worth tokenising.

---

## Token reference (where to look)

All sections are commented in **`app/tokens.css`**. In outline:

- **Semantic colors** — Core surfaces, brand, state, borders, data-syntax palette, charts, transparency scales, overlays, component-specific colors (sidebar, table, data-table, slider, …).  
- **Radius / shadows** — Stepped radius (`--radius-md`, …) and semantic aliases (`--radius-control`, …); shadow scales (`--shadow-xs` … `--shadow-lg`).  
- **Spacing** — Control heights, padding, gaps; structural (`--card-padding`, `--menu-item-*`, `--avatar-size-*`, …).  
- **Data table** — Row/header heights, cell padding, typography tokens for dense grids.

**dataSyntax** — Semantic text colors for tables and dense data (`--data-currency`, `--data-entity`, `--data-status-positive`, …) with matching `text-data-*` utilities.

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

If prompted to overwrite a customised file (e.g. `button.tsx`), choose **no** to keep token-driven styling. For new components, choose **yes**.

After adding a component, wire any new **colors** through **`@theme inline`** (`--color-*`) and **`:root` / `.dark`** as needed; use **`var(--…)`** from `:root` for spacing, radius, and shadows instead of duplicating them in `@theme`.

---

## Project structure

```
app/
  tokens.css          # Design tokens: @theme + :root + .dark (imported first)
  globals.css         # Base styles, utilities, keyframes (@reference tokens.css)
  layout.tsx          # ThemeProvider, CSS import order

tokens/
  variables-pro.json  # Variables Pro export (generated)
  light.json          # Figma native — light mode (generated)
  dark.json           # Figma native — dark mode (generated)

scripts/
  export-tokens.js         # → variables-pro.json
  export-tokens-figma.js   # → light.json, dark.json

components/
  gallery/            # Gallery sections
  ui/                 # shadcn components
```

---

## Component gallery

The gallery lists shadcn components by category: Buttons, Typography, Form controls, Feedback, Data display, Navigation, Layout, Overlay, and Selection. **Data display** includes a Trading Blotter (TanStack Table) using **dataSyntax** tokens on a dense financial grid.
