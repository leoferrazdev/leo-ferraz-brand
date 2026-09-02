# Homepage Conversion Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one measurable homepage CTA that moves qualified Instagram visitors into a WhatsApp conversation without launching an infoproduct, checkout, form, or external lead system.

**Architecture:** Add a static conversion section directly after the existing homepage hero and before portfolio evidence. The CTA is a native WhatsApp link with a pre-filled message and works without JavaScript; a small progressive-enhancement script sends one GA4 event when available. Extend existing homepage CSS and tokens rather than creating a new route or component.

**Tech Stack:** Astro 7.2.2, TypeScript in Astro scripts, existing global CSS tokens, existing GA4 `gtag` installation, WhatsApp `wa.me` handoff.

## Global Constraints

- The site remains a portfolio and evidence surface; it must not present an infoproduct, checkout, price, guarantee, or promise of reach or results.
- The primary audience is founders, entrepreneurs, creators, and specialists who already have an offer and a recurring content or presence bottleneck.
- The homepage has one primary conversion action: describe the bottleneck through WhatsApp.
- The exact public copy is the copy approved in `docs/superpowers/specs/2026-09-02-leoferraz-funnel-conversion-layer-design.md`.
- The WhatsApp link uses the existing destination and the pre-filled message: `Olá, Leo. Eu já vendo algo e quero descrever meu gargalo de presença ou produção de conteúdo.`
- The click event is exactly `pilot_interest_click` with `channel: whatsapp`, `location: homepage_conversion_block`, and `campaign: leo_digital_s001`.
- Analytics must fail silently; the WhatsApp link must work without JavaScript or Analytics.
- Do not collect or send names, phone numbers, message text, or other personal data to GA4.
- Use existing brand tokens, typography, borders, surfaces, focus states, and responsive conventions.
- Do not create a form, database, checkout, external account, new route, new social-preview asset, or automatic Instagram profile update.
- Preserve all existing homepage sections and links.

---

### Task 1: Add the homepage conversion section

**Files:**
- Modify: `src/pages/index.astro` immediately after the closing `</section>` of `.homepage__hero` and before `.homepage__proof`.

**Interfaces:**
- Consumes: existing homepage layout, existing public `wa.me` contact destination, and the approved conversion copy.
- Produces: one anchor with `data-pilot-interest` for the analytics task and a stable accessible destination for visitors.

- [ ] **Step 1: Insert the approved section markup**

Add this section between the hero and proof sections:

```astro
    <section class="homepage__conversion" aria-labelledby="conversion-title">
      <div class="homepage__section-heading">
        <div>
          <p class="eyebrow">PRÓXIMO PASSO</p>
          <h2 id="conversion-title">Você já vende, mas trava na produção de conteúdo?</h2>
        </div>
      </div>
      <div class="homepage__conversion-body">
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
          Descrever meu gargalo →
        </a>
      </div>
    </section>
```

- [ ] **Step 2: Run the existing build to catch markup errors**

Run: `npm run build`

Expected: Astro build completes successfully and no route is removed.

---

### Task 2: Style the conversion section with existing brand tokens

**Files:**
- Modify: `src/styles/global.css` in the homepage section styles near `.homepage__proof`, `.homepage__products`, `.homepage__follow`, and `.homepage__commitment`.

**Interfaces:**
- Consumes: `.homepage__conversion`, `.homepage__conversion-body`, and `.homepage__conversion-cta` from Task 1.
- Produces: responsive layout, visible hierarchy, keyboard focus, and a single primary CTA consistent with the current homepage.

- [ ] **Step 1: Add the section layout and CTA styles**

Add the following rules using existing tokens:

```css
.homepage__conversion {
  display: grid;
  gap: var(--lf-spacing-block-content);
  padding-block: var(--lf-spacing-section-standard);
  border-top: var(--lf-border-width-standard) solid var(--lf-color-border-default);
}

.homepage__conversion-body {
  display: grid;
  gap: var(--lf-spacing-inline-standard);
  max-width: 62ch;
}

.homepage__conversion-body p {
  margin: 0;
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
```

- [ ] **Step 2: Add the responsive constraint**

