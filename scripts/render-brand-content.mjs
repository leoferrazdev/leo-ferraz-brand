import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const valueOf = (name, fallback) => {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};
const template = valueOf('--template', 'youtube-thumbnail');
const contentId = valueOf('--content', 'live-001');
const output = valueOf('--output', `brand-assets/exports/day-1/05-youtube/${contentId}-${template}`);
const contentPath = path.join(root, 'brand-assets', 'sources', 'content', `${contentId}.json`);
if (!fs.existsSync(contentPath)) throw new Error(`Unknown content source: ${contentId}`);
const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

const specs = {
  'youtube-thumbnail': [1280, 720],
  'instagram-carousel': [1080, 1350],
  'instagram-story': [1080, 1920],
  'social-square': [1080, 1080],
};
if (!specs[template]) throw new Error(`Unknown template: ${template}`);
const [width, height] = specs[template];
const pad = Math.round(width * 0.075);
const xml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const text = (value, x, y, size, fill, family = 'IBM Plex Sans') => `<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-size="${size}px" font-weight="500">${xml(value)}</text>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"><title>Leo Ferraz content template</title><rect width="${width}" height="${height}" fill="#0D1117"/><rect x="${pad}" y="${pad}" width="${width - pad * 2}" height="${height - pad * 2}" fill="none" stroke="#2A3543"/><rect x="${pad}" y="${Math.round(height * 0.2)}" width="10" height="${Math.round(height * 0.58)}" fill="#4DA3FF"/>${text(content.brand, pad, Math.round(height * 0.15), Math.max(30, Math.round(width * 0.06)), '#F3F6FA')}${text(content.eyebrow ?? 'CONTENT', pad, Math.round(height * 0.3), Math.max(16, Math.round(width * 0.018)), '#4DA3FF', 'IBM Plex Mono')}${text(content.headline, pad, Math.round(height * 0.49), Math.max(34, Math.round(width * 0.075)), '#F3F6FA')}${text(content.artifact, pad, Math.round(height * 0.61), Math.max(16, Math.round(width * 0.022)), '#B7C2CE', 'IBM Plex Mono')}${text(content.state ?? 'CONTENT SLOT', pad, Math.round(height * 0.83), Math.max(16, Math.round(width * 0.018)), '#9B8CFF', 'IBM Plex Mono')}${text(content.descriptor, width - pad, Math.round(height * 0.9), Math.max(14, Math.round(width * 0.016)), '#B7C2CE', 'IBM Plex Mono')}</svg>`;
const base = path.resolve(root, output);
fs.mkdirSync(path.dirname(base), { recursive: true });
fs.writeFileSync(`${base}.svg`, `${svg}\n`);
await sharp(Buffer.from(svg)).png().toFile(`${base}.png`);
console.log(`Rendered ${template} from ${contentId}: ${base}.svg + ${base}.png`);
