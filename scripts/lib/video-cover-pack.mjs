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

const PACK_DIRECTORIES = Object.freeze(['horizontal', 'vertical', 'review']);

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

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
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
  const missing = [...new Set([...text])].filter((character) => {
    if (character === ' ') return false;
    const glyph = face.glyphForCodePoint(character.codePointAt(0));
    return !glyph?.path?.commands?.length || glyph.id === 0 || glyph.name === '.notdef';
  });
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

function lineInkBounds(text, size, face) {
  const scale = size / face.unitsPerEm;
  const bounds = [...text]
    .filter((character) => character !== ' ')
    .map((character) => face.glyphForCodePoint(character.codePointAt(0)).path.bbox);
  return {
    top: number(Math.min(...bounds.map((bbox) => -bbox.maxY * scale))),
    bottom: number(Math.max(...bounds.map((bbox) => -bbox.minY * scale))),
  };
}

function positionedTextInkBounds(text, { size, tracking, x, baseline, face }) {
  const scale = size / face.unitsPerEm;
  const trackingUnits = tracking * face.unitsPerEm;
  let cursor = x / scale;
  let left = Number.POSITIVE_INFINITY;
  let top = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;
  for (const character of text) {
    const glyph = face.glyphForCodePoint(character.codePointAt(0));
    if (glyph.path?.commands?.length) {
      const bbox = glyph.path.bbox;
      left = Math.min(left, (cursor + bbox.minX) * scale);
      top = Math.min(top, baseline - bbox.maxY * scale);
      right = Math.max(right, (cursor + bbox.maxX) * scale);
      bottom = Math.max(bottom, baseline - bbox.minY * scale);
    }
    cursor += glyph.advanceWidth + trackingUnits;
  }
  return {
    left: number(left),
    top: number(top),
    right: number(right),
    bottom: number(bottom),
  };
}

function safeHeadlineLineHeight(lines, size, target, face) {
  const inkBounds = lines.map((line) => lineInkBounds(line, size, face));
  let minimumSafeLineHeight = 0;
  for (let index = 1; index < inkBounds.length; index++) {
    minimumSafeLineHeight = Math.max(
      minimumSafeLineHeight,
      inkBounds[index - 1].bottom - inkBounds[index].top,
    );
  }
  minimumSafeLineHeight = number(minimumSafeLineHeight + size * 0.02);
  return {
    inkBounds,
    lineHeight: Math.max(size * target, minimumSafeLineHeight),
    minimumSafeLineHeight,
  };
}

