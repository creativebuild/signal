# Design System POC — Token-driven shadcn/ui

A Next.js 15 proof-of-concept demonstrating how to build a fully token-driven design system on top of shadcn/ui. Every visual decision—color, spacing, typography, sizing—flows from CSS custom properties in `app/globals.css`.

## How the layers fit together

Three layers work together. Understanding who owns what helps when changing design decisions.

```
┌─────────────────────────────────────────────────────────────────┐
│  COMPONENTS (Button, Card, Input, etc.)                          │
│  Use Tailwind utility classes + var() for token values           │
└─────────────────────────────────────────────────────────────────┘
                              ▲
┌─────────────────────────────────────────────────────────────────┐
│  TAILWIND CSS v4                                                 │
│  • Provides utility classes (flex, gap-2, rounded-lg, etc.)      │
│  • Generates color utilities from @theme (bg-primary, etc.)       │
│  • Does NOT generate utilities for our custom spacing/radius     │
└─────────────────────────────────────────────────────────────────┘
                              ▲
┌─────────────────────────────────────────────────────────────────┐
│  DESIGN TOKENS — app/globals.css                                │
│  • :root / .dark — all token definitions                         │
│  • @theme inline — maps colors to Tailwind (colors only)          │
└─────────────────────────────────────────────────────────────────┘
```

### What shadcn provides

shadcn/ui ships components that use Tailwind. Out of the box:

- **Tokenized:** Semantic colors (`--primary`, `--border`, etc.) in `:root`. These map to Tailwind via `@theme`, so you get `bg-primary`, `text-foreground`, etc.
- **Hardcoded:** Heights, padding, font sizes, gaps are literal values in component files (`h-9`, `px-4`, `text-sm`). No shared tokens.

### What this POC adds

We extend the token model so spacing, sizing, and component-specific values also live in one place:

- **All tokens** are defined in `globals.css` under `:root` (and `.dark` for color overrides).
- **Colors** flow through `@theme inline` → Tailwind generates utilities (`bg-primary`, `text-muted-foreground`).
- **Everything else** (spacing, radius, shadow, control heights, etc.) is used directly via `var()` in components, e.g. `h-[var(--control-height-md)]`, `rounded-[var(--card-radius)]`.

**Why the split?** Tailwind v4's `@theme` can fail on circular references when mapping spacing/radius/shadow. Keeping `@theme` to colors only avoids that. Non-color tokens work fine via `var()` in arbitrary values.

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 |
| UI | React 19, shadcn/ui (New York style) |
| Styling | Tailwind CSS v4, CSS custom properties |
| Theme | next-themes (class-based) |
| Forms | react-hook-form, zod, @hookform/resolvers |
| Icons | Lucide React |

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the component gallery.

## Token architecture

All tokens live in `app/globals.css`. The file is organised into sections:

| Section | Location | What it defines |
|---------|-----------|------------------|
| **Color tokens** | `:root` / `.dark` | Semantic colors (primary, muted, accent, etc.) in OKLCH |
| **Spacing** | `:root` | `--space-1` through `--space-12` |
| **Typography** | `:root` | Font sizes, line heights, weights |
| **Radius** | `:root` | `--radius-sm` through `--radius-full` (derived from `--radius`) |
| **Shadow** | `:root` | `--shadow-sm`, `--shadow-md`, `--shadow-lg` |
| **Control tokens** | `:root` | Heights, padding, font sizes for Button/Input/Select |
| **Component tokens** | `:root` | Card, Badge, Avatar, Nav, Sidebar |

### Color tokens (OKLCH)

Semantic colors in `:root` and `.dark`:

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

Additional semantic tokens: `--success`, `--warning`, `--info`, `--chart-*`, `--sidebar`.

### How components use tokens

| Token type | How components use them | Example |
|------------|--------------------------|---------|
| **Colors** | Tailwind utilities (from `@theme`) | `bg-primary`, `text-muted-foreground` |
| **Spacing, radius, shadow, control** | `var()` in arbitrary values | `h-[var(--control-height-md)]`, `rounded-[var(--card-radius)]` |
| **Font size** | `text-[length:var(--...)]` (avoids color ambiguity) | `text-[length:var(--control-font-size-md)]` |

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

## Adding components

Add shadcn components with the CLI:

```bash
npx shadcn@latest add <component-name>
```

When prompted to overwrite existing files (e.g. `button.tsx`), choose **no** to preserve your token-driven customizations.

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

## License

Private.
