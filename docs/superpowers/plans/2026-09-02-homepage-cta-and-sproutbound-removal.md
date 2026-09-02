# Homepage CTA and Sproutbound Removal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the homepage's next step visually explicit and remove Sproutbound from every public site surface while preserving its historical implementation for possible future reactivation.

**Architecture:** Keep the existing conversion section after the homepage hero, but give it a two-column editorial layout on wider screens: approved copy and WhatsApp CTA on one side, a semantic three-step diagram on the other. Remove the game imports and rendered sections from `/` and `/laboratorio/`, and remove only the public Sproutbound evidence asset; leave the reusable game component, data, CSS, and historical records unreferenced in the repository.

**Tech Stack:** Astro 7.2.2, TypeScript in Astro scripts, existing global CSS tokens, existing GA4 `gtag` installation, Obsidian-compatible Markdown.

## Global Constraints

- The CTA must remain a WhatsApp handoff and must keep the existing pre-filled message and `pilot_interest_click` event semantics.
- The CTA must remain usable without JavaScript or Analytics.
- The diagram must use semantic HTML, existing brand tokens, and no generated image, stock image, glow treatment, new color, promise, testimonial, metric, or case-study claim.
- Remove Sproutbound from `/` and `/laboratorio/`, including its public evidence image.
- Preserve `SaaS · Apps · Jogos · Experimentos` as the broad brand scope descriptor.
- Preserve the reusable `GameCard` component, `games-in-development` data, game CSS, and historical design/plan records for possible future reactivation.
- Do not modify the Sproutbound repository outside `D:\LEONARDO\Leo Ferraz`.
- Do not launch an infoproduct, create a checkout, add a form, or change the existing funnel destination.
- Preserve unrelated working-tree changes.

---

### Task 1: Clarify the homepage conversion section

**Files:**
- Modify: `src/pages/index.astro` in the existing `.homepage__conversion` section.

**Interfaces:**
- Consumes: the existing WhatsApp destination, pre-filled message, `data-pilot-interest` hook, and GA4 listener.
- Produces: a readable conversion block with an explicit WhatsApp CTA and a semantic diagram that explains the next step.

- [ ] **Step 1: Replace the conversion section's inner markup**

Keep the section after `.homepage__hero` and before `.homepage__proof`. Replace its current contents with:

```astro
      <div class="homepage__conversion-layout">
        <div class="homepage__conversion-copy">
          <p class="eyebrow">PRÓXIMO PASSO</p>
          <h2 id="conversion-title">Você já vende, mas trava na produção de conteúdo?</h2>
          <p>
            Estou conversando com fundadores, empresários, criadores e especialistas que já possuem uma oferta e enfrentam um gargalo recorrente de presença ou produção.
          </p>
          <p>
            Descreva o seu gargalo para avaliarmos se uma conversa ou um piloto faz sentido.
          </p>
          <a
            class="homepage__conversion-cta"
            data-pilot-interest
            href="https://wa.me/5551992568861?text=Ol%C3%A1%2C%20Leo.%20Eu%20j%C3%A1%20vendo%20algo%20e%20quero%20descrever%20meu%20gargalo%20de%20presen%C3%A7a%20ou%20produ%C3%A7%C3%A3o%20de%20conte%C3%BAdo."
            target="_blank"
            rel="noopener noreferrer"
          >
            Descrever meu gargalo no WhatsApp →
          </a>
        </div>
        <ol class="homepage__conversion-diagram" aria-label="Próximos passos da conversa">
          <li>
            <span class="homepage__conversion-step">01</span>
            <span class="homepage__conversion-step-label">Oferta existente</span>
          </li>
          <li>
            <span class="homepage__conversion-step">02</span>
            <span class="homepage__conversion-step-label">Gargalo de presença ou produção</span>
          </li>
          <li>
            <span class="homepage__conversion-step">03</span>
            <span class="homepage__conversion-step-label">Conversa inicial</span>
          </li>
        </ol>
      </div>
```

- [ ] **Step 2: Preserve the existing analytics hook**

Confirm that the CTA retains `data-pilot-interest`, the same `wa.me` destination, the same encoded message, and the existing event listener. Only the visible CTA label changes.

- [ ] **Step 3: Run the build**

Run: `npm run build`

Expected: Astro completes successfully and the six existing routes remain available.

### Task 2: Style the CTA and explanatory diagram

**Files:**
- Modify: `src/styles/global.css` in the homepage conversion styles near `.homepage__conversion`.

**Interfaces:**
- Consumes: `.homepage__conversion-layout`, `.homepage__conversion-copy`, `.homepage__conversion-diagram`, and step classes from Task 1.
- Produces: a two-column desktop presentation, natural mobile stack, visible keyboard focus, and one primary CTA.

- [ ] **Step 1: Replace the current conversion layout rules**

Replace the existing `.homepage__conversion-body` rules with these token-based rules, and keep the existing CTA hover/focus behavior:

