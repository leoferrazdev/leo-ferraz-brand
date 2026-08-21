// YouTube thumbnail for the first video's republish, 1280x720.
//
// Same reasoning as build-video-cover.mjs (the vertical case): capa_VA used
// foto.jpg or a frame from the flawed v1 footage, so it cannot demonstrate
// the colour/generation-count fix. This is built from the corrected export
// instead, reusing the exact numbers of ab_1.html — the layout actually
// published (confirmed against a screenshot of the live watch page, not
// thumb_A.html, which uses the studio portrait and was never live).
//
// Headline is a third one, distinct from both ab_1's "SE DER ZERO, EU
// MOSTRO." and the vertical cover's "AQUI ESTÁ O PORQUÊ." — reusing either
// would make the two current covers indistinguishable from this new one.
// Pulled from ab-testing.md's second approved title option rather than
// invented: "Produtos Reais com IA: Vou Mostrar Tudo, Inclusive os Erros".

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

const W = 1280;
const H = 720;

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

function assertGlyphs(text, face) {
  const missing = [...new Set([...text])].filter((c) => c !== ' ' && !face.glyphForCodePoint(c.codePointAt(0))?.path?.commands?.length);
  if (missing.length) throw new Error(`fonte sem glifo para ${missing.map((c) => `"${c}"`).join(', ')}`);
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
  for (let x = 48; x < W; x += 48) lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${colors.grid}" stroke-opacity="0.45" stroke-width="1"/>`);
  for (let y = 48; y < H; y += 48) lines.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${colors.grid}" stroke-opacity="0.45" stroke-width="1"/>`);
  return lines.join('');
}

// ab_1.html's .ph box: right-anchored, 560x720, object-fit cover, with the
// same colour trim the published thumbnail uses (brightness .82 contrast
// 1.14 saturate .90) so this reads as the same family, not a different grade.
const PHOTO_W = 560;
async function photoDataUri(sourcePath, focusX) {
  const meta = await sharp(sourcePath).metadata();
  const scale = H / meta.height;
  const cropW = Math.min(meta.width, PHOTO_W / scale);
  const left = Math.max(0, Math.min(meta.width - cropW, meta.width * focusX - cropW / 2));
  const buffer = await sharp(sourcePath)
    .extract({ left: Math.round(left), top: 0, width: Math.round(cropW), height: meta.height })
    .resize(PHOTO_W, H, { fit: 'cover' })
    .modulate({ brightness: 0.82, saturation: 0.90 })
    .linear(1.14, -128 * 1.14 + 128)
    .jpeg({ quality: 92 })
    .toBuffer();
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}

function kickerBody(text, x, y) {
  const size = 26;
  const tracking = 0.16;
  const capHeight = mono.capHeight ?? mono.ascent * 0.7;
  const baseline = number(y + capHeight * fontScale(size, mono));
  return { body: outlinedRuns([{ text, fill: colors.accent }], { size, tracking, x, baseline, face: mono }), height: capHeight * fontScale(size, mono) };
}

function headlineBody(lines, x, top) {
  const size = 118;
  const tracking = -0.025;
  const lineHeight = size * 0.96;
  let baseline = top + bold.ascent * fontScale(size, bold);
  const parts = [];
  for (const line of lines) {
    parts.push(outlinedRuns(line, { size, tracking, x, baseline, face: bold }));
    baseline += lineHeight;
  }
  return parts.join('');
}

function subBody(text, x, y) {
  const size = 25;
  const tracking = 0.10;
  const baseline = number(y + mono.ascent * fontScale(size, mono));
  return outlinedRuns([{ text, fill: colors.muted }], { size, tracking, x, baseline, face: mono });
}

