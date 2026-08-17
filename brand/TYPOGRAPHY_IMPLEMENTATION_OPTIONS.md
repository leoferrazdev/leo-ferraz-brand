---
document: TYPOGRAPHY_IMPLEMENTATION_OPTIONS
brand: Leo Ferraz
version: 0.1.0
status: approved
authority: Leo Ferraz
exploration_status: completed
decision_status: selected
selected_option: Product / Editorial
selection_authority: Leo Ferraz
depends_on:
  - TYPOGRAPHY.md
  - COLOR.md
  - VISUAL_FOUNDATIONS.md
---

# Typography Implementation Options

Este documento materializa a comparação visual humana dos três sistemas de escala e composição tipográfica. A decisão de implementação selecionada pelo fundador é `Product / Editorial`.

O nome desta decisão descreve a implementação tipográfica da fundação `Plex Product System` já registrada em `TYPOGRAPHY.md`. As famílias permanecem IBM Plex Sans e IBM Plex Mono; esta etapa define valores candidatos de implementação, não altera a decisão tipográfica aprovada anteriormente.

## Decisão humana

```text
Selected Typography Implementation System:
Product / Editorial

Precision / Dense:
not_selected

Product / Editorial:
selected

Display / Spatial:
not_selected
```

As alternativas não selecionadas permanecem preservadas como histórico de exploração. Nenhuma é `rejected`, `invalid` ou `failed`.

## Condições comuns

```text
Families:
IBM Plex Sans
IBM Plex Mono

Color System:
Precision / Product

Visual Foundations:
Modular / Product

Sans role:
communication / editorial / brand

Mono role:
evidence / state / metadata / code
```

IBM Plex Sans atende comunicação, editorial, brand, display, headings e body. IBM Plex Mono é restrita a evidence, state, metadata, labels técnicos, commits, métricas e code.

## Option A — Precision / Dense

```text
selection_status: not_selected
principal_strength: precision and high-density information handling
principal_risk: developer-tool / technical-documentation character
```

### Candidate values

| Role | Size / weight |
|---|---|
| display | 48px / 600 |
| h1 | 40px / 600 |
| h2 | 26px / 600 |
| h3 | 19px / 600 |
| body-large | 18px / 400 |
| body | 16px / 400 |
| body-small | 13px / 400 |
| metadata | 11px / 500 |
| label | 10px / 500 |
| code/mono | 11px / 500 |

```text
Line Heights:
display: .98
headings: 1.12
body: 1.42
small: 1.32
mono: 1.28

Tracking:
display: -.045em
labels: +.10em
metadata: +.06em
mono: +.02em
```

Density candidates: low, medium, high. The system is compact, precise, low-radius and suitable for dense evidence handling.

## Option B — Product / Editorial

```text
selection_status: selected
principal_strength: balance between brand presence, editorial readability, product artifacts and technical evidence
principal_risk: can become generic product/SaaS typography if future hierarchy loses editorial restraint
```

### Selected candidate values

| Role | Size / weight |
|---|---|
| display | 58px / 500 |
| h1 | 46px / 500 |
| h2 | 30px / 500 |
| h3 | 21px / 500 |
| body-large | 20px / 400 |
| body | 17px / 400 |
| body-small | 14px / 400 |
| metadata | 12px / 500 |
| label | 11px / 500 |
| code/mono | 12px / 500 |

```text
Line Heights:
display: 1.02
headings: 1.18
body: 1.55
small: 1.40
mono: 1.34

Tracking:
display: -0.035em
labels: +0.075em
metadata: +0.040em
mono: +0.010em
```

Density candidates: low, medium, high. This is the selected balance for brand presence, editorial readability, product artifacts and technical evidence.

## Option C — Display / Spatial

```text
selection_status: not_selected
principal_strength: strong display and editorial presence
principal_risk: can become overly spacious or compete with product artifacts
```

### Candidate values

| Role | Size / weight |
|---|---|
| display | 70px / 500 |
| h1 | 54px / 500 |
| h2 | 34px / 500 |
| h3 | 22px / 500 |
| body-large | 20px / 400 |
| body | 18px / 400 |
| body-small | 14px / 400 |
| metadata | 12px / 500 |
| label | 11px / 500 |
| code/mono | 13px / 500 |

```text
Line Heights:
display: .95
headings: 1.14
body: 1.64
small: 1.45
mono: 1.28

Tracking:
display: -.055em
labels: +.11em
metadata: +.05em
mono: +.015em
```

Density candidates: low, medium, high. The system preserves controlled geometry and must not allow display presence to compete with artifacts.

## Decision boundary

```text
Typography implementation status:
approved

responsive_typography:
not_defined

typography_tokens:
not_created
```

The selected values are the base scale only. Responsive mappings, breakpoint behavior, role mappings and definitive token names remain open.

## Review evidence

The temporary visual comparison was completed before this materialization. The permanent development-only Brand Review Lab reproduces the three options under equivalent conditions. The comparison remains a neutral historical specimen; the founder decision is recorded here and in `TYPOGRAPHY_IMPLEMENTATION.md`.
