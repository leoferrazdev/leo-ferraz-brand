---
title: Aprovação do Reference Pattern de Thumbnails
document_type: approval_record
date: 2026-08-23
tags:
  - leo-ferraz
  - cofre/execucao
  - tema/marca-ativos
  - projeto/leo-ferraz-dev
  - thumbnails
  - brand
  - aprovação
status: approved
---

# Aprovação do Reference Pattern de Thumbnails

## Decisão

O fundador aprovou o **Reference Pattern / Photo-Integrated Thumbnail v1.1.0** como padrão operacional para as thumbnails do projeto Leo Ferraz.

## Regra aprovada

- fundo `#0D1117` com grid estrutural;
- headline dominante à esquerda;
- fotografia ampliada na faixa direita, em sangria;
- fade horizontal controlado para integrar foto e fundo;
- IBM Plex Sans e IBM Plex Mono preservadas;
- `#4DA3FF` como acento funcional/editorial;
- `#E5484D` reservado ao estado `AO VIVO`;
- barra inferior azul de 8px na aplicação horizontal aprovada;
- sem glow, gradiente decorativo ou tratamento futurista.

## Aplicações vigentes

- primeiro vídeo: `AQUI ESTÁ / O PORQUÊ.`;
- live Dia 1: `CONSTRUINDO / PRODUTOS REAIS COM IA`;
- caminhos canônicos permanecem em `brand-assets/exports/day-1/05-youtube/`;
- versões organizadas permanecem em `brand-assets/exports/day-1/05-youtube/versions/v1-reference-pattern/`.

## Fonte canônica

`brand/PADRAO-CAPAS.md` foi atualizado para remover a ambiguidade com a direção anterior de recorte sem fundo. Os renderizadores e exports atuais devem seguir a regra aprovada.

## Evidência

- `npm run brand-assets:validate`: PASS;
- `npm run build`: PASS;
- a aplicação atual foi publicada no commit `0d74b24`;
- nenhuma nova copy, cor, tipografia ou decisão estratégica foi introduzida além da promoção explícita do padrão aprovado.

## Pendências

A adaptação vertical ainda deve ser gerada quando houver necessidade de publicação vertical, preservando a mesma lógica estrutural e as zonas seguras específicas da plataforma.