Do not add a separate mobile redesign. Confirm that the existing single-column mobile layout lets the heading, paragraphs, and CTA stack naturally and that the CTA does not overflow at 375px.

- [ ] **Step 3: Run the existing build**

Run: `npm run build`

Expected: PASS with the same route set and no CSS compilation errors.

---

### Task 3: Instrument the CTA as progressive enhancement

**Files:**
- Modify: `src/pages/index.astro` after the closing `</main>` or immediately before `</BaseLayout>`.

**Interfaces:**
- Consumes: the `[data-pilot-interest]` anchor from Task 1 and the existing global `gtag` function from `src/layouts/BaseLayout.astro`.
- Produces: one GA4 event with no personal data; no dependency of navigation on the event.

- [ ] **Step 1: Add the click listener**

Add this client-side script:

```astro
<script>
  const pilotCta = document.querySelector<HTMLAnchorElement>('[data-pilot-interest]');

  pilotCta?.addEventListener('click', () => {
    const gtag = (window as typeof window & {
      gtag?: (...args: unknown[]) => void;
    }).gtag;

    gtag?.('event', 'pilot_interest_click', {
      channel: 'whatsapp',
      location: 'homepage_conversion_block',
      campaign: 'leo_digital_s001',
    });
  });
</script>
```

- [ ] **Step 2: Verify progressive enhancement in source**

Confirm the anchor has a complete `https://wa.me/` URL and the page still contains the link when JavaScript is disabled. Confirm the event payload contains only the three approved non-personal parameters.

- [ ] **Step 3: Run the build**

Run: `npm run build`

Expected: PASS; the event listener compiles without a TypeScript or Astro runtime error.

---

### Task 4: Validate the funnel slice and update operational records

**Files:**
- Verify: `src/pages/index.astro`
- Verify: `src/styles/global.css`
- Modify: `cofre-leoferraz-dev/02_EXECUCAO/2026-09/2026-09-02 — Especificação da Camada de Conversão da Homepage.md`
- Modify: `cofre-leoferraz-dev/01_DECISOES/DECISAO-029 - Monetizacao apos Trafego Organico.md`

**Interfaces:**
- Consumes: completed homepage section, CSS, and event from Tasks 1–3.
- Produces: validated implementation state with no claim that a conversation or sale occurred.

- [ ] **Step 1: Build and inspect generated output**

Run: `npm run build`

Then inspect the generated homepage:

```powershell
rg -n "PRÓXIMO PASSO|Descrever meu gargalo|pilot_interest_click|wa.me/5551992568861" dist/index.html
```

Expected: all four patterns are present in the generated homepage.

- [ ] **Step 2: Run repository checks**

Run:

```powershell
git diff --check
obsidian unresolved total
obsidian orphans total
```

Expected: no whitespace errors, `0` unresolved links, and `0` orphan notes.

- [ ] **Step 3: Record implementation state**

Update the cofre records only after the build passes:

```text
implementation_status: implemented
validation_status: build_passed
```

Record that the CTA and event were implemented, but conversations, qualified leads, pilots, and sales remain unobserved until real traffic produces evidence.

- [ ] **Step 4: Audit the staged file list**

Run: `git diff --name-only`

Stage only the homepage source, stylesheet, and explicitly updated cofre records. Do not stage existing unrelated changes in `brand-assets/`, `.claude/`, `referencias/`, `live/`, or other paths.

- [ ] **Step 5: Commit the implementation**

```bash
git add src/pages/index.astro src/styles/global.css "cofre-leoferraz-dev/01_DECISOES/DECISAO-029 - Monetizacao apos Trafego Organico.md" "cofre-leoferraz-dev/02_EXECUCAO/2026-09/2026-09-02 — Especificação da Camada de Conversão da Homepage.md"
git commit -m "feat: add homepage pilot interest conversion layer"
```

- [ ] **Step 6: Publish and verify branch parity**

```bash
git push origin main
git rev-parse HEAD
git rev-parse origin/main
```

Expected: push succeeds and both revisions are identical. Do not claim WhatsApp conversations or commercial conversion from the implementation alone.
