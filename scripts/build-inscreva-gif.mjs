// Animated subscribe CTA for scene 04.
//
// Unlike 04-cafe.gif, this one does NOT take over a slot. Scene 04 has no free
// rectangle: the camera slot is the founder's face and the right column is
// reserved for chat. A subscribe prompt must not permanently sit on either, so
// this card has a transparent background and animates itself in and out. Turn
// the source on once and leave it: it shows for the first 5.7s of a 10s loop
// and is invisible the rest of the time.
//
// GIF alpha is 1 bit, not 8. That rules out a fade, which would hard-clip at the
// alpha threshold and flicker. Hence a horizontal slide, and hence all type sits
// on the solid capsule rather than on transparency, so no glyph edge ever has to
// anti-alias against nothing.
//
// Authored at 2x and placed at 1x, same reason as the coffee card.

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

const SCALE = 2;
const W = 288 * SCALE; // matches the width of the scene's right column
const H = 150 * SCALE;

const colors = {
  accent: '#4DA3FF',
  ink: '#0D1117',
};

const fontFile = (family, file) => path.join(root, 'node_modules', '@fontsource', family, 'files', file);
const bold = createFont(fs.readFileSync(fontFile('ibm-plex-sans', 'ibm-plex-sans-latin-700-normal.woff2')));
const mono = createFont(fs.readFileSync(fontFile('ibm-plex-mono', 'ibm-plex-mono-latin-500-normal.woff2')));

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

// Card geometry, all at 2x.
const CARD = { x: 8, y: 44, w: W - 16, h: 212, rx: 26 };
const PAD_L = 30;
const BELL = 54;
const GAP = 20;
const TEXT_X = CARD.x + PAD_L + BELL + GAP;

const LINE1 = 'INSCREVA-SE';
const LINE2 = '@leoferrazdev';
assertGlyphs(LINE1, bold);
assertGlyphs(LINE2, mono);

const SIZE1 = 44;
const TRACK1 = 0.02;
const SIZE2 = 26;
const TRACK2 = 0.04;

// A line that overruns the card clips the handle, and the clip is easy to miss
// at 1x. Fail loudly instead of shipping a truncated CTA.
const limit = CARD.x + CARD.w - TEXT_X - 26;
for (const [label, size, tracking, face] of [[LINE1, SIZE1, TRACK1, bold], [LINE2, SIZE2, TRACK2, mono]]) {
  const w = measure(label, size, tracking, face);
  if (w > limit) throw new Error(`"${label}" mede ${Math.round(w)}px contra o limite de ${Math.round(limit)}px do cartao`);
}

// Bell drawn from a pivot at its crown, so the ring swings the way a real bell
// does rather than spinning about its middle.
function bell(angle) {
  const bx = CARD.x + PAD_L + BELL / 2;
  const by = CARD.y + CARD.h / 2;
  const s = BELL;
  const pivotY = by - s * 0.46;
  const dome = `M ${num(bx - s * 0.40)} ${num(by + s * 0.24)}`
    + ` C ${num(bx - s * 0.40)} ${num(by - s * 0.06)}, ${num(bx - s * 0.30)} ${num(by - s * 0.34)}, ${num(bx)} ${num(by - s * 0.34)}`
    + ` C ${num(bx + s * 0.30)} ${num(by - s * 0.34)}, ${num(bx + s * 0.40)} ${num(by - s * 0.06)}, ${num(bx + s * 0.40)} ${num(by + s * 0.24)} Z`;
  return `<g transform="rotate(${num(angle)} ${num(bx)} ${num(pivotY)})">`
    + `<circle cx="${num(bx)}" cy="${num(pivotY)}" r="${num(s * 0.075)}" fill="${colors.ink}"/>`
    + `<path d="${dome}" fill="${colors.ink}"/>`
    + `<rect x="${num(bx - s * 0.50)}" y="${num(by + s * 0.22)}" width="${num(s)}" height="${num(s * 0.11)}" rx="${num(s * 0.055)}" fill="${colors.ink}"/>`
    + `<circle cx="${num(bx)}" cy="${num(by + s * 0.44)}" r="${num(s * 0.11)}" fill="${colors.ink}"/>`
    + `</g>`;
}

function card(dx, angle) {
  const cap1 = bold.capHeight ?? bold.ascent * 0.7;
  const cap2 = mono.capHeight ?? mono.ascent * 0.7;
  const base1 = CARD.y + CARD.h / 2 - 14 + (cap1 * fontScale(SIZE1, bold)) / 2;
  const base2 = CARD.y + CARD.h / 2 + 52 + (cap2 * fontScale(SIZE2, mono)) / 2;
  return `<g transform="translate(${num(dx)} 0)">`
    + `<rect x="${CARD.x}" y="${CARD.y}" width="${CARD.w}" height="${CARD.h}" rx="${CARD.rx}" fill="${colors.accent}"/>`
    + bell(angle)
    + outlined(LINE1, { size: SIZE1, tracking: TRACK1, x: TEXT_X, baseline: base1, fill: colors.ink, face: bold })
    + outlined(LINE2, { size: SIZE2, tracking: TRACK2, x: TEXT_X, baseline: base2, fill: colors.ink, face: mono })
    + `</g>`;
}

