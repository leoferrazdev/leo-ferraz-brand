---
title: Aplicacao do Padrao de Referencia nas Thumbnails
document_type: asset_generation
date: 2026-08-23
tags:
  - leo-ferraz
  - cofre/execucao
  - tema/marca-ativos
  - projeto/leo-ferraz-dev
  - execucao
  - youtube
  - thumbnail
  - referencia-visual
status: implemented
---

# Aplicação do Padrão de Referência nas Thumbnails

## Decisão

Aplicar nas peças do primeiro vídeo e da live do Dia 1 a composição visual apresentada pelo fundador:

- painel textual à esquerda;
- retrato dominante à direita;
- grid técnico sobre fundo escuro;
- headline grande em IBM Plex Sans;
- acento azul funcional;
- selo vermelho apenas na live;
- barra azul inferior;
- transição escura entre o texto e a fotografia.

Esta execução altera os assets solicitados, sem reescrever o documento canônico `brand/PADRAO-CAPAS.md`.

## Execução

### Primeiro vídeo

`videos/v2/youtube-horizontal/thumb_v2.png` e `.jpg` já correspondiam visualmente à segunda referência. O gerador `scripts/build-thumbnail-v2.mjs` foi executado novamente e produziu o mesmo resultado determinístico; nenhum diff foi gerado nesses arquivos.

### Live — Dia 1

`brand-assets/thumbnails/live_1.png` e `.jpg` foram regenerados pelo padrão fotográfico da primeira referência, usando `brand-assets/thumbnails/src/foto.jpg`.

O alias histórico `live_4` foi mantido byte a byte idêntico ao `live_1`. `live_2` e `live_3` não foram alterados.

O gerador `scripts/build-live-covers.mjs` passou a aceitar seleção explícita de variantes por argumento e a manter `live_1` e `live_4` na mesma composição.

## Evidência

O build da live reportou os textos dentro da coluna segura de 648px:

```text
live_1: largura do texto 637px / limite 648px
live_4: largura do texto 637px / limite 648px
```

Os arquivos da live permanecem em 1280×720 e são byte a byte idênticos entre os dois aliases:

```text
live_1.png / live_4.png
SHA256: 42A567891E95B816BF5D901312F87546B4D28A424699333D6AD64374F01C7CA0

live_1.jpg / live_4.jpg
SHA256: 7F6542E2F39EB2CF6FDB2D64A6A2010901C1D0220331B9E7D0C46E3D896F2E47
```

## Validação

- primeiro vídeo: padrão revalidado, sem alteração binária;
- live Dia 1: padrão fotográfico aplicado;
- tipografia: IBM Plex Sans preservada;
- live `live_1` e alias `live_4`: sincronizados;
- `live_2` e `live_3`: preservados;
- nenhuma nova decisão verbal ou estratégica introduzida;
- nenhuma publicação externa ou deploy realizado nesta execução.

## Relações

- [[2026-08-22 — Regeneracao da Thumbnail da Live Dia 1]]
- [[DECISAO-024 - Pack Mestre Reutilizavel de Capas de Video]]
- [[2026-08-20 — Capas de Live]]
