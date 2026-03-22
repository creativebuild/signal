#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TOKENS_CSS = path.join(ROOT, "app", "tokens.css");
const OUTPUT_FILE = path.join(ROOT, "tokens", "variables-pro.json");

/** Extract CSS custom properties from a block. Returns { name: value } */
function extractVars(cssBlock) {
  const vars = {};
  const regex = /--([a-zA-Z0-9-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = regex.exec(cssBlock)) !== null) {
    vars[`--${m[1]}`] = m[2].trim();
  }
  return vars;
}

/** Extract vars from the first :root block (must not match “:root” inside comments) */
function extractRootVars(css) {
  const start = css.indexOf(":root {");
  if (start === -1) return {};
  const openBrace = css.indexOf("{", start);
  if (openBrace === -1) return {};
  let depth = 1;
  let pos = openBrace + 1;
  while (pos < css.length && depth > 0) {
    if (css[pos] === "{") depth++;
    else if (css[pos] === "}") depth--;
    pos++;
  }
  return extractVars(css.slice(openBrace + 1, pos - 1));
}

/** Extract vars from .dark block */
function extractDarkVars(css) {
  const start = css.indexOf(".dark {");
  if (start === -1) return {};
  const openBrace = css.indexOf("{", start);
  if (openBrace === -1) return {};
  let depth = 1;
  let pos = openBrace + 1;
  while (pos < css.length && depth > 0) {
    if (css[pos] === "{") depth++;
    else if (css[pos] === "}") depth--;
    pos++;
  }
  return extractVars(css.slice(openBrace + 1, pos - 1));
}

function remToPx(value) {
  const match = String(value).match(/^([\d.]+)rem$/);
  if (match) return Math.round(parseFloat(match[1]) * 16);
  const pxMatch = String(value).match(/^([\d.]+)px$/);
  if (pxMatch) return parseFloat(pxMatch[1]);
  return null;
}

function spacingCalcToPx(value) {
  const m = String(value).trim()
    .match(/^calc\(var\(--spacing\)\s*\*\s*([\d.]+)\)$/i);
  if (!m) return null;
  return Math.round(parseFloat(m[1]) * 0.25 * 16);
}

function toExportPx(value, allVars, depth = 0) {
  if (depth > 8) return null;
  const v = String(value).trim();
  const fromSpacing = spacingCalcToPx(v);
  if (fromSpacing !== null) return fromSpacing;
  const literal = remToPx(v);
  if (literal !== null) return literal;
  const varM = v.match(/^var\(--([a-zA-Z0-9-]+)\)$/);
  if (varM && allVars[`--${varM[1]}`]) {
    return toExportPx(allVars[`--${varM[1]}`], allVars, depth + 1);
  }
  return null;
}

function isColorValue(value) {
  if (!value) return false;
  const v = String(value);
  return v.startsWith("var(") || v.startsWith("oklch") || v.startsWith("rgba") || v.startsWith("#") || v === "transparent";
}

