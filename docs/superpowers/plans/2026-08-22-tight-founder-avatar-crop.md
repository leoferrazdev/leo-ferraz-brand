# Tight Founder Avatar Crop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Promote the approved `OPTION D — Tight / 820` crop to the three canonical founder-avatar exports.

**Architecture:** Preserve the implemented arms-crossed source, canonical background and flatten-before-resize pipeline. Change only the deterministic crop contract from 1122×1122 to the centered, top-anchored 820×820 region, regenerate all sizes from one opaque master, visually validate the circular safe area, then update governance and publish.

**Tech Stack:** Node.js 22, Sharp 0.35.3, Node test runner, Astro 7.2.2, PNG and Markdown.

## Global Constraints

- Source remains `brand-assets/profile/leo-ferraz/leo-ferraz-cutout-arms-crossed.png`.
- Approved crop is exactly `{ left: 151, top: 0, width: 820, height: 820 }`.
- Background remains solid `#0D1117` without grid or texture.
- Pipeline order remains `crop → flatten → resize`.
- Canonical filenames remain unchanged at 1024, 512 and 256 px.
- Face recognition takes priority; shoulders remain visible; complete crossed arms are not required.
- Preserve the six founder cutouts byte-identically.
- Do not stage unrelated work or upload to external platforms.

---

### Task 1: Change the crop contract through TDD

**Files:**
- Modify: `tests/founder-avatar.test.mjs`
- Modify: `scripts/build-founder-avatar.mjs`

**Interfaces:**
- Consumes: exported `SOURCE_CROP` and `buildFounderAvatar()`.
- Produces: a locked crop `{ left: 151, top: 0, width: 820, height: 820 }` with all existing anti-halo tests preserved.

- [ ] **Step 1: Change only the expected crop in the test**

```js
assert.deepEqual(SOURCE_CROP, { left: 151, top: 0, width: 820, height: 820 });
```

- [ ] **Step 2: Run the focused test and verify the red state**

```powershell
npm run founder-avatar:test
```

Expected: one failure showing the current 1122×1122 crop differs from the approved 820×820 crop; the hidden-light RGB regression remains passing.

- [ ] **Step 3: Implement the approved crop**

```js
export const SOURCE_CROP = Object.freeze({ left: 151, top: 0, width: 820, height: 820 });
```

- [ ] **Step 4: Run the focused test again**

```powershell
npm run founder-avatar:test
```

Expected: two tests pass with zero failures.

---

### Task 2: Regenerate and validate the close-crop exports

**Files:**
- Modify: `brand-assets/profile/avatar/leo-ferraz-avatar-1024.png`
- Modify: `brand-assets/profile/avatar/leo-ferraz-avatar-512.png`
- Modify: `brand-assets/profile/avatar/leo-ferraz-avatar-256.png`

**Interfaces:**
- Consumes: updated `SOURCE_CROP` through `npm run founder-avatar:build`.
- Produces: three opaque canonical PNG files with identical composition.

- [ ] **Step 1: Generate all canonical sizes**

```powershell
npm run founder-avatar:build
```

Expected: output paths for 1024, 512 and 256 px are reported.

- [ ] **Step 2: Repeat the focused test after generation**

```powershell
npm run founder-avatar:test
```

Expected: two tests pass with zero failures.

- [ ] **Step 3: Verify metadata and opacity**

Use Sharp to print format, width, height and `hasAlpha` for all three files.

Expected:

```text
leo-ferraz-avatar-1024.png png 1024x1024 alpha=false
leo-ferraz-avatar-512.png png 512x512 alpha=false
leo-ferraz-avatar-256.png png 256x256 alpha=false
```

- [ ] **Step 4: Render the existing ignored review board**

```powershell
node .tmp/avatar-review/render.mjs
```

Expected: `.tmp/avatar-review/arms-crossed-avatar-review.png` is regenerated from the new canonical 1024 px master.

- [ ] **Step 5: Inspect square and circular samples**

Confirm all of the following:

- eyes, hair, ears, nose, mouth and chin are fully visible;
- face is dominant at 256 px;
- face remains identifiable at 64 px and 32 px;
- shoulders remain visible without a floating-head effect;
- no white, grey or checkerboard-derived fringe appears;
- the blue rim light remains intentional and controlled.

Stop before publication if any criterion fails. Adjust only the approved crop implementation or compositing order; do not retouch the source.

---

### Task 3: Promote governance and validate the repository

**Files:**
- Modify: `docs/superpowers/specs/2026-08-22-arms-crossed-founder-social-avatar-design.md`
- Modify locally, excluded from Git: `cofre-leoferraz-dev/01_DECISOES/DECISAO-023 - Close Crop Tight para Avatar Social.md`

**Interfaces:**
- Consumes: validated close-crop exports.
- Produces: implemented specification, operational evidence and synchronized `main`.

- [ ] **Step 1: Mark the specification implemented**

```yaml
implementation_status: implemented
```

- [ ] **Step 2: Update `DECISAO-023`**

Set `implementation_status: implemented`, check completed tasks and record dimensions, opacity, circular review, anti-halo result, tests, asset validation, build, commit and push evidence.

- [ ] **Step 3: Run complete validation**

```powershell
npm run founder-avatar:test
npm run brand-assets:validate
npm run build
```

Expected:

- founder-avatar tests pass with zero failures;
- all managed brand assets validate;
- tokens show no drift;
- Astro completes the static build.

- [ ] **Step 4: Verify cutout integrity**

```powershell
Get-FileHash -Algorithm SHA256 brand-assets\profile\leo-ferraz\leo-ferraz-cutout-*.png
```

Expected: all six hashes remain identical to the values recorded in `DECISAO-021`.

- [ ] **Step 5: Audit and stage only the six implementation paths**

```powershell
git status --short --untracked-files=no
git diff --stat
git add -- scripts/build-founder-avatar.mjs tests/founder-avatar.test.mjs brand-assets/profile/avatar/leo-ferraz-avatar-1024.png brand-assets/profile/avatar/leo-ferraz-avatar-512.png brand-assets/profile/avatar/leo-ferraz-avatar-256.png docs/superpowers/specs/2026-08-22-arms-crossed-founder-social-avatar-design.md
git diff --cached --name-only
```

Expected: exactly six paths are staged; no unrelated file is included.

- [ ] **Step 6: Commit and push**

```powershell
git commit -m "brand: tighten canonical founder avatar crop"
git push origin main
git fetch origin main
git rev-parse HEAD
git rev-parse origin/main
git status --short --untracked-files=no
```

Expected: `HEAD` equals `origin/main`, branch is `main`, and the tracked working tree is clean.

- [ ] **Step 7: Complete the local vault evidence**

Append the final commit hash and synchronization evidence to `DECISAO-023`. Confirm the vault remains excluded from Git.

---

## Out of Scope

- Changing the approved founder source or historical alternative.
- Modifying banners, cards, favicons, signature assets or the website.
- Uploading the avatar to social networks.
- Adding facial retouching, background texture, grid, glow, border or typography.
