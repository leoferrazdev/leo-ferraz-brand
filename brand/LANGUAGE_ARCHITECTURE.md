---
document: LANGUAGE_ARCHITECTURE
brand: Leo Ferraz
version: 0.1.0
status: approved
authority: Leo Ferraz
policy_name: Global Brand. Localized Communication.
depends_on:
  - BRAND_FOUNDATION.md
  - BRAND_ARCHITECTURE.md
  - VOICE_AND_LANGUAGE.md
---

# Language Architecture

Este documento formaliza a arquitetura linguística da marca Leo Ferraz.

## Política

~~~text
Global Brand. Localized Communication.
~~~

Esta é uma política interna do Brand System. Não é slogan, tagline, descriptor, manifesto ou texto público obrigatório.

## Modelo Linguístico Oficial

~~~yaml
brand_identity_language: English
primary_content_language: pt-BR
global_technical_language: English
localization_model: channel-based
~~~

A identidade institucional da marca possui termos globais estáveis em inglês.

A comunicação pública não precisa ser integralmente em inglês.

O idioma é resolvido pelo contexto, canal, audiência e conteúdo.

A marca é global.

A comunicação é localizada.

## Termos Institucionais Invariantes

Estes termos são elementos da identidade institucional e não devem ser traduzidos automaticamente:

~~~text
Master Brand:
Leo Ferraz

Descriptor:
Building with AI

Institutional Category:
AI-Native Product Lab

Digital Handle:
@leoferrazdev

Primary Domain:
leoferraz.dev
~~~

Não gerar automaticamente `Leo Ferraz | Construindo com IA` como substituição do display name aprovado.

Não substituir `AI-Native Product Lab` por uma tradução portuguesa como categoria oficial.

## Conteúdo Localizável

Conteúdo editorial e comunicacional pode ser localizado. Isso inclui:

- vídeos;
- títulos;
- thumbnails;
- captions;
- descrições;
- posts;
- artigos;
- newsletters;
- body copy;
- explicações;
- CTAs;
- documentação editorial voltada ao público;
- interface editorial da marca.

~~~text
The identity remains stable.
The communication adapts to the audience.
~~~

## Regra de Uma Peça

~~~text
One piece should have one predominant communication language.
~~~

Uma publicação não deve duplicar automaticamente todo o conteúdo em PT-BR e English na mesma peça.

Exemplo indesejado:

~~~text
Construí um produto com IA.
I built a product with AI.
~~~

Termos institucionais invariantes em inglês podem aparecer dentro de uma peça em PT-BR sem transformar a peça em conteúdo bilíngue.

## Thumbnails e Vídeos

~~~text
thumbnail_language = content_language
~~~

Vídeo em PT-BR deve utilizar headline da thumbnail em PT-BR.

Vídeo em inglês deve utilizar headline da thumbnail em inglês.

Não utilizar inglês automaticamente em thumbnails brasileiras apenas para parecer tecnológico.

## Conteúdo Principal Atual

~~~yaml
primary_content_language: pt-BR
~~~

Isso se aplica principalmente a:

- YouTube;
- Instagram;
- TikTok;
- Twitch;
- LinkedIn;
- Substack.

Essa decisão não impede futura expansão internacional.

## Contextos Internacionais

Os contextos técnicos e internacionais prioritários são:

~~~text
GitHub: English
X: English
Reddit: English
~~~

Eles funcionam prioritariamente como presença no ecossistema internacional de builders, developers, founders, product people, indie hackers, game developers, AI practitioners e open-source communities.

Essas categorias não constituem ICP formal.

## Site

~~~text
leoferraz.dev:
PT-BR + English
~~~

A implementação futura deverá suportar localização explícita.

~~~yaml
site_locales:
  - pt-BR
  - en
~~~

Esta arquitetura não determina framework, routing, URL structure, redirect, language detection, hreflang, CMS ou browser locale strategy.

## Produtos

~~~yaml
product_language: product-specific
~~~

Produtos individuais não herdam obrigatoriamente o idioma da Master Brand.

Cada SaaS, app, game ou experiment pode definir idioma segundo mercado, público, distribuição, plataforma e estratégia própria.

Não impor PT-BR ou English a todos os produtos.

## Textos Canônicos

### Bio institucional internacional

~~~yaml
canonical_bio.en: |
  Building real products with AI.
  SaaS · Apps · Games · Experiments
  Documenting the journey.
~~~

O texto não deve ser alterado quando a bio institucional internacional for solicitada.

### Bio localizada oficial

~~~yaml
canonical_bio.pt-BR: |
  Construindo produtos reais com IA.
  SaaS · Apps · Jogos · Experimentos
  Documentando a jornada.
~~~

Esta é uma tradução oficial controlada. Agentes não devem produzir novas traduções alternativas quando a bio canônica for solicitada.

### Manifesto internacional

~~~yaml
manifesto.en: "Building with AI. Documenting what happens."
~~~

### Manifesto localizado oficial

~~~yaml
manifesto.pt-BR: "Construindo com IA. Documentando o que acontece."
~~~

Esta tradução não substitui o descriptor institucional `Building with AI`. Descriptor e manifesto são elementos diferentes.

## Display Names

O display name preferencial para canais públicos é:

~~~text
Leo Ferraz | Building with AI
~~~

Exceto GitHub, cujo display name é:

~~~text
Leo Ferraz
~~~

Não traduzir `Building with AI` nos display names. Usernames e handles são definidos separadamente pelas limitações e disponibilidade das plataformas. Esta especificação trata de display name, não username.

## Perfis Oficiais por Canal

