---
document: TYPOGRAPHY_OPTIONS
brand: Leo Ferraz
version: 0.1.0
status: approved
exploration_status: completed
decision_status: selected
selected_option: Plex Product System
selection_authority: Leo Ferraz
authority: Leo Ferraz
depends_on:
  - BRAND_FOUNDATION.md
  - BRAND_ARCHITECTURE.md
  - VOICE_AND_LANGUAGE.md
  - VISUAL_DIRECTION.md
---

# Typography Options

Este documento registra uma exploração controlada de sistemas tipográficos para Leo Ferraz.

Ele não aprova uma fonte, não cria tokens e não substitui a direção visual aprovada. A decisão pertence ao fundador após revisão humana, inclusive da página examples/typography-review.html.

## Contexto

A tipografia deve ajudar Leo Ferraz a parecer:

~~~text
independent product builder
~~~

e não:

~~~text
generic AI startup
tech influencer
gaming brand
cyberpunk brand
course creator
~~~

Typography carries structure, not technological decoration.

A tipografia candidata deve ser:

- clara;
- forte;
- contemporânea;
- internacional;
- altamente legível;
- adequada para interfaces;
- adequada para editorial;
- adequada para números e métricas;
- compatível com grandes headlines;
- compatível com uso programático;
- sustentável no longo prazo.

Evitar como fonte principal:

- sci-fi;
- techno;
- glitch;
- cyberpunk;
- gaming;
- pseudo-terminal;
- fontes excessivamente estilizadas;
- fontes cuja personalidade dependa de novidade visual.

## Arquitetura Avaliada

As opções avaliam três funções:

~~~text
Brand / Display
UI / Body
Technical / Mono
~~~

Quando fizer sentido, Brand / Display e UI / Body utilizam uma única família Sans. Technical / Mono é separado apenas para código, estados, metadata e métricas técnicas.

Nenhuma opção é vencedora, recomendada, final ou aprovada.

## Critérios Comuns

Cada sistema é avaliado por:

- legibilidade em headlines, body, UI, mobile, desktop, números e metadata;
- compatibilidade com Technical, Precise, Premium, Experimental, Systematic, Minimal, Dark, Digital, Modular, Evidence-led, Product-oriented e Independent;
- convivência com screenshots, interfaces e produtos reais;
- métricas, datas, estados, versões, labels e commits;
- integração com Construction Grid;
- contenção e proporção em vez de ornamentação;
- inglês, português do Brasil, caracteres latinos, acentuação e símbolos comuns;
- uso em HTML, CSS, SVG e renderização programática.

Todas as famílias abaixo foram verificadas em fontes oficiais em 2026-08-17. A verificação de licença não constitui aprovação da família para a marca.

## Option A — Plex Product System

### System Name

Plex Product System é um nome interno descritivo desta opção.

### Brand / Display

IBM Plex Sans.

### UI / Body

IBM Plex Sans.

### Technical / Mono

IBM Plex Mono.

### Roles

IBM Plex Sans mantém Brand / Display e UI / Body na mesma família, criando continuidade entre headlines, documentação, interface e produto.

IBM Plex Mono fica restrita a código, números técnicos, estados, commits e metadata. Isso preserva a função técnica sem transformar toda a marca em uma interface de terminal.

### Available Weights

IBM Plex Sans oferece oito pesos principais, com romano e itálico. Para uma futura implementação, os pesos relevantes a testar são:

~~~text
400 Regular
500 Medium
600 SemiBold
700 Bold
~~~

IBM Plex Mono possui múltiplos pesos e estilos. Para teste inicial:

~~~text
400 Regular
500 Medium
600 SemiBold
~~~

Esses pesos são uma faixa de exploração, não tokens aprovados.

### Variable Support

IBM Plex Sans possui arquivos variáveis oficiais com eixos de peso e largura. IBM Plex Mono está disponível em pacotes com múltiplos pesos; a disponibilidade de um arquivo variável específico deve ser confirmada novamente antes da implementação.

Variable font is an implementation advantage, not a branding requirement.

### Webfont, WOFF2 e Self-hosting

O repositório oficial disponibiliza formatos de fonte e pacotes web, incluindo WOFF2. O self-hosting é tecnicamente possível, desde que a versão e os avisos de licença sejam preservados.

