#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TOKENS_CSS = path.join(ROOT, "app", "tokens.css");
const GLOBALS_CSS = path.join(ROOT, "app", "globals.css");
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

/** Extract vars from :root block — handles nested braces in values */
function extractRootVars(css) {
  const start = css.indexOf(":root");
  if (start === -1) return {};
  const openBrace = css.indexOf("{", start);
  if (openBrace === -1) return {};
  let depth = 1;
  let pos = openBrace + 1;
  while (pos < css.length && depth > 0) {
    const c = css[pos];
    if (c === "{") depth++;
    else if (c === "}") depth--;
    pos++;
  }
  const block = css.slice(openBrace + 1, pos - 1);
  return extractVars(block);
}

/** Extract vars from .dark block */
function extractDarkVars(css) {
  const start = css.indexOf(".dark");
  if (start === -1) return {};
  const openBrace = css.indexOf("{", start);
  if (openBrace === -1) return {};
  let depth = 1;
  let pos = openBrace + 1;
  while (pos < css.length && depth > 0) {
    const c = css[pos];
    if (c === "{") depth++;
    else if (c === "}") depth--;
    pos++;
  }
  const block = css.slice(openBrace + 1, pos - 1);
  return extractVars(block);
}

/** Convert rem to px (multiply by 16) */
function remToPx(value) {
  const match = String(value).match(/^([\d.]+)rem$/);
  if (match) return Math.round(parseFloat(match[1]) * 16);
  const pxMatch = String(value).match(/^([\d.]+)px$/);
  if (pxMatch) return parseFloat(pxMatch[1]);
  return null;
}

