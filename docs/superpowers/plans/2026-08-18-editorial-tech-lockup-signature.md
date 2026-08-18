# Editorial Tech Lockup Signature Implementation Plan

> **For agentic workers:** Execute this plan task-by-task with verification checkpoints. The user has granted autonomous execution for design, brand, development, validation, Git and publication.

**Goal:** Promote `Option C — Editorial Tech Lockup` from reviewed candidate to the deterministic Leo Ferraz signature system across canonical documentation, generated assets, website components and operational memory.

**Architecture:** Keep `Leo Ferraz` as the dominant typographic Master Brand and `Building with AI` as the subordinate descriptor. Add one small removable structural marker to signature compositions; generate the marker as allowed SVG geometry and retain IBM Plex Sans + IBM Plex Mono. All derivative assets remain generated from `brand-assets/sources/content.json` and `scripts/build-brand-assets.mjs`, while canonical policy is recorded in `brand/SIGNATURE.md`.

**Tech Stack:** Markdown/Obsidian Flavored Markdown, Astro 7.2.2, IBM Plex Sans, IBM Plex Mono, Node.js 22.23.2, Sharp, fontkitten, SVG outlines, PNG/ICO generation, npm scripts, GitHub Actions.

## Global Constraints

- Master Brand remains `Leo Ferraz`.
- Descriptor remains `Building with AI`.
- Institutional Category remains `AI-Native Product Lab`.
- Primary wordmark remains IBM Plex Sans 500 with `-0.035em` tracking.
- The marker is functional, removable and is not a monogram, AI symbol or independent logo.
- `#4DA3FF` is the only structural marker accent; no new color token is created.
- The signature survives monochrome and must not depend on glow, gradients or decorative shadows.
- Real products and artifacts remain visually prior to the signature.
- Do not introduce new public copy, product claims, metrics or categories.
- Do not add `dist/`, `node_modules/`, `.astro/` or `cofre-leoferraz-dev/` to Git.
- Preserve Node `v22.23.2` and Astro `7.2.2`.
- Push only after all local validation and public deployment checks pass.

---

### Task 1: Promote the canonical signature decision

**Files:**
- Modify: `brand/SIGNATURE.md`
- Modify: `brand/SIGNATURE_OPTIONS.md`
- Modify: `docs/superpowers/specs/2026-08-18-signature-editorial-tech-lockup-design.md`

**Interfaces:**
- Consumes: the approved candidate selection `Option C — Editorial Tech Lockup` and existing v1.0.0 identity constraints.
- Produces: canonical documentation declaring `Editorial Tech Lockup` selected, with marker governance and unchanged Master Brand/Descriptor relationships.

- [ ] Update `brand/SIGNATURE.md` from `Pure / Editorial` to `Editorial Tech Lockup`, preserving all unchanged identity values.
- [ ] Add the marker definition: a small blue structural marker, optional in constrained contexts, never a monogram or independent symbol.
- [ ] Update `brand/SIGNATURE_OPTIONS.md` so Option C is `selected` and the prior Pure / Editorial option is historical exploration evidence.
- [ ] Change the design specification status from `review` to `approved` after confirming the implementation scope remains identical.
- [ ] Run `rg -n "Master Brand|Descriptor|Institutional Category|selected_system|marker|Pure / Editorial|Editorial Tech Lockup" brand/SIGNATURE.md brand/SIGNATURE_OPTIONS.md` and confirm no identity value drift.

### Task 2: Implement the marker in the deterministic signature layer

**Files:**
- Modify: `brand-assets/sources/content.json`
- Modify: `scripts/build-brand-assets.mjs`
- Modify: `scripts/validate-brand-assets.mjs`
- Modify: `src/components/brand/BrandSignature.astro`

**Interfaces:**
- Consumes: `content.brand`, `content.descriptor`, existing palette and font outline functions.
- Produces: outlined SVG signatures and Astro signatures with an optional `.brand-signature__marker`.

- [ ] Add only the derived marker configuration to `brand-assets/sources/content.json`, using a semantic value such as `signatureMarker: "square"`.
- [ ] Add a generator helper with this contract:

```js
function signatureMarkerSvg({ x, y, size = 8, fill = colors.accent }) {
  return `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${fill}"/>`;
}
```

- [ ] Extend the primary, descriptor and institutional SVG compositions with the marker positioned to the left of the name and aligned to the name's top cap-height region.
- [ ] Keep `wordmark-dark.svg` monochrome by passing `colors.background` or `colors.text` according to the existing dark treatment; never introduce an accent dependency into the dark variant.
- [ ] Keep utility `LF` unchanged as a secondary utility mark; the marker must not replace it or become the avatar identity by default.
- [ ] Update `BrandSignature.astro` to render the marker only for `wordmark`, `descriptor` and `institutional` variants, with `aria-hidden="true"` and an optional CSS hide at compact widths.
- [ ] Keep utility variant markup unchanged except for any required spacing isolation.
- [ ] Extend validation so signature SVGs contain the approved marker color only where expected, contain no unapproved geometry effects, contain no `<text>`, scripts, embedded fonts or external URLs, and remain valid outlined identity assets.

### Task 3: Regenerate operational and website assets

**Files:**
- Generated: `brand-assets/exports/day-1/`
- Generated: `public/brand-assets/exports/day-1/`
- Generated: `public/favicon.*`, `public/icon-*.png`, `public/site.webmanifest`
- Modify if required: `src/layouts/BaseLayout.astro`, `src/components/site/SiteHeader.astro`, `src/components/site/SiteFooter.astro`
- Modify if required: `brand/LIVE_LAUNCH_PACK.md`, `brand/CHANNEL_SETUP_CHECKLIST.md`

**Interfaces:**
- Consumes: updated content source and generator.
- Produces: marker-aware wordmarks, lockups, banners, social assets, favicon family and website projection.

- [ ] Run `npm run brand-assets:build`.
- [ ] Confirm the manifest source remains `v1.0.0` and the asset count is deterministic.
- [ ] Confirm every public signature projection uses the same marker geometry and no stale Pure / Editorial references remain in operational docs.
- [ ] Confirm the homepage header uses the canonical `BrandSignature` component and does not reconstruct the wordmark manually.
- [ ] Confirm favicon and avatar continue using `LF` utility treatment unless the canonical signature review explicitly requires a compact marker variant.

### Task 4: Validate all outputs and record the Obsidian execution state

**Files:**
- Create: `cofre-leoferraz-dev/01_DECISOES/DECISAO-002 - Editorial Tech Lockup.md` (ignored operational vault note)
- Modify: `cofre-leoferraz-dev/02_EXECUCAO/2026-08-17 — Day-1 Launch Readiness.md` (ignored operational vault note)

**Interfaces:**
- Consumes: canonical signature decision, implementation results and public verification.
- Produces: Obsidian decision record with frontmatter, wikilinks, execution status and no secrets.

- [ ] Run `npm ci` only if dependency state changed; otherwise preserve the validated install.
- [ ] Run `npm run tokens:validate`.
- [ ] Run `npm run brand-assets:validate`.
- [ ] Run `npm run build` twice and confirm both builds produce only `/` and `/brand/` in `dist/`.
- [ ] Validate the review route is absent from `dist/`.
- [ ] Validate local or preview HTTP 200 for `/`, `/brand/`, `/favicon.svg`, `/site.webmanifest` and the primary wordmark asset.
- [ ] Create the Obsidian decision note with `status: approved`, `source: [[SIGNATURE]]`, `selected_option: Editorial Tech Lockup`, and links to the implementation commit after it exists.
- [ ] Update the Day-1 note with the new signature decision and final commit/push/deploy status.

### Task 5: Audit, commit, publish and verify production

**Files:**
- Stage only files changed by Tasks 1–4.

**Interfaces:**
- Consumes: validated canonical docs, generated assets, website projection and operational notes.
- Produces: one auditable commit on `main`, synchronized `origin/main`, successful automatic deployment and public HTTP verification.

- [ ] Run `git diff --check` and `git status --short`.
- [ ] Confirm no `brand/*.md` outside `SIGNATURE.md`, `SIGNATURE_OPTIONS.md`, and explicitly updated operational docs changed.
- [ ] Confirm no `dist/`, `node_modules/`, `.astro/` or `cofre-leoferraz-dev/` is staged.
- [ ] Create exactly:

```text
feat: promote editorial tech lockup signature
```

- [ ] Run `git push origin main`.
- [ ] Monitor the existing `Deploy leoferraz.dev` workflow to success.
- [ ] Verify public HTTP 200 for `/`, `/brand/`, `/favicon.svg`, `/site.webmanifest`, the primary wordmark and Open Graph asset.
- [ ] Verify `HEAD == origin/main`, branch `main`, clean working tree and no unintended files.

## Plan Self-Review

- Canonical scope is isolated to signature documents and derived implementation assets.
- The Master Brand, descriptor, category, handle, domain, color system and typography values are preserved.
- The marker has explicit geometry, color, accessibility and removal rules.
- Generator, validator, website component, docs, vault, Git and public deployment each have a verification task.
- No placeholder decisions remain in the execution tasks.