A página de revisão utiliza uma webfont externa para teste e não adiciona binários ao repositório.

### Language Support

IBM Plex Sans possui extended Latin e cobertura internacional ampla. A documentação oficial descreve suporte a mais de 100 idiomas e caracteres latinos estendidos, o que atende inglês e português do Brasil com acentuação.

IBM Plex Mono acompanha a família técnica e deve ser testada especificamente para símbolos, setas e caracteres de código.

### Numerals

Os números têm desenho técnico claro e boa leitura em:

~~~text
PROJECT 001
BUILD 027
v0.3
1,204 USERS
$417 MRR
30 DAYS
18%
~~~

A opção é adequada para cards e dashboards, mas o uso de tabular numerals deve ser confirmado em uma implementação real com font-variant-numeric.

### Technical Characters

IBM Plex Mono é apropriada para:

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

Os caracteres devem ser revisados na página local, especialmente em combinações de código e metadata.

### Brazilian Portuguese Sample

~~~text
Construção
Experimentação
Evidência
Inteligência artificial
Métricas
Validação
Próxima versão
Não funcionou.
O produto é a prova.
~~~

O sistema preserva acentos e cedilha sem abandonar a leitura internacional.

### Licensing

~~~text
license: SIL Open Font License, Version 1.1
official_source: https://github.com/IBM/plex
date_verified: 2026-08-17
license_status: verified
~~~

O repositório oficial declara a licença OFL e disponibiliza os arquivos-fonte e formatos da família.

### Fallback

~~~css
IBM Plex Sans, system-ui, sans-serif
IBM Plex Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace
~~~

### Strengths

- forte relação com sistemas, produto e tecnologia sem depender de futurismo;
- boa distinção entre Sans e Mono;
- suporte internacional e latino amplo;
- presença de pesos suficientes para hierarquia;
- compatibilidade natural com metadata, estados, commits e métricas;
- caráter reconhecível sem exigir glow, gradiente ou ilustração.

### Risks

- a assinatura IBM pode trazer uma associação institucional mais forte do que a desejada;
- Mono pode dominar a percepção se for usada além do papel técnico;
- a riqueza de subfamílias pode induzir multiplicação desnecessária de escolhas;
- a sensação industrial precisa ser equilibrada com Founder Brand Fit.

### Dark Product Lab Fit

Traduz Product, Evidence, Systems e Experimentation com uma aparência de ferramenta de construção e documentação. Funciona em black, white, type e real artifact sem precisar parecer uma fonte futurista.

### Generic SaaS Risk

~~~text
low
~~~

O desenho é menos associado a landing pages SaaS genéricas do que famílias Sans de uso indistinto. O risco reaparece se a composição usar apenas cards e métricas sem artefatos reais.

### Futuristic Cliché Risk

~~~text
low
~~~

A família não precisa de gradientes, glow ou interfaces ficcionais para parecer tecnológica. O risco principal é industrial, não cyberpunk.

### Deterministic Implementation

Adequada para HTML, CSS, SVG, design tools e renderização programática. Pesos e famílias podem ser declarados explicitamente, e o uso de WOFF2 self-hosted é viável após auditoria de versão e licença.

### Distinguishing Character

Sistema de produto estruturado, técnico e modular, com maior ênfase em evidência operacional.

### Strongest Use Case

Build logs, cards de produto, estados, métricas, documentação técnica e composições em que o artefato real precisa permanecer protagonista.

### Strongest Risk

Parecer mais um sistema corporativo de tecnologia do que uma assinatura pessoal se a direção editorial e a seleção de pesos não trouxerem calor suficiente.

## Option B — Source Editorial System

### System Name

Source Editorial System é um nome interno descritivo desta opção.

### Brand / Display

Source Sans 3.

### UI / Body

Source Sans 3.

### Technical / Mono

Source Code Pro.

### Roles

Source Sans 3 mantém Brand / Display e UI / Body em uma única Sans de leitura, permitindo que o sistema seja mais editorial e founder-led sem perder funcionamento em interface.

Source Code Pro entra somente em código, versões, commits, estados e metadata, criando contraste funcional sem transformar headlines em aparência de IDE.

### Available Weights