async function portraitDataUri(sourcePath, zone, focus) {
  const { width: sourceWidth, height: sourceHeight } = await sharp(sourcePath).metadata();
  if (!sourceWidth || !sourceHeight) throw new Error(`portrait dimensions unavailable: ${sourcePath}`);
  const shrink = Math.min(sourceWidth / zone.width, sourceHeight / zone.height);
  const resizedWidth = Math.round(sourceWidth / shrink);
  const resizedHeight = Math.round(sourceHeight / shrink);
  const left = clamp(
    Math.round(focus.x * resizedWidth - zone.width / 2),
    0,
    resizedWidth - zone.width,
  );
  const top = clamp(
    Math.round(focus.y * resizedHeight - zone.height / 2),
    0,
    resizedHeight - zone.height,
  );
  const buffer = await sharp(sourcePath)
    .resize(zone.width, zone.height, { fit: 'outside', kernel: sharp.kernel.lanczos3 })
    .extract({ left, top, width: zone.width, height: zone.height })
    .png({ compressionLevel: 9 })
    .toBuffer();
  return {
    dataUri: `data:image/png;base64,${buffer.toString('base64')}`,
    crop: {
      focus: { x: focus.x, y: focus.y },
      sourceWidth,
      sourceHeight,
      resizedWidth,
      resizedHeight,
      left,
      top,
      width: zone.width,
      height: zone.height,
      focusCanvasX: number(zone.x + clamp(focus.x * resizedWidth - left, 0, zone.width)),
      focusCanvasY: number(zone.y + clamp(focus.y * resizedHeight - top, 0, zone.height)),
    },
  };
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

function symbolBounds({ x, y, width, height }) {
  return {
    left: number(x + width * 0.2),
    top: number(y + height * 0.2),
    right: number(x + width * 0.8),
    bottom: number(y + height * 0.8),
  };
}

function safeZoneViolations({ bounds, format, formatSpec, layout }) {
  const violations = [];
  for (const [name, box] of Object.entries(bounds)) {
    if (box.left < 0) violations.push(`${name}.left<0`);
    if (box.top < 0) violations.push(`${name}.top<0`);
    if (box.right > formatSpec.width) violations.push(`${name}.right>${formatSpec.width}`);
    if (box.bottom > formatSpec.height) violations.push(`${name}.bottom>${formatSpec.height}`);
  }
  if (format === 'horizontal') {
    for (const name of ['badge', 'headline']) {
      if (bounds[name].right > layout.portrait.x) {
        violations.push(`${name}.right>${layout.portrait.x} text/photo boundary`);
      }
    }
  } else {
    for (const [name, box] of Object.entries(bounds)) {
      if (box.right > 930) violations.push(`${name}.right>930`);
      if (box.bottom > 1620) violations.push(`${name}.bottom>1620`);
    }
  }
  return violations;
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
    if (!entry.focus || typeof entry.focus !== 'object' || Array.isArray(entry.focus)
      || !Object.hasOwn(entry.focus, 'horizontal') || !Object.hasOwn(entry.focus, 'vertical')) {
      throw new Error(`focus must declare horizontal and vertical: ${entry.id}`);
    }
    const unsupportedFocusKey = Object.keys(entry.focus)
      .find((key) => !Object.hasOwn(COVER_FORMATS, key));
    if (unsupportedFocusKey) throw new Error(`unsupported focus key: ${unsupportedFocusKey}`);
    for (const format of Object.keys(COVER_FORMATS)) {
      const point = entry.focus[format];
      if (!point || typeof point !== 'object' || Array.isArray(point)
        || !Object.hasOwn(point, 'x') || !Object.hasOwn(point, 'y')) {
        throw new Error(`${format} focus must declare x and y: ${entry.id}`);
      }
      const unsupportedPointKey = Object.keys(point).find((key) => !['x', 'y'].includes(key));
      if (unsupportedPointKey) throw new Error(`unsupported ${format} focus key: ${unsupportedPointKey}`);
      for (const axis of ['x', 'y']) {
        if (typeof point[axis] !== 'number' || !Number.isFinite(point[axis])
          || point[axis] < 0 || point[axis] > 1) {
          throw new Error(`${format} focus ${axis} must be between 0 and 1: ${entry.id}`);
        }
      }
    }
  }
  return entries;
}

export async function renderCoverSvg({ entry, format, rootDir }) {
  validateCoverManifest([entry]);
  const formatSpec = COVER_FORMATS[format];
  const layout = LAYOUTS[format];
  if (!formatSpec || !layout) throw new Error(`unsupported cover format: ${format}`);
  const focus = entry.focus[format];

  const face = faceFor(rootDir);
  const portraitRoot = path.resolve(rootDir, 'brand-assets', 'profile', 'leo-ferraz');
  const portraitPath = path.resolve(portraitRoot, entry.portrait);
  if (path.dirname(portraitPath) !== portraitRoot) throw new Error(`portrait must resolve under approved root: ${entry.portrait}`);

  assertGlyphs(entry.category, face);
  assertGlyphs(entry.headlineLines.join(''), face);
  const { size: headlineSize } = fitHeadline(entry.headlineLines, layout.headline, face);
  const { inkBounds, lineHeight, minimumSafeLineHeight } = safeHeadlineLineHeight(
    entry.headlineLines,
    headlineSize,
    layout.headline.lineHeight,
    face,
  );
  const categoryBadge = badge(entry.category, layout.badge, face);
  const firstBaseline = layout.headline.top + (face.ascent * headlineSize) / face.unitsPerEm;
  const headlineLineBounds = entry.headlineLines.map((line, index) => {
    const baseline = firstBaseline + index * lineHeight;
    return positionedTextInkBounds(line, {
      size: headlineSize,
      tracking: -0.028,
      x: layout.headline.x,
      baseline,
      face,
    });
  });
  const bounds = {
    badge: {
      left: layout.badge.x,
      top: layout.badge.y,
      right: categoryBadge.right,
      bottom: layout.badge.y + layout.badge.height,
    },
    headline: {
      left: Math.min(...headlineLineBounds.map((lineBounds) => lineBounds.left)),
      top: Math.min(...headlineLineBounds.map((lineBounds) => lineBounds.top)),
      right: Math.max(...headlineLineBounds.map((lineBounds) => lineBounds.right)),
      bottom: Math.max(...headlineLineBounds.map((lineBounds) => lineBounds.bottom)),
    },
    symbol: symbolBounds(layout.symbol),
  };
  const violations = safeZoneViolations({ bounds, format, formatSpec, layout });
  const overflow = violations.length > 0;
  if (overflow) {
    throw new Error(`safe-zone overflow for ${entry.id} ${format}: ${violations.join(', ')}`);
  }
  const headline = entry.headlineLines.map((line, index) => outlined([{ text: line, fill: COLORS.text }], {
    size: headlineSize,
    tracking: -0.028,
    x: layout.headline.x,
    baseline: firstBaseline + index * lineHeight,
    face,
  })).join('');
  const { dataUri: portrait, crop: portraitCrop } = await portraitDataUri(
    portraitPath,
    layout.portrait,
    focus,
  );
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
      headlineLineHeight: lineHeight,
      minimumSafeLineHeight,
      headlineLineBounds,
      bounds,
      essentialRight: Math.max(...Object.values(bounds).map((box) => box.right)),
      essentialBottom: Math.max(...Object.values(bounds).map((box) => box.bottom)),
      portraitCrop,
      overflow,
    },
  };
}

