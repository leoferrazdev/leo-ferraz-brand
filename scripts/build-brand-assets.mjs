import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { create as createFont } from 'fontkitten';

// Deterministic build: single-threaded rasterization removes the run-to-run
// anti-aliasing variance that multi-threaded libvips otherwise introduces on
// the same SVG input, which previously made brand-assets/deterministic.sha256
// change between identical builds.
sharp.concurrency(1);
sharp.cache(false);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const exportsRoot = path.join(root, 'brand-assets', 'exports');
const publicExportsRoot = path.join(root, 'public', 'brand-assets', 'exports');
const content = JSON.parse(fs.readFileSync(path.join(root, 'brand-assets', 'sources', 'content.json'), 'utf8'));

const colors = {
  background: '#0D1117',
  surface1: '#151B24',
  surface2: '#1D2632',
  border: '#2A3543',
  borderStrong: '#405064',
  text: '#F3F6FA',
  secondary: '#B7C2CE',
  muted: '#7F8B99',
  accent: '#4DA3FF',
  accentStrong: '#86C5FF',
  accentSubtle: '#0F2E4C',
  experimental: '#9B8CFF',
  experimentalSubtle: '#252044',
};

const fontPath = path.join(root, 'node_modules', '@fontsource', 'ibm-plex-sans', 'files', 'ibm-plex-sans-latin-500-normal.woff2');
const font = createFont(fs.readFileSync(fontPath));
const signatureFontPath = path.join(root, 'node_modules', '@fontsource', 'ibm-plex-sans', 'files', 'ibm-plex-sans-latin-700-normal.woff2');
const signatureFont = createFont(fs.readFileSync(signatureFontPath));
const monoFontPath = path.join(root, 'node_modules', '@fontsource', 'ibm-plex-mono', 'files', 'ibm-plex-mono-latin-500-normal.woff2');
const monoFont = createFont(fs.readFileSync(monoFontPath));
const fontScale = (size, fontFace = font) => size / fontFace.unitsPerEm;

const escapeXml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function number(value) {
  return Number(value.toFixed(3));
}

function measureText(text, size, tracking = 0, fontFace = font) {
  const scale = fontScale(size, fontFace);
  const trackingUnits = tracking * fontFace.unitsPerEm;
  let width = 0;
  for (const character of text) {
    width += fontFace.glyphForCodePoint(character.codePointAt(0)).advanceWidth + trackingUnits;
  }
  return number(width * scale);
}

function outlinedText(text, { size, tracking = 0, x = 0, baseline = 0, fill = colors.text, fontFace = font }) {
  const scale = fontScale(size, fontFace);
  const trackingUnits = tracking * fontFace.unitsPerEm;
  let cursor = x / scale;
  const paths = [];
  for (const character of text) {
    const glyph = fontFace.glyphForCodePoint(character.codePointAt(0));
    if (glyph.path?.commands?.length) {
      const transformed = glyph.path.scale(scale, -scale).translate(cursor * scale, baseline);
      paths.push(`<path d="${transformed.toSVG()}" fill="${fill}"/>`);
    }
    cursor += glyph.advanceWidth + trackingUnits;
  }
  return paths.join('');
}

function constructedLfSymbolSvg({ x = 0, y = 0, size = 64, primary = colors.text, accent = colors.accent, monochrome = false } = {}) {
  const scale = size / 64;
  const active = monochrome ? primary : accent;
  return `<g data-mark="constructed-lf" transform="translate(${number(x)} ${number(y)}) scale(${number(scale)})"><path d="M8 8H20V44H28V56H8Z" fill="${primary}"/><path d="M28 8H56V20H40V28H48V36H40V56H28Z" fill="${primary}"/><rect x="48" y="28" width="8" height="8" fill="${active}"/></g>`;
}

