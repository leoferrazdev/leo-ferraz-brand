import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { create as createFont } from 'fontkitten';

sharp.concurrency(1);
sharp.cache(false);

export const COVER_FORMATS = Object.freeze({
  horizontal: Object.freeze({ width: 1280, height: 720, grid: 48 }),
  vertical: Object.freeze({ width: 1080, height: 1920, grid: 60 }),
});

export const APPROVED_PORTRAITS = Object.freeze([
  'leo-ferraz-cutout-front.png',
  'leo-ferraz-cutout-smile-three-quarter.png',
  'leo-ferraz-cutout-present-right.png',
  'leo-ferraz-cutout-neutral.png',
  'leo-ferraz-cutout-present-left.png',
  'leo-ferraz-cutout-arms-crossed.png',
]);

const COLORS = Object.freeze({
  background: '#0D1117',
  text: '#F3F6FA',
  accent: '#4DA3FF',
  grid: '#405064',
});

const LAYOUTS = Object.freeze({
  horizontal: Object.freeze({
    badge: { x: 64, y: 56, size: 26, height: 56 },
    headline: { x: 64, top: 176, nominalSize: 90, minimumSize: 72, lineHeight: 0.95, limit: 544 },
    portrait: { x: 640, y: 0, width: 640, height: 720 },
    symbol: { x: 1176, y: 40, width: 64, height: 64 },
  }),
  vertical: Object.freeze({
    badge: { x: 72, y: 300, size: 30, height: 64 },
    headline: { x: 72, top: 430, nominalSize: 118, minimumSize: 92, lineHeight: 0.95, limit: 858 },
    portrait: { x: 0, y: 880, width: 1080, height: 1040 },
    symbol: { x: 72, y: 180, width: 64, height: 64 },
  }),
});

const faces = new Map();

function faceFor(rootDir) {
  const fontPath = path.join(
    rootDir,
    'node_modules',
    '@fontsource',
    'ibm-plex-sans',
    'files',
    'ibm-plex-sans-latin-700-normal.woff2',
  );
  if (!faces.has(fontPath)) faces.set(fontPath, createFont(fs.readFileSync(fontPath)));
  return faces.get(fontPath);
}

function number(value) {
  return Number(value.toFixed(3));
}

function measure(text, size, tracking, face) {
  const trackingUnits = tracking * face.unitsPerEm;
  let width = 0;
  for (const character of text) {
    width += face.glyphForCodePoint(character.codePointAt(0)).advanceWidth + trackingUnits;
  }
  return number((width * size) / face.unitsPerEm - tracking * size);
}

function assertGlyphs(text, face) {
  const missing = [...new Set([...text])].filter((character) => (
    character !== ' ' && !face.glyphForCodePoint(character.codePointAt(0))?.path?.commands?.length
  ));
  if (missing.length) throw new Error(`font has no glyph for ${missing.map((character) => `"${character}"`).join(', ')}`);
}

function outlined(runs, { size, tracking = 0, x, baseline, face }) {
  const scale = size / face.unitsPerEm;
  const trackingUnits = tracking * face.unitsPerEm;
  let cursor = x / scale;
  const paths = [];
  for (const run of runs) {
    for (const character of run.text) {
      const glyph = face.glyphForCodePoint(character.codePointAt(0));
      if (glyph.path?.commands?.length) {
        paths.push(`<path d="${glyph.path.scale(scale, -scale).translate(cursor * scale, baseline).toSVG()}" fill="${run.fill}"/>`);
      }
      cursor += glyph.advanceWidth + trackingUnits;
    }
  }
  return paths.join('');
}

