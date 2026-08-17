---
document: DESIGN_SYSTEM
brand: Leo Ferraz
version: 0.1.0
status: approved
authority: Leo Ferraz
implementation: Astro
depends_on:
  - DESIGN_TOKENS.md
  - SIGNATURE.md
  - VISUAL_IMPLEMENTATION.md
---

# Executable Design System

## Princípios

```text
Artifact First
Product Over Promise
Evidence Is Visual
Signal Over Glow
Restraint Is Premium
Deterministic Core
```

> Components exist to host products and evidence, not to become the visual protagonist.

## Filosofia do Core

O Core Component System v1 é:

```text
small
composable
semantic
artifact-friendly
content-friendly
deterministic
```

Não é uma biblioteca de UI genérica completa.

## Component Contracts

| Component | Purpose | Default / variants | Canonical dependencies | Prohibited drift |
|---|---|---|---|---|
| `BrandSignature` | Identificar a Master Brand | `wordmark`; `descriptor`, `institutional`, `utility` | signature, typography | LF como default, SVG, JS |
| `BrandContainer` | Composição central responsiva | 100%, max 1440px | container, grid | novo max-width ou margem |
| `BrandSection` | Wrapper semântico de seção | `standard`, `major` | section spacing | spacing arbitrário |
| `ArtifactFrame` | Enquadrar artefatos reais | `elevated=false` | surface, border, artifact radius, shadow | device mockup, radius > 8px, glow |
| `EvidenceBlock` | Agrupar fatos técnicos e metadata | props opcionais + slot | mono, spacing, border | dados fictícios presumidos |
| `Metric` | Exibir value, label e context opcional | sem formatação automática | typography, spacing | inventar contexto ou números |
| `StatusLabel` | Comunicar estado semântico | `neutral`, `success`, `warning`, `error`, `info` | semantic colors, control radius | estado somente por cor, pill decorativa |
| `BrandStack` | Composição vertical determinística | gaps aprovados | spacing aliases | número CSS arbitrário |

Todos os componentes usam tokens gerados e não necessitam JavaScript do cliente.

## Limites

Não foram criados `Button`, `CTA`, `Form`, `Input`, `Navigation`, `Modal`, `Tooltip`, `Dropdown`, `ProjectCard`, `BuildLogCard` ou `ArticleCard`. A arquitetura de conteúdo e do site final permanece fora desta rodada.

## Review e projeção

```text
Review Lab:
/brand/review/design-system/

Public projection:
/brand/

Canonical documentation:
brand/*.md

Machine-readable implementation:
tokens/tokens.json
```

O Review Lab é dev-only. Não há link público para rotas `/brand/review/*`.
