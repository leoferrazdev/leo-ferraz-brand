// Visual spec for the cutout cover standard, both formats.
//
// Not a deliverable asset. This exists so the photo shoot has a concrete
// target: it draws the real layout at real size with the photo zone marked,
// so the framing needed from the camera is a measurement rather than a
// description.
//
// The standard is adapted from two reference thumbnails the founder supplied
// (badge pill top-left, heavy left headline, subject cut out and bleeding off
// the right and bottom edges). Colour, grid and typography come from the
// Leo Ferraz identity, not from the references.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { create as createFont } from 'fontkitten';

sharp.concurrency(1);
sharp.cache(false);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outRoot = path.join(root, 'brand', 'padrao-capas');
fs.mkdirSync(outRoot, { recursive: true });

const colors = {
  background: '#0D1117',
  text: '#F3F6FA',
  muted: '#7F8B99',
  accent: '#4DA3FF',
  grid: '#405064',
  zone: '#4DA3FF',
};

const bold = createFont(fs.readFileSync(path.join(root, 'node_modules', '@fontsource', 'ibm-plex-sans', 'files', 'ibm-plex-sans-latin-700-normal.woff2')));
const mono = createFont(fs.readFileSync(path.join(root, 'node_modules', '@fontsource', 'ibm-plex-mono', 'files', 'ibm-plex-mono-latin-500-normal.woff2')));
const fontScale = (size, face) => size / face.unitsPerEm;
const number = (v) => Number(v.toFixed(3));

function measure(text, size, tracking, face) {
  const tu = tracking * face.unitsPerEm;
  let w = 0;
  for (const c of text) w += face.glyphForCodePoint(c.codePointAt(0)).advanceWidth + tu;
  return number(w * fontScale(size, face) - tracking * size);
}

function assertGlyphs(text, face) {
  const missing = [...new Set([...text])].filter((c) => c !== ' ' && !face.glyphForCodePoint(c.codePointAt(0))?.path?.commands?.length);
  if (missing.length) throw new Error(`fonte sem glifo para ${missing.map((c) => `"${c}"`).join(', ')}`);
}

function outlined(runs, { size, tracking = 0, x, baseline, face }) {
  const scale = fontScale(size, face);
  const tu = tracking * face.unitsPerEm;
  let cursor = x / scale;
  const paths = [];
  for (const run of runs) {
    for (const c of run.text) {
      const g = face.glyphForCodePoint(c.codePointAt(0));
      if (g.path?.commands?.length) {
        paths.push(`<path d="${g.path.scale(scale, -scale).translate(cursor * scale, baseline).toSVG()}" fill="${run.fill}"/>`);
      }
      cursor += g.advanceWidth + tu;
    }
  }
  return paths.join('');
}

function grid(W, H, cell) {
  const lines = [];
  for (let x = cell; x < W; x += cell) lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${colors.grid}" stroke-opacity="0.45" stroke-width="1"/>`);
  for (let y = cell; y < H; y += cell) lines.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${colors.grid}" stroke-opacity="0.45" stroke-width="1"/>`);
  return lines.join('');
}

// Badge pill. Dark text on the accent, not white: #4DA3FF is light enough that
// white on it falls near 2.5:1 contrast, while the dark navy reaches about 7:1.
function badge(text, { x, y, size, height }) {
  const tracking = 0.06;
  const dot = Math.round(size * 0.6);
  const padL = Math.round(size * 0.85);
  const gap = Math.round(size * 0.54);
  const padR = Math.round(size * 1.08);
  const tw = measure(text, size, tracking, bold);
  const w = padL + dot + gap + tw + padR;
  const cy = y + height / 2;
  const cap = bold.capHeight ?? bold.ascent * 0.7;
  const baseline = number(cy + (cap * fontScale(size, bold)) / 2);
  return {
    body: [
      `<rect x="${x}" y="${y}" width="${number(w)}" height="${height}" rx="${height / 2}" fill="${colors.accent}"/>`,
      `<circle cx="${x + padL + dot / 2}" cy="${cy}" r="${dot / 2}" fill="${colors.background}"/>`,
      outlined([{ text, fill: colors.background }], { size, tracking, x: x + padL + dot + gap, baseline, face: bold }),
    ].join(''),
    width: w,
  };
}

