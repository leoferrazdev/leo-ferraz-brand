---
document: DESIGN_TOKENS
brand: Leo Ferraz
version: 0.1.0
status: approved
authority: Leo Ferraz
source: tokens/tokens.json
depends_on:
  - COLOR.md
  - TYPOGRAPHY_IMPLEMENTATION.md
  - VISUAL_FOUNDATIONS.md
  - VISUAL_IMPLEMENTATION.md
  - SIGNATURE.md
---

# Design Tokens

## Princípio

> Documentation defines the decisions. Tokens encode the decisions. Components execute the decisions.

```text
brand/*.md
→ semantic authority

tokens/
→ machine-readable implementation authority

generated CSS
→ derived artifact

components/
→ executable behavior

/brand/
→ public demonstration
```

Component implementation não pode inventar uma regra canônica nova.

## Arquitetura

`tokens/tokens.json` é a única fonte machine-readable desta rodada. A estrutura mantém primitives e aliases sem dependência de framework:

```text
primitive values
↓
semantic aliases
↓
generated CSS custom properties
↓
Astro components
```

Os valores preservam os documentos canônicos. O arquivo gerado `src/generated/tokens.css` não é fonte canônica e não é versionado.

## Grupos

O source contém grupos para:

- color e semantic color;
- spacing;
- radius;
- border;
- shadow;
- typography;
- responsive breakpoints;
- grid;
- container;
- signature.

Semantic colors são `state communication only`. O accent institucional permanece distinto dos estados semânticos.

## Geração

```text
tokens/tokens.json
→ scripts/validate-tokens.mjs
→ scripts/build-tokens.mjs
→ src/generated/tokens.css
```

Comandos:

```text
npm run tokens:validate
npm run tokens:build
```

`npm run dev` e `npm run build` executam validação e geração antes do Astro. O gerador não inclui timestamp, random id, caminho de máquina ou username.

## Regras de alteração

1. Alterar primeiro a decisão canônica aplicável em `brand/*.md`.
2. Atualizar `tokens/tokens.json` preservando os valores aprovados.
3. Executar `npm run tokens:validate`.
4. Executar `npm run tokens:build`.
5. Auditar o diff e a determinidade antes de promover.

Não editar `src/generated/tokens.css` manualmente.

## Valores deferred

```text
light_mode: deferred_to_post_v1
glow: off
canonical_glow_values: none
glow_system: deferred
motion_system: deferred
global_opacity_scale: not_created
```

Não existem tokens de light mode, glow, motion, opacidade global, buttons ou componentes de conteúdo nesta rodada.
