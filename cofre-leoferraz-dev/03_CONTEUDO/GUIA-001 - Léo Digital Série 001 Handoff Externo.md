---
title: "Léo Digital — Handoff para geração externa"
document_type: external_handoff
status: draft
date: 2026-08-28
project: Leo Ferraz
tags:
  - cofre/conteudo
  - tema/conteudo
  - tema/identidade-founder
  - projeto/leo-ferraz-dev
evidence: "Handoff definido a partir da operação externa observada nas screenshots e dos requisitos de preservação da identidade."
next_action: "Usar somente quando a intenção for preservar deliberadamente a cena do vídeo-base; para cena original, seguir GUIA-002."
related:
  - "[[PROMPT-001 - Léo Digital Série 001]]"
  - "[[GUIA-002 - Léo Digital Cenas Originais Handoff Externo]]"
  - "[[../02_EXECUCAO/2026-08/2026-08-28 — Manifesto dos Ativos do Léo Digital]]"
---

# Léo Digital — Handoff para geração externa

> [!warning] Escopo deste guia
> Este guia serve somente para a modalidade em que a cena e o movimento do vídeo-base devem ser preservados. Para criar cena e movimento originais com identidade baseada em fotos, usar [[GUIA-002 - Léo Digital Cenas Originais Handoff Externo]] e [[PROMPT-002 - Léo Digital Cenas Originais]].

## Limite

A geração dos vídeos ocorre em uma plataforma externa. Este arquivo organiza os anexos, prompts, custos e arquivos devolvidos. Não registrar uma peça como gerada antes de o arquivo existir fora da plataforma e ser devolvido para revisão.

## Preparação por peça

1. abrir a função de face swap/video variation da plataforma externa;
2. anexar o vídeo-base exato indicado no [[../02_EXECUCAO/2026-08/2026-08-28 — Manifesto dos Ativos do Léo Digital]];
3. anexar o conjunto autorizado de fotos reais do Léo Ferraz, com ângulos frontal, 3/4 e perfil quando disponíveis;
4. colar o prompt-base e o prompt adicional da peça em [[PROMPT-001 - Léo Digital Série 001]];
5. confirmar que o prompt não pede texto, voz, lip-sync ou resultado comercial;
6. confirmar o custo atual em créditos antes de aprovar a geração;
7. gerar uma versão por peça e salvar o resultado com o nome de peça e versão;
8. registrar falhas, fila, custo e modelo utilizado antes de iniciar nova tentativa.

## Evidência da operação inicial

As screenshots fornecidas mostram uma operação de `Face Swap Video Variations`, com vídeo-base, fotos de referência, geração cobrada em créditos e fila de processamento. A interface também identifica `Omni 1.1 Flash` naquele teste. Esses dados descrevem a operação observada, mas custo, disponibilidade, modelo e comportamento da plataforma podem mudar e devem ser confirmados em cada nova geração.

## Nomenclatura de devolução

Usar:

```text
reel-01-demo-v01.mp4
reel-02-transparencia-v01.mp4
reel-03-bastidor-v01.mp4
reel-04-dor-v01.mp4
reel-05-gargalo-v01.mp4
reel-06-formato-v01.mp4
reel-07-estrategia-v01.mp4
reel-08-aplicacao-v01.mp4
reel-09-pesquisa-v01.mp4
reel-10-convite-piloto-v01.mp4
```

Para as peças 01 e 10, a segunda geração opcional será identificada como:

```text
reel-01-demo-v02.mp4
reel-10-convite-piloto-v02.mp4
```

## Informações que devem acompanhar cada arquivo

- peça e versão;
- vídeo-base utilizado;
- conjunto de fotos utilizado;
- modelo ou modo da plataforma;
- data e hora da geração;
- custo em créditos;
- erro ou observação da plataforma;
- se o arquivo contém marca d'água;
- se o arquivo contém áudio técnico;
- se o arquivo contém qualquer texto ou elemento não solicitado.

## Não fazer

- não enviar screenshots como substitutas das fotos reais de referência;
- não pedir ao modelo para escrever as headlines;
- não aceitar texto gerado pela plataforma como copy final;
- não sobrescrever os vídeos-base;
- não gerar cliente, produto, contrato, dinheiro, receita, depoimento ou resultado;
- não iniciar tentativas adicionais sem registrar o custo da anterior;
- não publicar o resultado externo sem QA da aparência, movimento, copy e legenda.

## Critério de devolução para QA

O arquivo só está pronto para revisão quando abrir fora da plataforma, tiver nome de peça e versão, e vier acompanhado dos dados de operação acima. Se a plataforma não conseguir gerar uma peça, registrar `não gerado` com o motivo e não substituir o resultado por uma afirmação de sucesso.
