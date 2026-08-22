import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename as fsRename,
  rm,
  writeFile,
} from 'node:fs/promises';
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

async function snapshotDirectory(directory) {
  const snapshot = {};
  async function walk(current) {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(absolute);
      } else {
        const relative = path.relative(directory, absolute).split(path.sep).join('/');
        snapshot[relative] = createHash('sha256').update(await readFile(absolute)).digest('hex');
      }
    }
  }
  await walk(directory);
  return snapshot;
}

async function seedSentinelPack(outputDir, label) {
  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, 'content.json'), `${label}-content`);
  for (const directory of ['horizontal', 'vertical', 'review']) {
    const target = path.join(outputDir, directory);
    await mkdir(target, { recursive: true });
    await writeFile(path.join(target, `${label}.txt`), `${label}-${directory}`);
  }
}

async function assertBuildCoverPackRejectsEntryCount(entries, count) {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'leo-ferraz-cover-pack-'));
  const outputDir = path.join(temporaryRoot, 'generated');
  const temporaryManifestPath = path.join(temporaryRoot, 'content.json');
  try {
    await writeFile(temporaryManifestPath, JSON.stringify(entries));
    await assert.rejects(
      () => buildCoverPack({ rootDir: root, outputDir, manifestPath: temporaryManifestPath }),
      new RegExp(`master pack requires exactly 4 entries; received ${count}`),
    );
    await assert.rejects(() => access(outputDir), { code: 'ENOENT' });
    assert.deepEqual(await readdir(temporaryRoot), ['content.json']);
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
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
      focus: {
        horizontal: { x: 0.5, y: 0.5 },
        vertical: { x: 0.5, y: 0.5 },
      },
    },
    {
      id: 'do-zero-ao-produto',
      category: 'EM CONSTRUÇÃO',
      headlineLines: ['DO ZERO AO', 'PRODUTO REAL.'],
      portrait: 'leo-ferraz-cutout-present-left.png',
      focus: {
        horizontal: { x: 0.5, y: 0.5 },
        vertical: { x: 0.5, y: 0.5 },
      },
    },
    {
      id: 'isso-nao-funcionou',
      category: 'EXPERIMENTO',
      headlineLines: ['ISSO NÃO', 'FUNCIONOU.'],
      portrait: 'leo-ferraz-cutout-neutral.png',
      focus: {
        horizontal: { x: 0.5, y: 0.5 },
        vertical: { x: 0.5, y: 0.5 },
      },
    },
    {
      id: 'coloquei-no-ar',
      category: 'LANÇAMENTO',
      headlineLines: ['COLOQUEI NO', 'AR. E AGORA?'],
      portrait: 'leo-ferraz-cutout-smile-three-quarter.png',
      focus: {
        horizontal: { x: 0.5, y: 0.5 },
        vertical: { x: 0.5, y: 0.5 },
      },
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
    focus: {
      horizontal: { x: 0.5, y: 0.5 },
      vertical: { x: 0.5, y: 0.5 },
    },
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
  assert.throws(
    () => validateCoverManifest([{ ...valid, focus: undefined }]),
    /focus must declare horizontal and vertical/,
  );
  assert.throws(
    () => validateCoverManifest([{ ...valid, focus: { ...valid.focus, square: { x: 0.5, y: 0.5 } } }]),
    /unsupported focus key: square/,
  );
  assert.throws(
    () => validateCoverManifest([{
      ...valid,
      focus: { ...valid.focus, horizontal: { ...valid.focus.horizontal, z: 0.5 } },
    }]),
    /unsupported horizontal focus key: z/,
  );
  assert.throws(
    () => validateCoverManifest([{
      ...valid,
      focus: { ...valid.focus, vertical: { x: 1.01, y: 0.5 } },
    }]),
    /vertical focus x must be between 0 and 1/,
  );
});

