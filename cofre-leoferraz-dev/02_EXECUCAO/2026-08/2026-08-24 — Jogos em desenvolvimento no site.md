---
title: "2026-08-24 — Jogos em desenvolvimento no site"
date: 2026-08-24
document_type: operational-record
status: completed
tags:
  - cofre/execucao
  - tema/site
  - tema/produtos
project: Leo Ferraz
---

# Jogos em desenvolvimento no site

## Decisão

Exibir `Sproutbound — Salto ao Sol` como produto próprio em desenvolvimento na homepage e no laboratório. O card permanece sem link porque o jogo está em revisão de distribuição e ainda não possui destino público oficial aprovado.

## Execução

- Dados centralizados em `src/data/games-in-development.ts`.
- Card reutilizável em `src/components/site/GameCard.astro`.
- Capa versionada em `public/evidence/sproutbound-1280x720.jpg`.
- Seção adicionada à homepage e ao laboratório.
- CTA `Jogar na Plataforma` preparado condicionalmente, mas não renderizado sem `platformUrl`.
- Commits de implementação: `a2a4bb9`, `bc937a2` e `f6d8fa4`.

## Evidência

- `npm run build`: PASS; 6 páginas estáticas geradas.
- `dist/index.html`: nome 1x, status 1x, imagem 1x, CTA 0x.
- `dist/laboratorio/index.html`: nome 1x, status 1x, imagem 1x, CTA 0x.
- `git diff --check HEAD~3..HEAD`: PASS.
- O repositório `D:\LEONARDO\Games\sproutbound` não foi alterado por esta entrega. Artefatos de submissão já existentes e não rastreados foram preservados.

## Pendências

- Aguardar aprovação de distribuição e URL pública oficial.
- Quando existir URL aprovada, atualizar apenas o registro do jogo, validar a página pública e confirmar o botão `Jogar na Plataforma`.
