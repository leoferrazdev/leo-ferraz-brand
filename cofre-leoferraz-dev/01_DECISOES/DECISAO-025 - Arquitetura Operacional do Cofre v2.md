---
title: "Decisão 025 — Arquitetura Operacional do Cofre v2"
document_type: decision
decision_id: DECISAO-025
status: implemented
authority: Leo Ferraz
date: 2026-08-28
tags:
  - cofre/decisoes
  - cofre/arquitetura
  - projeto/leo-ferraz-dev
related:
  - "[[DECISAO-001 - Cofre do Projeto]]"
  - "[[DECISAO-013 - Reorganização da Arquitetura do Cofre]]"
---

# Decisão 025 — Arquitetura Operacional do Cofre v2

## Contexto

O fundador solicitou uma auditoria determinística da arquitetura de pastas e da navegabilidade do cofre `cofre-leoferraz-dev`, especialmente porque o pacote de copy e prompts do Léo Digital foi preparado fora do vault e apenas referenciado por uma nota de execução.

## Evidência observada antes da implementação em 2026-08-28

- o CLI do Obsidian reportou 8 entradas de pasta incluindo a raiz e `.obsidian`; a estrutura operacional efetiva possui 6 pastas: `01_DECISOES`, `02_EXECUCAO`, `03_CONTEUDO`, `04_REFERENCIAS`, `99_ARQUIVO` e `templates`;
- 81 notas Markdown;
- 25 notas em `01_DECISOES`;
- 45 notas datadas em `02_EXECUCAO/2026-08`, além do README da seção;
- apenas 2 notas em `03_CONTEUDO`;
- `04_REFERENCIAS` e `99_ARQUIVO` contêm somente seus READMEs, conforme a decisão anterior;
- 21 notas órfãs, sem backlinks de entrada;
- 9 links não resolvidos no Obsidian;
- 94 tarefas abertas contra 33 concluídas;
- 9 notas de execução sem as tags obrigatórias `cofre/execucao` e `tema/*`;
- 7 notas de execução legadas sem `document_type`;
- o README de `02_EXECUCAO` define estados `planned`, `in_progress`, `blocked` e `done`, enquanto o histórico usa também `completed`, `implemented`, `reviewed` e `approved`;
- o índice de `02_EXECUCAO` possui apenas dois links e não indexa as notas do mês;
- os índices de `04_REFERENCIAS` e `99_ARQUIVO` não possuem ainda conteúdo para navegar;
- as notas de execução do Léo Digital referenciam copy, prompts e handoff fora do vault por caminhos de repositório, não por notas navegáveis do Obsidian.

## Decisão determinística

É necessária uma melhoria de arquitetura operacional, mas não uma reestruturação total das pastas.

A estrutura de alto nível aprovada pela `DECISAO-013` permanece válida. Não criar novas pastas por tema, não reabrir `03_REGISTROS/` e não redistribuir retroativamente as 45 notas de execução por assunto. O eixo temporal continua sendo o eixo primário de execução.

A versão 2 deve corrigir quatro camadas:

1. **Navegação:** `00_INICIO.md` deve funcionar como dashboard do cofre; cada subpasta mensal de `02_EXECUCAO/` deve possuir um README-índice com links para as notas do mês, status e próximas ações.
2. **Localização de artefatos:** copy publicável, prompts e instruções operacionais de conteúdo devem existir como notas dentro do cofre, principalmente em `03_CONTEUDO/`, quando forem entregáveis integrais e reutilizáveis. Documentos canônicos de `brand/*.md` continuam fora do cofre e não devem ser duplicados.
3. **Higiene de links:** links para notas internas devem ser wikilinks com o basename exato; referências a `brand/*.md` fora do vault devem ser links Markdown ou caminhos explícitos, não wikilinks que gerem falsos unresolved links.
4. **Metadados:** novas notas devem cumprir `document_type`, `status`, `date`, `tags`, `evidence` e `next_action` quando aplicável. A migração das notas legadas deve preservar o corpo e corrigir somente frontmatter, links e índices.

## Arquitetura alvo

