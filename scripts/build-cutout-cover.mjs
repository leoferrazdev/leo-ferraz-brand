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
const photoDerived = path.join(photoRoot, 'thumbnail-derived');
const findPhoto = (f) => (fs.existsSync(path.join(photoRoot, f)) ? path.join(photoRoot, f) : path.join(photoDerived, f));
const outRoot = path.join(root, 'brand-assets', 'capas');
fs.mkdirSync(outRoot, { recursive: true });

const colors = {
  background: '#0D1117',
  text: '#F3F6FA',
  accent: '#4DA3FF',
  grid: '#405064',
  // State, not brand. Reserved for the live badge and used nowhere else,
  // the same rule the earlier live covers already follow.
  live: '#E5484D',
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

// The standard sets 0.95 line height, which is correct for unaccented capitals
// and too tight the moment Portuguese shows up. "À" reaches 82.1px above its
// baseline at 84px body while 0.95 only leaves 79.8px, so the accent lands
// inside the line above by 3.3px. "Ç" makes it worse from the other direction,
// dropping 17.8px below its own baseline.
//
// Rather than hand-tune each cover, the spacing is solved from the glyphs that
// are actually set: for every consecutive pair, how far the lower line's ink
// rises versus how far the upper line's ink drops. Uniform across the block,
// because varying it per line reads as a mistake of its own.
function safeLineHeight(lines, size, preferred) {
  const scale = size / bold.unitsPerEm;
  const extent = (text, pick) => Math.max(0, ...[...text].map((c) => {
    const g = bold.glyphForCodePoint(c.codePointAt(0));
    if (!g.path?.commands?.length) return 0;
    return pick(g.path.bbox) * scale;
  }));
  let needed = 0;
  for (let i = 1; i < lines.length; i++) {
    const above = lines[i - 1].map((r) => r.text).join('');
    const below = lines[i].map((r) => r.text).join('');
    needed = Math.max(needed, extent(below, (b) => b.maxY) + extent(above, (b) => -b.minY));
  }
  const minimo = needed + size * 0.02;
  return Math.max(preferred, minimo);
}

function grid(W, H, cell, opacity = 0.45) {
  const l = [];
  for (let x = cell; x < W; x += cell) l.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${colors.grid}" stroke-opacity="${opacity}" stroke-width="1"/>`);
  for (let y = cell; y < H; y += cell) l.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${colors.grid}" stroke-opacity="${opacity}" stroke-width="1"/>`);
  return l.join('');
}

// Dark text on the accent, not white. #4DA3FF is light enough that white on it
// lands near 2.5:1 contrast while the dark navy reaches about 7:1. The live
// badge inverts this because #E5484D is dark enough for white to read on it,
// which is also what every platform's own live badge does.
// Three things the references do that the first build did not.
//
// The pill runs off the left edge of the frame instead of sitting inset with a
// margin. Its left rounding is drawn off-canvas so the shape reads as cut by
// the frame, which is what gives it the weight of a banner rather than a
// button. Its text still starts on the same x as the headline below, so the
// left type edge stays aligned even though the shape behind it does not.
//
// The dot follows the text rather than preceding it.
//
// And the pill is taller in proportion to the frame, near 11% against the 8%
// the first build used, which is most of why the references read louder.
function badge(text, { y, size, height, fill = colors.accent, ink = colors.background, textX = 64 }) {
  const tracking = 0.06;
  const dot = Math.round(size * 0.62);
  const gapDot = Math.round(size * 0.6);
  const padR = Math.round(size * 0.95);
  const tw = measure(text, size, tracking, bold);
  const left = -height / 2;
  const right = textX + tw + gapDot + dot + padR;
  const cy = y + height / 2;
  const cap = bold.capHeight ?? bold.ascent * 0.7;
  const baseline = number(cy + (cap * fontScale(size, bold)) / 2);
  return [
    `<rect x="${left}" y="${y}" width="${number(right - left)}" height="${height}" rx="${height / 2}" fill="${fill}"/>`,
    outlined([{ text, fill: ink }], { size, tracking, x: textX, baseline, face: bold }),
    `<circle cx="${number(textX + tw + gapDot + dot / 2)}" cy="${cy}" r="${dot / 2}" fill="${ink}"/>`,
  ].join('');
}

// Subject bounds plus, per row, the leftmost opaque pixel. The row profile is
// what makes an honest collision check possible: the figure's widest point is
// the shoulders, near the bottom, while the headline sits high on the left. A
// single bounding box would report a collision the eye never sees.
async function subjectProfile(file) {
  const { data, info } = await sharp(findPhoto(file)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let minX = Infinity; let maxX = -1; let minY = Infinity; let maxY = -1;
  const rowLeft = new Int32Array(info.height).fill(-1);
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * info.channels + 3] > 16) {
        if (rowLeft[y] < 0) rowLeft[y] = x;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1, rowLeft };
}

