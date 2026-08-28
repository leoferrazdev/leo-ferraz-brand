---
title: Regeneracao da Thumbnail da Live Dia 1
document_type: asset_generation
date: 2026-08-22
last_updated: 2026-08-23
tags:
  - leo-ferraz
  - cofre/execucao
  - tema/marca-ativos
  - projeto/leo-ferraz-dev
  - execucao
  - youtube
  - thumbnail
  - live
status: implemented
---

# Regeneração da Thumbnail da Live — Dia 1

## Decisão

O arquivo operacional permanece `brand-assets/thumbnails/live_1.png`, acompanhado por `live_1.jpg`. Não foi criada a estrutura redundante `brand-assets/thumbnails/live/_1.png`.

A composição segue [[DECISAO-020 - Título Serializado das Transmissões ao Vivo]] e o padrão aprovado em `brand/PADRAO-CAPAS.md`:

- selo vermelho `AO VIVO`;
- headline branca `SEM CORTES / DO ERRO / À SOLUÇÃO`;
- fundo `#0D1117` com grid de 48px;
- retrato `leo-ferraz-cutout-arms-crossed.png`;
- ausência de gradiente, glow, barra inferior ou palavra azul na headline.

## Execução

O gerador `scripts/build-cutout-cover.mjs` passou a derivar `live_1` e `live_4` do mesmo objeto de composição. Isso preserva `live_4` como alias histórico da decisão e impede divergência futura entre os dois nomes.

Arquivos regenerados:

- `brand-assets/thumbnails/live_1.png`;
- `brand-assets/thumbnails/live_1.jpg`.

## Evidência

> [!success] Contrato visual e técnico
> Os dois formatos têm 1280×720. `live_1.png` é byte a byte idêntico a `live_4.png`, e `live_1.jpg` é byte a byte idêntico a `live_4.jpg`. Os hashes de `live_4` permaneceram inalterados após a regeneração.

Hashes aprovados:

```text
PNG: DCF67B651B3030E384E9E7DEE768CBCC8AB2F1D12305FC5F6AEC55D793F76495
JPG: 86ED651EFB59E020D2EA103F88F27EE3AFCB9A01DEF0EFF1ECF92FB9EEAD7941
```

A inspeção em resolução original confirmou:

- selo e headline completos;
- acentos íntegros;
- separação segura entre texto e figura;
- silhueta sem pixels claros de fundo;
- nenhuma sobreposição ou elemento proibido.

## Revisão de composição — 2026-08-23

O fundador identificou que a referência apresentava maior escala tipográfica e um retrato mais próximo, produzindo uma peça mais unificada. A revisão aplicada mantém a mesma decisão visual e altera somente a escala:

- headline de 84px para 94px;
- tracking compacto de `-0.055` para preservar a coluna segura;
- retrato ampliado em 8%, ancorado à direita e à base;
- `live_1` e `live_4` continuam derivados da mesma composição.

> [!success] Nova evidência
> `live_1.png` e `live_4.png` continuam byte a byte idênticos; o mesmo vale para os JPEGs. Os novos hashes são:

```text
PNG: 20D28414BD9025E713322DD61DA92E40399D9A18573809CC75EE1C7841F326E4
JPG: 00E3B3CE8F0991F6572E476947012371E065D0E8A49E3E81851D4908F59EB117
```

A inspeção em resolução original confirmou headline mais dominante, retrato mais integrado ao quadro, acentos íntegros e nenhuma alteração de cor, selo ou tratamento proibido.

## Revisão de escala tipográfica — 2026-08-23

O fundador observou que ainda havia espaço para aproximar a escala da headline à referência. Foi aplicado um aumento tipográfico adicional, sem redesenhar a composição:

- headline de 94px para 102px;
- tracking ajustado para `-0.10`, mantendo `SEM CORTES` dentro do limite seguro de 538px;
- bloco da headline reposicionado de `y=196` para `y=184` para absorver a escala sem perder equilíbrio;
- retrato, badge, grid, paleta e proporção permanecem inalterados;
- `live_1` e `live_4` continuam derivados da mesma composição.

