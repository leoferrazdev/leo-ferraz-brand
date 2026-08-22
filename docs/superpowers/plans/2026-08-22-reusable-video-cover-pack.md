# Reusable Video Cover Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a configuration-driven master pack that exports four demonstrative Leo Ferraz cover concepts in YouTube 1280×720 and vertical 1080×1920 formats.

**Architecture:** Keep the approved legacy cover scripts untouched and add a focused renderer with three public interfaces: manifest validation, single-cover SVG rendering, and complete-pack generation. Content lives in a JSON manifest, layout rules live in one module, and a thin CLI writes deterministic PNG/JPG derivatives plus one review contact sheet.

**Tech Stack:** Node.js 22 LTS, ECMAScript modules, Sharp 0.35.3, Fontkitten already present in the locked dependency graph, IBM Plex font files already installed through `@fontsource`, Node test runner.

## Global Constraints

- Governing visual rule: `brand/PADRAO-CAPAS.md`.
- YouTube output: `1280×720`; vertical output: `1080×1920`.
- Content locale: `pt-BR`.
- Background: `#0D1117`; grid: `#405064`; text: `#F3F6FA`; accent: `#4DA3FF`.
- Typography: IBM Plex Sans 700 for category and headline; no third family.
- Signature: approved `Constructed LF` primary symbol only.
- Portrait sources: approved PNG cutouts under `brand-assets/profile/leo-ferraz/` only.
- Prohibited: portrait regeneration, gradients, glow, decorative shadow, lower accent bar, full lockup, wordmark, descriptor, institutional lockup.
- Output names must begin with `demo-`.
- Expected cover outputs: 8 PNG and 8 JPG files, plus one PNG contact sheet.
- Preserve every unrelated tracked or untracked file.
- No platform upload, publication or deploy is part of this plan.

---

## File Structure

- Create `brand-assets/capas/master-pack/content.json` — reusable demonstrative editorial manifest.
- Create `scripts/lib/video-cover-pack.mjs` — validation, layout, SVG rendering, raster export and contact-sheet logic.
- Create `scripts/build-video-cover-pack.mjs` — CLI entry point.
- Create `tests/video-cover-pack.test.mjs` — manifest, safety, output and determinism tests.
- Modify `package.json` — add `video-cover-pack:build` and `video-cover-pack:test` scripts.
- Create `brand-assets/capas/master-pack/horizontal/*` — four PNG and four JPG YouTube examples.
- Create `brand-assets/capas/master-pack/vertical/*` — four PNG and four JPG vertical examples.
- Create `brand-assets/capas/master-pack/review/demo-master-pack-contact-sheet.png` — visual audit surface.
- Modify `docs/superpowers/specs/2026-08-22-reusable-video-cover-pack-design.md` — promote `implementation_status` after evidence passes.
- Modify ignored vault note `cofre-leoferraz-dev/01_DECISOES/DECISAO-024 - Pack Mestre Reutilizavel de Capas de Video.md` — record execution, evidence and remaining publication boundary.

### Task 1: Editorial manifest and validation contract

**Files:**
- Create: `brand-assets/capas/master-pack/content.json`
- Create: `scripts/lib/video-cover-pack.mjs`
- Test: `tests/video-cover-pack.test.mjs`

**Interfaces:**
- Consumes: JSON entries shaped as `{ id, category, headlineLines, portrait }`.
- Produces: `COVER_FORMATS`, `APPROVED_PORTRAITS`, `loadCoverManifest(path)`, and `validateCoverManifest(entries)`.

- [ ] **Step 1: Write the failing manifest-validation tests**

Create `tests/video-cover-pack.test.mjs` with the validation suite:

```js
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
```

- [ ] **Step 2: Run the focused test and verify the missing-module failure**

Run:

```powershell
node --test tests/video-cover-pack.test.mjs
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `scripts/lib/video-cover-pack.mjs`.

- [ ] **Step 3: Create the exact content manifest**

Create `brand-assets/capas/master-pack/content.json`:

```json
[
  {
    "id": "produtos-reais",
    "category": "CONSTRUINDO COM IA",
    "headlineLines": ["PRODUTOS", "REAIS, NÃO", "PROMESSA."],
    "portrait": "leo-ferraz-cutout-front.png"
  },
  {
    "id": "do-zero-ao-produto",
    "category": "EM CONSTRUÇÃO",
    "headlineLines": ["DO ZERO AO", "PRODUTO REAL."],
    "portrait": "leo-ferraz-cutout-present-left.png"
  },
  {
    "id": "isso-nao-funcionou",
    "category": "EXPERIMENTO",
    "headlineLines": ["ISSO NÃO", "FUNCIONOU."],
    "portrait": "leo-ferraz-cutout-neutral.png"
  },
  {
    "id": "coloquei-no-ar",
    "category": "LANÇAMENTO",
    "headlineLines": ["COLOQUEI NO", "AR. E AGORA?"],
    "portrait": "leo-ferraz-cutout-smile-three-quarter.png"
  }
]
```

- [ ] **Step 4: Implement the manifest contract**

Start `scripts/lib/video-cover-pack.mjs` with these exact exports and checks:

```js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { create as createFont } from 'fontkitten';

sharp.concurrency(1);
sharp.cache(false);

export const COVER_FORMATS = Object.freeze({
  horizontal: Object.freeze({ width: 1280, height: 720, grid: 48 }),
  vertical: Object.freeze({ width: 1080, height: 1920, grid: 60 }),
});

export const APPROVED_PORTRAITS = Object.freeze([
  'leo-ferraz-cutout-front.png',
  'leo-ferraz-cutout-smile-three-quarter.png',
  'leo-ferraz-cutout-present-right.png',
  'leo-ferraz-cutout-neutral.png',
  'leo-ferraz-cutout-present-left.png',
  'leo-ferraz-cutout-arms-crossed.png',
]);

export async function loadCoverManifest(manifestPath) {
  return JSON.parse(await fs.promises.readFile(manifestPath, 'utf8'));
}

export function validateCoverManifest(entries) {
  if (!Array.isArray(entries) || entries.length === 0) throw new Error('manifest must be a non-empty array');
  const ids = new Set();
  for (const entry of entries) {
    if (!entry || typeof entry !== 'object') throw new Error('manifest entry must be an object');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id ?? '')) throw new Error(`invalid id: ${entry.id ?? ''}`);
    if (ids.has(entry.id)) throw new Error(`duplicate id: ${entry.id}`);
    ids.add(entry.id);
    if (typeof entry.category !== 'string' || entry.category.trim() === '') throw new Error(`empty category: ${entry.id}`);
    if (!Array.isArray(entry.headlineLines) || ![2, 3].includes(entry.headlineLines.length)) {
      throw new Error(`headlineLines must contain 2 or 3 lines: ${entry.id}`);
    }
    if (entry.headlineLines.some((line) => typeof line !== 'string' || line.trim() === '')) {
      throw new Error(`headline line must be non-empty: ${entry.id}`);
    }
    if (!APPROVED_PORTRAITS.includes(entry.portrait)) throw new Error(`unsupported portrait: ${entry.portrait}`);
  }
  return entries;
}

export async function renderCoverSvg() {
  throw new Error('renderCoverSvg not implemented');
}