```text
cofre-leoferraz-dev/
├── 00_INICIO.md                         # dashboard e roteamento do vault
├── CONTEXTO-IA - Projeto Leo Ferraz.md  # contexto operacional de alto nível
├── 01_DECISOES/                         # decisões, alternativas e autoridade
│   ├── README.md
│   └── DECISAO-NNN - Título.md
├── 02_EXECUCAO/                         # histórico de trabalho por mês
│   ├── README.md
│   └── YYYY-MM/
│       ├── README.md                    # índice do mês
│       └── YYYY-MM-DD — Título.md
├── 03_CONTEUDO/                         # artefatos integrais reutilizáveis
│   ├── README.md
│   └── TIPO-NNN - Título.md
├── 04_REFERENCIAS/                      # apoio externo e fontes consultadas
│   ├── README.md
│   └── REFERENCIA-NNN - Título.md
├── 99_ARQUIVO/                          # histórico encerrado ou superseded
│   ├── README.md
│   └── notas arquivadas
└── templates/                            # modelos de nota
```

## Aplicação ao Léo Digital

Depois da aprovação desta decisão, migrar o pacote operacional atualmente em `docs/content/leodigital/2026-08/series-001/` para notas do cofre com nomes copiáveis e indexáveis, por exemplo:

- `03_CONTEUDO/COPY-001 - Léo Digital Série 001.md`;
- `03_CONTEUDO/PROMPT-001 - Léo Digital Série 001.md`;
- `03_CONTEUDO/GUIA-001 - Léo Digital Série 001 Handoff Externo.md`;
- `02_EXECUCAO/2026-08/2026-08-28 — Manifesto dos Ativos do Léo Digital.md`.

Essas notas não serão cópias de `brand/*.md`. Serão artefatos de produção e conteúdo derivados da decisão aprovada, com blocos de copy e prompts isolados para cópia direta na plataforma externa.

## Ordem de implementação proposta

1. criar `02_EXECUCAO/2026-08/README.md` com índice navegável do mês;
2. atualizar `00_INICIO.md`, `01_DECISOES/README.md` e `03_CONTEUDO/README.md` para apontar para o estado atual;
3. migrar o pacote Léo Digital para notas dentro de `03_CONTEUDO/` e `02_EXECUCAO/`;
4. corrigir os 9 links não resolvidos, distinguindo links internos de referências externas ao vault;
5. normalizar frontmatter das 9 notas de execução que não cumprem as tags e das 7 notas que não possuem `document_type`, sem reescrever o histórico;
6. revisar a taxonomia de status em uma alteração separada, porque ela é uma decisão de governança de ciclo de vida e não apenas uma mudança de pasta;
7. só reconsiderar novas subdivisões de pasta depois de observar a navegação com os índices mensais e os artefatos dentro do vault.

## O que não fazer

- não criar pastas `site/`, `marca/`, `conteudo/`, `videos/` ou equivalentes dentro de `02_EXECUCAO/` como eixo primário;
- não mover notas históricas por tema apenas para reduzir a contagem visual de uma pasta;
- não duplicar integralmente `brand/*.md` no cofre;
- não arquivar notas somente porque são órfãs;
- não eliminar links externos sem preservar a fonte e a data de consulta;
- não declarar a arquitetura v2 implementada antes da criação dos índices, da migração do pacote e da verificação de links.

## Impacto

O cofre continuará simples no nível principal, mas passará a ter um caminho claro para descobrir decisões, execução mensal e artefatos de conteúdo. A mudança reduz a dependência de caminhos externos ao vault e torna os prompts mais fáceis de copiar, sem misturar fonte canônica da marca com memória operacional.

## Estado da decisão

`implemented`: decisão aprovada pelo fundador e aplicada no cofre.

## Estado da implementação em 2026-08-28

- `00_INICIO.md`, `01_DECISOES/README.md`, `02_EXECUCAO/README.md` e `03_CONTEUDO/README.md` agora roteiam para o estado atual;
- `02_EXECUCAO/2026-08/README.md` indexa as notas do mês por data e status;
- o pacote operacional do Léo Digital foi migrado para notas navegáveis em `03_CONTEUDO/` e `02_EXECUCAO/2026-08/`;
- as referências externas a `brand/*.md` foram preservadas como caminhos explícitos, enquanto os links internos passaram a usar o basename exato;
- as notas históricas que não possuíam `document_type` ou as tags operacionais mínimas receberam apenas esses campos no frontmatter;
- a validação do CLI após a implementação reportou zero links não resolvidos e zero notas órfãs;
- a geração externa, o retorno dos arquivos, o QA de vídeo e a publicação continuam pendentes e não são declarados como realizados.
