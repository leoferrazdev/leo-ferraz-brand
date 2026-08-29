---
title: "Léo Digital — Handoff de Cenas Originais"
document_type: external_handoff
status: review
date: 2026-08-28
project: Leo Ferraz
evidence: "Procedimento derivado da DECISAO-026 para impedir que o fluxo de cena original volte a copiar o vídeo-base."
next_action: "Usar o prompt-base comprovado na próxima variação; registrar o arquivo externo e o QA."
related:
  - "[[PROMPT-002 - Léo Digital Cenas Originais]]"
  - "[[GUIA-001 - Léo Digital Série 001 Handoff Externo]]"
  - "[[../01_DECISOES/DECISAO-026 - Fonte de Identidade Separada da Cena e do Movimento]]"
  - "[[../02_EXECUCAO/2026-08/2026-08-28 — Diagnóstico da Cópia do Vídeo-Base na Geração Externa]]"
---

# Léo Digital — Handoff de Cenas Originais

## Limite

Este guia organiza a operação em uma plataforma externa para gerar uma cena e um movimento novos com a identidade visual do Léo Ferraz. Ele não gera vídeos neste repositório. A copy das duas headlines, a legenda e o CTA são aplicados depois, fora da geração visual.

Este guia não é uma instrução de face swap. Se a plataforma oferecer somente `Face Swap Video Variations`, não usar esse modo para este teste: registrar `não gerado — modo incompatível` e interromper a operação.

## Regra de entradas

```text
Fotos de identidade: conjunto real autorizado do Léo Ferraz
Vídeo-base: nenhum
Screenshots da interface: nenhuma
Referência de movimento: prompt da peça
```

Não anexar o vídeo 08, qualquer outro Reel, frame extraído ou screenshot como referência de movimento. O vídeo 08 permanece apenas como comparação histórica no QA, não como entrada da plataforma.

## Prompt-base vigente

Usar literalmente o prompt-base comprovado no teste dentro de [[PROMPT-002 - Léo Digital Cenas Originais]]. Não substituir a lista de âncoras `moletom, mesa, teclado, monitores, iluminação e cenário`. Essas âncoras preservam o universo visual do Léo; a instrução inicial continua proibindo copiar a composição exata, a trajetória de câmera e a sequência de ação de vídeos anteriores.

## Procedimento por peça

1. Selecionar um modo funcionalmente equivalente a `image-to-video` ou `text-to-video` que aceite fotos como referência de identidade.
2. Confirmar antes de anexar qualquer arquivo que o modo não exige um vídeo-base para comandar cena, câmera ou ação.
3. Anexar somente o conjunto autorizado de fotos reais do Léo Ferraz, preferencialmente com ângulos frontal, 3/4 e perfil.
4. Confirmar visualmente que nenhum vídeo-base, frame ou screenshot entrou na lista de referências.
5. Copiar o prompt-base e um único bloco complementar de peça de [[PROMPT-002 - Léo Digital Cenas Originais]].
6. Confirmar que o pedido descreve cena, enquadramento, trajetória de câmera e ação originais.
7. Confirmar que o pedido não solicita texto, headline, legenda, CTA, logo, avatar, interface, fala, voz, lip-sync ou marca d'água.
8. Selecionar saída vertical 9:16 e duração curta, inicialmente entre 6 e 10 segundos, se a plataforma permitir essa configuração.
9. Confirmar o modelo, o modo e o custo atual em créditos antes de aprovar a geração.
10. Gerar somente a versão solicitada. A primeira operação deve ser a peça 01, sem gerar as outras nove simultaneamente.
11. Salvar o arquivo externo com o nome da peça e da versão.
12. Registrar os dados da operação abaixo antes de iniciar qualquer nova tentativa.
13. Devolver o arquivo para QA de identidade, cena, câmera e movimento antes de montar as headlines.

## Primeiro teste

```text
Peça: 01 — Demonstração
Arquivo esperado: reel-01-demo-v01.mp4
Vídeo-base anexado: não
Fotos anexadas: conjunto autorizado do Léo Ferraz
Prompt: PROMPT-002, prompt-base + bloco 01
Objetivo: romper a cópia de cena e movimento do vídeo 08
```

O sucesso do primeiro teste exige uma cena, um enquadramento e uma ação diferentes do vídeo 08. Sem o arquivo devolvido e sem inspeção, o teste permanece pendente.

## Ficha de operação

Preencher uma ficha para cada tentativa:

```text
Peça e versão:
Arquivo devolvido:
Data e hora:
Fotos utilizadas:
Vídeo-base utilizado: nenhum
Plataforma:
Modo:
Modelo:
Custo em créditos:
Duração devolvida:
Resolução devolvida:
Marca d'água: sim / não / não verificado
Áudio técnico: sim / não / não verificado
Texto ou elementos não solicitados: sim / não / não verificado
Observação facial:
Observação de cena e movimento:
Decisão: recebido para QA / rejeitado / não gerado
```

## Regra de parada e rejeição

Parar a operação se:

- o modo exigir o vídeo 08 ou outro vídeo-base;
- a plataforma tratar as fotos apenas como referências secundárias, sem controle de identidade;
- o resultado insistir em copiar a mesa, o laptop, a progressão de digitação, os planos ou o fechamento do vídeo 08;
- o custo ou o modelo não puder ser confirmado antes da aprovação.

Classificar o caso como `não gerado — modo incompatível` quando não houver um modo adequado. Classificar como `rejeitado — cópia da cena/movimento` quando houver arquivo, mas ele reproduzir a referência histórica. Não iniciar outra tentativa sem registrar a tentativa anterior e seu custo.

## Nomenclatura de devolução

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

## Não fazer

- não usar screenshots como substitutas das fotos reais;
- não anexar o vídeo 08 para tentar obter uma cena nova;
- não pedir à ferramenta para escrever as headlines;
- não aceitar texto gerado pela plataforma como copy final;
- não introduzir clientes, produtos, contratos, dinheiro, receita, depoimentos, métricas ou resultados;
- não publicar o vídeo antes do QA e da montagem determinística;
- não afirmar replicabilidade para outras pessoas a partir do teste do Léo Ferraz.

## Critério de devolução para QA

O arquivo só está pronto para revisão quando abrir fora da plataforma, tiver nome de peça e versão e vier acompanhado da ficha de operação. A revisão deve confirmar identidade facial, mudança de cena, mudança de movimento, ausência de texto e composição limpa para as duas headlines.