async function build() {
  const photoSrc = path.join(thumbsRoot, 'src', 'v2_frame_t70.png');
  const photoUri = await photoDataUri(photoSrc, 0.50);

  const tx = 76;
  const kickerText = 'PRODUTOS REAIS COM IA';
  // Three short lines, same shape as the published ab_1 ("SE DER" / "ZERO," /
  // "EU MOSTRO."). The first draft wrote "INCLUSIVE OS ERROS" as one line and
  // the width check below caught it at 1216px against a 700px column — the
  // published headline's own longest line only reaches 679px, so this had to
  // shrink to match, not just to fit.
  const headlineLines = [
    [{ text: 'MOSTRO', fill: colors.text }],
    [{ text: 'TUDO,', fill: colors.text }],
    [{ text: 'ATÉ O ', fill: colors.text }, { text: 'ERRO', fill: colors.accent }, { text: '.', fill: colors.text }],
  ];
  const subText = 'CUSTO · RECEITA · RESULTADO';
  assertGlyphs(headlineLines.flat().map((r) => r.text).join(''), bold);

  // .tx is flex column, gap 22, vertically centred in the 720px column. Block
  // height = kicker + gap + 2 headline lines + gap + sub; solved once, not
  // guessed, so the whole group stays centred regardless of line count.
  const kickerH = 26 * ((mono.capHeight ?? mono.ascent * 0.7) / mono.unitsPerEm);
  const headlineH = 118 * 0.96 * headlineLines.length;
  const subH = 25 * (mono.ascent / mono.unitsPerEm);
  const gap = 22;
  const blockH = kickerH + gap + headlineH + gap + subH;
  let cursorY = (H - blockH) / 2;

  const kicker = kickerBody(kickerText, tx, cursorY);
  cursorY += kickerH + gap;
  const headline = headlineBody(headlineLines, tx, cursorY);
  cursorY += headlineH + gap;
  const sub = subBody(subText, tx, cursorY);

  const TEXT_MAX_WIDTH = 700;
  for (const [label, text, size, tracking, face] of [
    ...headlineLines.map((line, i) => [`headline linha ${i + 1}`, line.map((r) => r.text).join(''), 118, -0.025, bold]),
    ['sub', subText, 25, 0.10, mono],
  ]) {
    const width = measure(text, size, tracking, face) - tracking * size;
    console.log(`${label}: ${Math.round(width)}px / limite ${TEXT_MAX_WIDTH}px${width > TEXT_MAX_WIDTH ? '  <-- ESTOURA' : ''}`);
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`
    + `<defs><linearGradient id="fade" x1="${W - PHOTO_W}" y1="0" x2="${W}" y2="0" gradientUnits="userSpaceOnUse">`
    + `<stop offset="0" stop-color="${colors.background}" stop-opacity="1"/>`
    + `<stop offset="0.26" stop-color="${colors.background}" stop-opacity="0.55"/>`
    + `<stop offset="0.62" stop-color="${colors.background}" stop-opacity="0"/>`
    + `</linearGradient></defs>`
    + `<rect width="${W}" height="${H}" fill="${colors.background}"/>`
    + gridBody()
    + `<image x="${W - PHOTO_W}" y="0" width="${PHOTO_W}" height="${H}" xlink:href="${photoUri}" preserveAspectRatio="xMidYMid slice"/>`
    + `<rect x="${W - PHOTO_W}" y="0" width="${PHOTO_W}" height="${H}" fill="url(#fade)"/>`
    + kicker.body
    + headline
    + sub
    + `<rect x="0" y="${H - 8}" width="${W}" height="8" fill="${colors.accent}"/>`
    + `</svg>`;

  const buffer = Buffer.from(svg);
  await sharp(buffer).resize(W, H, { fit: 'fill' }).png({ compressionLevel: 9 }).toFile(path.join(thumbsRoot, 'thumb_v2.png'));
  await sharp(buffer).resize(W, H, { fit: 'fill' }).jpeg({ quality: 92, chromaSubsampling: '4:4:4' }).toFile(path.join(thumbsRoot, 'thumb_v2.jpg'));
  console.log('Gerado: thumb_v2.png / thumb_v2.jpg');
}

await build();
