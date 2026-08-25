// Approved founder-cutout thumbnail pack.
//
// This pack is deliberately separate from the published v1 reference-pattern
// exports. It promotes the approved transparent founder portraits as reusable
// production sources without silently replacing the current public thumbnails.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { create as createFont } from 'fontkitten';

sharp.concurrency(1);
sharp.cache(false);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const photoRoot = path.join(root, 'brand-assets', 'profile', 'leo-ferraz');
const outRoot = path.join(root, 'brand-assets', 'thumbnails', 'versions', 'v2-approved-founder-cutouts');
const deliveryRoot = path.join(root, 'brand-assets', 'exports', 'day-1', '05-youtube', 'versions', 'v2-approved-founder-cutouts');

const W = 1280;
const H = 720;
// Start the image zone earlier so the left-presenting hand has room to remain
// completely visible without being clipped at the old column boundary.
const PHOTO_X = 620;
const PHOTO_W = W - PHOTO_X;

const colors = {
  background: '#0D1117',
  text: '#F3F6FA',
  muted: '#7F8B99',
  accent: '#4DA3FF',
  grid: '#405064',
  live: '#E5484D',
};

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
  const missing = [...new Set([...text])].filter((character) => character !== ' ' && !face.glyphForCodePoint(character.codePointAt(0))?.path?.commands?.length);
  if (missing.length) throw new Error(`fonte sem glifo para ${missing.map((character) => `"${character}"`).join(', ')}`);
}

function outlined(runs, { size, tracking = 0, x, baseline, face = bold }) {
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

function grid() {
  const lines = [];
  for (let x = 48; x < W; x += 48) lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${colors.grid}" stroke-opacity="0.45" stroke-width="1"/>`);
  for (let y = 48; y < H; y += 48) lines.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${colors.grid}" stroke-opacity="0.45" stroke-width="1"/>`);
  return lines.join('');
}

function badge() {
  const text = 'AO VIVO';
  const size = 26;
  const tracking = 0.06;
  const x = 72;
  const y = 52;
  const height = 56;
  const dot = 16;
  const padLeft = 22;
  const gap = 14;
  const padRight = 28;
  const width = padLeft + dot + gap + measure(text, size, tracking, bold) - tracking * size + padRight;
  const cy = y + height / 2;
  const capHeight = bold.capHeight ?? bold.ascent * 0.7;
  const baseline = number(cy + (capHeight * fontScale(size, bold)) / 2);
  return [
    `<rect x="${x}" y="${y}" width="${number(width)}" height="${height}" rx="${height / 2}" fill="${colors.live}"/>`,
    `<circle cx="${x + padLeft + dot / 2}" cy="${cy}" r="${dot / 2}" fill="#FFFFFF"/>`,
    outlined([{ text, fill: '#FFFFFF' }], { size, tracking, x: x + padLeft + dot + gap, baseline }),
  ].join('');
}

function kicker(text) {
  const size = 26;
  const tracking = 0.16;
  const y = 156;
  const baseline = number(y + (mono.capHeight ?? mono.ascent * 0.7) * fontScale(size, mono));
  return outlined([{ text, fill: colors.accent }], { size, tracking, x: 76, baseline, face: mono });
}

function headlineFirstVideo() {
  const size = 118;
  const tracking = -0.025;
  const lines = [
    [{ text: 'AQUI ESTÁ', fill: colors.text }],
    [{ text: 'O PORQUÊ', fill: colors.accent }, { text: '.', fill: colors.text }],
  ];
  let baseline = number(270 + bold.ascent * fontScale(size, bold));
  return lines.map((line) => {
    const result = outlined(line, { size, tracking, x: 76, baseline });
    baseline += size * 0.96;
    return result;
  }).join('');
}

function subline() {
  const text = 'CUSTO · RECEITA · RESULTADO';
  const size = 25;
  const tracking = 0.10;
  const baseline = number(590 + mono.ascent * fontScale(size, mono));
  return outlined([{ text, fill: colors.muted }], { size, tracking, x: 76, baseline, face: mono });
}

function headlineLive() {
  const line1 = 'CONSTRUINDO';
  const line2 = [{ text: 'PRODUTOS ', fill: colors.text }, { text: 'REAIS', fill: colors.accent }, { text: ' COM IA', fill: colors.text }];
  const size1 = 92;
  const size2 = 46;
  const top = 270;
  return [
    outlined([{ text: line1, fill: colors.text }], { size: size1, tracking: -0.028, x: 76, baseline: number(top + bold.ascent * fontScale(size1, bold)) }),
    outlined(line2, { size: size2, tracking: -0.018, x: 76, baseline: number(top + size1 * 0.98 + 16 + bold.ascent * fontScale(size2, bold)) }),
  ].join('');
}

async function alphaBounds(file) {
  const { data, info } = await sharp(path.join(photoRoot, file)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let minX = info.width; let minY = info.height; let maxX = -1; let maxY = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * info.channels + 3] > 16) {
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      }
    }
  }
  if (maxX < 0) throw new Error(`fonte sem pixels visíveis: ${file}`);
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

async function photoUri(file, { width = PHOTO_W, fit = 'cover' } = {}) {
  const bounds = await alphaBounds(file);
  const buffer = await sharp(path.join(photoRoot, file))
    .extract(bounds)
    // Approved founder portraits fill the editorial photo band. Derived
    // variants may change the silhouette, but not the dominant scale.
    .resize(width, H, { fit, position: 'south', background: { r: 0, g: 0, b: 0, alpha: 0 }, kernel: 'lanczos3' })
    .png({ compressionLevel: 9 })
    .toBuffer();
  return `data:image/png;base64,${buffer.toString('base64')}`;
}

