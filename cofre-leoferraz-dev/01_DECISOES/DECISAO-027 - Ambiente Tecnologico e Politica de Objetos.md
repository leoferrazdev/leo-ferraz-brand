---
title: "Decisão 027 — Ambiente Tecnológico e Política de Objetos"
document_type: decision
decision_id: DECISAO-027
status: approved
implementation_status: documented
external_test_status: pending
authority: Leo Ferraz
date: 2026-09-02
project: Leo Ferraz
tags:
  - cofre/decisoes
  - tema/conteudo
  - tema/identidade-founder
  - projeto/leo-ferraz-dev
related:
  - "[[DECISAO-026 - Fonte de Identidade Separada da Cena e do Movimento]]"
  - "[[../03_CONTEUDO/PROMPT-002 - Léo Digital Cenas Originais]]"
  - "[[../03_CONTEUDO/GUIA-002 - Léo Digital Cenas Originais Handoff Externo]]"
  - "[[../02_EXECUCAO/2026-09/2026-09-02 — Revisão do Prompt-base e das Cenas Originais]]"
---

# Decisão 027 — Ambiente Tecnológico e Política de Objetos

## Contexto

O fundador identificou dois padrões de falha recorrentes na geração externa das cenas originais: a interpretação de “laboratório escuro e preciso” como ambiente científico, incompatível com o trabalho de desenvolvimento de negócios e software do Léo; e a instabilidade temporal de folhas, cartões e outros objetos finos quando solicitados como elementos manipuláveis.

## Evidência

- O prompt-base anterior dizia para gerar uma cena original, mas também ordenava preservar “mesa, teclado, monitores, iluminação e cenário”.
- A expressão “laboratório escuro e preciso” não descreve adequadamente o contexto profissional do Léo.
- O fundador relatou deformações, transições e aparência sintética recorrentes em folhas e cartões posicionados, segurados ou colocados diante da câmera.
- Não há arquivo externo disponível neste workspace para QA audiovisual quadro a quadro; a decisão operacional usa o padrão observado no processo externo e o conteúdo dos prompts.

## Decisão

O prompt-base operacional v2 deve:

1. preservar identidade facial, roupa e expressão do Léo;
2. preservar somente a linguagem visual tecnológica — atmosfera escura, luz fria controlada e estação de trabalho real — sem preservar cenário, composição ou configuração de luz específicos;
3. descrever escritório ou estúdio de desenvolvimento de produto digital e software, nunca laboratório científico como padrão;
4. exigir nova disposição de ambiente, câmera, iluminação, composição e ação em cada peça;
5. proibir folhas, cartões, papéis, documentos, placas, quadros e outros objetos finos como elementos manipuláveis;
6. priorizar ações estáveis de olhar, pausa, postura, mãos apoiadas e movimento discreto de câmera.

Se um objeto for indispensável, ele deve estar rígido, estacionário e já presente no ambiente, sem ser segurado, reposicionado ou colocado diante da câmera.

## Impacto

- O universo visual passa a comunicar tecnologia aplicada, produto digital, software e negócios.
- A geração deixa de depender de objetos frágeis para sustentar a narrativa visual.
- As peças continuam podendo variar em enquadramento, ambiente e movimento sem perder a identidade do Léo.
- A mudança não comprova ainda a qualidade do resultado externo; cada peça continua dependente de geração e QA audiovisual.

## Estado da execução

- `PROMPT-002`: prompt-base v2 e instruções afetadas atualizados;
- `GUIA-002`: regra de handoff e checklist atualizados;
- geração externa com o v2: pendente;
- arquivo externo e QA audiovisual direto: pendentes;
- publicação: não autorizada nesta etapa.

## Pendências

- gerar uma peça controlada com o prompt-base v2;
- verificar se o ambiente é tecnológico sem parecer científico;
- verificar ausência de deformação de objetos finos;
- registrar plataforma, modelo, custo, arquivo e QA antes de expandir o teste.