/** Build Light Mode from tokens.css and globals.css */
function buildLightMode(dsVars, semanticVars) {
  const mode = {};

  // Spacing
  mode.spacing = {};
  for (const [name, value] of Object.entries(dsVars)) {
    if (!name.startsWith("--ds-space-")) continue;
    const key = name.replace("--ds-space-", "");
    const px = remToPx(value);
    if (px !== null) {
      mode.spacing[key] = {
        $type: "float",
        $value: px,
        $scopes: ["GAP", "WIDTH_HEIGHT"],
      };
    }
  }

  // Radius — include calc() values as strings when not parseable to px
  mode.radius = {};
  for (const [name, value] of Object.entries(dsVars)) {
    if (!name.startsWith("--ds-radius-")) continue;
    const key = name.replace("--ds-radius-", "");
    const px = remToPx(value);
    if (px !== null) {
      mode.radius[key] = {
        $type: "float",
        $value: px,
        $scopes: ["CORNER_RADIUS"],
      };
    } else {
      mode.radius[key] = {
        $type: "string",
        $value: value,
        $scopes: ["CORNER_RADIUS"],
      };
    }
  }
  // Shadow (keep as string)
  mode.shadow = {};
  for (const [name, value] of Object.entries(dsVars)) {
    if (!name.startsWith("--ds-shadow-")) continue;
    const key = name.replace("--ds-shadow-", "");
    mode.shadow[key] = {
      $type: "string",
      $value: value,
      $scopes: [],
    };
  }

  // Typography
  mode.typography = {
    "font-size": {},
    "line-height": {},
    "font-weight": {},
  };
  for (const [name, value] of Object.entries(dsVars)) {
    if (name.startsWith("--ds-text-")) {
      const key = name.replace("--ds-text-", "");
      const px = remToPx(value);
      if (px !== null) {
        mode.typography["font-size"][key] = {
          $type: "float",
          $value: px,
          $scopes: ["FONT_SIZE"],
        };
      }
    } else if (name.startsWith("--ds-leading-")) {
      const key = name.replace("--ds-leading-", "");
      mode.typography["line-height"][key] = {
        $type: "float",
        $value: parseFloat(value),
        $scopes: ["LINE_HEIGHT"],
      };
    } else if (name.startsWith("--ds-font-")) {
      const key = name.replace("--ds-font-", "");
      mode.typography["font-weight"][key] = {
        $type: "float",
        $value: parseInt(value, 10),
        $scopes: ["FONT_WEIGHT"],
      };
    }
  }

  // Colors (semantic)
  const fillOnly = ["background", "foreground", "primary-foreground", "secondary-foreground", "muted-foreground", "accent-foreground", "destructive-foreground", "success-foreground", "warning-foreground", "info-foreground", "popover-foreground", "card-foreground", "sidebar-foreground", "link-foreground", "press-foreground", "selection-foreground"];
  const strokeOnly = ["border", "input", "ring"];

  mode.colors = {};
  const colorKeys = [
    "background", "foreground", "card", "card-foreground",
    "popover", "popover-foreground", "primary", "primary-foreground",
    "secondary", "secondary-foreground", "secondary-hover", "muted", "muted-foreground",
    "accent", "accent-foreground", "link", "link-foreground",
    "destructive", "destructive-foreground", "success", "success-foreground",
    "warning", "warning-foreground", "info", "info-foreground",
    "press", "press-foreground", "selection", "selection-foreground",
    "border", "input", "ring",
    "chart-1", "chart-2", "chart-3", "chart-4", "chart-5",
    "sidebar", "sidebar-foreground",
    "data-primary", "data-secondary", "data-currency", "data-entity", "data-identifier", "data-category", "data-datetime",
    "data-status-positive", "data-status-negative", "data-status-warning", "data-status-neutral",
    "data-value-positive", "data-value-negative", "data-value-neutral",
  ];

  for (const key of colorKeys) {
    const value = semanticVars[`--${key}`];
    if (!value) continue;

    let scopes;
    if (strokeOnly.includes(key)) {
      scopes = ["STROKE_COLOR"];
    } else if (fillOnly.includes(key)) {
      scopes = ["ALL_FILLS"];
    } else {
      scopes = ["ALL_FILLS", "STROKE_COLOR"];
    }

    mode.colors[key] = {
      $type: "color",
      $value: value,
      $scopes: scopes,
    };
  }

  // Components
  mode.components = {
    control: {
      height: {},
      padding: {},
      gap: null,
    },
    card: { padding: null },
    badge: { height: null, padding: null },
    avatar: {},
    sidebar: { width: null },
  };

  const controlHeightKeys = ["xs", "sm", "md", "lg", "xl"];
  for (const size of controlHeightKeys) {
    const v = semanticVars[`--control-height-${size}`];
    if (v) {
      const px = remToPx(v);
      if (px !== null) {
        mode.components.control.height[size] = {
          $type: "float",
          $value: px,
          $scopes: ["WIDTH_HEIGHT"],
        };
      }
    }
  }

  const controlPxKeys = ["xs", "sm", "md", "lg", "xl"];
  for (const size of controlPxKeys) {
    const v = semanticVars[`--control-px-${size}`];
    if (v) {
      const px = remToPx(v);
      if (px !== null) {
        mode.components.control.padding[size] = {
          $type: "float",
          $value: px,
          $scopes: ["GAP"],
        };
      }
    }
  }

  const gapVal = semanticVars["--control-gap"];
  if (gapVal) {
    const px = remToPx(gapVal);
    if (px !== null) {
      mode.components.control.gap = {
        $type: "float",
        $value: px,
        $scopes: ["GAP"],
      };
    }
  }

  const cardPadding = semanticVars["--card-padding"];
  if (cardPadding) {
    const px = remToPx(cardPadding);
    if (px !== null) {
      mode.components.card.padding = {
        $type: "float",
        $value: px,
        $scopes: ["GAP"],
      };
    }
  }

  const badgeHeight = semanticVars["--badge-height"];
  if (badgeHeight) {
    const px = remToPx(badgeHeight);
    if (px !== null) {
      mode.components.badge.height = {
        $type: "float",
        $value: px,
        $scopes: ["WIDTH_HEIGHT"],
      };
    }
  }

  const badgePx = semanticVars["--badge-px"];
  if (badgePx) {
    const px = remToPx(badgePx);
    if (px !== null) {
      mode.components.badge.padding = {
        $type: "float",
        $value: px,
        $scopes: ["GAP"],
      };
    }
  }

  const avatarSizes = { sm: "avatar-size-sm", md: "avatar-size-md", lg: "avatar-size-lg" };
  for (const [size, varName] of Object.entries(avatarSizes)) {
    const v = semanticVars[`--${varName}`];
    if (v) {
      const px = remToPx(v);
      if (px !== null) {
        mode.components.avatar[`size-${size}`] = {
          $type: "float",
          $value: px,
          $scopes: ["WIDTH_HEIGHT"],
        };
      }
    }
  }

  const sidebarWidth = semanticVars["--sidebar-width"];
  if (sidebarWidth) {
    const px = remToPx(sidebarWidth);
    if (px !== null) {
      mode.components.sidebar.width = {
        $type: "float",
        $value: px,
        $scopes: ["WIDTH_HEIGHT"],
      };
    }
  }

  // Data table
  mode.components["data-table"] = { "row-height": {} };
  const dataTableRowHeights = { sm: "data-table-row-height-sm", md: "data-table-row-height-md", lg: "data-table-row-height-lg" };
  for (const [size, varName] of Object.entries(dataTableRowHeights)) {
    const v = semanticVars[`--${varName}`];
    if (v) {
      const px = remToPx(v);
      if (px !== null) {
        mode.components["data-table"]["row-height"][size] = {
          $type: "float",
          $value: px,
          $scopes: ["WIDTH_HEIGHT"],
        };
      }
    }
  }

  // All tokens — every variable from tokens.css + globals.css
  mode.tokens = buildAllTokens({ ...dsVars, ...semanticVars });

  return mode;
}

