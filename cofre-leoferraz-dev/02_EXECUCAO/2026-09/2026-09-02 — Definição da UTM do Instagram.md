---
title: "Definição da UTM do Instagram"
document_type: execution_record
status: review
authority: Leo Ferraz
date: 2026-09-02
project: Leo Ferraz
tags:
  - cofre/execucao
  - tema/site
  - tema/lancamento
  - projeto/leo-ferraz-dev
evidence: "Screenshot do GA4 fornecido pelo fundador, com 90 novos usuários e predominância de origem não atribuída, e decisão anterior sobre o link único de bio."
next_action: "Aguardar aprovação e substituir manualmente o link da bio do Instagram pela URL com UTM; depois observar novos acessos no GA4."
validation_status: proposed_manual_action
related:
  - "[[../../01_DECISOES/DECISAO-030 - UTM para Atribuicao do Instagram]]"
  - "[[../../01_DECISOES/DECISAO-015 - Link Único de Bio em Todas as Plataformas]]"
---

# Definição da UTM do Instagram

## Diagnóstico

O relatório atual não permite afirmar que todos os 90 novos usuários vieram do Instagram. A maior parte está classificada como `(direct) / (none)`, o que torna a origem inconclusiva.

## Definição

Usar no perfil do Instagram:

```text
https://leoferraz.dev/?utm_source=instagram&utm_medium=social&utm_campaign=leo_digital_s001&utm_content=bio_link
```

Essa URL preserva o domínio próprio e adiciona atribuição para a campanha da Série 001.

## Procedimento manual

1. copiar a URL definida;
2. abrir a edição do perfil `@leoferrazdev`;
3. substituir o endereço atual pelo endereço com UTM;
4. abrir o link em uma janela de teste;
5. confirmar que a página carrega normalmente;
6. acompanhar novos acessos classificados como `instagram / social` no GA4.

## Limites

- a troca do link exige login no Instagram e não foi executada pelo agente;
- a UTM não recupera a origem dos acessos antigos;
- a UTM não mede conversão comercial sem eventos posteriores;
- não criar propriedade, conta ou integração externa nesta etapa.
