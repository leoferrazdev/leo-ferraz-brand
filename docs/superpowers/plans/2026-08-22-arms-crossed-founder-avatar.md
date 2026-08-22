# Arms-Crossed Founder Avatar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the canonical social-avatar exports with the approved `Arms-Crossed Authority` portrait while eliminating light edge contamination and preserving `smile-three-quarter` as the declared historical/alternative portrait.

**Architecture:** Keep the existing deterministic Sharp pipeline and stable export filenames. Change the approved source and square crop, composite the transparent source onto the canonical background at native resolution before any resize, then derive 512 px and 256 px outputs from the opaque 1024 px master. Automated tests lock source identity, crop, operation order, dimensions, opacity and deterministic downsampling; visual review verifies circular safety and edge quality.

**Tech Stack:** Node.js 22, Sharp 0.35.3, Node test runner, Astro 7.2.2, PNG assets, Markdown and Obsidian Flavored Markdown.

## Global Constraints

- Canonical source: `brand-assets/profile/leo-ferraz/leo-ferraz-cutout-arms-crossed.png`.
- Historical/alternative source: `brand-assets/profile/leo-ferraz/leo-ferraz-cutout-smile-three-quarter.png`.
- Background: solid `#0D1117`; no texture or Construction Grid inside the avatar.
- Composition order: crop at source resolution, flatten onto `#0D1117`, then resize.
- Expected crop: `left: 0`, `top: 0`, `width: 1122`, `height: 1122`.
- Preserve the existing blue rim light and natural silhouette.
- Do not alter face, expression, hair, beard, clothing, posture or anatomy.
- Do not add text, wordmark, `LF`, border, gradient, glow or artificial objects.
- Keep filenames `leo-ferraz-avatar-1024.png`, `leo-ferraz-avatar-512.png` and `leo-ferraz-avatar-256.png`.
- Preserve all six approved founder cutouts byte-identically.
- Do not stage unrelated untracked files.
- Platform uploads remain manual and outside this implementation.

---

### Task 1: Lock the new source, crop and compositing contract with tests

**Files:**
- Modify: `tests/founder-avatar.test.mjs`
- Test: `tests/founder-avatar.test.mjs`

**Interfaces:**
- Consumes: `buildFounderAvatar({ sourcePath, outputDir })`, `AVATAR_BACKGROUND`, `AVATAR_SIZES`, `SOURCE_CROP` from `scripts/build-founder-avatar.mjs`.
- Produces: a failing test contract for the 1122×1402 arms-crossed source, top-anchored 1122×1122 crop, opaque outputs and flatten-before-resize behavior.

- [ ] **Step 1: Replace the neutral-source test fixture with the approved arms-crossed source**

```js
const sourcePath = path.join(
  root,
  'brand-assets',
  'profile',
  'leo-ferraz',
  'leo-ferraz-cutout-arms-crossed.png',
);

const EXPECTED_SOURCE_SHA256 =
  '45b1c324cae0f765fe81f8687c68557af04f5b091b28bb66f23e8cb0eab1685a';
```

- [ ] **Step 2: Assert the approved source identity and crop**

Add `createHash` from `node:crypto`, import `SOURCE_CROP`, and add these assertions before invoking the builder:

```js
const sourceBuffer = await readFile(sourcePath);
assert.equal(
  createHash('sha256').update(sourceBuffer).digest('hex'),
  EXPECTED_SOURCE_SHA256,
);

const source = await sharp(sourceBuffer).metadata();
assert.equal(source.width, 1122);
assert.equal(source.height, 1402);
assert.equal(source.hasAlpha, true);
assert.deepEqual(SOURCE_CROP, { left: 0, top: 0, width: 1122, height: 1122 });
```

- [ ] **Step 3: Add a regression fixture that detects resize-before-flatten halos**

