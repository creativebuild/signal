#!/usr/bin/env node
/**
 * Signal — DTCG JSON for Figma Variables: separate light.json + dark.json
 * from app/tokens.css + Tailwind theme.css
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TOKENS_CSS = path.join(ROOT, "app", "tokens.css");
const THEME_CSS = path.join(ROOT, "node_modules", "tailwindcss", "theme.css");
const TOKENS_DIR = path.join(ROOT, "tokens");
const OUTPUT_LIGHT = path.join(TOKENS_DIR, "light.json");
const OUTPUT_DARK = path.join(TOKENS_DIR, "dark.json");

const SPACING_PX = 4; /* 0.25rem = 4px */

/** Matches primitive/spacing/* keys in buildPrimitives (step × base px). */
const SPACING_SCALE_STEPS = [
  0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 64,
];
const SPACING_PRIMITIVE_KEYS = new Set(SPACING_SCALE_STEPS.map(String));

/** Matches primitive/radius/* keys in buildPrimitives */
const RADIUS_PRIMITIVE_KEYS = new Set([
  "none",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "full",
]);

/** Mode keys for Figma native Variables import. */
const M = { L: "Light", D: "Dark" };

/** Scopes accepted by Figma Variables import; unknown scopes can break import. */
const FIGMA_SCOPES = new Set([
  "ALL_FILLS",
  "FRAME_FILL",
  "SHAPE_FILL",
  "TEXT_FILL",
  "STROKE_COLOR",
  "CORNER_RADIUS",
  "WIDTH_HEIGHT",
  "GAP",
  "FONT_SIZE",
  "FONT_WEIGHT",
  "FONT_FAMILY",
  "LINE_HEIGHT",
  "LETTER_SPACING",
  "PARAGRAPH_SPACING",
  "OPACITY",
  "EFFECT_FLOAT",
]);

function modePair(lightVal, darkVal) {
  return { [M.L]: lightVal, [M.D]: darkVal };
}

/** Convert rgba/rgb to #RRGGBBAA for solid fills (Figma import rejects raw rgba() strings). */
function normalizeColorForFigma(v) {
  if (typeof v !== "string") return v;
  const s = v.trim().replace(/\s+/g, "");
  const rgba = s.match(
    /^rgba\((\d+),(\d+),(\d+),([\d.]+)\)$/i
  );
  if (rgba) {
    const r = Math.min(255, Math.max(0, parseInt(rgba[1], 10)));
    const g = Math.min(255, Math.max(0, parseInt(rgba[2], 10)));
    const b = Math.min(255, Math.max(0, parseInt(rgba[3], 10)));
    const a = Math.min(
      255,
      Math.max(0, Math.round(parseFloat(rgba[4]) * 255))
    );
    return `#${[r, g, b, a]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")}`;
  }
  const rgb = s.match(/^rgb\((\d+),(\d+),(\d+)\)$/i);
  if (rgb) {
    const r = Math.min(255, Math.max(0, parseInt(rgb[1], 10)));
    const g = Math.min(255, Math.max(0, parseInt(rgb[2], 10)));
    const b = Math.min(255, Math.max(0, parseInt(rgb[3], 10)));
    return `#${[r, g, b, 255]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")}`;
  }
  return v;
}

function figmaScopes(scopes) {
  const filtered = scopes.filter((s) => FIGMA_SCOPES.has(s));
  return filtered.length > 0 ? filtered : ["ALL_FILLS"];
}

