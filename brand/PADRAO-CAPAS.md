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

**Entrelinha de 0,95 é o alvo, não o valor final.** Esse número funciona para maiúsculas sem acento e aperta demais assim que aparece português. Em corpo de 84px o `À` sobe 82,1px acima da linha de base enquanto 0,95 só oferece 79,8px, então o acento entra na linha de cima por 3,3px. O `Ç` piora pelo outro lado, descendo 17,8px abaixo da própria base.

O gerador resolve a entrelinha a partir dos glifos que estão de fato compostos, par a par, e usa o maior valor entre 0,95 e o mínimo seguro. Uniforme no bloco inteiro, porque variar linha a linha vira outro defeito. O build avisa quando precisa ajustar.

### Capa de transmissão ao vivo

Duas diferenças em relação ao padrão genérico, ambas deliberadas.

O selo é vermelho `#E5484D` com texto branco, porque sinaliza estado e não marca. É o significado que o vermelho já tem neste sistema e a convenção que toda plataforma usa. Aqui o texto é branco, ao contrário do selo azul, porque o vermelho é escuro o suficiente para isso.

A headline fica inteiramente branca, sem a palavra em azul que as capas de live antigas usavam. Com o selo vermelho já no quadro, uma palavra azul colocaria uma terceira cor num layout cuja limpeza vem justamente de ter uma só.

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

## Material fotográfico

Resolvido em 2026-08-22. O fundador entregou seis retratos recortados em `brand-assets/profile/leo-ferraz/`, PNG com canal alfa, camiseta preta, enquadramento até o peito.

| Arquivo | Resolução | Registro |
| --- | --- | --- |
| `leo-ferraz-cutout-front.png` | 1374×1145 | frontal, sorrindo, olhando para a câmera |
| `leo-ferraz-cutout-smile-three-quarter.png` | 1360×1156 | sorriso em três quartos |
| `leo-ferraz-cutout-present-right.png` | 1340×1174 | gesto apresentando à direita |
| `leo-ferraz-cutout-neutral.png` | 1320×1192 | expressão contida |
| `leo-ferraz-cutout-present-left.png` | 1319×1192 | gesto apresentando à esquerda |
| `leo-ferraz-cutout-arms-crossed.png` | 1122×1402 | braços cruzados, o mais alto do conjunto |

Todos superam as duas áreas reservadas sem ampliação, o que encerra a limitação de resolução que travava o padrão. A variedade de expressão permite teste A/B de miniatura, que uma foto única nunca permitiu.

**Procedência.** A troca de terno azul por camiseta preta não é resultado de recorte, então houve geração ou edição de conteúdo na produção desses arquivos. A ressalva da [[DECISAO-010]] sobre retrato sintético e a pendência aberta da [[DECISAO-011]] continuam valendo e foram levantadas com o fundador antes do uso. A decisão de seguir é dele, com autoridade registrada em `brand/BRAND_FOUNDATION.md`.

## Enquadramento necessário

Cabeça, ombros e peito, com folga acima da cabeça e corte na altura do peito médio. As referências mostram a pessoa da cabeça ao peito, sangrando na base. As fotos atuais cortam no ombro, sem corpo para ocupar a área reservada.
