// Covers in the cutout standard, both formats.
//
// Implements brand/PADRAO-CAPAS.md against the transparent-background
// portraits in brand-assets/profile/leo-ferraz. Those cutouts are what the
// standard was waiting on: every earlier source either carried its own
// background (forcing the gradient fade the standard exists to replace) or
// sat below the pixel size the photo area needs.
//
// Usage: node scripts/build-cutout-cover.mjs [horizontal|vertical|ambos]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { create as createFont } from 'fontkitten';

sharp.concurrency(1);
sharp.cache(false);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const photoRoot = path.join(root, 'brand-assets', 'profile', 'leo-ferraz');
const outRoot = path.join(root, 'brand-assets', 'capas');
fs.mkdirSync(outRoot, { recursive: true });

const colors = {
  background: '#0D1117',
  text: '#F3F6FA',
  accent: '#4DA3FF',
  grid: '#405064',
};

const bold = createFont(fs.readFileSync(path.join(root, 'node_modules', '@fontsource', 'ibm-plex-sans', 'files', 'ibm-plex-sans-latin-700-normal.woff2')));
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
  const l = [];
  for (let x = cell; x < W; x += cell) l.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${colors.grid}" stroke-opacity="0.45" stroke-width="1"/>`);
  for (let y = cell; y < H; y += cell) l.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${colors.grid}" stroke-opacity="0.45" stroke-width="1"/>`);
  return l.join('');
}

// Dark text on the accent, not white. #4DA3FF is light enough that white on it
// lands near 2.5:1 contrast while the dark navy reaches about 7:1.
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
  return [
    `<rect x="${x}" y="${y}" width="${number(w)}" height="${height}" rx="${height / 2}" fill="${colors.accent}"/>`,
    `<circle cx="${x + padL + dot / 2}" cy="${cy}" r="${dot / 2}" fill="${colors.background}"/>`,
    outlined([{ text, fill: colors.background }], { size, tracking, x: x + padL + dot + gap, baseline, face: bold }),
  ].join('');
}

// The cutout is scaled to cover the reserved area and anchored to its top, so
// the head keeps its headroom and the body runs off the bottom edge. That
// bleed is what gives the reference layouts their depth, and it only works
// because the source has no background of its own to give the crop away.
async function cutoutDataUri(file, w, h) {
  const buf = await sharp(path.join(photoRoot, file))
    .resize(w, h, { fit: 'cover', position: 'top', kernel: 'lanczos3' })
    .png()
    .toBuffer();
  return `data:image/png;base64,${buf.toString('base64')}`;
}

async function build({ id, W, H, cell, badgeSpec, headline, headSize, headX, headTop, photo, zone }) {
  assertGlyphs(headline.flat().map((r) => r.text).join(''), bold);

  const limit = zone.x > 0 ? zone.x - headX - Math.round(W * 0.03) : W - headX * 2;
  for (const line of headline) {
    const t = line.map((r) => r.text).join('');
    const w = measure(t, headSize, -0.028, bold);
    console.log(`  ${id} "${t}" ${Math.round(w)}px / limite ${limit}px${w > limit ? '  <-- ESTOURA' : ''}`);
  }

  const uri = await cutoutDataUri(photo, zone.w, zone.h);
  const b = badge(badgeSpec.text, badgeSpec);

  const lineH = headSize * 0.95;
  let baseline = headTop + bold.ascent * fontScale(headSize, bold);
  const head = [];
  for (const line of headline) {
    head.push(outlined(line, { size: headSize, tracking: -0.028, x: headX, baseline, face: bold }));
    baseline += lineH;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`
    + `<rect width="${W}" height="${H}" fill="${colors.background}"/>`
    + grid(W, H, cell)
    + `<image x="${zone.x}" y="${zone.y}" width="${zone.w}" height="${zone.h}" xlink:href="${uri}"/>`
    + b
    + head.join('')
    + `</svg>`;

  const buf = Buffer.from(svg);
  await sharp(buf).resize(W, H, { fit: 'fill' }).png({ compressionLevel: 9 }).toFile(path.join(outRoot, `${id}.png`));
  await sharp(buf).resize(W, H, { fit: 'fill' }).jpeg({ quality: 92, chromaSubsampling: '4:4:4' }).toFile(path.join(outRoot, `${id}.jpg`));
}

const alvo = (process.argv[2] ?? 'ambos').toLowerCase();

const COPY = {
  badge: 'CONSTRUINDO COM IA',
  linhas: [
    [{ text: 'PRODUTOS', fill: colors.text }],
    [{ text: 'REAIS, NÃO', fill: colors.text }],
    [{ text: 'PROMESSA.', fill: colors.text }],
  ],
};

if (alvo === 'horizontal' || alvo === 'ambos') {
  await build({
    id: 'capa-horizontal',
    W: 1280, H: 720, cell: 48,
    badgeSpec: { text: COPY.badge, x: 64, y: 56, size: 26, height: 56 },
    headline: COPY.linhas, headSize: 90, headX: 64, headTop: 176,
    photo: 'leo-ferraz-cutout-front.png',
    zone: { x: 640, y: 0, w: 640, h: 720 },
  });
}

if (alvo === 'vertical' || alvo === 'ambos') {
  await build({
    id: 'capa-vertical',
    W: 1080, H: 1920, cell: 60,
    badgeSpec: { text: COPY.badge, x: 72, y: 300, size: 30, height: 64 },
    headline: COPY.linhas, headSize: 118, headX: 72, headTop: 430,
    photo: 'leo-ferraz-cutout-front.png',
    zone: { x: 0, y: 880, w: 1080, h: 1040 },
  });
}

console.log('\nGerado em brand-assets/capas/');
