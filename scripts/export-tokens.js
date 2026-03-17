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

/** Extract vars from :root block only */
function extractRootVars(css) {
  const rootMatch = css.match(/:root\s*\{([\s\S]*?)\}(?=\s*(?:\.|@|$))/m);
  if (!rootMatch) return {};
  return extractVars(rootMatch[1]);
}

/** Extract vars from .dark block only */
function extractDarkVars(css) {
  const darkMatch = css.match(/\.dark\s*\{([\s\S]*?)\}(?=\s*(?:\.|@|$))/m);
  if (!darkMatch) return {};
  return extractVars(darkMatch[1]);
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

  // Radius
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
  const fillOnly = ["background", "foreground", "primary-foreground", "secondary-foreground", "muted-foreground", "accent-foreground", "destructive-foreground", "success-foreground", "warning-foreground", "info-foreground", "popover-foreground", "card-foreground", "sidebar-foreground"];
  const strokeOnly = ["border", "input", "ring"];

  mode.colors = {};
  const colorKeys = [
    "background", "foreground", "card", "card-foreground",
    "popover", "popover-foreground", "primary", "primary-foreground",
    "secondary", "secondary-foreground", "muted", "muted-foreground",
    "accent", "accent-foreground", "destructive", "destructive-foreground",
    "success", "success-foreground", "warning", "warning-foreground",
    "info", "info-foreground", "border", "input", "ring",
    "chart-1", "chart-2", "chart-3", "chart-4", "chart-5",
    "sidebar", "sidebar-foreground",
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

  return mode;
}

/** Build Dark Mode from .dark block */
function buildDarkMode(darkVars) {
  const mode = { colors: {} };

  const fillOnly = ["background", "foreground", "primary-foreground", "secondary-foreground", "muted-foreground", "accent-foreground", "destructive-foreground", "popover-foreground", "card-foreground", "sidebar-foreground"];
  const strokeOnly = ["border", "input", "ring"];

  for (const [name, value] of Object.entries(darkVars)) {
    const key = name.replace(/^--/, "");
    if (!value || !value.startsWith("oklch")) continue;

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
