---
title: "Léo Digital — Manifesto da Série 001"
document_type: production_manifest
status: draft
date: 2026-08-28
project: Leo Ferraz
tags:
  - cofre/execucao
  - tema/conteudo
  - tema/identidade-founder
  - projeto/leo-ferraz-dev
evidence: "ffprobe confirmou dez fontes 720x1280, 24 fps, aproximadamente 10 segundos, H.264 e AAC estéreo em 2026-08-28."
next_action: "Usar o manifesto para anexar cada vídeo-base ao prompt correspondente na plataforma externa."
related:
  - "[[../../03_CONTEUDO/COPY-001 - Léo Digital Série 001]]"
  - "[[../../03_CONTEUDO/PROMPT-001 - Léo Digital Série 001]]"
  - "[[2026-08-28 — Especificação de Montagem do Léo Digital]]"
---

# Léo Digital — Manifesto da Série 001

## Escopo

Este manifesto associa os dez vídeos-fonte existentes às dez funções editoriais da série de validação de demanda. Os arquivos-fonte permanecem somente como referência e não devem ser sobrescritos.

## Verificação técnica das fontes

Todos os dez arquivos foram inspecionados localmente com `ffprobe` em 2026-08-28.

- quantidade confirmada: 10 MP4;
- resolução confirmada: 720×1280;
- proporção confirmada: 9:16;
- taxa de quadros confirmada: 24 fps;
- duração confirmada: 10,005 s por arquivo;
- vídeo confirmado: H.264;
- áudio técnico confirmado: AAC, 48 kHz, 2 canais;
- sem validação semântica de fala: a presença do stream de áudio não prova que exista fala inteligível.

## Mapa de produção

| Peça | Fonte exata | Função | Descrição visual observada | Risco/critério de atenção | Estado |
|---|---|---|---|---|---|
| 01 | `videos/reels/08_leo_ferraz_typing_on_laptop_202608271724.mp4` | Demonstração | Léo trabalha, há aproximação e fechamento com gesto de aprovação | Verificar se o gesto não disputa atenção com o hook | Fonte selecionada |
| 02 | `videos/reels/06_leo_ferraz_typing_on_laptop_202608271724.mp4` | Transparência | Projeção azul de código atravessa corpo e rosto durante o trabalho | Estética mais abstrata; não deixar a cena sugerir produto inexistente | Fonte selecionada |
| 03 | `videos/reels/03_leo_ferraz_typing_on_laptop_202608271724.mp4` | Bastidor | Montagem técnica com monitor, teclado, rosto e mudanças rápidas de plano | Ritmo pode competir com a leitura; validar cada corte sob texto | Fonte selecionada |
| 04 | `videos/reels/02_leo_ferraz_typing_on_laptop_202608271710.mp4` | Dor | Alterna close do olhar, ambiente de trabalho, mãos e telas | Garantir área de texto segura em todos os planos | Fonte selecionada |
| 05 | `videos/reels/05_leo_ferraz_typing_on_laptop_202608271724.mp4` | Gargalo | Perfil, teclado, ambiente e retorno ao rosto em ritmo mais lento | Pode exigir headline mais curta para não parecer estático | Fonte selecionada |
| 06 | `videos/reels/01_leo_ferraz_typing_on_laptop_202608271707.mp4` | Formato | Plano de trabalho mais amplo, mãos, monitores e rosto | Headline não deve esconder o contexto de produto/código | Fonte selecionada |
| 07 | `videos/reels/07_leo_ferraz_typing_on_laptop_202608271724.mp4` | Estratégia | Plano médio quase contínuo de Léo digitando | Ativo mais fraco em ritmo; só publicar se o texto gerar tensão suficiente | Fonte selecionada com ressalva |
| 08 | `videos/reels/09_leo_ferraz_typing_on_laptop_202608271724.mp4` | Aplicação | Trabalho, pausa para café e retorno à tarefa | A legenda precisa conectar rotina a uma situação comercial concreta | Fonte selecionada |
| 09 | `videos/reels/04_leo_ferraz_typing_on_laptop_202608271724.mp4` | Pesquisa | Monitor, reflexão, ajuste de óculos, rosto e plano amplo | Evitar tom de diagnóstico universal | Fonte selecionada |
| 10 | `videos/reels/10_leo_ferraz_typing_on_laptop_202608271724.mp4` | Convite ao piloto | Léo trabalha, recosta, sorri e retorna à tarefa | CTA deve permanecer na legenda; o sorriso não pode virar promessa | Fonte selecionada |

## Prioridade inicial

Os candidatos prioritários para o primeiro ciclo são as peças 01, 03, 04 e 10, por combinarem melhor demonstração visual, variedade de ritmo, reconhecimento facial e possibilidade de conexão com uma dor ou conversa comercial. A peça 07 permanece experimental e não será publicada automaticamente.

## Critério de passagem para render

Uma fonte só passa para render quando o enquadramento permitir: headline principal isolada no início, headline de transição posterior, leitura em tela de celular e preservação do rosto, olhos, mãos e elementos de trabalho relevantes. Se um defeito de geração ou crop impedir isso, registrar a reprovação e selecionar uma fonte reserva sem sobrescrever o original.

## Evidência da inspeção

Comando utilizado:

```powershell
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,codec_name -of csv=p=0 <arquivo.mp4>
ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 <arquivo.mp4>
ffprobe -v error -select_streams a:0 -show_entries stream=codec_name,channels,sample_rate -of csv=p=0 <arquivo.mp4>
```

Resultado: dez fontes confirmadas com as propriedades técnicas descritas acima.