/** Build comprehensive tokens object from all CSS vars — mirrors globals/tokens structure */
function buildAllTokens(allVars) {
  const fillOnly = /-foreground|-fg$|-fg-hover|-fg-active|-fg-selected|-fg-checked|-fg-disabled|-fg-hover$/;
  const strokeOnly = ["border", "input", "ring", "border-hover", "border-focus", "border-error", "border-disabled", "border-checked"];

  function isColor(value) {
    if (!value) return false;
    const v = String(value);
    return v.startsWith("var(") || v.startsWith("oklch") || v.startsWith("rgba") || v.startsWith("#") || v === "transparent";
  }

  function tokenEntry(name, value) {
    const key = name.replace(/^--/, "");
    if (isColor(value)) {
      const fillOnlyMatch = fillOnly.test(key) || ["foreground", "muted-foreground", "accent-foreground"].some((k) => key === k);
      const strokeOnlyMatch = strokeOnly.some((k) => key === k || key.endsWith("-border") || key.endsWith("-border-color"));
      let scopes = ["ALL_FILLS", "STROKE_COLOR"];
      if (strokeOnlyMatch && !fillOnlyMatch) scopes = ["STROKE_COLOR"];
      else if (fillOnlyMatch && !strokeOnlyMatch) scopes = ["ALL_FILLS"];
      return { $type: "color", $value: value, $scopes: scopes };
    }
    const px = remToPx(value);
    if (px !== null) {
      return { $type: "float", $value: px, $scopes: ["GAP", "WIDTH_HEIGHT", "CORNER_RADIUS"] };
    }
    const num = parseFloat(value);
    if (!isNaN(num) && value === String(num)) {
      return { $type: "float", $value: num, $scopes: [] };
    }
    return { $type: "string", $value: value, $scopes: [] };
  }

  function setNested(obj, path, value) {
    const parts = path.split("-");
    let cur = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i];
      if (!cur[p]) cur[p] = {};
      cur = cur[p];
    }
    cur[parts[parts.length - 1]] = value;
  }

  const result = {};
  const seenInStructured = new Set([
    "ds-space-1", "ds-space-2", "ds-space-3", "ds-space-4", "ds-space-5", "ds-space-6",
    "ds-space-8", "ds-space-10", "ds-space-12",
    "ds-radius-sm", "ds-radius-md", "ds-radius-lg", "ds-radius-xl", "ds-radius-full",
    "ds-shadow-sm", "ds-shadow-md", "ds-shadow-lg",
    "ds-text-xs", "ds-text-sm", "ds-text-base", "ds-text-lg", "ds-text-xl", "ds-text-2xl", "ds-text-3xl",
    "ds-leading-tight", "ds-leading-normal", "ds-leading-relaxed",
    "ds-font-normal", "ds-font-medium", "ds-font-semibold", "ds-font-bold",
  ]);

  for (const [name, value] of Object.entries(allVars)) {
    const key = name.replace(/^--/, "");
    if (key.startsWith("ds-") && seenInStructured.has(key)) continue;

    const entry = tokenEntry(name, value);
    const path = key.replace(/^ds-/, "").replace(/^radius-/, "radius.");
    const topLevel = key.startsWith("ds-")
      ? key.replace(/^ds-/, "").split("-")[0]
      : key.split("-")[0];

    let target = result;
    const prefix = key.startsWith("ds-") ? "primitives" : "semantic";
    if (!result[prefix]) result[prefix] = {};

    if (key.startsWith("button-")) {
      if (!result.components) result.components = {};
      if (!result.components.button) result.components.button = {};
      result.components.button[key.replace("button-", "")] = entry;
    } else if (key.startsWith("input-") || key.startsWith("select-") || key.startsWith("data-table-") ||
      key.startsWith("card-") || key.startsWith("badge-") || key.startsWith("dialog-") || key.startsWith("popover-") ||
      key.startsWith("toast-") || key.startsWith("tooltip-") || key.startsWith("dropdown-") || key.startsWith("tabs-") ||
      key.startsWith("table-") || key.startsWith("sidebar-") || key.startsWith("avatar-") || key.startsWith("checkbox-") ||
      key.startsWith("switch-") || key.startsWith("slider-") || key.startsWith("progress-") || key.startsWith("alert-") ||
      key.startsWith("skeleton-") || key.startsWith("separator-") || key.startsWith("accordion-") || key.startsWith("sheet-") ||
      key.startsWith("command-") || key.startsWith("nav-") || key.startsWith("pagination-") || key.startsWith("breadcrumb-") ||
      key.startsWith("calendar-") || key.startsWith("toggle-") || key.startsWith("scroll-") ||
      key.startsWith("component-") || key.startsWith("control-") || key.startsWith("drawer-") || key.startsWith("alert-dialog-")) {
      const [group, ...rest] = key.split("-");
      const groupKey = group === "data" ? "data-table" : group === "alert" && key.startsWith("alert-dialog") ? "alert-dialog" : group;
      if (!result.components) result.components = {};
      if (!result.components[groupKey]) result.components[groupKey] = {};
      const subKey = key.startsWith("alert-dialog") ? key.replace("alert-dialog-", "") : key.includes("-") ? key.substring(key.indexOf("-") + 1) : key;
      result.components[groupKey][subKey] = entry;
    } else {
      if (!result.semantic) result.semantic = {};
      result.semantic[key] = entry;
    }
  }

  const flattened = {};
  function flatten(obj, prefix = "") {
    for (const [k, v] of Object.entries(obj)) {
      if (v && typeof v === "object" && v.$type) {
        flattened[prefix ? `${prefix}.${k}` : k] = v;
      } else if (v && typeof v === "object" && !Array.isArray(v)) {
        flatten(v, prefix ? `${prefix}.${k}` : k);
      }
    }
  }
  flatten(result);

  return Object.keys(flattened).length > 0 ? result : {};
}

