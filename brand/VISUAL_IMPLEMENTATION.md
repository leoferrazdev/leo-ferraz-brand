---
document: VISUAL_IMPLEMENTATION
brand: Leo Ferraz
version: 0.1.0
status: approved
authority: Leo Ferraz
decision_basis: deterministic_v1_consolidation
depends_on:
  - VISUAL_DIRECTION.md
  - TYPOGRAPHY.md
  - TYPOGRAPHY_IMPLEMENTATION.md
  - COLOR.md
  - VISUAL_FOUNDATIONS.md
  - SIGNATURE.md
---

# Visual Implementation

Este documento é uma camada canônica subordinada para as regras de implementação visual necessárias ao Brand System v1. Ele não substitui as fontes superiores; os tokens e componentes executáveis são mantidos nos artefatos subordinados correspondentes.

## Princípio da consolidação

> Brand System v1 defines only the rules required for deterministic implementation. Optional future capabilities are deferred rather than invented.

```text
deterministic_v1:
required rules → defined
optional future systems → deferred
```

## Breakpoints canônicos

```text
canonical_breakpoints: defined

Small:
< 768px

Medium:
768px – 1199px

Large:
>= 1200px
```

Não existem breakpoints canônicos adicionais nesta versão.

## Responsive Grid

### Large

Para `>= 1200px`:

```text
columns:
10

gutter:
16px

outer margin:
32px
```

### Medium

Para `768px – 1199px`:

```text
columns:
6

gutter:
16px

outer margin:
24px
```

### Small

Para `< 768px`:

```text
columns:
4

gutter:
16px

outer margin:
16px
```

```text
grid_structure:
persistent

grid_visibility:
contextual
```

A redução de colunas não altera a persistência estrutural do grid. O grid pode permanecer invisível quando o conteúdo não exigir sua exposição.

## Container

```text
primary_composition_max_width:
1440px

width:
100%

max-width:
1440px

horizontal alignment:
center
```

O container utiliza as margens externas do breakpoint: 32px em Large, 24px em Medium e 16px em Small. Containers editoriais especializados permanecem indefinidos.

## Responsive Typography

As famílias permanecem:

```text
Brand / Display:
IBM Plex Sans

UI / Body:
IBM Plex Sans

Technical / Mono:
IBM Plex Mono
```

### Large — `>= 1200px`

```text
display:
58px / 500

h1:
46px / 500

h2:
30px / 500

h3:
21px / 500

body-large:
20px / 400

body:
17px / 400

body-small:
14px / 400

metadata:
12px / 500

label:
11px / 500

code/mono:
12px / 500
```

### Medium — `768px – 1199px`

```text
display:
50px / 500

h1:
40px / 500

h2:
28px / 500

h3:
20px / 500

body-large:
19px / 400

body:
17px / 400

body-small:
14px / 400

metadata:
12px / 500

label:
11px / 500

code/mono:
12px / 500
```

### Small — `< 768px`

```text
display:
40px / 500

h1:
34px / 500

h2:
26px / 500

h3:
20px / 500

body-large:
18px / 400

body:
16px / 400

body-small:
14px / 400

metadata:
12px / 500

label:
11px / 500

code/mono:
12px / 500
```

### Ratios preservados

```text
display:
1.02

headings:
1.18

body:
1.55

small:
1.40

mono:
1.34
```

```text
display:
-0.035em

labels:
+0.075em

metadata:
+0.040em

mono:
+0.010em
```

```text
fluid_typography:
not_required
```

Os três estados responsivos são a regra determinística de v1. `clamp()` não é uma regra canônica nesta versão.

## Semantic Colors

```text
semantic_colors:
defined

Success:
#79D6A2

Warning:
#E7B866

Error:
#F07F8C

Info:
#7DD3FC
```

Semantic colors existem exclusivamente para comunicar estado: success, warning, error, info, status feedback, validation, system state e evidence state quando semanticamente apropriado.

Não são permitidas como cor decorativa de seção, substituição do accent da marca, decoração de headline, atmosfera de background ou coloração arbitrária de cards.

```text
Primary Technology Accent:
#4DA3FF

semantic_subtle_backgrounds:
derived_later_from_tokens
```

O Primary Technology Accent continua sendo o accent institucional. Semantic colors não competem com ele. Backgrounds semânticos sólidos adicionais não são definidos nesta rodada.

### Contraste semântico

Ratios calculados por relative luminance, usando cada cor semântica como foreground:

| Cor | Background `#0D1117` | Surface 1 `#151B24` | Uso seguro v1 |
|---|---:|---:|---|
| Success `#79D6A2` | 10.77:1 | 9.85:1 | text/icon, large text, non-text state |
| Warning `#E7B866` | 10.31:1 | 9.43:1 | text/icon, large text, non-text state |
| Error `#F07F8C` | 7.32:1 | 6.69:1 | text/icon, large text, non-text state |
| Info `#7DD3FC` | 11.35:1 | 10.37:1 | text/icon, large text, non-text state |

Os quatro valores superam 4.5:1 nos dois fundos auditados. A cor não deve ser o único portador de estado; combinar cor com label, forma ou ícone quando necessário.

## Spacing Role Mappings

A escala v1 permanece:

```text
4
8
12
16
24
32
48
64
```

```text
micro gap:
4px

compact inline gap:
8px

standard inline gap:
12px
```

Uso típico: relação ícone/texto, grupos de metadata, labels compactos e clusters de evidência.

```text
compact component padding:
12px

standard component padding:
16px

comfortable component padding:
24px
```

```text
content block gap:
24px

major block gap:
32px

section gap:
48px

major section gap:
64px
```

```text
4–16
→ local/component relationships

24–32
→ blocks

48–64
→ composition/sections
```

Esses papéis orientam agentes. O Component System fará mappings específicos quando for criado.

## Radius Role Mappings

```text
Radius Scale:
0
4px
8px

0:
structural / editorial / edge-aligned framing

4px:
controls / compact functional elements

8px:
cards / artifacts / substantial contained surfaces
```

Não utilizar radius maior que 8px no Brand System v1, salvo contexto externo de produto independente. Evitar pills everywhere, consumer-app softness e fully rounded cards.

```text
pill_shape:
functional_only
```

Pills são permitidos somente para status, tag, compact selector ou platform-imposed control. Não são linguagem estrutural principal.

## Border Role Mappings

```text
Standard Border:
1px / #2A3543

Strong Border:
2px / #405064
```

```text
1px:
default structural separation

2px:
selected/focused/strong structural emphasis
```

2px não deve ser usado como decoração arbitrária.

## Shadow Role Mapping

```text
shadow_value:
0 10px 24px -18px rgba(0,0,0,.65)

shadow_default:
none

approved_shadow:
exceptional elevation only
```

É permitido para floating layer, overlay-like surface ou temporarily elevated element. Não utilizar por padrão em cards, artifacts, buttons, sections ou evidence blocks.

## Glow — decisão v1

```text
canonical_glow_values:
none

glow_default:
off

glow_system:
deferred
```

> No current v1 component requires glow to communicate state.

```text
Signal Over Glow
```

Não criar glow funcional agora. Uma futura extensão poderá considerar LIVE, PROCESSING ou CONNECTED se surgir necessidade funcional real.

## Light Mode — decisão v1

```text
light_mode:
deferred_to_post_v1
```

Isso não significa light mode prohibited nem brand permanently dark-only. Significa:

```text
Brand System v1:
dark-first production implementation

future:
light variant may be defined
```

A definição superior permanece `dark-first`, `not dark-only`.

## Motion e efeitos

```text
motion_system:
deferred

decorative_motion:
not_required

global_opacity_scale:
not_created
```

Componentes futuros podem utilizar estados e transições funcionais mínimas sem constituir ainda um Motion System canônico. Não há efeitos decorativos necessários em v1.

## Signature Usage

```text
primary_logo_minimum_width:
120px

Constructed LF minimum digital box:
16px × 16px

full lockup clear space:
0.5em

Constructed LF clear space:
0.25em minimum
```

`120px` aplica-se ao full lockup horizontal, não à ocorrência do nome em texto corrido. Abaixo desse limite, em contexto digital restrito, usar o símbolo primário `Constructed LF`.

Para um favicon de `16px`, usar somente o `Constructed LF`, sem descriptor ou outros elementos. A legibilidade deve continuar sendo verificada pelo contexto.

O clear space do wordmark é medido a partir do tamanho tipográfico atual:

```text
top:
>= 0.5em

right:
>= 0.5em

bottom:
>= 0.5em

left:
>= 0.5em
```

Texto, border, image, artifact, icon e outro identity element não devem entrar nessa área. Background e surface não são intrusões.

```text
descriptor_spacing:
must use approved spacing scale
```

O mapping exato do descriptor será definido pelo Component System.

```text
monochrome_survival:
required

accent_dependency:
none
```

## Escopo preservado

Esta camada não cria:

```text
Design Tokens:
implemented in DESIGN_TOKENS.md

Component System:
implemented in src/components/brand/

Templates:
not_created

DESIGN_SYSTEM.md:
approved

Final Website Composition:
not_created
```

Não foram alterados `brand/*.md` superiores, não foram criados SVGs, e nenhuma nova decisão estratégica, verbal ou visual foi introduzida além dos mappings explicitamente consolidados nesta camada.
