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
// content-renders/ is deliberately outside brand-assets/exports/: the
// deterministic build (scripts/build-brand-assets.mjs) wipes that whole
// tree on every run via fs.rmSync(exportsRoot, ...), and npm run dev/build
// both invoke it as a prerequisite — any ad-hoc content render placed
// inside exports/ gets silently deleted the next time anyone starts the
// site, with no error and no warning.
const output = valueOf('--output', `brand-assets/content-renders/${contentId}-${template}`);
const contentPath = path.join(root, 'brand-assets', 'sources', 'content', `${contentId}.json`);
if (!fs.existsSync(contentPath)) throw new Error(`Unknown content source: ${contentId}`);
const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

const specs = {
  'youtube-thumbnail': [1280, 720],
  'instagram-carousel': [1080, 1350],
  'instagram-carousel-slide': [1080, 1350],
  'instagram-story': [1080, 1920],
  'social-square': [1080, 1080],
};
if (!specs[template]) throw new Error(`Unknown template: ${template}`);
const [width, height] = specs[template];
const pad = Math.round(width * 0.075);

const xml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const text = (value, x, y, size, fill, { family = 'IBM Plex Sans', anchor = 'start', weight = 500 } = {}) =>
  `<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-size="${size}px" font-weight="${weight}" text-anchor="${anchor}">${xml(value)}</text>`;

function loadSignature(file) {
  const signaturePath = path.join(root, 'brand-assets', 'exports', 'day-1', '01-profile', file);
  if (!fs.existsSync(signaturePath)) throw new Error(`Canonical signature asset missing: ${signaturePath}. Run npm run brand-assets:build first.`);
  const source = fs.readFileSync(signaturePath, 'utf8');
  const viewBox = source.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  if (!viewBox) throw new Error(`Canonical signature viewBox missing: ${file}`);
  return {
    width: Number(viewBox[1]),
    height: Number(viewBox[2]),
    body: source.replace(/^.*?<title[^>]*>.*?<\/title>/s, '').replace(/<\/svg>\s*$/s, ''),
  };
}

function placeSignature(sig, { x, y, targetWidth, variant }) {
  const scale = targetWidth / sig.width;
  return {
    svg: `<g data-signature-variant="${variant}" transform="translate(${x} ${y}) scale(${scale.toFixed(5)})">${sig.body}</g>`,
    height: sig.height * scale,
  };
}

async function writeRender(base, svg) {
  fs.mkdirSync(path.dirname(base), { recursive: true });
  fs.writeFileSync(`${base}.svg`, `${svg}\n`);
  await sharp(Buffer.from(svg)).png().toFile(`${base}.png`);
}

