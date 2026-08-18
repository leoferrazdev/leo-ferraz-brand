import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const exportsRoot = path.join(root, 'brand-assets', 'exports');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'brand-assets', 'manifest.json'), 'utf8'));
const allowedColors = new Set(['#0D1117', '#151B24', '#1D2632', '#2A3543', '#405064', '#F3F6FA', '#B7C2CE', '#7F8B99', '#4DA3FF', '#86C5FF', '#0F2E4C', '#9B8CFF', '#252044']);
const failures = [];
const signatureRoles = new Set(['primary lockup', 'wordmark-only', 'descriptor lockup', 'institutional lockup', 'signature', 'wordmark-only export', 'transparent wordmark export']);
const symbolRoles = new Set(['primary lockup', 'descriptor lockup', 'institutional lockup', 'primary symbol', 'legacy compatibility alias']);
const signatureVariants = new Set(['primary-symbol', 'wordmark-only', 'primary-lockup', 'descriptor-lockup', 'institutional-lockup', 'none']);
const pixelSafeZoneRoles = new Set([
  'YouTube channel banner',
  'Twitch profile banner',
  'Instagram carousel/feed cover',
  'Instagram Story/Reels cover',
  'Instagram Reels cover crop',
  'Social square template',
  'YouTube thumbnail template',
  'YouTube thumbnail master',
  'first demonstrative live thumbnail',
  'Open Graph default',
  'transparent corner brand bug',
  'transparent lower third',
]);

function fail(message) { failures.push(message); }

async function validatePixelSafeZone(asset, file) {
  if (asset.format !== 'PNG' || asset.safe_zone?.type !== 'rect') return;
  if (!pixelSafeZoneRoles.has(asset.role) && !asset.role.startsWith('live scene ')) return;

  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const background = asset.background === 'transparent'
    ? null
    : asset.background.match(/[0-9A-Fa-f]{2}/g).map((channel) => Number.parseInt(channel, 16));
  const zone = asset.safe_zone;
  const right = zone.x + zone.width;
  const bottom = zone.y + zone.height;
  let bounds = null;

  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const offset = (y * info.width + x) * info.channels;
      const alpha = data[offset + 3];
      const isContent = background
        ? alpha > 8 && (Math.abs(data[offset] - background[0]) > 3 || Math.abs(data[offset + 1] - background[1]) > 3 || Math.abs(data[offset + 2] - background[2]) > 3)
        : alpha > 8;
      if (!isContent) continue;
      bounds ??= { minX: x, minY: y, maxX: x, maxY: y };
      bounds.minX = Math.min(bounds.minX, x);
      bounds.minY = Math.min(bounds.minY, y);
      bounds.maxX = Math.max(bounds.maxX, x);
      bounds.maxY = Math.max(bounds.maxY, y);
    }
  }

  if (!bounds) return fail(`${asset.id}: no visible content found for safe-zone audit`);
  if (bounds.minX < zone.x || bounds.minY < zone.y || bounds.maxX >= right || bounds.maxY >= bottom) {
    fail(`${asset.id}: visible bounds ${bounds.minX},${bounds.minY}–${bounds.maxX},${bounds.maxY} exceed safe zone ${zone.x},${zone.y}–${right - 1},${bottom - 1}`);
  }
}

function expectedSignatureVariant(asset) {
  const role = asset.role;
  if (role === 'primary lockup') return 'primary-lockup';
  if (role === 'wordmark-only' || role === 'wordmark-only export' || role === 'transparent wordmark export') return 'wordmark-only';
  if (role === 'descriptor lockup') return 'descriptor-lockup';
  if (role === 'institutional lockup') return 'institutional-lockup';
  if (role === 'primary symbol') return 'primary-symbol';
  if (role === 'legacy compatibility alias') {
    if (asset.id.includes('building-with-ai')) return 'descriptor-lockup';
    if (asset.id.includes('institutional')) return 'institutional-lockup';
    if (/leo-ferraz-lf(?:-|$)/.test(asset.id)) return 'primary-symbol';
    return 'primary-lockup';
  }
  if (role.includes('avatar') || role.includes('crop validation') || role === 'favicon' || role === 'apple touch icon' || role === 'web app icon') return 'primary-symbol';
  if (role === 'YouTube channel banner' || role === 'Twitch profile banner') return 'descriptor-lockup';
  if (role === 'Instagram carousel/feed cover' || role === 'Social square template' || role.startsWith('live scene ')) return 'wordmark-only';
  if (role === 'Instagram Story/Reels cover' || role === 'Instagram Reels cover crop' || role.includes('thumbnail')) return 'primary-symbol';
  if (role === 'Open Graph default' || role === 'transparent lower third') return 'descriptor-lockup';
  if (role === 'transparent corner brand bug') return 'primary-symbol';
  if (role === 'manifest') return 'none';
  return null;
}

