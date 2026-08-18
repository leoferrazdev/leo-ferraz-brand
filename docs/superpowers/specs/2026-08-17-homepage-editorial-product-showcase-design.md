---
title: Homepage Editorial Product Showcase
date: 2026-08-17
document_type: design-specification
status: approved
scope: application-layer
source_brand_system: v1.0.0
---

# Homepage Editorial Product Showcase

## Decision

A homepage do Leo Ferraz receberá uma camada de aplicação visual mais editorial, narrativa e orientada à descoberta de produtos, inspirada na gramática observada em `aioriented.dev`, sem copiar sua identidade, conteúdo, marca ou estrutura proprietária.

A aproximação será tratada como uma aplicação de `Dark Product Lab`, não como uma revisão da identidade canônica.

## Authority and Scope

Esta especificação é subordinada a:

- `brand/BRAND_FOUNDATION.md`;
- `brand/BRAND_ARCHITECTURE.md`;
- `brand/VISUAL_DIRECTION.md`;
- `brand/COLOR.md`;
- `brand/TYPOGRAPHY.md`;
- `brand/VISUAL_FOUNDATIONS.md`.

Não altera:

- Master Brand;
- Descriptor;
- categoria institucional;
- arquitetura verbal;
- sistema cromático aprovado;
- tipografia aprovada;
- assinatura aprovada;
- tokens canônicos;
- documentos `brand/*.md`.

O escopo é exclusivamente a apresentação da homepage e de seus módulos derivados.

## Approved Initial Content Scope

A primeira implementação será um cartão de visita editorial com um único conceito SaaS em destaque e dois espaços secundários de projeto. O conteúdo é deliberadamente provisório e deve ser identificado na própria interface como ficcional/review-only até ser substituído por produtos e artefatos reais.

```text
Featured:
PROJECT 001 — SAAS CONCEPT

Secondary:
PROJECT 002 — APP CONCEPT
PROJECT 003 — GAME CONCEPT

Content state:
FICTIONAL CONTENT · REVIEW ONLY
```

Não serão exibidos números, métricas, commits, resultados, depoimentos ou CTAs externos fictícios. O único destino funcional inicial da homepage será o Living Brandbook em `/brand/`.

## Objective

Fazer a homepage funcionar como um cartão de visita editorial de um builder independente de produtos digitais, permitindo compreender rapidamente:

1. quem é Leo Ferraz;
2. o que está sendo construído;
3. quais produtos e experimentos existem;
4. quais artefatos e evidências sustentam a narrativa;
5. qual é o próximo caminho de exploração.

## Reference Translation

As características transferíveis da referência são:

- fundo predominantemente escuro;
- headline ampla, direta e editorial;
- navegação mínima;
- fluxo vertical de descoberta;
- catálogo de produtos em sequência;
- etiquetas pequenas para categoria ou estado;
- imagens de artefatos em cards;
- CTAs claros;
- alternância entre baixa e média densidade;
- cor contextual por produto ou projeto.

As características não transferíveis são:

- nome, logo, textos e claims da referência;
- estrutura proprietária de conteúdo;
- métricas não comprovadas;
- identidade baseada em múltiplos neons;
- glow permanente;
- gradientes como linguagem estrutural;
- imagem generativa como requisito da marca;
- qualquer alteração da identidade canônica Leo Ferraz.

## Canonical Signature

O topo da homepage deve usar a assinatura canônica:

```text
Leo Ferraz
Building with AI
```

Quando a categoria institucional for necessária, usar:

```text
AI-Native Product Lab
```

Não criar slogan, tagline ou promessa nova para preencher o hero.

## Proposed Page Architecture

```text
Header
↓
Hero editorial
↓
Product / Project Index
↓
Artifact Cards
↓
Build Evidence
↓
Content / YouTube
↓
Footer institucional
```

### Header

- assinatura Leo Ferraz canônica;
- descriptor em posição secundária;
- navegação curta e funcional;
- nenhum menu decorativo ou camada futurista.

### Hero Editorial

- baixa densidade;
- tipografia grande e direta;
- copy extraída de fontes canônicas aprovadas;
- artefato real como elemento de apoio quando existir;
- CTA somente quando houver destino real.

### Product / Project Index

Cada item deve poder apresentar, quando houver dados verdadeiros:

