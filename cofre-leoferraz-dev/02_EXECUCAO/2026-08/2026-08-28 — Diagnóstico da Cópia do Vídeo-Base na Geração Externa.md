---
title: "Diagnóstico da Cópia do Vídeo-Base na Geração Externa"
document_type: execution_record
status: approved
authority: Leo Ferraz
date: 2026-08-28
project: Leo Ferraz
tags:
  - cofre/execucao
  - tema/conteudo
  - tema/identidade-founder
  - projeto/leo-ferraz-dev
evidence: "Duas screenshots da operação externa; a primeira operação reproduziu a cena e o movimento do vídeo 08, e o fundador relata que o prompt-base revisado gerou corretamente a versão 01 — Demonstração."
next_action: "Usar o prompt-base comprovado na próxima variação e registrar o arquivo externo para QA direto."
validation_status: ready_for_external_test
related:
  - "[[../../01_DECISOES/DECISAO-026 - Fonte de Identidade Separada da Cena e do Movimento]]"
  - "[[../../03_CONTEUDO/PROMPT-001 - Léo Digital Série 001]]"
  - "docs/superpowers/specs/2026-08-28-leo-digital-original-scene-motion-generation-design.md"
  - "C:\\WINDOWS\\TEMP\\codex-clipboard-6572ff49-2b6c-4eb0-9995-9e17630b476d.png"
  - "C:\\WINDOWS\\TEMP\\codex-clipboard-d9ed2e04-37b8-4fe7-9a1f-b98aec8d3276.png"
---

# Diagnóstico da Cópia do Vídeo-Base na Geração Externa

## Decisão

O resultado observado é explicado pelo fluxo escolhido: `Face Swap Video Variations` recebeu o vídeo 08 como referência principal e recebeu instruções extensas para preservar sua cena e seu movimento. Para a próxima tentativa, a identidade virá das fotos autorizadas e a cena/movimento virão de um prompt original.

## Evidência direta

### Screenshot 1

- O título do fluxo é `Face Swap Video Variations`.
- O texto pede uso do vídeo-base para duração, movimento de câmera, enquadramento e ação.
- O texto pede preservação de rosto, olhos, cabelo, barba, rugas, roupa, mesa, teclado, monitores, iluminação, cenário e ritmo.
- O prompt da peça pede preservação da progressão de trabalho, aproximações e fechamento com gesto de aprovação.
- Há um thumbnail de vídeo anexado. A imagem não permite confirmar a seleção efetiva das fotos de identidade nessa mesma operação.

### Screenshot 2

- A operação foi colocada em fila.
- O preview visível conserva a composição de trabalho no laptop e não demonstra uma nova cena ou uma nova coreografia visual.

### Evidência adicional fornecida pelo fundador

- O fundador forneceu o texto exato do prompt-base usado no fluxo que gerou corretamente, segundo seu relato, a versão 01 — Demonstração.
- O prompt preserva as âncoras visuais `rosto, formato dos olhos, cor dos olhos, cabelo, barba, rugas, proporções, expressão natural, moletom, mesa, teclado, monitores, iluminação e cenário`, ao mesmo tempo em que proíbe copiar enquadramento, trajetória de câmera, cenário como composição exata ou sequência de ação de vídeos anteriores.
- O prompt-base foi incorporado literalmente ao [[../../03_CONTEUDO/PROMPT-002 - Léo Digital Cenas Originais]].
- O arquivo da versão 01 não está no workspace; a correção foi registrada como evidência relatada, não como QA audiovisual direto.

## Causa-raiz

As entradas não tinham papéis separados. O vídeo-base era simultaneamente a fonte de duração, câmera, enquadramento, ação, cenário e ritmo. O pedido de substituição se restringia à identidade da pessoa. O modelo executou uma variação de face swap, não uma criação de cena.

## Correção arquitetural aprovada

- não anexar o vídeo 08 no teste de cena original;
- anexar as fotos reais autorizadas como referência de identidade;
- selecionar modo de geração que permita `image-to-video` ou `text-to-video` com cena original;
- preservar as âncoras visuais do Léo sem copiar a composição, o enquadramento, a câmera ou a sequência de ação;
- descrever no prompt cenário, enquadramento, câmera, ação, expressão e ritmo novos;
- montar as duas headlines depois, fora da geração visual;
- rejeitar resultado que replique o vídeo 08, mesmo com rosto correto.

## Estado documental após aprovação

- `PROMPT-002 - Léo Digital Cenas Originais` foi criado com prompt-base e dez cenas originais;
- `GUIA-002 - Léo Digital Cenas Originais Handoff Externo` foi criado com procedimento, ficha de operação e regra de parada;
- `PROMPT-001` e `GUIA-001` continuam delimitados ao fluxo que preserva uma cena existente;
- o pacote local está `ready_for_external_test`;
- a versão 01 — Demonstração foi gerada externamente e relatada como correta pelo fundador;
- o arquivo da versão 01 não foi devolvido ao workspace;
- QA audiovisual direto, montagem e publicação não foram realizados.

## Estado

- [x] diagnóstico da cópia realizado;
- [x] causa-raiz registrada;
- [x] decisão operacional registrada em [[DECISAO-026 - Fonte de Identidade Separada da Cena e do Movimento]];
- [x] especificação de nova arquitetura criada;
- [x] especificação escrita revisada pelo fundador;
- [x] `PROMPT-002` criado;
- [x] `GUIA-002` criado;
- [x] pacote local pronto para teste externo;
- [x] peça 01 gerada externamente segundo relato do fundador;
- [ ] arquivo da peça 01 disponível no workspace para QA direto;
- [ ] QA facial, de cena e de movimento realizado;
- [ ] qualquer publicação realizada.

## Limite da evidência

As screenshots comprovam o modo de operação e o preview observado, mas não comprovam o funcionamento de outros modos da plataforma, a replicabilidade para outras pessoas, o custo atual ou qualquer efeito de distribuição no Instagram. Esses pontos continuam dependentes de teste e registro específico.

## Validação documental local — 2026-08-28

- `git diff --check`: aprovado;
- links não resolvidos no cofre: `0`;
- notas órfãs no cofre: `0`;
- `PROMPT-002` e `GUIA-002`: prontos para teste externo, sem vídeo-base como entrada;
- vídeo externo, QA audiovisual, montagem e publicação: não realizados.
