---
title: "2026-09-02 — Revisão da CTA da Homepage e Remoção do Sproutbound"
document_type: execution_record
status: implemented
authority: Leo Ferraz
date: 2026-09-02
project: Leo Ferraz
validation_status: build_and_tests_passed
related:
  - "[[../../../01_DECISOES/DECISAO-029 - Monetizacao apos Trafego Organico]]"
  - "docs/superpowers/specs/2026-09-02-homepage-cta-and-sproutbound-removal-design.md (design externo ao cofre)"
---

# Revisão da CTA da Homepage e Remoção do Sproutbound

## Decisão

A homepage deve tornar o próximo passo explícito com uma CTA que nomeia o WhatsApp e um diagrama editorial que explica a sequência oferta existente → gargalo → conversa inicial. O Sproutbound deixa de ser apresentado nas superfícies públicas enquanto permanece preservado no repositório para eventual retomada.

## Execução

- CTA atualizada para `Descrever meu gargalo no WhatsApp →`.
- Copy ajustada para refletir a operação individual: `Descreva o seu gargalo para eu entender se uma conversa inicial faz sentido.`
- Diagrama semântico de três etapas adicionado ao bloco de conversão.
- Sproutbound removido da homepage e de `/laboratorio/`.
- Imagem pública exclusiva do Sproutbound removida.
- Dados, componente, estilos e registros históricos preservados sem referência pública.

## Evidência

- `npm run build` concluído com as seis rotas estáticas.
- Testes disponíveis concluídos sem falhas: avatar 2/2 e pacote de capas 17/17.
- `dist/index.html` e `dist/laboratorio/index.html` não contêm a apresentação do Sproutbound.
- O asset `dist/evidence/sproutbound-1280x720.jpg` não é gerado.
- `obsidian unresolved total` e `obsidian orphans total` permanecem em `0`.

## Pendências

- Observar o clique da CTA, conversas qualificadas, pilotos e vendas com tráfego real.
- Reativar o Sproutbound somente quando houver estágio e evidência adequados para apresentação pública.
