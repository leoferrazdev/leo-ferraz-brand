---
title: "Léo Digital — Prompts de Cenas Originais"
document_type: external_generation_prompts
status: approved
date: 2026-08-28
project: Leo Ferraz
operational_evidence: user_reported_working
external_test_status: piece_01_reported_correct_unverified_locally
evidence: "Prompt-base fornecido pelo fundador e relatado como funcional na geração externa da versão 01 — Demonstração; arquivo ainda não disponível no workspace para QA direto."
next_action: "Usar este prompt-base literalmente na próxima variação e registrar o arquivo externo para QA."
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

## Prompt-base obrigatório comprovado no teste

```text
Agora uma nova variação do vídeo, gere uma cena original, não use e não copie o enquadramento, trajetória de câmera, cenário ou sequência de ação de outro vídeo já feito anteriormente.

Crie um vídeo vertical 9:16, realista, silencioso e curto, com movimento humano contido e contínuo. A cena deve parecer um momento de construção de produto digital em um laboratório escuro e preciso, sem telas legíveis e sem aparência de anúncio de resultado. Preserve rosto, formato dos olhos, cor dos olhos, cabelo, barba, rugas, proporções, expressão natural, moletom, mesa, teclado, monitores, iluminação e cenário.

Não adicione texto, headline, legenda, CTA, logo, avatar, elementos de interface, marca d'água, pessoas novas, fala, voz, movimento de boca, lip-sync, cliente, produto, dinheiro, contrato, depoimento, métrica ou resultado. Não transforme a expressão em euforia, choque, autoridade artificial ou promessa comercial. Entregue somente o vídeo, com composição limpa para receber a copy na montagem posterior.
```

### Interpretação operacional do prompt-base

`moletom`, `mesa`, `teclado`, `monitores`, `iluminação` e `cenário` são âncoras de continuidade visual do universo do Léo. Não autorizam reproduzir a composição exata, o enquadramento, a trajetória de câmera ou a sequência de ação de um vídeo anterior. A frase inicial do prompt prevalece para essas dimensões.

## Prompts complementares por peça

Cole um único bloco abaixo depois do prompt-base. Não combinar dois blocos na mesma geração.

### 01 — Demonstração

```text
Para esta peça, crie uma cena nova em plano médio 3/4, com o Léo sentado diante de uma bancada escura e limpa. Ele examina uma folha sem texto legível, fecha um caderno, olha brevemente para a câmera com expressão concentrada e retorna o olhar para a bancada. Faça uma única aproximação lenta da câmera, sem cortes bruscos e sem reproduzir a composição, a câmera ou a ação do vídeo 08. Mantenha a boca imóvel e o movimento discreto. Não adicione objetos além da folha e do caderno fechável já descritos.
```

### 02 — Transparência

```text
Para esta peça, crie uma cena nova em plano lateral médio, diante de uma mesa de laboratório. O Léo organiza três cartões completamente sem escrita, observa um deles e os coloca lado a lado. A câmera faz um deslocamento lateral curto e contínuo. Use iluminação escura com um acento azul de precisão, sem projeção de código, sem telas legíveis e sem repetir qualquer plano do vídeo 06. A expressão permanece observadora e natural, com a boca imóvel.
```

### 03 — Bastidor

```text
Para esta peça, crie uma cena nova começando em plano alto diagonal de uma estação de trabalho. O Léo posiciona uma folha em branco, ajusta uma luminária pequena e muda um passo de lugar para observar a composição. A câmera desce suavemente até um plano médio, sem montagem rápida e sem copiar a sequência de monitor, teclado e rosto do vídeo 03. Não mostrar texto legível, interface ou produto. O gesto deve parecer uma revisão de processo, sem pose de apresentação.
```

### 04 — Dor

```text
Para esta peça, crie uma cena nova em close médio 3/4, junto a uma janela escura, sem reproduzir o close ou o movimento do vídeo 02. O Léo interrompe o que está fazendo, mantém os lábios fechados, faz uma pausa corporal curta, fecha os olhos por um instante e encara a bancada com concentração. A câmera permanece quase fixa com uma microaproximação. A expressão deve comunicar atenção e limite, sem choque, desespero ou dramatização.
```

### 05 — Gargalo

```text
Para esta peça, crie uma cena nova em plano aberto dentro de um corredor interno de laboratório. O Léo caminha até uma mesa vazia, para, olha para a cadeira e se senta. Faça um travelling curto acompanhando a entrada e termine em plano médio. Não copie o ambiente, a perspectiva ou a ação de digitação do vídeo 05. Não usar gesto dramático, fala, movimento de boca, tela legível ou qualquer indicação de resultado comercial.
```

### 06 — Formato

```text
Para esta peça, crie uma cena nova em plano médio frontal, com uma mesa limpa e sem telas. O Léo posiciona um cartão sem texto diante da câmera, recua a mão e olha para o cartão. A câmera faz um pequeno movimento de afastamento para revelar o contexto. Não reproduza o plano amplo, as mãos ou o retorno ao rosto do vídeo 01. Mantenha o cartão sem qualquer escrita, logo ou símbolo e preserve a expressão neutra e curiosa.
```

### 07 — Estratégia

```text
Para esta peça, crie uma cena nova em plano médio 3/4, com o Léo em pé diante de uma parede neutra completamente sem escrita. Ele alterna o olhar entre dois pontos da parede, toca levemente o queixo e escolhe um deles com um pequeno movimento de cabeça. Faça um arco lateral muito discreto. Não copie o plano contínuo de digitação do vídeo 07, não crie quadro branco legível e não use pose de guru, apontamento ou sorriso exagerado.
```

### 08 — Aplicação

```text
Para esta peça, crie uma cena nova em plano médio lateral, com duas bancadas simples e próximas em um laboratório escuro. O Léo pega um caderno fechado em uma bancada, atravessa apenas um passo e o coloca na outra. A câmera acompanha com um pan curto e termina no rosto. Não reproduza a rotina, a pausa para café ou o retorno à tarefa do vídeo 09. O caderno não deve conter texto visível e a ação não deve parecer uma demonstração de produto ou depoimento.
```

### 09 — Pesquisa

```text
Para esta peça, crie uma cena nova em plano americano, em uma sala escura com poucos cartões abstratos e sem texto ao fundo. O Léo observa o conjunto, aproxima-se um passo e inclina a cabeça. Faça uma mudança de foco suave do fundo abstrato para o rosto, sem criar gráficos, números, dashboards ou dados fictícios. Não reproduza a reflexão, o ajuste de óculos ou o plano amplo do vídeo 04. Mantenha a expressão contemplativa e a boca imóvel.
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
