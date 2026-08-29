---
title: "Decisão 026 — Fonte de Identidade Separada da Cena e do Movimento"
document_type: decision
decision_id: DECISAO-026
status: approved
implementation_status: documented
external_test_status: piece_01_reported_correct_unverified
authority: Leo Ferraz
date: 2026-08-28
project: Leo Ferraz
tags:
  - cofre/decisoes
  - tema/conteudo
  - tema/identidade-founder
  - projeto/leo-ferraz-dev
related:
  - "[[DECISAO-016 - Sistema de Formatos de Vídeo]]"
  - "[[../02_EXECUCAO/2026-08/2026-08-28 — Diagnóstico da Cópia do Vídeo-Base na Geração Externa]]"
  - "[[../03_CONTEUDO/PROMPT-001 - Léo Digital Série 001]]"
  - "docs/superpowers/specs/2026-08-28-leo-digital-original-scene-motion-generation-design.md"
---

# Decisão 026 — Fonte de Identidade Separada da Cena e do Movimento

## Contexto

O teste da peça 01 utilizou o fluxo externo `Face Swap Video Variations` com o vídeo 08 como referência e entregou um resultado praticamente igual ao vídeo anexado. A intenção aprovada para a próxima etapa é mudar a cena e o movimento, preservando a aparência do Léo Ferraz.

## Evidência

- O prompt-base ordenava preservar duração, câmera, enquadramento, ação, cenário, iluminação, ritmo e progressão do vídeo-base.
- O prompt adicional da peça 01 ordenava preservar as aproximações e o fechamento com gesto de aprovação.
- A segunda captura mostra um preview que mantém a cena de trabalho no laptop do vídeo de referência.
- O fundador forneceu posteriormente o prompt-base exato que, segundo seu relato, gerou corretamente a versão 01 — Demonstração. O arquivo ainda não está disponível no workspace para QA audiovisual direto.
- A primeira captura mostra o fluxo de face swap/video variation e um thumbnail de vídeo anexado; não há evidência visual suficiente para confirmar que as fotos foram selecionadas como entrada de identidade naquela operação.

## Diagnóstico

O resultado não contradiz o pedido enviado. A arquitetura selecionada fazia o vídeo-base comandar cena e movimento e restringia a alteração à identidade visual. Portanto, a causa-raiz é a escolha do modo de geração e do contrato de entrada, não a falta de uma frase adicional no prompt.

## Decisão

Para cenas e movimentos originais, usar fotos reais autorizadas como referência de identidade e gerar a cena a partir de um prompt próprio em modo `image-to-video` ou `text-to-video` equivalente. Não anexar o vídeo 08 como fonte primária nesse teste.

O `Face Swap Video Variations` permanece reservado para operações em que a preservação deliberada da cena original seja o objetivo. O `PROMPT-001` não será sobrescrito. A nova arquitetura foi operacionalizada documentalmente em `PROMPT-002` e `GUIA-002`, usando como base o prompt fornecido pelo fundador. A peça 01 foi relatada como correta, mas a validação audiovisual direta permanece pendente.

## Impacto

- A geração externa passa a ter dois contratos distintos: variação de cena existente e criação de cena original.
- Uma ferramenta que só copie o vídeo-base não será usada para validar a hipótese de cena original.
- O Léo Digital continua sendo uma camada visual para Reels silenciosos; headlines, legenda e CTA permanecem fora do prompt visual.
- O primeiro teste controlado será a peça 01, com uma única variação, antes de expandir para as dez peças.

## Estado da execução documental

- `PROMPT-002`: criado, em revisão, com dez direções de cena originais;
- `GUIA-002`: criado, em revisão, com regra de parada para modo incompatível;
- teste externo da peça 01: realizado e relatado como correto;
- arquivo da peça 01 no workspace e QA audiovisual direto: pendentes;
- arquivo externo, QA, montagem e publicação: pendentes.

## Pendências

- confirmar na plataforma externa qual modo aceita fotos como identidade sem vídeo-base;
- gerar a peça 01 externamente e registrar custo, modelo, arquivo e QA;
- não declarar a arquitetura validada antes de comparar o resultado com o vídeo 08.
