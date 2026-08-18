# Constructed LF Hybrid Signature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: use executing-plans to implement this plan task-by-task. The user delegated design, brand, development, validation, Git and publication decisions to the agent.

**Goal:** Replace the typeset-only signature with a deterministic primary symbol plus wordmark system and regenerate every Day-1 asset with enforced safe zones.

**Architecture:** Implement one reusable `Constructed LF` geometry in the asset generator and an equivalent accessible inline SVG in the Astro brand component. Keep all public content, IBM Plex typography and Precision / Product colors unchanged while migrating avatars, favicons, lockups and derived channel assets to the hybrid system.

**Tech Stack:** Markdown, Obsidian Flavored Markdown, Astro 7.2.2, Node.js 22.23.2, Sharp, fontkitten, SVG, PNG, ICO, JSON design tokens.

## Global Constraints

- Master Brand remains `Leo Ferraz`.
- Descriptor remains `Building with AI`.
- Institutional Category remains `AI-Native Product Lab`.
- Selected signature becomes `Constructed LF Lockup`.
- Symbol geometry uses the exact 64 × 64 construction from the approved spec.
- Colors remain `#F3F6FA`, `#0D1117` and the controlled active module `#4DA3FF`.
- No gradient, glow, shadow, decorative outline or generic AI symbol.
- Every export must include safe-zone metadata and no visible safe-zone guide.
- Preserve unrelated homepage work and do not stage it.

---

### Task 1: Promote the canonical signature decision

**Files:**
- Modify: `brand/SIGNATURE.md`
- Modify: `brand/SIGNATURE_OPTIONS.md`
- Modify: `brand/BRAND_SYSTEM.md`
- Modify: `brand/LIVE_LAUNCH_PACK.md`
- Modify: `brand/CHANNEL_SETUP_CHECKLIST.md`

**Interfaces:**
- Consumes: approved brand foundations and this specification.
- Produces: canonical governance for `Constructed LF Lockup`.

- [ ] Record the new primary symbol, construction, variants, clear space and minimum sizes.
- [ ] Preserve the former `Editorial Tech Lockup` as superseded historical evidence.
- [ ] Confirm no strategic or verbal identity value changes.

### Task 2: Encode the symbol in tokens and source data

**Files:**
- Modify: `tokens/tokens.json`
- Modify: `scripts/build-tokens.mjs`
- Modify: `scripts/validate-tokens.mjs`
- Modify: `brand-assets/sources/content.json`

**Interfaces:**
- Produces: `signature.symbol.*` tokens and `signatureSymbol: constructed-lf` source contract.

- [ ] Replace marker/utility-only state with the primary symbol contract.
- [ ] Generate CSS variables for symbol size, gap, clear space and active module color.
- [ ] Make validation fail on signature-system drift.

### Task 3: Implement deterministic SVG generation

**Files:**
- Modify: `scripts/build-brand-assets.mjs`
- Modify: `scripts/validate-brand-assets.mjs`

**Interfaces:**
- Produces: `constructedLfSymbolSvg()`, hybrid lockups, compact symbol exports and safe-zone metadata.

- [ ] Implement the exact paths from the approved specification.
- [ ] Replace the square marker and typed `LF` avatar/favicon construction.
- [ ] Add canonical `leo-ferraz-symbol.svg` and dark variant.
- [ ] Regenerate every mirrored export and deterministic hash.
- [ ] Validate symbol fingerprint, dimensions, colors, outlines and safe zones.

### Task 4: Update the executable website projection

**Files:**
- Modify: `src/components/brand/BrandSignature.astro`
- Modify: `src/pages/brand/index.astro`
- Modify: `src/styles/global.css`
- Modify if needed: `src/components/site/SiteFooter.astro`

**Interfaces:**
- Produces: accessible hybrid lockups using the same symbol geometry.

- [ ] Render the symbol as inline SVG with `aria-hidden=true` beside the readable name.
- [ ] Render symbol-only compact variant with an accessible label.
- [ ] Update public brandbook labels and usage guidance.

### Task 5: Verify, document and publish

**Files:**
- Create: `cofre-leoferraz-dev/01_DECISOES/DECISAO-004 - Constructed LF Lockup.md`
- Modify: `cofre-leoferraz-dev/02_EXECUCAO/2026-08-17 — Day-1 Launch Readiness.md`

**Interfaces:**
- Produces: validated operational record, auditable commit and synchronized `origin/main`.

- [ ] Run token validation/build, asset build/validation and two complete site builds.
- [ ] Review avatar, favicon, horizontal lockup, banner, social and Open Graph outputs visually.
- [ ] Audit the diff and stage only signature/safe-zone scope files.
- [ ] Commit and push to `main`.
- [ ] Record commit, push and deployment evidence in the ignored Obsidian vault.

## Plan self-review

- The plan covers canonical decisions, source data, tokens, vector generation, website projection, safe zones, validation, Obsidian, Git and deployment.
- No placeholder decision remains.
- Unrelated homepage files remain explicitly outside the staged scope.
