// Live stream covers, 1280x720.
//
// Separate from build-brand-assets.mjs on purpose: these compose a photograph,
// and the brand asset pipeline is pure vector by contract — its determinism
// hash, transparency checks and safe-zone rules all assume drawn art. Mixing a
// JPEG into that pipeline would weaken those guarantees for every asset in it.
//
// The layout follows the reference the founder supplied: live badge top-left,
// portrait bleeding off the right edge, two-line title with one word carrying
// the accent. Colour, grid and typography come from the identity instead.
//
// Copy is fixed and reusable. Nothing here names a topic, so one cover serves
// every broadcast and nothing has to be regenerated before going on air — the
// same reasoning that removed the topic bars from the OBS scenes.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { create as createFont } from 'fontkitten';

sharp.concurrency(1);
sharp.cache(false);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const thumbsRoot = path.join(root, 'brand-assets', 'thumbnails');

const colors = {
  background: '#0D1117',
  text: '#F3F6FA',
  accent: '#4DA3FF',
  grid: '#405064',
  // The only red in the piece. It reads as a state indicator, not as a brand
  // colour, which is why it appears on the badge and nowhere else.
  live: '#E5484D',
};

const W = 1280;
const H = 720;
const PHOTO_W = 560;
const PHOTO_X = W - PHOTO_W;

const bold = createFont(fs.readFileSync(path.join(root, 'node_modules', '@fontsource', 'ibm-plex-sans', 'files', 'ibm-plex-sans-latin-700-normal.woff2')));
const fontScale = (size, face) => size / face.unitsPerEm;
const number = (value) => Number(value.toFixed(3));

function measure(text, size, tracking, face) {
  const trackingUnits = tracking * face.unitsPerEm;
  let width = 0;
  for (const character of text) width += face.glyphForCodePoint(character.codePointAt(0)).advanceWidth + trackingUnits;
  return number(width * fontScale(size, face));
}

