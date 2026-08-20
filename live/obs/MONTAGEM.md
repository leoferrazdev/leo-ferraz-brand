# Montagem das cenas — Leo Ferraz — YouTube / Twitch

Gerado por `scripts/build-brand-assets.mjs`. Não editar à mão: as coordenadas abaixo vêm das mesmas constantes que desenham as molduras, então um valor digitado aqui deixaria de bater com a imagem.

Os arquivos desta pasta espelham `brand-assets/exports/day-1/03-live/obs/`. Depois de mudar a copy em `brand-assets/sources/content.json`, rode `npm run brand-assets:build` — nunca edite um export diretamente.

## Como funciona

Cada cena tem um fundo e um conjunto de fontes. As molduras desenhadas no fundo ficam **fora** da área da fonte: se a câmera está no lugar certo, a moldura continua visível ao redor dela.

**Nenhuma cena pede texto digitado antes de entrar no ar.** Toda a copy é fixa e já está nas imagens. O tema da transmissão fica no título da live, que a plataforma exibe ao lado do player, e a cena 04 mostra o que está sendo construído na própria captura de tela.

Arquivos terminados em `-guia` mostram as coordenadas sobre a própria arte. Use para montar e depois troque pelo arquivo sem sufixo. Nunca deixe um `-guia` no ar.

## 01 — Começando em breve

Fundo: `01-comecando-em-breve.png` em 0, 0 · 1920×1080. Nada a posicionar.

## 02 — Câmera

Sem fundo: a câmera ocupa o quadro inteiro. Só entram as sobreposições transparentes.

| Fonte | Arquivo | Posição sugerida |
| --- | --- | --- |
| Câmera | dispositivo de captura | 0, 0 · 1920×1080 |
| Selo ao vivo | `overlay-selo-ao-vivo.png` | 1620, 60 |
| Identificação | `lower-third.png` | 60, 840 |
| Link | `overlay-rodape-link.png` | 60, 950 |

## 03 — Ao vivo

Fundo: `03-ao-vivo.png` em 0, 0 · 1920×1080. Confira as coordenadas com `03-ao-vivo-guia.png` aberto ao lado.

| Fonte | Tipo | X | Y | Largura | Altura |
| --- | --- | --- | --- | --- | --- |
| CÂMERA | video | 240 | 120 | 1440 | 810 |

## 04 — Construção / Artefato

Fundo: `04-construcao.png` em 0, 0 · 1920×1080. Confira as coordenadas com `04-construcao-guia.png` aberto ao lado.

| Fonte | Tipo | X | Y | Largura | Altura |
| --- | --- | --- | --- | --- | --- |
| TELA / ARTEFATO | captura | 40 | 140 | 1520 | 855 |
| CÂMERA | video | 1592 | 140 | 288 | 162 |
| CHAT / NOTAS | livre | 1592 | 326 | 288 | 669 |

## 05 — Já volto

Fundo: `05-ja-volto.png` em 0, 0 · 1920×1080. Nada a posicionar.

## 06 — Encerrando

Fundo: `06-encerrando.png` em 0, 0 · 1920×1080. Nada a posicionar.

## 07 — Fora do ar

Fundo: `07-fora-do-ar.png` em 0, 0 · 1920×1080. Nada a posicionar.

## Sobreposições reutilizáveis

| Arquivo | Tamanho | Uso |
| --- | --- | --- |
| `brand-bug.png` | 480×96 | marca discreta de canto; não usar junto de cena que já traz a assinatura |
| `lower-third.png` | 960×160 | identificação |
| `overlay-selo-ao-vivo.png` | 260×88 | estado ao vivo sobre a câmera |
| `overlay-rodape-link.png` | 560×80 | link da bio sobre a câmera |
