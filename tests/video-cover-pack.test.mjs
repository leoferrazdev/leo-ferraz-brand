import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

import {
  APPROVED_PORTRAITS,
  COVER_FORMATS,
  buildCoverPack,
  loadCoverManifest,
  renderCoverSvg,
  validateCoverManifest,
} from '../scripts/lib/video-cover-pack.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(root, 'brand-assets', 'capas', 'master-pack', 'content.json');

test('manifest declares four unique demonstrative PT-BR concepts', async () => {
  const entries = await loadCoverManifest(manifestPath);
  assert.equal(entries.length, 4);
  assert.deepEqual(entries.map(({ id }) => id), [
    'produtos-reais',
    'do-zero-ao-produto',
    'isso-nao-funcionou',
    'coloquei-no-ar',
  ]);
  assert.doesNotThrow(() => validateCoverManifest(entries));
});

test('manifest rejects duplicate ids, unknown portraits and invalid line counts', () => {
  const valid = {
    id: 'example',
    category: 'EXPERIMENTO',
    headlineLines: ['ISSO NÃO', 'FUNCIONOU.'],
    portrait: 'leo-ferraz-cutout-neutral.png',
  };
  assert.throws(() => validateCoverManifest([valid, valid]), /duplicate id: example/);
  assert.throws(
    () => validateCoverManifest([{ ...valid, portrait: 'unknown.png' }]),
    /unsupported portrait: unknown.png/,
  );
  assert.throws(
    () => validateCoverManifest([{ ...valid, headlineLines: ['ONE'] }]),
    /headlineLines must contain 2 or 3 lines/,
  );
});
