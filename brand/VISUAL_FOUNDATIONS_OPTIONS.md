---
document: VISUAL_FOUNDATIONS_OPTIONS
brand: Leo Ferraz
version: 0.1.0
status: approved
authority: Leo Ferraz
exploration_status: completed
decision_status: selected
selected_option: Modular / Product
selection_authority: Leo Ferraz
depends_on:
  - VISUAL_DIRECTION.md
  - TYPOGRAPHY.md
  - COLOR.md
---

# Visual Foundations Options

Este documento é um historical exploration record dos fundamentos estruturais da identidade Leo Ferraz. Ele materializa três sistemas comparados no companion visual sob condições equivalentes. Os valores abaixo são candidate values e não são tokens canônicos.

## Princípio central

> Structure should create recognition before decoration does.

O sistema deve ser reconhecível através de proportion, spacing, alignment, framing, borders, surface hierarchy, artifact treatment e metadata structure antes de depender de glow, gradient, illustration, logo ou special effects.

Todas as opções preservam:

- IBM Plex Sans e IBM Plex Mono;
- sistema cromático Precision / Product;
- Background #0D1117;
- Surface 1 #151B24;
- Surface 2 #1D2632;
- Border #2A3543;
- Border Strong #405064;
- Primary Accent #4DA3FF;
- Experimental Accent #9B8CFF;
- os mesmos textos, artifacts, dados mock, hierarquia e dimensões gerais;
- a mesma estrutura de Brand / Hero, Artifact Framing, Evidence, Modular UI, density tests e candidate cards.

Somente grid, spacing, radius, border treatment, shadow treatment e glow treatment diferem.

## Option A — Precision / Structural

~~~text
selection_status: not_selected
~~~

Caracterização:

~~~text
tighter
precise
low-radius
border-led
minimal elevation
technical
~~~

### Spacing

~~~text
Spacing Base:
4px

Spacing Scale:
4 · 8 · 12 · 16 · 24 · 32 · 48
~~~

### Construction Grid

~~~text
Columns:
8

Gutter:
12px

Outer:
24px
~~~

### Radius

~~~text
0
2px
4px
~~~

### Borders

~~~text
Border Width:
1px

Strong Border Width:
2px
~~~

### Shadow

~~~text
none
~~~

### Glow

~~~text
none
off by default
~~~

Principal força:

~~~text
precision, density and technical structural clarity
~~~

Principal risco:

~~~text
can become too rigid or resemble a developer tool / technical console
~~~

## Option B — Modular / Product

~~~text
selection_status: selected
~~~

Caracterização:

~~~text
balanced
modular
moderate spacing
moderate radius
versatile
product-oriented
~~~

### Spacing

~~~text
Spacing Base:
4px

Spacing Scale:
4 · 8 · 12 · 16 · 24 · 32 · 48 · 64
~~~

### Construction Grid

~~~text
Columns:
10

Gutter:
16px

Outer:
32px
~~~

### Radius

~~~text
0
4px
8px
~~~

### Borders

~~~text
Border Width:
1px

Strong Border Width:
2px
~~~

### Shadow Candidate

~~~text
0 10px 24px -18px rgba(0,0,0,.65)
~~~

### Glow

~~~text
none
off by default
~~~

Principal força:

~~~text
balanced structural system across product artifacts, editorial content, evidence and interfaces
~~~

Principal risco:

~~~text
can drift toward generic product/SaaS aesthetics if future components become overly rounded or card-driven
~~~

## Option C — Lab / Spatial

~~~text
selection_status: not_selected
~~~

Caracterização:

~~~text
spatial
negative-space-led
softer geometry
deeper hierarchy
controlled experimental
~~~

### Spacing

~~~text
Spacing Base:
4px

Spacing Scale:
4 · 8 · 16 · 24 · 32 · 48 · 64 · 96
~~~

### Construction Grid

~~~text
Columns:
6

Gutter:
20px

Outer:
48px
~~~

### Radius

~~~text
0
6px
10px
~~~

### Borders

~~~text
Border Width:
1px

Strong Border Width:
2px
~~~

### Shadow Candidate

~~~text
0 16px 32px -26px rgba(0,0,0,.75)
~~~

### Glow Candidate

~~~text
functional only
accent
10%
~~~

Esse glow representava apenas um teste funcional extremamente controlado. Não é regra estrutural.

Principal força:

~~~text
strong negative space and sophisticated artifact presentation
~~~

Principal risco:

~~~text
can drift toward soft SaaS or make the system unnecessarily spacious in dense applications
~~~

## Resultado da exploração

~~~text
Precision / Structural:
selection_status: not_selected

Modular / Product:
selection_status: selected

Lab / Spatial:
selection_status: not_selected
~~~

Modular / Product foi selecionada pelo fundador após comparação visual por apresentar o melhor equilíbrio observado entre:

- technical structure;
- modularity;
- artifact priority;
- editorial flexibility;
- evidence density;
- negative space;
- website compatibility;
- social content compatibility;
- product compatibility;
- IBM Plex compatibility;
- restrained visual character;
- deterministic implementation.

O registro é factual e contextual. A escolha não constitui claim de superioridade universal.

A apresentou maior risco de rigidez e leitura de developer tool. C apresentou maior risco de suavização excessiva e uso ineficiente de espaço. B apresentou a maior amplitude para Master Brand, conteúdo e produtos.

## Condições de comparação

As três opções foram mostradas com:

- mesmo conteúdo;
- mesma tipografia;
- mesmo sistema cromático;
- mesmos artifacts;
- mesmas informações;
- mesma quantidade de conteúdo;
- mesmos contextos de baixa, média e alta densidade;
- mesmos Product Card candidate e Evidence Card candidate;
- mesma representação discreta do Construction Grid.

O label funcional SELECTED aparece dentro do espécime de Modular UI em todas as opções. Ele representa functional selected state e não uma opção estrutural selecionada.

## Responsive implications

No desktop, os sistemas podem organizar hero, artifact, evidence e metadata em uma estrutura modular com relações constantes. Em mobile, a composição pode empilhar os mesmos contextos, preservando ordem, hierarquia e enquadramento sem criar outra escala estrutural. Em social portrait, o sistema pode priorizar uma coluna de artifact, headline ou evidence, mantendo o grid como estrutura invisível e expondo suas linhas apenas quando o contexto editorial justificar.

Essas são implicações qualitativas. Breakpoints, responsive grid, gutters responsivos e margens responsivas permanecem indefinidos.

## Risk Matrix

| Dimensão | Precision / Structural | Modular / Product | Lab / Spatial |
|---|---|---|---|
| Generic SaaS Risk | low — low radius e borders reduzem convenções de cards | medium — exige contenção de rounding e card density | medium — maior espaço pode aproximar linguagem de produto suave |
| Corporate Risk | medium — precisão pode parecer institucional | low — equilíbrio entre sistema e editorial | low — espacialidade reduz rigidez corporativa |
| Developer Tool Risk | high — densidade e border-led podem lembrar console | low — estrutura modular hospeda evidência sem parecer dashboard | low — ritmo espacial distancia-se de console |
| Gaming Risk | low — ausência de efeitos decorativos | low — estrutura neutra e modular | medium — experimentação espacial pode exigir contenção |
| Cyberpunk Risk | low — sem glow e sem linhas ornamentais | low — elevation controlada e cor restrita | low-medium — glow funcional deve permanecer raro |
| Over-designed Risk | low — restrição estrutural forte | low-medium — cards e radius precisam de disciplina | medium — espaço e hierarquia podem virar decoração |
| Under-designed Risk | medium — pouca elevation pode exigir composição cuidadosa | low — oferece relações suficientes sem ornamentação | low — hierarquia profunda sustenta presença |
| Long-Term Durability | medium-high — técnica, mas pode ficar rígida | high — versátil entre conteúdo e produto | medium-high — sofisticada, com risco de excesso espacial |
| Artifact Compatibility | high — framing preciso e direto | high — hospeda artifacts independentes | high — forte prioridade de artifact e respiro |
| Social Content Compatibility | medium — densidade favorece informação, exige edição | high — adapta-se a website, social e evidence | medium-high — excelente em peças de baixa densidade |
| Website Compatibility | medium-high — funciona com composição editorial técnica | high — amplitude entre hero, card e evidence | high — boa leitura de hero e artifact |
| Deterministic Implementation | high — poucos graus de liberdade | high — escala e relações explícitas | high — valores e limites explícitos |

## Determinismo

As três propostas podem ser implementadas futuramente por CSS, SVG, HTML, headless browser, design tokens e programmatic rendering, sem depender de interpretação estética subjetiva do agente. Nesta etapa, nenhum token, componente final ou Design System é criado.

## What is intentionally absent?

Em todas as opções permanecem ausentes:

- decorative glow;
- large floating shadows;
- excessive rounding;
- pillification;
- ornamental lines;
- perspective grid;
- Tron;
- glassmorphism;
- cyberpunk texture;
- device mockups;
- images;
- logo;
- monogram;
- custom wordmark;
- final components;
- final templates.

## Founder Review Questions

Which option feels most like a real product laboratory?

Which option feels most precise without becoming corporate?

Which option gives artifacts the strongest visual priority?

Which option works best with IBM Plex?

Which option makes metadata feel structured rather than decorative?

Which option feels premium through restraint?

Which option looks least like generic SaaS?

Which option looks least like a developer tool?

Which radius system best fits Leo Ferraz?

Which spacing system creates the best balance between editorial content and technical evidence?

Which option would work best across YouTube thumbnails, social posts and the website?

Which system could still feel current five years from now?

Which system is easiest for agents to reproduce deterministically?
