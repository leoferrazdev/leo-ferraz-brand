# Qualidade de vídeo: diagnóstico e protocolo

Derivado da orientação do TikTok (`videos/tiktok-qualidade.txt`, extraída do PDF enviado pela plataforma) cruzada com a medição do vídeo publicado em 2026-08-20.

## O que foi medido

Cadeia completa, do arquivo da câmera até o que subiu para cada plataforma:

| Etapa | Codec | Resolução | Bitrate de vídeo |
| --- | --- | --- | --- |
| `IMG_3941.MOV` (câmera) | HEVC | 1920×1080 | **16,0 Mbps** |
| `edit/base.mp4` | H.264 | 1920×1080 | 6,85 Mbps |
| `edit/final_raw.mp4` | H.264 | 1920×1080 | 2,79 Mbps |
| `entrega/…-01.mp4` (YouTube) | H.264 | 1920×1080 | **2,79 Mbps** |
| `vertical/completo.mp4` (TikTok) | H.264 | 1080×1920 | **2,03 Mbps** |
| `vertical/curto.mp4` (TikTok) | H.264 | 1080×1920 | **1,88 Mbps** |

**A entrega ao TikTok carrega 12% do bitrate que saiu da câmera.**

## O que não é o problema

A exposição está correta. Medida nos recortes de rosto que o próprio pipeline gerou, a luminância média fica entre **110 e 123 de 255**, com 15–17% de pixels claros — faixa adequada para pele bem exposta.

Isso descarta a maior parte do checklist do PDF: contraluz, lente suja, ambiente escuro. O material bruto está bom. **O problema é inteiramente de processamento e exportação**, que é a segunda das três categorias que o próprio documento do TikTok lista.

## O que é o problema

### 1. Resolução declarada não é resolução real

O teste: reduzir um quadro a 60% e ampliá-lo de volta. Se a imagem resultante for idêntica à original, o detalhe naquela faixa nunca existiu.

| Entrega | PSNR do teste | Leitura |
| --- | --- | --- |
| YouTube 1920×1080 | **51,8 dB** | sem detalhe real acima de ~1152px |
| TikTok 1080×1920 | **52,0 dB** | sem detalhe real acima de ~648px |

Acima de 45 dB duas imagens são visualmente indistinguíveis. Os dois arquivos declaram 1080p e nenhum dos dois entrega 1080p de definição.

No vertical há uma causa geométrica além da compressão: um quadro 9:16 recortado de um 1920×1080 tem no máximo **607px de largura**, e foi esticado para 1080. O arquivo diz 1080×1920 e o conteúdo tem pouco mais da metade disso.

### 2. Três gerações de recompressão

`MOV → base.mp4 → final_raw.mp4 → vertical/*.mp4`. Cada passo é uma codificação H.264 com perda sobre o resultado da anterior. O documento do TikTok é explícito: *"evite recodificar o arquivo no processo"*.

### 3. Envio em HD do TikTok

O PDF trata isso como uma das três causas principais e é a mais barata de corrigir: sem ativar a opção, a plataforma publica abaixo do que o arquivo permite, mesmo que o arquivo esteja impecável.

## Protocolo

### Na origem — a correção que vale por cinco

**Gravar em 4K (3840×2160), não em 1080p.** É a única ação que resolve o corte vertical de forma definitiva: um recorte 9:16 de um quadro 4K tem 1215px de largura, acima dos 1080 de destino, então o vertical passa a ser uma redução — nunca uma ampliação.

O PDF pede "1080p ou superior". Para quem publica vertical a partir de material horizontal, 1080p é exatamente o mínimo que **não** basta.

### Na edição — uma única geração com perda

Converter os originais uma vez para um intermediário de edição e trabalhar sobre ele:

```bash
ffmpeg -i IMG_3941.MOV -c:v prores_ks -profile:v 3 -c:a pcm_s16le edit/src/IMG_3941.mov
```

Todo corte, grade e overlay acontece nesse espaço. **Um único encode com perda, no fim, direto para cada entrega** — nunca reexportando um MP4 já comprimido.

### Na exportação — parâmetros

YouTube 1080p30:

```bash
ffmpeg -i <fonte> -c:v libx264 -preset slow -crf 17 -maxrate 16M -bufsize 32M -pix_fmt yuv420p -profile:v high -c:a aac -b:a 320k -ar 48000 -movflags +faststart entrega.mp4
```

TikTok 1080×1920, recortando de um master 4K:

```bash
ffmpeg -i <fonte4k> -vf "crop=ih*9/16:ih,scale=1080:1920:flags=lanczos" -c:v libx264 -preset slow -crf 16 -maxrate 20M -bufsize 40M -pix_fmt yuv420p -profile:v high -c:a aac -b:a 320k -ar 48000 -movflags +faststart vertical.mp4
```

O CRF mais baixo no vertical é deliberado: o TikTok recomprime tudo na ingestão, e o que se perde antes do envio não volta.

### No envio

Ativar **"Permitir carregamentos de alta qualidade"** em Mais opções, antes de publicar. Uma vez por publicação, sempre.

### Antes de publicar — a verificação de quatro pontos, medida

O PDF pede para confirmar quatro coisas a olho. `scripts/check-video-quality.mjs` verifica o que é mensurável e falha com código de saída:

```bash
node scripts/check-video-quality.mjs videos/edit/entrega/arquivo.mp4 youtube
```

Checa resolução declarada, bitrate contra o alvo da plataforma, codec e pixel format, áudio, e a resolução efetiva pelo teste de PSNR. O que resta para o olho é o enquadramento e a trepidação.

## Limite do teste de resolução efetiva

O PSNR alto indica ausência de detalhe fino, o que pode vir de três causas: ampliação, compressão agressiva ou uma cena naturalmente lisa. O vídeo em questão tem muito fundo escuro e cards gráficos, que elevam a medida por conta própria.

Por isso a medição foi confirmada num quadro com rosto e textura, onde deu **51,0 dB** — ali não há explicação inocente. O teste é um alarme confiável, não uma prova isolada: quando ele dispara, a causa se confirma olhando bitrate e cadeia de encode, como acima.

## Alvos de bitrate: de onde vêm

**YouTube: 8 Mbps** é a recomendação publicada para 1080p30 SDR.

**TikTok: 10 Mbps** é escolha nossa — a plataforma não publica número. O critério é que o TikTok recomprime na ingestão, então entrar alto é o único controle que resta do nosso lado.
