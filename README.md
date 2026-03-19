# Signal — Token-driven Design System POC

A Next.js 15 proof of concept for a fully token-driven design system built on shadcn/ui, with Figma Variables Pro parity as a first-class goal. Every visual decision — color, spacing, typography, sizing — flows from CSS custom properties defined in two files: `globals.css` (semantic decisions) and `tokens.css` (Tailwind bridge). Run `npm run tokens` to export the entire theme to a Variables Pro JSON file ready to import into Figma.

---

## Stack

- **Next.js 15** — App router, React 19
- **Tailwind CSS v4** — Utility-first CSS with `@theme inline` for token mapping
- **shadcn/ui** — Component library (Base UI + Radix primitives)
- **next-themes** — System-aware light/dark mode (`ThemeProvider`, `class` attribute)
- **class-variance-authority** — Variant composition for buttons, badges, etc.

---

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the component gallery. Use the theme toggle (top-right) to switch between light and dark modes.

To export the full theme to Figma:

```bash
npm run tokens
```

Output: `tokens/variables-pro.json` — ready to import into Figma via Variables Pro.

---

## How it works

shadcn/ui ships with two categories of styling out of the box:

- **Tokenized** — Semantic colors (`--primary`, `--border`, etc.) defined in `:root` and mapped to Tailwind utilities via `@theme` (`bg-primary`, `text-foreground`, etc.)
- **Hardcoded** — Heights, padding, font sizes, and gaps as literal Tailwind values in each component file (`h-9`, `px-4`, `text-sm`)

Signal extends the token model so that sizing, spacing, and component-specific values also live as named tokens — giving the system complete Figma parity and a single place to change anything.

### File responsibilities

| File | Purpose |
|------|---------|
| `app/globals.css` | **Source of truth.** Semantic colors (referencing Tailwind palette variables), component tokens (`--button-*`, `--input-*`, `--data-table-*`, etc.), the base radius dial (`--radius`), and `.dark` overrides. Edit this file to change the theme. |
| `app/tokens.css` | **Tailwind bridge.** Defines `--ds-*` primitive tokens (spacing, radius, typography, shadow) and maps all semantic and component tokens from `globals.css` to Tailwind utilities via `@theme inline` — generating `p-4`, `rounded-lg`, `bg-primary`, `text-data-entity`, etc. |

`layout.tsx` imports `tokens.css` before `globals.css`.

### Architecture

```
Components
  └── Tailwind utilities (bg-primary, text-data-entity, rounded-component)
        └── @theme inline (tokens.css)
              └── Semantic tokens (globals.css :root / .dark)
                    └── Tailwind palette (--color-neutral-950, --color-blue-600)
```

### Why the `--ds-` prefix

Tailwind v4's `@theme` throws circular reference errors when a token and its mapped utility share the same name — e.g. `--radius-sm: var(--radius-sm)` references itself.

The fix: primitive tokens in `tokens.css` use a `--ds-` namespace, so `@theme` can safely map them without collision:

```css
/* tokens.css */
--ds-radius-sm: calc(var(--radius) - 4px);   /* primitive */

@theme inline {
  --radius-sm: var(--ds-radius-sm);           /* maps to rounded-sm */
}
```

This prefix only applies to primitives in `tokens.css`. Semantic tokens in `globals.css` (`--background`, `--button-primary-bg`, `--data-entity` etc.) use no prefix — they follow shadcn's own naming convention.

The base `--radius` value in `globals.css` acts as a single dial. Changing it cascades through the full radius scale and updates every component's corner radius at once.

### Token priority

When styling components, use this order:

1. **shadcn native** — `bg-background`, `text-foreground`, `border-border`, `bg-primary`, `text-muted-foreground` (shadcn components depend on these)
2. **Signal semantic** — `bg-success`, `text-link`, `bg-press`, `text-data-entity` (Signal extensions to shadcn)
3. **Signal component** — `bg-button-primary`, `text-input-placeholder`, `bg-data-table-row-selected` (component-specific tokens)
4. **Raw Tailwind palette** — only for genuinely one-off values not worth tokenising

---

## Token reference

### Primitives — `tokens.css`

Defined with `--ds-*` prefix, mapped to Tailwind utilities via `@theme inline`.

| Group | Tokens | Utilities |
|-------|--------|-----------|
| Spacing | `--ds-space-1` → `--ds-space-12` | `p-1`, `gap-4`, `m-8` etc. |
| Radius | `--ds-radius-sm` → `--ds-radius-full` | `rounded-sm`, `rounded-xl` etc. |
| Shadow | `--ds-shadow-sm` → `--ds-shadow-lg` | `shadow-sm`, `shadow-lg` etc. |
| Typography | `--ds-text-xs` → `--ds-text-3xl` | `text-xs`, `text-2xl` etc. |
| Line height | `--ds-leading-tight` → `--ds-leading-relaxed` | `leading-tight` etc. |
| Font weight | `--ds-font-normal` → `--ds-font-bold` | `font-medium`, `font-bold` etc. |

### Semantic tokens — `globals.css`

All semantic colors reference Tailwind palette variables (e.g. `var(--color-neutral-950)`) — never hardcoded hex or oklch values. Defined in `:root` for light mode, overridden in `.dark` for dark mode.

#### shadcn base (preserved exactly)

These are shadcn's own variables. All shadcn components depend on them — do not rename or remove.

