---
title: Editorial Tech Lockup Signature
date: 2026-08-18
document_type: design-specification
status: review
scope: signature-application-and-canonical-review
source_brand_system: v1.0.0
---

# Editorial Tech Lockup Signature

## Decision Under Review

A revisão humana selecionou a direção de exploração:

```text
Option C — Editorial Tech Lockup
```

Esta seleção inicia a formalização de uma nova assinatura candidata. Ela ainda não altera o estado `approved` de `brand/SIGNATURE.md` nem substitui `Pure / Editorial` até que a implementação determinística e a revisão canônica sejam concluídas.

## Intent

Dar à assinatura Leo Ferraz uma construção mais própria e tecnológica, aproximando sua presença visual da referência editorial de produtos observada em `aioriented.dev`, sem copiar nome, logo, conteúdo, estrutura ou elementos proprietários.

A assinatura deve continuar identificando o autor ao lado de produtos, artefatos e evidências. Ela não deve competir com o produto nem transformar o fundador em um símbolo genérico de IA.

## Canonical Content

O conteúdo permanece invariável:

```text
Master Brand:
Leo Ferraz

Descriptor:
Building with AI

Institutional Category:
AI-Native Product Lab
```

`Leo Ferraz` continua sendo a Master Brand. `Building with AI` continua sendo descriptor subordinado, opcional e removível. A categoria institucional permanece uma linha de apoio separada.

## Proposed Construction

### Primary Wordmark

```text
Leo Ferraz
```

- tipografia: IBM Plex Sans;
- peso-base: 500;
- leitura principal: sans-serif editorial;
- construção: nome tipográfico, sem lettering ilustrativo;
- contraste: escala, alinhamento e relação espacial;
- comportamento: monocromático antes de qualquer acento.

### Structural Marker

Um marcador geométrico mínimo pode acompanhar a assinatura em contextos permitidos.

O marcador deve ser:

- pequeno;
- funcional;
- alinhado ao eixo da assinatura;
- reproduzível em SVG e CSS;
- removível em contextos estreitos;
- subordinado ao nome.

O marcador não é:

- monograma;
- símbolo de IA;
- logotipo independente;
- elemento obrigatório em toda aplicação;
- forma proprietária de avatar por si só.

### Descriptor

```text
Building with AI
```

- IBM Plex Mono;
- hierarquia secundária;
- alinhamento derivado do marcador apenas quando isso aumentar clareza;
- ausência permitida quando o artefato exigir prioridade.

## Color Behavior

- a assinatura deve sobreviver em monocromia;
- `#4DA3FF` pode funcionar como sinal estrutural contextual;
- o acento não deve preencher o nome inteiro por padrão;
- nenhum novo token cromático é criado nesta especificação;
- sem gradiente, glow ou sombra decorativa;
- a assinatura não depende do acento para ser reconhecível.

## Required Contexts

A implementação candidata deve ser testada com o mesmo conteúdo em:

- homepage hero;
- header desktop;
- header mobile;
- `/brand/`;
- perfil social;
- thumbnail;
- avatar e favicon;
- ao lado de um artefato real;
- contexto de metadata/evidence.

## Clear Hierarchy

```text
Leo Ferraz
↓
Building with AI
↓
AI-Native Product Lab
```

O nome deve continuar sendo a primeira leitura. O marcador, o descriptor e a categoria não podem inverter essa ordem.

## Small-Size and Monochrome Tests

Devem ser validados deterministicamente:

- 16 px;
- 24 px;
- 32 px;
- 48 px;
- 64 px;
- 128 px;
- 256 px;
- versão monocromática clara;
- versão monocromática escura;
- crop circular e quadrado imposto por plataforma.

Se o marcador competir com o nome em qualquer tamanho, ele deve ser removido ou simplificado naquele contexto.

## Governance Constraints

Não alterar nesta etapa:

- `BRAND_FOUNDATION.md`;
- `BRAND_ARCHITECTURE.md`;
- `VISUAL_DIRECTION.md`;
- `COLOR.md`;
- `TYPOGRAPHY.md`;
- `LANGUAGE_ARCHITECTURE.md`;
- copy canônica;
- domínio, handle ou categoria institucional.

A promoção de `Pure / Editorial` para `Editorial Tech Lockup` só poderá ocorrer após:

1. implementação da opção candidata;
2. validação de assinatura, cor, tipografia, SVG, PNG e pequenos tamanhos;
3. revisão do documento canônico `SIGNATURE.md`;
4. aprovação explícita da decisão final.

## Acceptance Criteria

- `Leo Ferraz` continua claramente dominante;
- `Building with AI` continua descriptor;
- a assinatura parece autoral e tecnológica sem parecer logo de startup de IA;
- o marcador é funcional e dispensável;
- a assinatura funciona sem acento;
- produtos e artefatos continuam visualmente prioritários;
- a reprodução é determinística;
- não há cópia de AIOriented.dev;
- nenhuma decisão canônica é alterada incidentalmente.

## Next Gate

Esta especificação aguarda revisão humana escrita antes da criação do plano de implementação. A seleção visual de Option C não constitui, isoladamente, publicação da nova assinatura canônica.
