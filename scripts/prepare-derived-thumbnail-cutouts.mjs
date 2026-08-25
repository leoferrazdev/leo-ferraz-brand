import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const [, , input, output] = process.argv;
if (!input || !output) throw new Error('Uso: node scripts/prepare-derived-thumbnail-cutouts.mjs <entrada> <saida>');

const { data, info } = await sharp(input).removeAlpha().ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const width = info.width;
const height = info.height;
const pixels = width * height;
const candidate = new Uint8Array(pixels);
const visited = new Uint8Array(pixels);
const queue = new Int32Array(pixels);
let head = 0;
let tail = 0;

function isCheckerboardPixel(index) {
  const offset = index * 4;
  const r = data[offset];
  const g = data[offset + 1];
  const b = data[offset + 2];
  const spread = Math.max(r, g, b) - Math.min(r, g, b);
  const luminance = (r + g + b) / 3;
  // The generated checkerboard contains white, light gray and lightly
  // antialiased gray cells. Restrict the flood to near-neutral bright pixels
  // so skin, hair and shirt highlights remain untouched.
  return spread <= 75 && luminance >= 160;
}

for (let i = 0; i < pixels; i++) candidate[i] = isCheckerboardPixel(i) ? 1 : 0;

function enqueue(index) {
  if (!candidate[index] || visited[index]) return;
  visited[index] = 1;
  queue[tail++] = index;
}

for (let x = 0; x < width; x++) {
  enqueue(x);
  enqueue((height - 1) * width + x);
}
for (let y = 0; y < height; y++) {
  enqueue(y * width);
  enqueue(y * width + width - 1);
}

while (head < tail) {
  const index = queue[head++];
  const x = index % width;
  const y = Math.floor(index / width);
  if (x > 0) enqueue(index - 1);
  if (x + 1 < width) enqueue(index + 1);
  if (y > 0) enqueue(index - width);
  if (y + 1 < height) enqueue(index + width);
}

let removed = 0;
for (let i = 0; i < pixels; i++) {
  if (!visited[i]) continue;
  data[i * 4 + 3] = 0;
  removed++;
}

fs.mkdirSync(path.dirname(output), { recursive: true });
await sharp(data, { raw: { width, height, channels: 4 } }).png({ compressionLevel: 9 }).toFile(output);
console.log(`${path.basename(input)} -> ${path.basename(output)}: removed ${removed} background pixels from ${pixels}`);