/** ------------------------------------------------------------------ */
/** OKLCH → sRGB → hex (CSS Color 4 / Björn Ottosson) */
/** ------------------------------------------------------------------ */
function oklchToHex(oklchStr) {
  const m = String(oklchStr)
    .trim()
    .match(/^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)\s*\)$/i);
  if (!m) return null;
  let L = parseFloat(m[1]);
  if (m[1].includes("%")) L /= 100;
  const C = parseFloat(m[2]);
  const h = parseFloat(m[3]);
  const hr = (h / 360) * 2 * Math.PI;
  const a = C * Math.cos(hr);
  const b = C * Math.sin(hr);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m3 = m_ ** 3;
  const s = s_ ** 3;
  let r = 4.0767416621 * l - 3.3077115913 * m3 + 0.2309699292 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m3 - 0.3413193965 * s;
  let bl = -0.0041960863 * l - 0.7034186147 * m3 + 1.707614701 * s;
  const lin2srgb = (c) =>
    c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  const clip = (c) => {
    const v = lin2srgb(c);
    return Math.max(0, Math.min(1, v));
  };
  const R = Math.round(255 * clip(r));
  const G = Math.round(255 * clip(g));
  const B = Math.round(255 * clip(bl));
  return `#${[R, G, B].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

function colorValueToHex(value, paletteHexByVar) {
  const v = String(value).trim();
  if (/^#[0-9a-f]{3,8}$/i.test(v)) {
    if (v.length === 4) {
      return `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`.toLowerCase();
    }
    return v.toLowerCase();
  }
  const ok = v.match(/^oklch\(/i);
  if (ok) return oklchToHex(v);
  const varM = v.match(/^var\(--(color-[a-z0-9-]+)\)$/i);
  if (varM && paletteHexByVar[`--${varM[1].toLowerCase()}`]) {
    return paletteHexByVar[`--${varM[1].toLowerCase()}`];
  }
  if (/^rgba?\(/i.test(v)) return v.replace(/\s+/g, "");
  return null;
}

/** ------------------------------------------------------------------ */
/** CSS block extraction */
/** ------------------------------------------------------------------ */
function extractBlock(css, startNeedle) {
  const start = css.indexOf(startNeedle);
  if (start === -1) return null;
  const open = css.indexOf("{", start);
  if (open === -1) return null;
  let depth = 1;
  let pos = open + 1;
  while (pos < css.length && depth > 0) {
    if (css[pos] === "{") depth++;
    else if (css[pos] === "}") depth--;
    pos++;
  }
  return css.slice(open + 1, pos - 1);
}

function extractVars(cssBlock) {
  const vars = {};
  const re = /--([a-zA-Z0-9-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(cssBlock)) !== null) {
    vars[`--${m[1]}`] = m[2].trim();
  }
  return vars;
}

function parseThemeDefaultBlock(themeCss) {
  const idx = themeCss.indexOf("@theme default");
  if (idx === -1) return {};
  const sub = themeCss.slice(idx);
  const open = sub.indexOf("{");
  if (open === -1) return {};
  let depth = 1;
  let pos = open + 1;
  while (pos < sub.length && depth > 0) {
    if (sub[pos] === "{") depth++;
    else if (sub[pos] === "}") depth--;
    pos++;
  }
  return extractVars(sub.slice(open + 1, pos - 1));
}

/** ------------------------------------------------------------------ */
/** Tailwind palette → hex map + primitive tree */
/** ------------------------------------------------------------------ */
const PALETTE_FAMILIES = new Set([
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
]);

function buildPaletteFromTheme(themeVars) {
  const hexByVar = {};
  const primitiveColor = {};

  for (const [name, raw] of Object.entries(themeVars)) {
    if (!name.startsWith("--color-")) continue;
    const key = name.toLowerCase();
    if (name === "--color-black") {
      hexByVar[key] = "#000000";
      continue;
    }
    if (name === "--color-white") {
      hexByVar[key] = "#ffffff";
      continue;
    }
    const rest = name.slice("--color-".length).toLowerCase();
    const parts = rest.split("-");
    const shade = parts[parts.length - 1];
    const family = parts.slice(0, -1).join("-");
    if (!/^\d+$/.test(shade)) continue;
    if (!PALETTE_FAMILIES.has(family)) continue;

    const hex = colorValueToHex(raw, hexByVar);
    if (!hex) continue;
    hexByVar[key] = hex;
    if (!primitiveColor[family]) primitiveColor[family] = {};
    primitiveColor[family][shade] = hex;
  }

  hexByVar["--color-white"] = "#ffffff";
  hexByVar["--color-black"] = "#000000";

  return { hexByVar, primitiveColor };
}

/** ------------------------------------------------------------------ */
/** Evaluation */
/** ------------------------------------------------------------------ */
function remToPxNum(v) {
  const m = String(v).match(/^([\d.]+)rem$/i);
  if (m) return Math.round(parseFloat(m[1]) * 16);
  const px = String(v).match(/^([\d.]+)px$/i);
  if (px) return Math.round(parseFloat(px[1]));
  return null;
}

function spacingCalcToPx(v) {
  const s = String(v).trim();
  const m = s.match(/^calc\(var\(--spacing\)\s*\*\s*([\d.]+)\)$/i);
  if (m) return Math.round(parseFloat(m[1]) * SPACING_PX);
  return null;
}

/** Tailwind v4 --spacing(N) → same as calc(var(--spacing) * N) */
function spacingFunctionToPx(v) {
  const m = String(v).trim().match(/^--spacing\(\s*(\d+)\s*\)$/i);
  if (!m) return null;
  const k = m[1];
  if (!SPACING_PRIMITIVE_KEYS.has(k)) return null;
  return parseInt(k, 10) * SPACING_PX;
}

/** Resolve legacy theme('spacing.N') / theme('radius.*') / theme('fontSize.*') / theme('fontWeight.*') using merged ctx (prefer --spacing(N) + var(--text-*) in CSS). */
function evalThemeNumeric(s, ctx) {
  const t = String(s).trim();
  const sp =
    t.match(/^theme\(\s*['"]spacing\.(\d+)['"]\s*\)$/i) ||
    t.match(/^theme\(\s*spacing\.(\d+)\s*\)$/i);
  if (sp) {
    const k = sp[1];
    if (!SPACING_PRIMITIVE_KEYS.has(k)) return null;
    return parseInt(k, 10) * SPACING_PX;
  }
  const rad =
    t.match(/^theme\(\s*['"]radius\.([a-z0-9]+)['"]\s*\)$/i) ||
    t.match(/^theme\(\s*radius\.([a-z0-9]+)\s*\)$/i);
  if (rad) {
    const k = rad[1].toLowerCase();
    if (k === "none") return 0;
    if (k === "full") return 9999;
    const vn = `--radius-${k}`;
    const raw = ctx[vn];
    if (raw === undefined) return null;
    return remToPxNum(String(raw).trim());
  }
  const fs =
    t.match(/^theme\(\s*['"]fontSize\.([a-z0-9]+)['"]\s*\)$/i) ||
    t.match(/^theme\(\s*fontSize\.([a-z0-9]+)\s*\)$/i);
  if (fs) {
    const k = fs[1].toLowerCase();
    const vn = `--text-${k}`;
    const raw = ctx[vn];
    if (raw === undefined) return null;
    const first = String(raw).trim().split(/\s+/)[0];
    return remToPxNum(first);
  }
  const fw =
    t.match(/^theme\(\s*['"]fontWeight\.([a-z]+)['"]\s*\)$/i) ||
    t.match(/^theme\(\s*fontWeight\.([a-z]+)\s*\)$/i);
  if (fw) {
    const k = fw[1].toLowerCase();
    const vn = `--font-weight-${k}`;
    const raw = ctx[vn];
    if (raw === undefined) return null;
    const n = parseFloat(String(raw).trim());
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function evalCalcNumeric(expr, ctx, depth = 0) {
  if (depth > 16) return null;
  let e = String(expr)
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\u2212/g, "-");

  const spacingPx = spacingCalcToPx(e);
  if (spacingPx !== null) return spacingPx;

  const spacingFnPx = spacingFunctionToPx(e);
  if (spacingFnPx !== null) return spacingFnPx;

  const themeN = evalThemeNumeric(e, ctx);
  if (themeN !== null) return themeN;

  const remPx = remToPxNum(e);
  if (remPx !== null) return remPx;

  const pxLit = e.match(/^(-?[\d.]+)px$/i);
  if (pxLit) return Math.round(parseFloat(pxLit[1]));

  const numLit = e.match(/^(-?[\d.]+)$/);
  if (numLit) return parseFloat(numLit[1]);

  // calc(var(--radius-md|sm|…) ± Npx) — stepped scale in tokens.css
  const radiusStepCalc = e.match(
    /^calc\(\s*var\(\s*--(radius-[a-z0-9-]+)\s*\)\s*([+-])\s*([\d.]+)\s*px\s*\)$/i
  );
  if (radiusStepCalc) {
    const base = resolveNumericFromCtx(`--${radiusStepCalc[1]}`, ctx, depth + 1);
    if (base === null) return null;
    const delta = parseFloat(radiusStepCalc[3]);
    const raw =
      radiusStepCalc[2] === "+"
        ? Math.round(base + delta)
        : Math.round(base - delta);
    return Math.max(0, raw);
  }

  const varOnly = e.match(/^var\(--([a-zA-Z0-9-]+)\)$/);
  if (varOnly) {
    return resolveNumericFromCtx(`--${varOnly[1]}`, ctx, depth + 1);
  }

  return null;
}

function resolveNumericFromCtx(name, ctx, depth = 0) {
  if (depth > 24) return null;
  const v = ctx[name];
  if (v === undefined) return null;
  const s = String(v).trim();
  const themeDirect = evalThemeNumeric(s, ctx);
  if (themeDirect !== null) return themeDirect;
  const direct = evalCalcNumeric(s, ctx, depth);
  if (direct !== null) return direct;
  const varM = s.match(/^var\(--([a-zA-Z0-9-]+)\)$/);
  if (varM) return resolveNumericFromCtx(`--${varM[1]}`, ctx, depth + 1);
  return null;
}

/**
 * If a numeric semantic var chains to --spacing-scale-N or calc(var(--spacing)*N),
 * return the step string so we can emit {primitive/spacing/N} in Figma export.
 */
function resolveSpacingPrimitiveRef(expr, ctx, seen, depth = 0) {
  if (depth > 48) return null;
  const s = String(expr).trim().replace(/\u2212/g, "-");

  const calcM = s.match(/^calc\(var\(--spacing\)\s*\*\s*([\d.]+)\)$/i);
  if (calcM) {
    const k = normalizeSpacingStep(calcM[1]);
    return k !== null && SPACING_PRIMITIVE_KEYS.has(k) ? k : null;
  }

  const themeSp =
    s.match(/^theme\(\s*['"]spacing\.(\d+)['"]\s*\)$/i) ||
    s.match(/^theme\(\s*spacing\.(\d+)\s*\)$/i);
  if (themeSp) {
    const k = themeSp[1];
    return SPACING_PRIMITIVE_KEYS.has(k) ? k : null;
  }

  const spacingFn = s.match(/^--spacing\(\s*(\d+)\s*\)$/i);
  if (spacingFn) {
    const k = spacingFn[1];
    return SPACING_PRIMITIVE_KEYS.has(k) ? k : null;
  }

  const scaleM = s.match(/^var\(--spacing-scale-([\d.]+)\)$/i);
  if (scaleM) {
    const k = normalizeSpacingStep(scaleM[1]);
    return k !== null && SPACING_PRIMITIVE_KEYS.has(k) ? k : null;
  }

  const varM = s.match(/^var\(--([a-zA-Z0-9-]+)\)$/i);
  if (varM) {
    const name = `--${varM[1]}`.toLowerCase();
    if (seen.has(name)) return null;
    seen.add(name);
    const next = ctx[name];
    if (next === undefined) {
      seen.delete(name);
      return null;
    }
    const out = resolveSpacingPrimitiveRef(next, ctx, seen, depth + 1);
    seen.delete(name);
    return out;
  }

  return null;
}

function normalizeSpacingStep(s) {
  const n = parseFloat(String(s), 10);
  if (!Number.isFinite(n)) return null;
  if (!Number.isInteger(n)) return null;
  return String(n);
}

function resolveSpacingPrimitiveFromCtx(cssVar, ctx) {
  const raw = ctx[cssVar];
  if (raw === undefined) return null;
  return resolveSpacingPrimitiveRef(raw, ctx, new Set(), 0);
}

function resolveRadiusPrimitiveRef(expr, ctx, seen, depth = 0) {
  if (depth > 48) return null;
  const s = String(expr).trim().replace(/\u2212/g, "-");

  const themeR =
    s.match(/^theme\(\s*['"]radius\.([a-z0-9]+)['"]\s*\)$/i) ||
    s.match(/^theme\(\s*radius\.([a-z0-9]+)\s*\)$/i);
  if (themeR) {
    const k = themeR[1].toLowerCase();
    return RADIUS_PRIMITIVE_KEYS.has(k) ? k : null;
  }

  const varM = s.match(/^var\(--([a-zA-Z0-9-]+)\)$/i);
  if (varM) {
    const name = `--${varM[1]}`.toLowerCase();
    if (seen.has(name)) return null;
    seen.add(name);
    const next = ctx[name];
    if (next === undefined) {
      seen.delete(name);
      return null;
    }
    const out = resolveRadiusPrimitiveRef(next, ctx, seen, depth + 1);
    seen.delete(name);
    return out;
  }

  return null;
}

function resolveRadiusPrimitiveFromCtx(cssVar, ctx) {
  const raw = ctx[cssVar];
  if (raw === undefined) return null;
  return resolveRadiusPrimitiveRef(raw, ctx, new Set(), 0);
}

/**
 * Resolve a CSS var to either:
 *   { kind: 'palette', path: 'primitive.color.neutral.950' }
 *   { kind: 'hex', hex: '#...' } | { kind: 'raw', value: 'rgba(...)' }
 *   { kind: 'number', value: n }
 */
function resolveTokenValue(name, ctx, paletteHexByVar, depth = 0) {
  if (depth > 32) return { kind: "unresolved", name };
  const raw = ctx[name];
  if (raw === undefined) return { kind: "unresolved", name };

  const s = String(raw).trim();

  // Direct palette var
  const pal = s.match(/^var\(--(color-[a-z0-9-]+)\)$/i);
  if (pal) {
    const vn = `--${pal[1].toLowerCase()}`;
    if (vn === "--color-white")
      return { kind: "palette", path: "primitive.color.white" };
    if (vn === "--color-black")
      return { kind: "palette", path: "primitive.color.black" };
    const blackAlphaM = vn.match(/^--color-black-(\d+)$/);
    if (blackAlphaM) {
      return {
        kind: "palette",
        path: `primitive.color.black-alpha.${blackAlphaM[1]}`,
      };
    }
    const whiteAlphaM = vn.match(/^--color-white-(\d+)$/);
    if (whiteAlphaM) {
      return {
        kind: "palette",
        path: `primitive.color.white-alpha.${whiteAlphaM[1]}`,
      };
    }
    const rest = vn.slice("--color-".length);
    const parts = rest.split("-");
    const shade = parts[parts.length - 1];
    const family = parts.slice(0, -1).join("-");
    if (/^\d+$/.test(shade) && PALETTE_FAMILIES.has(family)) {
      return {
        kind: "palette",
        path: `primitive.color.${family}.${shade}`,
      };
    }
    const hx = paletteHexByVar[vn];
    if (hx) return { kind: "hex", hex: hx };
  }

  if (/^rgba?\(/i.test(s)) return { kind: "raw", value: s.replace(/\s+/g, "") };

  const hxDirect = colorValueToHex(s, paletteHexByVar);
  if (hxDirect && !s.startsWith("var(")) return { kind: "hex", hex: hxDirect };

  const num = evalCalcNumeric(s, ctx, 0);
  if (num !== null && !/^var\(/i.test(s)) return { kind: "number", value: num };

  const varM = s.match(/^var\(--([a-zA-Z0-9-]+)\)$/);
  if (varM) {
    const next = `--${varM[1]}`;
    return resolveTokenValue(next, ctx, paletteHexByVar, depth + 1);
  }

  return { kind: "unresolved", name, raw: s };
}

function palettePathToAlias(path) {
  const p = path.replace(/^primitive\.color\./, "");
  const parts = p.split(".");
  return `{primitive.color.${parts.join(".")}}`;
}

/** ------------------------------------------------------------------ */
/** Semantic CSS var → output path + type + scopes */
/** ------------------------------------------------------------------ */
const SEMANTIC_MAP = {
  "--background": {
    path: ["surface", "default"],
    type: "color",
    scopes: ["FRAME_FILL", "SHAPE_FILL"],
  },
  "--card": {
    path: ["surface", "raised"],
    type: "color",
    scopes: ["FRAME_FILL", "SHAPE_FILL"],
  },
  "--popover": {
    path: ["surface", "overlay"],
    type: "color",
    scopes: ["FRAME_FILL", "SHAPE_FILL"],
  },
  "--foreground": {
    path: ["text", "primary"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--card-foreground": {
    path: ["text", "on-raised"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--popover-foreground": {
    path: ["text", "on-overlay"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--muted": {
    path: ["surface", "subtle"],
    type: "color",
    scopes: ["FRAME_FILL", "SHAPE_FILL"],
  },
  "--muted-foreground": {
    path: ["text", "muted"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--accent": {
    path: ["surface", "accent"],
    type: "color",
    scopes: ["FRAME_FILL", "SHAPE_FILL"],
  },
  "--accent-foreground": {
    path: ["text", "on-accent"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--primary": {
    path: ["brand", "primary"],
    type: "color",
    scopes: ["ALL_FILLS"],
  },
  "--primary-foreground": {
    path: ["brand", "primary-fg"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--secondary": {
    path: ["brand", "secondary"],
    type: "color",
    scopes: ["ALL_FILLS"],
  },
  "--secondary-foreground": {
    path: ["brand", "secondary-fg"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--secondary-hover": {
    path: ["brand", "secondary-hover"],
    type: "color",
    scopes: ["ALL_FILLS"],
  },
  "--destructive": {
    path: ["state", "danger"],
    type: "color",
    scopes: ["ALL_FILLS"],
  },
  "--destructive-foreground": {
    path: ["state", "danger-fg"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--success": {
    path: ["state", "success"],
    type: "color",
    scopes: ["ALL_FILLS"],
  },
  "--success-foreground": {
    path: ["state", "success-fg"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--warning": {
    path: ["state", "warning"],
    type: "color",
    scopes: ["ALL_FILLS"],
  },
  "--warning-foreground": {
    path: ["state", "warning-fg"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--info": {
    path: ["state", "info"],
    type: "color",
    scopes: ["ALL_FILLS"],
  },
  "--info-foreground": {
    path: ["state", "info-fg"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--border": {
    path: ["border", "default"],
    type: "color",
    scopes: ["STROKE_COLOR"],
  },
  "--input": {
    path: ["border", "input"],
    type: "color",
    scopes: ["STROKE_COLOR"],
  },
  "--ring": {
    path: ["border", "focus"],
    type: "color",
    scopes: ["STROKE_COLOR"],
  },
  "--link": {
    path: ["text", "link"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--link-foreground": {
    path: ["text", "link-fg"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--press": {
    path: ["state", "press"],
    type: "color",
    scopes: ["ALL_FILLS"],
  },
  "--press-foreground": {
    path: ["state", "press-fg"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--selection": {
    path: ["state", "selection"],
    type: "color",
    scopes: ["ALL_FILLS"],
  },
  "--selection-foreground": {
    path: ["state", "selection-fg"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--sidebar": {
    path: ["surface", "sidebar"],
    type: "color",
    scopes: ["FRAME_FILL", "SHAPE_FILL"],
  },
  "--sidebar-foreground": {
    path: ["text", "on-sidebar"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--chart-1": {
    path: ["chart", "1"],
    type: "color",
    scopes: ["ALL_FILLS"],
  },
  "--chart-2": {
    path: ["chart", "2"],
    type: "color",
    scopes: ["ALL_FILLS"],
  },
  "--chart-3": {
    path: ["chart", "3"],
    type: "color",
    scopes: ["ALL_FILLS"],
  },
  "--chart-4": {
    path: ["chart", "4"],
    type: "color",
    scopes: ["ALL_FILLS"],
  },
  "--chart-5": {
    path: ["chart", "5"],
    type: "color",
    scopes: ["ALL_FILLS"],
  },
  "--data-primary": {
    path: ["dataSyntax", "primary"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--data-secondary": {
    path: ["dataSyntax", "secondary"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--data-currency": {
    path: ["dataSyntax", "currency"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--data-entity": {
    path: ["dataSyntax", "entity"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--data-identifier": {
    path: ["dataSyntax", "identifier"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--data-category": {
    path: ["dataSyntax", "category"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--data-datetime": {
    path: ["dataSyntax", "datetime"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--data-status-positive": {
    path: ["dataSyntax", "status", "positive"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--data-status-negative": {
    path: ["dataSyntax", "status", "negative"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--data-status-warning": {
    path: ["dataSyntax", "status", "warning"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--data-status-neutral": {
    path: ["dataSyntax", "status", "neutral"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--data-value-positive": {
    path: ["dataSyntax", "value", "positive"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--data-value-negative": {
    path: ["dataSyntax", "value", "negative"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--data-value-neutral": {
    path: ["dataSyntax", "value", "neutral"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--radius-md": {
    path: ["sizing", "radius-md"],
    type: "number",
    scopes: ["CORNER_RADIUS"],
  },
  "--radius-container": {
    path: ["sizing", "radius-container"],
    type: "number",
    scopes: ["CORNER_RADIUS"],
  },
  "--radius-control": {
    path: ["sizing", "radius-control"],
    type: "number",
    scopes: ["CORNER_RADIUS"],
  },
  "--radius-inset": {
    path: ["sizing", "radius-inset"],
    type: "number",
    scopes: ["CORNER_RADIUS"],
  },
  "--radius-pill": {
    path: ["sizing", "radius-pill"],
    type: "number",
    scopes: ["CORNER_RADIUS"],
  },
  "--control-height-sm": {
    path: ["sizing", "control-height-sm"],
    type: "number",
    scopes: ["WIDTH_HEIGHT"],
  },
  "--control-height-md": {
    path: ["sizing", "control-height-md"],
    type: "number",
    scopes: ["WIDTH_HEIGHT"],
  },
  "--control-height-lg": {
    path: ["sizing", "control-height-lg"],
    type: "number",
    scopes: ["WIDTH_HEIGHT"],
  },
  "--control-px-sm": {
    path: ["sizing", "control-px-sm"],
    type: "number",
    scopes: ["GAP"],
  },
  "--control-px-md": {
    path: ["sizing", "control-px-md"],
    type: "number",
    scopes: ["GAP"],
  },
  "--control-px-lg": {
    path: ["sizing", "control-px-lg"],
    type: "number",
    scopes: ["GAP"],
  },
  "--control-gap-x": {
    path: ["sizing", "control-gap-x"],
    type: "number",
    scopes: ["GAP"],
  },
  "--control-gap-y": {
    path: ["sizing", "control-gap-y"],
    type: "number",
    scopes: ["GAP"],
  },
  "--card-padding": {
    path: ["sizing", "card-padding"],
    type: "number",
    scopes: ["GAP"],
  },
  "--content-padding": {
    path: ["sizing", "content-padding"],
    type: "number",
    scopes: ["GAP"],
  },
  "--menu-padding": {
    path: ["sizing", "menu-padding"],
    type: "number",
    scopes: ["GAP"],
  },
  "--menu-item-px": {
    path: ["sizing", "menu-item-px"],
    type: "number",
    scopes: ["GAP"],
  },
  "--menu-item-py": {
    path: ["sizing", "menu-item-py"],
    type: "number",
    scopes: ["GAP"],
  },
  "--icon-size": {
    path: ["sizing", "icon-size"],
    type: "number",
    scopes: ["WIDTH_HEIGHT"],
  },
  "--disabled-opacity": {
    path: ["sizing", "disabled-opacity"],
    type: "number",
    scopes: ["OPACITY"],
  },
  "--badge-height": {
    path: ["sizing", "badge-height"],
    type: "number",
    scopes: ["WIDTH_HEIGHT"],
  },
  "--badge-px": {
    path: ["sizing", "badge-px"],
    type: "number",
    scopes: ["GAP"],
  },
  "--avatar-size-sm": {
    path: ["sizing", "avatar-sm"],
    type: "number",
    scopes: ["WIDTH_HEIGHT"],
  },
  "--avatar-size-md": {
    path: ["sizing", "avatar-md"],
    type: "number",
    scopes: ["WIDTH_HEIGHT"],
  },
  "--avatar-size-lg": {
    path: ["sizing", "avatar-lg"],
    type: "number",
    scopes: ["WIDTH_HEIGHT"],
  },
  "--sidebar-width": {
    path: ["sizing", "sidebar-width"],
    type: "number",
    scopes: ["WIDTH_HEIGHT"],
  },
  "--data-table-row-height-sm": {
    path: ["components", "data-table", "row-height-sm"],
    type: "number",
    scopes: ["WIDTH_HEIGHT"],
  },
  "--data-table-row-height-md": {
    path: ["components", "data-table", "row-height-md"],
    type: "number",
    scopes: ["WIDTH_HEIGHT"],
  },
  "--data-table-row-height-lg": {
    path: ["components", "data-table", "row-height-lg"],
    type: "number",
    scopes: ["WIDTH_HEIGHT"],
  },
  "--data-table-header-height": {
    path: ["components", "data-table", "header-height"],
    type: "number",
    scopes: ["WIDTH_HEIGHT"],
  },
  "--data-table-cell-px": {
    path: ["components", "data-table", "cell-px"],
    type: "number",
    scopes: ["GAP"],
  },
  "--data-table-cell-py": {
    path: ["components", "data-table", "cell-py"],
    type: "number",
    scopes: ["GAP"],
  },
  "--data-table-row-divider-width": {
    path: ["components", "data-table", "row-divider-width"],
    type: "number",
    scopes: ["WIDTH_HEIGHT"],
  },
  "--data-table-font-size": {
    path: ["components", "data-table", "font-size"],
    type: "number",
    scopes: ["FONT_SIZE"],
  },
  "--data-table-header-font-size": {
    path: ["components", "data-table", "header-font-size"],
    type: "number",
    scopes: ["FONT_SIZE"],
  },
  "--data-table-font-weight": {
    path: ["components", "data-table", "font-weight"],
    type: "number",
    scopes: ["FONT_WEIGHT"],
  },
  "--data-table-header-font-weight": {
    path: ["components", "data-table", "header-font-weight"],
    type: "number",
    scopes: ["FONT_WEIGHT"],
  },
  "--data-table-header-bg": {
    path: ["components", "data-table", "header-bg"],
    type: "color",
    scopes: ["FRAME_FILL", "SHAPE_FILL"],
  },
  "--data-table-header-fg": {
    path: ["components", "data-table", "header-fg"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--data-table-row-bg-hover": {
    path: ["components", "data-table", "row-bg-hover"],
    type: "color",
    scopes: ["FRAME_FILL", "SHAPE_FILL"],
  },
  "--data-table-row-fg-selected": {
    path: ["components", "data-table", "row-fg-selected"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--table-row-bg-selected": {
    path: ["components", "data-table", "row-bg-selected"],
    type: "color",
    scopes: ["FRAME_FILL", "SHAPE_FILL"],
  },
  "--table-row-fg-selected": {
    path: ["components", "data-table", "row-fg-selected"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
  "--dialog-overlay-bg": {
    path: ["overlays", "dialog"],
    type: "color",
    scopes: ["ALL_FILLS"],
  },
  "--drawer-overlay-bg": {
    path: ["overlays", "drawer"],
    type: "color",
    scopes: ["ALL_FILLS"],
  },
  "--alert-dialog-overlay-bg": {
    path: ["overlays", "alert-dialog"],
    type: "color",
    scopes: ["ALL_FILLS"],
  },
  "--sheet-overlay-bg": {
    path: ["overlays", "sheet"],
    type: "color",
    scopes: ["ALL_FILLS"],
  },
  "--slider-thumb-bg": {
    path: ["components", "slider", "thumb-bg"],
    type: "color",
    scopes: ["ALL_FILLS"],
  },
  "--table-checkbox-in-selected-bg": {
    path: ["components", "data-table", "checkbox-in-selected-bg"],
    type: "color",
    scopes: ["ALL_FILLS"],
  },
  "--table-checkbox-in-selected-fg": {
    path: ["components", "data-table", "checkbox-in-selected-fg"],
    type: "color",
    scopes: ["TEXT_FILL"],
  },
};

function setDeep(root, parts, leaf) {
  let cur = root;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const isLast = i === parts.length - 1;
    if (isLast) {
      cur[p] = leaf;
    } else {
      const next = cur[p];
      if (!next || typeof next !== "object" || next.$type) {
        cur[p] = {};
      }
      cur = cur[p];
    }
  }
}

function mergeResolvedColor(lightRes, darkRes) {
  const toVal = (r) => {
    if (r.kind === "palette") return palettePathToAlias(r.path);
    if (r.kind === "hex") return normalizeColorForFigma(r.hex);
    if (r.kind === "raw") return normalizeColorForFigma(r.value);
    return null;
  };
  const L = toVal(lightRes);
  const D = toVal(darkRes);
  return { light: L, dark: D };
}

/** Nested tree → flat map (slash-separated paths) with $type, $value, $extensions. */
function flattenTokens(obj, prefix = "", result = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}/${key}` : key;
    if (value && typeof value === "object" && value.$type !== undefined) {
      result[path] = value;
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      flattenTokens(value, path, result);
    }
  }
  return result;
}

