// Vertical cover for the first video's republish, 1080x1920.
//
// Reuses capa_VA.html's exact numbers (canvas, photo box, type sizes,
// positions) so this reads as the same cover with one variable swapped: the
// photo source. capa_VA used the studio portrait (foto.jpg), which was never
// touched by the HDR/crop defect the founder just had fixed — it cannot show
// whether the fix worked. This pulls the photo from the corrected horizontal
// export instead (produtos-reais-com-ia-leo-ferraz-01-v2.mp4, colour already
// verified against the original at three timestamps), composed independently
// of the vertical video's own 9:16 crop — that crop is only 607px wide and
// leaves no room for a headline; this box only needs ~1155px of the source,
// which is why it goes through a photo box instead of reusing the vertical
// export's own frame directly.
//
// Copy is identical to capa_VA on purpose. Changing the image AND the words
// at once would leave no way to tell which one moved the result.

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
  muted: '#7F8B99',
  accent: '#4DA3FF',
  grid: '#405064',
};

const W = 1080;
const H = 1920;

const bold = createFont(fs.readFileSync(path.join(root, 'node_modules', '@fontsource', 'ibm-plex-sans', 'files', 'ibm-plex-sans-latin-700-normal.woff2')));
const mono = createFont(fs.readFileSync(path.join(root, 'node_modules', '@fontsource', 'ibm-plex-mono', 'files', 'ibm-plex-mono-latin-500-normal.woff2')));
const fontScale = (size, face) => size / face.unitsPerEm;
const number = (value) => Number(value.toFixed(3));

function measure(text, size, tracking, face) {
  const trackingUnits = tracking * face.unitsPerEm;
  let width = 0;
  for (const character of text) width += face.glyphForCodePoint(character.codePointAt(0)).advanceWidth + trackingUnits;
  return number(width * fontScale(size, face));
}

