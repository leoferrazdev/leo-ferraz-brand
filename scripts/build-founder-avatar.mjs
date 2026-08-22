import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

sharp.concurrency(1);
sharp.cache(false);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const AVATAR_BACKGROUND = [13, 17, 23];
export const AVATAR_SIZES = [1024, 512, 256];
export const SOURCE_EXPECTATION = Object.freeze({
  width: 1122,
  height: 1402,
  hasAlpha: true,
});
export const SOURCE_CROP = Object.freeze({ left: 151, top: 0, width: 820, height: 820 });

const PNG_OPTIONS = Object.freeze({ compressionLevel: 9 });
const DEFAULT_SOURCE_PATH = path.join(
  root,
  'brand-assets',
  'profile',
  'leo-ferraz',
  'leo-ferraz-cutout-arms-crossed.png',
);

export async function buildFounderAvatar({
  sourcePath = DEFAULT_SOURCE_PATH,
  outputDir = path.join(root, 'brand-assets', 'profile', 'avatar'),
  sourceExpectation = SOURCE_EXPECTATION,
  sourceCrop = SOURCE_CROP,
} = {}) {
  const metadata = await sharp(sourcePath).metadata();
  if (
    metadata.width !== sourceExpectation.width
    || metadata.height !== sourceExpectation.height
    || metadata.hasAlpha !== sourceExpectation.hasAlpha
  ) {
    throw new Error(
      `Founder avatar source must be the approved ${sourceExpectation.width}x${sourceExpectation.height} transparent cutout.`,
    );
  }

  await mkdir(outputDir, { recursive: true });

  const nativeComposite = await sharp(sourcePath)
    .extract(sourceCrop)
    .flatten({ background: { r: 13, g: 17, b: 23 } })
    .png(PNG_OPTIONS)
    .toBuffer();

  const master = await sharp(nativeComposite)
    .resize(1024, 1024, { fit: 'fill', kernel: sharp.kernel.lanczos3 })
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
