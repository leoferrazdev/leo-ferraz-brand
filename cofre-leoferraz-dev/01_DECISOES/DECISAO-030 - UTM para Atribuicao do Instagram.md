---
title: "Decisão 030 — UTM para Atribuição do Instagram"
document_type: decision
decision_id: DECISAO-030
status: review
implementation_status: proposed
external_test_status: pending
authority: Leo Ferraz
date: 2026-09-02
project: Leo Ferraz
tags:
  - cofre/decisoes
  - tema/site
  - tema/lancamento
  - projeto/leo-ferraz-dev
related:
  - "[[DECISAO-015 - Link Único de Bio em Todas as Plataformas]]"
  - "[[../02_EXECUCAO/2026-09/2026-09-02 — Diagnóstico do Funil Instagram-Site e Oferta]]"
  - "[[../02_EXECUCAO/2026-09/2026-09-02 — Definição da UTM do Instagram]]"
---

# Decisão 030 — UTM para Atribuição do Instagram

## Pergunta

Como identificar com maior precisão se os usuários que chegam ao site vieram do Instagram?

## Evidência

O screenshot do GA4 mostra 90 novos usuários no período analisado, mas a origem aparece distribuída entre 77 usuários ativos como `(direct) / (none)`, 10 como `ig / social` e 1 como `facebook.com / referral`. A hipótese de que os 90 vieram do Instagram é possível, mas não está comprovada pelo relatório atual.

A decisão anterior de usar o domínio próprio como link único de bio permanece válida. Ela previa reavaliar UTMs quando o Analytics estivesse instalado; o site agora possui GA4.

## Definição determinística

Usar uma UTM no link único da bio do Instagram. A UTM não cria um novo destino: continua apontando para `leoferraz.dev` e apenas identifica a origem, o meio, a campanha e o ponto de entrada.

URL proposta para o campo de link da bio:

```text
https://leoferraz.dev/?utm_source=instagram&utm_medium=social&utm_campaign=leo_digital_s001&utm_content=bio_link
```

Parâmetros definidos:

| Parâmetro | Valor | Função |
|---|---|---|
| `utm_source` | `instagram` | identifica a plataforma |
| `utm_medium` | `social` | identifica o canal social orgânico |
| `utm_campaign` | `leo_digital_s001` | identifica o ciclo editorial atual |
| `utm_content` | `bio_link` | identifica o link do perfil |

## Regra de interpretação

Depois da troca manual do link, novos acessos atribuídos a `instagram / social` serão evidência de origem. Os acessos anteriores continuarão parcialmente ambíguos e não devem ser retroativamente classificados como Instagram.

UTM mede origem de sessão; não prova, sozinha, intenção, qualificação, contato ou compra. Esses eventos precisam ser medidos separadamente quando o caminho de conversão for implementado.

## Compatibilidade com a decisão anterior

O domínio canônico não muda. A URL com parâmetros é a versão mensurável do mesmo link único. Não usar Linktree, outro agregador ou múltiplos destinos na bio.

## Estado

- URL definida: proposta;
- alteração no perfil do Instagram: não realizada;
- alteração no site: não necessária;
- leitura futura de `instagram / social`: pendente de novos acessos;
- aprovação final da troca manual: pendente.
