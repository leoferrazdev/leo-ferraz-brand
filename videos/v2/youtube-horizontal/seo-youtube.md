# Pacote de publicação — YouTube (vídeo 001)

## Título  (56 caracteres — abaixo do corte de ~60)

Vou Construir Produtos Reais com IA. Aqui Está o Porquê.

Aprovado na DECISAO-008. Carrega a palavra-chave logo no início
("Construir Produtos Reais com IA") e não trunca no celular.

## Descrição

> As duas primeiras linhas são as únicas visíveis antes do "mostrar mais".
> É onde a palavra-chave precisa estar.

Construo, lanço e testo produtos digitais reais usando IA — SaaS, aplicativos,
jogos e experimentos. E mostro o que acontece, inclusive quando dá errado.

Este vídeo marca o início do canal: por que ele existe e o que você vai
encontrar aqui a partir de agora. Sem atalhos e sem promessa milagrosa.
Você vai ver a ideia, a decisão técnica, o desenvolvimento, o lançamento —
e os números: quanto custou, quanto gerou, se deu lucro ou prejuízo.

Se um projeto gerar zero, eu mostro.

CAPÍTULOS
00:00 O que é este projeto — construir com IA e mostrar o resultado
00:23 Onde eu já uso IA, e por que mostrar o processo inteiro
00:47 O que você vai ver — inclusive os números
01:01 O que este projeto NÃO é
01:14 O primeiro projeto ainda não foi decidido
01:27 Como acompanhar

O QUE ESTE CANAL NÃO É
Não é curso. Não é mentoria. Não é canal de notícia sobre inteligência
artificial.

ONDE MAIS ACOMPANHAR
Site e todos os canais: https://leoferraz.dev
Contato: leo@leoferraz.dev

#ConstruirComIA #ProdutosDigitais #BuildInPublic

## Tags

construir produtos com IA, produtos reais com IA, IA na prática,
inteligência artificial na prática, build in public, construir em público,
SaaS com IA, desenvolvimento com IA, criar produto digital, documentar projeto,
Leo Ferraz, AI-Native Product Lab, empreender com IA, do zero ao produto

## Revisão focada em recomendação (2026-08-21)

Título, descrição e tags foram aprovados em `DECISAO-008`, então esta é uma
revisão em cima do que existe, não uma reescrita — nenhuma palavra da copy
acima foi trocada.

**Título e primeiras duas linhas da descrição: nada a mudar.** A palavra-chave
já abre as duas, que é onde o YouTube pesa mais para casar busca e
recomendação, e o título não trunca no celular. Reescrever aqui só
arriscaria o que já está calibrado.

**Não adicionei palavras-chave de ferramenta ("Claude Code", "Codex") às
tags.** Esse vocabulário específico rendeu bem na descrição fixa das lives
(`live/DESCRICAO.md`) porque aquelas transmissões realmente usam essas
ferramentas em cena. Este vídeo é o manifesto do canal — a narração não
cita nenhuma ferramenta por nome. Colocar esses termos aqui só para pescar
busca criaria descompasso entre palavra-chave e conteúdo, que o YouTube lê
como sinal negativo de relevância (audiência que clica pela tag e não
encontra o que buscava cai o tempo de exibição, e isso pesa contra
recomendação futura mais do que a tag ajuda a entrar no vídeo).

**O ganho real de recomendação nesta rodada não está na copy, está na
entrega.** O YouTube usa retenção e qualidade técnica percebida como sinais
de peso — o vídeo corrigido troca 2,79 por 5,22 Mbps de bitrate, uma única
geração de encode em vez de três, e cor correta em vez de brilho estourado.
Isso ataca a causa que provavelmente já limitava a recomendação da v1: um
vídeo que abandona o espectador aos poucos por parecer amador perde retenção
antes que título ou tag consigam compensar.

## Legendas

Subir `legendas-v2.srt`, não `legendas.srt`. O arquivo original foi
cronometrado contra a v1, publicada em 2026-08-20; a reexportação que corrigiu
cor e geração de encode (`produtos-reais-com-ia-leo-ferraz-01-v2.mp4`) tem
duração ligeiramente diferente, e a deriva entre as duas cresce ao longo do
vídeo — de ~20ms no início a ~420ms no final, medida por correlação de áudio.
Legenda velha em vídeo novo desalinharia progressivamente até o fim.

`legendas-v2.srt` foi reconstruído a partir de `edl.json`, que registra o
texto exato de cada um dos 34 cortes com seu tempo de origem — a mesma
aritmética que gerou o `v2` (soma cumulativa das durações dos cortes), não uma
estimativa. Validado contra a transcrição palavra a palavra em três pontos
espalhados pelo vídeo: cada bloco começa uns 50ms antes da primeira palavra
falada, sempre a mesma margem, que é a pré-carga natural do corte — não uma
falha de sincronismo.

O bloco CAPÍTULOS acima já está com os tempos corrigidos; a versão à parte
vive em `capitulos-v2.txt` (`capitulos.txt`, sem sufixo, continua correto para
a v1 e não deve ser usado com este vídeo).

Importa por dois motivos: o YouTube indexa o texto das legendas para busca, e
a legenda automática em pt-BR erra nomes próprios e termos técnicos.

## Miniatura

`thumb_v2.jpg`, nesta mesma pasta. A publicada em 2026-08-20 foi
`ab_1.jpg`, não `thumb_A.jpg` como este arquivo dizia — a recomendação nunca
chegou a ir ao ar. `thumb_v2` reaproveita o layout de `ab_1` com um frame do
material corrigido e uma headline distinta ("Aqui está o porquê."), pensada
para comparar desempenho contra a publicação anterior.

## Antes de publicar

- [ ] Idioma do vídeo: Português (Brasil)
- [ ] Legenda: subir `legendas-v2.srt` (não `legendas.srt`), não confiar na automática
- [ ] Categoria: Ciência e tecnologia
- [ ] "Não é conteúdo para crianças"
- [ ] Miniatura personalizada
- [ ] Playlist: criar uma para a série e já incluir
- [ ] Tela final e cards só depois de existir um segundo vídeo