// The references scale the person well past the frame height so the head reads
// large and the torso is cut by the bottom edge. That is the whole difference
// in presence: a figure fitted inside the frame puts the face at roughly a
// third of the height, where the references put it near two thirds.
//
// zone.fill is the figure height as a multiple of frame height, so values above
// 1 bleed off the bottom on purpose. The figure anchors to the top rather than
// the bottom, because the head is the fixed point the composition is built on.
async function placeCutout(file, zone, band) {
  const box = await subjectProfile(file);
  const scale = (zone.h * (zone.fill ?? 1)) / box.height;
  const w = Math.round(box.width * scale);
  const h = Math.round(box.height * scale);
  const left = W_FRAME - w + (zone.bleedRight ?? 0);
  const top = zone.top ?? 0;

  // Collision measured only across the rows the headline actually occupies,
  // mapped back into source pixels.
  if (band) {
    let mostLeft = Infinity;
    for (let y = Math.max(0, band.top); y < Math.min(H_FRAME, band.bottom); y++) {
      const srcY = box.top + Math.round((y - top) / scale);
      if (srcY < 0 || srcY >= box.rowLeft.length) continue;
      const rl = box.rowLeft[srcY];
      if (rl < 0) continue;
      mostLeft = Math.min(mostLeft, left + (rl - box.left) * scale);
    }
    if (mostLeft < band.right) {
      console.log(`  AVISO figura invade a faixa da headline em ${Math.round(band.right - mostLeft)}px`);
    }
  }

  const buf = await sharp(findPhoto(file))
    .extract({ left: box.left, top: box.top, width: box.width, height: box.height })
    .resize(w, h, { fit: 'fill', kernel: 'lanczos3' })
    .png()
    .toBuffer();

  return { uri: `data:image/png;base64,${buf.toString('base64')}`, x: left, y: top, w, h };
}

let W_FRAME = 1280;
let H_FRAME = 720;