for (const asset of manifest.assets) {
  const file = path.join(root, asset.export_path);
  if (!fs.existsSync(file)) { fail(`${asset.id}: missing ${asset.export_path}`); continue; }
  const publicMirror = path.join(root, 'public', asset.export_path);
  if (!fs.existsSync(publicMirror)) fail(`${asset.id}: missing public mirror public/${asset.export_path}`);
  else if (!fs.readFileSync(file).equals(fs.readFileSync(publicMirror))) fail(`${asset.id}: public mirror drifted from ${asset.export_path}`);
  if (!signatureVariants.has(asset.signature_variant)) fail(`${asset.id}: invalid or missing signature_variant ${asset.signature_variant}`);
  const expectedVariant = expectedSignatureVariant(asset);
  if (expectedVariant && asset.signature_variant !== expectedVariant) fail(`${asset.id}: expected signature_variant ${expectedVariant}, got ${asset.signature_variant}`);
  if (!asset.safe_zone || typeof asset.safe_zone !== 'object') fail(`${asset.id}: safe_zone metadata missing`);
  if (asset.safe_zone?.type === 'rect') {
    const zone = asset.safe_zone;
    if ([zone.x, zone.y, zone.width, zone.height].some((value) => !Number.isFinite(value))) fail(`${asset.id}: invalid safe_zone geometry`);
    if (zone.x < 0 || zone.y < 0 || zone.width <= 0 || zone.height <= 0 || zone.x + zone.width > asset.width || zone.y + zone.height > asset.height) fail(`${asset.id}: safe_zone exceeds canvas`);
  }
  if (asset.format === 'SVG') {
    const source = fs.readFileSync(file, 'utf8');
    if (/<(script|iframe)\b/i.test(source)) fail(`${asset.id}: executable markup`);
    if (/<(style|font-face)\b|@font-face|(?:woff2?|ttf|otf)|font-embed/i.test(source)) fail(`${asset.id}: embedded font or style block`);
    const withoutSvgNamespace = source.replace('http://www.w3.org/2000/svg', '');
    if (/(https?:\/\/|url\()/i.test(withoutSvgNamespace)) fail(`${asset.id}: external URL or resource`);
    if (/<(linearGradient|radialGradient|filter)\b/i.test(source)) fail(`${asset.id}: gradient/filter effect`);
    if (/stroke-dasharray|SAFE AREA|SAFE ZONE/i.test(source)) fail(`${asset.id}: review guide leaked into delivery asset`);
    if (signatureRoles.has(asset.role) || asset.role === 'primary symbol' || asset.role === 'legacy compatibility alias' || asset.role === 'avatar' || asset.role === 'crop validation' || asset.role === 'favicon') {
      if (/<text\b/i.test(source)) fail(`${asset.id}: identity asset contains text instead of outlines`);
    }
    if (asset.platform !== 'all' && asset.signature_variant !== 'none' && !source.includes(`data-signature-variant="${asset.signature_variant}"`)) fail(`${asset.id}: rendered signature marker ${asset.signature_variant} is missing`);
    for (const color of source.match(/#[0-9A-Fa-f]{6}/g) ?? []) if (!allowedColors.has(color.toUpperCase())) fail(`${asset.id}: unapproved color ${color}`);
  }
  if (asset.format === 'PNG') {
    const metadata = await sharp(file).metadata();
    if (metadata.width !== asset.width || metadata.height !== asset.height) fail(`${asset.id}: expected ${asset.width}x${asset.height}, got ${metadata.width}x${metadata.height}`);
    if (asset.transparency && !metadata.hasAlpha) fail(`${asset.id}: expected alpha channel`);
    await validatePixelSafeZone(asset, file);
  }
  if (asset.format === 'ICO') {
    const buffer = fs.readFileSync(file);
    if (buffer.readUInt16LE(0) !== 0 || buffer.readUInt16LE(2) !== 1 || buffer.readUInt16LE(4) < 3) fail(`${asset.id}: invalid ICO header`);
  }
}

for (const [relative, variant] of [
  ['brand-assets/exports/day-1/03-live/brand-bug.svg', 'primary-symbol'],
  ['brand-assets/exports/day-1/03-live/lower-third.svg', 'descriptor-lockup'],
  ['brand-assets/exports/day-1/03-live/obs/starting-soon-1920x1080.svg', 'wordmark-only'],
  ['brand-assets/exports/day-1/03-live/obs/live-main-1920x1080.svg', 'wordmark-only'],
  ['brand-assets/exports/day-1/03-live/obs/be-right-back-1920x1080.svg', 'wordmark-only'],
  ['brand-assets/exports/day-1/03-live/obs/stream-ending-1920x1080.svg', 'wordmark-only'],
  ['brand-assets/exports/day-1/03-live/obs/offline-1920x1080.svg', 'wordmark-only'],
]) {
  const source = fs.readFileSync(path.join(root, relative), 'utf8');
  if (!source.includes(`data-signature-variant="${variant}"`)) fail(`${relative}: rendered signature marker ${variant} is missing`);
  const liveMirror = path.join(root, 'live', 'obs', path.basename(relative));
  if (!fs.existsSync(liveMirror)) fail(`${relative}: live OBS mirror is missing`);
  else if (!fs.readFileSync(path.join(root, relative)).equals(fs.readFileSync(liveMirror))) fail(`${relative}: live OBS mirror drifted`);
}

const identityFiles = manifest.assets.filter((asset) => asset.format === 'SVG' && (signatureRoles.has(asset.role) || asset.role === 'primary symbol' || asset.role === 'legacy compatibility alias' || asset.role === 'avatar' || asset.role === 'favicon'));
if (identityFiles.some((asset) => /<text\b/i.test(fs.readFileSync(path.join(root, asset.export_path), 'utf8')))) fail('identity outlines: <text> found');
if (manifest.status !== 'approved') fail(`manifest status is ${manifest.status}`);
if (manifest.source_tag !== 'v1.0.0') fail(`source tag is ${manifest.source_tag}`);
if (manifest.signature_system !== 'Constructed LF Lockup') fail(`signature system is ${manifest.signature_system}`);
for (const asset of manifest.assets.filter((candidate) => candidate.format === 'SVG' && symbolRoles.has(candidate.role))) {
  const source = fs.readFileSync(path.join(root, asset.export_path), 'utf8');
  if (!source.includes('data-mark="constructed-lf"')) fail(`${asset.id}: Constructed LF symbol is missing`);
  if (!source.includes('M8 8H20V44H28V56H8Z') || !source.includes('M28 8H56V20H40V28H48V36H40V56H28Z')) fail(`${asset.id}: Constructed LF geometry drifted`);
}
for (const id of ['leo-ferraz-primary-lockup', 'leo-ferraz-primary-lockup-dark', 'leo-ferraz-wordmark-only', 'leo-ferraz-wordmark-only-dark', 'leo-ferraz-descriptor-lockup', 'leo-ferraz-institutional-lockup']) {
  const asset = manifest.assets.find((candidate) => candidate.id === id);
  if (!asset) { fail(`${id}: canonical signature asset is missing`); continue; }
  const source = fs.readFileSync(path.join(root, asset.export_path), 'utf8');
  for (const part of ['underline-line', 'underline-terminal']) if (!source.includes(`data-accent="${part}"`)) fail(`${id}: ${part} is missing`);
}
for (const asset of manifest.assets.filter((candidate) => candidate.format === 'SVG' && signatureRoles.has(candidate.role))) {
  const source = fs.readFileSync(path.join(root, asset.export_path), 'utf8');
  for (const part of ['underline-line', 'underline-terminal']) if (!source.includes(`data-accent="${part}"`)) fail(`${asset.id}: public signature underline is missing`);
}

if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join('\n'));
  process.exit(1);
}
console.log(`PASS: ${manifest.assets.length} assets; signatures, pixel safe zones, public/OBS mirrors, SVG/PNG/ICO, transparency, colors, fonts, URLs and dimensions validated.`);
