# Founder Social Avatar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the provisional social avatar with deterministic square exports composed from the approved neutral founder cutout.

**Architecture:** A focused Node.js/Sharp builder will crop and flatten the approved transparent source into one 1024-pixel master, then derive 512- and 256-pixel exports from that master. A Node test will validate source identity, dimensions, opacity, palette background and deterministic downsampling; visual review will separately verify circular cropping and small-size recognition.

**Tech Stack:** Node.js 22, Sharp 0.35.3, `node:test`, PNG, Markdown, Obsidian Markdown, Git.

## Global Constraints

- Source only: `brand-assets/profile/leo-ferraz/leo-ferraz-cutout-neutral.png`.
- Background only: solid `#0D1117`.
- Do not regenerate or alter face, expression, hair, beard, clothing or lighting.
- Do not add text, wordmark, `LF`, grid, border, gradient, glow or artificial objects.
- Preserve the existing blue rim light from the source.
- Master composition: square, direct eye contact, eye line near 42%, face vertically occupying approximately 70% of the circular field, shoulders retained in the lower quarter.
- Deliverables: opaque PNG at exactly 1024×1024, 512×512 and 256×256.
- No output may contain an unintended transparent background.
- Preserve all thumbnail cutouts and every unrelated working-tree file.
- Favicon and Constructed LF assets remain unchanged.

---

## File Structure

- `scripts/build-founder-avatar.mjs`: single-purpose deterministic avatar renderer and CLI entry point.
- `tests/founder-avatar.test.mjs`: automated contract for source, exports, opacity, color and deterministic derivation.
- `package.json`: exposes focused build and test commands.
- `brand-assets/profile/avatar/leo-ferraz-avatar-{1024,512,256}.png`: canonical outputs.
- `brand/CHANNEL_SETUP_CHECKLIST.md`: declares the approved cutout as the new avatar source.
- `cofre-leoferraz-dev/01_DECISOES/DECISAO-021 - Retrato Neutro como Novo Avatar Social.md`: records execution evidence and closes local implementation pendencies.

---

### Task 1: Deterministic avatar builder and automated contract

