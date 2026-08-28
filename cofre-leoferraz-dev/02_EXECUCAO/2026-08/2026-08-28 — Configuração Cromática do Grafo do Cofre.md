---
title: "Configuração Cromática do Grafo do Cofre"
document_type: configuration_record
status: implemented
authority: Leo Ferraz
date: 2026-08-28
project: Leo Ferraz
tags:
  - cofre/execucao
  - tema/cofre
  - projeto/leo-ferraz-dev
evidence: "Configuração persistida em .obsidian/graph.json e confirmada pelo Obsidian após recarregar a visualização em gráfico."
next_action: "Manter as cores por área; só criar novos grupos quando uma nova pasta operacional for aprovada."
related:
  - "[[../../01_DECISOES/DECISAO-025 - Arquitetura Operacional do Cofre v2]]"
  - "[[../README]]"
---

# Configuração Cromática do Grafo do Cofre

## Decisão operacional

O grafo global do cofre usa as pastas de primeiro nível como grupos de cor. Essa escolha acompanha a arquitetura aprovada e evita que uma nota com múltiplas tags seja classificada visualmente em mais de uma camada ao mesmo tempo.

## Mapa de cores

| Área | Consulta | Cor | Função visual |
|---|---|---|---|
| `01_DECISOES` | `path:01_DECISOES` | `#E76F51` | decisões e autoridade |
| `02_EXECUCAO` | `path:02_EXECUCAO` | `#4DA3FF` | trabalho, evidência e pendências |
| `03_CONTEUDO` | `path:03_CONTEUDO` | `#43A047` | copy, prompts e artefatos reutilizáveis |
| `04_REFERENCIAS` | `path:04_REFERENCIAS` | `#F2C94C` | fontes e apoio externo |
| `99_ARQUIVO` | `path:99_ARQUIVO` | `#8A8F98` | histórico encerrado ou superseded |
| `templates` | `path:templates` | `#9B8AFB` | modelos de novas notas |

Notas da raiz permanecem na cor padrão, pois funcionam como entrada e contexto global do cofre.

## Configuração persistida

O arquivo `.obsidian/graph.json` mantém os seis grupos, com filtros recolhidos, tags e anexos ocultos e grupos de cor visíveis. A configuração é visual e operacional; não altera o conteúdo das notas nem a identidade canônica em `brand/`.

## Critério de manutenção

Não criar grupos por tema dentro do grafo global enquanto a pasta de primeiro nível continuar sendo o eixo primário. Se o cofre ganhar uma nova área de primeiro nível por decisão explícita, adicionar o grupo correspondente e registrar a alteração neste documento.
