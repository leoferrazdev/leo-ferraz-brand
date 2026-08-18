import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const exportsRoot = path.join(root, 'brand-assets', 'exports');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'brand-assets', 'manifest.json'), 'utf8'));
const allowedColors = new Set(['#0D1117', '#151B24', '#1D2632', '#2A3543', '#405064', '#F3F6FA', '#B7C2CE', '#7F8B99', '#4DA3FF', '#86C5FF', '#0F2E4C', '#9B8CFF', '#252044']);
const failures = [];

function fail(message) { failures.push(message); }

for (const asset of manifest.assets) {
  const file = path.join(root, asset.export_path);
  if (!fs.existsSync(file)) { fail(`${asset.id}: missing ${asset.export_path}`); continue; }
  if (asset.format === 'SVG') {
    const source = fs.readFileSync(file, 'utf8');
    if (/<(script|iframe)\b/i.test(source)) fail(`${asset.id}: executable markup`);
    if (/<(style|font-face)\b|@font-face|(?:woff2?|ttf|otf)|font-embed/i.test(source)) fail(`${asset.id}: embedded font or style block`);
    const withoutSvgNamespace = source.replace('http://www.w3.org/2000/svg', '');
    if (/(https?:\/\/|url\()/i.test(withoutSvgNamespace)) fail(`${asset.id}: external URL or resource`);
    if (/<(linearGradient|radialGradient|filter)\b/i.test(source)) fail(`${asset.id}: gradient/filter effect`);
    if (asset.role === 'signature' || asset.role === 'secondary utility mark' || asset.role === 'avatar' || asset.role === 'crop validation' || asset.role === 'favicon') {
      if (/<text\b/i.test(source)) fail(`${asset.id}: identity asset contains text instead of outlines`);
    }
    for (const color of source.match(/#[0-9A-Fa-f]{6}/g) ?? []) if (!allowedColors.has(color.toUpperCase())) fail(`${asset.id}: unapproved color ${color}`);
  }
  if (asset.format === 'PNG') {
    const metadata = await sharp(file).metadata();
    if (metadata.width !== asset.width || metadata.height !== asset.height) fail(`${asset.id}: expected ${asset.width}x${asset.height}, got ${metadata.width}x${metadata.height}`);
    if (asset.transparency && !metadata.hasAlpha) fail(`${asset.id}: expected alpha channel`);
  }
  if (asset.format === 'ICO') {
    const buffer = fs.readFileSync(file);
    if (buffer.readUInt16LE(0) !== 0 || buffer.readUInt16LE(2) !== 1 || buffer.readUInt16LE(4) < 3) fail(`${asset.id}: invalid ICO header`);
  }
}

const identityFiles = manifest.assets.filter((asset) => asset.format === 'SVG' && (asset.role === 'signature' || asset.role === 'secondary utility mark' || asset.role === 'avatar' || asset.role === 'favicon'));
if (identityFiles.some((asset) => /<text\b/i.test(fs.readFileSync(path.join(root, asset.export_path), 'utf8')))) fail('identity outlines: <text> found');
if (manifest.status !== 'approved') fail(`manifest status is ${manifest.status}`);
if (manifest.source_tag !== 'v1.0.0') fail(`source tag is ${manifest.source_tag}`);

if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join('\n'));
  process.exit(1);
}
console.log(`PASS: ${manifest.assets.length} assets; SVG/PNG/ICO, transparency, colors, fonts, URLs and dimensions validated.`);