export async function buildCoverPack() {
  throw new Error('buildCoverPack not implemented');
}
```

- [ ] **Step 5: Run the validation tests**

Run:

```powershell
node --test --test-name-pattern="manifest" tests/video-cover-pack.test.mjs
```

Expected: 2 tests PASS.

- [ ] **Step 6: Commit the contract**

```powershell
git add -- brand-assets/capas/master-pack/content.json scripts/lib/video-cover-pack.mjs tests/video-cover-pack.test.mjs
git commit -m "feat: define reusable video cover manifest"
```

### Task 2: Deterministic renderer for both formats

**Files:**
- Modify: `scripts/lib/video-cover-pack.mjs`
- Modify: `tests/video-cover-pack.test.mjs`

**Interfaces:**
- Consumes: one validated manifest entry, `horizontal` or `vertical`, root paths.
- Produces: `renderCoverSvg({ entry, format, rootDir })` returning `{ svg, metrics }` and `buildCoverPack({ rootDir, outputDir, manifestPath })` returning output records.

- [ ] **Step 1: Add failing structural-render tests**

Append:

```js
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
```

- [ ] **Step 2: Run and verify the missing-export failure**

Run:

```powershell
node --test --test-name-pattern="renderer" tests/video-cover-pack.test.mjs
```

Expected: FAIL with `renderCoverSvg not implemented`.

- [ ] **Step 3: Add deterministic typography and geometry helpers**

In `scripts/lib/video-cover-pack.mjs`, initialize the root-relative font files and implement `measure`, `assertGlyphs`, `outlined`, `grid`, and `badge` using the same Fontkitten outline approach already proven in `scripts/build-cutout-cover.mjs`. Use these constants:

```js
const COLORS = Object.freeze({
  background: '#0D1117',
  text: '#F3F6FA',
  accent: '#4DA3FF',
  grid: '#405064',
});

const LAYOUTS = Object.freeze({
  horizontal: Object.freeze({
    badge: { x: 64, y: 56, size: 26, height: 56 },
    headline: { x: 64, top: 176, nominalSize: 90, minimumSize: 72, lineHeight: 0.95, limit: 544 },
    portrait: { x: 640, y: 0, width: 640, height: 720 },
    symbol: { x: 1176, y: 40, width: 64, height: 64 },
  }),
  vertical: Object.freeze({
    badge: { x: 72, y: 300, size: 30, height: 64 },
    headline: { x: 72, top: 430, nominalSize: 118, minimumSize: 92, lineHeight: 0.95, limit: 858 },
    portrait: { x: 0, y: 880, width: 1080, height: 1040 },
    symbol: { x: 72, y: 180, width: 64, height: 64 },
  }),
});
```

Use this bounded fitting rule:

```js
function fitHeadline(lines, spec, face) {
  for (let size = spec.nominalSize; size >= spec.minimumSize; size -= 2) {
    const widths = lines.map((line) => measure(line, size, -0.028, face));
    if (widths.every((width) => width <= spec.limit)) return { size, widths };
  }
  throw new Error(`headline does not fit approved bounds: ${lines.join(' / ')}`);
}
```

- [ ] **Step 4: Implement transparent portrait and primary-symbol embedding**

Use Sharp with top anchoring and preserve alpha:

```js
async function portraitDataUri(sourcePath, zone) {
  const buffer = await sharp(sourcePath)
    .resize(zone.width, zone.height, { fit: 'cover', position: 'top', kernel: sharp.kernel.lanczos3 })
    .png({ compressionLevel: 9 })
    .toBuffer();
  return `data:image/png;base64,${buffer.toString('base64')}`;
}

