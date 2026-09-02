---
title: "Especificação da Camada de Conversão da Homepage"
document_type: execution_record
status: implemented
authority: Leo Ferraz
date: 2026-09-02
project: Leo Ferraz
evidence: "Desenho do funil aprovado pelo fundador e especificação técnica escrita para revisão antes da implementação."
next_action: "Observar cliques no CTA, conversas qualificadas e eventual piloto pago antes de ampliar a oferta."
validation_status: build_passed
related:
  - "[[../../01_DECISOES/DECISAO-029 - Monetizacao apos Trafego Organico]]"
  - "[[../../01_DECISOES/DECISAO-030 - UTM para Atribuicao do Instagram]]"
  - "docs/superpowers/specs/2026-09-02-leoferraz-funnel-conversion-layer-design.md"
---

# Especificação da Camada de Conversão da Homepage

## Registro

O desenho aprovado foi implementado após o hero da homepage como um único bloco de conversão para visitantes que já possuem uma oferta e enfrentam um gargalo de presença ou produção de conteúdo. O CTA abre o WhatsApp existente com mensagem pré-preenchida e mede somente o clique inicial no GA4.

## Limites

- não lançar infoproduto;
- não criar checkout, preço ou formulário;
- não criar conta ou propriedade externa;
- não alterar automaticamente o perfil do Instagram;
- não substituir o portfólio existente.

## Documento de design

A especificação completa está em `docs/superpowers/specs/2026-09-02-leoferraz-funnel-conversion-layer-design.md`; o desenho foi aprovado e a implementação foi concluída.

## Estado

- design conversado: aprovado;
- especificação escrita: aprovada;
- implementação do site: concluída;
- medição do CTA: implementada como melhoria progressiva no GA4;
- validação local: build aprovado;
- conversas, leads qualificados, pilotos pagos e vendas: ainda não observados.
