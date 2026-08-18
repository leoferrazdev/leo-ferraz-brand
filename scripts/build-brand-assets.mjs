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

function hybridLogoSvg(title, lines, { primary = colors.text, accent = colors.accent, monochrome = false, background = null, padding = 32, symbolSize = 64, symbolGap = 16, lineGap = 8, underline = false } = {}) {
  const normalized = lines.map((line, index) => {
    const fontFace = index === 0 ? signatureFont : font;
    return { ...line, fontFace, fill: line.fill ?? primary, width: measureText(line.text, line.size, line.tracking ?? 0, fontFace) };
  });
  const lineHeight = (size) => number(size * 1.18);
  const contentHeight = normalized.reduce((sum, line) => sum + lineHeight(line.size), lineGap * Math.max(0, normalized.length - 1)) + (underline ? 4 : 0);
  const width = Math.ceil(padding * 2 + symbolSize + symbolGap + Math.max(...normalized.map((line) => line.width)));
  const height = Math.ceil(padding * 2 + Math.max(symbolSize, contentHeight));
  const contentX = padding + symbolSize + symbolGap;
  let top = padding + (Math.max(symbolSize, contentHeight) - contentHeight) / 2;
  let firstBaseline = 0;
  const paths = normalized.map((line, index) => {
    const baseline = top + line.fontFace.ascent * fontScale(line.size, line.fontFace);
    if (index === 0) firstBaseline = baseline;
    const result = outlinedText(line.text, { ...line, x: contentX, baseline, fill: monochrome ? primary : line.fill });
    top += lineHeight(line.size) + lineGap;
    return result;
  }).join('');
  const capHeight = signatureFont.capHeight ?? signatureFont.ascent * 0.7;
  const symbolOpticalInset = symbolSize * 8 / 64;
  const symbolY = number(firstBaseline - capHeight * fontScale(normalized[0].size, signatureFont) - symbolOpticalInset);
  const underlineWidth = normalized[0].width;
  const underlineY = number(firstBaseline + 8);
  const underlineSvg = underline ? [
    `<rect data-accent="underline-line" x="${contentX}" y="${underlineY}" width="${underlineWidth}" height="2" fill="${colors.accent}"/>`,
    `<rect data-accent="underline-terminal" x="${number(contentX + underlineWidth - 8)}" y="${underlineY}" width="8" height="2" fill="${colors.accentStrong}"/>`,
  ].join('') : '';
  const body = `${constructedLfSymbolSvg({ x: padding, y: symbolY, size: symbolSize, primary, accent, monochrome })}${paths}${underlineSvg}`;
  return { width, height, svg: svgDocument(title, width, height, body, { background }) };
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
  return { width: Math.ceil(padding * 2 + wordmarkWidth), height, svg: svgDocument(title, Math.ceil(padding * 2 + wordmarkWidth), height, body) };
}

function placedSignatureBody(asset, { x, y, width, anchor = 'start' }) {
  const scale = width / asset.width;
  const left = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x;
  return `<g data-signature-variant="${asset.variant}" transform="translate(${number(left)} ${number(y)}) scale(${number(scale)})">${outlinedBody(asset.svg)}</g>`;
}

function svgDocument(title, width, height, body, { background = null } = {}) {
  const bg = background ? `<rect width="${width}" height="${height}" fill="${background}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-labelledby="title"><title id="title">${escapeXml(title)}</title>${bg}${body}</svg>`;
}

