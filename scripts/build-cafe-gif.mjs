// Animated "back shortly" card for scene 04's webcam slot.
//
// Drops into the exact rectangle the camera occupies (288x162 at 1592,140), so
// the screen capture beside it stays untouched and the scene needs no other
// change when it goes up or comes down.
//
// Two things the scene already provides, which this must not repeat. The slot
// is filled with surface1 and the corner frame is drawn OUTSIDE the region, at
// a 3px offset. So the card paints surface1 to sit seamlessly inside that
// frame, and draws no corners of its own.
//
// Rendered at 2x and placed at 1x in Streamlabs: a GIF sized exactly 288x162
// would have no pixels to spare once the compositor touches it.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { create as createFont } from 'fontkitten';

sharp.concurrency(1);
sharp.cache(false);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'live', 'obs');
fs.mkdirSync(outDir, { recursive: true });

// Scene slot is 288x162. Everything below is authored at 2x.
const SCALE = 2;
const W = 288 * SCALE;
const H = 162 * SCALE;

const colors = {
  slot: '#151B24',      // the scene's own fill for this region
  grid: '#405064',
  accent: '#4DA3FF',
  steam: '#86C5FF',
  text: '#F3F6FA',
  muted: '#7F8B99',
};

const mono = createFont(fs.readFileSync(path.join(root, 'node_modules', '@fontsource', 'ibm-plex-mono', 'files', 'ibm-plex-mono-latin-500-normal.woff2')));
const fontScale = (size, face) => size / face.unitsPerEm;
const num = (v) => Number(v.toFixed(2));

function measure(text, size, tracking, face) {
  const tu = tracking * face.unitsPerEm;
  let w = 0;
  for (const c of text) w += face.glyphForCodePoint(c.codePointAt(0)).advanceWidth + tu;
  return num(w * fontScale(size, face) - tracking * size);
}

function assertGlyphs(text, face) {
  const missing = [...new Set([...text])].filter((c) => c !== ' ' && !face.glyphForCodePoint(c.codePointAt(0))?.path?.commands?.length);
  if (missing.length) throw new Error(`fonte sem glifo para ${missing.map((c) => `"${c}"`).join(', ')}`);
}

function outlined(text, { size, tracking, x, baseline, fill, face }) {
  const scale = fontScale(size, face);
  const tu = tracking * face.unitsPerEm;
  let cursor = x / scale;
  const paths = [];
  for (const c of text) {
    const g = face.glyphForCodePoint(c.codePointAt(0));
    if (g.path?.commands?.length) {
      paths.push(`<path d="${g.path.scale(scale, -scale).translate(cursor * scale, baseline).toSVG()}" fill="${fill}"/>`);
    }
    cursor += g.advanceWidth + tu;
  }
  return paths.join('');
}

// Matches the scene's 48px cell so the texture lines up with the background
// showing through around the slot.
function grid() {
  const cell = 48;
  const l = [];
  for (let x = cell; x < W; x += cell) l.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${colors.grid}" stroke-opacity="0.35" stroke-width="1"/>`);
  for (let y = cell; y < H; y += cell) l.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${colors.grid}" stroke-opacity="0.35" stroke-width="1"/>`);
  return l.join('');
}

const CX = W / 2;
const CUP_TOP = 118;
const CUP_BOTTOM = 196;