test('renderer derives deterministic crop metrics from per-format normalized focus', async () => {
  const [entry] = await loadCoverManifest(manifestPath);
  const leftFocused = await renderCoverSvg({
    entry: {
      ...entry,
      focus: { ...entry.focus, horizontal: { x: 0, y: 0.5 } },
    },
    format: 'horizontal',
    rootDir: root,
  });
  const rightFocused = await renderCoverSvg({
    entry: {
      ...entry,
      focus: { ...entry.focus, horizontal: { x: 1, y: 0.5 } },
    },
    format: 'horizontal',
    rootDir: root,
  });

  assert.equal(leftFocused.metrics.portraitCrop.focus.x, 0);
  assert.equal(leftFocused.metrics.portraitCrop.left, 0);
  assert.equal(leftFocused.metrics.portraitCrop.top, 0);
  assert.equal(rightFocused.metrics.portraitCrop.focus.x, 1);
  assert.ok(rightFocused.metrics.portraitCrop.left > leftFocused.metrics.portraitCrop.left);
  assert.equal('faceZoneTop' in leftFocused.metrics, false);
  assert.equal('faceZoneBottom' in leftFocused.metrics, false);
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
  assert.equal(metrics.bounds.badge.right <= 930, true);
  assert.equal(metrics.bounds.headline.right <= 930, true);
  assert.equal(metrics.bounds.symbol.right <= 930, true);
  assert.equal(metrics.bounds.badge.bottom <= 1620, true);
  assert.equal(metrics.bounds.headline.bottom <= 1620, true);
  assert.equal(metrics.bounds.symbol.bottom <= 1620, true);
  assert.ok(metrics.essentialBottom <= 1620);
  assert.ok(metrics.essentialRight <= 930);
  assert.deepEqual(metrics.portraitCrop.focus, entry.focus.vertical);
  assert.ok(metrics.portraitCrop.focusCanvasY >= 880);
  assert.ok(metrics.portraitCrop.focusCanvasY <= 1920);
  assert.equal(metrics.overflow, false);
});

test('renderer rejects an overlong category before it crosses format safe zones', async () => {
  const [entry] = await loadCoverManifest(manifestPath);
  for (const format of Object.keys(COVER_FORMATS)) {
    await assert.rejects(
      () => renderCoverSvg({
        entry: { ...entry, category: 'CATEGORIA '.repeat(12).trim() },
        format,
        rootDir: root,
      }),
      new RegExp(`safe-zone overflow for ${entry.id} ${format}: badge\\.right`),
    );
  }
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

test('CLI warns when effective headline line height exceeds the 0.95 target', async () => {
  const { runCoverPackCli } = await import('../scripts/build-video-cover-pack.mjs');
  assert.equal(typeof runCoverPackCli, 'function');
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'leo-ferraz-cover-cli-'));
  const outputDir = path.join(temporaryRoot, 'output');
  const temporaryManifestPath = path.join(temporaryRoot, 'content.json');
  try {
    const entries = await loadCoverManifest(manifestPath);
    entries[0] = {
      ...entries[0],
      category: 'ACENTOS ÀÇ',
      headlineLines: ['ÇÇÇÇÇ', 'ÀÀÀÀÀ'],
    };
    await writeFile(temporaryManifestPath, JSON.stringify(entries));
    const warnings = [];
    await runCoverPackCli({
      rootDir: root,
      outputDir,
      manifestPath: temporaryManifestPath,
      log: () => {},
      warn: (message) => warnings.push(message),
    });
    assert.deepEqual(warnings, [
      'warning: produtos-reais horizontal line-height target=0.950 effective=1.209',
      'warning: produtos-reais vertical line-height target=0.950 effective=1.209',
    ]);
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
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

test('successful rebuild removes stale derivatives and preserves root content.json', async () => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'leo-ferraz-cover-rebuild-'));
  const outputDir = path.join(temporaryRoot, 'master-pack');
  const temporaryManifestPath = path.join(outputDir, 'content.json');
  try {
    const manifestBytes = await readFile(manifestPath);
    await mkdir(path.join(outputDir, 'horizontal'), { recursive: true });
    await writeFile(temporaryManifestPath, manifestBytes);
    const staleDerivative = path.join(outputDir, 'horizontal', 'stale-derivative.png');
    await writeFile(staleDerivative, 'stale');

    await buildCoverPack({ rootDir: root, outputDir, manifestPath: temporaryManifestPath });

    await assert.rejects(() => access(staleDerivative), { code: 'ENOENT' });
    assert.deepEqual(await readFile(temporaryManifestPath), manifestBytes);
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});

test('invalid fourth entry preserves an existing pack byte-for-byte', async () => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'leo-ferraz-cover-preflight-'));
  const outputDir = path.join(temporaryRoot, 'master-pack');
  const temporaryManifestPath = path.join(temporaryRoot, 'invalid-content.json');
  try {
    await seedSentinelPack(outputDir, 'approved');
    const entries = await loadCoverManifest(manifestPath);
    entries[3] = { ...entries[3], category: 'CATEGORIA '.repeat(12).trim() };
    await writeFile(temporaryManifestPath, JSON.stringify(entries));
    const before = await snapshotDirectory(outputDir);

    await assert.rejects(
      () => buildCoverPack({ rootDir: root, outputDir, manifestPath: temporaryManifestPath }),
      /safe-zone overflow for coloquei-no-ar horizontal/,
    );

    assert.deepEqual(await snapshotDirectory(outputDir), before);
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});

