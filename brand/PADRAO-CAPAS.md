# Padrão de capas com recorte

> [!success] Estado canônico — APROVADO
> **Reference Pattern / Photo-Integrated Thumbnail v1.1.0** — aprovado em 2026-08-23 para uso nas thumbnails do projeto Leo Ferraz.

Padrão definido a partir de duas referências de miniatura trazidas pelo fundador, com a identidade Leo Ferraz aplicada por cima. A implementação horizontal aprovada vale para YouTube (1280×720). A adaptação vertical deverá preservar a mesma relação entre headline, grid, foto e sinal funcional quando for gerada.

Especificação visual em `brand/padrao-capas/spec-horizontal.png` e `spec-vertical.png`, geradas por `node scripts/build-cover-spec.mjs`.

## Regra vigente

O padrão aprovado integra texto e fotografia em uma única peça editorial: a pessoa ocupa a faixa direita em sangria, enquanto a headline domina a faixa esquerda. A fotografia não é uma cópia isolada colada sobre a arte; ela é integrada ao fundo por enquadramento e fade horizontal controlado.

| | Padrão anterior | Reference Pattern aprovado |
| --- | --- | --- |
| Foto | composição predominantemente vetorial ou recorte isolado | foto ampliada, enquadrada na faixa direita e sangrando nas bordas |
| Separação | texto e imagem tratados como blocos independentes | fade horizontal integra a foto ao fundo escuro |
| Presença | assinatura ou headline com menor ocupação | headline e rosto ocupam o quadro com escala editorial |

O fade é estrutural, não decorativo: reduz o contraste da transição entre a fotografia e o fundo `#0D1117`, preservando a leitura da headline sem transformar a peça em uma colagem.

## Elementos

### Fundo

`#0D1117` com o grid da marca. Horizontal usa célula de 48px, vertical usa 60px. As referências usam preto puro com grid, o azul escuro da marca cumpre o mesmo papel e mantém identidade.

### Sinal funcional

Canto superior esquerdo, quando houver estado de transmissão. Formato de cápsula, ponto sólido antes do texto. IBM Plex Sans 700, caixa alta, tracking 0.06.

Para `AO VIVO`, usar vermelho `#E5484D` com ponto e texto brancos. O vermelho é sinal de estado, não cor primária da marca.

Para contexto editorial sem estado ao vivo, usar kicker em IBM Plex Mono, caixa alta, na cor `#4DA3FF`, sem cápsula.

### Headline e hierarquia

IBM Plex Sans 700, alinhada à esquerda, entrelinha próxima de 0,95, tracking negativo controlado. Duas ou três linhas curtas, com escala suficiente para dominar a leitura em thumbnail.

O texto principal usa `#F3F6FA`. Uma palavra ou trecho pode usar `#4DA3FF` como acento editorial funcional, desde que permaneça secundário à headline. No padrão aprovado, `REAIS` e `O PORQUÊ` recebem esse acento.

Corpo de 90px no horizontal e 118px no vertical, conferido contra a coluna disponível a cada build.

**Entrelinha de 0,95 é o alvo, não o valor final.** Esse número funciona para maiúsculas sem acento e aperta demais assim que aparece português. Em corpo de 84px o `À` sobe 82,1px acima da linha de base enquanto 0,95 só oferece 79,8px, então o acento entra na linha de cima por 3,3px. O `Ç` piora pelo outro lado, descendo 17,8px abaixo da própria base.

O gerador resolve a entrelinha a partir dos glifos que estão de fato compostos, par a par, e usa o maior valor entre 0,95 e o mínimo seguro. Uniforme no bloco inteiro, porque variar linha a linha vira outro defeito. O build avisa quando precisa ajustar.

### Aplicação aprovada — primeiro vídeo e live Dia 1

As duas peças aprovadas usam a mesma estrutura espacial e variam apenas o conteúdo e o estado:

| Aplicação | Kicker/sinal | Headline | Foto |
| --- | --- | --- | --- |
| Primeiro vídeo | `PRODUTOS REAIS COM IA` em azul | `AQUI ESTÁ / O PORQUÊ.` | `v2_frame_t70.png` |
| Live Dia 1 | `AO VIVO` em vermelho | `CONSTRUINDO / PRODUTOS REAIS COM IA` | `src/foto.jpg` |

