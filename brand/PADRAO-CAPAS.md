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

Três lacunas reais, em ordem de peso. A resolução não é a principal, ao contrário do que parece à primeira vista.

**Expressão, e é a que mais custa.** As duas referências mostram a pessoa sorrindo, olhando direto para a câmera, com o rosto aberto. `foto.jpg` tem expressão séria e fechada. Os quadros de vídeo pegam meio de fala, com a boca aberta em posição arbitrária. Miniatura vive de rosto legível a 200px de largura no feed, e expressão é o que carrega esse tamanho.

**Variedade.** Existe uma única foto de estúdio utilizável. Sem alternativas de expressão não há como rodar teste A/B de miniatura, que é o único jeito de descobrir qual registro funciona no canal.

**Recorte limpo.** Cabelo escuro contra fundo escuro não oferece borda para o recorte encontrar. As referências têm luz de contorno separando o cabelo do fundo, que é justamente o que permite o corte limpo. As fotos atuais foram feitas em sala escura sem essa luz, com monitores acesos atrás criando bordas complexas.

**A base não pode ser a `foto.jpg`.** Os hashes MD5 batem entre `brand-assets/thumbnails/src/foto.jpg`, `brand-assets/profile/leo-ferraz-avatar-darklab-headshot.jpg` e `leo-ferraz-founder-photo-provisional.jpg`. É o mesmo arquivo, e é justamente o que a [[DECISAO-011]] registra com sinais fortes de geração sintética, sem EXIF, em 1024×1024 exatos. Construir o padrão novo em cima dele propagaria uma pendência aberta do cofre para a peça mais visível do canal.

As fotos reais verificadas por metadado são `leo-ferraz-founder-photo-a-1024.png` e `leo-ferraz-founder-photo-b-1024.png`, aprovadas na [[DECISAO-010]] justamente para uso em miniatura. São elas a base legítima. Têm a vantagem de já trazerem luz de contorno colorida do próprio setup de gravação, que é o mesmo recurso que separa a figura do fundo nas referências.

**Sobre resolução, o quadro honesto.** `foto.jpg` tem 1024×1024 com a pessoa ocupando quase todo o quadro. Para a área horizontal de 640×720 isso é redução, ou seja, funciona. Para a área vertical de 1080×1040 exige ampliação em torno de 1,2x, que é apertado mas não fatal. Os quadros de vídeo são outra história, porque o diagnóstico desta semana provou por PSNR que o material 1080p com profundidade de campo rasa não carrega detalhe acima de cerca de 1152px equivalentes, e ampliar um rosto desses devolve a moleza que a plataforma sinalizou.

Conclusão prática. Dá para montar uma primeira versão com as fotos reais verificadas recortadas, aceitando expressão séria e enquadramento fechado. Fotos novas não são pré-requisito técnico, são o que separa uma capa aceitável de uma no nível das referências.

## Enquadramento necessário

Cabeça, ombros e peito, com folga acima da cabeça e corte na altura do peito médio. As referências mostram a pessoa da cabeça ao peito, sangrando na base. As fotos atuais cortam no ombro, sem corpo para ocupar a área reservada.
