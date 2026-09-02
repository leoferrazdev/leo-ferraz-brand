---
title: "Léo Digital — Prompts de Cenas Originais"
document_type: external_generation_prompts
status: approved
date: 2026-08-28
project: Leo Ferraz
operational_evidence: user_reported_working
external_test_status: piece_01_reported_correct_unverified_locally
evidence: "Prompt-base fornecido pelo fundador e relatado como funcional na geração externa da versão 01 — Demonstração; arquivo ainda não disponível no workspace para QA direto."
next_action: "Usar o prompt-base operacional v2 em uma geração externa controlada e registrar o arquivo para QA."
related:
  - "[[COPY-001 - Léo Digital Série 001]]"
  - "[[GUIA-002 - Léo Digital Cenas Originais Handoff Externo]]"
  - "[[../01_DECISOES/DECISAO-026 - Fonte de Identidade Separada da Cena e do Movimento]]"
  - "[[../02_EXECUCAO/2026-08/2026-08-28 — Diagnóstico da Cópia do Vídeo-Base na Geração Externa]]"
  - "docs/superpowers/specs/2026-08-28-leo-digital-original-scene-motion-generation-design.md"
---

# Léo Digital — Prompts de Cenas Originais

## Escopo

Este pacote serve exclusivamente para gerar externamente cenas e movimentos originais com a aparência do Léo Ferraz. Ele não usa vídeo-base e não substitui o [[PROMPT-001 - Léo Digital Série 001]], que permanece reservado para variações que preservam deliberadamente uma cena existente.

O vídeo externo deve entregar somente a camada visual. As duas headlines, a legenda e o CTA continuam fora da geração e serão aplicados conforme [[COPY-001 - Léo Digital Série 001]] e [[../02_EXECUCAO/2026-08/2026-08-28 — Especificação de Montagem do Léo Digital]].

## Entradas obrigatórias

- conjunto autorizado de fotos reais do Léo Ferraz, preferencialmente com vistas frontal, 3/4 e perfil;
- modo externo equivalente a `image-to-video` ou `text-to-video` com referência de identidade;
- prompt-base abaixo;
- prompt complementar da peça escolhida.

```text
Vídeo-base utilizado: nenhum.
Screenshots utilizadas como referência facial: nenhuma.
```

Não anexar o vídeo 08, qualquer outro vídeo da série, screenshots da interface ou frames do vídeo como referência de movimento nesta modalidade.

## Prompt-base operacional v2 aprovado

```text
Agora uma nova variação do vídeo. Gere uma cena original e autônoma. Não reutilize nem copie o enquadramento, a trajetória de câmera, a composição, o cenário, a configuração de iluminação ou a sequência de ação de nenhum vídeo anterior.

Crie um vídeo vertical 9:16, realista, silencioso e curto, com movimento humano contido e contínuo.

A cena deve parecer um momento real de construção de produto digital e desenvolvimento de software em um escritório ou estúdio tecnológico escuro, preciso e funcional. O ambiente deve transmitir desenvolvimento de software, construção de negócios e trabalho de produto digital. Não represente um laboratório científico, sala de pesquisa, ambiente futurista, cyberpunk, holográfico ou experimental.

Mantenha apenas a linguagem visual da série: atmosfera escura, iluminação fria e controlada, sensação tecnológica, estação de trabalho real e estética cinematográfica discreta. Crie uma nova disposição de ambiente, câmera, composição e ação em cada vídeo.

Preserve a identidade visual do Léo: rosto, formato dos olhos, cor dos olhos, cabelo, barba, rugas, proporções, expressão natural e o moletom utilizado nos vídeos anteriores. Utilize mesa, teclado e monitores apenas como elementos contextuais de uma estação de trabalho, sem exigir a mesma posição ou composição dos vídeos anteriores. As telas devem permanecer desfocadas e sem texto legível.

Não adicione texto, headline, legenda, CTA, logo, avatar, elementos de interface, marca d'água, pessoas novas, fala, voz, movimento de boca, lip-sync, cliente, produto, dinheiro, contrato, depoimento, métrica ou resultado.

Não introduza folhas, cartões, papéis, documentos, placas, quadros, hologramas ou outros objetos finos para serem segurados, posicionados, virados ou colocados diante da câmera. Priorize ações simples e estáveis, como olhar, pausar, ajustar a postura, apoiar as mãos no teclado ou realizar um movimento discreto de câmera.

Não transforme a expressão em euforia, choque, autoridade artificial ou promessa comercial. Entregue somente o vídeo, com composição limpa para receber a copy na montagem posterior.
```

