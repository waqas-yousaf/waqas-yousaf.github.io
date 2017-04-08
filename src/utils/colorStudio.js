import {
  extractPaletteFromImageData,
  formatColorValues,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
} from './toolHelpers';

const MAX_CUSTOM_PALETTE = 12;

function clampChannel(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function hslToRgb(h, s, l) {
  const hue = ((h % 360) + 360) % 360;
  const saturation = Math.max(0, Math.min(100, s)) / 100;
  const lightness = Math.max(0, Math.min(100, l)) / 100;

  if (saturation === 0) {
    const gray = clampChannel(lightness * 255);
    return { r: gray, g: gray, b: gray };
  }

  const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
  const p = 2 * lightness - q;

  const hueToChannel = (offset) => {
    let channel = hue / 360 + offset;
    if (channel < 0) channel += 1;
    if (channel > 1) channel -= 1;

    if (channel < 1 / 6) return p + (q - p) * 6 * channel;
    if (channel < 1 / 2) return q;
    if (channel < 2 / 3) return p + (q - p) * (2 / 3 - channel) * 6;
    return p;
  };

  return {
    r: clampChannel(hueToChannel(0) * 255),
    g: clampChannel(hueToChannel(-1 / 3) * 255),
    b: clampChannel(hueToChannel(1 / 3) * 255),
  };
}

function colorFromHex(hex) {
  const { r, g, b } = hexToRgb(hex);
  return formatColorValues(r, g, b);
}

function colorFromHsl(h, s, l) {
  const { r, g, b } = hslToRgb(h, s, l);
  return formatColorValues(r, g, b);
}

function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const channels = [r, g, b].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

export function getContrastRatio(hexA, hexB) {
  const lumA = relativeLuminance(hexA);
  const lumB = relativeLuminance(hexB);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

export function getWcagLevels(ratio) {
  const pass = (threshold) => ratio >= threshold;

  return {
    ratio: Math.round(ratio * 100) / 100,
    normalAA: pass(4.5),
    normalAAA: pass(7),
    largeAA: pass(3),
    largeAAA: pass(4.5),
  };
}

export function getContrastReport(backgroundHex) {
  const white = '#ffffff';
  const black = '#000000';

  return {
    onWhite: getWcagLevels(getContrastRatio(white, backgroundHex)),
    onBlack: getWcagLevels(getContrastRatio(black, backgroundHex)),
  };
}

export function getContrastPairReport(backgroundHex, foregroundHex) {
  const ratio = getContrastRatio(foregroundHex, backgroundHex);
  return getWcagLevels(ratio);
}

function hslDistance(h1, s1, l1, h2, s2, l2) {
  const hueDelta = Math.min(Math.abs(h1 - h2), 360 - Math.abs(h1 - h2));
  return hueDelta * 0.5 + Math.abs(s1 - s2) + Math.abs(l1 - l2);
}

function buildSameHueCandidates(hue, saturation) {
  const candidates = [];
  const seen = new Set();

  const add = (sat, light) => {
    const clampedS = Math.max(0, Math.min(100, sat));
    const clampedL = Math.max(2, Math.min(98, light));
    const color = colorFromHsl(hue, clampedS, clampedL);
    const key = color.hex.toLowerCase();

    if (seen.has(key)) return;
    seen.add(key);
    candidates.push({ hex: color.hex, h: hue, s: clampedS, l: clampedL });
  };

  for (let lightness = 2; lightness <= 98; lightness += 2) {
    add(saturation, lightness);
  }

  for (const satOffset of [-15, 15]) {
    for (const lightness of [10, 25, 40, 60, 75, 90]) {
      add(saturation + satOffset, lightness);
    }
  }

  return candidates;
}

function compareNearestContrastCandidates(next, current) {
  if (!current) return next;
  if (next.passesAA !== current.passesAA) return next.passesAA ? next : current;
  if (next.distance !== current.distance) return next.distance < current.distance ? next : current;
  return next.ratio > current.ratio ? next : current;
}

export function getBestNearestContrastForeground(backgroundHex) {
  const { r, g, b } = hexToRgb(backgroundHex);
  const { h, s, l } = rgbToHsl(r, g, b);
  const backgroundKey = backgroundHex.toLowerCase();

  let best = null;

  for (const candidate of buildSameHueCandidates(h, s)) {
    if (candidate.hex.toLowerCase() === backgroundKey) continue;

    const ratio = getContrastRatio(candidate.hex, backgroundHex);
    const entry = {
      hex: candidate.hex,
      ratio,
      passesAA: getWcagLevels(ratio).normalAA,
      distance: hslDistance(h, s, l, candidate.h, candidate.s, candidate.l),
    };

    best = compareNearestContrastCandidates(entry, best);
  }

  if (best) return best.hex;
  return l > 50 ? '#000000' : '#ffffff';
}

const HARMONY_OFFSETS = {
  complementary: [0, 180],
  analogous: [-30, 0, 30],
  triadic: [0, 120, 240],
  splitComplementary: [0, 150, 210],
  tetradic: [0, 90, 180, 270],
  square: [0, 90, 180, 270],
  compound: [0, 30, 180, 210],
};

const HARMONY_LIGHTNESS = {
  monochromatic: [-20, 0, 15, 30],
  shades: [-25, -15, 0, 10],
  tints: [0, 12, 24, 36],
};

export function generateHarmony(baseHex, type) {
  const { r, g, b } = hexToRgb(baseHex);
  const { h, s, l } = rgbToHsl(r, g, b);

  if (HARMONY_LIGHTNESS[type]) {
    return HARMONY_LIGHTNESS[type].map((delta) =>
      colorFromHsl(h, s, Math.max(0, Math.min(100, l + delta)))
    );
  }

  const offsets = HARMONY_OFFSETS[type] || HARMONY_OFFSETS.complementary;
  return offsets.map((offset) => colorFromHsl(h + offset, s, l));
}

function samplePixelsWithMood(imageData, width, height, mood, maxSamples = 8000) {
  const { data } = imageData;
  const weighted = [];
  const total = width * height;
  const step = Math.max(1, Math.floor(total / maxSamples));

  for (let i = 0; i < total; i += step) {
    const index = i * 4;
    if (data[index + 3] < 125) continue;

    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const { s, l } = rgbToHsl(r, g, b);

    let weight = 1;
    if (mood === 'vibrant') {
      weight = 1 + s / 50;
    } else if (mood === 'muted') {
      const mutedScore = 100 - Math.abs(s - 28);
      const midLight = 100 - Math.abs(l - 52);
      weight = 1 + (mutedScore + midLight) / 120;
    }

    const copies = Math.max(1, Math.round(weight));
    for (let copy = 0; copy < copies; copy += 1) {
      weighted.push([r, g, b]);
    }
  }

  return weighted;
}

export function extractPaletteWithMood(image, colorCount = 6, mood = 'dominant') {
  const canvas = document.createElement('canvas');
  const maxSide = 220;
  const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));

  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  if (mood === 'dominant') {
    return extractPaletteFromImageData(imageData, canvas.width, canvas.height, colorCount);
  }

  const pixels = samplePixelsWithMood(imageData, canvas.width, canvas.height, mood);
  if (!pixels.length) return [];

  const synthetic = new ImageData(canvas.width, canvas.height);
  let pointer = 0;

  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const pixel = pixels[pointer % pixels.length];
      pointer += 1;
      const offset = (y * canvas.width + x) * 4;
      synthetic.data[offset] = pixel[0];
      synthetic.data[offset + 1] = pixel[1];
      synthetic.data[offset + 2] = pixel[2];
      synthetic.data[offset + 3] = 255;
    }
  }

  return extractPaletteFromImageData(synthetic, canvas.width, canvas.height, colorCount);
}

