import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { create as createFont } from 'fontkitten';

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
const fontScale = (size) => size / font.unitsPerEm;

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

function measureText(text, size, tracking = 0) {
  const scale = fontScale(size);
  const trackingUnits = tracking * font.unitsPerEm;
  let width = 0;
  for (const character of text) {
    width += font.glyphForCodePoint(character.codePointAt(0)).advanceWidth + trackingUnits;
  }
  return number(width * scale);
}

function outlinedText(text, { size, tracking = 0, x = 0, baseline = 0, fill = colors.text }) {
  const scale = fontScale(size);
  const trackingUnits = tracking * font.unitsPerEm;
  let cursor = x / scale;
  const paths = [];
  for (const character of text) {
    const glyph = font.glyphForCodePoint(character.codePointAt(0));
    if (glyph.path?.commands?.length) {
      const transformed = glyph.path.scale(scale, -scale).translate(cursor * scale, baseline);
      paths.push(`<path d="${transformed.toSVG()}" fill="${fill}"/>`);
    }
    cursor += glyph.advanceWidth + trackingUnits;
  }
  return paths.join('');
}

function signatureMarkerSvg({ x, baseline, textSize, size = 8, fill = colors.accent }) {
  const y = number(baseline - textSize * 0.68);
  return `<rect x="${number(x)}" y="${y}" width="${size}" height="${size}" fill="${fill}"/>`;
}

function signatureOutlinedText(text, { markerSize = 8, markerGap = 8, ...options }) {
  const marker = signatureMarkerSvg({ x: options.x ?? 0, baseline: options.baseline ?? 0, textSize: options.size, size: markerSize, fill: options.markerFill ?? colors.accent });
  return `${marker}${outlinedText(text, { ...options, x: (options.x ?? 0) + markerSize + markerGap })}`;
}

