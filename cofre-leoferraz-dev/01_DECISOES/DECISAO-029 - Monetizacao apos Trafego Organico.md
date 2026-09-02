---
title: "Decisão 029 — Monetização após Tráfego Orgânico"
document_type: decision
decision_id: DECISAO-029
status: review
implementation_status: implemented
external_test_status: pending
validation_status: build_passed
authority: Leo Ferraz
date: 2026-09-02
project: Leo Ferraz
tags:
  - cofre/decisoes
  - tema/conteudo
  - tema/site
  - tema/lancamento
  - projeto/leo-ferraz-dev
related:
  - "[[../02_EXECUCAO/2026-09/2026-09-02 — Diagnóstico do Funil Instagram-Site e Oferta]]"
  - "[[../02_EXECUCAO/2026-09/2026-09-02 — Especificação da Camada de Conversão da Homepage]]"
  - "[[../02_EXECUCAO/2026-08/2026-08-28 — Plano de implementação do Léo Digital no Instagram]]"
  - "[[../03_CONTEUDO/COPY-001 - Léo Digital Série 001]]"
---

# Decisão 029 — Monetização após Tráfego Orgânico

## Pergunta

O tráfego orgânico atual já justifica oferecer um infoproduto no site do Léo Ferraz?

## Evidência disponível

- No período de 2026-08-05 a 2026-09-02, o screenshot do GA4 mostra 88 usuários ativos, 90 novos usuários, 7 segundos de tempo médio de engajamento e 391 eventos.
- As principais páginas mostram 121 visualizações em `Leo Ferraz — Building with AI`, 19 em `Laboratório — Leo Ferraz` e 1 em `Living Brandbook — Leo Ferraz`.
- A atribuição visível registra 77 usuários ativos como `(direct) / (none)`, 10 como `ig / social` e 1 como `facebook.com / referral`. Portanto, não é válido tratar os 77 acessos diretos como tráfego comprovadamente originado do Instagram.
- O screenshot do Instagram mostra 3.485 seguidores, 8 posts e Reels visíveis na faixa aproximada de 320 a 563 visualizações, além de uma publicação isolada com 44,4 mil visualizações, que não deve ser usada como média da série.
- Não há conversão de contato, solicitação de piloto, início de checkout ou compra demonstrada nos screenshots.

## Definição determinística

Não lançar um infoproduto agora.

O próximo passo correto é instalar uma camada de conversão e validação: o site deve oferecer uma única ação de baixa fricção para a pessoa descrever seu gargalo e sinalizar interesse em uma conversa ou piloto. Isso transforma tráfego em evidência de demanda sem fingir que já existe produto validado.

O portfólio continua como prova de capacidade, mas deixa de ser o destino final do funil. A ação comercial deve permanecer coerente com o plano já registrado: qualificar pessoas que já possuem uma oferta e avaliar um eventual piloto pago, sem definir ainda infoproduto, preço final ou promessa de alcance.

## Funil recomendado

```text
Instagram/Reel
→ perfil
→ site com uma decisão clara
→ descrição do gargalo / interesse em piloto
→ conversa qualificada
→ eventual piloto pago
→ aprendizado sobre problema, escopo e disposição de investimento
→ só então produto educacional ou infoproduto
```

## Critério para autorizar um infoproduto

O infoproduto só deve avançar quando houver, de forma repetida e registrada:

1. uma dor de conteúdo ou produção reconhecida por pessoas do ICP;
2. um resultado desejado suficientemente semelhante entre essas pessoas;
3. disposição para discutir escopo, prazo e investimento;
4. pelo menos uma validação econômica independente por meio de um piloto pago ou transação equivalente.

Visualização, visita ao perfil, clique no link da bio, elogio à aparência do Léo Digital ou preenchimento sem qualificação não autorizam o lançamento.

## Pendências para aprovação

- implementar UTMs no link da bio para separar Instagram de acessos diretos;
- observar o evento de clique no CTA, o início de contato, o contato qualificado e eventual pagamento;
- registrar as conversas e os aprendizados antes de decidir sobre piloto pago ou produto educacional.

## Estado de implementação

- A homepage agora apresenta a ação única aprovada: descrever o gargalo de presença ou produção de conteúdo pelo WhatsApp.
- O CTA usa a mensagem pré-preenchida aprovada e permanece funcional sem JavaScript ou GA4.
- O clique dispara o evento `pilot_interest_click` com os parâmetros não pessoais `channel`, `location` e `campaign`.
- O build está aprovado; conversas, leads qualificados, pilotos pagos e vendas continuam não observados até a produção de tráfego real.
