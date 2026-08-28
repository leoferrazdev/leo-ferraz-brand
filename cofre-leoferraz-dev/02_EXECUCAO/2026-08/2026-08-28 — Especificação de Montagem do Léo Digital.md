---
title: "Léo Digital — Especificação de montagem da Série 001"
document_type: render_spec
status: draft
date: 2026-08-28
project: Leo Ferraz
tags:
  - cofre/execucao
  - tema/conteudo
  - tema/marca-ativos
  - projeto/leo-ferraz-dev
evidence: "Especificação derivada do formato aprovado de duas headlines, safe zones e regras visuais canônicas consultadas em 2026-08-28."
next_action: "Aplicar a montagem determinística somente após o retorno dos vídeos gerados externamente."
related:
  - "[[../../03_CONTEUDO/COPY-001 - Léo Digital Série 001]]"
  - "[[../../03_CONTEUDO/PROMPT-001 - Léo Digital Série 001]]"
  - "[[2026-08-28 — Manifesto dos Ativos do Léo Digital]]"
---

# Léo Digital — Especificação de montagem da Série 001

## Limite de responsabilidade

Este documento não gera vídeos. A plataforma externa gera somente a camada visual em movimento. A copy, a sequência de headlines e as instruções de montagem são preparadas neste repositório para aplicação posterior em editor determinístico ou no fluxo externo que o responsável escolher.

## Formato final esperado

- canvas final: 1080×1920;
- proporção: 9:16;
- duração: entre 6 e 10 segundos;
- headline principal em PT-BR;
- headline de transição em PT-BR;
- uma legenda correspondente;
- um CTA correspondente;
- áudio apenas como apoio, nunca como dependência da mensagem;
- sem fala sintética e sem lip-sync artificial.

## Sequência de duas headlines

```text
0,00–2,50 s: headline principal isolada; o vídeo pode iniciar sem texto por um instante curto se isso preservar a leitura.
2,50–8,00 s: headline de transição aparece e aponta para a legenda; manter a primeira somente se não reduzir a legibilidade.
8,00–10,00 s: preservar o encerramento visual sem inserir terceira mensagem.
```

O timing de 2,50 segundos é uma hipótese inicial. Para as peças 01 e 10, testar também a entrada em 3,00 segundos quando os vídeos retornarem da plataforma externa.

## Sistema visual

- usar a direção `Dark Product Lab` como referência;
- preservar a pessoa, o moletom, o cenário, as telas e o movimento do vídeo-base;
- usar composição escura, precisa e contida;
- aplicar IBM Plex Sans para texto editorial e IBM Plex Mono somente quando houver função técnica clara;
- usar contraste alto e quebra de linha curta;
- usar neutro escuro e azul de precisão apenas quando necessário;
- não adicionar glow decorativo, gradiente, molduras de outro perfil, emojis, avatar, nome de usuário, ícones ou elementos da interface do Instagram;
- não cobrir olhos, boca, mãos, teclado, monitor ou qualquer evidência relevante do plano;
- respeitar safe zone de 10% nas laterais e 12% no topo e no rodapé;
- não reproduzir literalmente as caixas pretas e brancas das screenshots; elas são referência de mecânica, não de identidade visual.

## Copy determinística

As headlines devem ser aplicadas como overlay determinístico a partir do `editorial-package.md`. A plataforma de geração visual não deve desenhar, reescrever ou traduzir texto. Não aceitar texto gerado com erros, caracteres trocados, logos inventados ou CTA deformado.

## Checklist de montagem posterior

- headline principal está sozinha no período inicial;
- headline de transição só aparece depois do período inicial;
- a segunda headline aponta para a legenda sem tentar explicar tudo no vídeo;
- o texto continua legível em tela de celular;
- o texto não fica sob os elementos do Instagram;
- o vídeo não introduz fala, voz, boca dessincronizada ou terceira mensagem;
- a copy do vídeo corresponde exatamente à legenda e ao CTA registrados;
- a pessoa permanece reconhecível e sem artefatos que alterem o sentido;
- a composição mantém a estética de contenção e evidência da marca.
