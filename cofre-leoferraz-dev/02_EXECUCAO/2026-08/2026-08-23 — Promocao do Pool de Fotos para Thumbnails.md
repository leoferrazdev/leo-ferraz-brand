---
title: Promoção do Pool de Fotos para Thumbnails
document_type: approval_record
date: 2026-08-23
tags:
  - leo-ferraz
  - cofre/execucao
  - tema/marca-ativos
  - tema/identidade-founder
  - projeto/leo-ferraz-dev
  - thumbnails
  - assets
  - brand
status: implemented
---

# Promoção do Pool de Fotos para Thumbnails

## Decisão

As seis fotos recortadas em `brand-assets/profile/leo-ferraz/` foram promovidas explicitamente a fontes aprovadas para novas thumbnails. A promoção não substitui a composição publicada no `v1-reference-pattern` e não muda silenciosamente a thumbnail operacional.

## Execução

Foi criado o pack determinístico `v2-approved-founder-cutouts`, com três variações para o primeiro vídeo e três para a live Dia 1:

- fonte persistente: `brand-assets/thumbnails/versions/v2-approved-founder-cutouts/`;
- espelho de entrega: `brand-assets/exports/day-1/05-youtube/versions/v2-approved-founder-cutouts/`;
- renderer: `scripts/build-approved-thumbnail-variants.mjs`;
- comando: `npm run thumbnails:approved:build`.

As composições preservam o padrão Reference Pattern: fundo `#0D1117`, grid estrutural, headline à esquerda, retrato ampliado à direita, IBM Plex Sans/Mono, safe zone e barra inferior azul de 8px. No pack v2, a foto é exibida sem fade, sombra ou escurecimento.

## Correção posterior

Após revisão visual, o pack foi corrigido para:

- remover fade, sombra e escurecimento entre foto e headline;
- manter o grid uniforme e visível;
- usar `leo-ferraz-cutout-present-left.png` quando o gesto deve apontar para a headline;
- preservar a foto completa quando a pose contém gesto, sem cortar a mão na variante histórica;
- restaurar a escala editorial dominante sem sacrificar a integridade da foto;
- manter a regra de aplicação da variante histórica `present-left` separada da nova derivação sem gesto manual;
- substituir a variante com direção inadequada por `smile-three-quarter` na live.

## Correção de escala — 2026-08-24

A revisão mais recente identificou que a foto do fundador havia sido reduzida em relação ao padrão aprovado. O renderer foi ajustado para recuperar a presença dominante do retrato: as poses frontais ocupam a altura completa da thumbnail, enquanto `present-left` recebe uma faixa mais larga para conservar o gesto inteiro. Permanecem proibidos fade, sombra, escurecimento e máscara de transição; o grid continua uniforme e visível.

## Ajuste de enquadramento — 2026-08-24

As marcações visuais foram interpretadas como necessidade de ocupar melhor a área inferior do retrato frontal e afastar a mão da headline na pose de apresentação. As poses frontais passaram para uma faixa de 760px; `present-left` passou para uma faixa de 700px deslocada à direita, mantendo a escala vertical e o gesto completo sem cobrir o texto.

## Ajuste de silhueta e gesto — 2026-08-24

Foram criadas duas fontes derivadas, sem sobrescrever os cutouts aprovados originais:

- `brand-assets/profile/leo-ferraz/thumbnail-derived/leo-ferraz-cutout-front-shoulder-extended.png`: continuação natural do ombro e da camiseta preta na base esquerda do retrato frontal;
- `brand-assets/profile/leo-ferraz/thumbnail-derived/leo-ferraz-cutout-present-left-no-hand.png`: remoção da mão e do antebraço, com reconstrução da camiseta e do torso para deixar somente o corpo do fundador.

As fontes derivadas foram processadas com alpha real, aplicadas no renderer e regeneradas no pack persistente e no espelho de entrega. O padrão aprovado de escala foi mantido: faixa de 760px, sem efeitos entre retrato e headline, com grid visível e uniforme.

## Ajuste posterior de contorno — 2026-08-24

A revisão seguinte marcou a extremidade direita do recorte `present-left`. A fonte derivada foi regenerada para continuar o ombro e o torso da camiseta preta até a borda útil da composição, mantendo a mão e o antebraço ausentes. O renderer e os dois destinos do pack foram regenerados novamente; os cutouts canônicos originais permanecem preservados.

## Regra canônica de integridade fotográfica — 2026-08-25

Nenhuma aplicação de thumbnail pode cortar a fotografia do fundador. O renderer passou a usar `fit: contain` para todas as poses, mantendo visíveis os limites alfa completos de ombro, braço, cabeça e mãos. O enquadramento deve ser resolvido por escala e posicionamento dentro da faixa fotográfica; áreas restantes permanecem como fundo/grid, sem mascarar ou reconstruir partes do corpo.

## Evidência

- `npm run thumbnails:approved:build`: PASS — 6 variações geradas;
- `npm run brand-assets:build`: PASS — 78 assets gerados;
- `npm run brand-assets:validate`: PASS — 78 assets validados;
- regeneração corretiva do pack: PASS — foto completa e grid uniforme;
- regeneração corretiva de escala: PASS — retrato dominante restaurado e gesto de `present-left` preservado;
- ajuste de silhueta: PASS — ombro frontal continuado e mão/braço removidos da nova variante de apresentação;
- alpha das fontes derivadas: PASS — PNG RGBA com transparência real, sem checkerboard incorporado;
- integridade fotográfica: PASS — seis variantes regeneradas com `fit: contain`, sem crop geométrico da fonte;
- nenhuma fonte PNG foi alterada ou promovida sem canal alfa;
- `brand/PADRAO-CAPAS.md` registra a fonte aprovada, o pack v2 e a separação entre v1 publicado e v2 de variações.

## Pendências

Nenhuma pendência técnica para a promoção do pool. A escolha de uma variante específica para substituir a composição publicada continua sendo uma decisão de publicação separada.

## Relações

- [[2026-08-22 — Pack de Recortes do Founder para Thumbnails]]
- [[2026-08-23 — Aprovacao do Reference Pattern de Thumbnails]]