export function buildLinearGradient(colors, direction = 'to right', repeat = false) {
  const stops = colors.map((color) => color.hex || color).join(', ');
  const fn = repeat ? 'repeating-linear-gradient' : 'linear-gradient';
  return `${fn}(${direction}, ${stops})`;
}

export function buildRadialGradient(colors, shape = 'circle at center') {
  const stops = colors.map((color) => color.hex || color).join(', ');
  return `radial-gradient(${shape}, ${stops})`;
}

export function buildConicGradient(colors, angle = 'from 0deg at center') {
  const stops = colors.map((color) => color.hex || color).join(', ');
  return `conic-gradient(${angle}, ${stops})`;
}

export function buildGradientCss(colors, { type = 'linear', direction = 'to right', repeat = false } = {}) {
  if (type === 'radial') return buildRadialGradient(colors, direction);
  if (type === 'conic') return buildConicGradient(colors, direction);
  return buildLinearGradient(colors, direction, repeat);
}

export function buildCssVariables(colors, prefix = 'palette') {
  return colors
    .map((color, index) => {
      const hex = color.hex || color;
      return `--${prefix}-${index + 1}: ${hex};`;
    })
    .join('\n');
}

export function buildTailwindColors(colors, name = 'studio') {
  const entries = colors
    .map((color, index) => {
      const hex = color.hex || color;
      return `          ${index + 1}: '${hex}',`;
    })
    .join('\n');

  return `// tailwind.config.js\nextend: {\n  colors: {\n    ${name}: {\n${entries}\n    },\n  },\n},`;
}