function buildVariablesFromFlat(flatTokens) {
  const variables = {};
  for (const [pathKey, token] of Object.entries(flatTokens)) {
    if (!token || typeof token !== "object" || token.$type === undefined) {
      continue;
    }
    if (!token.$value || typeof token.$value !== "object") {
      continue;
    }
    variables[pathKey] = {
      $type: token.$type,
      valuesByMode: { ...token.$value },
    };
  }
  return variables;
}

function isReferenceString(val) {
  return (
    typeof val === "string" &&
    val.length >= 2 &&
    val.startsWith("{") &&
    val.endsWith("}")
  );
}

/** Resolve `{path}` aliases to literals by walking referenced variables (same mode). */
function resolveOneValue(val, mode, variables, visiting, depth = 0) {
  if (depth > 96) return null;
  if (typeof val === "number") return val;
  if (typeof val === "boolean") return val;
  if (typeof val !== "string") return val;
  if (!isReferenceString(val)) return val;
  const refPath = val.slice(1, -1);
  if (!variables[refPath]) return val;
  if (visiting.has(refPath)) return null;
  visiting.add(refPath);
  const inner = variables[refPath].valuesByMode[mode];
  visiting.delete(refPath);
  if (inner === undefined) return val;
  return resolveOneValue(inner, mode, variables, visiting, depth + 1);
}

