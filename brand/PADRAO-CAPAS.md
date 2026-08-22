# Padrão de capas com recorte

Padrão definido a partir de duas referências de miniatura trazidas pelo fundador, com a identidade Leo Ferraz aplicada por cima. Vale para YouTube (1280×720) e para plataformas verticais (1080×1920).

Especificação visual em `brand/padrao-capas/spec-horizontal.png` e `spec-vertical.png`, geradas por `node scripts/build-cover-spec.mjs`.

## O que muda em relação às capas atuais

A mudança estrutural é uma só, e é ela que produz o salto de qualidade das referências.

| | Capas atuais (`ab_1`, `capa_VA`, `thumb_v2`) | Padrão novo |
| --- | --- | --- |
| Foto | sangra na borda com degradê que funde no fundo | recortada sem fundo, silhueta limpa contra o grid |
| Separação | o degradê esconde a transição | a borda da pessoa é a transição |
| Presença | a foto é uma faixa lateral | a pessoa é figura sobre fundo, com profundidade |

O degradê existe hoje porque a foto tem fundo próprio (a sala, os monitores) e precisa sumir. Recortando a pessoa, o degradê deixa de ser necessário e a capa ganha a leitura de estúdio das referências.

## Elementos

### Fundo

`#0D1117` com o grid da marca. Horizontal usa célula de 48px, vertical usa 60px. As referências usam preto puro com grid, o azul escuro da marca cumpre o mesmo papel e mantém identidade.

### Pílula de categoria

Canto superior esquerdo, formato de cápsula, ponto sólido antes do texto. IBM Plex Sans 700, caixa alta, tracking 0.06.

Fundo `#4DA3FF` com texto em `#0D1117`. **Texto escuro, não branco.** O azul da marca é claro o bastante para deixar texto branco perto de 2,5:1 de contraste, enquanto o texto escuro alcança cerca de 7:1.

As referências usam magenta. O azul cumpre a mesma função de sinal e é a cor da marca. O vermelho `#E5484D` fica reservado ao selo de transmissão ao vivo, que já tem esse significado no sistema.

### Headline

IBM Plex Sans 700, branco `#F3F6FA`, alinhada à esquerda, entrelinha 0,95, tracking -0,028. Duas ou três linhas curtas.

Nas referências a headline é inteiramente branca e a cor vive só na pílula. Recomendado seguir isso, em vez da palavra colorida que as capas atuais usam. Uma cor por peça lê mais limpo do que duas competindo.

Corpo de 90px no horizontal e 118px no vertical, conferido contra a coluna disponível a cada build.

### Foto

Recortada, sem fundo, sangrando na base do quadro.

| Formato | Área da foto | Posição |
| --- | --- | --- |
| Horizontal 1280×720 | 640×720 | metade direita, sangra na base |
| Vertical 1080×1920 | 1080×1040 | de y 880 até a base |

### Sem barra inferior

As capas atuais têm uma barra de 8px em `#4DA3FF` na base. Neste padrão ela sai, porque a figura sangrando na borda inferior é o que dá profundidade nas referências, e a barra cortaria a pessoa.

## Zonas seguras do vertical

| Restrição | Limite |
| --- | --- |
| Rosto dentro do corte quadrado do perfil | entre y 950 e y 1450 |
| Legenda do Reels cobre a base | nada essencial abaixo de y 1620 |
| Botões da interface ficam à direita | nada essencial à direita de x 930 |

## Por que o material fotográfico atual não atende

Levantamento do que existe em `brand-assets/thumbnails/src/`.

| Arquivo | Resolução | Problema para este padrão |
| --- | --- | --- |
| `foto.jpg` | 1024×1024 | enquadrado no peito alto, sem corpo para preencher 1040px de altura no vertical |
| `ab1`, `ab2`, `ab3` | 840×1080 | quadros de vídeo, expressão de meio de fala |
| `take1`, `take2` | 840×1080 | mesma origem, mesma limitação |
| `v2_frame_t70` | 1920×1080 | quadro cheio, a pessoa ocupa parte pequena dele |

Três lacunas, todas medidas e não estimadas.

**Resolução.** O recorte precisa de 640×720 no horizontal e 1080×1040 no vertical. Para não ampliar, a fonte precisa entregar a pessoa nesse tamanho já, e o ideal é o dobro. Nenhum arquivo atual chega perto disso com a pessoa preenchendo o quadro.

**Definição real.** O diagnóstico de qualidade desta mesma semana provou por PSNR que o material de vídeo em 1080p com profundidade de campo rasa não carrega detalhe acima de cerca de 1152px equivalentes, e que cinco vezes mais bitrate move isso em menos de 1 dB. Recortar um rosto desses e ampliar para preencher metade de uma miniatura devolve exatamente a moleza que a plataforma sinalizou.

**Recorte limpo.** Cabelo escuro contra fundo escuro não tem borda para o algoritmo de recorte encontrar. As referências têm luz de contorno separando cabelo do fundo, que é o que permite o corte limpo. As fotos atuais foram feitas em sala escura sem essa luz.

## Enquadramento necessário

Cabeça, ombros e peito, com folga acima da cabeça e corte na altura do peito médio. As referências mostram a pessoa da cabeça ao peito, sangrando na base. As fotos atuais cortam no ombro, sem corpo para ocupar a área reservada.