function outlinedSvg(title, lines, { padding = 4, gap = 8, background = null, marker = false, markerFill = colors.accent, markerSize = 8, markerGap = 8 } = {}) {
  const measured = lines.map((line) => ({ ...line, width: measureText(line.text, line.size, line.tracking ?? 0) }));
  const markerOffset = marker ? markerSize + markerGap : 0;
  const width = Math.ceil(Math.max(...measured.map((line) => line.width)) + markerOffset + padding * 2);
  const lineHeight = (size) => number(size * 1.18);
  const height = Math.ceil(measured.reduce((sum, line) => sum + lineHeight(line.size), padding * 2 + gap * Math.max(0, measured.length - 1)));
  let top = padding;
  const paths = measured.map((line) => {
    const baseline = top + font.ascent * fontScale(line.size);
    const result = outlinedText(line.text, { ...line, baseline, x: padding + markerOffset });
    top += lineHeight(line.size) + gap;
    return result;
  }).join('');
  const firstBaseline = padding + font.ascent * fontScale(measured[0].size);
  const markerSvg = marker ? signatureMarkerSvg({ x: padding, baseline: firstBaseline, textSize: measured[0].size, size: markerSize, fill: markerFill }) : '';
  const bg = background ? `<rect width="${width}" height="${height}" fill="${background}"/>` : '';
  return {
    width,
    height,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-labelledby="title"><title id="title">${escapeXml(title)}</title>${bg}${markerSvg}${paths}</svg>`,
  };
}

function svgDocument(title, width, height, body, { background = null } = {}) {
  const bg = background ? `<rect width="${width}" height="${height}" fill="${background}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-labelledby="title"><title id="title">${escapeXml(title)}</title>${bg}${body}</svg>`;
}

function textElement(text, x, y, { size = 28, fill = colors.text, family = 'IBM Plex Sans', weight = 500, anchor = 'start', letterSpacing = 0 } = {}) {
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-size="${size}px" font-weight="${weight}" text-anchor="${anchor}" letter-spacing="${letterSpacing}em">${escapeXml(text)}</text>`;
}

function socialSvg(title, width, height, { label, headline, state = 'CONTENT SLOT', safe = false } = {}) {
  const pad = Math.round(width * 0.075);
  const line = Math.round(width * 0.012);
  const mark = signatureOutlinedText(content.brand, { size: Math.round(width * 0.065), tracking: -0.035, x: pad, baseline: Math.round(height * 0.16), fill: colors.text });
  const safeGuide = safe ? `<rect x="${pad}" y="${Math.round(height * 0.12)}" width="${width - pad * 2}" height="${Math.round(height * 0.76)}" fill="none" stroke="${colors.borderStrong}" stroke-dasharray="8 12"/><text x="${pad}" y="${height - pad * 0.55}" fill="${colors.muted}" font-family="IBM Plex Mono" font-size="${Math.max(14, Math.round(width * 0.012))}px">SAFE AREA — KEEP ESSENTIAL CONTENT INSIDE</text>` : '';
  const body = [
    `<rect x="${pad}" y="${pad}" width="${width - pad * 2}" height="${height - pad * 2}" fill="none" stroke="${colors.border}" stroke-width="${line}"/>`,
    `<rect x="${pad}" y="${Math.round(height * 0.19)}" width="${line}" height="${Math.round(height * 0.58)}" fill="${colors.accent}"/>`,
    mark,
    textElement(label, pad, Math.round(height * 0.28), { size: Math.max(14, Math.round(width * 0.016)), family: 'IBM Plex Mono', fill: colors.accent, letterSpacing: 0.075 }),
    textElement(headline, pad, Math.round(height * 0.47), { size: Math.max(30, Math.round(width * 0.07)), weight: 500 }),
    textElement(content.artifact, pad, Math.round(height * 0.58), { size: Math.max(16, Math.round(width * 0.022)), family: 'IBM Plex Mono', fill: colors.secondary, letterSpacing: 0.01 }),
    textElement(state, pad, Math.round(height * 0.83), { size: Math.max(14, Math.round(width * 0.016)), family: 'IBM Plex Mono', fill: colors.experimental, letterSpacing: 0.075 }),
    textElement(content.descriptor, width - pad, Math.round(height * 0.9), { size: Math.max(14, Math.round(width * 0.016)), family: 'IBM Plex Mono', fill: colors.secondary, anchor: 'end' }),
    safeGuide,
  ].join('');
  return svgDocument(title, width, height, body, { background: colors.background });
}

function channelBannerSvg(title, width, height, { safeX, safeY, safeWidth, safeHeight, leftAligned = false } = {}) {
  const x = leftAligned ? 72 : safeX + safeWidth / 2;
  const anchor = leftAligned ? 'start' : 'middle';
  const y = safeY + 92;
  const markerSize = 8;
  const markerGap = 8;
  const wordmarkWidth = measureText(content.brand, 78, -0.035);
  const wordmarkStart = leftAligned ? x : x - (markerSize + markerGap + wordmarkWidth) / 2;
  const wordmark = signatureMarkerSvg({ x: wordmarkStart, baseline: y, textSize: 78, size: markerSize, fill: colors.accent }) + outlinedText(content.brand, { size: 78, tracking: -0.035, x: wordmarkStart + markerSize + markerGap, baseline: y, fill: colors.text });
  const body = [
    `<rect x="${safeX}" y="${safeY}" width="${safeWidth}" height="${safeHeight}" fill="none" stroke="${colors.borderStrong}" stroke-dasharray="10 14"/>`,
    wordmark,
    textElement(content.descriptor, x, y + 68, { size: 28, family: 'IBM Plex Mono', fill: colors.secondary, anchor }),
    textElement('SaaS · Apps · Games · Experiments', x, y + 112, { size: 22, family: 'IBM Plex Mono', fill: colors.muted, anchor }),
    textElement(title, 48, height - 42, { size: 16, family: 'IBM Plex Mono', fill: colors.muted, letterSpacing: 0.075 }),
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
  const buffer = await sharp(Buffer.from(svg)).resize(width, height, { fit, background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
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

const manifest = {
  manifest_version: '1.0.0',
  brand_system: '1.0.0',
  signature_system: 'Editorial Tech Lockup',
  source_tag: 'v1.0.0',
  source_commit: 'b2ae95cca8d6b62c6579c415113852b8ef8c8b09',
  status: 'approved',
  generated_by: 'scripts/build-brand-assets.mjs',
  assets: [],
};

function register({ id, platform, role, relative, width, height, format, transparency, usage, source = 'brand-assets/sources/content.json + scripts/build-brand-assets.mjs', status = 'approved' }) {
  manifest.assets.push({ id, platform, role, width, height, dimensions: `${width}x${height}`, format, source_template: source, background: transparency ? 'transparent' : colors.background, transparency, usage, export_path: `brand-assets/exports/${relative}`, status });
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
    '## Generate',
    '',
    'npm run brand-assets:build',
    'npm run brand-assets:validate',
    'npm run brand:render -- --template youtube-thumbnail --content live-001',
    '',
    'The render command supports youtube-thumbnail, instagram-carousel, instagram-story, and social-square. Content lives in brand-assets/sources/content/.',
  ].join('\\n') + '\\n';
  fs.writeFileSync(path.join(exportsRoot, 'README.md'), exportReadme);

  if (content.signatureMarker !== 'square') throw new Error('Unsupported signature marker source.');
  const wordmark = outlinedSvg('Leo Ferraz primary wordmark', [{ text: content.brand, size: 58, tracking: -0.035, fill: colors.text }], { marker: true });
  const wordmarkDark = outlinedSvg('Leo Ferraz primary wordmark dark', [{ text: content.brand, size: 58, tracking: -0.035, fill: colors.background }], { marker: true, markerFill: colors.background });
  const descriptor = outlinedSvg('Leo Ferraz descriptor lockup', [
    { text: content.brand, size: 58, tracking: -0.035, fill: colors.text },
    { text: content.descriptor, size: 18, tracking: 0, fill: colors.secondary },
  ], { gap: 8, marker: true });
  const institutional = outlinedSvg('Leo Ferraz institutional lockup', [
    { text: content.brand, size: 58, tracking: -0.035, fill: colors.text },
    { text: content.descriptor, size: 18, tracking: 0, fill: colors.secondary },
    { text: content.category, size: 14, tracking: 0, fill: colors.experimental },
  ], { gap: 8, marker: true });
  const utility = outlinedSvg('LF secondary utility mark', [{ text: 'LF', size: 58, tracking: -0.035, fill: colors.text }]);
  const utilityDark = outlinedSvg('LF secondary utility mark dark', [{ text: 'LF', size: 58, tracking: -0.035, fill: colors.background }]);

  for (const [name, asset] of [['leo-ferraz-wordmark.svg', wordmark], ['leo-ferraz-wordmark-dark.svg', wordmarkDark], ['leo-ferraz-building-with-ai.svg', descriptor], ['leo-ferraz-institutional.svg', institutional], ['leo-ferraz-lf.svg', utility], ['leo-ferraz-lf-dark.svg', utilityDark]]) {
    await writeSvg(`day-1/01-profile/${name}`, asset.svg);
    register({ id: name.replace('.svg', ''), platform: 'all', role: name.includes('lf') ? 'secondary utility mark' : 'signature', relative: `day-1/01-profile/${name}`, width: asset.width, height: asset.height, format: 'SVG', transparency: true, usage: name.includes('lf') ? 'compact contexts only' : 'primary authorship layer' });
  }
  for (const size of [512, 1024, 2048]) {
    await writePng(`day-1/01-profile/leo-ferraz-wordmark-${size}.png`, wordmark.svg, size, Math.ceil(size * wordmark.height / wordmark.width));
    register({ id: `leo-ferraz-wordmark-${size}`, platform: 'all', role: 'transparent wordmark export', relative: `day-1/01-profile/leo-ferraz-wordmark-${size}.png`, width: size, height: Math.ceil(size * wordmark.height / wordmark.width), format: 'PNG', transparency: true, usage: 'upload or composition' });
  }

  const avatar = svgDocument('LF avatar', 1024, 1024, [
    `<rect width="1024" height="1024" fill="${colors.background}"/>`,
    outlinedText('LF', { size: 430, tracking: -0.035, x: (1024 - measureText('LF', 430, -0.035)) / 2, baseline: 650, fill: colors.text }),
  ].join(''));
  const avatarCircle = svgDocument('LF circular crop validation', 1024, 1024, [
    `<circle cx="512" cy="512" r="512" fill="${colors.background}"/>`,
    outlinedText('LF', { size: 430, tracking: -0.035, x: (1024 - measureText('LF', 430, -0.035)) / 2, baseline: 650, fill: colors.text }),
  ].join(''));
  await writeSvg('day-1/01-profile/avatar-square.svg', avatar);
  await writeSvg('day-1/01-profile/avatar-circle.svg', avatarCircle);
  register({ id: 'avatar-square-master', platform: 'all', role: 'avatar', relative: 'day-1/01-profile/avatar-square.svg', width: 1024, height: 1024, format: 'SVG', transparency: false, usage: 'profile avatar master' });
  register({ id: 'avatar-circle-validation', platform: 'all', role: 'crop validation', relative: 'day-1/01-profile/avatar-circle.svg', width: 1024, height: 1024, format: 'SVG', transparency: true, usage: 'circle crop validation only' });
  for (const size of [16, 32, 48, 64, 128, 256, 512, 1024]) {
    const relative = `day-1/01-profile/avatar-${size}.png`;
    await writePng(relative, avatar, size, size, { fit: 'fill' });
    register({ id: `avatar-${size}`, platform: 'all', role: 'avatar export', relative, width: size, height: size, format: 'PNG', transparency: false, usage: 'profile upload or small-size validation' });
  }
  await writePng('day-1/01-profile/avatar-circle-1024.png', avatarCircle, 1024, 1024, { fit: 'fill' });
  register({ id: 'avatar-circle-1024', platform: 'all', role: 'circular crop validation', relative: 'day-1/01-profile/avatar-circle-1024.png', width: 1024, height: 1024, format: 'PNG', transparency: true, usage: 'platform crop validation' });

  const favicon = svgDocument('LF favicon', 48, 48, [
    `<rect width="48" height="48" fill="${colors.background}"/>`,
    outlinedText('LF', { size: 26, tracking: -0.035, x: (48 - measureText('LF', 26, -0.035)) / 2, baseline: 32, fill: colors.text }),
  ].join(''));
  await writeSvg('day-1/06-web/favicon.svg', favicon);
  copyPublic('favicon.svg', Buffer.from(favicon));
  const faviconImages = [];
  for (const size of [16, 32, 48]) {
    const buffer = await writePng(`day-1/06-web/favicon-${size}x${size}.png`, favicon, size, size, { fit: 'fill' });
    faviconImages.push({ size, buffer });
    copyPublic(`favicon-${size}x${size}.png`, buffer);
    register({ id: `favicon-${size}`, platform: 'web', role: 'favicon', relative: `day-1/06-web/favicon-${size}x${size}.png`, width: size, height: size, format: 'PNG', transparency: false, usage: 'browser favicon' });
  }
  const ico = createIco(faviconImages);
  await writeBuffer('day-1/06-web/favicon.ico', ico);
  copyPublic('favicon.ico', ico);
  register({ id: 'favicon-ico', platform: 'web', role: 'favicon', relative: 'day-1/06-web/favicon.ico', width: 48, height: 48, format: 'ICO', transparency: false, usage: 'legacy browser favicon' });
  const apple = await writePng('day-1/06-web/apple-touch-icon.png', favicon, 180, 180, { fit: 'fill' });
  const icon192 = await writePng('day-1/06-web/icon-192.png', favicon, 192, 192, { fit: 'fill' });
  const icon512 = await writePng('day-1/06-web/icon-512.png', favicon, 512, 512, { fit: 'fill' });
  copyPublic('apple-touch-icon.png', apple);
  copyPublic('icon-192.png', icon192);
  copyPublic('icon-512.png', icon512);
  for (const [id, size, file] of [['apple-touch-icon', 180, 'apple-touch-icon.png'], ['icon-192', 192, 'icon-192.png'], ['icon-512', 512, 'icon-512.png']]) register({ id, platform: 'web', role: id === 'apple-touch-icon' ? 'apple touch icon' : 'web app icon', relative: `day-1/06-web/${file}`, width: size, height: size, format: 'PNG', transparency: false, usage: 'web installation or shortcut' });
  const manifestJson = JSON.stringify({ name: 'Leo Ferraz — Building with AI', short_name: 'Leo Ferraz', start_url: '/', display: 'standalone', background_color: colors.background, theme_color: colors.background, icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }] }, null, 2) + '\n';
  await writeBuffer('day-1/06-web/site.webmanifest', Buffer.from(manifestJson));
  copyPublic('site.webmanifest', Buffer.from(manifestJson));
  register({ id: 'site-webmanifest', platform: 'web', role: 'manifest', relative: 'day-1/06-web/site.webmanifest', width: 0, height: 0, format: 'JSON', transparency: false, usage: 'web app metadata' });

  const youtubeBanner = channelBannerSvg('YouTube channel banner · 2560×1440 · safe area 1544×423', 2560, 1440, { safeX: 508, safeY: 508, safeWidth: 1544, safeHeight: 423 });
  const twitchBanner = channelBannerSvg('Twitch profile banner · 1200×480', 1200, 480, { safeX: 48, safeY: 48, safeWidth: 1050, safeHeight: 300, leftAligned: true });
  const channelAssets = [
    ['day-1/02-channels/youtube-banner-2560x1440', youtubeBanner, 2560, 1440, 'YouTube channel banner'],
    ['day-1/02-channels/twitch-banner-1200x480', twitchBanner, 1200, 480, 'Twitch profile banner'],
  ];
  for (const [base, svg, width, height, role] of channelAssets) {
    await writeSvg(`${base}.svg`, svg);
    await writePng(`${base}.png`, svg, width, height, { fit: 'fill' });
    register({ id: path.basename(base), platform: role.startsWith('YouTube') ? 'YouTube' : 'Twitch', role, relative: `${base}.svg`, width, height, format: 'SVG', transparency: false, usage: 'channel upload source' });
    register({ id: `${path.basename(base)}-png`, platform: role.startsWith('YouTube') ? 'YouTube' : 'Twitch', role, relative: `${base}.png`, width, height, format: 'PNG', transparency: false, usage: 'channel upload' });
  }

  const socialSpecs = [
    ['day-1/04-social/instagram-carousel-cover-1080x1350', 1080, 1350, 'Instagram carousel/feed cover', 'BUILDING WITH AI'],
    ['day-1/04-social/instagram-story-reels-1080x1920', 1080, 1920, 'Instagram Story/Reels cover', 'AO VIVO'],
    ['day-1/05-youtube/youtube-thumbnail-1280x720', 1280, 720, 'YouTube thumbnail template', 'BUILDING WITH AI'],
    ['day-1/05-youtube/youtube-thumbnail-master-3840x2160', 3840, 2160, 'YouTube thumbnail master', 'BUILDING WITH AI'],
    ['day-1/04-social/instagram-reels-cover-420x654', 420, 654, 'Instagram Reels cover crop', 'AO VIVO'],
    ['day-1/04-social/social-square-1080x1080', 1080, 1080, 'Social square template', 'REAL PRODUCT ARTIFACT'],
    ['day-1/06-web/open-graph-1200x630', 1200, 630, 'Open Graph default', 'Leo Ferraz'],
  ];
  for (const [base, width, height, role, headline] of socialSpecs) {
    const svg = socialSvg(role, width, height, { label: role.toUpperCase(), headline, state: content.liveState, safe: role.includes('Story') || role.includes('thumbnail') });
    await writeSvg(`${base}.svg`, svg);
    await writePng(`${base}.png`, svg, width, height, { fit: 'fill' });
    register({ id: path.basename(base), platform: role.startsWith('Instagram') ? 'Instagram' : role.startsWith('YouTube') ? 'YouTube' : 'web/social', role, relative: `${base}.svg`, width, height, format: 'SVG', transparency: false, usage: 'editable template source' });
    register({ id: `${path.basename(base)}-png`, platform: role.startsWith('Instagram') ? 'Instagram' : role.startsWith('YouTube') ? 'YouTube' : 'web/social', role, relative: `${base}.png`, width, height, format: 'PNG', transparency: false, usage: 'upload/publication export' });
  }
  const liveExample = socialSvg('Live example thumbnail', 1280, 720, { label: 'AO VIVO · EXAMPLE', headline: content.liveExample, state: content.liveState, safe: true });
  await writeSvg('day-1/05-youtube/live-001-youtube-thumbnail-1280x720.svg', liveExample);
  await writePng('day-1/05-youtube/live-001-youtube-thumbnail-1280x720.png', liveExample, 1280, 720, { fit: 'fill' });
  register({ id: 'live-001-youtube-thumbnail', platform: 'YouTube', role: 'first demonstrative live thumbnail', relative: 'day-1/05-youtube/live-001-youtube-thumbnail-1280x720.png', width: 1280, height: 720, format: 'PNG', transparency: false, usage: 'clearly demonstrative example only' });
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
    const svg = socialSvg(`OBS ${headline}`, 1920, 1080, { label: 'LEO FERRAZ · LIVE', headline, state });
    await writeSvg(`day-1/03-live/obs/${name}.svg`, svg);
    await writePng(`day-1/03-live/obs/${name}.png`, svg, 1920, 1080, { fit: 'fill' });
    ensureDir(path.join(root, 'live', 'obs', `${name}.png`));
    fs.copyFileSync(path.join(exportsRoot, `day-1/03-live/obs/${name}.png`), path.join(root, 'live', 'obs', `${name}.png`));
    fs.copyFileSync(path.join(exportsRoot, `day-1/03-live/obs/${name}.svg`), path.join(root, 'live', 'obs', `${name}.svg`));
    register({ id: name, platform: 'OBS', role: `live scene ${headline.toLowerCase()}`, relative: `day-1/03-live/obs/${name}.png`, width: 1920, height: 1080, format: 'PNG', transparency: false, usage: 'OBS scene background' });
  }
  const bug = outlinedSvg('Leo Ferraz live brand bug', [{ text: content.brand, size: 32, tracking: -0.035, fill: colors.text }], { marker: true });
  const bugSvg = svgDocument('Leo Ferraz live brand bug', 480, 96, `<g transform="translate(16 24)">${outlinedBody(bug.svg)}</g>`);
  await writeSvg('day-1/03-live/brand-bug.svg', bugSvg);
  await writePng('day-1/03-live/brand-bug.png', bugSvg, 480, 96, { fit: 'fill' });
  ensureDir(path.join(root, 'live', 'obs', 'brand-bug.png'));
  fs.copyFileSync(path.join(exportsRoot, 'day-1/03-live/brand-bug.png'), path.join(root, 'live', 'obs', 'brand-bug.png'));
  fs.copyFileSync(path.join(exportsRoot, 'day-1/03-live/brand-bug.svg'), path.join(root, 'live', 'obs', 'brand-bug.svg'));
  register({ id: 'brand-bug', platform: 'OBS', role: 'transparent corner brand bug', relative: 'day-1/03-live/brand-bug.png', width: 480, height: 96, format: 'PNG', transparency: true, usage: 'corner overlay; use only when authorship needs a signal' });
  const lower = outlinedSvg('Leo Ferraz lower third', [
    { text: content.brand, size: 34, tracking: -0.035, fill: colors.text },
    { text: content.descriptor, size: 16, tracking: 0, fill: colors.secondary },
  ], { gap: 4, marker: true });
  const lowerSvg = svgDocument('Leo Ferraz lower third', 960, 160, `<rect x="0" y="0" width="8" height="160" fill="${colors.accent}"/><g transform="translate(32 24)">${outlinedBody(lower.svg)}</g>`);
  await writeSvg('day-1/03-live/lower-third.svg', lowerSvg);
  await writePng('day-1/03-live/lower-third.png', lowerSvg, 960, 160, { fit: 'fill' });
  ensureDir(path.join(root, 'live', 'obs', 'lower-third.png'));
  fs.copyFileSync(path.join(exportsRoot, 'day-1/03-live/lower-third.png'), path.join(root, 'live', 'obs', 'lower-third.png'));
  fs.copyFileSync(path.join(exportsRoot, 'day-1/03-live/lower-third.svg'), path.join(root, 'live', 'obs', 'lower-third.svg'));
  register({ id: 'lower-third', platform: 'OBS', role: 'transparent lower third', relative: 'day-1/03-live/lower-third.png', width: 960, height: 160, format: 'PNG', transparency: true, usage: 'static OBS overlay' });

  fs.writeFileSync(path.join(root, 'brand-assets', 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  const hashInput = manifest.assets.map((asset) => asset.export_path).sort().map((relative) => `${relative}:${createHash('sha256').update(fs.readFileSync(path.join(root, relative))).digest('hex')}`).join('\n');
  fs.writeFileSync(path.join(root, 'brand-assets', 'deterministic.sha256'), `${createHash('sha256').update(hashInput).digest('hex')}\n`);
  console.log(`Generated ${manifest.assets.length} assets.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