test('replacement failure restores all prior pack directories', async () => {
  const { replacePackDirectories } = await import('../scripts/lib/video-cover-pack.mjs');
  assert.equal(typeof replacePackDirectories, 'function');
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'leo-ferraz-cover-rollback-'));
  const outputDir = path.join(temporaryRoot, 'master-pack');
  const stagingDir = path.join(temporaryRoot, 'staging');
  try {
    await seedSentinelPack(outputDir, 'approved');
    await seedSentinelPack(stagingDir, 'replacement');
    const before = await snapshotDirectory(outputDir);
    let injectedFailure = false;
    const rename = async (source, destination) => {
      if (!injectedFailure && path.dirname(source) === stagingDir && path.basename(source) === 'vertical') {
        injectedFailure = true;
        throw new Error('simulated replacement failure');
      }
      return fsRename(source, destination);
    };

    await assert.rejects(
      () => replacePackDirectories({ outputDir, stagingDir, rename }),
      /simulated replacement failure/,
    );

    assert.deepEqual(await snapshotDirectory(outputDir), before);
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});

test('rollback failure preserves the backup that still contains prior data', async () => {
  const { replacePackDirectories } = await import('../scripts/lib/video-cover-pack.mjs');
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'leo-ferraz-cover-rollback-backup-'));
  const outputDir = path.join(temporaryRoot, 'master-pack');
  const stagingDir = path.join(temporaryRoot, 'staging');
  try {
    await seedSentinelPack(outputDir, 'approved');
    await seedSentinelPack(stagingDir, 'replacement');
    let replacementFailed = false;
    const rename = async (source, destination) => {
      if (!replacementFailed && path.dirname(source) === stagingDir && path.basename(source) === 'vertical') {
        replacementFailed = true;
        throw new Error('simulated replacement failure');
      }
      const sourceParent = path.basename(path.dirname(source));
      if (replacementFailed && sourceParent.startsWith('.master-pack-backup-')
        && path.basename(source) === 'horizontal') {
        throw new Error('simulated rollback failure');
      }
      return fsRename(source, destination);
    };

    await assert.rejects(
      () => replacePackDirectories({ outputDir, stagingDir, rename }),
      /pack replacement and rollback failed/,
    );

    const backups = (await readdir(temporaryRoot, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory() && entry.name.startsWith('.master-pack-backup-'));
    assert.equal(backups.length, 1);
    await access(path.join(temporaryRoot, backups[0].name, 'horizontal', 'approved.txt'));
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
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

test('two isolated builds are byte-for-byte identical across all seventeen outputs', async () => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'leo-ferraz-cover-determinism-'));
  const firstOutputDir = path.join(temporaryRoot, 'first');
  const secondOutputDir = path.join(temporaryRoot, 'second');
  try {
    await buildCoverPack({ rootDir: root, outputDir: firstOutputDir, manifestPath });
    await buildCoverPack({ rootDir: root, outputDir: secondOutputDir, manifestPath });
    const first = await snapshotDirectory(firstOutputDir);
    const second = await snapshotDirectory(secondOutputDir);

    assert.equal(Object.keys(first).length, 17);
    assert.equal(Object.keys(second).length, 17);
    assert.deepEqual(Object.keys(second), Object.keys(first));
    for (const relative of Object.keys(first)) {
      const firstBytes = await readFile(path.join(firstOutputDir, relative));
      const secondBytes = await readFile(path.join(secondOutputDir, relative));
      assert.equal(secondBytes.equals(firstBytes), true, `byte mismatch: ${relative}`);
    }
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});
