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
node scripts/check-video-quality.mjs videos/v2/youtube-horizontal/arquivo.mp4 youtube
```

Checa resolução declarada, bitrate contra o alvo da plataforma, codec e pixel format, áudio, e a resolução efetiva pelo teste de PSNR. O que resta para o olho é o enquadramento e a trepidação.

## Onde os entregáveis corrigidos ficam

`scripts/rebuild-video.mjs` grava direto em `videos/v2/<plataforma>/` — `youtube-horizontal/` ou `tiktok-vertical/` — não mais em `videos/edit/entrega/` ou `videos/edit/vertical/`, que continuam guardando os arquivos de trabalho e a entrega original (v1). `videos/v2/` centraliza só o que este diagnóstico produziu: vídeo corrigido, capa, miniatura, legenda e pacote de SEO, um por plataforma.

## Reexportação de 2026-08-21: o que mudou e o que não mudou

`scripts/rebuild-video.mjs` reconstrói a edição direto dos `.MOV` da câmera, num único encode. É possível porque `edl.json` registra `grade: "none"` — não há trabalho de cor guardado nos intermediários que se perderia ao pular por cima deles. Os 34 cortes e as 11 inserções são a edição inteira.

| | Bitrate | PSNR do teste | Áudio |
| --- | --- | --- | --- |
| YouTube publicado | 2,79 Mbps | 51,8 dB | 198 kbps |
| **YouTube reconstruído (cor corrigida)** | **5,22 Mbps** | **48,4 dB** | **301 kbps** |
| TikTok publicado | 2,03 Mbps | 52,0 dB | 197 kbps |
| **TikTok reconstruído (cor corrigida)** | **4,63 Mbps** | **50,7 dB** | **301 kbps** |

No horizontal o ganho é real: mais bits e, sobretudo, PSNR **3,2 dB menor** — quanto menor, mais detalhe fino sobreviveu.

**No vertical o bitrate dobrou e o PSNR quase não se moveu (52,0 → 51,1).** Esse é o resultado mais importante da reexportação: com uma única geração de encode e o dobro dos bits, a nitidez do vertical praticamente não mudou. **O gargalo do vertical não é a exportação, é a geometria** — um recorte 9:16 de um quadro 1080p tem 607px de largura e não existe parâmetro de encode que invente os 473px que faltam.

É a confirmação experimental de que gravar em 4K não é preferência, é a única correção possível para o formato vertical.

### Fidelidade da reconstrução

O arquivo reconstruído tem 105,50s contra 105,97s do publicado — cerca de meio segundo de deriva acumulada nos 34 cortes. Comparando quadros nos mesmos instantes, a cena e o enquadramento são os mesmos; a diferença é de alguns frames de deslocamento, não de edição.

**Consequência prática:** `legendas.srt` e `capitulos.txt` foram sincronizados com o corte publicado. Se o reconstruído for ao ar, os dois precisam ser reconferidos.

## Defeito na segunda reexportação: cards recortados como se fossem câmera

O fundador reportou, com captura de tela, que as cenas com telas gráficas (as inserções geradas por IA — não o rosto) vieram com texto cortado nas bordas laterais na versão vertical, formatadas como se fosse recorte de vídeo horizontal.

Causa: o script aplicava `crop=ih*9/16:ih,scale=1080:1920` no vídeo inteiro já composto — câmera **e** cards juntos — depois de todos os overlays serem escalados para 1920×1080. Um recorte central de 607px de largura é o comportamento certo para o rosto, centralizado no quadro. É o comportamento errado para um card de texto desenhado para ocupar os 1920px inteiros: o recorte central descarta as bordas onde parte do texto está.

**A correção não precisou inventar nada.** O projeto já tinha, gerados à parte, os pares verticais nativos de cada card e broll usado na edição — `v_manifesto`, `v_t1_anos`, `v_t2_verbos`, `v_caminho`, `v_t3_processo`, `v_t4_numeros`, `v_t5_negacoes`, `v_t6_escolha`, `v_t7_radar`, `vb_clientes`, `vb_site` — todos já em 1080×1920, com a mesma duração dos horizontais (conferido, diferença menor que meio frame). O script passou a apontar para esses arquivos na build vertical, sem escalá-los, e a aplicar o recorte de câmera **antes** da composição dos overlays, não depois — assim o card entra na composição já do tamanho certo, e o recorte de 9:16 nunca vê o card, só a filmagem.

Falha explícita, não fallback silencioso: se um card usado na edição não tiver par vertical mapeado, o script lança erro em vez de recortar errado por padrão.

## O horizontal já recebeu o mesmo tratamento — e um teste que provou o limite oposto

O fundador perguntou, por lógica, se o defeito sinalizado no vertical também afetava o horizontal, pedindo o mesmo tratamento para o YouTube.

**A resposta é: em parte já estava feito, e a parte que faltava tem uma causa diferente.** `rebuild-video.mjs` aplica o tonemap HLG→SDR à mesma fonte de câmera para os dois formatos — o commit que corrigiu a cor (`3644635`) já cobriu YouTube e TikTok juntos, não só o vertical. O `check-video-quality.mjs` roda limpo em cor nos dois desde então.

O que restava era a falha de "resolução efetiva" que o gate reporta no horizontal (PSNR ~48,4 dB). No vertical essa falha tinha causa geométrica provada (recorte 9:16 de 607px reais esticado para 1080). Para o horizontal, sem recorte nenhum, a hipótese natural era: falta bitrate.

**Testado, não assumido.** Peguei um segmento de 5s do rosto, reencodei três vezes só variando o CRF — 17 (o que está em produção), 12 e 8 (quase sem perdas) — e medi o mesmo teste de PSNR em cada um:

| CRF | Bitrate do segmento | PSNR do teste |
| --- | --- | --- |
| 17 (atual) | 8,5 Mbps | 49,2 dB |
| 12 | 20,1 Mbps | 48,8 dB |
| 8 (quase sem perdas) | 40,5 Mbps | 48,3 dB |

**Cinco vezes mais bits moveram o resultado em 0,9 dB.** Isso descarta bitrate como causa: o teto não é de compressão, é da própria captação. Uma filmagem 1080p com profundidade de campo rasa (o fundo desfocado de propósito) simplesmente não carrega detalhe espacial acima de ~1152px equivalentes, não importa quantos bits se gaste codificando. É o mesmo teto que a matemática do recorte vertical provou, chegando por um caminho diferente: 1080p é o limite, e só existe um jeito de superá-lo, que é gravar em 4K.

**Por isso o horizontal não foi reexportado com CRF mais baixo.** Inflar o arquivo para ganhar 0,9 dB imperceptível seria o mesmo erro que o PDF do TikTok descreve como causa 3 de baixa qualidade, só que ao contrário: gastar recurso sem ganho real. O CRF 17 atual (5,22 Mbps médio) já está no ponto de eficiência — mais bits daqui não compram mais nitidez.

## Limite do teste de resolução efetiva

O PSNR alto indica ausência de detalhe fino, o que pode vir de três causas: ampliação, compressão agressiva ou uma cena naturalmente lisa. O vídeo em questão tem muito fundo escuro e cards gráficos, que elevam a medida por conta própria.

Por isso a medição foi confirmada num quadro com rosto e textura, onde deu **51,0 dB** — ali não há explicação inocente. O teste é um alarme confiável, não uma prova isolada: quando ele dispara, a causa se confirma olhando bitrate e cadeia de encode, como acima.

## Alvos de bitrate: de onde vêm

**YouTube: 8 Mbps** é a recomendação publicada para 1080p30 SDR.

O gate trata bitrate como **aviso**, não como falha. Estes exports usam qualidade constante (CRF), em que uma cena simples produz menos bits com a mesma qualidade visual: o arquivo reconstruído fica em 4,92 Mbps e mede mais nítido que o publicado. Um portão que reprova arquivo bom acaba ignorado, e aí não protege nada.

**TikTok: 10 Mbps** é escolha nossa — a plataforma não publica número. O critério é que o TikTok recomprime na ingestão, então entrar alto é o único controle que resta do nosso lado.