```css
.homepage__conversion-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(260px, 0.9fr);
  gap: var(--lf-spacing-block-major);
  align-items: start;
}

.homepage__conversion-copy {
  display: grid;
  gap: var(--lf-spacing-inline-standard);
  max-width: 62ch;
}

.homepage__conversion-copy h2,
.homepage__conversion-copy p {
  margin: 0;
}

.homepage__conversion-copy h2 {
  max-width: 18ch;
}

.homepage__conversion-copy p:not(.eyebrow) {
  color: var(--lf-color-text-secondary);
  font-size: var(--lf-type-body-size-large);
  line-height: 1.55;
}

.homepage__conversion-cta {
  display: inline-flex;
  align-items: center;
  justify-self: start;
  margin-top: var(--lf-spacing-inline-compact);
  padding: var(--lf-spacing-inline-standard) var(--lf-spacing-block-content);
  background: var(--lf-color-accent-subtle);
  border: var(--lf-border-width-standard) solid var(--lf-color-accent-primary);
  border-radius: var(--lf-radius-control);
  color: var(--lf-color-text-primary);
  text-decoration: none;
}

.homepage__conversion-cta:hover,
.homepage__conversion-cta:focus-visible {
  background: var(--lf-color-accent-primary);
  color: var(--lf-color-background);
}

.homepage__conversion-diagram {
  display: grid;
  gap: 0;
  margin: 0;
  padding: var(--lf-spacing-block-content);
  background: var(--lf-color-surface-1);
  border: var(--lf-border-width-standard) solid var(--lf-color-border-default);
  list-style: none;
}

.homepage__conversion-diagram li {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--lf-spacing-inline-standard);
  align-items: center;
  min-height: 72px;
  padding-block: var(--lf-spacing-inline-standard);
  border-bottom: var(--lf-border-width-standard) solid var(--lf-color-border-default);
}

.homepage__conversion-diagram li:last-child {
  border-bottom: 0;
}

.homepage__conversion-step {
  color: var(--lf-color-accent-primary);
  font-family: var(--lf-font-family-mono);
  font-size: var(--lf-type-label-size-large);
  letter-spacing: var(--lf-type-label-tracking);
}

.homepage__conversion-step-label {
  color: var(--lf-color-text-primary);
  font-size: var(--lf-type-body-size-large);
}

@media (max-width: 767px) {
  .homepage__conversion-layout {
    grid-template-columns: 1fr;
    gap: var(--lf-spacing-block-content);
  }

  .homepage__conversion-copy h2 {
    max-width: none;
  }

  .homepage__conversion-cta {
    max-width: 100%;
  }
}
```

- [ ] **Step 2: Check the mobile constraint**

Confirm that the CTA wraps within a 375px viewport, the diagram remains readable, and no horizontal overflow is introduced. Do not add a separate visual language for mobile.

- [ ] **Step 3: Run the build**

Run: `npm run build`

Expected: PASS with the same route set and no CSS compilation errors.

### Task 3: Remove Sproutbound from public site surfaces

**Files:**
- Modify: `src/pages/index.astro` to remove the `GameCard` and `gamesInDevelopment` imports and the `JOGOS EM DESENVOLVIMENTO` section.
- Modify: `src/pages/laboratorio/index.astro` to remove the same imports and public game section.
- Delete: `public/evidence/sproutbound-1280x720.jpg`.

**Interfaces:**
- Consumes: the current public homepage and laboratory templates.
- Produces: no rendered Sproutbound content or public Sproutbound evidence asset, while leaving reusable game source and historical records available for later reactivation.

- [ ] **Step 1: Remove the homepage game rendering**

Delete only these imports from `src/pages/index.astro`:

```astro
import GameCard from '../components/site/GameCard.astro';
import { gamesInDevelopment } from '../data/games-in-development';
```

Delete the complete section whose eyebrow is `JOGOS EM DESENVOLVIMENTO`, from `<section class="homepage__products" aria-labelledby="games-title">` through its closing `</section>`. Preserve the conversion, proof, follow, commitment, and footer sections.

- [ ] **Step 2: Remove the laboratory game rendering**

Delete only these imports from `src/pages/laboratorio/index.astro`:

```astro
import GameCard from '../../components/site/GameCard.astro';
import { gamesInDevelopment } from '../../data/games-in-development';
```

Delete the complete first product section whose eyebrow is `JOGOS EM DESENVOLVIMENTO`. Preserve the client-work section and the laboratory commitment note.

- [ ] **Step 3: Remove the public evidence asset**

Delete `public/evidence/sproutbound-1280x720.jpg`. Do not delete `src/data/games-in-development.ts`, `src/components/site/GameCard.astro`, `.game-card` styles, or historical specifications and plans.

- [ ] **Step 4: Build and inspect generated routes**

Run: `npm run build`

Then run:

```powershell
rg -n -i "sproutbound|jogos em desenvolvimento|gamesInDevelopment|game-card" dist/index.html dist/laboratorio/index.html
Test-Path 'dist/evidence/sproutbound-1280x720.jpg'
```

Expected: the `rg` command returns no matches, and `Test-Path` returns `False`. The broad descriptor `Jogos` may remain in `dist/index.html` as part of the approved scope line; it is not the removed game presentation.

### Task 4: Record the delivery and validate the repository

**Files:**
- Create: `cofre-leoferraz-dev/02_EXECUCAO/2026-09/2026-09-02 — Revisão da CTA da Homepage e Remoção do Sproutbound.md`.
- Modify: `docs/superpowers/specs/2026-09-02-homepage-cta-and-sproutbound-removal-design.md` to set the approved design state.

**Interfaces:**
- Consumes: completed homepage CTA, diagram, public-surface removal, and validation output from Tasks 1–3.
- Produces: an Obsidian-compatible execution record separating decision, execution, evidence, and pending measurement.

- [ ] **Step 1: Create the execution record after validation**

Use this content:

```markdown
---
title: "2026-09-02 — Revisão da CTA da Homepage e Remoção do Sproutbound"
document_type: execution_record
status: implemented
authority: Leo Ferraz
date: 2026-09-02
project: Leo Ferraz
validation_status: build_and_tests_passed
related:
  - "[[../../../01_DECISOES/DECISAO-029 - Monetizacao apos Trafego Organico]]"
  - "[[../../../../docs/superpowers/specs/2026-09-02-homepage-cta-and-sproutbound-removal-design.md]]"
---

# Revisão da CTA da Homepage e Remoção do Sproutbound

## Decisão

A homepage deve tornar o próximo passo explícito com uma CTA que nomeia o WhatsApp e um diagrama editorial que explica a sequência oferta existente → gargalo → conversa inicial. O Sproutbound deixa de ser apresentado nas superfícies públicas enquanto permanece preservado no repositório para eventual retomada.

## Execução

- CTA atualizada para `Descrever meu gargalo no WhatsApp →`.
- Diagrama semântico de três etapas adicionado ao bloco de conversão.
- Sproutbound removido da homepage e de `/laboratorio/`.
- Imagem pública exclusiva do Sproutbound removida.
- Dados, componente, estilos e registros históricos preservados sem referência pública.

## Evidência

- `npm run build` concluído com as seis rotas estáticas.
- Testes disponíveis concluídos sem falhas.
- `dist/index.html` e `dist/laboratorio/index.html` não contêm a apresentação do Sproutbound.
- O asset `dist/evidence/sproutbound-1280x720.jpg` não é gerado.
- `obsidian unresolved total` e `obsidian orphans total` permanecem em `0`.

## Pendências

- Observar o clique da CTA, conversas qualificadas, pilotos e vendas com tráfego real.
- Reativar o Sproutbound somente quando houver estágio e evidência adequados para apresentação pública.
```

- [ ] **Step 2: Mark the design specification approved**

Change only the frontmatter state in `docs/superpowers/specs/2026-09-02-homepage-cta-and-sproutbound-removal-design.md`:

```yaml
status: approved
```

- [ ] **Step 3: Run final repository checks**

Run each command separately:

```powershell
npm run build
npm run founder-avatar:test
npm run video-cover-pack:test
git diff --check
obsidian unresolved total
obsidian orphans total
```

Expected: build passes with six routes; the available tests report 2/2 and 17/17 passing; `git diff --check` reports no whitespace errors; both Obsidian totals are `0`. `npm test` is not defined in this repository and must not be treated as an available suite.

- [ ] **Step 4: Audit and publish only intended files**

Run `git diff --name-only` and stage only:

```text
src/pages/index.astro
src/pages/laboratorio/index.astro
src/styles/global.css
public/evidence/sproutbound-1280x720.jpg
docs/superpowers/specs/2026-09-02-homepage-cta-and-sproutbound-removal-design.md
cofre-leoferraz-dev/02_EXECUCAO/2026-09/2026-09-02 — Revisão da CTA da Homepage e Remoção do Sproutbound.md
```

Preserve unrelated changes in `brand-assets/`, `.claude/`, `referencias/`, `live/`, and other paths. Commit with:

```bash
git add -- src/pages/index.astro src/pages/laboratorio/index.astro src/styles/global.css public/evidence/sproutbound-1280x720.jpg docs/superpowers/specs/2026-09-02-homepage-cta-and-sproutbound-removal-design.md "cofre-leoferraz-dev/02_EXECUCAO/2026-09/2026-09-02 — Revisão da CTA da Homepage e Remoção do Sproutbound.md"
git commit -m "refactor: clarify homepage CTA and hide sproutbound"
git push origin main
git rev-parse HEAD
git rev-parse origin/main
```

Expected: commit and push succeed; `HEAD` equals `origin/main`; no public deployment or commercial result is claimed from this repository operation alone.
