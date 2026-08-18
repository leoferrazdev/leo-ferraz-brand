# Responsive Signature Distribution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the canonical signature rules, generated Day-1 assets and Astro site use the correct responsive signature variant for each context.

**Architecture:** `brand/SIGNATURE.md` defines the human-readable mapping. `scripts/build-brand-assets.mjs` generates all static exports and writes `signature_variant` metadata; `scripts/validate-brand-assets.mjs` enforces the role mapping. Astro consumes only approved exported SVG files through `BrandSignature`.

**Tech Stack:** Markdown, Node.js 22, SVG, Sharp, Astro 7.2.2, Obsidian Markdown, Git.

## Global Constraints

- Preserve Constructed LF geometry, IBM Plex typography, Precision / Product colors and the functional underline.
- Preserve every existing canvas dimension and platform safe zone.
- Do not introduce new public copy.
- Keep legacy aliases for compatibility; do not use them in new compositions.
- Preserve unrelated homepage work and stage only task-specific hunks.
- Do not perform a manual deployment.

---

### Task 1: Canonical responsive signature governance

**Files:**
- Modify: `brand/SIGNATURE.md`
- Modify: `brand/DESIGN_SYSTEM.md`
- Modify: `brand/CHANNEL_SETUP_CHECKLIST.md`

**Interfaces:**
- Produces: canonical context-to-variant matrix consumed by generation and site implementation.

- [ ] **Step 1:** Bump `SIGNATURE.md` to version `0.4.0` and replace the universal-default wording with the responsive identity rule.
- [ ] **Step 2:** Add the exact site, social, video, channel and institutional mappings from the approved design spec.
- [ ] **Step 3:** Document `signature_variant` as generated manifest metadata in `DESIGN_SYSTEM.md`.
- [ ] **Step 4:** Annotate channel assets in `CHANNEL_SETUP_CHECKLIST.md` with their canonical variants.

### Task 2: Deterministic asset composition

**Files:**
- Modify: `scripts/build-brand-assets.mjs`
- Modify: `scripts/render-brand-content.mjs`
- Modify: `scripts/validate-brand-assets.mjs`
- Regenerate: `brand-assets/manifest.json`
- Regenerate: `brand-assets/deterministic.sha256`
- Regenerate: `brand-assets/exports/day-1/**`
- Regenerate: `public/brand-assets/exports/day-1/**`
- Regenerate: `live/obs/**`

**Interfaces:**
- Produces: `signature_variant` values `primary-symbol`, `wordmark-only`, `primary-lockup`, `descriptor-lockup`, `institutional-lockup` or `none`.

- [ ] **Step 1:** Add a reusable placement helper that inserts canonical outlined signature assets into larger SVG compositions.
- [ ] **Step 2:** Map channel banners to `descriptor-lockup`.
- [ ] **Step 3:** Map carousel/social-square/OBS scenes to `wordmark-only`; map Story/Reels/thumbnails/brand bug to `primary-symbol`.
- [ ] **Step 4:** Keep the lower third on `descriptor-lockup` and remove duplicate brand naming from Open Graph.
- [ ] **Step 5:** Make the on-demand renderer load canonical exported signature SVGs instead of drawing brand text.
- [ ] **Step 6:** Add manifest assertions for every application role and run `npm run brand-assets:build` followed by `npm run brand-assets:validate`.

### Task 3: Website distribution

**Files:**
- Modify: `src/components/site/SiteHeader.astro`
- Modify: `src/components/site/SiteFooter.astro`
- Modify task-specific hunk only: `src/pages/index.astro`

**Interfaces:**
- Consumes: semantic variants from `BrandSignature.astro`.
- Produces: wordmark-only navigation and footer, with no repeated hero signature.

- [ ] **Step 1:** Change the header from `primaryLockup` to `wordmarkOnly`.
- [ ] **Step 2:** Change the footer from symbol plus typed name to `wordmarkOnly`, keeping institutional metadata separate.
- [ ] **Step 3:** Remove only the hero `institutional` signature line from the dirty homepage file; preserve every other local homepage change.

### Task 4: Verification and publication

**Files:**
- Create: `cofre-leoferraz-dev/01_DECISOES/DECISAO-006 - Responsive Signature Distribution.md`
- Create: `cofre-leoferraz-dev/02_EXECUCAO/2026-08-18 — Responsive Signature Distribution.md`

**Interfaces:**
- Produces: operational decision, evidence and publication record.

- [ ] **Step 1:** Run `npm run brand-assets:validate` and two consecutive `npm run build` executions.
- [ ] **Step 2:** Verify `/`, `/brand/` and representative canonical assets with HTTP 200.
- [ ] **Step 3:** Audit `git diff --check`, stage explicit files and the isolated homepage hunk, and confirm no unrelated homepage files are staged.
- [ ] **Step 4:** Commit with `feat: implement responsive signature distribution` and push `main` to `origin/main`.
- [ ] **Step 5:** Record commit, push, validation evidence and remaining external migration work in the Obsidian vault.