**Files:**
- Create: `scripts/build-founder-avatar.mjs`
- Create: `tests/founder-avatar.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: transparent PNG at `brand-assets/profile/leo-ferraz/leo-ferraz-cutout-neutral.png`.
- Produces: `buildFounderAvatar({ sourcePath, outputDir }): Promise<Array<{ size: number, path: string }>>`.
- Produces: CLI command `npm run founder-avatar:build`.
- Produces: validation command `npm run founder-avatar:test`.

- [ ] **Step 1: Add the failing test**

Create `tests/founder-avatar.test.mjs` with this contract:

```js
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
```

- [ ] **Step 2: Add package commands and confirm the test fails**

Add these exact scripts to `package.json`:

```json
"founder-avatar:build": "node scripts/build-founder-avatar.mjs",
"founder-avatar:test": "node --test tests/founder-avatar.test.mjs"
```

Run:

```powershell
npm run founder-avatar:test
```

Expected: FAIL because `scripts/build-founder-avatar.mjs` does not yet exist.

- [ ] **Step 3: Implement the minimal deterministic builder**

Create `scripts/build-founder-avatar.mjs` with these public constants and behavior:

```js
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
```

- [ ] **Step 4: Run the focused test and verify green**

Run:

```powershell
npm run founder-avatar:test
```

Expected: one test passes, zero failures, and the test removes its temporary output directory.

- [ ] **Step 5: Audit and commit the pipeline**

Run:

```powershell
git diff --check
git diff -- package.json scripts/build-founder-avatar.mjs tests/founder-avatar.test.mjs
git add package.json scripts/build-founder-avatar.mjs tests/founder-avatar.test.mjs
git diff --cached --name-status
git commit -m "feat: add deterministic founder avatar pipeline"
```

Expected staged scope: exactly the three files listed above.

---

### Task 2: Generate, inspect and promote the canonical avatar exports

**Files:**
- Modify: `brand-assets/profile/avatar/leo-ferraz-avatar-1024.png`
- Modify: `brand-assets/profile/avatar/leo-ferraz-avatar-512.png`
- Modify: `brand-assets/profile/avatar/leo-ferraz-avatar-256.png`
- Modify: `brand/CHANNEL_SETUP_CHECKLIST.md`
- Modify locally: `cofre-leoferraz-dev/01_DECISOES/DECISAO-021 - Retrato Neutro como Novo Avatar Social.md`

**Interfaces:**
- Consumes: `buildFounderAvatar()` from Task 1.
- Produces: three canonical opaque PNG exports referenced by every social channel.
- Preserves: all `brand-assets/profile/leo-ferraz/leo-ferraz-cutout-*.png` files byte-for-byte.

- [ ] **Step 1: Capture source-cutout hashes before generation**

Run:

```powershell
Get-FileHash -Algorithm SHA256 'brand-assets\profile\leo-ferraz\leo-ferraz-cutout-*.png' | Sort-Object Path | Format-Table Hash, Path
```

Save the six hashes in `cofre-leoferraz-dev/01_DECISOES/DECISAO-021 - Retrato Neutro como Novo Avatar Social.md` for comparison after generation.

- [ ] **Step 2: Generate all avatar sizes from the canonical master**

Run:

```powershell
npm run founder-avatar:build
npm run founder-avatar:test
```

Expected files and dimensions:

```text
leo-ferraz-avatar-1024.png  1024x1024  opaque PNG
leo-ferraz-avatar-512.png    512x512   opaque PNG
leo-ferraz-avatar-256.png    256x256   opaque PNG
```

- [ ] **Step 3: Create temporary circular and small-size review specimens**

Use this exact Sharp script to create `.tmp/avatar-review/avatar-review-board.png`:

```powershell
@'
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const outputDir = path.join(root, '.tmp', 'avatar-review');
const masterPath = path.join(root, 'brand-assets', 'profile', 'avatar', 'leo-ferraz-avatar-1024.png');
await mkdir(outputDir, { recursive: true });

const master = await sharp(masterPath).toBuffer();
const circleMask = Buffer.from('<svg width="384" height="384"><circle cx="192" cy="192" r="192" fill="white"/></svg>');
const circular = await sharp(master)
  .resize(384, 384, { kernel: sharp.kernel.lanczos3 })
  .composite([{ input: circleMask, blend: 'dest-in' }])
  .png()
  .toBuffer();
const avatar256 = await sharp(master).resize(256, 256, { kernel: sharp.kernel.lanczos3 }).png().toBuffer();
const avatar64 = await sharp(master).resize(64, 64, { kernel: sharp.kernel.lanczos3 }).png().toBuffer();
const avatar32 = await sharp(master).resize(32, 32, { kernel: sharp.kernel.lanczos3 }).png().toBuffer();