| Token | Purpose |
|-------|---------|
| `--background`, `--foreground` | Page surface and default text |
| `--card`, `--card-foreground` | Card surfaces |
| `--popover`, `--popover-foreground` | Dropdowns, menus, tooltips |
| `--primary`, `--primary-foreground` | Primary actions |
| `--secondary`, `--secondary-foreground` | Secondary actions |
| `--muted`, `--muted-foreground` | Muted surfaces and text |
| `--accent`, `--accent-foreground` | Hover and focus states |
| `--destructive`, `--destructive-foreground` | Destructive actions |
| `--border`, `--input`, `--ring` | Borders, input outlines, focus rings |
| `--chart-1` through `--chart-5` | Chart series colors |
| `--sidebar`, `--sidebar-foreground` | Sidebar surface and text |
| `--radius` | Base radius dial — drives the full radius scale |

#### Signal extensions

Additional semantic tokens that extend the shadcn base:

| Token | Purpose |
|-------|---------|
| `--success`, `--success-foreground` | Success state |
| `--warning`, `--warning-foreground` | Warning state |
| `--info`, `--info-foreground` | Informational state |
| `--press`, `--press-foreground` | Active/pressed control state |
| `--link`, `--link-foreground` | Link color |

#### Radius hierarchy

Radius is assigned by visual hierarchy, not control size:

| Token | Used for |
|-------|---------|
| `--radius-container` | Card, Dialog, Sheet, Drawer — outermost surfaces |
| `--radius-control` | Button, Input, Select, Toggle — interactive controls |
| `--radius-inset` | Elements nested inside controls or cards |
| `--radius-pill` | Badge, tag, pill shapes |

#### dataSyntax — visual grammar for data display

A system of semantic color tokens for consistently styling different categories of data in tables and grids — similar to syntax highlighting for code.

| Token | Purpose | Example use |
|-------|---------|-------------|
| `--data-primary` | Primary data text | Main values |
| `--data-secondary` | Secondary data text | Supporting values |
| `--data-currency` | Monetary values | Amounts, prices |
| `--data-entity` | Named entities | Usernames, counterparties |
| `--data-identifier` | Codes and IDs | Currency pairs, reference numbers |
| `--data-category` | Categories and types | Product type, instrument |
| `--data-datetime` | Dates and times | Timestamps, value dates |
| `--data-status-positive` | Positive status | Complete, filled |
| `--data-status-negative` | Negative status | Rejected, failed |
| `--data-status-warning` | Warning status | Pending, working |
| `--data-status-neutral` | Neutral status | — |
| `--data-value-positive` | Positive numeric value | Gains |
| `--data-value-negative` | Negative numeric value | Losses |
| `--data-value-neutral` | Neutral numeric value | Standard figures |

Utilities: `text-data-entity`, `text-data-status-positive`, `text-data-currency` etc.

#### Component tokens

Every shadcn component has a dedicated token block in `globals.css` covering background, foreground, border, hover states, sizing, padding, and radius. Component tokens reference shadcn base tokens wherever possible, then Signal semantic extensions, and only introduce new values where genuinely needed.

Naming pattern:
```css
--{component}-bg
--{component}-fg
--{component}-border
--{component}-bg-hover
--{component}-fg-hover
--{component}-border-hover
--{component}-radius
--{component}-px
--{component}-py
```

Components with tokens: `button` (with variants: primary, secondary, ghost, link, cta, destructive, rag-green, rag-yellow, rag-red), `input`, `card`, `badge`, `dialog`, `popover`, `toast`, `tooltip`, `select`, `dropdown-menu`, `tabs`, `table`, `data-table`, `sidebar`, `avatar`, `checkbox`, `switch`, `slider`, `progress`, `alert`, `skeleton`, `separator`, `accordion`, `sheet`, `command`, `navigation-menu`, `pagination`, `breadcrumb`, `calendar`, `toggle`, `scroll-area`.

---

## Figma export

```bash
npm run tokens
```

Generates `tokens/variables-pro.json` in Variables Pro format:

- Two collections: **Signal | Primitives** (single mode) and **Signal | Semantic** (Light + Dark modes)
- Semantic tokens alias back to primitives via `$collectionName` cross-collection references
- Scopes assigned per token type (`ALL_FILLS`, `TEXT_FILL`, `STROKE_COLOR`, `CORNER_RADIUS` etc.)
- rem values converted to px (× 16)

To import into Figma: open Variables Pro plugin → Import → select `tokens/variables-pro.json`.

---

## Adding components

```bash
npx shadcn@latest add <component-name>
```

If prompted to overwrite a file you have already customised (e.g. `button.tsx`), choose **no** to preserve your token-driven version. For components you are adding for the first time, choose **yes**.

After adding a new component, add its token block to `globals.css` following the naming pattern above, and map the tokens through `@theme inline` in `tokens.css`.

---

## Project structure

```
app/
  tokens.css          # Primitive tokens + @theme inline mappings (imported first)
  globals.css         # Semantic tokens, component tokens, .dark overrides
  layout.tsx          # Root layout with ThemeProvider
  page.tsx            # Component gallery

tokens/
  variables-pro.json  # Figma export (generated by npm run tokens)

scripts/
  export-tokens.js    # Parses tokens.css + globals.css → variables-pro.json

components/
  gallery/            # Gallery sections
  ui/                 # shadcn components
```

---

## Component gallery

The gallery at [http://localhost:3000](http://localhost:3000) covers all shadcn components organised into sections: Buttons, Typography, Form Controls, Feedback, Data Display, Navigation, Layout, Overlay, and Selection. The Data Display section includes a Trading Blotter demo built with TanStack Table that demonstrates dataSyntax token usage across a dense financial data grid.