export function buildScssMap(colors, name = 'studio-palette') {
  const entries = colors
    .map((color, index) => {
      const hex = color.hex || color;
      return `  'color-${index + 1}': ${hex},`;
    })
    .join('\n');

  return `$${name}: (\n${entries}\n);`;
}

export function buildPaletteJson(colors) {
  return JSON.stringify(
    colors.map((color, index) => ({
      name: `color-${index + 1}`,
      hex: color.hex || color,
      rgb: color.rgb || null,
      hsl: color.hsl || null,
      weight: color.weight ?? null,
    })),
    null,
    2
  );
}

export function normalizePaletteColor(color) {
  if (typeof color === 'string') return colorFromHex(color);
  if (color?.hex) return color;
  return null;
}

export function appendToCustomPalette(palette, color) {
  const normalized = normalizePaletteColor(color);
  if (!normalized) return palette;

  const exists = palette.some((entry) => entry.hex.toLowerCase() === normalized.hex.toLowerCase());
  if (exists) return palette;

  return [...palette, { ...normalized, weight: 1, custom: true }].slice(-MAX_CUSTOM_PALETTE);
}

export function appendFavorite(palette, color) {
  const normalized = normalizePaletteColor(color);
  if (!normalized) return palette;

  const exists = palette.some((entry) => entry.hex.toLowerCase() === normalized.hex.toLowerCase());
  if (exists) return palette;

  return [...palette, normalized];
}

export function removeFavoriteByHex(palette, hex) {
  return palette.filter((entry) => entry.hex.toLowerCase() !== hex.toLowerCase());
}

export function removeCustomPaletteByHex(palette, hex) {
  return palette.filter((entry) => entry.hex.toLowerCase() !== hex.toLowerCase());
}

export function buildHexList(colors) {
  return colors.map((color) => color.hex || color).join(', ');
}

export function buildLessVariables(colors, prefix = 'palette') {
  return colors
    .map((color, index) => {
      const hex = color.hex || color;
      return `@${prefix}-${index + 1}: ${hex};`;
    })
    .join('\n');
}

export function buildPaletteCsv(colors) {
  const header = 'name,hex,rgb,hsl';
  const rows = colors.map((color, index) => {
    const hex = color.hex || color;
    const rgb = color.rgb || '';
    const hsl = color.hsl || '';
    return `color-${index + 1},${hex},${rgb},${hsl}`;
  });
  return [header, ...rows].join('\n');
}