const FPS = 12.5;

const T_IN = 0.48;
const T_OUT_START = 5.20;
const T_OUT_END = 5.68;
const RINGS = [1.15, 3.05];

// Only the moving part is stored. The long pause afterwards is a single empty
// frame whose delay is stretched below, so the cycle costs 72 frames instead of
// the ~350 a constant frame rate would need for the same rhythm.
const FRAMES = Math.ceil(T_OUT_END * FPS) + 1;
const IDLE_SECONDS = 22;

const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeIn = (t) => t * t * t;
const TRAVEL = W + 16; // fully clear of the canvas, so no sliver lingers

const EMPTY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"></svg>`;

function frameSvg(t) {
  let dx;
  if (t < T_IN) dx = TRAVEL * (1 - easeOut(t / T_IN));
  else if (t < T_OUT_START) dx = 0;
  else if (t < T_OUT_END) dx = TRAVEL * easeIn((t - T_OUT_START) / (T_OUT_END - T_OUT_START));
  else return EMPTY;

  // Damped oscillation, so the bell settles instead of stopping dead.
  let angle = 0;
  for (const r of RINGS) {
    const e = t - r;
    if (e >= 0 && e < 0.75) angle += 15 * Math.sin(e * Math.PI * 7) * Math.exp(-e * 4.2);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`
    + card(dx, angle) + `</svg>`;
}

// Walk the GIF block structure to find every Graphic Control Extension and
// rewrite the last one's delay. Scanning for the 21 F9 04 signature instead
// would be shorter and wrong: those bytes occur inside LZW image data too, and
// a hit there would corrupt the pixels rather than the timing.
function stretchLastDelay(file, seconds) {
  const buf = fs.readFileSync(file);
  if (buf.toString('latin1', 0, 3) !== 'GIF') throw new Error('nao e um GIF');
  let p = 6;
  const packed = buf[p + 4];
  p += 7;
  if (packed & 0x80) p += 3 * (1 << ((packed & 7) + 1));

  const skipSubBlocks = () => {
    while (buf[p] !== 0) p += buf[p] + 1;
    p += 1;
  };

  let lastGce = -1;
  for (;;) {
    const marker = buf[p];
    if (marker === 0x3b || p >= buf.length) break;
    if (marker === 0x21) {
      const label = buf[p + 1];
      if (label === 0xf9) lastGce = p + 3; // first byte of the 4-byte sub-block
      p += 2;
      skipSubBlocks();
    } else if (marker === 0x2c) {
      const lp = buf[p + 9];
      p += 10;
      if (lp & 0x80) p += 3 * (1 << ((lp & 7) + 1));
      p += 1; // LZW minimum code size
      skipSubBlocks();
    } else {
      throw new Error(`bloco GIF inesperado 0x${marker.toString(16)} em ${p}`);
    }
  }
  if (lastGce < 0) throw new Error('nenhum bloco de controle encontrado');

  const cs = Math.round(seconds * 100);
  if (cs > 0xffff) throw new Error('atraso acima do maximo do formato');
  buf.writeUInt16LE(cs, lastGce + 1);
  fs.writeFileSync(file, buf);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'insc-'));
try {
  for (let i = 0; i < FRAMES; i++) {
    const svg = frameSvg(i / FPS);
    await sharp(Buffer.from(svg)).resize(W, H, { fit: 'fill' }).png().toFile(path.join(tmp, `f${String(i).padStart(3, '0')}.png`));
  }

  // dither=none because the card is flat vector fill. Dithering a flat colour
  // sprays noise the GIF cannot run-length encode, and here it nearly doubled
  // the file for no visible gain: 588 KB dithered against 313 KB flat.
  //
  // reserve_transparent and alpha_threshold are what carry the 1-bit alpha
  // through the palette. Without them the idle frames come back solid black.
  const palette = path.join(tmp, 'palette.png');
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(FPS), '-i', path.join(tmp, 'f%03d.png'),
    '-vf', 'palettegen=stats_mode=full:reserve_transparent=1:max_colors=32', palette]);

  const out = path.join(outDir, '04-inscreva-se.gif');
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(FPS), '-i', path.join(tmp, 'f%03d.png'), '-i', palette,
    '-lavfi', 'paletteuse=dither=none:alpha_threshold=128', '-loop', '0', out]);

  stretchLastDelay(out, IDLE_SECONDS);

  const kb = fs.statSync(out).size / 1024;
  const cycle = T_OUT_END + IDLE_SECONDS;
  console.log(`04-inscreva-se.gif  ${W}x${H}  ${FRAMES} quadros  ${kb.toFixed(0)} KB`);
  console.log(`ciclo de ${cycle.toFixed(1)}s, visivel ${T_OUT_END.toFixed(1)}s (${Math.round(T_OUT_END / cycle * 100)}%), transparente o resto`);
  console.log('posicionar em x 1592  y 845  com 288x150, sobre a base da coluna direita');
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
