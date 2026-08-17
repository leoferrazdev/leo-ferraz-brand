# Mapa operacional para agentes

## Propósito

Este repositório governa a identidade da marca Leo Ferraz.

## Regra fundamental

Agentes implementam decisões aprovadas; não inventam silenciosamente decisões ausentes.

## Idioma de Comunicação

Antes de gerar copy voltada ao público, resolver:

1. canal;
2. locale de comunicação;
3. se o termo solicitado é invariante ou localizável.

Se houver copy canônica de canal em `brand/LANGUAGE_ARCHITECTURE.md`, utilizá-la exatamente.

Não improvisar bios canônicas alternativas.

Não traduzir:

- `Leo Ferraz`;
- `Building with AI`;
- `AI-Native Product Lab`;
- `@leoferrazdev`;
- `leoferraz.dev`.

Não inferir que toda comunicação da marca deve ser em inglês.

Não inferir que toda comunicação deve ser em português.

## Estados

```text
draft
review
approved
implemented
```

Somente conteúdo `approved` ou `implemented` pode ser considerado canônico.

## Fontes canônicas

Os documentos canônicos serão adicionados progressivamente dentro de `/brand`.

Os valores técnicos derivados serão armazenados principalmente em `/tokens`.

## Regra para lacunas

Quando uma decisão necessária ainda não estiver definida:

1. não escolher arbitrariamente;
2. não inferir uma preferência estética;
3. registrar a lacuna;
4. solicitar decisão humana.

## Regra para conflitos

Quando duas fontes futuramente entrarem em conflito, deverá prevalecer a fonte de maior prioridade definida pela hierarquia canônica do projeto.

A hierarquia completa ainda será criada posteriormente.

## Alterações

Não modificar decisões aprovadas incidentalmente durante tarefas de produção.

Mudanças na identidade devem ocorrer através de uma tarefa explícita de revisão do Brand System.

## Git

Não executar automaticamente:

- commit;
- push;
- tag;
- deploy.

Essas ações dependem de autorização explícita.