function symbolBody({ x, y, width, height }) {
  const scaleX = width / 80;
  const scaleY = height / 80;
  return `<g transform="translate(${x} ${y}) scale(${scaleX} ${scaleY})" data-mark="constructed-lf">`
    + `<g transform="translate(8 8)">`
    + `<path d="M8 8H20V44H28V56H8Z" fill="#F3F6FA"/>`
    + `<path d="M28 8H56V20H40V28H48V36H40V56H28Z" fill="#F3F6FA"/>`
    + `<rect x="48" y="28" width="8" height="8" fill="#4DA3FF"/>`
    + `</g></g>`;
}
```

- [ ] **Step 5: Implement `renderCoverSvg` and safe metrics**

The function must validate the one-entry array, reject unsupported formats, resolve the portrait only under `brand-assets/profile/leo-ferraz`, fit the headline, draw background → grid → portrait → symbol → badge → headline, and return:

```js
return {
  svg: Buffer.from(svgMarkup),
  metrics: {
    width: formatSpec.width,
    height: formatSpec.height,
    headlineSize,
    essentialRight: Math.max(
      layout.headline.x + Math.max(...widths),
      badgeRight,
      layout.symbol.x + layout.symbol.width,
    ),
    essentialBottom: Math.max(
      headlineBottom,
      layout.badge.y + layout.badge.height,
      layout.symbol.y + layout.symbol.height,
    ),
    faceZoneTop: format === 'vertical' ? 950 : 0,
    faceZoneBottom: format === 'vertical' ? 1450 : formatSpec.height,
    overflow: false,
  },
};
```

The SVG root must not declare gradients or filters. The portrait `<image>` must use the generated PNG data URI without a fade overlay.

- [ ] **Step 6: Run all renderer tests**

Run:

```powershell
node --test tests/video-cover-pack.test.mjs
```

Expected: 4 tests PASS.

- [ ] **Step 7: Commit the renderer**

```powershell
git add -- scripts/lib/video-cover-pack.mjs tests/video-cover-pack.test.mjs
git commit -m "feat: render canonical horizontal and vertical covers"
```

### Task 3: Complete pack generation and review contact sheet

**Files:**
- Modify: `scripts/lib/video-cover-pack.mjs`
- Create: `scripts/build-video-cover-pack.mjs`
- Modify: `tests/video-cover-pack.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: manifest path and output directory.
- Produces: 16 cover derivatives, one contact sheet and CLI summary.

- [ ] **Step 1: Add the failing output-contract test**

Append:

```js
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
    assert.ok(sheet.width >= 1920);
    assert.ok(sheet.height >= 1080);
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});
```

- [ ] **Step 2: Run and verify the missing-generation failure**

Run:

```powershell
node --test --test-name-pattern="buildCoverPack" tests/video-cover-pack.test.mjs
```

Expected: FAIL because `buildCoverPack` does not yet write the required files.

- [ ] **Step 3: Implement raster exports**

For each manifest entry and each format, call `renderCoverSvg`, create the format directory, and write:

```js
const base = `demo-${entry.id}-${width}x${height}`;
const pngPath = path.join(formatDir, `${base}.png`);
const jpgPath = path.join(formatDir, `${base}.jpg`);
await sharp(svg).resize(width, height, { fit: 'fill' }).png({ compressionLevel: 9 }).toFile(pngPath);
await sharp(svg).resize(width, height, { fit: 'fill' }).jpeg({ quality: 92, chromaSubsampling: '4:4:4' }).toFile(jpgPath);
```

Return one record per written derivative:

```js
covers.push({ id: entry.id, format, extension: 'png', path: pngPath, metrics });
covers.push({ id: entry.id, format, extension: 'jpg', path: jpgPath, metrics });
```

- [ ] **Step 4: Implement the contact sheet**

Create a 2400×2400 `#0D1117` canvas. Arrange four rows, one per concept, with 48 px vertical separation. Each row composites a 960×540 horizontal PNG and a 304×540 vertical PNG with a 48 px horizontal gutter. Use Sharp only; do not add labels that could become a competing cover treatment. Save it as:

```text
<outputDir>/review/demo-master-pack-contact-sheet.png
```

- [ ] **Step 5: Create the CLI**

Create `scripts/build-video-cover-pack.mjs`:

```js
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCoverPack } from './lib/video-cover-pack.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(rootDir, 'brand-assets', 'capas', 'master-pack');
const manifestPath = path.join(outputDir, 'content.json');

const result = await buildCoverPack({ rootDir, outputDir, manifestPath });
console.log(`covers: ${result.covers.length}`);
console.log(`contact_sheet: ${path.relative(rootDir, result.contactSheet)}`);
```

- [ ] **Step 6: Add package scripts**

Add these adjacent entries under `scripts` in `package.json`:

```json
"video-cover-pack:build": "node scripts/build-video-cover-pack.mjs",
"video-cover-pack:test": "node --test tests/video-cover-pack.test.mjs"
```

- [ ] **Step 7: Run the focused tests and generator**

Run:

```powershell
npm run video-cover-pack:test
npm run video-cover-pack:build
```

Expected:

```text
tests: 5 passed, 0 failed
covers: 16
contact_sheet: brand-assets\capas\master-pack\review\demo-master-pack-contact-sheet.png
```

- [ ] **Step 8: Commit the generator and generated pack**

```powershell
git add -- package.json scripts/build-video-cover-pack.mjs scripts/lib/video-cover-pack.mjs tests/video-cover-pack.test.mjs brand-assets/capas/master-pack/content.json brand-assets/capas/master-pack/horizontal brand-assets/capas/master-pack/vertical brand-assets/capas/master-pack/review
git commit -m "feat: generate reusable video cover master pack"
```

### Task 4: Visual audit, governance evidence and release validation

**Files:**
- Modify: `docs/superpowers/specs/2026-08-22-reusable-video-cover-pack-design.md`
- Modify locally: `cofre-leoferraz-dev/01_DECISOES/DECISAO-024 - Pack Mestre Reutilizavel de Capas de Video.md`
- Review: `brand-assets/capas/master-pack/review/demo-master-pack-contact-sheet.png`

**Interfaces:**
- Consumes: generated pack and validation output.
- Produces: implementation evidence, clean intentional Git history and synchronized `origin/main`.

- [ ] **Step 1: Inspect the contact sheet at original detail**

Open the contact sheet and verify all eight compositions against this checklist:

```text
headline fully visible
category capsule fully visible
portrait silhouette clean
portrait does not cover headline
Constructed LF remains secondary
horizontal composition reads at thumbnail size
vertical face occupies the intended middle/lower zone
no essential vertical content under y=1620 or right of x=930
no gradient, glow or lower accent bar
all examples read as the same visual system
```

If one item fails, correct only configuration or renderer geometry, rerun Tasks 2–3 tests, regenerate all outputs, and repeat the visual audit.

- [ ] **Step 2: Run complete automated validation**

Run:

```powershell
npm run video-cover-pack:test
npm run brand-assets:validate
npm run build
git diff --check
```

Expected:

```text
video cover tests: all pass
brand asset validation: pass
Astro build: 6 pages generated without error
git diff --check: no output
```

- [ ] **Step 3: Promote the approved specification**

Change only:

```yaml
implementation_status: implemented
```

Then add an `## Implementation evidence` section recording the exact test counts, asset-validation count, generated-file count, build result and visual-review result observed in this run.

- [ ] **Step 4: Update Decision 024 in the ignored Obsidian vault**

Set:

```yaml
implementation_status: implemented
```

Mark every implementation checkbox complete and add exact evidence under `## Evidência`, separating:

```text
decision
execution
automated evidence
visual evidence
external publication: not performed
```

Do not stage the vault because `.git/info/exclude` intentionally keeps operational memory out of the canonical application repository.

- [ ] **Step 5: Audit the final scope**

Run:

```powershell
git status --short
git diff --stat
git diff --name-only
git log --oneline origin/main..HEAD
```

Confirm that unrelated pre-existing files remain untracked and unchanged. Confirm that only pack implementation files, generated pack assets and the implementation-status update are pending or locally committed.

- [ ] **Step 6: Commit the final evidence**

```powershell
git add -- docs/superpowers/specs/2026-08-22-reusable-video-cover-pack-design.md
git commit -m "docs: record reusable video cover pack evidence"
```

- [ ] **Step 7: Push and verify synchronization**

```powershell
git push origin main
git status --short
git rev-parse HEAD
git rev-parse origin/main
```

Expected: push succeeds; `HEAD` equals `origin/main`; only the known unrelated untracked files remain visible; no deploy or platform upload occurs.
