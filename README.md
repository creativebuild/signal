# Design System POC — Token-driven shadcn/ui

A Next.js 15 proof-of-concept demonstrating a fully token-driven design
system built on shadcn/ui. Every visual decision — color, spacing,
typography, sizing — flows from a single source of truth: CSS custom
properties in `app/globals.css`.

---

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000 to view the component gallery.

To export tokens to JSON for Figma (via Tokens Studio):

```bash
npm run tokens
```

---

## How it works

shadcn/ui ships components with two categories of styling:

- **Tokenized by default:** Semantic colors (`--primary`, `--border`,
  etc.) defined in `:root`, mapped to Tailwind utilities via `@theme`
  (`bg-primary`, `text-foreground`, etc.)
- **Hardcoded by default:** Heights, padding, font sizes, and gaps are
  literal Tailwind values in each component file (`h-9`, `px-4`, `text-sm`)

This POC extends the token model so sizing, spacing, and
component-specific values also live in `globals.css` — making the entire
visual system editable from one file.

### Three-layer architecture

```
┌─────────────────────────────────────────────────┐
│  LAYER 3 — Components                           │
│  Tailwind utilities for color                   │
│  var() arbitrary values for sizing/spacing      │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│  LAYER 2 — Tailwind CSS v4                      │
│  Generates color utilities from @theme inline   │
│  (bg-primary, text-foreground, etc.)            │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│  LAYER 1 — globals.css                           │
│  :root — all token definitions                   │
│  .dark — color overrides only                    │
│  @theme inline — colors → Tailwind utilities     │
└─────────────────────────────────────────────────┘
```

### Why colors and sizing use different approaches

Tailwind v4's `@theme` reliably generates utilities for colors
(`--color-primary` → `bg-primary`). However, mapping arbitrary spacing
and sizing tokens through `@theme` causes circular reference errors that
silently break the entire block.

The solution: `@theme inline` handles colors only. All other tokens
(spacing, radius, shadow, component sizing) are consumed directly in
components via `var()` in Tailwind's arbitrary value syntax:

```
  bg-primary                        ← color, via @theme
  h-[var(--control-height-md)]      ← sizing, via var()
  rounded-[var(--card-radius)]      ← radius, via var()
  text-[length:var(--font-size-sm)] ← font size, via var()
```

---

## Token reference

All tokens are defined in `app/globals.css`.

### Colors (semantic, OKLCH)

Defined in `:root` and overridden in `.dark`:

| Token | Purpose |
|-------|---------|
| `--background`, `--foreground` | Page background and text |
| `--card`, `--card-foreground` | Card surfaces |
| `--popover`, `--popover-foreground` | Dropdowns, menus, tooltips |
| `--primary`, `--primary-foreground` | Primary buttons, links |
| `--secondary`, `--secondary-foreground` | Secondary buttons |
| `--muted`, `--muted-foreground` | Muted backgrounds and text |
| `--accent`, `--accent-foreground` | Hover/focus states (menus, sidebar items) |
| `--destructive`, `--destructive-foreground` | Destructive actions |
| `--border`, `--input`, `--ring` | Borders, inputs, focus rings |

Additional: `--success`, `--warning`, `--info`, `--chart-1` through `--chart-5`, `--sidebar`, `--sidebar-foreground`.

### Spacing

`--space-1` through `--space-12` (0.25rem → 3rem).

### Typography

`--font-size-xs` through `--font-size-3xl`, `--line-height-*`, `--font-weight-*`.

### Radius & shadow

`--radius-sm` through `--radius-full` (derived from `--radius`).  
`--shadow-sm`, `--shadow-md`, `--shadow-lg`.

### Component tokens

- **Control** (Button, Input, Select): `--control-height-*`, `--control-px-*`, `--control-font-size-*`
- **Card**: `--card-padding`, `--card-radius`, `--card-shadow`
- **Badge**: `--badge-height`, `--badge-px`, `--badge-font-size`, `--badge-radius`
- **Avatar**: `--avatar-size-sm`, `--avatar-size-md`, `--avatar-size-lg`
- **Nav/Sidebar**: `--nav-item-height`, `--nav-item-px`, `--sidebar-width`

---

## Component gallery

The gallery showcases all UI components in sections:

| Section | Components |
|---------|------------|
| **Buttons** | Button variants |
| **Typography** | Headings, body text |
| **Form Controls** | Input, Textarea, Label, Select, Combobox, Date Picker (Calendar), Input OTP, Form |
| **Feedback** | Alert, Badge, Progress, Skeleton, Spinner |
| **Data Display** | Card, Table, Avatar, Tabs |
| **Navigation** | Tabs, Breadcrumb, Pagination, Accordion, Collapsible, Menubar, Navigation Menu |
| **Layout** | Sidebar, Resizable panels |
| **Overlay** | Dialog, Sheet, Drawer, Popover, Tooltip, Hover Card |
| **Selection** | Checkbox, Radio, Switch, Slider |
| **Media** | Progress, Separator, ScrollArea, Carousel |

Use the theme toggle (top-right) to switch between light and dark modes.

---

## Adding components

Add shadcn components with the CLI:

```bash
npx shadcn@latest add <component-name>
```

When prompted to overwrite existing files (e.g. `button.tsx`), choose **no** to preserve your token-driven customizations.

---

## Project structure

```
app/
  globals.css      # All design tokens
  layout.tsx       # Root layout with ThemeProvider
  page.tsx         # Gallery page

components/
  gallery/         # Gallery sections and demo content
  ui/              # shadcn components (47 components)
```

---

## License

Private.