async function build({ id, W, H, cell, gridOpacity = 0.45, badgeSpec, headline, headSize, headlineTracking = -0.028, headX, headTop, photo, zone, outDir = outRoot }) {
  W_FRAME = W;
  H_FRAME = H;
  fs.mkdirSync(outDir, { recursive: true });
  assertGlyphs(headline.flat().map((r) => r.text).join(''), bold);

  const limit = zone.x > 0 ? zone.x - headX - Math.round(W * 0.03) : W - headX * 2;
  let textRight = headX;
  for (const line of headline) {
    const t = line.map((r) => r.text).join('');
    const w = measure(t, headSize, headlineTracking, bold);
    textRight = Math.max(textRight, headX + w);
    console.log(`  ${id} "${t}" ${Math.round(w)}px / limite ${limit}px${w > limit ? '  <-- ESTOURA' : ''}`);
  }

  // The headline's own vertical extent, so the collision check knows which
  // rows of the figure can actually reach it.
  const lineHprev = safeLineHeight(headline, headSize, headSize * 0.95);
  const band = {
    top: headTop,
    bottom: headTop + lineHprev * (headline.length - 1) + headSize * 1.1,
    right: Math.round(textRight) + Math.round(W * 0.02),
  };
  const fig = await placeCutout(photo, zone, band);
  console.log(`  ${id} figura ${fig.w}x${fig.h} em x=${fig.x} y=${fig.y}`);
  const b = badge(badgeSpec.text, badgeSpec);

  const lineH = safeLineHeight(headline, headSize, headSize * 0.95);
  if (lineH > headSize * 0.95 + 0.01) {
    console.log(`  ${id} entrelinha ajustada de ${(headSize * 0.95).toFixed(1)}px para ${lineH.toFixed(1)}px, por acento em maiuscula`);
  }
  let baseline = headTop + bold.ascent * fontScale(headSize, bold);
  const head = [];
  for (const line of headline) {
    head.push(outlined(line, { size: headSize, tracking: headlineTracking, x: headX, baseline, face: bold }));
    baseline += lineH;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`
    + `<rect width="${W}" height="${H}" fill="${colors.background}"/>`
    + grid(W, H, cell, gridOpacity)
    + `<image x="${fig.x}" y="${fig.y}" width="${fig.w}" height="${fig.h}" xlink:href="${fig.uri}"/>`
    + b
    + head.join('')
    + `</svg>`;

  const buf = Buffer.from(svg);
  await sharp(buf).resize(W, H, { fit: 'fill' }).png({ compressionLevel: 9 }).toFile(path.join(outDir, `${id}.png`));
  await sharp(buf).resize(W, H, { fit: 'fill' }).jpeg({ quality: 92, chromaSubsampling: '4:4:4' }).toFile(path.join(outDir, `${id}.jpg`));
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

// Live cover, day 1. Copy is the one DECISAO-020 made the default: it is
// anchored to the method rather than to an artefact, so it holds whether the
// stream is about code, video or anything else.
//
// Two departures from the generic standard, both deliberate. The badge is red
// because it signals live state, a meaning already assigned in this system and
// the convention every platform uses. And the headline stays entirely white,
// dropping the blue accent word the previous live covers carried — with a red
// badge already in frame, a blue word would put a third colour in a layout
// whose references get their cleanliness from having exactly one.
if (alvo === 'live' || alvo === 'ambos') {
  const liveCover = {
    W: 1280, H: 720, cell: 48,
    gridOpacity: 0.28,
    badgeSpec: { text: 'AO VIVO', x: 48, y: 48, size: 30, height: 64, fill: colors.live, ink: '#FFFFFF' },
    // Three lines, not the previous two. The standard's photo area is 640 wide
    // against the old live layout's 560, so the text column lost 160px and
    // "DO ERRO À SOLUÇÃO" measured 810px against a 538px limit. Broken rather
    // than shrunk: the standard sets one size for every headline line, and
    // dropping the body to fit one long line would have made the whole
    // headline smaller than the layout can carry.
    headline: [
      [{ text: 'SEM CORTES', fill: colors.text }],
      [{ text: 'DO ERRO', fill: colors.text }],
      [{ text: 'À SOLUÇÃO', fill: colors.text }],
    ],
    headSize: 102, headlineTracking: -0.10, headX: 64, headTop: 184,
    photo: 'leo-ferraz-cutout-arms-crossed.png',
    zone: { x: 640, y: 0, w: 640, h: 720, subjectScale: 1.17 },
    outDir: path.join(root, 'brand-assets', 'thumbnails'),
  };

  // `live_1` is the operational Day-1 filename used by channel setup. Keep
  // `live_4` as the historical/default alias from DECISAO-020, but derive both
  // from the same object so the approved composition cannot drift by filename.
  for (const id of ['live_1', 'live_4']) {
    await build({ id, ...liveCover });
  }
}

// The two finished covers.
//
// Photo area is sized per pose rather than fixed at the standard's 640. A pose
// only needs as much width as its own proportion demands at full frame height
// — arms-crossed at 0.75 needs 540px, present-left-no-hand at 0.83 needs 598 —
// and every pixel not spent on the figure goes to the headline column, which
// is what carries the thumbnail at small size.
if (alvo === 'entregas' || alvo === 'ambos') {
  // Positioning video. Arms crossed reads conviction, which is the register a
  // channel's opening statement needs, and at 0.75 it is the most vertical
  // pose available so it fills the frame without any scale reduction.
  await build({
    id: 'capa-primeiro-video',
    W: 1280, H: 720, cell: 48,
    badgeSpec: { text: 'PRODUTOS REAIS COM IA', y: 52, size: 34, height: 80 },
    headline: [
      [{ text: 'AQUI ESTÁ', fill: colors.text }],
      [{ text: 'O PORQUÊ.', fill: colors.text }],
    ],
    headSize: 125, headX: 64, headTop: 232,
    photo: 'leo-ferraz-cutout-arms-crossed.png',
    zone: { x: 740, y: 0, w: 540, h: 720, fill: 1.62, top: 4, bleedRight: 125 },
  });

  // Recurring live template. The hand was removed from this pose on purpose,
  // and that is exactly what a reusable base needs: a gesture would tie every
  // future live to one meaning. Copy carries no topic, per DECISAO-020, so the
  // cover never needs regenerating before going on air. Swapping it is one
  // edit here if a specific stream ever justifies the cost.
  await build({
    id: 'capa-live-recorrente',
    W: 1280, H: 720, cell: 48,
    badgeSpec: { text: 'AO VIVO', y: 52, size: 34, height: 80, fill: colors.live, ink: '#FFFFFF' },
    headline: [
      [{ text: 'CONSTRUINDO', fill: colors.text }],
      [{ text: 'PRODUTOS', fill: colors.text }],
      [{ text: 'REAIS COM IA', fill: colors.text }],
    ],
    headSize: 88, headX: 64, headTop: 238,
    photo: 'leo-ferraz-cutout-present-left-no-hand.png',
    zone: { x: 720, y: 0, w: 560, h: 720, fill: 1.55, top: 4, bleedRight: 130 },
  });
}

console.log('\nGerado.');