Create a temporary 8×8 RGBA PNG whose transparent pixels contain white RGB and whose central 4×4 subject is opaque blue. Build it through `buildFounderAvatar` using an explicit `sourceExpectation` and `sourceCrop`, then assert every corner sample in the 1024 px result equals `AVATAR_BACKGROUND` exactly:

```js
const synthetic = Buffer.alloc(8 * 8 * 4, 255);
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
```

Read the generated 1024 px master as raw pixels and assert the four corner RGB triplets are `[13, 17, 23]`.

- [ ] **Step 4: Run the focused test and verify it fails for the old implementation**

Run:

```powershell
npm run founder-avatar:test
```

Expected: FAIL because the builder still expects the 1320×1192 neutral source and does not accept `sourceExpectation` or `sourceCrop` overrides.

---

### Task 2: Implement native-resolution compositing and regenerate the avatar

**Files:**
- Modify: `scripts/build-founder-avatar.mjs`
- Modify: `tests/founder-avatar.test.mjs`
- Modify: `brand-assets/profile/avatar/leo-ferraz-avatar-1024.png`
- Modify: `brand-assets/profile/avatar/leo-ferraz-avatar-512.png`
- Modify: `brand-assets/profile/avatar/leo-ferraz-avatar-256.png`

**Interfaces:**
- Consumes: approved source path, `sourceExpectation`, `sourceCrop`, `AVATAR_BACKGROUND` and `AVATAR_SIZES`.
- Produces: deterministic opaque PNG exports and a reusable `buildFounderAvatar(options)` function.

- [ ] **Step 1: Replace the canonical source constants**

```js
export const SOURCE_EXPECTATION = Object.freeze({
  width: 1122,
  height: 1402,
  hasAlpha: true,
});

export const SOURCE_CROP = Object.freeze({
  left: 0,
  top: 0,
  width: 1122,
  height: 1122,
});

const DEFAULT_SOURCE_PATH = path.join(
  root,
  'brand-assets',
  'profile',
  'leo-ferraz',
  'leo-ferraz-cutout-arms-crossed.png',
);
```

- [ ] **Step 2: Make source validation explicit and testable**

Change the function signature and metadata check to:

```js
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
```

- [ ] **Step 3: Flatten before resizing**

Replace the master pipeline with:

```js
const nativeComposite = await sharp(sourcePath)
  .extract(sourceCrop)
  .flatten({ background: { r: 13, g: 17, b: 23 } })
  .png(PNG_OPTIONS)
  .toBuffer();

const master = await sharp(nativeComposite)
  .resize(1024, 1024, { fit: 'fill', kernel: sharp.kernel.lanczos3 })
  .png(PNG_OPTIONS)
  .toBuffer();
```

This operation order is the implementation of the approved edge-decontamination rule. Do not add blur, erosion, synthetic outline or manual painting.

- [ ] **Step 4: Run the focused test**

Run:

```powershell
npm run founder-avatar:test
```

Expected: all founder-avatar tests PASS, including source hash, dimensions, opacity, corner background and synthetic hidden-white regression.

- [ ] **Step 5: Generate the canonical exports**

Run:

```powershell
npm run founder-avatar:build
```

Expected: the builder reports the 1024, 512 and 256 output paths under `brand-assets/profile/avatar/`.

- [ ] **Step 6: Re-run the focused test against the generated state**

Run:

```powershell
npm run founder-avatar:test
```

Expected: PASS with zero failures.

---

### Task 3: Perform visual and binary validation

**Files:**
- Verify: `brand-assets/profile/avatar/leo-ferraz-avatar-1024.png`
- Verify: `brand-assets/profile/avatar/leo-ferraz-avatar-512.png`
- Verify: `brand-assets/profile/avatar/leo-ferraz-avatar-256.png`
- Verify: `brand-assets/profile/leo-ferraz/leo-ferraz-cutout-*.png`

**Interfaces:**
- Consumes: generated canonical exports.
- Produces: objective metadata, source-integrity hashes and a human-readable circular review board stored only in an ignored temporary directory.