function cup() {
  const halfTop = 44;
  const halfBot = 34;
  const body = `M ${CX - halfTop} ${CUP_TOP}`
    + ` L ${CX - halfBot} ${CUP_BOTTOM - 12}`
    + ` Q ${CX - halfBot} ${CUP_BOTTOM}, ${CX - halfBot + 12} ${CUP_BOTTOM}`
    + ` L ${CX + halfBot - 12} ${CUP_BOTTOM}`
    + ` Q ${CX + halfBot} ${CUP_BOTTOM}, ${CX + halfBot} ${CUP_BOTTOM - 12}`
    + ` L ${CX + halfTop} ${CUP_TOP} Z`;
  const handle = `M ${CX + halfTop - 2} ${CUP_TOP + 14}`
    + ` C ${CX + halfTop + 34} ${CUP_TOP + 16}, ${CX + halfTop + 30} ${CUP_TOP + 58}, ${CX + halfBot + 2} ${CUP_TOP + 56}`;
  return [
    `<path d="${body}" fill="none" stroke="${colors.accent}" stroke-width="4" stroke-linejoin="round"/>`,
    `<path d="${handle}" fill="none" stroke="${colors.accent}" stroke-width="4" stroke-linecap="round"/>`,
    `<line x1="${CX - halfTop + 6}" y1="${CUP_TOP + 10}" x2="${CX + halfTop - 6}" y2="${CUP_TOP + 10}" stroke="${colors.accent}" stroke-opacity="0.5" stroke-width="3"/>`,
    `<line x1="${CX - 52}" y1="${CUP_BOTTOM + 10}" x2="${CX + 52}" y2="${CUP_BOTTOM + 10}" stroke="${colors.muted}" stroke-opacity="0.45" stroke-width="3" stroke-linecap="round"/>`,
  ].join('');
}

// Three wisps, each offset by a third of the loop. Opacity follows sin(phase*PI)
// so every wisp is fully transparent at both ends of its travel, which is what
// makes the loop seamless rather than jumping on the wrap.
const RISE = 58;
function steam(phase) {
  const parts = [];
  for (let i = 0; i < 3; i++) {
    const p = (phase + i / 3) % 1;
    const y = CUP_TOP - 8 - p * RISE;
    const opacity = Math.sin(p * Math.PI) * 0.85;
    const x = CX - 26 + i * 26;
    const sway = Math.sin(p * Math.PI * 2) * 5;
    const d = `M ${num(x)} ${num(y)}`
      + ` C ${num(x + 9 + sway)} ${num(y - 11)}, ${num(x - 9 + sway)} ${num(y - 22)}, ${num(x + sway)} ${num(y - 33)}`;
    parts.push(`<path d="${d}" fill="none" stroke="${colors.steam}" stroke-opacity="${num(opacity)}" stroke-width="4" stroke-linecap="round"/>`);
  }
  return parts.join('');
}

const LABEL = 'JÁ VOLTO';
assertGlyphs(LABEL, mono);

function label() {
  const size = 40;
  const tracking = 0.14;
  const w = measure(LABEL, size, tracking, mono);
  const cap = mono.capHeight ?? mono.ascent * 0.7;
  return outlined(LABEL, {
    size, tracking,
    x: CX - w / 2,
    baseline: 268 + (cap * fontScale(size, mono)) / 2,
    fill: colors.text,
    face: mono,
  });
}

function frameSvg(phase) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`
    + `<rect width="${W}" height="${H}" fill="${colors.slot}"/>`
    + grid()
    + steam(phase)
    + cup()
    + label()
    + `</svg>`;
}

const FPS = 12.5;
const FRAMES = 25; // 2 s exactos

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cafe-'));
try {
  for (let i = 0; i < FRAMES; i++) {
    const svg = frameSvg(i / FRAMES);
    await sharp(Buffer.from(svg)).resize(W, H, { fit: 'fill' }).png().toFile(path.join(tmp, `f${String(i).padStart(3, '0')}.png`));
  }

  // Two-pass palette. A GIF holds 256 colours, and letting ffmpeg pick them
  // from the actual frames rather than a generic palette is what keeps the
  // background flat instead of banded, which matters here because the card is
  // mostly one dark tone.
  const palette = path.join(tmp, 'palette.png');
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(FPS), '-i', path.join(tmp, 'f%03d.png'),
    '-vf', 'palettegen=stats_mode=full', palette]);

  const out = path.join(outDir, '04-cafe.gif');
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(FPS), '-i', path.join(tmp, 'f%03d.png'), '-i', palette,
    '-lavfi', 'paletteuse=dither=bayer:bayer_scale=3', '-loop', '0', out]);

  const kb = fs.statSync(out).size / 1024;
  console.log(`04-cafe.gif  ${W}x${H}  ${FRAMES} quadros  ${FPS} fps  ${(FRAMES / FPS).toFixed(1)}s  ${kb.toFixed(0)} KB`);
  console.log('posicionar em x 1592  y 140  com 288x162, no lugar da webcam');
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