function outlinedRuns(runs, { size, tracking = 0, x, baseline, face }) {
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

function gridBody() {
  const lines = [];
  for (let x = 60; x < W; x += 60) lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${colors.grid}" stroke-opacity="0.45" stroke-width="1"/>`);
  for (let y = 60; y < H; y += 60) lines.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${colors.grid}" stroke-opacity="0.45" stroke-width="1"/>`);
  return lines.join('');
}

// capa_VA's .ph box: left 0, bottom-anchored, width 1080, height 1010 — i.e.
// y 910 to 1920. object-fit:cover on a source wider (in ratio) than the box
// scales to the box height and crops width, which is what this replicates.
const PHOTO_Y = 910;
const PHOTO_H = 1010;
async function photoDataUri(sourcePath, focusX) {
  const meta = await sharp(sourcePath).metadata();
  const scale = PHOTO_H / meta.height;
  const scaledW = meta.width * scale;
  const cropW = Math.min(meta.width, W / scale);
  const left = Math.max(0, Math.min(meta.width - cropW, meta.width * focusX - cropW / 2));
  const buffer = await sharp(sourcePath)
    .extract({ left: Math.round(left), top: 0, width: Math.round(cropW), height: meta.height })
    .resize(W, PHOTO_H, { fit: 'cover' })
    .modulate({ brightness: 0.97 })
    .jpeg({ quality: 92 })
    .toBuffer();
  return { uri: `data:image/jpeg;base64,${buffer.toString('base64')}`, scaledW };
}

async function wordmarkDataUri() {
  const src = path.join(root, 'brand-assets', 'exports', 'day-1', '01-profile', 'leo-ferraz-wordmark-underline-2048.png');
  const meta = await sharp(src).metadata();
  const buffer = fs.readFileSync(src);
  return { uri: `data:image/png;base64,${buffer.toString('base64')}`, aspect: meta.width / meta.height };
}

function kickerBody(text, x, y) {
  const size = 34;
  const tracking = 0.16;
  const capHeight = mono.capHeight ?? mono.ascent * 0.7;
  const baseline = number(y + capHeight * fontScale(size, mono));
  return { body: outlinedRuns([{ text, fill: colors.accent }], { size, tracking, x, baseline, face: mono }), height: capHeight * fontScale(size, mono) };
}

function headlineBody(lines, x, top) {
  const size = 132;
  const tracking = -0.025;
  const lineHeight = size * 0.98;
  let baseline = top + bold.ascent * fontScale(size, bold);
  const parts = [];
  for (const line of lines) {
    parts.push(outlinedRuns(line, { size, tracking, x, baseline, face: bold }));
    baseline += lineHeight;
  }
  return { body: parts.join(''), bottom: baseline - lineHeight + bold.descent * fontScale(size, bold) * -1 };
}

function subBody(text, x, y) {
  const size = 30;
  const tracking = 0.10;
  const baseline = number(y + mono.ascent * fontScale(size, mono));
  return outlinedRuns([{ text, fill: colors.muted }], { size, tracking, x, baseline, face: mono });
}

// A missing glyph is dropped silently by the outliner rather than erroring —
// the letter would just vanish from the rendered art. "Á"/"Ê" sit outside
// ASCII, so this fails loudly instead, the same check the live covers use.
function assertGlyphs(text, face) {
  const missing = [...new Set([...text])].filter((c) => c !== ' ' && !face.glyphForCodePoint(c.codePointAt(0))?.path?.commands?.length);
  if (missing.length) throw new Error(`fonte sem glifo para ${missing.map((c) => `"${c}"`).join(', ')}`);
}

async function build() {
  const photoSrc = path.join(thumbsRoot, 'src', 'v2_frame_t70.png');
  const { uri: photoUri } = await photoDataUri(photoSrc, 0.50);
  const { uri: wmUri, aspect: wmAspect } = await wordmarkDataUri();
  const wmWidth = 260;
  const wmHeight = wmWidth / wmAspect;

  const tx = 80;
  let cursorY = 470;
  const kicker = kickerBody('PRODUTOS REAIS COM IA', tx, cursorY);
  cursorY += kicker.height + 26;

  // Different headline than capa_VA on purpose (founder's call, overriding the
  // single-variable framing above): still true to the approved video title
  // ("Vou Construir Produtos Reais com IA. Aqui Está o Porquê.", ab-testing.md)
  // rather than invented copy, and still names no result it cannot back up.
  const headlineLines = [
    [{ text: 'AQUI ESTÁ', fill: colors.text }],
    [{ text: 'O PORQUÊ', fill: colors.accent }, { text: '.', fill: colors.text }],
  ];
  assertGlyphs(headlineLines.flat().map((r) => r.text).join(''), bold);
  const headline = headlineBody(headlineLines, tx, cursorY);
  cursorY += 132 * 0.98 * headlineLines.length + 26;

  const subText = 'CUSTO · RECEITA · RESULTADO';
  const sub = subBody(subText, tx, cursorY);

  // capa_VA's .tx column is 920px wide (x 80 to 1000, 80px clear of the 1080
  // canvas edge). A line that overruns it would run into the grid margin or
  // off-canvas — the same class of defect the live covers' width check caught.
  const TEXT_MAX_WIDTH = 920;
  for (const [label, text, size, tracking, face] of [
    ...headlineLines.map((line, i) => [`headline linha ${i + 1}`, line.map((r) => r.text).join(''), 132, -0.025, bold]),
    ['sub', subText, 30, 0.10, mono],
  ]) {
    const width = measure(text, size, tracking, face) - tracking * size;
    console.log(`${label}: ${Math.round(width)}px / limite ${TEXT_MAX_WIDTH}px${width > TEXT_MAX_WIDTH ? '  <-- ESTOURA' : ''}`);
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`
    + `<defs><linearGradient id="fade" x1="0" y1="${PHOTO_Y}" x2="0" y2="${H}" gradientUnits="userSpaceOnUse">`
    + `<stop offset="0" stop-color="${colors.background}" stop-opacity="1"/>`
    + `<stop offset="0.22" stop-color="${colors.background}" stop-opacity="0.45"/>`
    + `<stop offset="0.55" stop-color="${colors.background}" stop-opacity="0"/>`
    + `</linearGradient></defs>`
    + `<rect width="${W}" height="${H}" fill="${colors.background}"/>`
    + gridBody()
    + `<image x="0" y="${PHOTO_Y}" width="${W}" height="${PHOTO_H}" xlink:href="${photoUri}" preserveAspectRatio="xMidYMid slice"/>`
    + `<rect x="0" y="${PHOTO_Y}" width="${W}" height="${PHOTO_H}" fill="url(#fade)"/>`
    + `<image x="56" y="150" width="${wmWidth}" height="${wmHeight}" xlink:href="${wmUri}"/>`
    + kicker.body
    + headline.body
    + sub
    + `<rect x="0" y="${H - 10}" width="${W}" height="10" fill="${colors.accent}"/>`
    + `</svg>`;

  const buffer = Buffer.from(svg);
  await sharp(buffer).resize(W, H, { fit: 'fill' }).png({ compressionLevel: 9 }).toFile(path.join(thumbsRoot, 'capa_V2.png'));
  await sharp(buffer).resize(W, H, { fit: 'fill' }).jpeg({ quality: 92, chromaSubsampling: '4:4:4' }).toFile(path.join(thumbsRoot, 'capa_V2.jpg'));
  console.log('Gerado: capa_V2.png / capa_V2.jpg');
}

await build();