function textElement(text, x, y, { size = 28, fill = colors.text, family = 'IBM Plex Sans', weight = 500, anchor = 'start', letterSpacing = 0 } = {}) {
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-size="${size}px" font-weight="${weight}" text-anchor="${anchor}" letter-spacing="${letterSpacing}em">${escapeXml(text)}</text>`;
}

function socialSvg(title, width, height, { label, headline, signatureAsset, artifact = content.artifact, state = 'CONTENT SLOT', headlineSize = null, showState = true, showDescriptor = true, safeZone = null } = {}) {
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
    mark,
    textElement(label, contentX, labelY, { size: Math.max(14, Math.round(width * 0.016)), family: 'IBM Plex Mono', fill: colors.accent, letterSpacing: 0.075 }),
    textElement(headline, contentX, headlineY, { size: headlineSize ?? Math.max(30, Math.round(width * 0.07)), weight: 500 }),
    textElement(artifact, contentX, artifactY, { size: Math.max(16, Math.round(width * 0.022)), family: 'IBM Plex Mono', fill: colors.secondary, letterSpacing: 0.01 }),
    showState ? textElement(state, contentX, stateY, { size: Math.max(14, Math.round(width * 0.016)), family: 'IBM Plex Mono', fill: colors.experimental, letterSpacing: 0.075 }) : '',
    showDescriptor ? textElement(content.descriptor, contentRight, descriptorY, { size: Math.max(14, Math.round(width * 0.016)), family: 'IBM Plex Mono', fill: colors.secondary, anchor: 'end' }) : '',
  ].join('');
  return svgDocument(title, width, height, body, { background: colors.background });
}

function channelBannerSvg(title, width, height, { safeX, safeY, safeWidth, safeHeight, signatureAsset, leftAligned = false } = {}) {
  const x = leftAligned ? 72 : safeX + safeWidth / 2;
  const anchor = leftAligned ? 'start' : 'middle';
  const signatureWidth = Math.min(520, Math.round(safeWidth * 0.52));
  const signatureHeight = signatureAsset.height * signatureWidth / signatureAsset.width;
  const signatureY = safeY + Math.max(10, Math.round((safeHeight - signatureHeight - 50) / 2));
  const signature = placedSignatureBody(signatureAsset, { x, y: signatureY, width: signatureWidth, anchor });
  const metadataY = signatureY + signatureHeight + 32;
  const body = [
    signature,
    textElement(content.bio[1], x, metadataY, { size: 22, family: 'IBM Plex Mono', fill: colors.muted, anchor }),
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

function register({ id, platform, role, relative, width, height, format, transparency, usage, signatureVariant = 'none', safeZone = defaultSafeZone({ role, width, height, transparency }), source = 'brand-assets/sources/content.json + scripts/build-brand-assets.mjs', status = 'approved' }) {
  manifest.assets.push({ id, platform, role, signature_variant: signatureVariant, width, height, dimensions: `${width}x${height}`, format, source_template: source, background: transparency ? 'transparent' : colors.background, transparency, safe_zone: safeZone, usage, export_path: `brand-assets/exports/${relative}`, status });
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
  const institutional = hybridLogoSvg('Leo Ferraz institutional lockup', [
    { text: content.brand, size: 58, tracking: -0.035 },
    { text: content.descriptor, size: 18, tracking: 0, fill: colors.secondary },
    { text: content.category, size: 14, tracking: 0, fill: colors.experimental },
  ], { underline: true });
  const symbol = { width: 80, height: 80, svg: svgDocument('Constructed LF primary symbol', 80, 80, constructedLfSymbolSvg({ x: 8, y: 8, size: 64 })) };
  const symbolDark = { width: 80, height: 80, svg: svgDocument('Constructed LF primary symbol dark', 80, 80, constructedLfSymbolSvg({ x: 8, y: 8, size: 64, primary: colors.background, accent: colors.background, monochrome: true })) };
  primaryLockup.variant = 'primary-lockup';
  primaryLockupDark.variant = 'primary-lockup';
  wordmarkOnly.variant = 'wordmark-only';
  wordmarkOnlyDark.variant = 'wordmark-only';
  descriptor.variant = 'descriptor-lockup';
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

  const youtubeBanner = channelBannerSvg('YouTube channel banner · 2560×1440', 2560, 1440, { safeX: 508, safeY: 508, safeWidth: 1544, safeHeight: 423, signatureAsset: descriptor });
  const twitchBanner = channelBannerSvg('Twitch profile banner · 1200×480', 1200, 480, { safeX: 48, safeY: 48, safeWidth: 1050, safeHeight: 300, signatureAsset: descriptor, leftAligned: true });
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
    register({ id: path.basename(base), platform: role.startsWith('YouTube') ? 'YouTube' : 'Twitch', role, relative: `${base}.svg`, width, height, format: 'SVG', transparency: false, safeZone, usage: 'channel upload source', signatureVariant: 'descriptor-lockup' });
    register({ id: `${path.basename(base)}-png`, platform: role.startsWith('YouTube') ? 'YouTube' : 'Twitch', role, relative: `${base}.png`, width, height, format: 'PNG', transparency: false, safeZone, usage: 'channel upload', signatureVariant: 'descriptor-lockup' });
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
    register({ id: `${path.basename(base)}-png`, platform: role.startsWith('Instagram') ? 'Instagram' : role.startsWith('YouTube') ? 'YouTube' : 'web/social', role, relative: `${base}.png`, width, height, format: 'PNG', transparency: false, safeZone, usage: 'upload/publication export', signatureVariant: signatureAsset.variant });
  }
  const liveExampleSafeZone = socialSafeZone('YouTube thumbnail', 1280, 720);
  const liveExample = socialSvg('Live example thumbnail', 1280, 720, { label: 'AO VIVO · EXAMPLE', headline: content.liveExample, signatureAsset: symbol, state: content.liveState, safeZone: liveExampleSafeZone });
  await writeSvg('day-1/05-youtube/live-001-youtube-thumbnail-1280x720.svg', liveExample);
  await writePng('day-1/05-youtube/live-001-youtube-thumbnail-1280x720.png', liveExample, 1280, 720, { fit: 'fill' });
  register({ id: 'live-001-youtube-thumbnail', platform: 'YouTube', role: 'first demonstrative live thumbnail', relative: 'day-1/05-youtube/live-001-youtube-thumbnail-1280x720.png', width: 1280, height: 720, format: 'PNG', transparency: false, safeZone: liveExampleSafeZone, usage: 'clearly demonstrative example only', signatureVariant: 'primary-symbol' });
  const ogPng = fs.readFileSync(path.join(exportsRoot, 'day-1/06-web/open-graph-1200x630.png'));
  copyPublic('brand-assets/exports/day-1/06-web/open-graph-1200x630.png', ogPng);

  const liveScenes = [
    ['starting-soon-1920x1080', 'STARTING SOON', content.liveState],
    ['live-main-1920x1080', 'LIVE / MAIN', 'BUILDING WITH AI'],
    ['be-right-back-1920x1080', 'BE RIGHT BACK', 'STATE'],
    ['stream-ending-1920x1080', 'STREAM ENDING', 'DOCUMENTING THE JOURNEY.'],
    ['offline-1920x1080', 'OFFLINE', 'LEO FERRAZ'],
  ];
  for (const [name, headline, state] of liveScenes) {
    const liveSafeZone = rectSafeZone(1920, 1080);
    const svg = socialSvg(`OBS ${headline}`, 1920, 1080, { label: 'LEO FERRAZ · LIVE', headline, signatureAsset: wordmarkOnly, state, safeZone: liveSafeZone });
    await writeSvg(`day-1/03-live/obs/${name}.svg`, svg);
    await writePng(`day-1/03-live/obs/${name}.png`, svg, 1920, 1080, { fit: 'fill' });
    ensureDir(path.join(root, 'live', 'obs', `${name}.png`));
    fs.copyFileSync(path.join(exportsRoot, `day-1/03-live/obs/${name}.png`), path.join(root, 'live', 'obs', `${name}.png`));
    fs.copyFileSync(path.join(exportsRoot, `day-1/03-live/obs/${name}.svg`), path.join(root, 'live', 'obs', `${name}.svg`));
    register({ id: name, platform: 'OBS', role: `live scene ${headline.toLowerCase()}`, relative: `day-1/03-live/obs/${name}.png`, width: 1920, height: 1080, format: 'PNG', transparency: false, usage: 'OBS scene background; do not combine with the persistent brand bug', signatureVariant: 'wordmark-only' });
  }
  const bugSvg = svgDocument('Leo Ferraz live brand bug', 480, 96, placedSignatureBody(symbol, { x: 16, y: 8, width: 80 }));
  await writeSvg('day-1/03-live/brand-bug.svg', bugSvg);
  await writePng('day-1/03-live/brand-bug.png', bugSvg, 480, 96, { fit: 'fill' });
  ensureDir(path.join(root, 'live', 'obs', 'brand-bug.png'));
  fs.copyFileSync(path.join(exportsRoot, 'day-1/03-live/brand-bug.png'), path.join(root, 'live', 'obs', 'brand-bug.png'));
  fs.copyFileSync(path.join(exportsRoot, 'day-1/03-live/brand-bug.svg'), path.join(root, 'live', 'obs', 'brand-bug.svg'));
  register({ id: 'brand-bug', platform: 'OBS', role: 'transparent corner brand bug', relative: 'day-1/03-live/brand-bug.png', width: 480, height: 96, format: 'PNG', transparency: true, usage: 'persistent compact corner marker; do not combine with a complete scene signature', signatureVariant: 'primary-symbol' });
  const lowerSvg = svgDocument('Leo Ferraz lower third', 960, 160, placedSignatureBody(descriptor, { x: 24, y: 4, width: 430 }));
  await writeSvg('day-1/03-live/lower-third.svg', lowerSvg);
  await writePng('day-1/03-live/lower-third.png', lowerSvg, 960, 160, { fit: 'fill' });
  ensureDir(path.join(root, 'live', 'obs', 'lower-third.png'));
  fs.copyFileSync(path.join(exportsRoot, 'day-1/03-live/lower-third.png'), path.join(root, 'live', 'obs', 'lower-third.png'));
  fs.copyFileSync(path.join(exportsRoot, 'day-1/03-live/lower-third.svg'), path.join(root, 'live', 'obs', 'lower-third.svg'));
  register({ id: 'lower-third', platform: 'OBS', role: 'transparent lower third', relative: 'day-1/03-live/lower-third.png', width: 960, height: 160, format: 'PNG', transparency: true, usage: 'static OBS overlay', signatureVariant: 'descriptor-lockup' });

  fs.writeFileSync(path.join(root, 'brand-assets', 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  const hashInput = manifest.assets.map((asset) => asset.export_path).sort().map((relative) => `${relative}:${createHash('sha256').update(fs.readFileSync(path.join(root, relative))).digest('hex')}`).join('\n');
  fs.writeFileSync(path.join(root, 'brand-assets', 'deterministic.sha256'), `${createHash('sha256').update(hashInput).digest('hex')}\n`);
  console.log(`Generated ${manifest.assets.length} assets.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