// Runs, not a single string: the accent word is a colour change mid-line, and
// the cursor has to carry across runs so the words stay on one baseline.
function outlinedRuns(runs, { size, tracking = 0, x, baseline, face = bold }) {
  const scale = fontScale(size, face);
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

const runsWidth = (runs, size, tracking) => measure(runs.map((r) => r.text).join(''), size, tracking, bold);

function gridBody() {
  const lines = [];
  for (let x = 48; x < W; x += 48) lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${colors.grid}" stroke-opacity="0.45" stroke-width="1"/>`);
  for (let y = 48; y < H; y += 48) lines.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${colors.grid}" stroke-opacity="0.45" stroke-width="1"/>`);
  return lines.join('');
}

// Cover-crop to the frame the layout reserves. The source is square and the
// target is portrait, so the crop takes from the sides and keeps the full head
// height — the reason this is not a top-anchored crop.
async function portraitDataUri() {
  const buffer = await sharp(path.join(thumbsRoot, 'src', 'foto.jpg'))
    .resize(PHOTO_W, H, { fit: 'cover', position: 'centre' })
    .modulate({ brightness: 0.88, saturation: 0.94 })
    .linear(1.12, -15.36)
    .jpeg({ quality: 92 })
    .toBuffer();
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}

function badgeBody() {
  const size = 26;
  const tracking = 0.06;
  const text = 'AO VIVO';
  const height = 56;
  const y = 52;
  const x = 72;
  const dot = 16;
  const padLeft = 22;
  const gap = 14;
  const padRight = 28;
  const textWidth = measure(text, size, tracking, bold) - tracking * size;
  const width = padLeft + dot + gap + textWidth + padRight;
  const cy = y + height / 2;
  const capHeight = bold.capHeight ?? bold.ascent * 0.7;
  const baseline = number(cy + (capHeight * fontScale(size, bold)) / 2);
  return [
    `<rect x="${x}" y="${y}" width="${number(width)}" height="${height}" rx="${height / 2}" fill="${colors.live}"/>`,
    `<circle cx="${x + padLeft + dot / 2}" cy="${cy}" r="${dot / 2}" fill="#FFFFFF"/>`,
    outlinedRuns([{ text, fill: '#FFFFFF' }], { size, tracking, x: x + padLeft + dot + gap, baseline }),
  ].join('');
}

function titleBody({ line1, line2, size1, size2 }) {
  const tracking1 = -0.028;
  const tracking2 = -0.018;
  const h1 = size1 * 0.98;
  const h2 = size2 * 1.04;
  const gap = 16;
  const top = (H - (h1 + gap + h2)) / 2;
  const baseline1 = number(top + bold.ascent * fontScale(size1, bold));
  const baseline2 = number(top + h1 + gap + bold.ascent * fontScale(size2, bold));
  return [
    outlinedRuns([{ text: line1, fill: colors.text }], { size: size1, tracking: tracking1, x: 72, baseline: baseline1 }),
    outlinedRuns(line2, { size: size2, tracking: tracking2, x: 72, baseline: baseline2 }),
  ].join('');
}

function coverSvg(variant, photo) {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`
    + `<defs><linearGradient id="fade" x1="${PHOTO_X}" y1="0" x2="${W}" y2="0" gradientUnits="userSpaceOnUse">`
    + `<stop offset="0" stop-color="${colors.background}" stop-opacity="1"/>`
    + `<stop offset="0.24" stop-color="${colors.background}" stop-opacity="0.60"/>`
    + `<stop offset="0.58" stop-color="${colors.background}" stop-opacity="0"/>`
    + `</linearGradient></defs>`
    + `<rect width="${W}" height="${H}" fill="${colors.background}"/>`
    + gridBody()
    + `<image x="${PHOTO_X}" y="0" width="${PHOTO_W}" height="${H}" xlink:href="${photo}" preserveAspectRatio="xMidYMid slice"/>`
    + `<rect x="${PHOTO_X}" y="0" width="${PHOTO_W}" height="${H}" fill="url(#fade)"/>`
    + badgeBody()
    + titleBody(variant)
    + `<rect x="0" y="${H - 8}" width="${W}" height="8" fill="${colors.accent}"/>`
    + `</svg>`;
}

// Three registers, not three wordings of the same thing: what the stream is,
// what it refuses to hide, and an invitation. A cover that only varies by a
// synonym cannot tell you which one works.
const variants = [
  { id: 'live_1', line1: 'CONSTRUINDO', size1: 92, size2: 46, line2: [{ text: 'PRODUTOS ', fill: colors.text }, { text: 'REAIS', fill: colors.accent }, { text: ' COM IA', fill: colors.text }] },
  { id: 'live_2', line1: 'SEM CORTES', size1: 104, size2: 46, line2: [{ text: 'DO ', fill: colors.text }, { text: 'ERRO', fill: colors.accent }, { text: ' AO DEPLOY', fill: colors.text }] },
  // Not "comigo, ao vivo": the badge overhead already says AO VIVO, so the
  // line repeated it instead of adding anything. The canonical bio list says
  // what actually gets built.
  { id: 'live_3', line1: 'VEM CONSTRUIR', size1: 80, size2: 44, line2: [{ text: 'SAAS, ', fill: colors.text }, { text: 'APPS', fill: colors.accent }, { text: ', JOGOS', fill: colors.text }] },
];

const photo = await portraitDataUri();
for (const variant of variants) {
  const svg = coverSvg(variant, photo);
  const buffer = Buffer.from(svg);
  await sharp(buffer, { density: 96 }).png({ compressionLevel: 9 }).toFile(path.join(thumbsRoot, `${variant.id}.png`));
  await sharp(buffer, { density: 96 }).jpeg({ quality: 90, chromaSubsampling: '4:4:4' }).toFile(path.join(thumbsRoot, `${variant.id}.jpg`));
  // A title that overruns the text column collides with the portrait, and the
  // gradient hides the collision just enough to miss it on a small preview.
  const overrun = Math.max(runsWidth([{ text: variant.line1 }], variant.size1, -0.028), runsWidth(variant.line2, variant.size2, -0.018));
  const limit = PHOTO_X - 72;
  console.log(`${variant.id}: largura do texto ${Math.round(overrun)}px / limite ${limit}px${overrun > limit ? '  <-- ESTOURA' : ''}`);
}
console.log(`Geradas ${variants.length} capas de live.`);