await sharp({
  create: { width: 900, height: 480, channels: 3, background: { r: 13, g: 17, b: 23 } },
})
  .composite([
    { input: circular, left: 32, top: 48 },
    { input: avatar256, left: 448, top: 48 },
    { input: avatar64, left: 744, top: 48 },
    { input: avatar32, left: 832, top: 48 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(path.join(outputDir, 'avatar-review-board.png'));

console.log(path.join(outputDir, 'avatar-review-board.png'));
'@ | node --input-type=module
```

The board contains:

- the 1024 export clipped to a circle;
- the 256 export at native size;
- the master reduced to 64×64;
- the master reduced to 32×32;
- neutral `#0D1117` surrounding space.

The temporary board is evidence only. Inspect it with the local image viewer, then remove `.tmp/avatar-review/`. Do not stage it.

- [ ] **Step 4: Apply the visual acceptance checklist**

Confirm all of the following from the review board:

```text
direct eye contact: yes
face recognizable at 64px: yes
face recognizable at 32px: yes
eyes, hair, ears and chin inside circular crop: yes
shoulders provide a stable base: yes
checkerboard residue: none
edge halo: none
added logo or text: none
background: #0D1117 only
```

If any item fails, adjust only `SOURCE_CROP` in `scripts/build-founder-avatar.mjs`, rerun the focused test and regenerate all three exports. Do not retouch the portrait.

- [ ] **Step 5: Update the canonical source declaration**

In `brand/CHANNEL_SETUP_CHECKLIST.md`, replace only:

```text
Derived from `brand-assets/profile/leo-ferraz-founder-photo-provisional.jpg`.
Provenance of that file is still unverified — see `DECISAO-011` in the vault.
Adopting it across every platform propagates that caveat; replacing the source
means regenerating this set.
```

with:

```text
Derived from the founder-approved neutral cutout:
`brand-assets/profile/leo-ferraz/leo-ferraz-cutout-neutral.png`.
The composition and exports are governed by `DECISAO-021` in the vault and
`docs/superpowers/specs/2026-08-22-founder-social-avatar-design.md`.
```

- [ ] **Step 6: Update the Obsidian execution state**

In `DECISAO-021 - Retrato Neutro como Novo Avatar Social.md`:

- change `implementation_status: pending` to `implementation_status: implemented`;
- check the export and checklist-update tasks;
- preserve the manual platform upload as pending;
- record the three dimensions, opacity validation, visual-review result and source-cutout hash preservation.

- [ ] **Step 7: Verify source preservation and commit the promoted assets**

Re-run the six source hashes and compare them with Step 1. Then run:

```powershell
git diff --check
git status --short
git diff -- brand/CHANNEL_SETUP_CHECKLIST.md
git add brand/CHANNEL_SETUP_CHECKLIST.md `
  brand-assets/profile/avatar/leo-ferraz-avatar-1024.png `
  brand-assets/profile/avatar/leo-ferraz-avatar-512.png `
  brand-assets/profile/avatar/leo-ferraz-avatar-256.png
git diff --cached --name-status
git commit -m "brand: promote neutral founder social avatar"
```

Expected staged scope: exactly the checklist and three avatar PNGs. The ignored Obsidian vault remains outside the commit.

---

### Task 3: Repository-wide verification and publication

**Files:**
- Verify only: all files created or modified in Tasks 1 and 2.
- Do not modify: favicon, signature assets, thumbnail cutouts, public site components or generated Day-1 exports.

**Interfaces:**
- Consumes: focused test and three avatar exports from previous tasks.
- Produces: verified `main` synchronized with `origin/main` and an updated operational record.

- [ ] **Step 1: Run focused and repository validation**

Run:

```powershell
npm run founder-avatar:test
npm run brand-assets:validate
npm run build
```

Expected: all commands exit 0. The full build must not alter the manually governed files under `brand-assets/profile/avatar/`.

- [ ] **Step 2: Re-run final image metadata validation**

For each avatar, verify with Sharp:

```text
format: png
width/height: expected square size
hasAlpha: false
top-corner RGB: 13,17,23
```

Run `git diff --check` and confirm no unexpected tracked file changed during the build.

- [ ] **Step 3: Push the existing commits**

Run:

```powershell
git fetch origin main
git rev-list --left-right --count origin/main...HEAD
git push origin main
```

Expected before push: local `HEAD` is ahead only by the two planned commits and behind by zero.

- [ ] **Step 4: Verify post-push state**

Run:

```powershell
git fetch origin main
git branch --show-current
git rev-parse HEAD
git rev-parse origin/main
git status --short --untracked-files=no
git log -2 --oneline
```

Expected:

```text
branch: main
tracked working tree: clean
HEAD = origin/main
latest commits:
brand: promote neutral founder social avatar
feat: add deterministic founder avatar pipeline
```

- [ ] **Step 5: Complete the Obsidian evidence record**

Add the final commit hashes and push confirmation to `DECISAO-021`, keeping only manual uploads to external social platforms as pending. Do not record credentials or platform session details.