function outlinedSvg(title, lines, { padding = null, clearSpace = 0.5, gap = 8, background = null } = {}) {
  const measured = lines.map((line) => ({ ...line, width: measureText(line.text, line.size, line.tracking ?? 0) }));
  const resolvedPadding = padding ?? Math.ceil(Math.max(...lines.map((line) => line.size)) * clearSpace);
  const width = Math.ceil(Math.max(...measured.map((line) => line.width)) + resolvedPadding * 2);
  const lineHeight = (size) => number(size * 1.18);
  const height = Math.ceil(measured.reduce((sum, line) => sum + lineHeight(line.size), resolvedPadding * 2 + gap * Math.max(0, measured.length - 1)));
  let top = resolvedPadding;
  const paths = measured.map((line) => {
    const baseline = top + font.ascent * fontScale(line.size);
    const result = outlinedText(line.text, { ...line, baseline, x: resolvedPadding });
    top += lineHeight(line.size) + gap;
    return result;
  }).join('');
  const bg = background ? `<rect width="${width}" height="${height}" fill="${background}"/>` : '';
  return {
    width,
    height,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-labelledby="title"><title id="title">${escapeXml(title)}</title>${bg}${paths}</svg>`,
  };
}

function hybridLogoSvg(title, lines, { primary = colors.text, accent = colors.accent, monochrome = false, background = null, padding = 32, symbolSize = 64, symbolGap = 16, lineGap = 8, underline = false, showSymbol = true, align = 'start', justify = false } = {}) {
  // justify: every line after the first is tracked out (or in) until its ink
  // matches the first line's, so the block reads as one rectangle. The tracking
  // is solved, never hand-tuned — measureText counts the trailing gap after the
  // last glyph, which must not count when matching ink widths, hence n - 1.
  const inkWidth = (text, size, tracking, fontFace) => measureText(text, size, tracking, fontFace) - tracking * size;
  const firstFace = signatureFont;
  const firstInk = inkWidth(lines[0].text, lines[0].size, lines[0].tracking ?? 0, firstFace);
  const normalized = lines.map((line, index) => {
    const fontFace = index === 0 ? signatureFont : font;
    let tracking = line.tracking ?? 0;
    if (justify && index > 0 && [...line.text].length > 1) {
      const base = inkWidth(line.text, line.size, 0, fontFace);
      tracking = (firstInk - base) / (line.size * ([...line.text].length - 1));
    }
    // width keeps its original metric definition so every existing asset keeps
    // its exact box and underline; ink is the drawn extent, which is what
    // centring and width-matching must use.
    return { ...line, tracking, fontFace, fill: line.fill ?? primary, width: measureText(line.text, line.size, tracking, fontFace), ink: inkWidth(line.text, line.size, tracking, fontFace) };
  });
  const lineHeight = (size) => number(size * 1.18);
  const contentHeight = normalized.reduce((sum, line) => sum + lineHeight(line.size), lineGap * Math.max(0, normalized.length - 1)) + (underline ? 4 : 0);
  // Without the symbol the lockup is text alone: its column collapses to zero
  // so the wordmark sits at the padding, not at an empty symbol's indent.
  const symbolColumn = showSymbol ? symbolSize + symbolGap : 0;
  const blockHeight = showSymbol ? Math.max(symbolSize, contentHeight) : contentHeight;
  // Centred signatures centre every line over the widest one. Left-aligning the
  // descriptor under a centred wordmark is what left "Building with AI" hanging
  // off the left edge of the YouTube banner while everything else was centred.
  // A centred block sizes its box by ink as well: sizing by metric while
  // centring by ink shifts the whole block by the first line's trailing
  // tracking, which is negative on the wordmark.
  const blockWidth = Math.max(...normalized.map((line) => line.width));
  const inkBlockWidth = Math.max(...normalized.map((line) => line.ink));
  const width = Math.ceil(padding * 2 + symbolColumn + (align === 'center' ? inkBlockWidth : blockWidth));
  const height = Math.ceil(padding * 2 + blockHeight);
  const contentX = padding + symbolColumn;
  let top = padding + (blockHeight - contentHeight) / 2;
  let firstBaseline = 0;
  const lineOffset = (line) => (align === 'center' ? (inkBlockWidth - line.ink) / 2 : 0);
  let lastInkBottom = 0;
  const paths = normalized.map((line, index) => {
    const baseline = top + line.fontFace.ascent * fontScale(line.size, line.fontFace);
    if (index === 0) firstBaseline = baseline;
    lastInkBottom = baseline + Math.abs(line.fontFace.descent) * fontScale(line.size, line.fontFace);
    const result = outlinedText(line.text, { ...line, x: contentX + lineOffset(line), baseline, fill: monochrome ? primary : line.fill });
    top += lineHeight(line.size) + lineGap;
    return result;
  }).join('');
  const capHeight = signatureFont.capHeight ?? signatureFont.ascent * 0.7;
  const symbolOpticalInset = symbolSize * 8 / 64;
  const symbolY = number(firstBaseline - capHeight * fontScale(normalized[0].size, signatureFont) - symbolOpticalInset);
  const underlineWidth = normalized[0].width;
  const underlineX = number(contentX + lineOffset(normalized[0]));
  const underlineY = number(firstBaseline + 8);
  const underlineSvg = underline ? [
    `<rect data-accent="underline-line" x="${underlineX}" y="${underlineY}" width="${underlineWidth}" height="2" fill="${colors.accent}"/>`,
    `<rect data-accent="underline-terminal" x="${number(underlineX + underlineWidth - 8)}" y="${underlineY}" width="8" height="2" fill="${colors.accentStrong}"/>`,
  ].join('') : '';
  const symbolSvg = showSymbol ? constructedLfSymbolSvg({ x: padding, y: symbolY, size: symbolSize, primary, accent, monochrome }) : '';
  const body = `${symbolSvg}${paths}${underlineSvg}`;
  // The drawn extent, measured rather than guessed: cap height above the first
  // baseline, descender below the last. Callers that centre this asset need the
  // ink box — the layout box carries clear space that is not visible.
  const inkTop = number(firstBaseline - capHeight * fontScale(normalized[0].size, signatureFont));
  const inkBottom = number(Math.max(lastInkBottom, underline ? firstBaseline + 10 : 0));
  return { width, height, padding, blockWidth: inkBlockWidth, inkTop, inkBottom, svg: svgDocument(title, width, height, body, { background }) };
}

function wordmarkOnlySvg(title, { primary = colors.text, underline = true } = {}) {
  const textSize = 58;
  const tracking = -0.035;
  const padding = 32;
  const wordmarkWidth = measureText(content.brand, textSize, tracking, signatureFont);
  const baseline = number(padding + signatureFont.ascent * fontScale(textSize, signatureFont));
  const underlineY = number(baseline + 8);
  const underlineSvg = underline ? [
    `<rect data-accent="underline-line" x="${padding}" y="${underlineY}" width="${wordmarkWidth}" height="2" fill="${colors.accent}"/>`,
    `<rect data-accent="underline-terminal" x="${number(padding + wordmarkWidth - 8)}" y="${underlineY}" width="8" height="2" fill="${colors.accentStrong}"/>`,
  ].join('') : '';
  const body = `${outlinedText(content.brand, { size: textSize, tracking, x: padding, baseline, fill: primary, fontFace: signatureFont })}${underlineSvg}`;
  const height = Math.ceil(padding * 2 + textSize * 1.18 + (underline ? 4 : 0));
  return { width: Math.ceil(padding * 2 + wordmarkWidth), height, padding, svg: svgDocument(title, Math.ceil(padding * 2 + wordmarkWidth), height, body) };
}

// Composable signature assets carry their own baked-in clear-space padding
// (see SIGNATURE.md), which is correct for standalone export but must not
// leak into composed templates: their surrounding text is placed flush at
// the template's own content margin with zero padding. Without this inset,
// the signature renders visibly indented relative to that text.
function placedSignatureBody(asset, { x, y, width, anchor = 'start' }) {
  const scale = width / asset.width;
  const inset = (asset.padding ?? 0) * scale;
  const left = (anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width + inset : x - inset);
  const top = number(y - inset);
  return `<g data-signature-variant="${asset.variant}" transform="translate(${number(left)} ${top}) scale(${number(scale)})">${outlinedBody(asset.svg)}</g>`;
}

function svgDocument(title, width, height, body, { background = null } = {}) {
  const bg = background ? `<rect width="${width}" height="${height}" fill="${background}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-labelledby="title"><title id="title">${escapeXml(title)}</title>${bg}${body}</svg>`;
}

// SVG font-family is inert in this pipeline. Rasterizing one string under four
// families — "IBM Plex Sans", "IBM Plex Mono", "sans-serif" and a deliberately
// nonexistent name — produced byte-identical PNGs, so librsvg resolves no font
// here and every <text> element was drawn in a single arbitrary fallback face.
// The Plex Sans/Plex Mono split this system encodes therefore never reached a
// pixel. Text is outlined against the woff2 files bundled in node_modules
// instead: typographically correct, and deterministic across machines rather
// than dependent on what happens to be installed.
function textElement(text, x, y, { size = 28, fill = colors.text, family = 'IBM Plex Sans', weight = 500, anchor = 'start', letterSpacing = 0 } = {}) {
  const fontFace = family.includes('Mono') ? monoFont : weight >= 700 ? signatureFont : font;
  // measureText appends tracking after every glyph, including the last; that
  // trailing gap must not count when aligning to a right or centre anchor.
  const width = measureText(text, size, letterSpacing, fontFace) - letterSpacing * size;
  const left = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x;
  return outlinedText(text, { size, tracking: letterSpacing, x: number(left), baseline: y, fill, fontFace });
}

// Construction Grid (brand/VISUAL_DIRECTION.md, "Grid Visível"): discreet,
// low-contrast structural texture, applied only to full-bleed environment
// surfaces (OBS scenes, channel banners) that are viewed at real size.
// Deliberately not applied to thumbnails, carousel/story/square or Open
// Graph — small, feed-consumed, legibility-critical formats where the
// headline/artifact must stay the only signal (VISUAL_DIRECTION.md: grid
// "não deve virar textura decorativa obrigatória em todas as aplicações").
// Cell size scales with the canvas (1/10th of the shorter side) so density
// reads consistently across very different asset dimensions.
function constructionGridSvg(width, height, { color = colors.borderStrong, opacity = 0.5, cellDivisor = 10 } = {}) {
  const cell = Math.round(Math.min(width, height) / cellDivisor);
  const id = `construction-grid-${width}x${height}`;
  return `<defs><pattern id="${id}" width="${cell}" height="${cell}" patternUnits="userSpaceOnUse"><path d="M ${cell} 0 L 0 0 0 ${cell}" fill="none" stroke="${color}" stroke-opacity="${opacity}" stroke-width="1"/></pattern></defs><rect width="${width}" height="${height}" fill="url(#${id})"/>`;
}

function socialSvg(title, width, height, { label, headline, signatureAsset, artifact = content.artifact, state = 'CONTENT SLOT', headlineSize = null, showState = true, showDescriptor = true, safeZone = null, showGrid = false } = {}) {
  const safe = safeZone ?? { x: Math.round(width * 0.1), y: Math.round(height * 0.1), width: Math.round(width * 0.8), height: Math.round(height * 0.8) };
  const contentX = safe.x + Math.max(18, Math.round(width * 0.018));
  const contentRight = safe.x + safe.width - Math.max(18, Math.round(width * 0.018));
  const markSize = Math.max(26, Math.round(width * 0.065));
  const signatureWidth = signatureAsset.variant === 'primary-symbol'
    ? markSize
    : Math.min(Math.round(safe.width * 0.44), Math.round(width * 0.4));
  const signatureY = safe.y + Math.max(12, Math.round(safe.height * 0.04));
  const mark = placedSignatureBody(signatureAsset, { x: contentX, y: signatureY, width: signatureWidth });
  const signatureHeight = signatureAsset.height * signatureWidth / signatureAsset.width;
  const labelY = Math.max(safe.y + Math.round(safe.height * 0.31), Math.round(signatureY + signatureHeight + Math.max(20, width * 0.018)));
  const headlineY = safe.y + Math.round(safe.height * 0.53);
  const artifactY = safe.y + Math.round(safe.height * 0.65);
  const stateY = safe.y + Math.round(safe.height * 0.82);
  const descriptorY = safe.y + safe.height - Math.max(12, Math.round(width * 0.018));
  const body = [
    showGrid ? constructionGridSvg(width, height) : '',
    mark,
    textElement(label, contentX, labelY, { size: Math.max(14, Math.round(width * 0.016)), family: 'IBM Plex Mono', fill: colors.accent, letterSpacing: 0.075 }),
    textElement(headline, contentX, headlineY, { size: headlineSize ?? Math.max(30, Math.round(width * 0.07)), weight: 500 }),
    textElement(artifact, contentX, artifactY, { size: Math.max(16, Math.round(width * 0.022)), family: 'IBM Plex Mono', fill: colors.secondary, letterSpacing: 0.01 }),
    showState ? textElement(state, contentX, stateY, { size: Math.max(14, Math.round(width * 0.016)), family: 'IBM Plex Mono', fill: colors.experimental, letterSpacing: 0.075 }) : '',
    showDescriptor ? textElement(content.descriptor, contentRight, descriptorY, { size: Math.max(14, Math.round(width * 0.016)), family: 'IBM Plex Mono', fill: colors.secondary, anchor: 'end' }) : '',
  ].join('');
  return svgDocument(title, width, height, body, { background: colors.background });
}

// signatureScaleFrom: the box width is a layout rule (52% of the safe zone),
// not a type size. A symbol-free signature is narrower, so filling that same
// box would enlarge its wordmark rather than just drop the symbol. Passing the
// symbol-bearing asset holds the original scale and lets the signature end
// narrower than the box, which is the whole point of removing the symbol.
function channelBannerSvg(title, width, height, { safeX, safeY, safeWidth, safeHeight, signatureAsset, signatureScaleFrom = null, leftAligned = false, justifyMetadata = false, signatureFill = null } = {}) {
  const x = leftAligned ? 72 : safeX + safeWidth / 2;
  const anchor = leftAligned ? 'start' : 'middle';
  // signatureFill sizes the signature by the ink the block should occupy across
  // the safe zone, which is what a reader actually perceives, rather than by a
  // box width that includes baked-in clear space. Measured on the upload crop,
  // the box rule left the block at 21.9% of the safe zone's width against 56%
  // of its height: a narrow column stranded in a 3.65:1 band.
  const boxWidth = Math.min(520, Math.round(safeWidth * 0.52));
  const signatureWidth = signatureFill && signatureAsset.blockWidth
    ? number(signatureAsset.width * ((safeWidth * signatureFill) / signatureAsset.blockWidth))
    : number(boxWidth * (signatureAsset.width / (signatureScaleFrom ?? signatureAsset).width));
  const signatureHeight = signatureAsset.height * signatureWidth / signatureAsset.width;
  // Ink, not box: the signature bakes in clear space (SIGNATURE.md), so its box
  // is much taller than its glyphs. The old formula centred the box and
  // subtracted a constant 50 for the metadata line — calibrated for one block
  // size, and it dropped the enlarged block 74px below the safe zone's centre.
  const signatureScale = signatureWidth / signatureAsset.width;
  const signatureInk = ((signatureAsset.inkBottom ?? signatureAsset.height) - (signatureAsset.inkTop ?? 0)) * signatureScale;
  // The metadata line is drawn in banner space, not inside the signature, so it
  // is matched by solving for its size against the signature's rendered block
  // width. Tracking it in instead would crush a monospace face.
  const metadataBase = 22;
  const blockWidth = (signatureAsset.blockWidth ?? 0) * signatureScale;
  const metadataInk = measureText(content.bio[1], metadataBase, 0, monoFont);
  const metadataSize = justifyMetadata && blockWidth > 0 ? number(metadataBase * (blockWidth / metadataInk)) : metadataBase;
  const metadataCap = metadataSize * ((monoFont.capHeight ?? monoFont.ascent * 0.7) / monoFont.unitsPerEm);
  // "Apps", "Jogos" and "Experimentos" all carry descenders, so the line's ink
  // runs below its baseline. Ignoring that is what pushed the block 22px below
  // the safe zone's centre.
  const metadataInkHeight = metadataCap + metadataSize * (Math.abs(monoFont.descent) / monoFont.unitsPerEm);
  // Proportional, not a fixed 32: a fixed gap shrinks in relation to everything
  // else the moment the block grows, closing the composition up.
  const metadataGap = signatureFill ? number(signatureInk * 0.30) : 32;
  // Centre the whole block — signature ink, gap and metadata — on the safe
  // zone, instead of centring the signature alone and hoping the rest follows.
  const blockTop = number(safeY + (safeHeight - (signatureInk + metadataGap + metadataInkHeight)) / 2);
  // placedSignatureBody insets by the asset's baked-in padding, so this solves
  // for the y that lands the signature's ink exactly on blockTop.
  const signatureY = signatureFill
    ? number(blockTop - ((signatureAsset.inkTop ?? 0) - signatureAsset.padding) * signatureScale)
    : safeY + Math.max(10, Math.round((safeHeight - signatureHeight - 50) / 2));
  const metadataY = signatureFill
    ? number(blockTop + signatureInk + metadataGap + metadataCap)
    // Left unrounded: this is the original expression, and rounding it here
    // shifted the Twitch banner's glyph paths in the third decimal — invisible,
    // but enough to churn the file and the determinism hash for no reason.
    : signatureY + signatureHeight + metadataGap;
  const signature = placedSignatureBody(signatureAsset, { x, y: signatureY, width: signatureWidth, anchor });
  const body = [
    constructionGridSvg(width, height),
    signature,
    textElement(content.bio[1], x, metadataY, { size: metadataSize, family: 'IBM Plex Mono', fill: colors.muted, anchor }),
  ].join('');
  return svgDocument(title, width, height, body, { background: colors.background });
}

async function writeBuffer(relative, buffer) {
  const destination = path.join(exportsRoot, relative);
  const mirror = path.join(publicExportsRoot, relative);
  ensureDir(destination);
  ensureDir(mirror);
  fs.writeFileSync(destination, buffer);
  fs.writeFileSync(mirror, buffer);
}

async function writeSvg(relative, svg) {
  await writeBuffer(relative, Buffer.from(svg));
}

async function writePng(relative, svg, width, height, { fit = 'contain' } = {}) {
  const buffer = await sharp(Buffer.from(svg))
    .resize(width, height, { fit, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, effort: 10, adaptiveFiltering: false, palette: false })
    .toBuffer();
  await writeBuffer(relative, buffer);
  return buffer;
}

function createIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const entries = [];
  let offset = 6 + images.length * 16;
  for (const image of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(image.size === 256 ? 0 : image.size, 0);
    entry.writeUInt8(image.size === 256 ? 0 : image.size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(image.buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += image.buffer.length;
  }
  return Buffer.concat([header, ...entries, ...images.map((image) => image.buffer)]);
}

function copyPublic(relative, buffer) {
  const destination = path.join(root, 'public', relative);
  ensureDir(destination);
  fs.writeFileSync(destination, buffer);
}

function outlinedBody(svg) {
  return svg.replace(/^.*?<title[^>]*>.*?<\/title>/s, '').replace(/<\/svg>$/s, '');
}

function rectSafeZone(width, height, xRatio = 0.1, yRatio = 0.1, widthRatio = 0.8, heightRatio = 0.8) {
  return {
    type: 'rect',
    x: Math.round(width * xRatio),
    y: Math.round(height * yRatio),
    width: Math.round(width * widthRatio),
    height: Math.round(height * heightRatio),
  };
}

function defaultSafeZone({ role, width, height, transparency }) {
  if (width === 0 || height === 0) return { type: 'metadata-only' };
  if (role === 'primary lockup' || role === 'wordmark-only' || role === 'descriptor lockup' || role === 'institutional lockup' || role === 'signature' || role === 'wordmark-only export' || role === 'transparent wordmark export') return { type: 'clear-space', value: '0.5em' };
  if (role === 'primary symbol' || role === 'legacy compatibility alias') return { type: 'clear-space', value: '0.25em' };
  if (role.includes('avatar') || role.includes('crop validation') || role === 'favicon' || role === 'apple touch icon' || role === 'web app icon') return rectSafeZone(width, height, 0.16, 0.16, 0.68, 0.68);
  if (transparency) return { type: 'rect', x: 16, y: 16, width: Math.max(0, width - 32), height: Math.max(0, height - 32) };
  return rectSafeZone(width, height);
}

function socialSafeZone(role, width, height) {
  if (role.includes('Story') || role.includes('Reels cover')) return rectSafeZone(width, height, 0.1, 0.12, 0.8, 0.76);
  if (role.includes('thumbnail')) return rectSafeZone(width, height, 0.08, 0.08, 0.84, 0.84);
  return rectSafeZone(width, height, 0.08, 0.08, 0.84, 0.84);
}

const manifest = {
  manifest_version: '1.0.0',
  brand_system: '1.0.0',
  signature_system: 'Constructed LF Lockup',
  source_tag: 'v1.0.0',
  source_commit: 'b2ae95cca8d6b62c6579c415113852b8ef8c8b09',
  status: 'approved',
  generated_by: 'scripts/build-brand-assets.mjs',
  assets: [],
};

function register({ id, platform, role, relative, width, height, format, transparency, usage, signatureVariant = 'none', safeZone = defaultSafeZone({ role, width, height, transparency }), pixelSafeZoneAudit = true, source = 'brand-assets/sources/content.json + scripts/build-brand-assets.mjs', status = 'approved' }) {
  const asset = { id, platform, role, signature_variant: signatureVariant, width, height, dimensions: `${width}x${height}`, format, source_template: source, background: transparency ? 'transparent' : colors.background, transparency, safe_zone: safeZone, usage, export_path: `brand-assets/exports/${relative}`, status };
  if (!pixelSafeZoneAudit) asset.pixel_safe_zone_audit = 'foreground-copy-only';
  manifest.assets.push(asset);
}

// ---------------------------------------------------------------------------
// Live scene system — Streamlabs/OBS collection "Leo Ferraz — YouTube / Twitch"
// ---------------------------------------------------------------------------
// Seven scenes, each composed of sources. Two rules shape everything below.
//
// 1. Scene copy is data, not code. The first version of this block hardcoded
//    English labels ("STARTING SOON", "BE RIGHT BACK") right here, which put
//    public-facing copy in the one place nobody reviews as copy. It shipped
//    English onto pt-BR channels, sitting next to "AO VIVO" inside the same
//    frame — breaking VOICE_AND_LANGUAGE.md ("one piece should have one
//    predominant language"). Copy now lives in sources/content.json, where it
//    can be read and corrected without reading a build script.
//
// 2. Anything that changes mid-stream is never baked into a PNG. Backgrounds
//    carry structure and fixed copy; the topic line and the countdown are OBS
//    text sources dropped into reserved regions. That is what lets one scene
//    change meaning without regenerating an asset — the point of the whole
//    setup being switchable live.

const LIVE_W = 1920;
const LIVE_H = 1080;

// Every rectangle here is the contract between this script and the OBS scene
// collection: the generated assembly guide reproduces these numbers verbatim,
// so a source positioned at them lands exactly inside its drawn frame.
const liveLayouts = {
  frame: {
    camera: { x: 240, y: 120, width: 1440, height: 810, kind: 'video', label: 'CÂMERA' },
  },
  workspace: {
    screen: { x: 40, y: 140, width: 1520, height: 855, kind: 'captura', label: 'TELA / ARTEFATO' },
    camera: { x: 1592, y: 140, width: 288, height: 162, kind: 'video', label: 'CÂMERA' },
    // drawLabel: the chat overlay is transparent, so a label painted on the
    // background stays visible through it and collides with the messages. The
    // name survives on the assembly guide, which never goes on air.
    notes: { x: 1592, y: 326, width: 288, height: 669, kind: 'livre', label: 'CHAT / NOTAS', drawLabel: false },
  },
};

// The frame is drawn entirely outside the region. Stroking the region bounds
// instead would put half the line under the video source once it is placed,
// leaving a frame that looks thinner on screen than it does in the PNG.
function liveMediaRegionBody(region, guide) {
  const o = 3;
  const x = region.x - o;
  const y = region.y - o;
  const w = region.width + o * 2;
  const h = region.height + o * 2;
  const x2 = x + w;
  const y2 = y + h;
  const tick = 32;
  const parts = [
    `<rect x="${region.x}" y="${region.y}" width="${region.width}" height="${region.height}" fill="${colors.surface1}"/>`,
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${colors.border}" stroke-width="2"/>`,
  ];
  for (const d of [
    `M ${x} ${y + tick} L ${x} ${y} L ${x + tick} ${y}`,
    `M ${x2 - tick} ${y} L ${x2} ${y} L ${x2} ${y + tick}`,
    `M ${x} ${y2 - tick} L ${x} ${y2} L ${x + tick} ${y2}`,
    `M ${x2 - tick} ${y2} L ${x2} ${y2} L ${x2} ${y2 - tick}`,
  ]) {
    parts.push(`<path d="${d}" fill="none" stroke="${colors.accent}" stroke-width="3"/>`);
  }
  if (region.label && (region.drawLabel !== false || guide)) {
    parts.push(textElement(region.label, region.x + 26, region.y + 48, { size: 20, family: 'IBM Plex Mono', fill: colors.muted, letterSpacing: 0.09 }));
  }
  if (guide) {
    const style = { size: 18, family: 'IBM Plex Mono', fill: colors.accent };
    const baseline = region.y + region.height - 26;
    // A narrow region (the camera slot is 288px) cannot hold the coordinates on
    // one line — they overflowed past its own frame in the first render.
    if (region.width < 420) {
      parts.push(textElement(`x ${region.x} · y ${region.y}`, region.x + 26, baseline - 26, style));
      parts.push(textElement(`${region.width}×${region.height}`, region.x + 26, baseline, style));
    } else {
      parts.push(textElement(`x ${region.x} · y ${region.y} · ${region.width}×${region.height}`, region.x + 26, baseline, style));
    }
  }
  return parts.join('');
}

function liveBadgeBody(x, y, { width = 210, height = 54 } = {}) {
  return [
    `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="4" fill="${colors.accentSubtle}" stroke="${colors.accent}" stroke-width="2"/>`,
    `<circle cx="${x + 26}" cy="${number(y + height / 2)}" r="8" fill="${colors.accent}"/>`,
    textElement(content.liveState, x + 48, number(y + height / 2 + 8), { size: 22, family: 'IBM Plex Mono', fill: colors.accentStrong, letterSpacing: 0.1 }),
  ].join('');
}

// Ink height, not box height: the wordmark bakes in clear space, so its canvas
// is far taller than its glyphs (SIGNATURE.md). Measuring the box instead is
// what once pushed the site header logo down to a third of its intended size.
function liveSignatureInkHeight(signature, width) {
  return (signature.height - signature.padding * 2) * (width / signature.width);
}

function liveSceneSvg(scene, signature, { guide = false } = {}) {
  const cfg = content.live;
  const safe = rectSafeZone(LIVE_W, LIVE_H);
  const mono = { family: 'IBM Plex Mono', fill: colors.secondary, size: 24 };
  const body = [
    `<rect width="${LIVE_W}" height="${LIVE_H}" fill="${colors.background}"/>`,
    constructionGridSvg(LIVE_W, LIVE_H, { opacity: 0.32 }),
  ];

  if (scene.kind === 'card') {
    // No label line under the wordmark: it restated the brand name directly
    // beneath itself, and any live-state label would contradict the two scenes
    // that exist precisely because the stream is not live (05, 07).
    const sigWidth = 420;
    body.push(placedSignatureBody(signature, { x: safe.x, y: safe.y, width: sigWidth }));
    body.push(textElement(scene.headline, safe.x, 520, { size: 116, weight: 500 }));
    if (scene.support) body.push(textElement(scene.support, safe.x, 596, { size: 34, fill: colors.secondary }));
    body.push(textElement(cfg.link, safe.x, LIVE_H - safe.y, mono));
    body.push(textElement(content.descriptor, safe.x + safe.width, LIVE_H - safe.y, { ...mono, anchor: 'end' }));
  } else {
    const layout = liveLayouts[scene.kind];
    body.push(placedSignatureBody(signature, { x: 40, y: 36, width: 240 }));
    body.push(liveBadgeBody(1670, 36));
    if (layout.camera) body.push(liveMediaRegionBody(layout.camera, guide));
    if (layout.screen) body.push(liveMediaRegionBody(layout.screen, guide));
    if (layout.notes) body.push(liveMediaRegionBody(layout.notes, guide));
    // These two scenes originally reserved a bar for an OBS text source naming
    // the current topic. That turned a one-time cost into a per-stream one —
    // typing a line in the minute before going live — to state something the
    // viewer already has: the platform shows the stream title, and scene 04's
    // screen capture *is* the answer to what is being built. Replaced with
    // canonical bio copy, which is always true and never edited.
    const support = { size: 26, family: 'IBM Plex Mono', fill: colors.muted };
    const baseline = scene.kind === 'workspace' ? 1046 : 1002;
    if (scene.kind === 'workspace') {
      body.push(textElement(scene.support, 360, 80, support));
      body.push(textElement(cfg.link, 40, baseline, mono));
    } else {
      body.push(textElement(scene.support, 240, baseline, support));
    }
    body.push(textElement(content.descriptor, 1880, baseline, { ...mono, anchor: 'end' }));
  }

  return svgDocument(`Cena ao vivo — ${scene.obsName}`, LIVE_W, LIVE_H, body.join(''));
}

async function buildLiveSceneSystem({ wordmarkOnly }) {
  const cfg = content.live;
  const liveDir = path.join(root, 'live', 'obs');
  // Rebuilt like exports/ rather than merged into: the previous English scene
  // files live here under different names, and a merge would leave them on
  // disk as a second, contradictory set of backgrounds.
  fs.rmSync(liveDir, { recursive: true, force: true });
  ensureDir(path.join(liveDir, 'x'));

  const publish = async (name, svg, width, height, { transparent = false } = {}) => {
    await writeSvg(`day-1/03-live/obs/${name}.svg`, svg);
    await writePng(`day-1/03-live/obs/${name}.png`, svg, width, height, { fit: 'fill' });
    for (const ext of ['svg', 'png']) {
      fs.copyFileSync(path.join(exportsRoot, `day-1/03-live/obs/${name}.${ext}`), path.join(liveDir, `${name}.${ext}`));
    }
    return { transparent };
  };

  for (const scene of cfg.scenes) {
    if (scene.kind === 'bare') continue; // scene 02 is camera plus transparent overlays only
    const svg = liveSceneSvg(scene, wordmarkOnly);
    await publish(scene.id, svg, LIVE_W, LIVE_H);
    register({ id: scene.id, platform: 'OBS', role: `cena ao vivo — ${scene.obsName}`, relative: `day-1/03-live/obs/${scene.id}.png`, width: LIVE_W, height: LIVE_H, format: 'PNG', transparency: false, safeZone: rectSafeZone(LIVE_W, LIVE_H), usage: 'fundo de cena no OBS; não combinar com o brand bug persistente', signatureVariant: 'wordmark-only' });

    // Composed scenes ship a second copy carrying the placement coordinates.
    // Setup needs those numbers visible; broadcast must never risk showing
    // them, so they are a separate file rather than a layer to remember to
    // hide. The guide is a working aid and stays out of the manifest.
    if (scene.kind !== 'card') {
      await publish(`${scene.id}-guia`, liveSceneSvg(scene, wordmarkOnly, { guide: true }), LIVE_W, LIVE_H);
    }
  }

  // Transparent overlays. LIVE_LAUNCH_PACK.md requires a minimum 16px inset on
  // transparent assets so nothing touches a scene edge when composited.
  const selo = svgDocument('Selo ao vivo', 260, 88, liveBadgeBody(16, 17));
  await publish('overlay-selo-ao-vivo', selo, 260, 88);
  register({ id: 'overlay-selo-ao-vivo', platform: 'OBS', role: 'selo transparente de estado ao vivo', relative: 'day-1/03-live/obs/overlay-selo-ao-vivo.png', width: 260, height: 88, format: 'PNG', transparency: true, usage: 'sobrepor à câmera na cena 02; um selo por cena', signatureVariant: 'none' });

  const rodape = svgDocument('Rodapé com link', 560, 80, [
    `<rect x="16" y="20" width="4" height="40" fill="${colors.accent}"/>`,
    textElement(cfg.link, 40, 52, { size: 30, family: 'IBM Plex Mono', fill: colors.text }),
  ].join(''));
  await publish('overlay-rodape-link', rodape, 560, 80);
  register({ id: 'overlay-rodape-link', platform: 'OBS', role: 'rodapé transparente com o link da bio', relative: 'day-1/03-live/obs/overlay-rodape-link.png', width: 560, height: 80, format: 'PNG', transparency: true, usage: 'sobrepor à câmera na cena 02', signatureVariant: 'none' });

  fs.writeFileSync(path.join(liveDir, 'MONTAGEM.md'), liveAssemblyGuide());
}

function syncReferencePatternVersions() {
  const versionRoot = path.join(exportsRoot, 'day-1', '05-youtube', 'versions', 'v1-reference-pattern');
  const firstVideoRoot = path.join(versionRoot, 'first-video');
  const liveDayOneRoot = path.join(versionRoot, 'live-day-1');
  ensureDir(path.join(firstVideoRoot, 'youtube-thumbnail-1280x720.png'));
  ensureDir(path.join(liveDayOneRoot, 'live-001-youtube-thumbnail-1280x720.png'));

  fs.copyFileSync(
    path.join(exportsRoot, 'day-1', '05-youtube', 'youtube-thumbnail-1280x720.png'),
    path.join(firstVideoRoot, 'youtube-thumbnail-1280x720.png'),
  );
  fs.copyFileSync(
    path.join(exportsRoot, 'day-1', '05-youtube', 'youtube-thumbnail-master-3840x2160.png'),
    path.join(firstVideoRoot, 'youtube-thumbnail-master-3840x2160.png'),
  );
  fs.copyFileSync(
    path.join(exportsRoot, 'day-1', '05-youtube', 'live-001-youtube-thumbnail-1280x720.png'),
    path.join(liveDayOneRoot, 'live-001-youtube-thumbnail-1280x720.png'),
  );

  const readme = [
    '# YouTube Thumbnail Versions — Reference Pattern v1',
    '',
    'Esta pasta organiza as versões visuais atualizadas para comparação humana.',
    '',
    '## Organização',
    '',
    '| Pasta | Uso | Arquivo principal |',
    '| --- | --- | --- |',
    '| `first-video/` | Thumbnail do primeiro vídeo | `youtube-thumbnail-1280x720.png` |',
    '| `first-video/` | Master do primeiro vídeo | `youtube-thumbnail-master-3840x2160.png` |',
    '| `live-day-1/` | Thumbnail da live do Dia 1 | `live-001-youtube-thumbnail-1280x720.png` |',
    '',
    '## Regra de sincronização',
    '',
    'Estas são cópias organizadas dos exports canônicos. Os arquivos publicados continuam nos caminhos diretamente dentro de `day-1/05-youtube/` e permanecem como referência operacional.',
    '',
    'As três cópias desta pasta devem ser byte a byte idênticas aos respectivos exports canônicos. Não editar esta pasta isoladamente; regenerar a composição aprovada e atualizar os dois locais na mesma alteração.',
    '',
    '## Composição',
    '',
    '- padrão de referência aplicado;',
    '- tipografia atual do projeto preservada;',
    '- primeiro vídeo: foto à direita, headline `AQUI ESTÁ / O PORQUÊ.`;',
    '- live Dia 1: foto à direita, headline `CONSTRUINDO / PRODUTOS REAIS COM IA`;',
    '- nenhum novo conteúdo estratégico foi criado nesta organização.',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(versionRoot, 'README.md'), readme);
}

function syncApprovedFounderThumbnailVariants() {
  const sourceRoot = path.join(root, 'brand-assets', 'thumbnails', 'versions', 'v2-approved-founder-cutouts');
  const targetRoot = path.join(exportsRoot, 'day-1', '05-youtube', 'versions', 'v2-approved-founder-cutouts');
  if (!fs.existsSync(sourceRoot)) {
    throw new Error('Approved founder thumbnail pack is missing. Run npm run thumbnails:approved:build first.');
  }
  fs.cpSync(sourceRoot, targetRoot, { recursive: true, force: true });
}

function liveAssemblyGuide() {
  const cfg = content.live;
  const table = (regions) => [
    '| Fonte | Tipo | X | Y | Largura | Altura |',
    '| --- | --- | --- | --- | --- | --- |',
    ...Object.values(regions).map((r) => `| ${r.label} | ${r.kind} | ${r.x} | ${r.y} | ${r.width} | ${r.height} |`),
  ].join('\n');

  const sceneBlocks = cfg.scenes.map((scene) => {
    const head = `## ${scene.obsName}`;
    if (scene.kind === 'bare') {
      return [head, '', 'Sem fundo: a câmera ocupa o quadro inteiro. Só entram as sobreposições transparentes.', '', '| Fonte | Arquivo | Posição sugerida |', '| --- | --- | --- |', '| Câmera | dispositivo de captura | 0, 0 · 1920×1080 |', '| Selo ao vivo | `overlay-selo-ao-vivo.png` | 1620, 60 |', '| Identificação | `lower-third.png` | 60, 840 |', '| Link | `overlay-rodape-link.png` | 60, 950 |'].join('\n');
    }
    if (scene.kind === 'card') {
      return [head, '', `Fundo: \`${scene.id}.png\` em 0, 0 · 1920×1080. Nada a posicionar.`].join('\n');
    }
    return [head, '', `Fundo: \`${scene.id}.png\` em 0, 0 · 1920×1080. Confira as coordenadas com \`${scene.id}-guia.png\` aberto ao lado.`, '', table(liveLayouts[scene.kind])].join('\n');
  });

  return [
    `# Montagem das cenas — ${cfg.collection}`,
    '',
    'Gerado por `scripts/build-brand-assets.mjs`. Não editar à mão: as coordenadas abaixo vêm das mesmas constantes que desenham as molduras, então um valor digitado aqui deixaria de bater com a imagem.',
    '',
    'Os arquivos desta pasta espelham `brand-assets/exports/day-1/03-live/obs/`. Depois de mudar a copy em `brand-assets/sources/content.json`, rode `npm run brand-assets:build` — nunca edite um export diretamente.',
    '',
    '## Como funciona',
    '',
    'Cada cena tem um fundo e um conjunto de fontes. As molduras desenhadas no fundo ficam **fora** da área da fonte: se a câmera está no lugar certo, a moldura continua visível ao redor dela.',
    '',
    '**Nenhuma cena pede texto digitado antes de entrar no ar.** Toda a copy é fixa e já está nas imagens. O tema da transmissão fica no título da live, que a plataforma exibe ao lado do player, e a cena 04 mostra o que está sendo construído na própria captura de tela.',
    '',
    'Arquivos terminados em `-guia` mostram as coordenadas sobre a própria arte. Use para montar e depois troque pelo arquivo sem sufixo. Nunca deixe um `-guia` no ar.',
    '',
    sceneBlocks.join('\n\n'),
    '',
    '## Sobreposições reutilizáveis',
    '',
    '| Arquivo | Tamanho | Uso |',
    '| --- | --- | --- |',
    '| `brand-bug.png` | 480×96 | marca discreta de canto; não usar junto de cena que já traz a assinatura |',
    '| `lower-third.png` | 960×160 | identificação |',
    '| `overlay-selo-ao-vivo.png` | 260×88 | estado ao vivo sobre a câmera |',
    '| `overlay-rodape-link.png` | 560×80 | link da bio sobre a câmera |',
    '',
  ].join('\n');
}

async function main() {
  fs.rmSync(exportsRoot, { recursive: true, force: true });
  fs.rmSync(publicExportsRoot, { recursive: true, force: true });
  ensureDir(path.join(exportsRoot, 'README.md'));
  const exportReadme = [
    '# Leo Ferraz Day-1 exports',
    '',
    'Use this directory as the operational handoff. Sources live in brand-assets/sources/; generated files must not be edited manually.',
    '',
    '## Quick map',
    '',
    '- Primary lockup: day-1/01-profile/leo-ferraz-primary-lockup.svg',
    '- Wordmark only: day-1/01-profile/leo-ferraz-wordmark-only.svg',
    '- Descriptor lockup: day-1/01-profile/leo-ferraz-descriptor-lockup.svg',
    '- Institutional lockup: day-1/01-profile/leo-ferraz-institutional-lockup.svg',
    '- Primary symbol: day-1/01-profile/leo-ferraz-symbol.svg',
    '- Avatar: day-1/01-profile/avatar-1024.png',
    '- YouTube banner: day-1/02-channels/youtube-banner-2560x1440.png',
    '- Twitch banner: day-1/02-channels/twitch-banner-1200x480.png',
    '- YouTube thumbnail: day-1/05-youtube/youtube-thumbnail-1280x720.png',
    '- First demonstrative live example: day-1/05-youtube/live-001-youtube-thumbnail-1280x720.png',
    '- Organized thumbnail comparisons: day-1/05-youtube/versions/v1-reference-pattern/',
    '- Approved founder cutout variants: day-1/05-youtube/versions/v2-approved-founder-cutouts/',
    '- Instagram carousel: day-1/04-social/instagram-carousel-cover-1080x1350.png',
    '- Instagram Story/Reels: day-1/04-social/instagram-story-reels-1080x1920.png',
    '- OBS scenes: day-1/03-live/obs/',
    '- Favicon: day-1/06-web/favicon.svg or the root public/favicon.* copies',
    '- Open Graph: day-1/06-web/open-graph-1200x630.png',
    '',
    'Safe zones are applied in the generator and recorded per asset in brand-assets/manifest.json.',
    'Delivery exports contain no visible safe-area guides.',
    '',
    '## Generate',
    '',
    'npm run brand-assets:build',
    'npm run brand-assets:validate',
    'npm run brand:render -- --template youtube-thumbnail --content live-001',
    '',
    'The render command supports youtube-thumbnail, instagram-carousel, instagram-story, and social-square. Content lives in brand-assets/sources/content/.',
  ].join('\\n') + '\\n';
  fs.writeFileSync(path.join(exportsRoot, 'README.md'), exportReadme);

  if (content.signatureSymbol !== 'constructed-lf') throw new Error('Unsupported signature symbol source.');
  const primaryLockup = hybridLogoSvg('Leo Ferraz primary lockup', [{ text: content.brand, size: 58, tracking: -0.035 }], { underline: true });
  const primaryLockupDark = hybridLogoSvg('Leo Ferraz primary lockup dark', [{ text: content.brand, size: 58, tracking: -0.035 }], { primary: colors.background, accent: colors.background, monochrome: true, underline: true });
  const wordmarkOnly = wordmarkOnlySvg('Leo Ferraz wordmark only');
  const wordmarkOnlyDark = wordmarkOnlySvg('Leo Ferraz wordmark only dark', { primary: colors.background });
  const wordmarkUnderline = primaryLockup;
  const wordmarkUnderlineDark = primaryLockupDark;
  const descriptor = hybridLogoSvg('Leo Ferraz descriptor lockup', [
    { text: content.brand, size: 58, tracking: -0.035 },
    { text: content.descriptor, size: 18, tracking: 0, fill: colors.secondary },
  ], { underline: true });
  // Name-led signature: wordmark plus descriptor, no symbol. The lower third
  // sits over live camera footage, where the symbol read as a second mark
  // competing with the corner brand bug instead of supporting the name.
  const descriptorWordmark = hybridLogoSvg('Leo Ferraz descriptor wordmark', [
    { text: content.brand, size: 58, tracking: -0.035 },
    { text: content.descriptor, size: 18, tracking: 0, fill: colors.secondary },
  ], { underline: true, showSymbol: false });
  // The descriptor runs at 28 here, not the system's 18. Matching the wordmark's
  // width at 18 would demand 0.50em of tracking — half an em between letters,
  // which stops reading as a word. At 28 the same match needs about 0.15em,
  // ordinary spacing for a letterspaced subtitle. Confined to this one asset so
  // the descriptor keeps its normal size everywhere else in the system.
  const descriptorWordmarkJustified = hybridLogoSvg('Leo Ferraz descriptor wordmark justified', [
    { text: content.brand, size: 58, tracking: -0.035 },
    { text: content.descriptor, size: 28, tracking: 0, fill: colors.secondary },
  ], { underline: true, showSymbol: false, align: 'center', justify: true });
  const institutional = hybridLogoSvg('Leo Ferraz institutional lockup', [
    { text: content.brand, size: 58, tracking: -0.035 },
    { text: content.descriptor, size: 18, tracking: 0, fill: colors.secondary },
    { text: content.category, size: 14, tracking: 0, fill: colors.experimental },
  ], { underline: true });
  const symbol = { width: 80, height: 80, padding: 8, svg: svgDocument('Constructed LF primary symbol', 80, 80, constructedLfSymbolSvg({ x: 8, y: 8, size: 64 })) };
  const symbolDark = { width: 80, height: 80, padding: 8, svg: svgDocument('Constructed LF primary symbol dark', 80, 80, constructedLfSymbolSvg({ x: 8, y: 8, size: 64, primary: colors.background, accent: colors.background, monochrome: true })) };
  primaryLockup.variant = 'primary-lockup';
  primaryLockupDark.variant = 'primary-lockup';
  wordmarkOnly.variant = 'wordmark-only';
  wordmarkOnlyDark.variant = 'wordmark-only';
  descriptor.variant = 'descriptor-lockup';
  descriptorWordmark.variant = 'descriptor-wordmark';
  descriptorWordmarkJustified.variant = 'descriptor-wordmark';
  institutional.variant = 'institutional-lockup';
  symbol.variant = 'primary-symbol';
  symbolDark.variant = 'primary-symbol';

  const profileSvgs = [
    ['leo-ferraz-primary-lockup.svg', primaryLockup, 'primary lockup', 'Constructed LF + Leo Ferraz'],
    ['leo-ferraz-primary-lockup-dark.svg', primaryLockupDark, 'primary lockup', 'Constructed LF + Leo Ferraz on light backgrounds'],
    ['leo-ferraz-wordmark-only.svg', wordmarkOnly, 'wordmark-only', 'Leo Ferraz without the symbol'],
    ['leo-ferraz-wordmark-only-dark.svg', wordmarkOnlyDark, 'wordmark-only', 'Leo Ferraz without the symbol on light backgrounds'],
    ['leo-ferraz-descriptor-lockup.svg', descriptor, 'descriptor lockup', 'Constructed LF + Leo Ferraz + Building with AI'],
    ['leo-ferraz-institutional-lockup.svg', institutional, 'institutional lockup', 'Constructed LF + Leo Ferraz + Building with AI + AI-Native Product Lab'],
    ['leo-ferraz-symbol.svg', symbol, 'primary symbol', 'avatar, favicon and compact contexts'],
    ['leo-ferraz-symbol-dark.svg', symbolDark, 'primary symbol', 'compact contexts on light backgrounds'],
    ['leo-ferraz-wordmark.svg', primaryLockup, 'legacy compatibility alias', 'legacy alias for leo-ferraz-primary-lockup.svg'],
    ['leo-ferraz-wordmark-dark.svg', primaryLockupDark, 'legacy compatibility alias', 'legacy alias for leo-ferraz-primary-lockup-dark.svg'],
    ['leo-ferraz-logo-horizontal.svg', primaryLockup, 'legacy compatibility alias', 'legacy alias for leo-ferraz-primary-lockup.svg'],
    ['leo-ferraz-logo-horizontal-dark.svg', primaryLockupDark, 'legacy compatibility alias', 'legacy alias for leo-ferraz-primary-lockup-dark.svg'],
    ['leo-ferraz-wordmark-underline.svg', wordmarkUnderline, 'legacy compatibility alias', 'legacy alias for leo-ferraz-primary-lockup.svg'],
    ['leo-ferraz-wordmark-underline-dark.svg', wordmarkUnderlineDark, 'legacy compatibility alias', 'legacy alias for leo-ferraz-primary-lockup-dark.svg'],
    ['leo-ferraz-building-with-ai.svg', descriptor, 'legacy compatibility alias', 'legacy alias for leo-ferraz-descriptor-lockup.svg'],
    ['leo-ferraz-institutional.svg', institutional, 'legacy compatibility alias', 'legacy alias for leo-ferraz-institutional-lockup.svg'],
    ['leo-ferraz-lf.svg', symbol, 'legacy compatibility alias', 'compatibility path; content is the Constructed LF symbol'],
    ['leo-ferraz-lf-dark.svg', symbolDark, 'legacy compatibility alias', 'compatibility path; content is the Constructed LF symbol'],
  ];
  for (const [name, asset, role, usage] of profileSvgs) {
    await writeSvg(`day-1/01-profile/${name}`, asset.svg);
    register({ id: name.replace('.svg', ''), platform: 'all', role, relative: `day-1/01-profile/${name}`, width: asset.width, height: asset.height, format: 'SVG', transparency: true, usage, signatureVariant: asset.variant });
  }
  for (const size of [512, 1024, 2048]) {
    await writePng(`day-1/01-profile/leo-ferraz-wordmark-only-${size}.png`, wordmarkOnly.svg, size, Math.ceil(size * wordmarkOnly.height / wordmarkOnly.width));
    register({ id: `leo-ferraz-wordmark-only-${size}`, platform: 'all', role: 'wordmark-only export', relative: `day-1/01-profile/leo-ferraz-wordmark-only-${size}.png`, width: size, height: Math.ceil(size * wordmarkOnly.height / wordmarkOnly.width), format: 'PNG', transparency: true, usage: 'upload or composition; name-only signature', signatureVariant: 'wordmark-only' });
    await writePng(`day-1/01-profile/leo-ferraz-wordmark-only-dark-${size}.png`, wordmarkOnlyDark.svg, size, Math.ceil(size * wordmarkOnlyDark.height / wordmarkOnlyDark.width));
    register({ id: `leo-ferraz-wordmark-only-dark-${size}`, platform: 'all', role: 'wordmark-only export', relative: `day-1/01-profile/leo-ferraz-wordmark-only-dark-${size}.png`, width: size, height: Math.ceil(size * wordmarkOnlyDark.height / wordmarkOnlyDark.width), format: 'PNG', transparency: true, usage: 'upload or composition; name-only signature on light backgrounds', signatureVariant: 'wordmark-only' });
    await writePng(`day-1/01-profile/leo-ferraz-wordmark-${size}.png`, primaryLockup.svg, size, Math.ceil(size * primaryLockup.height / primaryLockup.width));
    register({ id: `leo-ferraz-wordmark-${size}`, platform: 'all', role: 'legacy compatibility alias', relative: `day-1/01-profile/leo-ferraz-wordmark-${size}.png`, width: size, height: Math.ceil(size * primaryLockup.height / primaryLockup.width), format: 'PNG', transparency: true, usage: 'legacy alias for leo-ferraz-primary-lockup.svg', signatureVariant: 'primary-lockup' });
    await writePng(`day-1/01-profile/leo-ferraz-wordmark-underline-${size}.png`, wordmarkUnderline.svg, size, Math.ceil(size * wordmarkUnderline.height / wordmarkUnderline.width));
    register({ id: `leo-ferraz-wordmark-underline-${size}`, platform: 'all', role: 'legacy compatibility alias', relative: `day-1/01-profile/leo-ferraz-wordmark-underline-${size}.png`, width: size, height: Math.ceil(size * wordmarkUnderline.height / wordmarkUnderline.width), format: 'PNG', transparency: true, usage: 'legacy alias for leo-ferraz-primary-lockup.svg', signatureVariant: 'primary-lockup' });
  }

  const avatar = svgDocument('Constructed LF avatar', 1024, 1024, [
    `<rect width="1024" height="1024" fill="${colors.background}"/>`,
    constructedLfSymbolSvg({ x: 232, y: 232, size: 560 }),
  ].join(''));
  const avatarCircle = svgDocument('Constructed LF circular crop validation', 1024, 1024, [
    `<circle cx="512" cy="512" r="512" fill="${colors.background}"/>`,
    constructedLfSymbolSvg({ x: 232, y: 232, size: 560 }),
  ].join(''));
  await writeSvg('day-1/01-profile/avatar-square.svg', avatar);
  await writeSvg('day-1/01-profile/avatar-circle.svg', avatarCircle);
  register({ id: 'avatar-square-master', platform: 'all', role: 'avatar', relative: 'day-1/01-profile/avatar-square.svg', width: 1024, height: 1024, format: 'SVG', transparency: false, usage: 'profile avatar master', signatureVariant: 'primary-symbol' });
  register({ id: 'avatar-circle-validation', platform: 'all', role: 'crop validation', relative: 'day-1/01-profile/avatar-circle.svg', width: 1024, height: 1024, format: 'SVG', transparency: true, usage: 'circle crop validation only', signatureVariant: 'primary-symbol' });
  for (const size of [16, 32, 48, 64, 128, 256, 512, 1024]) {
    const relative = `day-1/01-profile/avatar-${size}.png`;
    await writePng(relative, avatar, size, size, { fit: 'fill' });
    register({ id: `avatar-${size}`, platform: 'all', role: 'avatar export', relative, width: size, height: size, format: 'PNG', transparency: false, usage: 'profile upload or small-size validation', signatureVariant: 'primary-symbol' });
  }
  await writePng('day-1/01-profile/avatar-circle-1024.png', avatarCircle, 1024, 1024, { fit: 'fill' });
  register({ id: 'avatar-circle-1024', platform: 'all', role: 'circular crop validation', relative: 'day-1/01-profile/avatar-circle-1024.png', width: 1024, height: 1024, format: 'PNG', transparency: true, usage: 'platform crop validation', signatureVariant: 'primary-symbol' });

  const favicon = svgDocument('Constructed LF favicon', 48, 48, [
    `<rect width="48" height="48" fill="${colors.background}"/>`,
    constructedLfSymbolSvg({ x: 8, y: 8, size: 32 }),
  ].join(''));
  await writeSvg('day-1/06-web/favicon.svg', favicon);
  copyPublic('favicon.svg', Buffer.from(favicon));
  const faviconImages = [];
  for (const size of [16, 32, 48]) {
    const buffer = await writePng(`day-1/06-web/favicon-${size}x${size}.png`, favicon, size, size, { fit: 'fill' });
    faviconImages.push({ size, buffer });
    copyPublic(`favicon-${size}x${size}.png`, buffer);
    register({ id: `favicon-${size}`, platform: 'web', role: 'favicon', relative: `day-1/06-web/favicon-${size}x${size}.png`, width: size, height: size, format: 'PNG', transparency: false, usage: 'browser favicon', signatureVariant: 'primary-symbol' });
  }
  const ico = createIco(faviconImages);
  await writeBuffer('day-1/06-web/favicon.ico', ico);
  copyPublic('favicon.ico', ico);
  register({ id: 'favicon-ico', platform: 'web', role: 'favicon', relative: 'day-1/06-web/favicon.ico', width: 48, height: 48, format: 'ICO', transparency: false, usage: 'legacy browser favicon', signatureVariant: 'primary-symbol' });
  const apple = await writePng('day-1/06-web/apple-touch-icon.png', favicon, 180, 180, { fit: 'fill' });
  const icon192 = await writePng('day-1/06-web/icon-192.png', favicon, 192, 192, { fit: 'fill' });
  const icon512 = await writePng('day-1/06-web/icon-512.png', favicon, 512, 512, { fit: 'fill' });
  copyPublic('apple-touch-icon.png', apple);
  copyPublic('icon-192.png', icon192);
  copyPublic('icon-512.png', icon512);
  for (const [id, size, file] of [['apple-touch-icon', 180, 'apple-touch-icon.png'], ['icon-192', 192, 'icon-192.png'], ['icon-512', 512, 'icon-512.png']]) register({ id, platform: 'web', role: id === 'apple-touch-icon' ? 'apple touch icon' : 'web app icon', relative: `day-1/06-web/${file}`, width: size, height: size, format: 'PNG', transparency: false, usage: 'web installation or shortcut', signatureVariant: 'primary-symbol' });
  const manifestJson = JSON.stringify({ name: 'Leo Ferraz — Building with AI', short_name: 'Leo Ferraz', start_url: '/', display: 'standalone', background_color: colors.background, theme_color: colors.background, icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }] }, null, 2) + '\n';
  await writeBuffer('day-1/06-web/site.webmanifest', Buffer.from(manifestJson));
  copyPublic('site.webmanifest', Buffer.from(manifestJson));
  register({ id: 'site-webmanifest', platform: 'web', role: 'manifest', relative: 'day-1/06-web/site.webmanifest', width: 0, height: 0, format: 'JSON', transparency: false, usage: 'web app metadata' });

  const youtubeBanner = channelBannerSvg('YouTube channel banner · 2560×1440', 2560, 1440, { safeX: 508, safeY: 508, safeWidth: 1544, safeHeight: 423, signatureAsset: descriptorWordmarkJustified, justifyMetadata: true, signatureFill: 0.38 });
  const twitchBanner = channelBannerSvg('Twitch profile banner · 1200×480', 1200, 480, { safeX: 48, safeY: 48, safeWidth: 1050, safeHeight: 300, signatureAsset: descriptorWordmark, signatureScaleFrom: descriptor, leftAligned: true });
  const channelAssets = [
    ['day-1/02-channels/youtube-banner-2560x1440', youtubeBanner, 2560, 1440, 'YouTube channel banner'],
    ['day-1/02-channels/twitch-banner-1200x480', twitchBanner, 1200, 480, 'Twitch profile banner'],
  ];
  for (const [base, svg, width, height, role] of channelAssets) {
    await writeSvg(`${base}.svg`, svg);
    await writePng(`${base}.png`, svg, width, height, { fit: 'fill' });
    const safeZone = role.startsWith('YouTube')
      ? { type: 'rect', x: 508, y: 508, width: 1544, height: 423 }
      : { type: 'rect', x: 48, y: 48, width: 1050, height: 300 };
    register({ id: path.basename(base), platform: role.startsWith('YouTube') ? 'YouTube' : 'Twitch', role, relative: `${base}.svg`, width, height, format: 'SVG', transparency: false, safeZone, usage: 'channel upload source', signatureVariant: 'descriptor-wordmark' });
    register({ id: `${path.basename(base)}-png`, platform: role.startsWith('YouTube') ? 'YouTube' : 'Twitch', role, relative: `${base}.png`, width, height, format: 'PNG', transparency: false, safeZone, usage: 'channel upload', signatureVariant: 'descriptor-wordmark' });
  }

  const socialSpecs = [
    ['day-1/04-social/instagram-carousel-cover-1080x1350', 1080, 1350, 'Instagram carousel/feed cover', 'BUILDING WITH AI', wordmarkOnly],
    ['day-1/04-social/instagram-story-reels-1080x1920', 1080, 1920, 'Instagram Story/Reels cover', 'AO VIVO', symbol],
    ['day-1/05-youtube/youtube-thumbnail-1280x720', 1280, 720, 'YouTube thumbnail template', 'BUILDING WITH AI', symbol],
    ['day-1/05-youtube/youtube-thumbnail-master-3840x2160', 3840, 2160, 'YouTube thumbnail master', 'BUILDING WITH AI', symbol],
    ['day-1/04-social/instagram-reels-cover-420x654', 420, 654, 'Instagram Reels cover crop', 'AO VIVO', symbol],
    ['day-1/04-social/social-square-1080x1080', 1080, 1080, 'Social square template', content.liveExample, wordmarkOnly, { headlineSize: 64 }],
    ['day-1/06-web/open-graph-1200x630', 1200, 630, 'Open Graph default', content.bio[0], descriptor, { artifact: content.bio[1], headlineSize: 42, showState: false, showDescriptor: false }],
  ];
  for (const [base, width, height, role, headline, signatureAsset, options = {}] of socialSpecs) {
    const safeZone = socialSafeZone(role, width, height);
    const svg = socialSvg(role, width, height, { label: role.toUpperCase(), headline, signatureAsset, state: content.liveState, safeZone, ...options });
    await writeSvg(`${base}.svg`, svg);
    await writePng(`${base}.png`, svg, width, height, { fit: 'fill' });
    register({ id: path.basename(base), platform: role.startsWith('Instagram') ? 'Instagram' : role.startsWith('YouTube') ? 'YouTube' : 'web/social', role, relative: `${base}.svg`, width, height, format: 'SVG', transparency: false, safeZone, usage: 'editable template source', signatureVariant: signatureAsset.variant });
    register({ id: `${path.basename(base)}-png`, platform: role.startsWith('Instagram') ? 'Instagram' : role.startsWith('YouTube') ? 'YouTube' : 'web/social', role, relative: `${base}.png`, width, height, format: 'PNG', transparency: false, safeZone, usage: 'upload/publication export', signatureVariant: signatureAsset.variant, pixelSafeZoneAudit: !['day-1/05-youtube/youtube-thumbnail-1280x720', 'day-1/05-youtube/youtube-thumbnail-master-3840x2160'].includes(base) });
  }
  const liveExampleSafeZone = socialSafeZone('YouTube thumbnail', 1280, 720);
  const liveExample = socialSvg('Live example thumbnail', 1280, 720, { label: 'AO VIVO · EXAMPLE', headline: content.liveExample, signatureAsset: symbol, state: content.liveState, safeZone: liveExampleSafeZone });
  await writeSvg('day-1/05-youtube/live-001-youtube-thumbnail-1280x720.svg', liveExample);
  await writePng('day-1/05-youtube/live-001-youtube-thumbnail-1280x720.png', liveExample, 1280, 720, { fit: 'fill' });
  register({ id: 'live-001-youtube-thumbnail', platform: 'YouTube', role: 'first demonstrative live thumbnail', relative: 'day-1/05-youtube/live-001-youtube-thumbnail-1280x720.png', width: 1280, height: 720, format: 'PNG', transparency: false, safeZone: liveExampleSafeZone, usage: 'clearly demonstrative example only', signatureVariant: 'primary-symbol', pixelSafeZoneAudit: false });

  // Publication exports for the first video and Day-1 live use the approved
  // reference-pattern compositions generated by their dedicated renderers.
  // Keep these copies synchronized here because this build runs before every
  // Astro build and must not silently restore the old vector placeholders.
  const approvedFirstVideo = path.join(root, 'videos', 'v2', 'youtube-horizontal', 'thumb_v2.png');
  const approvedLiveDayOne = path.join(root, 'brand-assets', 'thumbnails', 'live_1.png');
  if (!fs.existsSync(approvedFirstVideo) || !fs.existsSync(approvedLiveDayOne)) {
    throw new Error('Approved reference-pattern thumbnail source is missing. Run npm run thumbnail:build and npm run live-covers:build first.');
  }
  await writeBuffer('day-1/05-youtube/youtube-thumbnail-1280x720.png', fs.readFileSync(approvedFirstVideo));
  const approvedFirstVideoMaster = await sharp(approvedFirstVideo)
    .resize(3840, 2160, { fit: 'fill' })
    .png({ compressionLevel: 9 })
    .toBuffer();
  await writeBuffer('day-1/05-youtube/youtube-thumbnail-master-3840x2160.png', approvedFirstVideoMaster);
  await writeBuffer('day-1/05-youtube/live-001-youtube-thumbnail-1280x720.png', fs.readFileSync(approvedLiveDayOne));
  syncReferencePatternVersions();
  syncApprovedFounderThumbnailVariants();
  const ogPng = fs.readFileSync(path.join(exportsRoot, 'day-1/06-web/open-graph-1200x630.png'));
  copyPublic('brand-assets/exports/day-1/06-web/open-graph-1200x630.png', ogPng);

  await buildLiveSceneSystem({ wordmarkOnly });
  const bugSvg = svgDocument('Leo Ferraz live brand bug', 480, 96, placedSignatureBody(symbol, { x: 16, y: 8, width: 80 }));
  await writeSvg('day-1/03-live/brand-bug.svg', bugSvg);
  await writePng('day-1/03-live/brand-bug.png', bugSvg, 480, 96, { fit: 'fill' });
  ensureDir(path.join(root, 'live', 'obs', 'brand-bug.png'));
  fs.copyFileSync(path.join(exportsRoot, 'day-1/03-live/brand-bug.png'), path.join(root, 'live', 'obs', 'brand-bug.png'));
  fs.copyFileSync(path.join(exportsRoot, 'day-1/03-live/brand-bug.svg'), path.join(root, 'live', 'obs', 'brand-bug.svg'));
  register({ id: 'brand-bug', platform: 'OBS', role: 'transparent corner brand bug', relative: 'day-1/03-live/brand-bug.png', width: 480, height: 96, format: 'PNG', transparency: true, usage: 'persistent compact corner marker; do not combine with a complete scene signature', signatureVariant: 'primary-symbol' });
  // Derived, not re-measured by hand: dropping the symbol narrows the asset,
  // so reusing 430 would have scaled the remaining text up. Holding the old
  // scale keeps the wordmark rendering at exactly the size it had before.
  const lowerThirdScale = 430 / descriptor.width;
  const lowerSvg = svgDocument('Leo Ferraz lower third', 960, 160, placedSignatureBody(descriptorWordmark, { x: 24, y: 4, width: number(descriptorWordmark.width * lowerThirdScale) }));
  await writeSvg('day-1/03-live/lower-third.svg', lowerSvg);
  await writePng('day-1/03-live/lower-third.png', lowerSvg, 960, 160, { fit: 'fill' });
  ensureDir(path.join(root, 'live', 'obs', 'lower-third.png'));
  fs.copyFileSync(path.join(exportsRoot, 'day-1/03-live/lower-third.png'), path.join(root, 'live', 'obs', 'lower-third.png'));
  fs.copyFileSync(path.join(exportsRoot, 'day-1/03-live/lower-third.svg'), path.join(root, 'live', 'obs', 'lower-third.svg'));
  register({ id: 'lower-third', platform: 'OBS', role: 'transparent lower third', relative: 'day-1/03-live/lower-third.png', width: 960, height: 160, format: 'PNG', transparency: true, usage: 'static OBS overlay', signatureVariant: 'descriptor-wordmark' });

  fs.writeFileSync(path.join(root, 'brand-assets', 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  const hashInput = manifest.assets.map((asset) => asset.export_path).sort().map((relative) => `${relative}:${createHash('sha256').update(fs.readFileSync(path.join(root, relative))).digest('hex')}`).join('\n');
  fs.writeFileSync(path.join(root, 'brand-assets', 'deterministic.sha256'), `${createHash('sha256').update(hashInput).digest('hex')}\n`);
  console.log(`Generated ${manifest.assets.length} assets.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