- [ ] **Step 1: Verify PNG metadata and opacity**

Run a Node/Sharp inspection that prints each canonical export's format, width, height and `hasAlpha`.

Expected:

```text
leo-ferraz-avatar-1024.png png 1024 1024 false
leo-ferraz-avatar-512.png png 512 512 false
leo-ferraz-avatar-256.png png 256 256 false
```

- [ ] **Step 2: Verify the approved cutouts remain byte-identical**

Run:

```powershell
Get-FileHash -Algorithm SHA256 brand-assets\profile\leo-ferraz\leo-ferraz-cutout-*.png
```

Expected: all six hashes match the recorded hashes in `DECISAO-021`; specifically arms-crossed remains `45B1C324...EAB1685A` and smile-three-quarter remains `0707CF8B...CA5BBEB`.

- [ ] **Step 3: Render an ignored visual review board**

Create the ignored file `.tmp/avatar-review/render.mjs` with:

```js
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const source = 'brand-assets/profile/avatar/leo-ferraz-avatar-1024.png';
const output = '.tmp/avatar-review/arms-crossed-avatar-review.png';
await mkdir('.tmp/avatar-review', { recursive: true });

async function circle(size) {
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/></svg>`,
  );
  return sharp(source)
    .resize(size, size)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

const board = await sharp({
  create: { width: 1536, height: 900, channels: 3, background: '#0D1117' },
})
  .composite([
    { input: await sharp(source).resize(720, 720).png().toBuffer(), left: 64, top: 90 },
    { input: await circle(256), left: 896, top: 120 },
    { input: await circle(64), left: 896, top: 470 },
    { input: await circle(32), left: 1000, top: 486 },
  ])
  .png()
  .toFile(output);

