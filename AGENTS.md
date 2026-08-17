# Mapa operacional para agentes

## Propósito

Este repositório governa a identidade da marca Leo Ferraz.

## Regra fundamental

Agentes implementam decisões aprovadas; não inventam silenciosamente decisões ausentes.

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