export function buildPaletteSvg(colors, swatchWidth = 48, swatchHeight = 48) {
  const width = colors.length * swatchWidth;
  const rects = colors
    .map((color, index) => {
      const hex = color.hex || color;
      const x = index * swatchWidth;
      return `<rect x="${x}" y="0" width="${swatchWidth}" height="${swatchHeight}" fill="${hex}" />`;
    })
    .join('\n  ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${swatchHeight}" viewBox="0 0 ${width} ${swatchHeight}">\n  ${rects}\n</svg>`;
}

export function buildDesignTokens(colors, prefix = 'studio') {
  const tokens = {};
  colors.forEach((color, index) => {
    const hex = color.hex || color;
    tokens[`${prefix}.color-${index + 1}`] = {
      $type: 'color',
      $value: hex,
    };
  });
  return JSON.stringify(tokens, null, 2);
}

export function mergePalettes(extracted, custom) {
  const merged = [...custom];

  for (const color of extracted) {
    const exists = merged.some((entry) => entry.hex.toLowerCase() === color.hex.toLowerCase());
    if (!exists) merged.push(color);
  }

  return merged;
}

export const GRADIENT_TYPES = [
  { id: 'linear', labelKey: 'linear' },
  { id: 'radial', labelKey: 'radial' },
  { id: 'conic', labelKey: 'conic' },
];

export const LINEAR_GRADIENT_DIRECTIONS = [
  { id: 'to right', labelKey: 'toRight' },
  { id: 'to left', labelKey: 'toLeft' },
  { id: 'to bottom', labelKey: 'toBottom' },
  { id: 'to top', labelKey: 'toTop' },
  { id: '45deg', labelKey: 'deg45' },
  { id: '90deg', labelKey: 'deg90' },
  { id: '135deg', labelKey: 'diagonal' },
  { id: '180deg', labelKey: 'deg180' },
  { id: '225deg', labelKey: 'deg225' },
  { id: '270deg', labelKey: 'deg270' },
  { id: '315deg', labelKey: 'deg315' },
];

export const RADIAL_GRADIENT_SHAPES = [
  { id: 'circle at center', labelKey: 'circleCenter' },
  { id: 'ellipse at center', labelKey: 'ellipseCenter' },
  { id: 'circle at top left', labelKey: 'circleTopLeft' },
];

export const CONIC_GRADIENT_ANGLES = [
  { id: 'from 0deg at center', labelKey: 'from0' },
  { id: 'from 90deg at center', labelKey: 'from90' },
  { id: 'from 180deg at center', labelKey: 'from180' },
];

/** @deprecated use LINEAR_GRADIENT_DIRECTIONS */
export const GRADIENT_DIRECTIONS = LINEAR_GRADIENT_DIRECTIONS;

export const HARMONY_TYPES = [
  'complementary',
  'analogous',
  'triadic',
  'splitComplementary',
  'tetradic',
  'square',
  'compound',
  'monochromatic',
  'shades',
  'tints',
];

export const PALETTE_MOODS = ['dominant', 'vibrant', 'muted'];

export const PALETTE_SIZES = [4, 6, 8, 10];

export const CONTRAST_PREVIEW_SIZES = { small: 14, large: 24 };

export const RANDOM_PALETTE_STYLES = ['vibrant', 'muted', 'pastel', 'bold', 'dark'];

const RANDOM_STYLE_RANGES = {
  vibrant: { sMin: 65, sMax: 95, lMin: 45, lMax: 60 },
  muted: { sMin: 15, sMax: 35, lMin: 45, lMax: 65 },
  pastel: { sMin: 25, sMax: 45, lMin: 72, lMax: 88 },
  bold: { sMin: 80, sMax: 100, lMin: 35, lMax: 50 },
  dark: { sMin: 40, sMax: 70, lMin: 18, lMax: 35 },
};

function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

export function generateRandomPalette(count = 6, style = 'vibrant') {
  const ranges = RANDOM_STYLE_RANGES[style] || RANDOM_STYLE_RANGES.vibrant;
  const baseHue = Math.random() * 360;
  const hueStep = count > 1 ? 360 / count : 0;

  return Array.from({ length: count }, (_, index) => {
    const hue = (baseHue + index * hueStep + randomInRange(-8, 8) + 360) % 360;
    const saturation = randomInRange(ranges.sMin, ranges.sMax);
    const lightness = randomInRange(ranges.lMin, ranges.lMax);
    return { ...colorFromHsl(hue, saturation, lightness), weight: 1 };
  });
}

export const DEFAULT_ACTIVE_COLOR = formatColorValues(29, 78, 216);
