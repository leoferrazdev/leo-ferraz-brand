import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

import {
  AVATAR_BACKGROUND,
  AVATAR_SIZES,
  SOURCE_CROP,
  buildFounderAvatar,
} from '../scripts/build-founder-avatar.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(
  root,
  'brand-assets',
  'profile',
  'leo-ferraz',
  'leo-ferraz-cutout-arms-crossed.png',
);

const EXPECTED_SOURCE_SHA256 =
  '45b1c324cae0f765fe81f8687c68557af04f5b091b28bb66f23e8cb0eab1685a';

function pixelRgb(data, info, x, y) {
  const offset = (y * info.width + x) * info.channels;
  return [...data.subarray(offset, offset + 3)];
}

test('buildFounderAvatar creates deterministic opaque social exports', async () => {
  const outputDir = await mkdtemp(path.join(tmpdir(), 'leo-ferraz-avatar-'));

  try {
    const sourceBuffer = await readFile(sourcePath);
    assert.equal(
      createHash('sha256').update(sourceBuffer).digest('hex'),
      EXPECTED_SOURCE_SHA256,
    );

    const source = await sharp(sourceBuffer).metadata();
    assert.equal(source.width, 1122);
    assert.equal(source.height, 1402);
    assert.equal(source.hasAlpha, true);
    assert.deepEqual(SOURCE_CROP, { left: 151, top: 0, width: 820, height: 820 });

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

test('buildFounderAvatar flattens hidden light RGB before resizing', async () => {
  const outputDir = await mkdtemp(path.join(tmpdir(), 'leo-ferraz-avatar-edge-'));

  try {
    const synthetic = Buffer.alloc(8 * 8 * 4, 255);
    for (let pixel = 0; pixel < 8 * 8; pixel += 1) {
      synthetic[pixel * 4 + 3] = 0;
    }
    for (let y = 2; y < 6; y += 1) {
      for (let x = 2; x < 6; x += 1) {
        const offset = (y * 8 + x) * 4;
        synthetic[offset] = 77;
        synthetic[offset + 1] = 163;
        synthetic[offset + 2] = 255;
        synthetic[offset + 3] = 255;
      }
    }

    const syntheticPath = path.join(outputDir, 'hidden-white-edge-fixture.png');
    await sharp(synthetic, { raw: { width: 8, height: 8, channels: 4 } })
      .png()
      .toFile(syntheticPath);

    const syntheticOutputDir = path.join(outputDir, 'synthetic');
    await buildFounderAvatar({
      sourcePath: syntheticPath,
      outputDir: syntheticOutputDir,
      sourceExpectation: { width: 8, height: 8, hasAlpha: true },
      sourceCrop: { left: 0, top: 0, width: 8, height: 8 },
    });

    const masterPath = path.join(syntheticOutputDir, 'leo-ferraz-avatar-1024.png');
    const { data, info } = await sharp(masterPath).raw().toBuffer({ resolveWithObject: true });
    const corners = [
      [0, 0],
      [info.width - 1, 0],
      [0, info.height - 1],
      [info.width - 1, info.height - 1],
    ];
    for (const [x, y] of corners) {
      assert.deepEqual(pixelRgb(data, info, x, y), AVATAR_BACKGROUND);
    }
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});