/** Build Light Mode export */
function buildLightMode(vars) {
  const mode = {};

  // --- Colors ---
  const fillOnlyKeys = new Set([
    "background", "foreground", "primary-foreground", "secondary-foreground",
    "muted-foreground", "accent-foreground", "destructive-foreground",
    "success-foreground", "warning-foreground", "info-foreground",
    "popover-foreground", "card-foreground", "sidebar-foreground",
    "link-foreground", "press-foreground", "selection-foreground",
  ]);
  const strokeOnlyKeys = new Set(["border", "input", "ring"]);

  const colorKeys = [
    "background", "foreground", "card", "card-foreground",
    "popover", "popover-foreground", "primary", "primary-foreground",
    "secondary", "secondary-foreground", "secondary-hover",
    "muted", "muted-foreground", "accent", "accent-foreground",
    "link", "link-foreground", "destructive", "destructive-foreground",
    "success", "success-foreground", "warning", "warning-foreground",
    "info", "info-foreground", "press", "press-foreground",
    "selection", "selection-foreground",
    "border", "input", "ring",
    "chart-1", "chart-2", "chart-3", "chart-4", "chart-5",
    "sidebar", "sidebar-foreground",
    "data-primary", "data-secondary", "data-currency", "data-entity",
    "data-identifier", "data-category", "data-datetime",
    "data-status-positive", "data-status-negative", "data-status-warning", "data-status-neutral",
    "data-value-positive", "data-value-negative", "data-value-neutral",
  ];

  mode.colors = {};
  for (const key of colorKeys) {
    const value = vars[`--${key}`];
    if (!value) continue;
    let scopes;
    if (strokeOnlyKeys.has(key)) scopes = ["STROKE_COLOR"];
    else if (fillOnlyKeys.has(key)) scopes = ["ALL_FILLS"];
    else scopes = ["ALL_FILLS", "STROKE_COLOR"];
    mode.colors[key] = { $type: "color", $value: value, $scopes: scopes };
  }

  // --- Radius ---
  mode.radius = {};
  const radiusMd = vars["--radius-md"];
  if (radiusMd) {
    const px = remToPx(radiusMd);
    if (px !== null) mode.radius.base = { $type: "float", $value: px, $scopes: ["CORNER_RADIUS"] };
  }
  for (const key of ["container", "control", "inset", "pill"]) {
    const v = vars[`--radius-${key}`];
    if (!v) continue;
    const px = toExportPx(v, vars);
    if (px !== null) {
      mode.radius[key] = { $type: "float", $value: px, $scopes: ["CORNER_RADIUS"] };
    } else {
      mode.radius[key] = { $type: "string", $value: v, $scopes: ["CORNER_RADIUS"] };
    }
  }

  // --- Spacing / sizing ---
  mode.spacing = {};

  const spacingTokens = {
    "control-height-sm": { scopes: ["WIDTH_HEIGHT"] },
    "control-height-md": { scopes: ["WIDTH_HEIGHT"] },
    "control-height-lg": { scopes: ["WIDTH_HEIGHT"] },
    "control-px-sm":     { scopes: ["GAP"] },
    "control-px-md":     { scopes: ["GAP"] },
    "control-px-lg":     { scopes: ["GAP"] },
    "control-gap-x":     { scopes: ["GAP"] },
    "control-gap-y":     { scopes: ["GAP"] },
    "card-padding":      { scopes: ["GAP"] },
    "content-padding":   { scopes: ["GAP"] },
    "menu-padding":      { scopes: ["GAP"] },
    "menu-item-px":      { scopes: ["GAP"] },
    "menu-item-py":      { scopes: ["GAP"] },
    "icon-size":         { scopes: ["WIDTH_HEIGHT"] },
    "badge-height":      { scopes: ["WIDTH_HEIGHT"] },
    "badge-px":          { scopes: ["GAP"] },
    "avatar-size-sm":    { scopes: ["WIDTH_HEIGHT"] },
    "avatar-size-md":    { scopes: ["WIDTH_HEIGHT"] },
    "avatar-size-lg":    { scopes: ["WIDTH_HEIGHT"] },
    "sidebar-width":     { scopes: ["WIDTH_HEIGHT"] },
  };

  for (const [key, meta] of Object.entries(spacingTokens)) {
    const v = vars[`--${key}`];
    if (!v) continue;
    const px = toExportPx(v, vars);
    if (px !== null) {
      mode.spacing[key] = { $type: "float", $value: px, $scopes: meta.scopes };
    }
  }

  // --- Visual tokens ---
  const disabledOpacity = vars["--disabled-opacity"];
  if (disabledOpacity) {
    mode["disabled-opacity"] = { $type: "float", $value: parseFloat(disabledOpacity), $scopes: ["OPACITY"] };
  }

  // --- Data table ---
  mode["data-table"] = {};

  const dtSizeTokens = {
    "row-height-sm":  { scopes: ["WIDTH_HEIGHT"] },
    "row-height-md":  { scopes: ["WIDTH_HEIGHT"] },
    "row-height-lg":  { scopes: ["WIDTH_HEIGHT"] },
    "header-height":  { scopes: ["WIDTH_HEIGHT"] },
    "cell-px":        { scopes: ["GAP"] },
  };
  for (const [key, meta] of Object.entries(dtSizeTokens)) {
    const v = vars[`--data-table-${key}`];
    if (!v) continue;
    const px = toExportPx(v, vars);
    if (px !== null) {
      mode["data-table"][key] = { $type: "float", $value: px, $scopes: meta.scopes };
    }
  }

  const dtFontSize = vars["--data-table-font-size"];
  if (dtFontSize) {
    const px = remToPx(dtFontSize);
    if (px !== null) mode["data-table"]["font-size"] = { $type: "float", $value: px, $scopes: ["FONT_SIZE"] };
  }
  const dtHeaderFontSize = vars["--data-table-header-font-size"];
  if (dtHeaderFontSize) {
    const px = toExportPx(dtHeaderFontSize, vars);
    if (px !== null) mode["data-table"]["header-font-size"] = { $type: "float", $value: px, $scopes: ["FONT_SIZE"] };
  }

  return mode;
}

/** Build Dark Mode — only color overrides */
function buildDarkMode(darkVars) {
  const mode = { colors: {} };
  for (const [name, value] of Object.entries(darkVars)) {
    if (!isColorValue(value)) continue;
    const key = name.replace(/^--/, "");
    mode.colors[key] = { $type: "color", $value: value, $scopes: ["ALL_FILLS", "STROKE_COLOR"] };
  }
  return mode;
}

function countTokens(obj) {
  let count = 0;
  for (const v of Object.values(obj)) {
    if (v && typeof v === "object" && v.$type) count++;
    else if (v && typeof v === "object" && !Array.isArray(v)) count += countTokens(v);
  }
  return count;
}

function main() {
  const css = fs.readFileSync(TOKENS_CSS, "utf8");
  const vars = extractRootVars(css);
  const darkVars = extractDarkVars(css);

  const lightMode = buildLightMode(vars);
  const darkMode = buildDarkMode(darkVars);

  const output = [{
    "Design System": {
      modes: {
        "Light Mode": lightMode,
        "Dark Mode": darkMode,
      },
    },
  }];

  const jsonStr = JSON.stringify(output, null, 2);
  try { JSON.parse(jsonStr); } catch (e) {
    console.error("Invalid JSON generated:", e.message);
    process.exit(1);
  }

  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, jsonStr);

  console.log("Exported tokens/variables-pro.json (Variables Pro format)");
  console.log(`  Light Mode: ${countTokens(lightMode)} tokens`);
  console.log(`  Dark Mode: ${countTokens(darkMode)} color overrides`);
  console.log("  (Full npm run tokens also writes tokens/light.json + tokens/dark.json via export-tokens-figma.js)");
}

main();