Source Sans 3 possui arquivos estáticos e variáveis no repositório oficial. A faixa de teste é:

~~~text
400 Regular
500 Medium
600 SemiBold
700 Bold
800 ExtraBold
~~~

Source Code Pro possui pesos estáticos e arquivos variáveis oficiais. A faixa de teste é:

~~~text
400 Regular
500 Medium
600 SemiBold
~~~

Esses pesos são candidatos para comparação, não uma escala aprovada.

### Variable Support

Source Sans 3 possui versão variável oficial. Source Code Pro também disponibiliza arquivos variáveis e formatos web no repositório oficial.

Variable font is an implementation advantage, not a branding requirement.

### Webfont, WOFF2 e Self-hosting

Os repositórios oficiais disponibilizam WOFF2, fontes variáveis e CSS de webfont. O self-hosting é tecnicamente possível, condicionado à escolha posterior da versão e ao cumprimento da OFL.

A página de revisão usa carregamento webfont externo apenas para comparação visual. Nenhum arquivo binário de fonte é versionado.

### Language Support

Source Sans 3 é uma Sans para ambientes de UI com suporte a caracteres latinos e acentuação adequada para inglês e português do Brasil.

Source Code Pro cobre o conjunto esperado para código e metadata. Caracteres técnicos devem ser conferidos no browser, especialmente setas, símbolos monetários e pontuação.

### Numerals

Source Sans 3 oferece leitura limpa para:

~~~text
PROJECT 001
BUILD 027
v0.3
1,204 USERS
$417 MRR
30 DAYS
18%
~~~

Source Code Pro favorece alinhamento visual em blocos de números e labels técnicos. O uso de tabular numerals deve ser confirmado em CSS e não presumido apenas pela aparência.

### Technical Characters

Source Code Pro é adequada para:

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

O teste local verifica se a camada técnica permanece subordinada à leitura editorial.

### Brazilian Portuguese Sample

~~~text
Construção
Experimentação
Evidência
Inteligência artificial
Métricas
Validação
Próxima versão
Não funcionou.
O produto é a prova.
~~~

O sistema atende a acentos e cedilha e oferece uma leitura mais neutra e editorial.

### Licensing

~~~text
license: SIL Open Font License, Version 1.1
official_source: https://github.com/adobe-fonts/source-sans
official_mono_source: https://github.com/adobe-fonts/source-code-pro
date_verified: 2026-08-17
license_status: verified
~~~

Os repositórios oficiais da Adobe declaram OFL 1.1 e disponibilizam os arquivos, CSS e formatos web das famílias.

### Fallback

~~~css
Source Sans 3, system-ui, sans-serif
Source Code Pro, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace
~~~

### Strengths

- leitura editorial muito clara em português e inglês;
- boa adaptação de founder-led storytelling a interfaces;
- hierarquia de headline e body simples de programar;
- Source Code Pro separa técnica de personalidade principal;
- formatos estáticos, variáveis e WOFF2 disponíveis;
- funciona em black, white, type e real artifact sem depender de efeitos.

### Risks

- Source Sans 3 pode parecer genérica se a composição não usar artefatos, estados e grid próprios;
- a neutralidade editorial pode reduzir a percepção de laboratório se o mono for subutilizado;
- a disponibilidade ampla pode diminuir distinctiveness;
- será necessário cuidado para não virar uma identidade editorial genérica.

### Dark Product Lab Fit

Traduz Product, Evidence e Documentation com uma camada mais humana e founder-led. A estrutura tipográfica sustenta a jornada sem competir com screenshots, interfaces e produtos.

### Generic SaaS Risk

~~~text
medium
~~~

O desenho é eficiente para UI e pode lembrar produtos digitais comuns. O risco é controlado quando a direção usa artefatos reais, estados, metadata, restraint e construção editorial própria.

### Futuristic Cliché Risk

~~~text
low
~~~

Não requer gradientes, glow ou ilustrações futuristas. Sua neutralidade dificulta clichês, embora também exija composição mais específica para parecer distintiva.

### Deterministic Implementation

Adequada para HTML, CSS, SVG e renderização programática. Os arquivos WOFF2 e variáveis permitem self-hosting futuro, enquanto os fallbacks mantêm uma degradação previsível.

### Distinguishing Character

