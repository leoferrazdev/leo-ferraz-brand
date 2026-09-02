# Homepage CTA and Sproutbound Removal — Design Specification

> Status: approved

## Objective

Improve the homepage conversion section so the visitor understands the next action and remove Sproutbound from all public site surfaces while preserving the experiment's historical source files for possible future reactivation.

## Approved direction

### Conversion section

Keep the section immediately after the homepage hero and before the work evidence. Preserve the current strategic role: qualify visitors who already have an offer and experience a recurring presence or content-production bottleneck.

Use the CTA label:

```text
Descrever meu gargalo no WhatsApp →
```

The destination, pre-filled message, GA4 event, and no-personal-data constraint remain unchanged from the existing funnel implementation.

Add a compact editorial diagram beside the copy on wider screens and above or below it on small screens:

```text
OFERTA EXISTENTE
        ↓
GARGALO DE PRESENÇA OU PRODUÇÃO
        ↓
CONVERSA INICIAL
```

The diagram must be built with semantic HTML and existing brand tokens. It is an explanatory visual, not a case study, testimonial, metric, promise, or generated image. It must not introduce a new color system, glow treatment, stock image, or decorative claim.

### Sproutbound removal

Remove the Sproutbound presentation from:

- the homepage;
- `/laboratorio/`;
- the public evidence asset used exclusively by that presentation.

The reusable `GameCard` component, `games-in-development` data file, and historical design/plan records may remain in the repository unreferenced, so the experiment can be reactivated without reconstructing its prior implementation. No public route or rendered HTML may continue to expose Sproutbound.

Retain the broad homepage descriptor `SaaS · Apps · Jogos · Experimentos`, because it describes the brand's declared scope and is not a claim that Sproutbound is ready or validated.

## Constraints

- Do not launch an infoproduct, create a checkout, or add a form.
- Do not change the WhatsApp destination or analytics event semantics.
- Do not modify the canonical brand system or invent new brand tokens.
- Do not delete historical Obsidian decisions, specifications, or implementation plans.
- Do not modify the Sproutbound repository outside this site repository.
- Preserve all unrelated working-tree changes.

## Acceptance criteria

- The homepage CTA explicitly names WhatsApp and remains usable without JavaScript.
- The explanatory diagram is readable, accessible, responsive, and subordinate to the CTA.
- `/` and `/laboratorio/` contain no rendered Sproutbound section, name, or image reference.
- The Sproutbound public evidence image is no longer shipped by the site.
- Existing proof, follow, commitment, footer, and conversion analytics remain intact.
- Build and available tests pass.
- The change and validation state are recorded in `cofre-leoferraz-dev/`.
