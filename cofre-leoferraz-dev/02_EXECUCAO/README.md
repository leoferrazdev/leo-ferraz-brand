---
title: Execução
document_type: section-index
status: active
tags:
  - cofre/execucao
---

# Execução

Registre aqui tarefas, avanços, atualizações de implementação, evidências e próximos passos já autorizados — diário técnico e histórico operacional do projeto num único fluxo (esta pasta também cobre o que `03_REGISTROS/` pretendia fazer separadamente; ver [[../01_DECISOES/DECISAO-013 - Reorganização da Arquitetura do Cofre]]).

Prefira uma nota por unidade de trabalho. Use [[../templates/Atualizacao|o template de atualização]] para manter o registro objetivo.

## Organização por mês

Notas datadas vivem em subpastas por mês: `2026-08/`, `2026-09/`, etc. Regra fixa, sem julgamento por tema: **uma nota nova vai na subpasta do mês em que foi escrita**. Isso mantém a pasta navegável indefinidamente sem exigir uma taxonomia de assunto (que na prática nunca teve fronteiras limpas — várias notas cobrem mais de um tema ao mesmo tempo).

## Convenção de nomes

```text
YYYY-MM-DD — <Título>.md
```

## Convenção de frontmatter

- `status`: `planned`, `in_progress`, `blocked` ou `done`;
- `owner`: pessoa responsável;
- `evidence`: arquivo, comando, teste ou URL que sustenta o registro;
- `next_action`: próxima ação autorizada, quando existir;
- `tags`: sempre incluir `cofre/execucao` e pelo menos um tema da lista fechada abaixo.

## Vocabulário de temas (`tags`)

Lista fechada — não criar novo tema sem necessidade real. Tags adicionais e mais específicas (ex.: `brand/signature`, `responsivo`) continuam permitidas junto do tema, mas todo registro deve carregar ao menos um destes:

- `tema/site` — código, UI, layout, conteúdo do site Astro (leoferraz.dev)
- `tema/marca-ativos` — scripts e assets do Brand System (signature, grid, templates de render)
- `tema/lancamento` — prontidão de lançamento, configuração de canais/redes sociais
- `tema/identidade-founder` — foto, direção de arte, avatar do fundador
- `tema/conteudo` — roteiros, copywriting, ferramentas de geração de conteúdo

Uma nota pode carregar mais de um tema quando genuinamente cruza domínios (ex.: uma auditoria que cobre marca-ativos e site ao mesmo tempo).

## Índices mensais

- [[2026-08/README|Agosto de 2026]] — 47 notas datadas de execução, manifesto e especificação do Léo Digital incluídos.
