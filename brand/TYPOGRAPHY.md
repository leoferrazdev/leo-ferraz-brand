---
document: TYPOGRAPHY
brand: Leo Ferraz
version: 0.1.0
status: approved
authority: Leo Ferraz
decision_basis: founder_visual_review
selected_system: Plex Product System
depends_on:
  - BRAND_FOUNDATION.md
  - BRAND_ARCHITECTURE.md
  - VOICE_AND_LANGUAGE.md
  - VISUAL_DIRECTION.md
  - TYPOGRAPHY_OPTIONS.md
---

# Typography

Este documento registra o resultado da exploração tipográfica da marca Leo Ferraz após validação técnica, comparação visual e revisão do fundador.

O estado review significa que a decisão foi registrada para auditoria humana nesta etapa. Este documento ainda não promove a decisão para approved e não cria uma implementação final.

## Selected Typography System

O sistema selecionado pelo fundador é:

~~~text
Plex Product System
~~~

Sua arquitetura é:

~~~text
Brand / Display:
IBM Plex Sans

UI / Body:
IBM Plex Sans

Technical / Mono:
IBM Plex Mono
~~~

Não há uma terceira família no sistema selecionado.

## Primary Sans

~~~text
IBM Plex Sans
~~~

IBM Plex Sans é a família principal da Master Brand. Futuramente, ela poderá atender funções como:

- Master Brand;
- display;
- headlines;
- body;
- UI;
- editorial;
- thumbnails;
- captions;
- institutional communication;
- product documentation.

Essas são funções possíveis da família, não especificações tipográficas finais. Este documento não define tamanho, peso obrigatório, tracking, line-height, casing ou breakpoint.

## Technical Mono

~~~text
IBM Plex Mono
~~~

IBM Plex Mono é a família técnica complementar. Futuramente, ela poderá atender funções como:

- metadata;
- project states;
- build identifiers;
- versions;
- commits;
- metrics;
- technical labels;
- code;
- Evidence Layer;
- structured evidence.

Essas são funções possíveis da família, não especificações tipográficas finais. Este documento não define tamanho, peso obrigatório, tracking, line-height, font-feature-settings ou uso obrigatório em uppercase.

## Relação entre Sans e Mono

~~~text
IBM Plex Sans
+
IBM Plex Mono
=
one coordinated typography system
~~~

O sistema busca continuidade visual entre:

~~~text
Brand
↓
Product
↓
State
↓
Metadata
↓
Evidence
~~~

IBM Plex Mono complementa IBM Plex Sans. A família Mono não deve competir com a Sans como segunda fonte de display.

## Princípio Tipográfico

> Typography carries structure, not technological decoration.

A tecnologia deve continuar vindo principalmente de:

- informação;
- produto;
- estrutura;
- estados;
- evidência;
- metadata.

O sistema não depende de uma tipografia futurista para comunicar tecnologia.

## Relação com Dark Product Lab

O sistema selecionado suporta a direção Dark Product Lab e seu caráter evidence-driven através de:

- technical structure;
- modularity;
- product orientation;
- metadata;
- metrics;
- systematic communication;
- restrained visual identity.

Essa justificativa descreve aderência ao sistema visual em desenvolvimento. IBM Plex não é exclusiva, não é universalmente superior e não foi criada para Leo Ferraz.

## Artifact First

A tipografia deve apoiar:

~~~text
Artifact First
~~~

Ela deve estruturar a informação ao redor de:

- screenshots;
- interfaces;
- produtos;
- gráficos;
- código;
- evidências reais.

Quando existir, o artefato continua tendo prioridade. A tipografia não deve competir com ele.

## Product Over Promise

Grandes headlines podem possuir presença visual forte, mas:

~~~text
Product Over Promise
~~~

continua sendo um princípio superior. A força tipográfica não deve transformar a marca em comunicação baseada predominantemente em slogans.

## Evidence Is Visual

IBM Plex Mono poderá ser especialmente útil para representações futuras de:

~~~text
PROJECT
BUILD
VERSION
STATUS
COMMIT
DATE
USERS
REVENUE
METRICS
~~~

Esses elementos só devem representar dados correspondentes quando forem reais ou claramente identificados como mock. Este documento não cria um schema definitivo.

## Headlines

IBM Plex Sans foi selecionada também por sua capacidade de sustentar grandes headlines sem depender de:

- glow;
- outline;
- gradients;
- futuristic effects;
- decorative typography.

Isso é relevante para futuras thumbnails, social posts, hero statements e video covers. Esta seção não cria regras específicas de thumbnail.

## Português do Brasil