/** Build Dark Mode from .dark block — includes oklch and var() refs */
function buildDarkMode(darkVars) {
  const mode = { colors: {} };

  const fillOnly = ["background", "foreground", "primary-foreground", "secondary-foreground", "muted-foreground", "accent-foreground", "destructive-foreground", "success-foreground", "warning-foreground", "info-foreground", "popover-foreground", "card-foreground", "sidebar-foreground", "link-foreground", "press-foreground", "selection-foreground"];
  const strokeOnly = ["border", "input", "ring"];

  const colorKeyPattern = /^(background|foreground|card|popover|primary|secondary|muted|accent|destructive|success|warning|info|link|press|selection|sidebar|chart-\d|data-|table-row|data-table|button-|toast-|sidebar-item)/;

  for (const [name, value] of Object.entries(darkVars)) {
    const key = name.replace(/^--/, "");
    if (!value) continue;
    const isColor = value.startsWith("oklch") || value.startsWith("var(") || value.startsWith("rgba");
    if (!isColor) continue;

    let scopes;
    if (strokeOnly.includes(key)) {
      scopes = ["STROKE_COLOR"];
    } else if (fillOnly.includes(key)) {
      scopes = ["ALL_FILLS"];
    } else {
      scopes = ["ALL_FILLS", "STROKE_COLOR"];
    }

    mode.colors[key] = {
      $type: "color",
      $value: value,
      $scopes: scopes,
    };
  }

  return mode;
}

/** Count tokens in a mode for summary */
function countTokens(obj, prefix = "") {
  let count = 0;
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === "object" && v.$type) {
      count++;
    } else if (v && typeof v === "object" && !Array.isArray(v)) {
      count += countTokens(v, `${prefix}${k}.`);
    }
  }
  return count;
}

function main() {
  const tokensCss = fs.readFileSync(TOKENS_CSS, "utf8");
  const globalsCss = fs.readFileSync(GLOBALS_CSS, "utf8");

  const dsVars = extractRootVars(tokensCss);
  const semanticVars = extractRootVars(globalsCss);
  const darkVars = extractDarkVars(globalsCss);

  const lightMode = buildLightMode(dsVars, semanticVars);
  const darkMode = buildDarkMode(darkVars);

  const output = [
    {
      "Design System": {
        modes: {
          "Light Mode": lightMode,
          "Dark Mode": darkMode,
        },
      },
    },
  ];

  const jsonStr = JSON.stringify(output, null, 2);

  try {
    JSON.parse(jsonStr);
  } catch (e) {
    console.error("Invalid JSON generated:", e.message);
    process.exit(1);
  }

  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, jsonStr);

  const lightCount = countTokens(lightMode);
  const darkCount = countTokens(darkMode);

  console.log("Exported tokens/variables-pro.json (Variables Pro format)");
  console.log(`  Light Mode: ${lightCount} tokens`);
  console.log(`  Dark Mode: ${darkCount} color overrides`);
}

main();