console.log(output);
```

Run:

```powershell
node .tmp/avatar-review/render.mjs
```

Expected: `.tmp/avatar-review/arms-crossed-avatar-review.png` exists and contains the square master plus circular 256 px, 64 px and 32 px samples. Do not stage `.tmp/`.

- [ ] **Step 4: Inspect the board visually**

Confirm:

- hair, eyes, ears, nose, mouth and chin are not clipped;
- the crossed-arm posture is perceptible at 256 px;
- the face remains recognizable at 64 px and 32 px;
- no white, grey or checkerboard-derived fringe is visible;
- the intentional blue rim light remains visible without becoming a halo;
- no grid, text, symbol or border appears inside the avatar.

If any criterion fails, stop before documentation or commit and adjust only `SOURCE_CROP` or the approved compositing order. Do not retouch the source image.

---

### Task 4: Promote the new governance state

**Files:**
- Modify: `brand/CHANNEL_SETUP_CHECKLIST.md`
- Modify: `docs/superpowers/specs/2026-08-22-arms-crossed-founder-social-avatar-design.md`
- Modify locally, excluded from Git: `cofre-leoferraz-dev/01_DECISOES/DECISAO-022 - Arms-Crossed Authority como Avatar Social Canonico.md`

**Interfaces:**
- Consumes: validated exports and visual-review evidence.
- Produces: canonical source declaration, implemented spec status and operational-memory evidence.

- [ ] **Step 1: Update the channel checklist source declaration**

Replace the neutral-source paragraph with:

```markdown
Derived from the founder-approved Arms-Crossed Authority cutout:
`brand-assets/profile/leo-ferraz/leo-ferraz-cutout-arms-crossed.png`.
The historical/alternative portrait is:
`brand-assets/profile/leo-ferraz/leo-ferraz-cutout-smile-three-quarter.png`.
The composition and exports are governed by `DECISAO-022` in the vault and
`docs/superpowers/specs/2026-08-22-arms-crossed-founder-social-avatar-design.md`.
```

- [ ] **Step 2: Mark the approved specification implemented**

Change only:

```yaml
implementation_status: implemented
```

- [ ] **Step 3: Update the Obsidian decision note**

In `DECISAO-022`, set `implementation_status: implemented`, check the completed execution items, and record:

- output dimensions and opacity;
- circular-review result;
- edge-contamination result;
- focused test result;
- brand-assets validation result;
- build result;
- final commit and push hashes after publication.

Keep the note excluded from Git and use wikilinks for related decisions.

---

### Task 5: Validate the complete repository and publish

**Files:**
- Stage only: `scripts/build-founder-avatar.mjs`
- Stage only: `tests/founder-avatar.test.mjs`
- Stage only: `brand-assets/profile/avatar/leo-ferraz-avatar-1024.png`
- Stage only: `brand-assets/profile/avatar/leo-ferraz-avatar-512.png`
- Stage only: `brand-assets/profile/avatar/leo-ferraz-avatar-256.png`
- Stage only: `brand/CHANNEL_SETUP_CHECKLIST.md`
- Stage only: `docs/superpowers/specs/2026-08-22-arms-crossed-founder-social-avatar-design.md`

**Interfaces:**
- Consumes: completed pipeline, exports and governance updates.
- Produces: validated `main` commit synchronized with `origin/main`.

- [ ] **Step 1: Run the focused avatar test**

```powershell
npm run founder-avatar:test
```

Expected: all tests pass with zero failures.

- [ ] **Step 2: Validate the complete brand-asset pack**

```powershell
npm run brand-assets:validate
```

Expected: `PASS` with all managed assets, mirrors, safe zones, dimensions, colors and fonts valid.

- [ ] **Step 3: Build the complete static site**

```powershell
npm run build
```

Expected: token validation passes, brand assets build successfully and Astro completes the static production build.

- [ ] **Step 4: Audit the tracked diff**

```powershell
git status --short --untracked-files=no
git diff --stat
git diff -- scripts/build-founder-avatar.mjs tests/founder-avatar.test.mjs brand/CHANNEL_SETUP_CHECKLIST.md docs/superpowers/specs/2026-08-22-arms-crossed-founder-social-avatar-design.md
```

Expected: exactly seven implementation paths are modified in total, including the three canonical PNG exports; no unrelated files are included.

- [ ] **Step 5: Stage only the approved implementation files**

```powershell
git add -- scripts/build-founder-avatar.mjs tests/founder-avatar.test.mjs brand-assets/profile/avatar/leo-ferraz-avatar-1024.png brand-assets/profile/avatar/leo-ferraz-avatar-512.png brand-assets/profile/avatar/leo-ferraz-avatar-256.png brand/CHANNEL_SETUP_CHECKLIST.md docs/superpowers/specs/2026-08-22-arms-crossed-founder-social-avatar-design.md
git diff --cached --stat
git diff --cached --name-only
```

Expected: exactly seven paths are staged.

- [ ] **Step 6: Commit the implementation**

```powershell
git commit -m "brand: promote arms-crossed founder avatar"
```

Expected: one commit containing only the approved implementation paths.

- [ ] **Step 7: Push and verify synchronization**

```powershell
git push origin main
git fetch origin main
git rev-parse HEAD
git rev-parse origin/main
git status --short --untracked-files=no
```

Expected: `HEAD` equals `origin/main`, branch is `main`, and the tracked working tree is clean.

- [ ] **Step 8: Complete the Obsidian evidence record**

Append the final commit hash, push destination and synchronization evidence to `DECISAO-022`. Confirm the note remains excluded from Git.

---

## Out of Scope

- Uploading the avatar to YouTube, Twitch, Instagram, TikTok, X, LinkedIn, GitHub, Reddit or Substack.
- Changing social banners, favicons, the Constructed LF symbol or signature assets.
- Regenerating or retouching any founder photograph.
- Creating a second canonical export set for `smile-three-quarter`.
- Deploying the website solely because avatar repository assets changed.
