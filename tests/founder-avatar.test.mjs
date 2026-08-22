import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

import { AVATAR_BACKGROUND, AVATAR_SIZES, buildFounderAvatar } from '../scripts/build-founder-avatar.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'brand-assets', 'profile', 'leo-ferraz', 'leo-ferraz-cutout-neutral.png');

test('buildFounderAvatar creates deterministic opaque social exports', async () => {
  const outputDir = await mkdtemp(path.join(tmpdir(), 'leo-ferraz-avatar-'));

  try {
    const source = await sharp(sourcePath).metadata();
    assert.equal(source.width, 1320);
    assert.equal(source.height, 1192);
    assert.equal(source.hasAlpha, true);

    const outputs = await buildFounderAvatar({ sourcePath, outputDir });
    assert.deepEqual(outputs.map(({ size }) => size), AVATAR_SIZES);

    const masterPath = path.join(outputDir, 'leo-ferraz-avatar-1024.png');
    const master = await readFile(masterPath);

    for (const size of AVATAR_SIZES) {
      const file = path.join(outputDir, `leo-ferraz-avatar-${size}.png`);
      const metadata = await sharp(file).metadata();
      assert.equal(metadata.format, 'png');
      assert.equal(metadata.width, size);
      assert.equal(metadata.height, size);
      assert.equal(metadata.hasAlpha, false);

      const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
      const backgroundSamples = [0, info.width - 1];
      for (const pixel of backgroundSamples) {
        const offset = pixel * info.channels;
        assert.deepEqual([...data.subarray(offset, offset + 3)], AVATAR_BACKGROUND);
      }

      if (size !== 1024) {
        const expected = await sharp(master)
          .resize(size, size, { fit: 'fill', kernel: sharp.kernel.lanczos3 })
          .png({ compressionLevel: 9 })
          .toBuffer();
        assert.deepEqual(await readFile(file), expected);
      }
    }
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});
