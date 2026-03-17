# Design System POC — Token-driven shadcn/ui

A Next.js 15 proof-of-concept demonstrating a fully token-driven design
system built on shadcn/ui. Every visual decision — color, spacing,
typography, sizing — flows from CSS custom properties split across
`app/tokens.css` (primitives) and `app/globals.css` (semantic tokens).

---

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000 to view the component gallery.

To export tokens to Variables Pro format for Figma:

```bash
npm run tokens
```

Output: `tokens/variables-pro.json` — Light Mode and Dark Mode in a
single file, ready for Variables Pro import.

---

## How it works

shadcn/ui ships components with two categories of styling:

- **Tokenized by default:** Semantic colors (`--primary`, `--border`,
  etc.) defined in `:root`, mapped to Tailwind utilities via `@theme`
  (`bg-primary`, `text-foreground`, etc.)
- **Hardcoded by default:** Heights, padding, font sizes, and gaps are
  literal Tailwind values in each component file (`h-9`, `px-4`, `text-sm`)

This POC extends the token model so sizing, spacing, and
component-specific values also live in token files — split between
primitives and semantic tokens for clarity and Figma parity.

### Token file split

| File | Purpose |
|------|---------|
| `app/tokens.css` | Primitive overrides (`--ds-space-*`, `--ds-radius-*`, `--ds-shadow-*`, `--ds-text-*`, etc.). Replaces Tailwind defaults. Has `@import "tailwindcss"` and `@theme inline` to map primitives to utilities. |
| `app/globals.css` | Semantic tokens only: colors (oklch), component sizing (`--control-height-*`, `--card-padding`, etc.), and `--radius` (the base radius dial). Uses `.dark` for color overrides. |

`layout.tsx` imports `tokens.css` before `globals.css`.

### Three-layer architecture

```
┌─────────────────────────────────────────────────┐
│  LAYER 3 — Components                           │
│  Tailwind utilities for color + primitives      │
│  var() arbitrary values for semantic sizing     │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│  LAYER 2 — Tailwind CSS v4                      │
│  tokens.css: @theme maps --ds-* → utilities     │
│  globals.css: @theme maps colors → bg-primary etc │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│  LAYER 1 — Token files                           │
│  tokens.css — primitives (:root) + @theme        │
│  globals.css — semantic (:root, .dark)           │
└─────────────────────────────────────────────────┘
```

### Why the --ds- prefix for primitives

Tailwind v4's `@theme` can hit circular reference errors when mapping
tokens that reference each other (e.g. `--radius-sm: var(--radius-sm)`).

The solution: primitive tokens use a `--ds-` prefix in `tokens.css`, so
`@theme` maps them without circular refs: `--radius-sm: var(--ds-radius-sm)`.
That generates `rounded-sm`, `p-4`, `text-xs`, etc. Semantic component
sizing (`--control-height-*`, `--card-padding`, etc.) stays in `globals.css`
and is consumed via `var()` in components. The base radius value `--radius` in globals.css acts as a single dial — changing it updates every `--ds-radius-*` derived value and therefore every component's corner radius at once.

```
  bg-primary                        ← color, via @theme (tokens.css)
  rounded-lg                        ← radius, via @theme (--ds-radius-lg)
  p-4                               ← spacing, via @theme (--ds-space-4)
  h-[var(--control-height-md)]      ← semantic sizing, via var()
```

---

## Token reference

### Primitives (`app/tokens.css`)

`--ds-space-*`, `--ds-radius-*`, `--ds-shadow-*`, `--ds-text-*`,
`--ds-leading-*`, `--ds-font-*`. Mapped to Tailwind via `@theme` →
`p-4`, `rounded-lg`, `shadow-sm`, `text-sm`, etc.

### Semantic tokens (`app/globals.css`)

#### Colors (OKLCH)

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

#### Component sizing

- **Base values** — `--radius` — single base value that all radius tokens derive from. Change this one value to update corner rounding everywhere.
- **Control** (Button, Input, Select): `--control-height-*`, `--control-px-*`, `--control-gap`
- **Card**: `--card-padding`
- **Badge**: `--badge-height`, `--badge-px`
- **Avatar**: `--avatar-size-sm`, `--avatar-size-md`, `--avatar-size-lg`
- **Sidebar**: `--sidebar-width`

---

## Variables Pro export

`npm run tokens` generates `tokens/variables-pro.json` for Figma Variables Pro:

- **Format:** JSON array with a single collection (`Design System`) and two modes
- **Light Mode:** Primitives (spacing, radius, shadow, typography) + semantic colors + component tokens
- **Dark Mode:** Color overrides only
- **Conversions:** rem → px (×16), oklch kept as-is, scopes assigned per token type

---

## Component gallery

The gallery showcases all UI components in sections:

| Section | Components |
|---------|------------|
| Buttons | Button (all variants + sizes), Toggle, Toggle Group |
| Typography | Headings h1–h6, body, muted, lead, code, blockquote |
| Form Controls | Input, Textarea, Label, Select, Combobox, Date Picker, Input OTP |
| Feedback | Alert, Alert Dialog, Badge (+ success/warning/info), Sonner, Spinner |
| Data Display | Card, Table, Data Table, Avatar, Skeleton, Chart, Aspect Ratio, Carousel |
| Navigation | Tabs, Breadcrumb, Pagination, Accordion, Collapsible, Menubar, Navigation Menu |
| Layout | Sidebar, Resizable panels |
| Overlay | Dialog, Drawer, Sheet, Popover, Tooltip, Hover Card, Context Menu, Dropdown Menu, Command |
| Selection | Checkbox, Radio Group, Switch, Slider |
| Media | Progress, Separator, Scroll Area |

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
  tokens.css       # Primitive overrides + @theme (imported first)
  globals.css      # Semantic tokens (colors, component sizing)
  layout.tsx       # Root layout with ThemeProvider
  page.tsx         # Gallery page

tokens/
  variables-pro.json   # Figma Variables Pro export (npm run tokens)

scripts/
  export-tokens.js    # Parses tokens.css + globals.css → variables-pro.json

components/
  gallery/         # Gallery sections and demo content
  ui/              # shadcn components (47 components)
```

---

## License

Private.
