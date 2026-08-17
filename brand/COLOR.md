---
document: COLOR
brand: Leo Ferraz
version: 0.1.0
status: approved
authority: Leo Ferraz
decision_basis: founder_visual_review
selected_system: Precision / Product
color_status: approved
depends_on:
  - BRAND_FOUNDATION.md
  - BRAND_ARCHITECTURE.md
  - VOICE_AND_LANGUAGE.md
  - VISUAL_DIRECTION.md
  - TYPOGRAPHY.md
  - COLOR_OPTIONS.md
---

# Color

Este documento registra a decisão cromática humana em estado review.

O sistema selecionado para auditoria posterior é:

~~~text
Selected Color System:
Precision / Product
~~~

Os valores abaixo são selected candidate values. Ainda não são tokens, CSS variables ou especificação cromática canônica aprovada.

## Arquitetura Cromática

~~~text
Graphite Neutral Foundation
+
Precision Blue Primary Technology Accent
+
Contextual Violet Experimental Accent
+
Semantic Colors — still open
~~~

## Neutral Foundation

~~~text
Background              #0D1117
Surface 1               #151B24
Surface 2               #1D2632
Border                  #2A3543
Border Strong           #405064
Primary Text            #F3F6FA
Secondary Text          #B7C2CE
Muted Text              #7F8B99
Disabled / Low-emphasis #596574
~~~

## Primary Technology Accent

~~~text
Accent                  #4DA3FF
Accent Strong           #86C5FF
Accent Subtle           #0F2E4C
~~~

Accent Strong foi usado no companion em contexto de hover apenas como teste visual. A regra hover = #86C5FF ainda não está definida.

## Contextual Experimental Accent

~~~text
Experimental Accent     #9B8CFF
Experimental Subtle     #252044
~~~

#9B8CFF é secundário e contextual. Pode futuramente aparecer em experimentation, AI context, lab note, transformation ou special emphasis, mas essas associações não são mappings obrigatórios.

Não transformar AI = purple em regra automática.

## Semantic Color System

~~~text
Semantic Color System:
not_defined

Success: not_defined
Warning: not_defined
Error: not_defined
Info: not_defined
~~~

Os valores:

~~~text
#79D6A2
#E7B866
#F07F8C
#7DD3FC
~~~

permanecem somente como semantic_candidates em COLOR_OPTIONS.md e no specimen visual. Não fazem parte do core selecionado.

## One Dominant Accent

> The Precision Blue accent is the dominant chromatic signal. Violet is contextual and secondary.

A primeira percepção da identidade deve continuar sendo:

~~~text
dark neutral product system
~~~

e não:

~~~text
blue brand
purple brand
AI gradient brand
~~~

A orientação conceitual de proporção permanece:

~~~text
80–90% structural neutrals
10–20% visual signal
~~~

Isso não é fórmula rígida nem token de proporção.

## Signal Over Glow

> The selected palette must work with zero glow.

Não são definidos:

- glow color;
- glow radius;
- blur;
- shadow glow;
- neon treatment.

O primary accent deve servir futuramente principalmente a:

- focus;
- active state;
- selected state;
- link;
- progress;
- structural emphasis;
- small signal;
- controlled CTA emphasis.

Isso é orientação de função. Não define componentes nem interaction states finais.

## Accessibility

> Color must not be the only state carrier.

Estados futuros deverão poder utilizar, conforme necessário:

~~~text
color
+
label
+
shape/icon
~~~

Isso é um princípio de acessibilidade. Nenhuma iconografia ou componente é criado nesta etapa.

## Contraste

Ratios WCAG recalculados com relative luminance:

~~~text
Primary Text / Background
#F3F6FA / #0D1117
17.46:1

Secondary Text / Background
#B7C2CE / #0D1117
10.47:1

Muted Text / Background
#7F8B99 / #0D1117
5.46:1

Accent / Background
#4DA3FF / #0D1117
7.21:1

Accent / Surface 1
#4DA3FF / #151B24
6.59:1

Accent Strong / Background
#86C5FF / #0D1117
10.31:1
~~~

Os ratios orientam a exploração. Não significam que todo accent é adequado como texto pequeno em qualquer contexto.

## Dark-first, não dark-only

~~~text
dark-first
not dark-only
~~~

Nenhuma light palette é definida ou derivada automaticamente nesta etapa.

## Typography Compatibility

O sistema foi comparado com:

~~~text
IBM Plex Sans
IBM Plex Mono
~~~

Nenhuma decisão de escala, weights by role, line-height ou tracking é criada aqui.

## Open Color Decisions

Permanecem abertos:

- semantic colors;
- light mode;
- interaction mappings;
- hover mappings;
- focus mappings;
- disabled mappings finais;
- selection behavior;
- glow;
- shadows;
- gradients;
- opacity system;
- overlay colors;
- scrims;
- chart colors;
- data visualization colors;
- product-specific colors;
- color tokens;
- CSS variables;
- componentes;
- templates;
- Design System.

## Valores não são tokens ainda

> Selected color values are not yet Design Tokens.

Os labels atuais descrevem funções para documentação. Não foram criados nomes como --color-bg-primary, --lf-blue-500, color.brand.accent ou equivalentes como sistema oficial.

A arquitetura de tokens será definida posteriormente.

## Evidência Histórica

examples/color-review.html reproduz a comparação humana entre as três opções:

- Option A — Precision / Product;
- Option B — Digital / Builder;
- Option C — Lab / Experimental.

O specimen permanece neutro e não sinaliza vencedor. Seus tamanhos são review-only e seus dados são mock.

## Status

~~~text
color_status: approved
status: approved
~~~

Este documento ainda aguarda auditoria e promoção formal posterior.