O sistema foi validado com português do Brasil e deve suportar:

- acentuação;
- cedilha;
- caracteres latinos;
- headlines em PT-BR;
- body em PT-BR;
- metadata e conteúdo técnico misto quando necessário.

Esta seção não altera a política linguística da marca, que será formalizada separadamente.

## Inglês

O sistema também foi validado para comunicação internacional e técnica em inglês, incluindo:

~~~text
Leo Ferraz
Building with AI
AI-Native Product Lab
~~~

O documento não cria novas regras de idioma. A arquitetura english-first permanece definida nas fontes superiores.

## Números

O sistema foi avaliado para uso com:

~~~text
0 1 2 3 4 5 6 7 8 9
~~~

e contextos como:

~~~text
1,204 USERS
30 DAYS
18%
$417 MRR
v0.3.0
BUILD 027
~~~

Esses valores são specimens utilizados na exploração. Não representam dados reais.

## Caracteres Técnicos

A família Mono foi avaliada com:

~~~text
{}
[]
()
<>
/
\
→
≠
+
=
#
@
:
;
.
_
-
%
$
~~~

Também foram avaliados testes de distinção:

~~~text
0 O
1 l I
~~~

Esses specimens não são conteúdo institucional.

## Licenciamento

~~~text
IBM Plex Sans
License: SIL Open Font License 1.1

IBM Plex Mono
License: SIL Open Font License 1.1
~~~

Fonte oficial verificada:

~~~text
https://github.com/IBM/plex
~~~

O licenciamento foi verificado durante a exploração tipográfica. O texto completo da licença não é reproduzido aqui.

## Implementação Futura

O sistema é conceitualmente compatível com:

- HTML;
- CSS;
- SVG;
- headless browser rendering;
- social asset generation;
- documentation;
- websites;
- deterministic templates.

Esta compatibilidade não define a implementação futura. Permanecem em aberto CDN, self-hosting final, file structure, WOFF2 strategy, preload, font-display, subset e variable font implementation.

## Font Binaries

> Font binaries are not part of the Brand System repository at this stage.

Nenhum arquivo .ttf, .otf, .woff ou .woff2 faz parte do repositório nesta etapa.

## Open Typography Decisions

Permanecem indefinidos:

- font sizes;
- type scale;
- display scale;
- body scale;
- weights by role;
- line heights;
- letter spacing;
- text transforms;
- uppercase rules;
- responsive typography;
- breakpoints;
- fluid typography;
- numeral configuration;
- OpenType features;
- font loading strategy;
- variable font strategy;
- fallback stacks finais.

Não são atribuídos valores provisórios nesta etapa.

## Specimen e Design System

Os valores utilizados em examples/typography-review.html serviram somente para comparação.

Eles não devem ser interpretados como:

- escala oficial;
- pesos oficiais;
- spacing oficial;
- layout oficial;
- componentes oficiais;
- tokens.

A página continua sendo uma ferramenta de revisão humana e uma evidência histórica da exploração, não uma especificação tipográfica canônica de implementação.

## Risco Conhecido

~~~text
Corporate / Institutional Risk: medium
~~~

Esse trade-off conhecido deve ser controlado futuramente através de:

- composição;
- artifact-first;
- hierarchy;
- restrained color system;
- founder/product context;
- modular evidence language.

Este documento não tenta resolver o risco e não cria cores ou layouts para compensá-lo.

## Exploration Outcome

O Source Editorial System, composto por Source Sans 3 e Source Code Pro, permaneceu tecnicamente válido na exploração.

~~~text
selection_status: not_selected
~~~

A não seleção não significa que o sistema seja ruim, inválido, tecnicamente incompatível ou tenha falhado em licenciamento. Significa somente que o fundador selecionou Plex Product System para a Master Brand.

## Razão Resumida da Decisão

A seleção humana considerou:

- maior continuidade entre Sans e Mono;
- caráter mais system/product/technical;
- maior força em headlines;
- boa relação com metadata e evidence;
- capacidade de funcionar sem decoração tecnológica;
- maior aderência à direção Dark Product Lab.

O risco conhecido é uma possível leitura corporativa/institucional, que permanece como trade-off para controle futuro.

## Limites desta Decisão

Este documento não define:

- escala tipográfica;
- tamanhos;
- pesos por função;
- line-height;
- tracking;
- casing;
- breakpoints;
- configuração numérica;
- OpenType features;
- estratégia de carregamento;
- tokens;
- templates;
- Design System;
- logo;
- wordmark;
- paleta.

A decisão tipográfica registrada aqui permanece em review até auditoria e promoção formal posteriores.