```text
PROJECT / PRODUCT
CATEGORY
STATE
VERSION
SHORT DESCRIPTION
ARTIFACT
EVIDENCE
CTA
```

Nenhum campo deve ser preenchido com dados fictícios sem identificação explícita.

### Artifact Cards

- o artefato ocupa o papel visual principal;
- screenshots, interfaces, jogos, páginas ou protótipos reais têm prioridade;
- imagem gerada pode complementar, nunca substituir um artefato real disponível;
- cards podem usar raio moderado e borda discreta;
- o card não deve virar um dashboard decorativo.

### Build Evidence

Usar apenas evidências reais ou claramente marcadas como mock/review-only:

- estados de projeto;
- versões;
- commits;
- datas;
- métricas com contexto;
- resultados documentados.

### Content / YouTube

O conteúdo deve aparecer como extensão da construção de produtos, não como identidade de creator genérico. A composição deve privilegiar artefatos, processo e prova.

## Visual Grammar

### Color

- base: `Precision / Product`;
- neutros continuam dominantes;
- `Primary Technology Accent` continua sendo o sinal funcional principal;
- variações cromáticas por produto são contextuais e subordinadas;
- nenhum novo token cromático é criado nesta especificação;
- não usar múltiplos acentos para simular uma estética neon global.

### Typography

- IBM Plex Sans para assinatura, títulos, corpo e UI;
- IBM Plex Mono para estados, categorias, versões, commits e metadados;
- títulos grandes, claros e não futuristas;
- nenhuma fonte sci-fi, glitch, gamer ou pseudo-terminal.

### Structure

- fluxo vertical de leitura;
- alternância de baixa e média densidade;
- blocos de produto recombináveis;
- espaço negativo preservado entre itens;
- grid estrutural discreto;
- bordas e separadores para orientar, não para decorar.

### Controls

- CTA primário com alto contraste;
- CTA secundário com borda discreta;
- etiquetas pequenas para categoria/estado;
- pills não devem dominar a interface;
- sem floating shadows grandes;
- sem glow permanente;
- sem perspective grid ou glassmorphism.

## Responsive Behavior

### Mobile

- uma coluna;
- assinatura e navegação compactas;
- hero com leitura imediata;
- cards de produto empilhados;
- imagens com crops controlados;
- CTA visível sem depender de hover.

### Desktop

- largura de leitura controlada;
- possibilidade de módulos em duas colunas;
- artefato pode ocupar área maior que metadata;
- a ordem de leitura deve continuar evidente sem efeitos.

## Content Governance

O conteúdo da homepage deve ser resolvido nesta ordem:

1. fontes canônicas aprovadas;
2. artefatos reais disponíveis;
3. estados e evidências verificáveis;
4. placeholders explicitamente marcados;
5. lacunas registradas para decisão humana.

Não inventar nomes de produtos, categorias, métricas, depoimentos ou resultados para completar cards.

## Acceptance Criteria

A implementação futura será considerada aderente quando:

- a primeira leitura for Leo Ferraz e construção de produtos, não uma cópia de AIOriented.dev;
- a assinatura canônica estiver correta;
- a homepage funcionar como índice editorial de produtos e artefatos;
- artefatos reais precederem abstrações quando disponíveis;
- o sistema cromático aprovado permanecer íntegro;
- a maior parte da composição permanecer neutra;
- acentos funcionarem como estado ou contexto;
- IBM Plex Sans + IBM Plex Mono permanecerem intactas;
- nenhum slogan ou promessa nova for introduzido;
- a interface funcionar sem glow, gradiente ou imagem generativa;
- crops mobile e desktop forem legíveis;
- nenhum dado fictício puder ser confundido com evidência real;
- nenhuma decisão canônica de `brand/` for alterada.

## Deferred Decisions

Ficam para o plano de implementação, sem decisão nesta especificação:

- inventário final de produtos da homepage;
- ordem editorial definitiva;
- quantidade de cards;
- seleção de artefatos reais;
- mapeamento de estados por produto;
- valores específicos de spacing e radius da homepage;
- comportamento de motion;
- eventual companion visual de comparação.

## Review Gate

Esta especificação está aprovada para a primeira implementação da camada editorial da homepage, preservando a separação entre conteúdo provisório da aplicação e decisões canônicas do Brand System.