function coerceValueForType(type, val) {
  if (val === null || val === undefined) {
    if (type === "color") return "#000000";
    if (type === "number" || type === "float") return 0;
    return "";
  }
  if (type === "color") {
    if (typeof val === "string" && isReferenceString(val)) {
      return "#000000";
    }
    if (typeof val === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(val)) {
      return val.toLowerCase();
    }
    return typeof val === "string" ? val : String(val);
  }
  if (type === "number" || type === "float") {
    if (typeof val === "number" && !Number.isNaN(val)) return val;
    const n = Number(val);
    return Number.isFinite(n) ? n : 0;
  }
  if (type === "string") {
    return typeof val === "string" ? val : String(val);
  }
  return val;
}

function resolveReferencesInVariables(variables) {
  const out = {};
  const modes = [M.L, M.D];
  for (const [vk, v] of Object.entries(variables)) {
    const t = v.$type;
    const vbm = {};
    for (const mode of modes) {
      let val = v.valuesByMode[mode];
      val = resolveOneValue(val, mode, variables, new Set());
      vbm[mode] = coerceValueForType(t, val);
    }
    out[vk] = { $type: t, valuesByMode: vbm };
  }
  return out;
}

/** DTCG color object for Figma (sRGB components 0–1). */
function hexToFigmaColor(hex) {
  const raw = String(hex).trim().replace(/^#/, "").toLowerCase();
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 1;
  if (raw.length === 3) {
    r = parseInt(raw[0] + raw[0], 16) / 255;
    g = parseInt(raw[1] + raw[1], 16) / 255;
    b = parseInt(raw[2] + raw[2], 16) / 255;
  } else if (raw.length === 6) {
    r = parseInt(raw.slice(0, 2), 16) / 255;
    g = parseInt(raw.slice(2, 4), 16) / 255;
    b = parseInt(raw.slice(4, 6), 16) / 255;
  } else if (raw.length === 8) {
    r = parseInt(raw.slice(0, 2), 16) / 255;
    g = parseInt(raw.slice(2, 4), 16) / 255;
    b = parseInt(raw.slice(4, 6), 16) / 255;
    a = parseInt(raw.slice(6, 8), 16) / 255;
  }
  const hex6 =
    "#" +
    [r, g, b]
      .map((c) =>
        Math.min(255, Math.max(0, Math.round(c * 255)))
          .toString(16)
          .padStart(2, "0")
      )
      .join("");
  const round4 = (x) => Math.round(x * 10000) / 10000;
  return {
    colorSpace: "srgb",
    components: [round4(r), round4(g), round4(b)],
    alpha: round4(a),
    hex: hex6,
  };
}

function formatTokenValueForExport(type, val) {
  if (type === "color") {
    const s = typeof val === "string" ? val : "#000000";
    return hexToFigmaColor(s);
  }
  if (type === "number" || type === "float") {
    if (typeof val === "number" && Number.isFinite(val)) return val;
    const n = Number(val);
    return Number.isFinite(n) ? n : 0;
  }
  if (type === "string") {
    return typeof val === "string" ? val : String(val);
  }
  return val;
}

/** Flat slash paths → nested groups; each leaf is { $type, $value }. */
function setNestedToken(root, segments, leaf) {
  let cur = root;
  for (let i = 0; i < segments.length - 1; i++) {
    const s = segments[i];
    const next = cur[s];
    if (next !== undefined && next !== null && typeof next === "object" && next.$type !== undefined) {
      throw new Error(
        `Token path conflict with existing token at "${segments.slice(0, i + 1).join("/")}"`
      );
    }
    if (!cur[s] || typeof cur[s] !== "object" || cur[s].$type !== undefined) {
      cur[s] = {};
    }
    cur = cur[s];
  }
  const last = segments[segments.length - 1];
  cur[last] = leaf;
}

/**
 * Nested output per mode. Primitives → resolved literals (colors as sRGB objects).
 * Semantic colors that reference primitives keep DTCG alias strings `{primitive/...}`.
 */
function flatToNestedTreeForMode(flat, resolvedVariables, modeName) {
  const root = {};
  for (const [pathKey, v] of Object.entries(resolvedVariables)) {
    const t = v.$type;
    const resolvedVal = v.valuesByMode[modeName];
    if (resolvedVal === undefined) continue;

    let single;
    if (pathKey.startsWith("semantic/")) {
      const rawTok = flat[pathKey];
      const rawPerMode =
        rawTok &&
        rawTok.$value &&
        typeof rawTok.$value === "object"
          ? rawTok.$value[modeName]
          : undefined;
      const keepAlias =
        (t === "color" || t === "number") &&
        typeof rawPerMode === "string" &&
        isReferenceString(rawPerMode);
      if (keepAlias) {
        single = rawPerMode;
      } else {
        single = formatTokenValueForExport(t, resolvedVal);
      }
    } else {
      single = formatTokenValueForExport(t, resolvedVal);
    }

    if (single === undefined) continue;
    const leaf = { $type: t, $value: single };
    const segments = pathKey.split("/").filter(Boolean);
    if (segments.length === 0) continue;
    setNestedToken(root, segments, leaf);
  }
  return root;
}

function countColorSwatches(colorRoot) {
  let n = 0;
  for (const node of Object.values(colorRoot)) {
    if (node && typeof node === "object" && node.$type === "color") {
      n += 1;
    } else if (node && typeof node === "object") {
      n += Object.keys(node).length;
    }
  }
  return n;
}

/** Black/white transparency scales from :root → primitives + hexByVar for overlay resolution. */
function applyAlphaPrimitivesFromRoot(primitive, hexByVar, rootVars) {
  const blackAlpha = {};
  const whiteAlpha = {};
  for (const [k, raw] of Object.entries(rootVars)) {
    const m = k.match(/^--color-(black|white)-(\d+)$/i);
    if (!m) continue;
    const hx = normalizeColorForFigma(String(raw).trim());
    if (typeof hx !== "string" || !hx.startsWith("#")) continue;
    hexByVar[k.toLowerCase()] = hx;
    const step = m[2];
    const token = {
      $type: "color",
      $value: modePair(hx, hx),
      $extensions: { "com.figma.scopes": figmaScopes(["ALL_FILLS"]) },
    };
    if (m[1].toLowerCase() === "black") blackAlpha[step] = token;
    else whiteAlpha[step] = token;
  }
  primitive.color["black-alpha"] = blackAlpha;
  primitive.color["white-alpha"] = whiteAlpha;
}

function buildPrimitives(themeVars) {
  const { hexByVar, primitiveColor } = buildPaletteFromTheme(themeVars);

  const spacing = {};
  for (const k of SPACING_SCALE_STEPS) {
    spacing[String(k)] = {
      $type: "number",
      $value: modePair(k * SPACING_PX, k * SPACING_PX),
      $extensions: { "com.figma.scopes": figmaScopes(["GAP"]) },
    };
  }

  const primRadius = {
    none: 0,
    sm: resolveNumericFromCtx("--radius-sm", themeVars) ?? 4,
    md: resolveNumericFromCtx("--radius-md", themeVars) ?? 6,
    lg: resolveNumericFromCtx("--radius-lg", themeVars) ?? 8,
    xl: resolveNumericFromCtx("--radius-xl", themeVars) ?? 12,
    "2xl": resolveNumericFromCtx("--radius-2xl", themeVars) ?? 16,
    "3xl": resolveNumericFromCtx("--radius-3xl", themeVars) ?? 24,
    full: resolveNumericFromCtx("--radius-full", themeVars) ?? 9999,
  };
  for (const k of Object.keys(primRadius)) {
    if (k === "none") continue;
    const v = primRadius[k];
    if (typeof v === "number" && Number.isFinite(v)) {
      primRadius[k] = Math.round(v);
    }
  }
  const primitiveRadius = {};
  for (const [k, v] of Object.entries(primRadius)) {
    primitiveRadius[k] = {
      $type: "number",
      $value: modePair(v, v),
      $extensions: { "com.figma.scopes": figmaScopes(["CORNER_RADIUS"]) },
    };
  }

  /* Omit font family string primitives — Figma’s JSON importer often rejects string tokens here. */
  const primitiveFont = {
    size: {
      xs: numPrim(12, "FONT_SIZE"),
      sm: numPrim(14, "FONT_SIZE"),
      md: numPrim(16, "FONT_SIZE"),
      lg: numPrim(18, "FONT_SIZE"),
      xl: numPrim(20, "FONT_SIZE"),
      "2xl": numPrim(24, "FONT_SIZE"),
      "3xl": numPrim(30, "FONT_SIZE"),
      "4xl": numPrim(36, "FONT_SIZE"),
    },
    weight: {
      regular: numPrim(400, "FONT_WEIGHT"),
      medium: numPrim(500, "FONT_WEIGHT"),
      semibold: numPrim(600, "FONT_WEIGHT"),
      bold: numPrim(700, "FONT_WEIGHT"),
    },
    lineHeight: {
      tight: numPrim(1.25, "LINE_HEIGHT"),
      normal: numPrim(1.5, "LINE_HEIGHT"),
      relaxed: numPrim(1.75, "LINE_HEIGHT"),
    },
    letterSpacing: {
      tight: numPrim(-2, "LETTER_SPACING"),
      wide: numPrim(2, "LETTER_SPACING"),
    },
  };

  const primitive = {
    color: {},
    spacing,
    radius: primitiveRadius,
    font: primitiveFont,
  };

  const whiteHex = normalizeColorForFigma("#ffffff");
  const blackHex = normalizeColorForFigma("#000000");
  primitive.color.white = {
    $type: "color",
    $value: modePair(whiteHex, whiteHex),
    $extensions: { "com.figma.scopes": figmaScopes(["ALL_FILLS"]) },
  };
  primitive.color.black = {
    $type: "color",
    $value: modePair(blackHex, blackHex),
    $extensions: { "com.figma.scopes": figmaScopes(["ALL_FILLS"]) },
  };

  for (const [family, shades] of Object.entries(primitiveColor)) {
    primitive.color[family] = {};
    for (const [shade, hex] of Object.entries(shades)) {
      const key = shade === "default" ? "default" : shade;
      primitive.color[family][key] = {
        $type: "color",
        $value: modePair(normalizeColorForFigma(hex), normalizeColorForFigma(hex)),
        $extensions: { "com.figma.scopes": figmaScopes(["ALL_FILLS"]) },
      };
    }
  }

  return { primitive, hexByVar };
}

function numPrim(n, scope) {
  return {
    $type: "number",
    $value: modePair(n, n),
    $extensions: { "com.figma.scopes": figmaScopes([scope]) },
  };
}

function main() {
  const warnings = [];

  if (!fs.existsSync(THEME_CSS)) {
    console.error("Missing", THEME_CSS);
    process.exit(1);
  }
  if (!fs.existsSync(TOKENS_CSS)) {
    console.error("Missing", TOKENS_CSS);
    process.exit(1);
  }

  const themeCss = fs.readFileSync(THEME_CSS, "utf8");
  const tokensCss = fs.readFileSync(TOKENS_CSS, "utf8");

  const themeVars = parseThemeDefaultBlock(themeCss);
  const rootBlock = extractBlock(tokensCss, ":root {");
  const darkBlock = extractBlock(tokensCss, ".dark");
  const lightRoot = extractVars(rootBlock || "");
  const darkRoot = extractVars(darkBlock || "");

  const mergedLightCtx = { ...themeVars, ...lightRoot };
  const mergedDarkCtx = { ...themeVars, ...lightRoot, ...darkRoot };

  const { primitive, hexByVar } = buildPrimitives(mergedLightCtx);
  applyAlphaPrimitivesFromRoot(primitive, hexByVar, lightRoot);

  const semantic = {};
  let semanticCount = 0;
  let darkOverrides = 0;

  for (const [cssVar, meta] of Object.entries(SEMANTIC_MAP)) {
    if (meta.type === "color") {
      const lr = resolveTokenValue(cssVar, mergedLightCtx, hexByVar);
      const dr = resolveTokenValue(cssVar, mergedDarkCtx, hexByVar);
      if (lr.kind === "unresolved" || dr.kind === "unresolved") {
        warnings.push(`Unresolved color: ${cssVar}`);
        continue;
      }
      const { light, dark } = mergeResolvedColor(lr, dr);
      if (light === null || dark === null) {
        warnings.push(`Unresolved color value: ${cssVar}`);
        continue;
      }
      if (light !== dark) darkOverrides++;

      const node = {
        $type: "color",
        $value: modePair(light, dark),
        $extensions: { "com.figma.scopes": figmaScopes(meta.scopes) },
      };
      setDeep(semantic, meta.path, node);
      semanticCount++;
    } else if (meta.type === "number") {
      const stepL = resolveSpacingPrimitiveFromCtx(cssVar, mergedLightCtx);
      const stepD = resolveSpacingPrimitiveFromCtx(cssVar, mergedDarkCtx);
      if (
        stepL !== null &&
        stepD !== null &&
        stepL === stepD &&
        SPACING_PRIMITIVE_KEYS.has(stepL)
      ) {
        const alias = `{primitive/spacing/${stepL}}`;
        const node = {
          $type: "number",
          $value: modePair(alias, alias),
          $extensions: { "com.figma.scopes": figmaScopes(meta.scopes) },
        };
        setDeep(semantic, meta.path, node);
        semanticCount++;
        continue;
      }

      const radL = resolveRadiusPrimitiveFromCtx(cssVar, mergedLightCtx);
      const radD = resolveRadiusPrimitiveFromCtx(cssVar, mergedDarkCtx);
      if (
        radL !== null &&
        radD !== null &&
        radL === radD &&
        RADIUS_PRIMITIVE_KEYS.has(radL)
      ) {
        const alias = `{primitive/radius/${radL}}`;
        const node = {
          $type: "number",
          $value: modePair(alias, alias),
          $extensions: { "com.figma.scopes": figmaScopes(meta.scopes) },
        };
        setDeep(semantic, meta.path, node);
        semanticCount++;
        continue;
      }

      const ln = resolveNumericFromCtx(cssVar, mergedLightCtx);
      const dn = resolveNumericFromCtx(cssVar, mergedDarkCtx);
      if (ln === null || dn === null) {
        warnings.push(`Unresolved number: ${cssVar}`);
        continue;
      }
      if (ln !== dn) darkOverrides++;

      const node = {
        $type: "number",
        $value: modePair(ln, dn),
        $extensions: { "com.figma.scopes": figmaScopes(meta.scopes) },
      };
      setDeep(semantic, meta.path, node);
      semanticCount++;
    }
  }

  // Warn for :root vars not exported
  for (const k of Object.keys(lightRoot)) {
    if (k === "--control-gap") continue; // alias of control-gap-x, skip duplicate
    if (/^--color-black-\d+$/i.test(k) || /^--color-white-\d+$/i.test(k))
      continue;
    if (/^--spacing-scale-\d+$/i.test(k)) continue;
    /* Stepped radius (except md — also a semantic token) → primitive/radius/* only */
    if (/^--radius-(sm|lg|xl|full)$/i.test(k)) continue;
    if (!SEMANTIC_MAP[k]) {
      warnings.push(`No semantic mapping for ${k} (skipped)`);
    }
  }

  const output = { primitive, semantic };

  const flat = flattenTokens(output);

  for (const token of Object.values(flat)) {
    if (token.$value && typeof token.$value === "object") {
      for (const [mode, val] of Object.entries(token.$value)) {
        if (
          typeof val === "string" &&
          val.startsWith("{") &&
          val.endsWith("}")
        ) {
          token.$value[mode] =
            "{" + val.slice(1, -1).replace(/\./g, "/") + "}";
        }
      }
    }
  }

  const rawVars = buildVariablesFromFlat(flat);
  const resolvedVars = resolveReferencesInVariables(rawVars);
  const lightTokens = flatToNestedTreeForMode(flat, resolvedVars, M.L);
  const darkTokens = flatToNestedTreeForMode(flat, resolvedVars, M.D);

  if (!fs.existsSync(TOKENS_DIR)) fs.mkdirSync(TOKENS_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_LIGHT, JSON.stringify(lightTokens, null, 2));
  fs.writeFileSync(OUTPUT_DARK, JSON.stringify(darkTokens, null, 2));

  const colorSwatches = countColorSwatches(primitive.color);

  for (const w of warnings) console.warn("WARN:", w);

  console.log("Signal — Figma native export");
  console.log(
    `  Primitives:  ${colorSwatches} color swatches + spacing + radius + typography`
  );
  console.log(
    `  Semantic:    ${semanticCount} tokens (light mode), ${darkOverrides} values differ in dark mode`
  );
  console.log(`  Output:      tokens/light.json, tokens/dark.json`);
}

main();
