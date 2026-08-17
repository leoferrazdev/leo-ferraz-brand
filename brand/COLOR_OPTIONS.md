---
document: COLOR_OPTIONS
brand: Leo Ferraz
version: 0.1.0
status: approved
authority: Leo Ferraz
exploration_status: completed
decision_status: selected
selected_option: Precision / Product
selection_authority: Leo Ferraz
depends_on:
  - BRAND_FOUNDATION.md
  - BRAND_ARCHITECTURE.md
  - VOICE_AND_LANGUAGE.md
  - VISUAL_DIRECTION.md
  - TYPOGRAPHY.md
---

# Color Options

Este documento é um historical exploration record da exploração cromática da marca Leo Ferraz.

Ele registra valores candidatos materializados no companion visual e a decisão humana de exploração. Não é a especificação cromática canônica principal, não cria tokens e não define implementação final.

## Escopo da Exploração

As três opções foram comparadas sob as mesmas condições:

- mesmo layout;
- mesmos textos;
- mesma tipografia;
- mesma hierarquia;
- mesma densidade;
- mesmas funções de cor;
- IBM Plex Sans e IBM Plex Mono;
- sem glow;
- sem gradients;
- sem logo;
- sem imagem;
- sem ilustração.

Todas as cores abaixo são candidate values.

O objetivo visual foi materializar:

~~~text
dark
+
product
+
evidence
+
systems
+
experimentation
~~~

e não:

~~~text
dark
+
neon
+
generic futuristic AI
~~~

A estrutura comum é:

~~~text
Neutral Foundation
+
One Dominant Technology Accent
+
Contextual Experimental Accent
+
Future Semantic Colors
~~~

As opções continuam dark-first, mas não definem light mode.

## Option A — Precision / Product

~~~text
selection_status: selected
~~~

Caracterização:

~~~text
graphite
cold
controlled
product-oriented
precise
~~~

### Neutral Foundation

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

### Primary Technology Accent

~~~text
Accent                  #4DA3FF
Accent Strong           #86C5FF
Accent Subtle           #0F2E4C
~~~

Accent Strong foi demonstrado também em contexto de hover no companion. Isso não define hover = #86C5FF como regra de interação canônica. A função de hover permanece indefinida.

### Contextual Experimental Accent

~~~text
Experimental Accent     #9B8CFF
Experimental Subtle     #252044
~~~

### Semantic Candidates

~~~text
Success                 #79D6A2
Warning                 #E7B866
Error                   #F07F8C
Info                    #7DD3FC
~~~

Esses valores permanecem semantic_candidates, não semantic colors canônicas.

### Exploration Assessment

Strongest characteristic:

~~~text
balanced product-system identity with restrained technological signal
~~~

Strongest use case:

Produto, documentação, screenshots, metadata, evidence e interfaces em que o artefato deve permanecer protagonista.

Primary risk:

~~~text
can become overly institutional if future composition becomes too formal
~~~

What differentiates it:

Equilíbrio entre fundação neutra graphite, precisão técnica e sinal azul controlado.

## Option B — Digital / Builder

~~~text
selection_status: not_selected
~~~

Caracterização:

~~~text
blue-black
energetic
digital
present
builder-oriented
~~~

### Neutral Foundation

~~~text
Background              #0B1118
Surface 1               #111C25
Surface 2               #182936
Border                  #263B4A
Border Strong           #3D596A
Primary Text            #F0F8FC
Secondary Text          #A9C1CE
Muted Text              #76919E
Disabled / Low-emphasis #526C77
~~~

### Primary Technology Accent

~~~text
Accent                  #37B8E6
Accent Strong           #70D8F3
Accent Subtle           #0C303C
~~~

### Contextual Experimental Accent

~~~text
Experimental Accent     #A588FA
Experimental Subtle     #2C224B
~~~

### Semantic Candidates

~~~text
Success                 #78D6A6
Warning                 #E8B965
Error                   #F27F8E
Info                    #7DDCF4
~~~

Todos os semantic colors permanecem candidatos.

### Exploration Assessment

Strongest characteristic:

~~~text
strong digital energy and technical presence
~~~

Strongest use case:

Build logs, atividade de produto, interfaces digitais e contextos de construção com energia visual controlada.

Primary risk:

~~~text
can drift toward developer-tool or generic technical SaaS aesthetics
~~~

What differentiates it:

Blue-black mais presente e accent cyan-blue com maior energia digital.

## Option C — Lab / Experimental

~~~text
selection_status: not_selected
~~~

Caracterização:

~~~text
deep cool
sophisticated
experimental
violet-influenced
~~~

### Neutral Foundation

~~~text
Background              #101018
Surface 1               #171725
Surface 2               #202039
Border                  #34344D
Border Strong           #4C4D70
Primary Text            #F5F5FB
Secondary Text          #BFC0D0
Muted Text              #898BA1
Disabled / Low-emphasis #5D5F73
~~~

### Primary Technology Accent

~~~text
Accent                  #5EA6FF
Accent Strong           #96C8FF
Accent Subtle           #1B3153
~~~

### Contextual Experimental Accent

~~~text
Experimental Accent     #B18CFF
Experimental Subtle     #35234D
~~~

### Semantic Candidates

~~~text
Success                 #7AD7A6
Warning                 #E8BA6B
Error                   #F48191
Info                    #83C6FF
~~~

Todos os semantic colors permanecem candidatos.

### Exploration Assessment

Strongest characteristic:

~~~text
deep and sophisticated experimental atmosphere
~~~