### Interpretação operacional do prompt-base

`rosto`, `olhos`, `cabelo`, `barba`, `rugas`, `proporções`, `expressão` e `moletom` são âncoras de identidade. `mesa`, `teclado`, `monitores`, atmosfera escura e iluminação fria são referências de linguagem visual e contexto, não um cenário a ser copiado. A disposição, a composição, a câmera, a configuração de luz e a ação devem ser novas em cada peça.

### Política de objetos

Não solicitar manipulação de folhas, cartões, papéis, documentos, placas ou objetos finos. Esses elementos são instáveis na geração temporal e não são necessários para comunicar a headline. Quando a peça precisar de uma ação, preferir olhar, pausa, postura, mãos apoiadas e movimento de câmera. Se um objeto for indispensável, ele deve permanecer rígido, estacionário e já presente no ambiente, sem ser segurado ou reposicionado.

## Prompts complementares por peça

Cole um único bloco abaixo depois do prompt-base. Não combinar dois blocos na mesma geração.

### 01 — Demonstração

```text
Para esta peça, crie uma cena nova em plano médio 3/4, com o Léo sentado diante de uma estação de trabalho escura e limpa. Ele mantém as mãos apoiadas no teclado, pausa a ação por um instante, olha brevemente para a câmera com expressão concentrada e retorna o olhar para o monitor desfocado. Faça uma única aproximação lenta da câmera, sem cortes bruscos e sem reproduzir a composição, a câmera ou a ação do vídeo 08. Mantenha a boca imóvel e o movimento discreto.
```

### 02 — Transparência

```text
Para esta peça, crie uma cena nova em plano lateral médio, diante de uma estação de trabalho de desenvolvimento de software. O Léo mantém as mãos apoiadas na mesa, alterna o olhar entre o monitor desfocado e um ponto à frente e faz uma pequena pausa de reflexão. A câmera realiza um deslocamento lateral curto e contínuo. Use iluminação escura com um acento azul de precisão, sem projeção de código, sem telas legíveis e sem repetir qualquer plano do vídeo 06. A expressão permanece observadora e natural, com a boca imóvel.
```

### 03 — Bastidor

```text
Para esta peça, crie uma cena nova começando em plano alto diagonal de uma estação de trabalho tecnológica. O Léo ajusta a postura diante do teclado, observa os monitores desfocados e muda um passo de lugar para avaliar o ambiente. A câmera desce suavemente até um plano médio, sem montagem rápida e sem copiar a sequência de monitor, teclado e rosto do vídeo 03. Não mostrar texto legível, interface ou produto. O gesto deve parecer uma revisão de processo, sem pose de apresentação.
```

### 04 — Dor

```text
Para esta peça, crie uma cena nova em close médio 3/4, junto a uma janela escura, sem reproduzir o close ou o movimento do vídeo 02. O Léo interrompe o que está fazendo, mantém os lábios fechados, faz uma pausa corporal curta, fecha os olhos por um instante e encara a bancada com concentração. A câmera permanece quase fixa com uma microaproximação. A expressão deve comunicar atenção e limite, sem choque, desespero ou dramatização.
```

### 05 — Gargalo

```text
Para esta peça, crie uma cena nova em plano aberto dentro de um escritório ou estúdio de desenvolvimento de produto digital. O Léo caminha até uma estação de trabalho vazia, para por um instante e se senta. Faça um travelling curto acompanhando a entrada e termine em plano médio. Não copie o ambiente, a perspectiva ou a ação de digitação do vídeo 05. Não usar gesto dramático, fala, movimento de boca, tela legível ou qualquer indicação de resultado comercial.
```

### 06 — Formato

