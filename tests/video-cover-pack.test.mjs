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
  assert.deepEqual(entries, [
    {
      id: 'produtos-reais',
      category: 'CONSTRUINDO COM IA',
      headlineLines: ['PRODUTOS', 'REAIS, NÃO', 'PROMESSA.'],
      portrait: 'leo-ferraz-cutout-front.png',
    },
    {
      id: 'do-zero-ao-produto',
      category: 'EM CONSTRUÇÃO',
      headlineLines: ['DO ZERO AO', 'PRODUTO REAL.'],
      portrait: 'leo-ferraz-cutout-present-left.png',
    },
    {
      id: 'isso-nao-funcionou',
      category: 'EXPERIMENTO',
      headlineLines: ['ISSO NÃO', 'FUNCIONOU.'],
      portrait: 'leo-ferraz-cutout-neutral.png',
    },
    {
      id: 'coloquei-no-ar',
      category: 'LANÇAMENTO',
      headlineLines: ['COLOQUEI NO', 'AR. E AGORA?'],
      portrait: 'leo-ferraz-cutout-smile-three-quarter.png',
    },
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

test('renderer uses canonical palette, primary symbol and no forbidden treatment', async () => {
  const [entry] = await loadCoverManifest(manifestPath);
  const { svg, metrics } = await renderCoverSvg({ entry, format: 'horizontal', rootDir: root });
  const markup = svg.toString('utf8');
  assert.match(markup, /#0D1117/);
  assert.match(markup, /#405064/);
  assert.match(markup, /#4DA3FF/);
  assert.match(markup, /data-mark="constructed-lf"/);
  assert.doesNotMatch(markup, /linearGradient|radialGradient|filter|feGaussianBlur/);
  assert.equal(metrics.width, 1280);
  assert.equal(metrics.height, 720);
  assert.equal(metrics.overflow, false);
});

test('vertical renderer keeps all essential layout bounds inside the safe area', async () => {
  const [entry] = await loadCoverManifest(manifestPath);
  const { metrics } = await renderCoverSvg({ entry, format: 'vertical', rootDir: root });
  assert.equal(metrics.width, 1080);
  assert.equal(metrics.height, 1920);
  assert.ok(metrics.essentialBottom <= 1620);
  assert.ok(metrics.essentialRight <= 930);
  assert.ok(metrics.faceZoneTop >= 950);
  assert.ok(metrics.faceZoneBottom <= 1450);
  assert.equal(metrics.overflow, false);
});

test('renderer expands uniform line spacing for accented Portuguese glyph bounds', async () => {
  const [entry] = await loadCoverManifest(manifestPath);
  const { metrics } = await renderCoverSvg({
    entry: {
      ...entry,
      category: 'ACENTOS ÀÇ',
      headlineLines: ['ÇÇÇÇÇ', 'ÀÀÀÀÀ'],
    },
    format: 'horizontal',
    rootDir: root,
  });
  assert.ok(metrics.headlineLineHeight > metrics.headlineSize * 0.95);
  assert.ok(metrics.headlineLineHeight >= metrics.minimumSafeLineHeight);
  assert.ok(metrics.headlineLineBounds[0].bottom <= metrics.headlineLineBounds[1].top);
});

test('renderer rejects .notdef glyphs in headline and category copy', async () => {
  const [entry] = await loadCoverManifest(manifestPath);
  await assert.rejects(
    () => renderCoverSvg({
      entry: { ...entry, category: '字' },
      format: 'horizontal',
      rootDir: root,
    }),
    /font has no glyph for "字"/,
  );
  await assert.rejects(
    () => renderCoverSvg({
      entry: { ...entry, headlineLines: ['字', 'VÁLIDO'] },
      format: 'horizontal',
      rootDir: root,
    }),
    /font has no glyph for "字"/,
  );
});