Strongest use case:

Lab notes, experiments, transformation, AI context e peças com densidade experimental controlada.

Primary risk:

~~~text
violet influence can make experimentation/AI define the entire visual atmosphere
~~~

What differentiates it:

Neutros deep cool e relação mais próxima com violet sem transformar violet no accent dominante.

## Comparação entre as Opções

As três opções mantêm a mesma arquitetura funcional. A comparação abaixo registra dimensões de análise e não produz escolha automática:

| Dimensão | Precision / Product | Digital / Builder | Lab / Experimental |
|---|---|---|---|
| Dark Product Lab Fit | strong | strong | strong |
| Neutral Quality | graphite, controlled | blue-black, present | deep cool, sophisticated |
| Primary Accent Strength | precise blue | energetic cyan-blue | clear blue |
| Accent Restraint | high | medium-high | high |
| Experimental Accent Relationship | contextual violet | contextual violet | closer violet influence |
| Artifact Compatibility | high | high | high |
| Typography Compatibility | IBM Plex compatible | IBM Plex compatible | IBM Plex compatible |
| Metadata Legibility | high | high | high |
| Metrics Legibility | high | high | high |
| Surface Hierarchy | clear | clear | clear |
| Border Clarity | controlled | present | more atmospheric |
| Premium Character | restrained | active | sophisticated |
| Technical Character | precise | energetic | deep |
| Founder Brand Fit | aligned | aligned | aligned with trade-off |
| Generic SaaS Risk | low | medium | low-medium |
| Cyberpunk Risk | low | low-medium | medium |
| Gaming Risk | low | low-medium | low-medium |
| AI Cliché Risk | low | low-medium | medium |
| Long-Term Durability | high | medium-high | medium-high |
| Accessibility Confidence | high in tested pairs | high in tested pairs | high in tested pairs |
| Deterministic Implementation | high | high | high |

## Contraste da Exploração

Os principais pares de contraste da Option A, recalculados com WCAG relative luminance, são:

~~~text
Primary Text / Background:
#F3F6FA / #0D1117
17.46:1

Secondary Text / Background:
#B7C2CE / #0D1117
10.47:1

Muted Text / Background:
#7F8B99 / #0D1117
5.46:1

Accent / Background:
#4DA3FF / #0D1117
7.21:1

Accent / Surface 1:
#4DA3FF / #151B24
6.59:1

Accent Strong / Background:
#86C5FF / #0D1117
10.31:1
~~~

Ratios adicionais observados no mesmo cálculo:

~~~text
Option B:
Primary / Background 17.64:1
Secondary / Background 10.12:1
Muted / Background 5.70:1
Accent / Background 8.27:1
Accent / Surface 1 7.53:1
Accent Strong / Background 11.56:1

Option C:
Primary / Background 17.43:1
Secondary / Background 10.52:1
Muted / Background 5.65:1
Accent / Background 7.55:1
Accent / Surface 1 7.06:1
Accent Strong / Background 10.82:1
~~~

Esses ratios são evidência da exploração e não aprovam uso como texto pequeno em todos os contextos. Accent não é semantic state.

## Riscos por Opção

| Opção | Generic SaaS Risk | Cyberpunk Risk | Gaming Risk | Corporate Risk | AI Cliché Risk |
|---|---|---|---|---|---|
| Precision / Product | low | low | low | medium | low |
| Digital / Builder | medium | low-medium | low-medium | low-medium | low-medium |
| Lab / Experimental | low-medium | medium | low-medium | low | medium |

Os riscos descrevem trade-offs de composição futura, não invalidam as opções não selecionadas.

## Resultado da Exploração

Após comparação visual humana:

~~~text
Precision / Product
selection_status: selected

Digital / Builder
selection_status: not_selected

Lab / Experimental
selection_status: not_selected
~~~

Precision / Product foi selecionada pelo fundador após comparação visual porque apresentou o melhor equilíbrio observado entre:

- neutral foundation;
- product orientation;
- technical precision;
- accent restraint;
- IBM Plex compatibility;
- artifact compatibility;
- evidence/metadata readability;
- long-term durability.

O primary blue funciona como sinal e não como tema. O violet permanece contextual. Os neutros não impõem atmosfera específica aos produtos. Screenshots e artefatos futuros podem permanecer protagonistas.

Essa é uma decisão humana contextual. Não constitui claim de superioridade universal da paleta.

## Estado Cromático

~~~text
color_status: exploration
status: approved
~~~

A exploração está concluída e a decisão foi registrada, mas os valores ainda não são tokens nem especificação cromática canônica principal.

## Semantic Colors

~~~text
semantic_candidates
~~~

Os valores semânticos das três opções permanecem no histórico como candidatos. Nenhum sistema semântico foi aprovado.

## Limites

Este documento não define:

- semantic colors finais;
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

## Founder Review Questions

Which option feels most like a real product laboratory rather than an AI brand?

Which option allows Leo Ferraz to remain the protagonist rather than the accent color?

Which accent feels technological without looking futuristic for its own sake?

Which system works best with IBM Plex?

Which option makes real screenshots and product artifacts feel most natural?

Which option gives metadata and evidence enough structure without turning them into decoration?

Which option feels premium through restraint?

Which option feels least like generic SaaS?

Which option feels least like gaming, crypto or cyberpunk?

Which option would still feel appropriate five years from now?

Which option works best with PT-BR headlines?

Which option could support SaaS, apps, games and experiments without becoming tied to one category?