async function pathExists(target) {
  try {
    await fs.promises.access(target);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

function coverFileName(entry, format, extension) {
  const { width, height } = COVER_FORMATS[format];
  return `demo-${entry.id}-${width}x${height}.${extension}`;
}

async function preflightCoverPack({ entries, rootDir }) {
  const renderings = [];
  for (const format of Object.keys(COVER_FORMATS)) {
    for (const entry of entries) {
      const { svg, metrics } = await renderCoverSvg({ entry, format, rootDir });
      renderings.push({ entry, format, svg, metrics });
    }
  }
  return renderings;
}

async function writeStagedDerivatives({ stagingDir, renderings }) {
  for (const format of Object.keys(COVER_FORMATS)) {
    const formatDir = path.join(stagingDir, format);
    await fs.promises.mkdir(formatDir, { recursive: true });
  }

  for (const { entry, format, svg } of renderings) {
    const { width, height } = COVER_FORMATS[format];
    const formatDir = path.join(stagingDir, format);
    const pngPath = path.join(formatDir, coverFileName(entry, format, 'png'));
    const jpgPath = path.join(formatDir, coverFileName(entry, format, 'jpg'));
    await sharp(svg).resize(width, height, { fit: 'fill' }).png({ compressionLevel: 9 }).toFile(pngPath);
    await sharp(svg).resize(width, height, { fit: 'fill' })
      .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
      .toFile(jpgPath);
  }
}

async function writeStagedContactSheet({ stagingDir, entries }) {
  const reviewDir = path.join(stagingDir, 'review');
  const contactSheet = path.join(reviewDir, 'demo-master-pack-contact-sheet.png');
  const horizontalWidth = 960;
  const verticalWidth = 304;
  const rowHeight = 540;
  const gutter = 48;
  const rowX = (2400 - horizontalWidth - gutter - verticalWidth) / 2;
  const rowY = 48;
  await fs.promises.mkdir(reviewDir, { recursive: true });
  const composites = await Promise.all(entries.flatMap((entry, index) => [
    sharp(path.join(stagingDir, 'horizontal', coverFileName(entry, 'horizontal', 'png')))
      .resize(horizontalWidth, rowHeight, { fit: 'fill' })
      .png()
      .toBuffer()
      .then((input) => ({ input, left: rowX, top: rowY + index * (rowHeight + gutter) })),
    sharp(path.join(stagingDir, 'vertical', coverFileName(entry, 'vertical', 'png')))
      .resize(verticalWidth, rowHeight, { fit: 'fill' })
      .png()
      .toBuffer()
      .then((input) => ({ input, left: rowX + horizontalWidth + gutter, top: rowY + index * (rowHeight + gutter) })),
  ]));
  await sharp({
    create: {
      width: 2400,
      height: 2400,
      channels: 4,
      background: COLORS.background,
    },
  }).composite(composites).png({ compressionLevel: 9 }).toFile(contactSheet);
  return contactSheet;
}

async function validateStagedPack({ stagingDir, entries }) {
  let fileCount = 0;
  for (const [format, expected] of Object.entries(COVER_FORMATS)) {
    const formatDir = path.join(stagingDir, format);
    const expectedNames = entries.flatMap((entry) => ['png', 'jpg']
      .map((extension) => coverFileName(entry, format, extension))).sort();
    const actualNames = (await fs.promises.readdir(formatDir)).sort();
    if (JSON.stringify(actualNames) !== JSON.stringify(expectedNames)) {
      throw new Error(`staged ${format} outputs do not match the expected complete set`);
    }
    fileCount += actualNames.length;
    for (const entry of entries) {
      for (const extension of ['png', 'jpg']) {
        const file = path.join(formatDir, coverFileName(entry, format, extension));
        const metadata = await sharp(file).metadata();
        const expectedFormat = extension === 'jpg' ? 'jpeg' : 'png';
        if (metadata.width !== expected.width || metadata.height !== expected.height
          || metadata.format !== expectedFormat) {
          throw new Error(`invalid staged derivative: ${path.relative(stagingDir, file)}`);
        }
      }
    }
  }

  const reviewDir = path.join(stagingDir, 'review');
  const expectedReviewName = 'demo-master-pack-contact-sheet.png';
  const reviewNames = (await fs.promises.readdir(reviewDir)).sort();
  if (JSON.stringify(reviewNames) !== JSON.stringify([expectedReviewName])) {
    throw new Error('staged review outputs do not match the expected complete set');
  }
  fileCount += reviewNames.length;
  const reviewMetadata = await sharp(path.join(reviewDir, expectedReviewName)).metadata();
  if (reviewMetadata.format !== 'png' || reviewMetadata.width !== 2400 || reviewMetadata.height !== 2400) {
    throw new Error('invalid staged contact sheet');
  }
  if (fileCount !== 17) throw new Error(`staged pack requires exactly 17 outputs; received ${fileCount}`);
}

export async function replacePackDirectories({
  outputDir,
  stagingDir,
  rename = fs.promises.rename,
}) {
  await fs.promises.mkdir(outputDir, { recursive: true });
  const backupDir = await fs.promises.mkdtemp(path.join(
    path.dirname(outputDir),
    `.${path.basename(outputDir)}-backup-`,
  ));
  const movedExisting = [];
  const installed = [];
  let preserveBackup = false;

  try {
    for (const directory of PACK_DIRECTORIES) {
      const target = path.join(outputDir, directory);
      if (await pathExists(target)) {
        await rename(target, path.join(backupDir, directory));
        movedExisting.push(directory);
      }
    }
    for (const directory of PACK_DIRECTORIES) {
      await rename(path.join(stagingDir, directory), path.join(outputDir, directory));
      installed.push(directory);
    }
  } catch (error) {
    const restorationErrors = [];
    for (const directory of installed.reverse()) {
      try {
        await fs.promises.rm(path.join(outputDir, directory), { recursive: true, force: true });
      } catch (restorationError) {
        restorationErrors.push(restorationError);
      }
    }
    for (const directory of movedExisting) {
      try {
        await rename(path.join(backupDir, directory), path.join(outputDir, directory));
      } catch (restorationError) {
        restorationErrors.push(restorationError);
      }
    }
    if (restorationErrors.length) {
      preserveBackup = true;
      throw new AggregateError(
        [error, ...restorationErrors],
        `pack replacement and rollback failed: ${error.message}`,
        { cause: error },
      );
    }
    throw error;
  } finally {
    if (!preserveBackup) {
      await fs.promises.rm(backupDir, { recursive: true, force: true });
    }
  }
}

export async function buildCoverPack({ rootDir, outputDir, manifestPath }) {
  const entries = validateCoverManifest(await loadCoverManifest(manifestPath));
  if (entries.length !== 4) {
    throw new Error(`master pack requires exactly 4 entries; received ${entries.length}`);
  }
  const renderings = await preflightCoverPack({ entries, rootDir });
  await fs.promises.mkdir(path.dirname(outputDir), { recursive: true });
  const stagingDir = await fs.promises.mkdtemp(path.join(
    path.dirname(outputDir),
    `.${path.basename(outputDir)}-staging-`,
  ));

  try {
    await writeStagedDerivatives({ stagingDir, renderings });
    await writeStagedContactSheet({ stagingDir, entries });
    await validateStagedPack({ stagingDir, entries });
    await replacePackDirectories({ outputDir, stagingDir });
  } finally {
    await fs.promises.rm(stagingDir, { recursive: true, force: true });
  }

  const covers = renderings.flatMap(({ entry, format, metrics }) => ['png', 'jpg'].map((extension) => ({
    id: entry.id,
    format,
    extension,
    path: path.join(outputDir, format, coverFileName(entry, format, extension)),
    metrics,
  })));
  const contactSheet = path.join(outputDir, 'review', 'demo-master-pack-contact-sheet.png');

  return { covers, contactSheet };
}
