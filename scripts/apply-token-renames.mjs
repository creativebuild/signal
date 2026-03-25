#!/usr/bin/env node
/**
 * Replaces var(--token) references after token architecture migration.
 * Pairs are applied longest-first so --primary-foreground wins over --primary.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

const PAIRS = [
  ["--popover-foreground", "--color-popover-fg"],
  ["--card-foreground", "--color-card-fg"],
  ["--secondary-foreground", "--color-secondary-fg"],
  ["--destructive-foreground", "--color-destructive-fg"],
  ["--success-foreground", "--color-success-fg"],
  ["--warning-foreground", "--color-warning-fg"],
  ["--info-foreground", "--color-info-fg"],
  ["--primary-foreground", "--color-primary-fg"],
  ["--muted-foreground", "--color-muted-fg"],
  ["--accent-foreground", "--color-accent-fg"],
  ["--selection-foreground", "--color-selection-fg"],
  ["--link-foreground", "--color-link-fg"],
  ["--press-foreground", "--color-press-fg"],
  ["--data-status-positive", "--color-data-status-positive"],
  ["--data-status-negative", "--color-data-status-negative"],
  ["--data-status-warning", "--color-data-status-warning"],
  ["--data-status-neutral", "--color-data-status-neutral"],
  ["--data-value-positive", "--color-data-value-positive"],
  ["--data-value-negative", "--color-data-value-negative"],
  ["--data-value-neutral", "--color-data-value-neutral"],
  ["--destructive-subtle-hover", "--color-destructive-subtle-hover"],
  ["--success-subtle-hover", "--color-success-subtle-hover"],
  ["--warning-subtle-hover", "--color-warning-subtle-hover"],
  ["--info-subtle-hover", "--color-info-subtle-hover"],
  ["--control-input-bg-disabled", "--input-bg-disabled"],
  ["--control-input-bg-hover", "--input-bg-hover"],
  ["--control-input-bg-focus", "--input-bg-focus"],
  ["--destructive-subtle", "--color-destructive-subtle"],
  ["--success-subtle", "--color-success-subtle"],
  ["--warning-subtle", "--color-warning-subtle"],
  ["--info-subtle", "--color-info-subtle"],
  ["--menu-item-px", "--space-menu-item-x"],
  ["--menu-item-py", "--space-menu-item-y"],
  ["--content-padding", "--space-content"],
  ["--card-padding", "--space-card"],
  ["--control-height-sm", "--size-control-sm"],
  ["--control-height-md", "--size-control-md"],
  ["--control-height-lg", "--size-control-lg"],
  ["--control-px-sm", "--space-control-x-sm"],
  ["--control-px-md", "--space-control-x-md"],
  ["--control-px-lg", "--space-control-x-lg"],
  ["--control-gap-x", "--space-gap-x-control"],
  ["--control-gap-y", "--space-gap-y-control"],
  ["--disabled-opacity", "--opacity-disabled"],
  ["--avatar-size-sm", "--size-avatar-sm"],
  ["--avatar-size-md", "--size-avatar-md"],
  ["--avatar-size-lg", "--size-avatar-lg"],
  ["--focus-ring-width", "--size-ring-width"],
  ["--focus-ring-offset", "--size-ring-offset"],
  ["--secondary-hover", "--color-secondary-hover"],
  ["--text-4xl", "--font-size-4xl"],
  ["--text-3xl", "--font-size-3xl"],
  ["--text-2xl", "--font-size-2xl"],
  ["--text-base", "--font-size-base"],
  ["--data-identifier", "--color-data-identifier"],
  ["--data-secondary", "--color-data-secondary"],
  ["--data-category", "--color-data-category"],
  ["--data-datetime", "--color-data-datetime"],
  ["--data-currency", "--color-data-currency"],
  ["--data-entity", "--color-data-entity"],
  ["--data-primary", "--color-data-primary"],
  ["--text-xs", "--font-size-xs"],
  ["--text-sm", "--font-size-sm"],
  ["--text-lg", "--font-size-lg"],
  ["--text-xl", "--font-size-xl"],
  ["--primary-10", "--color-primary-alpha-10"],
  ["--primary-20", "--color-primary-alpha-20"],
  ["--primary-30", "--color-primary-alpha-30"],
  ["--primary-40", "--color-primary-alpha-40"],
  ["--primary-50", "--color-primary-alpha-50"],
  ["--primary-60", "--color-primary-alpha-60"],
  ["--primary-70", "--color-primary-alpha-70"],
  ["--primary-80", "--color-primary-alpha-80"],
  ["--primary-90", "--color-primary-alpha-90"],
  ["--control-input-bg", "--input-bg"],
  ["--control-gap", "--space-gap-control"],
  ["--badge-height", "--size-badge"],
  ["--badge-px", "--space-badge-x"],
  ["--icon-size", "--size-icon"],
  ["--menu-padding", "--space-menu"],
  ["--primary-5", "--color-primary-alpha-5"],
  ["--foreground", "--color-fg"],
  ["--background", "--color-bg"],
  ["--destructive", "--color-destructive"],
  ["--secondary", "--color-secondary"],
  ["--selection", "--color-selection"],
  ["--popover", "--color-popover"],
  ["--muted", "--color-muted"],
  ["--accent", "--color-accent"],
  ["--warning", "--color-warning"],
  ["--success", "--color-success"],
  ["--primary", "--color-primary"],
  ["--card", "--color-card"],
  ["--info", "--color-info"],
  ["--press", "--color-press"],
  ["--link", "--color-link"],
  ["--border", "--color-border"],
  ["--input", "--color-input-border"],
  ["--ring", "--color-ring"],
];

PAIRS.sort((a, b) => b[0].length - a[0].length);

const SKIP_SUBSTR = [
  "/styles/tokens/primitives.css",
  "/styles/tokens/semantic.css",
  ".tokens.css",
];

function shouldProcess(file) {
  const rel = file.replace(ROOT + path.sep, "");
  if (rel === "app/tokens.css") return false;
  for (const s of SKIP_SUBSTR) {
    if (file.includes(s)) return false;
  }
  return true;
}

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    if (name.name.startsWith(".")) continue;
    const p = path.join(dir, name.name);
    if (name.isDirectory()) {
      if (name.name === "node_modules" || name.name === ".next") continue;
      walk(p, out);
    } else if (/\.(css|tsx|ts|jsx|js|mjs)$/.test(name.name)) {
      out.push(p);
    }
  }
  return out;
}

function transform(content) {
  let s = content;
  for (const [from, to] of PAIRS) {
    const needle = `var(${from})`;
    const repl = `var(${to})`;
    s = s.split(needle).join(repl);
  }
  return s;
}

const dirs = [
  path.join(ROOT, "app"),
  path.join(ROOT, "components"),
  path.join(ROOT, "scripts"),
];

for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  for (const file of walk(dir)) {
    if (!shouldProcess(file)) continue;
    const raw = fs.readFileSync(file, "utf8");
    const next = transform(raw);
    if (next !== raw) {
      fs.writeFileSync(file, next);
      console.log("updated", path.relative(ROOT, file));
    }
  }
}
