# Design System POC — Token-driven shadcn/ui

A Next.js 15 app demonstrating a fully token-driven shadcn/ui design system. All visual decisions (color, spacing, sizing, typography, radius, shadow) are controlled by CSS custom properties in `app/globals.css`.

## Setup

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Adding more shadcn components

To add components not yet included:

```bash
npx shadcn@latest add accordion alert alert-dialog aspect-ratio avatar badge \
  breadcrumb button button-group calendar card carousel chart checkbox collapsible \
  command context-menu dialog drawer dropdown-menu hover-card input input-otp \
  label menubar navigation-menu pagination popover progress radio-group resizable \
  scroll-area select separator sheet sidebar skeleton slider sonner spinner switch \
  table tabs textarea toggle toggle-group tooltip
```

## Token architecture

- **Color tokens**: Semantic colors in OKLCH (`--background`, `--foreground`, `--primary`, etc.)
- **Spacing**: `--space-1` through `--space-12`
- **Typography**: `--font-size-*`, `--line-height-*`, `--font-weight-*`
- **Radius**: `--radius-sm`, `--radius-md`, `--radius-lg`, etc.
- **Component tokens**: Button, Input, Card, Badge, Avatar, Nav/Sidebar
- **Dark mode**: `.dark` overrides color tokens only

Changing a single token in `:root` updates every component that uses it.

## Gallery

The app renders a component gallery with light/dark theme toggle. Use the theme toggle (top-right) to switch between modes.
