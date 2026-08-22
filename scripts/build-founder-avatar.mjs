import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

sharp.concurrency(1);
sharp.cache(false);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const AVATAR_BACKGROUND = [13, 17, 23];
export const AVATAR_SIZES = [1024, 512, 256];
export const SOURCE_CROP = Object.freeze({ left: 153, top: 0, width: 1014, height: 1014 });

const PNG_OPTIONS = Object.freeze({ compressionLevel: 9 });

export async function buildFounderAvatar({
  sourcePath = path.join(root, 'brand-assets', 'profile', 'leo-ferraz', 'leo-ferraz-cutout-neutral.png'),
  outputDir = path.join(root, 'brand-assets', 'profile', 'avatar'),
} = {}) {
  const metadata = await sharp(sourcePath).metadata();
  if (metadata.width !== 1320 || metadata.height !== 1192 || !metadata.hasAlpha) {
    throw new Error('Founder avatar source must be the approved 1320x1192 transparent cutout.');
  }

  await mkdir(outputDir, { recursive: true });

  const master = await sharp(sourcePath)
    .extract(SOURCE_CROP)
    .resize(1024, 1024, { fit: 'fill', kernel: sharp.kernel.lanczos3 })
    .flatten({ background: { r: 13, g: 17, b: 23 } })
    .png(PNG_OPTIONS)
    .toBuffer();

  const outputs = [];
  for (const size of AVATAR_SIZES) {
    const destination = path.join(outputDir, `leo-ferraz-avatar-${size}.png`);
    const buffer = size === 1024
      ? master
      : await sharp(master)
          .resize(size, size, { fit: 'fill', kernel: sharp.kernel.lanczos3 })
          .png(PNG_OPTIONS)
          .toBuffer();
    await writeFile(destination, buffer);
    outputs.push({ size, path: destination });
  }

  return outputs;
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const outputs = await buildFounderAvatar();
  for (const output of outputs) console.log(`${output.size}: ${output.path}`);
}
