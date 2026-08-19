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

// No font-metrics library is loaded in this lightweight script (unlike
// build-brand-assets.mjs, which uses fontkitten for exact glyph widths), so
// headline width can't be measured precisely. This is a deliberately
// conservative average-character-width estimate (0.6em, biased wide) that
// shrinks long headlines instead of letting them silently run past the
// canvas edge — which is what happened before this fix.
function fitHeadlineSize(value, baseSize, maxWidth, minSize = 18) {
  const estimatedWidth = String(value).length * baseSize * 0.6;
  if (estimatedWidth <= maxWidth) return baseSize;
  return Math.max(minSize, Math.floor(baseSize * (maxWidth / estimatedWidth)));
}

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

// Every non-symbol signature export bakes in native clear-space padding
// (SIGNATURE.md) before the visible glyph starts — correct for standalone
// use, wrong once the canvas edge is placed flush against other flush-left
// text (same root cause fixed in build-brand-assets.mjs's
// placedSignatureBody; this is the sibling script that fix never reached).
// padding is in the signature's own native units; subtracting padding*scale
// aligns the optical glyph edge to (x, y) instead of the padded canvas edge.
function placeSignature(sig, { x, y, targetWidth, variant, padding = 0 }) {
  const scale = targetWidth / sig.width;
  const inset = padding * scale;
  return {
    svg: `<g data-signature-variant="${variant}" transform="translate(${(x - inset).toFixed(3)} ${(y - inset).toFixed(3)}) scale(${scale.toFixed(5)})">${sig.body}</g>`,
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
    const signature = placeSignature(sig, { x: pad, y: height - pad - sigHeight, targetWidth: sigWidth, variant: 'wordmark-only', padding: 32 });
    const bodySize = Math.max(20, Math.round(width * 0.032));
    const bodyLineHeight = Math.round(bodySize * 1.45);
    const bodyStartY = Math.round(height * 0.48);
    const bodyLines = Array.isArray(slide.bodyLines) ? slide.bodyLines : [];
    const body = bodyLines
      .map((line, i) => text(line, pad, bodyStartY + i * bodyLineHeight, bodySize, '#B7C2CE', { weight: 400 }))
      .join('');
    const headlineSize = fitHeadlineSize(slide.headline ?? '', Math.max(30, Math.round(width * 0.062)), width - pad * 2);
    const svg = [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`,
      `<title>Leo Ferraz carousel slide ${n}/${total}</title>`,
      `<rect width="${width}" height="${height}" fill="#0D1117"/>`,
      text(slide.eyebrow ?? content.eyebrow ?? 'CONTENT', pad, Math.round(height * 0.12), Math.max(14, Math.round(width * 0.02)), '#4DA3FF', { family: 'IBM Plex Mono' }),
      text(slide.headline ?? '', pad, Math.round(height * 0.24), headlineSize, '#F3F6FA', { weight: 600 }),
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
    'youtube-thumbnail': ['leo-ferraz-symbol.svg', 'primary-symbol', 8],
    'instagram-carousel': ['leo-ferraz-wordmark-only.svg', 'wordmark-only', 32],
    'instagram-story': ['leo-ferraz-symbol.svg', 'primary-symbol', 8],
    'social-square': ['leo-ferraz-wordmark-only.svg', 'wordmark-only', 32],
  };
  const [signatureFile, signatureVariant, signaturePadding] = signatureMap[template];
  const sig = loadSignature(signatureFile);
  const signatureWidth = signatureVariant === 'primary-symbol' ? Math.max(48, Math.round(width * 0.065)) : Math.round(width * 0.34);
  const signatureY = Math.round(height * 0.08);
  const signature = placeSignature(sig, { x: pad, y: signatureY, targetWidth: signatureWidth, variant: signatureVariant, padding: signaturePadding });
  const headlineSize = fitHeadlineSize(content.headline, Math.max(34, Math.round(width * 0.075)), width - pad * 2);
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`,
    '<title>Leo Ferraz content template</title>',
    `<rect width="${width}" height="${height}" fill="#0D1117"/>`,
    signature.svg,
    text(content.eyebrow ?? 'CONTENT', pad, Math.max(Math.round(height * 0.3), Math.round(signatureY + signature.height + 36)), Math.max(16, Math.round(width * 0.018)), '#4DA3FF', { family: 'IBM Plex Mono' }),
    text(content.headline, pad, Math.round(height * 0.49), headlineSize, '#F3F6FA'),
    text(content.artifact, pad, Math.round(height * 0.61), Math.max(16, Math.round(width * 0.022)), '#B7C2CE', { family: 'IBM Plex Mono' }),
    text(content.state ?? 'CONTENT SLOT', pad, Math.round(height * 0.83), Math.max(16, Math.round(width * 0.018)), '#9B8CFF', { family: 'IBM Plex Mono' }),
    text(content.descriptor, width - pad, Math.round(height * 0.9), Math.max(14, Math.round(width * 0.016)), '#B7C2CE', { family: 'IBM Plex Mono', anchor: 'end' }),
    '</svg>',
  ].join('');
  await writeRender(path.resolve(root, output), svg);
  console.log(`Rendered ${template} from ${contentId}: ${output}.svg + .png`);
}
