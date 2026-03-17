# Design System POC — Token-driven shadcn/ui

A Next.js 15 proof-of-concept demonstrating a fully token-driven design system built on shadcn/ui. Every visual decision—color, spacing, typography, radius, shadow—flows from CSS custom properties in `app/globals.css`. Change a token once, and every component that uses it updates.

## Overview

This POC validates a design-token approach for a component library:

- **Single source of truth**: All tokens live in `globals.css`; no hardcoded values in components.
- **Theme support**: Light and dark modes via `next-themes` and `.dark` overrides.
- **shadcn/ui foundation**: New York style, zinc base, CSS variables enabled.
- **Tailwind v4**: Uses `@theme inline` to map tokens to utilities.

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

### Spacing tokens

`--space-1` through `--space-12` (0.25rem → 3rem).

### Typography tokens

```css
--font-size-xs, --font-size-sm, --font-size-base, --font-size-lg, --font-size-xl, --font-size-2xl, --font-size-3xl
--line-height-tight, --line-height-normal, --line-height-relaxed
--font-weight-normal, --font-weight-medium, --font-weight-semibold, --font-weight-bold
```

### Component tokens

Per-component sizing tokens:

- **Button**: `--button-height-*`, `--button-px-*`, `--button-font-size-*`, `--button-gap`
- **Input**: `--input-height-*`, `--input-px`, `--input-font-size`
- **Card**: `--card-padding`, `--card-radius`, `--card-shadow`
- **Badge**: `--badge-height`, `--badge-px`, `--badge-font-size`, `--badge-radius`
- **Avatar**: `--avatar-size-sm`, `--avatar-size-md`, `--avatar-size-lg`
- **Nav/Sidebar**: `--nav-item-height`, `--nav-item-px`, `--sidebar-width`

### Radius & shadow

`--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-full`  
`--shadow-sm`, `--shadow-md`, `--shadow-lg`

## Theme mapping

Tokens are exposed to Tailwind via `@theme inline` in `globals.css`:

```css
@theme inline {
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  /* ... */
}
```

Utilities like `bg-primary`, `text-primary-foreground`, `rounded-md` resolve to these tokens.

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

## Implementation notes

### Tailwind v4: font-size vs color

When using `text-[var(--button-font-size-md)]` for font size, Tailwind v4 may interpret it as a color. Use the `length` type hint:

```tsx
text-[length:var(--button-font-size-md)]  // ✓ Correct
text-[var(--button-font-size-md)]        // ✗ May override text color
```

### Dark mode accent

For menu hover states (Select, Combobox, Menubar, Navigation Menu, Dropdown) to be visible in dark mode, `--accent` must be lighter than `--popover`. This POC uses `oklch(0.371 0 0)` (shadcn default) so hovered items stand out against the popover background.

### iCloud Drive

If the project lives in iCloud Drive, build artifacts can cause issues. Consider moving the project outside iCloud (e.g. `~/Projects`) if you see `routes-manifest.json` or similar errors. Run `rm -rf .next && npm run dev` to reset the build cache.

## License

Private.