O primeiro vídeo usa o kicker editorial; a live usa o selo de estado. Essa diferença é funcional e não cria duas identidades visuais.

### Foto e integração

Foto ampliada, com fundo preservado quando ele fizer parte do enquadramento aprovado, ocupando a faixa direita e sangrando nas bordas do quadro. O fade horizontal faz a integração com o fundo escuro.

| Formato | Área da foto | Posição |
| --- | --- | --- |
| Horizontal 1280×720 | 560×720 | x 720, faixa direita, sangra no quadro |
| Vertical 1080×1920 | a definir na adaptação | preservar a dominância da foto sem cobrir a headline |

### Barra inferior

O padrão horizontal aprovado usa uma barra inferior de 8px em `#4DA3FF`. Ela funciona como fechamento estrutural e não como decoração. Não deve receber texto, glow ou gradiente.

## Zonas seguras do vertical

| Restrição | Limite |
| --- | --- |
| Rosto dentro do corte quadrado do perfil | entre y 950 e y 1450 |
| Legenda do Reels cobre a base | nada essencial abaixo de y 1620 |
| Botões da interface ficam à direita | nada essencial à direita de x 930 |

## Material fotográfico aprovado

Promovido em 2026-08-23. O pool de fontes fotográficas aprovadas para thumbnails passa a ser `brand-assets/profile/leo-ferraz/`. São PNGs com canal alfa, camiseta preta e enquadramento até o peito. A promoção vale para novas variações e não substitui automaticamente a composição publicada em `v1-reference-pattern`.

| Arquivo | Resolução | Registro |
| --- | --- | --- |
| `leo-ferraz-cutout-front.png` | 1374×1145 | frontal, sorrindo, olhando para a câmera |
| `leo-ferraz-cutout-smile-three-quarter.png` | 1360×1156 | sorriso em três quartos |
| `leo-ferraz-cutout-present-right.png` | 1340×1174 | gesto apresentando à direita |
| `leo-ferraz-cutout-neutral.png` | 1320×1192 | expressão contida |
| `leo-ferraz-cutout-present-left.png` | 1319×1192 | gesto apresentando à esquerda |
| `leo-ferraz-cutout-arms-crossed.png` | 1122×1402 | braços cruzados, autoridade para live |

Todos superam as áreas reservadas para composições com recorte. As novas variações devem ser geradas no pack `brand-assets/thumbnails/versions/v2-approved-founder-cutouts/` e espelhadas em `brand-assets/exports/day-1/05-youtube/versions/v2-approved-founder-cutouts/`. O diretório `v1-reference-pattern` continua registrando as composições publicadas e não deve ser sobrescrito por estas variações.

### Regra de promoção

- `brand-assets/profile/leo-ferraz/` é a fonte aprovada dos retratos recortados;
- `brand-assets/thumbnails/versions/v2-approved-founder-cutouts/` é o pack persistente de composição;
- `brand-assets/exports/day-1/05-youtube/versions/v2-approved-founder-cutouts/` é o espelho de entrega para comparação;
- cada arquivo deve preservar a mesma headline, grid, safe zone, barra inferior e hierarquia do Reference Pattern;
- as variações são fontes aprovadas para produção, mas não alteram sozinhas qual composição está publicada em `day-1/05-youtube/`.

**Procedência.** A troca de terno azul por camiseta preta não é resultado de recorte, então houve geração ou edição de conteúdo na produção desses arquivos. A ressalva da [[DECISAO-010]] sobre retrato sintético e a pendência aberta da [[DECISAO-011]] continuam valendo e foram levantadas com o fundador antes do uso. A decisão de seguir é dele, com autoridade registrada em `brand/BRAND_FOUNDATION.md`.

## Enquadramento necessário

Cabeça, ombros e peito com escala suficiente para reconhecimento imediato. Na aplicação horizontal aprovada, o rosto ocupa a faixa direita e a base sangra no quadro; a headline permanece na faixa esquerda, sem colisão com a área focal da pessoa.