function grid(width, height, cell) {
  const lines = [];
  for (let x = cell; x < width; x += cell) {
    lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="${COLORS.grid}" stroke-opacity="0.45" stroke-width="1"/>`);
  }
  for (let y = cell; y < height; y += cell) {
    lines.push(`<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="${COLORS.grid}" stroke-opacity="0.45" stroke-width="1"/>`);
  }
  return lines.join('');
}

function badge(text, { x, y, size, height }, face) {
  const tracking = 0.06;
  const dot = Math.round(size * 0.6);
  const paddingLeft = Math.round(size * 0.85);
  const gap = Math.round(size * 0.54);
  const paddingRight = Math.round(size * 1.08);
  const width = paddingLeft + dot + gap + measure(text, size, tracking, face) + paddingRight;
  const centerY = y + height / 2;
  const capHeight = face.capHeight ?? face.ascent * 0.7;
  const baseline = number(centerY + (capHeight * size) / (face.unitsPerEm * 2));
  return {
    right: number(x + width),
    markup: `<rect x="${x}" y="${y}" width="${number(width)}" height="${height}" rx="${height / 2}" fill="${COLORS.accent}"/>`
      + `<circle cx="${x + paddingLeft + dot / 2}" cy="${centerY}" r="${dot / 2}" fill="${COLORS.background}"/>`
      + outlined([{ text, fill: COLORS.background }], {
        size,
        tracking,
        x: x + paddingLeft + dot + gap,
        baseline,
        face,
      }),
  };
}

function fitHeadline(lines, spec, face) {
  for (let size = spec.nominalSize; size >= spec.minimumSize; size -= 2) {
    const widths = lines.map((line) => measure(line, size, -0.028, face));
    if (widths.every((width) => width <= spec.limit)) return { size, widths };
  }
  throw new Error(`headline does not fit approved bounds: ${lines.join(' / ')}`);
}

async function portraitDataUri(sourcePath, zone) {
  const buffer = await sharp(sourcePath)
    .resize(zone.width, zone.height, { fit: 'cover', position: 'top', kernel: sharp.kernel.lanczos3 })
    .png({ compressionLevel: 9 })
    .toBuffer();
  return `data:image/png;base64,${buffer.toString('base64')}`;
}

function symbolBody({ x, y, width, height }) {
  const scaleX = width / 80;
  const scaleY = height / 80;
  return `<g transform="translate(${x} ${y}) scale(${scaleX} ${scaleY})" data-mark="constructed-lf">`
    + `<g transform="translate(8 8)">`
    + `<path d="M8 8H20V44H28V56H8Z" fill="#F3F6FA"/>`
    + `<path d="M28 8H56V20H40V28H48V36H40V56H28Z" fill="#F3F6FA"/>`
    + `<rect x="48" y="28" width="8" height="8" fill="#4DA3FF"/>`
    + `</g></g>`;
}

export async function loadCoverManifest(manifestPath) {
  return JSON.parse(await fs.promises.readFile(manifestPath, 'utf8'));
}

export function validateCoverManifest(entries) {
  if (!Array.isArray(entries) || entries.length === 0) throw new Error('manifest must be a non-empty array');
  const ids = new Set();
  for (const entry of entries) {
    if (!entry || typeof entry !== 'object') throw new Error('manifest entry must be an object');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id ?? '')) throw new Error(`invalid id: ${entry.id ?? ''}`);
    if (ids.has(entry.id)) throw new Error(`duplicate id: ${entry.id}`);
    ids.add(entry.id);
    if (typeof entry.category !== 'string' || entry.category.trim() === '') throw new Error(`empty category: ${entry.id}`);
    if (!Array.isArray(entry.headlineLines) || ![2, 3].includes(entry.headlineLines.length)) {
      throw new Error(`headlineLines must contain 2 or 3 lines: ${entry.id}`);
    }
    if (entry.headlineLines.some((line) => typeof line !== 'string' || line.trim() === '')) {
      throw new Error(`headline line must be non-empty: ${entry.id}`);
    }
    if (!APPROVED_PORTRAITS.includes(entry.portrait)) throw new Error(`unsupported portrait: ${entry.portrait}`);
  }
  return entries;
}

export async function renderCoverSvg({ entry, format, rootDir }) {
  validateCoverManifest([entry]);
  const formatSpec = COVER_FORMATS[format];
  const layout = LAYOUTS[format];
  if (!formatSpec || !layout) throw new Error(`unsupported cover format: ${format}`);

  const face = faceFor(rootDir);
  const portraitRoot = path.resolve(rootDir, 'brand-assets', 'profile', 'leo-ferraz');
  const portraitPath = path.resolve(portraitRoot, entry.portrait);
  if (path.dirname(portraitPath) !== portraitRoot) throw new Error(`portrait must resolve under approved root: ${entry.portrait}`);

  assertGlyphs(entry.category, face);
  assertGlyphs(entry.headlineLines.join(''), face);
  const { size: headlineSize, widths } = fitHeadline(entry.headlineLines, layout.headline, face);
  const portrait = await portraitDataUri(portraitPath, layout.portrait);
  const categoryBadge = badge(entry.category, layout.badge, face);
  const firstBaseline = layout.headline.top + (face.ascent * headlineSize) / face.unitsPerEm;
  const headline = entry.headlineLines.map((line, index) => outlined([{ text: line, fill: COLORS.text }], {
    size: headlineSize,
    tracking: -0.028,
    x: layout.headline.x,
    baseline: firstBaseline + index * headlineSize * layout.headline.lineHeight,
    face,
  })).join('');
  const headlineBottom = layout.headline.top + entry.headlineLines.length * headlineSize * layout.headline.lineHeight;
  const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${formatSpec.width} ${formatSpec.height}" width="${formatSpec.width}" height="${formatSpec.height}">`
    + `<rect width="${formatSpec.width}" height="${formatSpec.height}" fill="${COLORS.background}"/>`
    + grid(formatSpec.width, formatSpec.height, formatSpec.grid)
    + `<image x="${layout.portrait.x}" y="${layout.portrait.y}" width="${layout.portrait.width}" height="${layout.portrait.height}" xlink:href="${portrait}"/>`
    + symbolBody(layout.symbol)
    + categoryBadge.markup
    + headline
    + `</svg>`;

  return {
    svg: Buffer.from(svgMarkup),
    metrics: {
      width: formatSpec.width,
      height: formatSpec.height,
      headlineSize,
      essentialRight: Math.max(
        layout.headline.x + Math.max(...widths),
        categoryBadge.right,
        layout.symbol.x + layout.symbol.width,
      ),
      essentialBottom: Math.max(
        headlineBottom,
        layout.badge.y + layout.badge.height,
        layout.symbol.y + layout.symbol.height,
      ),
      faceZoneTop: format === 'vertical' ? 950 : 0,
      faceZoneBottom: format === 'vertical' ? 1450 : formatSpec.height,
      overflow: false,
    },
  };
}

export async function buildCoverPack() {
  throw new Error('buildCoverPack not implemented');
}