> [!success] Nova evidência
> A validação automática mediu `SEM CORTES` em 534px, `DO ERRO` em 379px e `À SOLUÇÃO` em 483px, todos dentro da coluna segura. Os quatro arquivos continuam em 1280×720; PNGs e JPEGs permanecem byte a byte idênticos entre `live_1` e `live_4`.

```text
PNG: CAD5AE5BC03E59FF4D503A468970EB255D036C1E58D562B2B98B3E2193935EFA
JPG: 7E91932B0FD3A7870430BB0387D3C4186B8332915A4F69F388F59F301C0A73AC
```

A inspeção em resolução original confirmou headline ampliada, leitura imediata, separação segura entre texto e retrato, acentos íntegros e ausência de tratamentos proibidos.

## Revisão de integração entre headline e retrato — 2026-08-23

A área marcada na revisão visual correspondia ao vazio entre o fim da headline e o início da silhueta. Para aproximar os elementos sem estourar a tipografia, o retrato foi ampliado mantendo a ancoragem à direita e à base:

- `subjectScale` de `1.08` para `1.17`;
- retrato resultante em 629×842, iniciando em `x=651` e `y=-122`;
- headline preservada em 102px, com `SEM CORTES` em 534px dentro do limite seguro de 538px;
- badge, grid, paleta, safe zone e hierarquia permanecem inalterados;
- `live_1` e `live_4` continuam derivados da mesma composição.

> [!success] Nova evidência
> Os quatro arquivos permanecem em 1280×720. PNGs e JPEGs continuam byte a byte idênticos entre `live_1` e `live_4`.

```text
PNG: B4AC4143E254D2E9164F032EF33D04046D08A3C07F1FB238C5C214D5712451D6
JPG: 2FCF462145F8319B09DD91036313D69074784B13DA91713B394046D73CF855F4
```

A inspeção em resolução original confirmou menor vazio entre texto e retrato, maior integração visual, ausência de sobreposição textual e preservação dos tratamentos aprovados.

## Revisão de semelhança estrutural sem alteração tipográfica — 2026-08-23

Para aproximar a peça das referências sem substituir a tipografia canônica do projeto, foram ajustados apenas os elementos não tipográficos:

- grid específico da live reduzido de opacidade `0.45` para `0.28`;
- selo `AO VIVO` ampliado de `56px` para `64px` de altura;
- selo reposicionado de `(64, 56)` para `(48, 48)` e texto aumentado de `26px` para `30px`;
- headline, IBM Plex Sans 700, corpo de 102px, tracking `-0.10` e posição permanecem inalterados;
- retrato, `subjectScale 1.17`, paleta e hierarquia permanecem inalterados;
- as capas genérica horizontal e vertical mantêm a opacidade padrão do grid;
- `live_1` e `live_4` continuam derivados da mesma composição.

> [!success] Nova evidência
> Os quatro arquivos permanecem em 1280×720. PNGs e JPEGs continuam byte a byte idênticos entre `live_1` e `live_4`.

```text
PNG: CA4511840528F49E8D75D3FE61B61A1AAE1538429DF7AB84605B85125CEA94A7
JPG: AB64F1C4E2176DD6C416401756C1E26CD5AB8F707C34AD57749F38099A7CCFE4
```

A inspeção em resolução original confirmou grid mais discreto, selo com presença proporcionalmente maior, headline preservada e nenhuma introdução de gradiente, glow ou nova decisão tipográfica.

## Pendências

> [!info]
> A publicação da nova thumbnail no YouTube não faz parte desta execução. O arquivo foi preparado no repositório para uso operacional posterior.

## Relações

- [[DECISAO-020 - Título Serializado das Transmissões ao Vivo]]
- [[2026-08-20 — Capas de Live]]
- [[DECISAO-024 - Pack Mestre Reutilizavel de Capas de Video]]