### YouTube

~~~yaml
channel: YouTube
communication_locale: pt-BR
display_name: Leo Ferraz | Building with AI
description: |
  Sou Leo Ferraz. Construo, lanço e testo produtos digitais reais usando IA — SaaS, aplicativos, jogos, ferramentas e experimentos.

  Este canal documenta a jornada da ideia ao produto: desenvolvimento, lançamento, distribuição, usuários, receita, decisões, erros, fracassos e aprendizados.

  Sem atalhos ou promessas milagrosas. Produtos reais, experimentos reais e resultados observados.

  Building with AI. Documenting what happens.
~~~

O fechamento em inglês funciona como assinatura institucional e não altera o locale predominante da descrição.

### Instagram

~~~yaml
channel: Instagram
communication_locale: pt-BR
display_name: Leo Ferraz | Building with AI
bio: |
  Construindo produtos reais com IA.
  SaaS · Apps · Jogos · Experimentos
  Documentando a jornada.
~~~

### TikTok

~~~yaml
channel: TikTok
communication_locale: pt-BR
display_name: Leo Ferraz | Building with AI
bio: |
  Construindo produtos reais com IA.
  SaaS · Apps · Jogos · Experimentos
  Documentando a jornada.
~~~

### Twitch

~~~yaml
channel: Twitch
communication_locale: pt-BR
display_name: Leo Ferraz | Building with AI
bio: |
  Construindo produtos reais com IA ao vivo.
  SaaS · Apps · Jogos · Experimentos
  Da ideia ao lançamento.
~~~

### LinkedIn

~~~yaml
channel: LinkedIn
communication_locale: pt-BR
display_name: Leo Ferraz | Building with AI
about: |
  Construo, lanço e testo produtos digitais reais usando inteligência artificial — SaaS, aplicativos, jogos, ferramentas e experimentos.

  Opero um AI-Native Product Lab independente onde transformo ideias em produtos, coloco esses produtos no mercado e documento o que acontece: construção, decisões, lançamentos, usuários, resultados, erros e aprendizados.

  The product is the proof.
~~~

O princípio final permanece em inglês por ser princípio institucional canônico.

### GitHub

~~~yaml
channel: GitHub
communication_locale: en
display_name: Leo Ferraz
bio: "Building real products with AI · SaaS, apps, games & experiments · From idea to launch."
~~~

GitHub é contexto técnico e internacional. README e documentação de projetos públicos podem ser English-first quando o projeto tiver intenção internacional. Isso não obriga produtos localizados a utilizar inglês.

### X

~~~yaml
channel: X
communication_locale: en
display_name: Leo Ferraz | Building with AI
bio: |
  Building real products with AI.
  SaaS · Apps · Games · Experiments.
  Documenting the journey.
~~~

### Reddit

~~~yaml
channel: Reddit
communication_locale: en
display_name: Leo Ferraz | Building with AI
bio: "Building real products with AI — SaaS, apps, games & experiments. Sharing what I build, ship, measure and learn."
~~~

### Substack

~~~yaml
channel: Substack
communication_locale: pt-BR
display_name: Leo Ferraz | Building with AI
description: "Bastidores da construção de produtos reais com IA — SaaS, aplicativos, jogos e experimentos. Ideias, decisões, lançamentos, resultados, erros e aprendizados documentados ao longo da jornada."
~~~

## Matriz Canônica de Canais

| Canal | Display name | Locale |
|---|---|---|
| YouTube | Leo Ferraz \| Building with AI | pt-BR |
| Instagram | Leo Ferraz \| Building with AI | pt-BR |
| TikTok | Leo Ferraz \| Building with AI | pt-BR |
| Twitch | Leo Ferraz \| Building with AI | pt-BR |
| LinkedIn | Leo Ferraz \| Building with AI | pt-BR |
| GitHub | Leo Ferraz | en |
| X | Leo Ferraz \| Building with AI | en |
| Reddit | Leo Ferraz \| Building with AI | en |
| Substack | Leo Ferraz \| Building with AI | pt-BR |
| Website | Leo Ferraz | pt-BR + en |

## Termos Editoriais

Termos como Build, Build Log, Experiment, Product, Shipped, Building, Failed e Results não são automaticamente termos institucionais invariantes.

Eles podem ser localizados conforme o contexto.

Não aprovar traduções finais para todos esses termos nesta etapa. O candidate Lab State System não é transformado em taxonomia definitiva.

~~~yaml
editorial_terms: localizable
~~~

## Semantics Before Strings

~~~text
Semantic state should be separated from localized display text.
~~~

Exemplo conceitual:

~~~yaml
status: building
~~~

~~~text
en:
BUILDING

pt-BR:
EM CONSTRUÇÃO
~~~

Este é apenas um exemplo arquitetural. Não aprova taxonomia de status, tradução final dos status, schema, componente ou token.

## Política para Agentes

Agents must resolve the communication locale before generating public copy.

Agents must not translate invariant institutional terms.

Agents must use exact approved localized profile copy when a canonical channel bio or description is requested.

Agents must not invent alternate translations of canonical bios.

Agents must not duplicate PT-BR and English automatically in the same piece.

Agents must preserve one predominant communication language per piece.

Agents must treat product locale separately from Master Brand locale.

## Limites desta Arquitetura

Este documento não implementa localização. Não cria locale JSON, i18n files, translation tokens, componentes, templates, site, sitemap, rotas ou design tokens.

Não inventa limites de caracteres para plataformas. Compatibilidade operacional com campos reais poderá ser verificada em etapa de publicação.