function coverSvg(kind, photo, { photoX = PHOTO_X, photoW = PHOTO_W } = {}) {
  const content = kind === 'first-video'
    ? `${kicker('PRODUTOS REAIS COM IA')}${headlineFirstVideo()}${subline()}`
    : `${badge()}${headlineLive()}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`
    + `<rect width="${W}" height="${H}" fill="${colors.background}"/>`
    + grid()
    + `<image x="${photoX}" y="0" width="${photoW}" height="${H}" xlink:href="${photo}" preserveAspectRatio="xMidYMid meet"/>`
    + content
    + `<rect x="0" y="${H - 8}" width="${W}" height="8" fill="${colors.accent}"/>`
    + `</svg>`;
}

const variants = [
  { kind: 'first-video', dir: 'first-video/front', file: 'thumbnail-derived/leo-ferraz-cutout-front-shoulder-extended.png', id: 'first-video-front', photoX: 520, photoW: 760 },
  { kind: 'first-video', dir: 'first-video/smile-three-quarter', file: 'leo-ferraz-cutout-smile-three-quarter.png', id: 'first-video-smile-three-quarter', photoX: 520, photoW: 760 },
  { kind: 'first-video', dir: 'first-video/present-left', file: 'thumbnail-derived/leo-ferraz-cutout-present-left-no-hand.png', id: 'first-video-present-left', photoX: 520, photoW: 760, fit: 'contain' },
  { kind: 'live-day-1', dir: 'live-day-1/arms-crossed', file: 'leo-ferraz-cutout-arms-crossed.png', id: 'live-day-1-arms-crossed' },
  { kind: 'live-day-1', dir: 'live-day-1/neutral', file: 'leo-ferraz-cutout-neutral.png', id: 'live-day-1-neutral' },
  { kind: 'live-day-1', dir: 'live-day-1/smile-three-quarter', file: 'leo-ferraz-cutout-smile-three-quarter.png', id: 'live-day-1-smile-three-quarter' },
];

fs.rmSync(outRoot, { recursive: true, force: true });
fs.rmSync(deliveryRoot, { recursive: true, force: true });

for (const variant of variants) {
  assertGlyphs(variant.kind === 'first-video' ? 'PRODUTOS REAIS COM IA AQUI ESTÁ O PORQUÊ CUSTO RECEITA RESULTADO' : 'AO VIVO CONSTRUINDO PRODUTOS REAIS COM IA', bold);
  const photo = await photoUri(variant.file, { width: variant.photoW ?? PHOTO_W, fit: variant.fit ?? 'cover' });
  const svg = coverSvg(variant.kind, photo, { photoX: variant.photoX, photoW: variant.photoW });
  const outputDir = path.join(outRoot, variant.dir);
  const deliveryDir = path.join(deliveryRoot, variant.dir);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(deliveryDir, { recursive: true });
  const pngPath = path.join(outputDir, 'thumbnail-1280x720.png');
  const jpgPath = path.join(outputDir, 'thumbnail-1280x720.jpg');
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(pngPath);
  await sharp(Buffer.from(svg)).jpeg({ quality: 92, chromaSubsampling: '4:4:4' }).toFile(jpgPath);
  fs.copyFileSync(pngPath, path.join(deliveryDir, 'thumbnail-1280x720.png'));
  fs.copyFileSync(jpgPath, path.join(deliveryDir, 'thumbnail-1280x720.jpg'));
  console.log(`${variant.id}: ${variant.file}`);
}

const readme = [
  '# Approved Founder Cutout Thumbnail Pack v2',
  '',
  'Pack de variações gerado a partir do pool aprovado em `brand-assets/profile/leo-ferraz/`.',
  '',
  'Este pack não substitui os exports publicados em `day-1/05-youtube/` nem sobrescreve o `v1-reference-pattern`.',
  '',
  '## Fontes e aplicações',
  '',
  '| Aplicação | Fonte | Saída |',
  '| --- | --- | --- |',
  '| Primeiro vídeo | `thumbnail-derived/leo-ferraz-cutout-front-shoulder-extended.png` | `first-video/front/` |',
  '| Primeiro vídeo | `leo-ferraz-cutout-smile-three-quarter.png` | `first-video/smile-three-quarter/` |',
  '| Primeiro vídeo | `thumbnail-derived/leo-ferraz-cutout-present-left-no-hand.png` | `first-video/present-left/` |',
  '| Live Dia 1 | `leo-ferraz-cutout-arms-crossed.png` | `live-day-1/arms-crossed/` |',
  '| Live Dia 1 | `leo-ferraz-cutout-neutral.png` | `live-day-1/neutral/` |',
  '| Live Dia 1 | `leo-ferraz-cutout-smile-three-quarter.png` | `live-day-1/smile-three-quarter/` |',
  '',
  '## Regras preservadas',
  '',
  '- `#0D1117` e grid estrutural de 48px, sem redução de opacidade;',
  '- headline à esquerda, retrato ampliado à direita;',
  '- retratos frontais e `present-left` usam faixa dominante de 760px; a variante `present-left` remove o gesto manual para manter somente o corpo do fundador;',
  '- headline, copy, safe zone e barra inferior do Reference Pattern;',
  '- IBM Plex Sans para headline e IBM Plex Mono para kicker/subline;',
  '- foto completa, sem fade, sombra, escurecimento ou recorte de gesto;',
  '- sem logo redesenhada, sem texto estratégico novo e sem alteração do padrão publicado.',
  '',
].join('\n');
fs.writeFileSync(path.join(outRoot, 'README.md'), readme);
fs.mkdirSync(deliveryRoot, { recursive: true });
fs.copyFileSync(path.join(outRoot, 'README.md'), path.join(deliveryRoot, 'README.md'));
console.log(`Geradas ${variants.length} variações aprovadas.`);
