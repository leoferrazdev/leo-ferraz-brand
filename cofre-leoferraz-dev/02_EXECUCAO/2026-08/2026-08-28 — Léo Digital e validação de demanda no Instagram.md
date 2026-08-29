---
title: "Léo Digital e validação de demanda no Instagram"
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
evidence: "Copy e prompts foram aprovados e migrados para notas navegáveis do cofre; nenhum vídeo externo foi recebido ou publicado."
next_action: "Gerar externamente os dez vídeos, devolver os arquivos e registrar o QA antes de qualquer publicação."
related:
  - "docs/superpowers/specs/2026-08-28-leo-digital-instagram-demand-validation-design.md"
  - "docs/superpowers/plans/2026-08-28-leo-digital-instagram-demand-validation.md"
  - "[[../../03_CONTEUDO/COPY-001 - Léo Digital Série 001]]"
  - "[[../../03_CONTEUDO/PROMPT-001 - Léo Digital Série 001]]"
  - "[[../../03_CONTEUDO/GUIA-001 - Léo Digital Série 001 Handoff Externo]]"
  - "[[../../03_CONTEUDO/PROMPT-002 - Léo Digital Cenas Originais]]"
  - "[[../../03_CONTEUDO/GUIA-002 - Léo Digital Cenas Originais Handoff Externo]]"
  - "[[../../01_DECISOES/DECISAO-026 - Fonte de Identidade Separada da Cena e do Movimento]]"
  - "[[2026-08-28 — Manifesto dos Ativos do Léo Digital]]"
  - "[[2026-08-28 — Especificação de Montagem do Léo Digital]]"
  - "[[../../01_DECISOES/DECISAO-016 - Sistema de Formatos de Vídeo]]"
---

# Léo Digital e validação de demanda no Instagram

## Decisão

O fundador aprovou a direção inicial de utilizar o Léo Digital em uma série de dez Reels silenciosos, orientados por headline e legenda, para validar demanda por um piloto pago de conteúdo comercial.

## Objetivo

Usar o Instagram como canal de aquisição e pesquisa com fundadores, empresários, criadores e especialistas que já possuem uma oferta real e enfrentam um gargalo de presença ou produção recorrente.

O objetivo não é vender um infoproduto agora, nem vender alcance. O objetivo é identificar conversas qualificadas e testar disposição de pagamento por uma operação de conteúdo productizada.

## Execução aprovada

- Reel vertical 9:16;
- aproximadamente 6–10 segundos;
- sem fala sintética ou lip-sync;
- headline principal isolada no início;
- segunda headline posterior apontando para o complemento na legenda;
- legenda com contexto e conteúdo;
- um CTA por peça;
- transparência sobre a utilização de IA quando aplicável;
- dez peças distribuídas entre problema, processo, aplicação e convite ao piloto;
- CTA de validação provisório: DM com `PILOTO`.

## Evidência de origem do ativo

As capturas analisadas mostram um fluxo especializado de face swap/video variation com vídeo-base, fotos reais do Léo, créditos pagos, variações e fila de processamento. Essa evidência sustenta a decisão de tratar o Léo Digital como pipeline de produção com custo e controle de qualidade, não como mecanismo universal de um clique.

## Refinamento de formato

O fundador especificou que o Reel deve utilizar duas headlines: a primeira funciona como gancho e permanece sozinha durante os primeiros segundos; a segunda entra depois, indicando que o complemento está na legenda. A segunda headline conduz à legenda, mas não substitui o CTA comercial que deve existir dentro dela.

As screenshots são referência da mecânica de headline e de handoff para legenda. Seus elementos específicos de perfil, interface, molduras e tratamento de texto não foram promovidos como identidade visual canônica da Leo Ferraz.

## Atualização da arquitetura de geração

O primeiro fluxo documentado em `PROMPT-001` e `GUIA-001` preserva deliberadamente a cena do vídeo-base. O teste do vídeo 08 demonstrou que esse fluxo não serve para criar cena e movimento novos: ele entregou uma cópia visual da referência porque essa era a instrução operacional recebida.

Para o objetivo de cena original, o pacote vigente passa a ser `PROMPT-002` + `GUIA-002`. A identidade vem das fotos autorizadas; a cena, a câmera e a ação vêm do prompt; o vídeo 08 não é anexado. A peça 01 foi relatada como correta pelo fundador usando o prompt-base vigente; o arquivo não está no workspace para QA audiovisual direto.

## Riscos registrados

- qualidade facial não necessariamente replicável para qualquer pessoa;
- dependência de fotos de referência, créditos e tentativas;
- ausência atual de áudio e sincronização labial confiável;
- possível identificação ou redução de distribuição de conteúdos gerados ou alterados por IA conforme políticas e classificações da plataforma;
- impossibilidade de prometer alcance, viralização ou vendas;
- necessidade de consentimento e aprovação para uso de imagem de terceiros.

## Estado

`approved`: direção editorial aprovada pelo fundador.

`copy_approved`: a copy da Série 001 foi aprovada pelo fundador; o pacote editorial contém as headlines, legendas, CTAs e fluxo de qualificação definidos para a primeira execução.

`prompts_ready_for_external_generation`: o PROMPT-001 permanece disponível para variação de cena existente e o PROMPT-002/GUIA-002 estão preparados para o teste de cena original; a peça 01 foi gerada externamente segundo relato do fundador, sem arquivo disponível aqui.

`generation_location`: a geração dos vídeos ocorre em uma plataforma externa específica.

`external_export_status`: a peça 01 foi relatada como gerada corretamente, mas nenhum export externo foi recebido no workspace ou validado diretamente nesta etapa.

`not_published`: nenhum Reel, legenda, CTA ou fluxo de qualificação foi publicado como parte desta decisão.

`not_validated`: ainda não há resultado de audiência, conversa qualificada, piloto pago, receita ou margem.

## Pendências

- escolher e registrar o segmento prioritário do primeiro piloto;
- definir a oferta do piloto sem prometer distribuição;
- gerar os dez vídeos na plataforma externa usando os prompts registrados;
- devolver os arquivos externos para QA de aparência, movimento e montagem;
- definir o destino de qualificação e o registro das conversas;
- publicar somente depois da revisão editorial, do QA e da aprovação dos conteúdos finais.