```text
Para esta peça, crie uma cena nova em plano médio frontal, dentro de um escritório ou estúdio escuro de desenvolvimento de produto digital e software. O Léo está sentado diante de uma estação de trabalho real, com teclado e dois monitores ao fundo. As telas devem estar desfocadas, sem texto legível e sem elementos de interface reconhecíveis. O Léo mantém as mãos apoiadas no teclado, faz uma pausa natural sem pegar ou mover nenhum objeto, levanta o olhar para a câmera e mantém uma expressão neutra e curiosa. A câmera realiza um afastamento curto, suave e contínuo para revelar o contexto do ambiente de trabalho tecnológico.

Não reproduza o enquadramento, a trajetória de câmera, a composição ou a sequência de ação de nenhum vídeo anterior da série. Não introduza cartão, folha, papel, documento, placa, quadro, holograma ou qualquer objeto fino para ser manipulado. Mantenha a boca imóvel e o movimento humano discreto.
```

### 07 — Estratégia

```text
Para esta peça, crie uma cena nova em plano médio 3/4, com o Léo em pé diante de uma parede neutra completamente sem escrita. Ele alterna o olhar entre dois pontos da parede, toca levemente o queixo e escolhe um deles com um pequeno movimento de cabeça. Faça um arco lateral muito discreto. Não copie o plano contínuo de digitação do vídeo 07, não crie quadro branco legível e não use pose de guru, apontamento ou sorriso exagerado.
```

### 08 — Aplicação

```text
Para esta peça, crie uma cena nova em plano médio lateral, com duas estações de trabalho simples e próximas em um escritório escuro de desenvolvimento de software. O Léo se levanta de uma estação, atravessa apenas um passo e apoia as mãos na outra estação. A câmera acompanha com um pan curto e termina no rosto. Não reproduza a rotina, a pausa para café ou o retorno à tarefa do vídeo 09. A ação não deve parecer uma demonstração de produto ou depoimento.
```

### 09 — Pesquisa

```text
Para esta peça, crie uma cena nova em plano americano, em uma sala escura com monitores desfocados e sem texto ao fundo. O Léo observa o ambiente, aproxima-se um passo e inclina a cabeça. Faça uma mudança de foco suave do fundo tecnológico para o rosto, sem criar gráficos, números, dashboards ou dados fictícios. Não reproduza a reflexão, o ajuste de óculos ou o plano amplo do vídeo 04. Mantenha a expressão contemplativa e a boca imóvel.
```

### 10 — Convite ao piloto

```text
Para esta peça, crie uma cena nova em plano médio 3/4 diante de uma mesa limpa. O Léo se inclina ligeiramente em direção à câmera, mantém contato visual por um instante e abre a mão sobre a bancada em um gesto curto e acolhedor. Faça um dolly-in discreto e termine sem corte brusco. Não copie o trabalho, o recuo ou o sorriso do vídeo 10. Não sugerir venda concluída, cliente, contrato, dinheiro ou resultado; manter os lábios fechados e a expressão acolhedora, porém contida.
```

## Teste controlado inicial

Executar primeiro somente a peça 01:

```text
Arquivo esperado: reel-01-demo-v01.mp4
Vídeo-base: nenhum
Fotos: conjunto real autorizado do Léo Ferraz
Modo: image-to-video ou text-to-video equivalente com referência de identidade
Copy dentro do vídeo: não
```

O objetivo do teste é verificar se a cena, o enquadramento e o movimento deixam de reproduzir o vídeo 08. Sem arquivo externo devolvido, não declarar sucesso, semelhança suficiente ou prontidão para publicação.

## Critérios de rejeição

Rejeitar e registrar como `rejeitado — cópia da cena/movimento` se o resultado:

- repetir a mesa, o laptop, a progressão de digitação, os planos ou o fechamento do vídeo 08;
- usar qualquer vídeo-base sem que isso tenha sido aprovado para a peça;
- gerar texto, logo, avatar, interface, marca d'água ou elementos não solicitados;
- introduzir fala, movimento de boca, áudio necessário ou lip-sync;
- alterar o rosto a ponto de perder a identidade ou produzir artefatos visíveis;
- inventar cliente, produto, dinheiro, contrato, depoimento, métrica ou resultado;
- não deixar espaço visual para as duas headlines aplicadas posteriormente.

## Estado operacional

- `status`: `approved`;
- `vídeo gerado aqui`: não;
- `versão 01 — Demonstração`: gerada corretamente segundo relato do fundador;
- `vídeo externo recebido no workspace`: não;
- `QA audiovisual`: pendente;
- `publicação`: não autorizada nesta etapa.
