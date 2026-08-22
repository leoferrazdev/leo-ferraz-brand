import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
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

async function assertBuildCoverPackRejectsEntryCount(entries, count) {
  const outputDir = await mkdtemp(path.join(tmpdir(), 'leo-ferraz-cover-pack-'));
  const temporaryManifestPath = path.join(outputDir, 'content.json');
  try {
    await writeFile(temporaryManifestPath, JSON.stringify(entries));
    await assert.rejects(
      () => buildCoverPack({ rootDir: root, outputDir, manifestPath: temporaryManifestPath }),
      new RegExp(`master pack requires exactly 4 entries; received ${count}`),
    );
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
}

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

test('buildCoverPack rejects three master-pack entries', async () => {
  const entries = (await loadCoverManifest(manifestPath)).slice(0, 3);
  assert.doesNotThrow(() => validateCoverManifest(entries));
  await assertBuildCoverPackRejectsEntryCount(entries, 3);
});

test('buildCoverPack rejects five master-pack entries', async () => {
  const entries = await loadCoverManifest(manifestPath);
  const fiveEntries = [...entries, { ...entries[0], id: 'fifth-concept' }];
  assert.doesNotThrow(() => validateCoverManifest(fiveEntries));
  await assertBuildCoverPackRejectsEntryCount(fiveEntries, 5);
});

test('buildCoverPack writes sixteen cover files and one contact sheet', async () => {
  const outputDir = await mkdtemp(path.join(tmpdir(), 'leo-ferraz-cover-pack-'));
  try {
    const result = await buildCoverPack({ rootDir: root, outputDir, manifestPath });
    assert.equal(result.covers.length, 16);
    assert.equal(result.contactSheet.endsWith('demo-master-pack-contact-sheet.png'), true);

    for (const formatName of Object.keys(COVER_FORMATS)) {
      const expected = COVER_FORMATS[formatName];
      for (const entry of await loadCoverManifest(manifestPath)) {
        for (const extension of ['png', 'jpg']) {
          const file = path.join(outputDir, formatName, `demo-${entry.id}-${expected.width}x${expected.height}.${extension}`);
          const metadata = await sharp(file).metadata();
          assert.equal(metadata.width, expected.width);
          assert.equal(metadata.height, expected.height);
          assert.equal(metadata.format, extension === 'jpg' ? 'jpeg' : 'png');
        }
      }
    }

    const sheet = await sharp(result.contactSheet).metadata();
    assert.equal(sheet.format, 'png');
    assert.equal(sheet.width, 2400);
    assert.equal(sheet.height, 2400);
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});
