---
document: VISUAL_FOUNDATIONS
brand: Leo Ferraz
version: 0.1.0
status: approved
authority: Leo Ferraz
decision_basis: founder_visual_review
selected_system: Modular / Product
visual_foundations_status: approved
depends_on:
  - VISUAL_DIRECTION.md
  - TYPOGRAPHY.md
  - COLOR.md
  - VISUAL_FOUNDATIONS_OPTIONS.md
---

# Visual Foundations

Este documento registra o sistema estrutural selecionado após comparação visual humana. O documento permanece em review até auditoria própria e não cria tokens canônicos.

## Selected Visual Foundations System

~~~text
Modular / Product
~~~

Caráter:

~~~text
balanced
modular
product-oriented
restrained
technical
versatile
~~~

O sistema foi escolhido para permitir que a Master Brand, conteúdo editorial, evidence e produtos independentes coexistam sob uma estrutura reconhecível.

## Spacing

~~~text
Spacing Base:
4px

Spacing Scale:
4
8
12
16
24
32
48
64

Unit:
px

Value State:
selected structural values
~~~

A escala foi selecionada sem definir mappings universais de uso.

~~~text
spacing_role_mappings:
not_defined
~~~

Não é definido nesta etapa que card padding, section gap ou button gap devem possuir valores fixos universais.

## Construction Grid

~~~text
Construction Grid:
10 columns

Gutter:
16px

Outer Margin:
32px
~~~

~~~text
grid_structure: persistent
grid_visibility: contextual
responsive_grid:
not_defined
~~~

Todas as composições devem possuir estrutura. O grid não precisa estar visualmente exposto. Linhas visíveis pertencem ao contexto editorial/visual e não são obrigação permanente.

Quando exposto, o Construction Grid deve permanecer:

~~~text
low contrast
flat
structural
secondary
~~~

Nunca deve se tornar perspective, Tron, cyberpunk, glowing floor ou decorative technology texture.

Não são definidos breakpoints, colunas mobile/tablet, gutters responsivos, margens responsivas ou container max-width.

## Radius

~~~text
Radius Scale:
0
4px
8px
~~~

~~~text
radius_role_mappings:
not_defined
~~~

> Corners should feel constructed and modern without becoming either brutally rigid or excessively soft.

O sistema evita excessive rounding, pillification e consumer-app softness. Não é definido que button, card ou artifact devem usar obrigatoriamente um nível específico.

## Borders

~~~text
Standard Border Width:
1px

Strong Border Width:
2px

Border:
#2A3543

Border Strong:
#405064
~~~

As cores de border vêm exclusivamente de COLOR.md. Nenhuma nova border color é criada.

## Border-led hierarchy

~~~text
surface
+
border
+
spacing
~~~

São os mecanismos primários de separação e hierarquia. Shadow não deve ser o primeiro recurso usado para separar elementos.

## Shadow

~~~text
0 10px 24px -18px rgba(0,0,0,.65)
~~~

~~~text
shadow_usage: controlled
shadow_default: not_required
~~~

Essa shadow representa elevation real quando necessária. Não é aplicada automaticamente a cards, artifacts, buttons ou panels.

A hierarquia estrutural é:

~~~text
surface + border + spacing
↓
primary hierarchy

shadow
↓
secondary / exceptional elevation
~~~

## Glow

~~~text
glow_default: off

canonical_glow_values:
not_defined
~~~

> Glow is not a structural requirement of the Leo Ferraz identity.

Glow poderá ser definido futuramente somente diante de necessidade funcional concreta, como LIVE, PROCESSING, CONNECTED ou FOCUS. Esses mappings não são aprovados nesta etapa e nenhum blur, opacity, spread ou glow color é definido.

## Negative Space and Density

O sistema mantém espaço negativo suficiente para priorizar:

~~~text
artifact
headline
evidence
~~~

O objetivo é:

~~~text
clarity
not emptiness
~~~

Modular / Product deve suportar low density, medium density e high density sem exigir sistemas estruturais separados ou escalas distintas de spacing por densidade.

## Artifact framing

Artifacts reais devem ser enquadrados por uma combinação controlada de:

~~~text
grid
spacing
border
surface
radius
~~~

O framing não depende de device mockup, large shadow, glow ou decorative frame.

## Artifact First

O artifact real permanece protagonista. A moldura nunca deve dominar visualmente o produto real.

## Product independence

> The Master Brand frames products. It does not visually absorb them.

SaaS, apps, games e experiments podem possuir identidades próprias. O sistema estrutural Leo Ferraz hospeda essas identidades sem recolori-las conceitualmente.

## Typography

Os fundamentos foram avaliados com:

~~~text
IBM Plex Sans
IBM Plex Mono
~~~

TYPOGRAPHY.md permanece inalterado. Não são definidos type scale, weights by role, line-height ou tracking.

## Color

A comparação utilizou exclusivamente:

~~~text
Precision / Product
~~~

COLOR.md permanece inalterado. Não são introduzidas novas cores.

## Semantic Color System

~~~text
Semantic Color System:
not_defined
~~~

## Light Mode

~~~text
Light Mode:
not_defined
~~~

## Open Visual Foundation Decisions

Permanecem indefinidos:

- spacing role mappings;
- radius role mappings;
- responsive grid;
- breakpoints;
- container widths;
- responsive gutters;
- responsive outer margins;
- shadow component mappings;
- canonical glow values;
- glow mappings;
- opacity system;
- overlay behavior;
- scrims;
- motion;
- animation timing;
- component-specific geometry.

## Valores ainda não são tokens

> Selected structural values are not yet Design Tokens.

Não foram criados spacing tokens, radius tokens, shadow tokens, grid tokens ou effect tokens. Também não foram criados componentes definitivos, templates ou Design System.

## Escopo preservado

Esta materialização não define escala tipográfica, semantic colors finais, light mode, wordmark, monogram, logo, tokens, componentes ou templates.

~~~text
Typography Scale:
not_defined

Tokens:
not_created

Logo:
not_created
~~~

## Status

~~~text
visual_foundations_status: approved
status: approved
~~~