if (template === 'instagram-carousel-slide') {
  // Internal carousel slides: content and pagination are the primary
  // signal, so the signature stays compact and bottom-left, never
  // repeating the full lockup used on the cover slide (SIGNATURE.md —
  // "the Master Brand frames products, it does not visually absorb them").
  if (!Array.isArray(content.slides) || content.slides.length === 0) {
    throw new Error(`Content "${contentId}" has no "slides" array, required by template instagram-carousel-slide.`);
  }
  const sig = loadSignature('leo-ferraz-wordmark-only.svg');
  const total = content.slides.length;
  for (const [index, slide] of content.slides.entries()) {
    const n = index + 1;
    const sigWidth = Math.round(width * 0.2);
    const sigHeight = sig.height * (sigWidth / sig.width);
    const signature = placeSignature(sig, { x: pad, y: height - pad - sigHeight, targetWidth: sigWidth, variant: 'wordmark-only' });
    const bodySize = Math.max(20, Math.round(width * 0.032));
    const bodyLineHeight = Math.round(bodySize * 1.45);
    const bodyStartY = Math.round(height * 0.48);
    const bodyLines = Array.isArray(slide.bodyLines) ? slide.bodyLines : [];
    const body = bodyLines
      .map((line, i) => text(line, pad, bodyStartY + i * bodyLineHeight, bodySize, '#B7C2CE', { weight: 400 }))
      .join('');
    const svg = [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`,
      `<title>Leo Ferraz carousel slide ${n}/${total}</title>`,
      `<rect width="${width}" height="${height}" fill="#0D1117"/>`,
      `<rect x="${pad}" y="${pad}" width="${width - pad * 2}" height="${height - pad * 2}" fill="none" stroke="#2A3543"/>`,
      text(slide.eyebrow ?? content.eyebrow ?? 'CONTENT', pad, Math.round(height * 0.12), Math.max(14, Math.round(width * 0.02)), '#4DA3FF', { family: 'IBM Plex Mono' }),
      text(slide.headline ?? '', pad, Math.round(height * 0.24), Math.max(30, Math.round(width * 0.062)), '#F3F6FA', { weight: 600 }),
      body,
      text(`${n} / ${total}`, width - pad, height - pad - 4, Math.max(14, Math.round(width * 0.018)), '#7F8B99', { family: 'IBM Plex Mono', anchor: 'end' }),
      signature.svg,
      '</svg>',
    ].join('');
    await writeRender(path.resolve(root, `${output}-${n}`), svg);
  }
  console.log(`Rendered ${total} carousel slides from ${contentId}: ${output}-1..${total}.svg + .png`);
} else {
  const signatureMap = {
    'youtube-thumbnail': ['leo-ferraz-symbol.svg', 'primary-symbol'],
    'instagram-carousel': ['leo-ferraz-wordmark-only.svg', 'wordmark-only'],
    'instagram-story': ['leo-ferraz-symbol.svg', 'primary-symbol'],
    'social-square': ['leo-ferraz-wordmark-only.svg', 'wordmark-only'],
  };
  const [signatureFile, signatureVariant] = signatureMap[template];
  const sig = loadSignature(signatureFile);
  const signatureWidth = signatureVariant === 'primary-symbol' ? Math.max(48, Math.round(width * 0.065)) : Math.round(width * 0.34);
  const signatureY = Math.round(height * 0.08);
  const signature = placeSignature(sig, { x: pad, y: signatureY, targetWidth: signatureWidth, variant: signatureVariant });
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`,
    '<title>Leo Ferraz content template</title>',
    `<rect width="${width}" height="${height}" fill="#0D1117"/>`,
    `<rect x="${pad}" y="${pad}" width="${width - pad * 2}" height="${height - pad * 2}" fill="none" stroke="#2A3543"/>`,
    `<rect x="${pad}" y="${Math.round(height * 0.2)}" width="10" height="${Math.round(height * 0.58)}" fill="#4DA3FF"/>`,
    signature.svg,
    text(content.eyebrow ?? 'CONTENT', pad, Math.max(Math.round(height * 0.3), Math.round(signatureY + signature.height + 36)), Math.max(16, Math.round(width * 0.018)), '#4DA3FF', { family: 'IBM Plex Mono' }),
    text(content.headline, pad, Math.round(height * 0.49), Math.max(34, Math.round(width * 0.075)), '#F3F6FA'),
    text(content.artifact, pad, Math.round(height * 0.61), Math.max(16, Math.round(width * 0.022)), '#B7C2CE', { family: 'IBM Plex Mono' }),
    text(content.state ?? 'CONTENT SLOT', pad, Math.round(height * 0.83), Math.max(16, Math.round(width * 0.018)), '#9B8CFF', { family: 'IBM Plex Mono' }),
    text(content.descriptor, width - pad, Math.round(height * 0.9), Math.max(14, Math.round(width * 0.016)), '#B7C2CE', { family: 'IBM Plex Mono', anchor: 'end' }),
    '</svg>',
  ].join('');
  await writeRender(path.resolve(root, output), svg);
  console.log(`Rendered ${template} from ${contentId}: ${output}.svg + .png`);
}