// Marked area rather than a drawn silhouette. A silhouette would imply a pose;
// this states the box the cut-out subject has to fill, which is what the
// camera framing actually has to deliver.
function photoZone(x, y, w, h, lines) {
  const parts = [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${colors.zone}" fill-opacity="0.07"/>`,
    `<rect x="${x + 1}" y="${y + 1}" width="${w - 2}" height="${h - 2}" fill="none" stroke="${colors.zone}" stroke-opacity="0.55" stroke-width="2" stroke-dasharray="14 10"/>`,
  ];
  const size = Math.round(w * 0.042);
  let ly = y + h / 2 - (lines.length * size * 1.9) / 2;
  for (const line of lines) {
    const tw = measure(line, size, 0.08, mono);
    parts.push(outlined([{ text: line, fill: colors.zone }], { size, tracking: 0.08, x: x + w / 2 - tw / 2, baseline: ly, face: mono }));
    ly += size * 1.9;
  }
  return parts.join('');
}

function annotate(text, x, baseline, size) {
  return outlined([{ text, fill: colors.muted }], { size, tracking: 0.06, x, baseline, face: mono });
}

function build({ id, W, H, cell, badgeSpec, headline, headSize, headX, headTop, zone, notes }) {
  assertGlyphs(headline.join(''), bold);
  const b = badge(badgeSpec.text, badgeSpec);

  const lineH = headSize * 0.95;
  let baseline = headTop + bold.ascent * fontScale(headSize, bold);
  const headParts = [];
  for (const line of headline) {
    headParts.push(outlined([{ text: line, fill: colors.text }], { size: headSize, tracking: -0.028, x: headX, baseline, face: bold }));
    baseline += lineH;
  }

  // Two layouts, two limits. Horizontal puts the photo beside the text, so the
  // column ends where the photo starts. Vertical stacks them, so the column is
  // the full canvas minus its margins. Assuming the horizontal case gave the
  // vertical spec a negative limit and flagged every line as overflowing.
  const limit = zone.x > 0
    ? zone.x - headX - Math.round(W * 0.03)
    : W - headX * 2;
  for (const line of headline) {
    const w = measure(line, headSize, -0.028, bold);
    console.log(`  ${id} "${line}" ${Math.round(w)}px / limite ${limit}px${w > limit ? '  <-- ESTOURA' : ''}`);
  }

  const noteSize = Math.round(W * 0.016);
  const noteParts = notes.map((n, i) => annotate(n, headX, H - Math.round(H * 0.045) - (notes.length - 1 - i) * noteSize * 1.8, noteSize)).join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`
    + `<rect width="${W}" height="${H}" fill="${colors.background}"/>`
    + grid(W, H, cell)
    + photoZone(zone.x, zone.y, zone.w, zone.h, zone.labels)
    + b.body
    + headParts.join('')
    + noteParts
    + `</svg>`;

  const buf = Buffer.from(svg);
  return sharp(buf).resize(W, H, { fit: 'fill' }).png({ compressionLevel: 9 }).toFile(path.join(outRoot, `${id}.png`));
}

console.log('medindo linhas de headline contra a coluna de texto');

await build({
  id: 'spec-horizontal',
  W: 1280, H: 720, cell: 48,
  badgeSpec: { text: 'CONSTRUINDO COM IA', x: 64, y: 56, size: 26, height: 56 },
  headline: ['UM JOGO', 'FEITO COM', 'IA, AO VIVO.'],
  headSize: 90, headX: 64, headTop: 176,
  zone: { x: 640, y: 0, w: 640, h: 720, labels: ['AREA DA FOTO', '640 x 720', 'RECORTE SEM FUNDO', 'SANGRA NA BASE'] },
  notes: [
    'FUNDO #0D1117 + GRID 48PX  ·  PILULA #4DA3FF COM TEXTO ESCURO',
    'HEADLINE IBM PLEX SANS 700, BRANCA, ENTRELINHA 0.95',
    'SEM BARRA INFERIOR NESTE PADRAO, A FIGURA SANGRA NA BASE',
  ],
});

await build({
  id: 'spec-vertical',
  W: 1080, H: 1920, cell: 60,
  badgeSpec: { text: 'CONSTRUINDO COM IA', x: 72, y: 300, size: 30, height: 64 },
  headline: ['UM JOGO', 'FEITO COM', 'IA, AO VIVO.'],
  headSize: 118, headX: 72, headTop: 430,
  zone: { x: 0, y: 880, w: 1080, h: 1040, labels: ['AREA DA FOTO', '1080 x 1040', 'RECORTE SEM FUNDO', 'SANGRA NA BASE'] },
  notes: [
    'ROSTO ENTRE Y 950 E Y 1450, DENTRO DO CORTE QUADRADO DO PERFIL',
    'NADA ESSENCIAL ABAIXO DE Y 1620, ONDE ENTRA A LEGENDA DO REELS',
    'NADA ESSENCIAL A DIREITA DE X 930, ONDE FICAM OS BOTOES',
  ],
});

console.log('\nGerado em brand/padrao-capas/');
