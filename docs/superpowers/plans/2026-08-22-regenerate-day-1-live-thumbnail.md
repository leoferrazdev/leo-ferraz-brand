# Regenerate Day-1 Live Thumbnail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Regenerate the Day-1 YouTube live thumbnail as `brand-assets/thumbnails/live_1.png` and `live_1.jpg` using the approved cutout cover standard.

**Architecture:** Reuse `scripts/build-cutout-cover.mjs`, which already implements `brand/PADRAO-CAPAS.md` and the approved Day-1 live composition. Make the canonical live composition publish both the operational `live_1` pair and the existing `live_4` pair from one shared specification, ensuring the two aliases cannot drift.

**Tech Stack:** Node.js, Sharp, fontkitten, PNG/JPEG, Git, Obsidian Markdown.

## Global Constraints

- Canvas: `1280×720`.
- Background: `#0D1117` with the 48px brand grid.
- Live badge: `#E5484D`, white `AO VIVO` text.
- Headline: `SEM CORTES / DO ERRO / À SOLUÇÃO`, entirely `#F3F6FA`.
- Portrait: `leo-ferraz-cutout-arms-crossed.png`, transparent background, bleeding from the bottom in the right half.
- No gradient, glow, bottom bar or blue headline word.
- Preserve unrelated tracked and untracked files.
- No deploy or platform upload.

---

### Task 1: Publish the canonical live composition as `live_1`

**Files:**
- Modify: `scripts/build-cutout-cover.mjs`
- Modify: `brand-assets/thumbnails/live_1.png`
- Modify: `brand-assets/thumbnails/live_1.jpg`
- Preserve byte-identical: `brand-assets/thumbnails/live_4.png`
- Preserve byte-identical: `brand-assets/thumbnails/live_4.jpg`
- Create: `cofre-leoferraz-dev/02_EXECUCAO/2026-08/2026-08-22 — Regeneracao da Thumbnail da Live Dia 1.md`

**Interfaces:**
- Consumes: the approved live composition implemented by `build({ ... })` in `scripts/build-cutout-cover.mjs`.
- Produces: the operational `live_1.png`/`.jpg` pair and a repeatable generator path that keeps it aligned with `live_4`.

- [x] **Step 1: Record the current SHA-256 values**

Run:

```powershell
Get-FileHash brand-assets/thumbnails/live_1.png, brand-assets/thumbnails/live_1.jpg, brand-assets/thumbnails/live_4.png, brand-assets/thumbnails/live_4.jpg -Algorithm SHA256
```

Expected: four baseline hashes are available before modification.

- [x] **Step 2: Add the `live_1` output alias**

Extract the approved live arguments to one `liveCover` object and invoke `build()` for both IDs:

```js
const liveCover = {
  W: 1280,
  H: 720,
  cell: 48,
  badgeSpec: { text: 'AO VIVO', x: 64, y: 56, size: 26, height: 56, fill: colors.live, ink: '#FFFFFF' },
  headline: [
    [{ text: 'SEM CORTES', fill: colors.text }],
    [{ text: 'DO ERRO', fill: colors.text }],
    [{ text: 'À SOLUÇÃO', fill: colors.text }],
  ],
  headSize: 84,
  headX: 64,
  headTop: 205,
  photo: 'leo-ferraz-cutout-arms-crossed.png',
  zone: { x: 640, y: 0, w: 640, h: 720 },
  outDir: path.join(root, 'brand-assets', 'thumbnails'),
};

for (const id of ['live_1', 'live_4']) await build({ id, ...liveCover });
```

- [x] **Step 3: Regenerate the live pair**

Run:

```powershell
node scripts/build-cutout-cover.mjs live
```

Expected: `live_1` and `live_4` PNG/JPEG pairs are generated without overflow warnings.

- [x] **Step 4: Validate output contracts**

Run a Sharp metadata check and SHA-256 comparison.

Expected:

- all four files are exactly `1280×720`;
- `live_1.png` equals `live_4.png` byte-for-byte;
- `live_1.jpg` equals `live_4.jpg` byte-for-byte;
- `live_4` hashes remain unchanged from Step 1.

- [x] **Step 5: Inspect the PNG at original detail**

Expected: complete red badge, three clean white headline lines, unobstructed arms-crossed portrait, clear text/photo separation, no background fringe, gradient, glow or lower bar.

- [x] **Step 6: Run repository validation**

Run:

```powershell
npm run brand-assets:validate
npm run build
git diff --check
```

Expected: all commands exit `0`.

- [x] **Step 7: Register the execution in Obsidian**

Record decision, execution, evidence and pending external publication in the specified vault note. Do not record secrets.

- [ ] **Step 8: Commit and push**

Stage only the plan, generator, `live_1.png`, `live_1.jpg`, and any tracked documentation intentionally updated. Do not stage the ignored vault or unrelated files.

Commit:

```text
brand: regenerate day-one live thumbnail
```

Push `main` to `origin/main`, then verify `HEAD == origin/main`.
