---
title: Organização das Versões de Thumbnails
document_type: operational_record
date: 2026-08-23
tags:
  - leo-ferraz
  - cofre/execucao
  - tema/marca-ativos
  - projeto/leo-ferraz-dev
  - thumbnails
  - assets
  - execução
status: implemented
---

# Organização das Versões de Thumbnails

## Decisão

As novas versões do primeiro vídeo e da live do Dia 1 foram organizadas em pastas sem remover os caminhos canônicos existentes. A separação por finalidade torna a comparação local mais direta e preserva compatibilidade com o site, os exports e os scripts atuais.

## Estrutura

```text
brand-assets/exports/day-1/05-youtube/versions/v1-reference-pattern/
├── first-video/
│   ├── youtube-thumbnail-1280x720.png
│   └── youtube-thumbnail-master-3840x2160.png
├── live-day-1/
│   └── live-001-youtube-thumbnail-1280x720.png
└── README.md
```

## Execução

- as cópias foram criadas a partir dos exports canônicos já corrigidos;
- nenhum arquivo anterior foi movido ou apagado;
- o índice da nova pasta documenta a regra de sincronização;
- os caminhos originais continuam sendo os caminhos operacionais para publicação;
- a organização não altera copy, tipografia, composição ou decisão de marca.

## Evidência

As cópias devem permanecer byte a byte idênticas aos arquivos canônicos correspondentes:

- primeiro vídeo 1280×720: `videos/v2/youtube-horizontal/thumb_v2.png` → `youtube-thumbnail-1280x720.png`;
- primeiro vídeo master 3840×2160: export canônico → cópia em `first-video/`;
- live Dia 1 1280×720: `brand-assets/thumbnails/live_1.png` → `live-001-youtube-thumbnail-1280x720.png`.

Validação executada após a organização:

- `npm run brand-assets:validate`: PASS — 78 assets;
- `npm run build`: PASS — 6 páginas estáticas geradas em `dist/`;
- as três cópias organizadas permaneceram presentes após o build e seus SHA-256 coincidiram com os exports canônicos;
- o build passou a recriar a pasta `versions/v1-reference-pattern/` após a limpeza normal dos exports, evitando que a organização desapareça em uma futura regeneração;
- os thumbnails de referência usam sangria visual intencional; o manifesto registra `pixel_safe_zone_audit: foreground-copy-only` para separar a safe zone do conteúdo textual do fundo/foto em full bleed.

## Pendências

Nenhuma pendência funcional. A comparação visual humana continua permitida; qualquer nova alteração deve atualizar o export canônico e a cópia organizada na mesma tarefa.