Sistema editorial de produto, mais aberto à narrativa do fundador e à documentação de aprendizados.

### Strongest Use Case

Build logs narrativos, páginas institucionais, long-form, headlines de experimentos, documentação de produto e materiais em que a voz precisa aparecer com mais calor.

### Strongest Risk

Parecer uma Sans de produto genérica se não houver contraste suficiente entre artefato, estado, metadata e narrativa.

## Comparação entre as Opções

As duas opções obedecem à mesma arquitetura funcional e podem usar uma única Sans para Brand / Display e UI / Body. A diferença está no comportamento:

- Plex Product System: mais product-system, técnico e operacional.
- Source Editorial System: mais editorial, legível e founder-led.

Nenhuma dimensão abaixo produz escolha automática.

| Critério | Plex Product System | Source Editorial System |
|---|---|---|
| Legibility | Alta | Alta |
| Display Strength | Alta, estruturada | Alta, editorial |
| UI Strength | Muito alta | Alta |
| Metrics | Muito alta | Alta |
| Technical Metadata | Muito alta | Alta |
| PT-BR Support | Alta | Alta |
| Global Fit | Muito alta | Alta |
| Product Orientation | Muito alta | Alta |
| Founder Brand Fit | Alta | Alta |
| Restraint | Alta | Alta |
| Distinctiveness | Alta | Média |
| Deterministic Implementation | Alta | Alta |
| Licensing Confidence | Alta, OFL verificada | Alta, OFL verificada |
| Generic SaaS Risk | Low | Medium |
| Futuristic Cliché Risk | Low | Low |

## Página de Revisão

A comparação visual local está em:

~~~text
examples/typography-review.html
~~~

Ela:

- usa o mesmo conteúdo em todas as opções;
- identifica o conteúdo como TYPOGRAPHY REVIEW — MOCK CONTENT;
- compara low, medium e high density;
- usa apenas ambiente neutro;
- não usa glow;
- não usa imagens, logos ou ilustrações;
- não cria dashboards fictícios;
- usa somente o placeholder REAL PRODUCT ARTIFACT;
- não altera tokens ou CSS global;
- não escolhe cor da marca;
- não é asset público, template ou site final.

O carregamento das famílias ocorre por webfont externa apenas para revisão. Se a rede estiver indisponível, os fallbacks documentados são usados; nenhuma fonte é simulada silenciosamente.

## Founder Review Questions

~~~text
Which option feels most like a product builder rather than an AI creator?

Which option gives "Leo Ferraz" the strongest identity without becoming decorative?

Which option works best with real product screenshots?

Which option makes metrics and project states easiest to scan?

Which option feels premium through restraint rather than effects?

Which option feels least dependent on current visual trends?

Which option could still represent the brand five years from now?

Which option works equally well in English and Portuguese?

Which option feels most natural for SaaS, apps, games and experiments?

Which option feels most distinct without sacrificing usability?
~~~

## Validação de Escopo

Nesta etapa:

- nenhuma fonte foi aprovada;
- nenhuma cor foi aprovada;
- nenhum logo foi criado;
- nenhum token foi criado;
- nenhuma identidade superior foi alterada;
- as opções são tecnicamente utilizáveis em princípio;
- as licenças foram verificadas em fontes oficiais;
- a comparação usa mock content explícito;
- nenhum dado fictício pode ser confundido com resultado real.

Não criar nesta etapa:

- TYPOGRAPHY.md;
- tokens;
- paleta;
- logo;
- monograma;
- Design System;
- templates;
- implementação global.

## Status

~~~text
typography_status: approved
~~~

As opções permanecem preservadas como histórico de exploração concluída. A opção selecionada é `Plex Product System`; as demais estão explicitamente marcadas como `not_selected`.

## Decision

~~~text
Selected:
Plex Product System

Primary Sans:
IBM Plex Sans

Technical Mono:
IBM Plex Mono

Not Selected:
Source Editorial System
~~~

Decision authority:

~~~text
Leo Ferraz
~~~

A escolha ocorreu após technical validation, visual comparison e founder review.

Source Editorial System permanece tecnicamente válido como alternativa explorada e recebe somente:

~~~text
selection_status: not_selected
~~~

Isso não o classifica como rejected, failed, invalid ou deprecated.
