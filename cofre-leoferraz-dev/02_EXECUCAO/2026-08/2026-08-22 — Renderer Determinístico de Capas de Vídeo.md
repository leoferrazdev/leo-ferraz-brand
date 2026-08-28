---
title: Renderer Determinístico de Capas de Vídeo
document_type: asset_generation
date: 2026-08-22
tags:
  - leo-ferraz
  - cofre/execucao
  - tema/marca-ativos
  - projeto/leo-ferraz-dev
  - capas-de-video
  - automacao
  - renderer
status: implemented
related:
  - "[[DECISAO-024 - Pack Mestre Reutilizavel de Capas de Video]]"
---

# Renderer Determinístico de Capas de Vídeo

## Decisão

A etapa de renderer da [[DECISAO-024 - Pack Mestre Reutilizavel de Capas de Video]] usa os valores aprovados para horizontal (1280×720) e vertical (1080×1920), sem gradientes, filtros ou fade sobre o retrato.

## Execução

`renderCoverSvg` passou a validar a entrada, ajustar a headline dentro dos limites definidos, converter IBM Plex Sans 700 em outlines SVG e compor, nesta ordem: fundo, grade, retrato PNG com alfa, símbolo Constructed LF, badge e headline.

Os testes agora conferem os quatro objetos integrais do manifesto, a paleta, o símbolo, a ausência dos tratamentos proibidos e as zonas seguras verticais.

## Evidência

- teste: `node --test tests/video-cover-pack.test.mjs` — 4/4 aprovados;
- commit local: `e7fb0d2 feat: render canonical horizontal and vertical covers`;
- base preservada: `7e35509 brand: rebuild the day-1 live cover in the cutout standard`.

## Pendências

- implementar a geração do pack e os arquivos de saída em tarefa posterior;
- adicionar `fontkitten` diretamente em `package.json` quando o Task 3 autorizar essa alteração;
- nenhuma publicação, upload ou deploy foi feito nesta etapa.
