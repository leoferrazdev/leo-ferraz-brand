# Homepage Featured Concept Implementation Plan

> **For agentic workers:** Execute this plan task-by-task with review checkpoints. The current `AGENTS.md` forbids automatic commit, push and deploy; this plan covers local implementation and validation only.

**Goal:** Replace the initial homepage shell with a deterministic editorial business-card homepage centered on one clearly fictional SaaS concept.

**Architecture:** Keep the approved Brand System as the visual source of truth. Store temporary homepage content in a typed application data module, render the featured concept and two secondary slots through focused Astro components, and use existing brand primitives for signature, artifact framing and evidence. The fictional state is visible in the interface and contains no metrics or external destination claims.

**Tech Stack:** Astro 7.2.2, TypeScript-in-Astro, IBM Plex Sans, IBM Plex Mono, generated CSS tokens, static site generation.

## Global Constraints

- Master Brand remains `Leo Ferraz`.
- Descriptor remains `Building with AI`.
- Institutional Category remains `AI-Native Product Lab`.
- Signature remains `Editorial Tech Lockup`.
- Featured concept is `PROJECT 001 — SAAS CONCEPT`.
- Secondary slots are `PROJECT 002 — APP CONCEPT` and `PROJECT 003 — GAME CONCEPT`.
- All temporary content is labeled `FICTIONAL CONTENT` and `REVIEW ONLY`.
- No fictional metrics, commits, testimonials, outcomes or external CTAs.
- The only initial functional homepage destination is `/brand/`.
- Use existing tokens and brand primitives; do not add colors, fonts, gradients, glow or client JavaScript.
- Do not modify `brand/*.md` other than the approved application specification already updated here.
- Do not add `dist/`, `node_modules/`, `.astro/` or `cofre-leoferraz-dev/` to Git.
- Do not commit, push, tag, release or deploy in this task.

---

### Task 1: Define temporary homepage content

**Files:**
- Create: `src/data/homepage-content.ts`

**Interfaces:**
- Produces `featuredConcept` and `secondaryConcepts` typed as `HomepageConcept` for the Astro page and components.

- [ ] Create the `HomepageConcept` type with `id`, `label`, `category`, `status`, `title`, `description`, `artifactLabel`, `artifactLines`, `evidence`, and optional `destination`.
- [ ] Define `featuredConcept` with `PROJECT 001`, `SAAS CONCEPT`, `FICTIONAL CONTENT`, `REVIEW ONLY`, no metrics and no destination.
- [ ] Define two secondary concepts with `PROJECT 002 — APP CONCEPT` and `PROJECT 003 — GAME CONCEPT`, both marked `CONCEPT SLOT` and without claims.

### Task 2: Build focused editorial components

**Files:**
- Create: `src/components/home/FeaturedConcept.astro`
- Create: `src/components/home/ConceptSlot.astro`

**Interfaces:**
- `FeaturedConcept.astro` consumes one `HomepageConcept` and renders label, status, title, description, mock artifact and review-only evidence.
- `ConceptSlot.astro` consumes one `HomepageConcept` and renders a compact non-link slot with its temporary status.

- [ ] Use `ArtifactFrame`, `EvidenceBlock` and `StatusLabel` without adding new brand primitives.
- [ ] Make `FICTIONAL CONTENT`, `REVIEW ONLY` and `NO LIVE METRICS` visible in the featured concept.
- [ ] Render the artifact as flat structural mock content using existing surfaces, borders and typography only.
- [ ] Render secondary slots without clickable fake destinations.
- [ ] Keep all components static and free of client directives.

### Task 3: Compose the homepage

**Files:**
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes the canonical `BrandSignature`, canonical bio/category text, `featuredConcept`, and `secondaryConcepts`.
- Produces the static homepage route `/` with a hero, featured concept, secondary slots, Brand System link and footer.

- [ ] Replace the initial shell with the approved Featured Concept composition.
- [ ] Use `BrandSignature variant="institutional"` in the hero.
- [ ] Preserve the canonical bio literally.
- [ ] Add exactly one functional homepage link to `/brand/`.
- [ ] Keep the first reading as Leo Ferraz and product building, not as a fictional SaaS claim.

### Task 4: Validate locally and record operational state

**Files:**
- Create: `cofre-leoferraz-dev/02_EXECUCAO/2026-08-18 — Homepage Featured Concept.md` (ignored operational vault note)

- [ ] Run `npm run tokens:validate`.
- [ ] Run `npm run build` twice.
- [ ] Confirm `dist/` contains only `/` and `/brand/` routes for the application pages.
- [ ] Confirm no intentional client JavaScript appears in generated HTML.
- [ ] Run a local preview and verify `/` and `/brand/` return HTTP 200.
- [ ] Confirm `git status` contains only intended homepage implementation files and no generated build directories.
- [ ] Do not commit, push or deploy under the current repository instructions.

## Self-Review

- The homepage uses only approved brand identity values plus explicitly fictional application content.
- The fictional SaaS cannot be mistaken for a live product because its state is repeated in the hero/card evidence layer.
- Real-product replacement is isolated to `src/data/homepage-content.ts`.
- No new canonical color, typeface, logo, promise, metric or product claim is introduced.
