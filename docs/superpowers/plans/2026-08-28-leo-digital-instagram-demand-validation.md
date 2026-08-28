# Léo Digital — Instagram Demand Validation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produzir e testar uma primeira série de dez Reels silenciosos com o Léo Digital para gerar conversas qualificadas com pessoas que já possuem uma oferta e validar a demanda por um piloto pago de conteúdo comercial.

**Architecture:** A série será organizada como um pacote editorial separado da identidade canônica da marca. Cada peça terá um ativo visual, uma headline principal isolada, uma headline posterior de encaminhamento para a legenda, uma legenda que cumpre a promessa do hook e um único CTA. A produção será feita em gates: preparação editorial → renderização → QA → publicação controlada → registro de sinais → decisão.

**Tech Stack:** Vídeos MP4 verticais existentes em `videos/reels/`; pipeline de geração de face swap/video variation evidenciado nas screenshots; editor de vídeo aprovado pelo responsável; tipografia e tokens aprovados da marca; Instagram; Markdown compatível com Obsidian; `ffprobe`/`ffmpeg` para inspeção técnica e validação local.

## Global Constraints

- O objetivo econômico desta fase é validar conversas qualificadas e um piloto pago, não vender um infoproduto nem prometer alcance.
- O público inicial compreende fundadores e empresários, criadores e especialistas que já possuem uma oferta real; o ICP final permanece não validado.
- O Reel deve ser vertical 9:16, com duração inicial aproximada de 6–10 segundos, sem fala sintética e sem lip-sync artificial.
- A primeira headline aparece sozinha no início; a segunda entra depois de alguns segundos e aponta para o complemento na legenda.
- A segunda headline não substitui o CTA; a legenda precisa cumprir a promessa do hook antes de pedir qualquer ação.
- O áudio pode ser ambiente, musical ou trend, mas nunca pode ser necessário para compreender a mensagem.
- O uso do Léo Digital deve permanecer subordinado a produto, processo, evidência e ação comercial; não transformar Leo Ferraz em perfil de demonstração de ferramenta ou marca de avatar.
- Conteúdo, legenda e CTA devem ser predominantemente em PT-BR, preservando `Leo Ferraz`, `Building with AI`, `AI-Native Product Lab`, `@leoferrazdev` e `leoferraz.dev`.
- Não inventar clientes, resultados, depoimentos, materiais para entrega, métricas, alcance ou promessa de viralização.
- Não alterar `brand/*.md`, tokens ou decisões canônicas durante a produção desta série.
- O uso de IA deve ser tratado com transparência quando for relevante ao contexto e às regras da plataforma.
- Nenhuma hipótese será considerada validada por visualizações, curtidas ou elogios à semelhança facial; o gate econômico exige comprador independente pagando por um piloto e evidência de margem positiva ou continuidade clara.

---

## Mapa de arquivos e responsabilidades

O pacote de execução deverá separar documentação editorial, fontes visuais, exports e evidência de publicação:

- Create: `docs/content/leodigital/2026-08/series-001/series-manifest.md` — inventário, função editorial, ativo primário, ativo reserva e estado de cada peça.
- Create: `docs/content/leodigital/2026-08/series-001/editorial-package.md` — headlines finais, legendas, CTAs e instruções de qualificação das dez peças.
- Create: `docs/content/leodigital/2026-08/series-001/render-spec.md` — especificação visual, timing, safe zones, tratamento tipográfico e checklist de renderização.
- Create: `docs/content/leodigital/2026-08/series-001/validation-log.md` — publicação, sinais observados, classificação dos contatos e decisão de continuidade.
- Create: `videos/reels/leodigital/2026-08/series-001/exports/` — somente os exports aprovados para publicação, com nomes numerados e versão explícita.
- Create: `videos/reels/leodigital/2026-08/series-001/rejected/` — renders rejeitados por qualidade, enquadramento, texto, sincronização ou inadequação editorial, preservados para auditoria.
- Modify: `cofre-leoferraz-dev/02_EXECUCAO/2026-08/2026-08-28 — Léo Digital e validação de demanda no Instagram.md` — registrar execução, evidências, decisões e pendências sem substituir a especificação canônica.

Não modificar os dez arquivos-fonte atuais em `videos/reels/`; eles são referências de produção e devem permanecer preservados.

## Task 1: Congelar o inventário dos dez ativos

**Files:**
- Create: `docs/content/leodigital/2026-08/series-001/series-manifest.md`
- Read: `videos/reels/01_leo_ferraz_typing_on_laptop_202608271707.mp4`
- Read: `videos/reels/02_leo_ferraz_typing_on_laptop_202608271710.mp4`
- Read: `videos/reels/03_leo_ferraz_typing_on_laptop_202608271724.mp4`
- Read: `videos/reels/04_leo_ferraz_typing_on_laptop_202608271724.mp4`
- Read: `videos/reels/05_leo_ferraz_typing_on_laptop_202608271724.mp4`
- Read: `videos/reels/06_leo_ferraz_typing_on_laptop_202608271724.mp4`
- Read: `videos/reels/07_leo_ferraz_typing_on_laptop_202608271724.mp4`
- Read: `videos/reels/08_leo_ferraz_typing_on_laptop_202608271724.mp4`
- Read: `videos/reels/09_leo_ferraz_typing_on_laptop_202608271724.mp4`
- Read: `videos/reels/10_leo_ferraz_typing_on_laptop_202608271724.mp4`

**Interfaces:**
- Consumes: os dez MP4 existentes e a análise visual já registrada na especificação aprovada.
- Produces: uma linha de inventário por vídeo, com filename exato, duração, resolução, áudio técnico, descrição de ação, função editorial, risco visual e ordem de publicação sugerida.

- [ ] **Step 1: Confirmar a lista exata de fontes**

Run:

```powershell
Get-ChildItem "videos/reels" -File -Filter "*.mp4" | Sort-Object Name | Select-Object Name,Length
```

Expected: exatamente dez arquivos MP4 numerados de `01` a `10`, sem incluir renders derivados.

- [ ] **Step 2: Inspecionar propriedades técnicas**

Run `ffprobe` para cada arquivo e registrar no manifesto: `width`, `height`, `r_frame_rate`, `codec_name`, duração, codec de áudio, canais e sample rate.

Expected: os dez ativos existentes permanecem em 720×1280, proporção vertical 9:16, aproximadamente dez segundos, H.264, 24 fps, com stream AAC estéreo; divergências devem ser registradas como risco, não corrigidas silenciosamente.

- [ ] **Step 3: Associar cada ativo a uma função**

Usar esta ordem inicial, mantendo a possibilidade de rejeitar um ativo no QA:

| Peça | Fonte inicial | Função |
|---|---|---|
| 01 | `08_leo_ferraz_typing_on_laptop_202608271724.mp4` | Demonstração com payoff visual claro |
| 02 | `06_leo_ferraz_typing_on_laptop_202608271724.mp4` | Transparência sobre cena gerada e aparência de IA |
| 03 | `03_leo_ferraz_typing_on_laptop_202608271724.mp4` | Bastidor e processo |
| 04 | `02_leo_ferraz_typing_on_laptop_202608271710.mp4` | Dor de depender da própria presença |
| 05 | `05_leo_ferraz_typing_on_laptop_202608271724.mp4` | Gargalo de publicação recorrente |
| 06 | `01_leo_ferraz_typing_on_laptop_202608271707.mp4` | Relação entre atração visual e legenda |
| 07 | `07_leo_ferraz_typing_on_laptop_202608271724.mp4` | Estratégia, com risco de ritmo estático explicitamente registrado |
| 08 | `09_leo_ferraz_typing_on_laptop_202608271724.mp4` | Aplicação em rotina de trabalho |
| 09 | `04_leo_ferraz_typing_on_laptop_202608271724.mp4` | Pesquisa sobre formato sem fala |
| 10 | `10_leo_ferraz_typing_on_laptop_202608271724.mp4` | Convite ao piloto com fechamento emocional natural |

Expected: cada fonte é usada uma vez na primeira montagem; os ativos `08`, `10`, `01` e `03` ficam marcados como candidatos prioritários de publicação; o ativo `07` exige revisão mais rigorosa e não é publicado automaticamente.

- [ ] **Step 4: Commit do inventário**

```powershell
git add -- "docs/content/leodigital/2026-08/series-001/series-manifest.md"
git commit -m "docs: map Leo Digital Reel production assets"
```

## Task 2: Fechar a matriz editorial e de conversão

**Files:**
- Create: `docs/content/leodigital/2026-08/series-001/editorial-package.md`
- Read: `docs/superpowers/specs/2026-08-28-leo-digital-instagram-demand-validation-design.md`
- Read: `brand/VOICE_AND_LANGUAGE.md`
- Read: `brand/LANGUAGE_ARCHITECTURE.md`
- Read: `brand/BRAND_FOUNDATION.md`

**Interfaces:**
- Consumes: a sequência aprovada de dez peças e o manifesto da Task 1.
- Produces: copy final de cada peça e uma instrução de ação inequívoca para a legenda.

- [ ] **Step 1: Transformar as hipóteses aprovadas em dez pares de headlines**

Usar estes pares como ponto de partida editorial, revisando apenas para clareza, concisão, factualidade e adequação ao ativo escolhido:

| # | Headline principal isolada | Headline posterior para a legenda |
|---|---|---|
| 01 | `Hipótese sobre presença visual consistente` | `O complemento está na legenda` |
| 02 | `A referência é real; a cena é gerada` | `O processo está na legenda` |
| 03 | `Isso não foi um clique` | `Fotos, créditos e tentativas na legenda` |
| 04 | `Seu conteúdo depende de você aparecer?` | `A pergunta completa está na legenda` |
| 05 | `Você tem algo a dizer, mas não publica?` | `O gargalo está na legenda` |
| 06 | `O Reel chama atenção` | `A estratégia continua na legenda` |
| 07 | `Atenção não é uma oferta` | `Veja o próximo passo na legenda` |
| 08 | `Como um fundador usaria isso?` | `Um exemplo está na legenda` |
| 09 | `Você usaria um Reel sem fala?` | `Responda depois de ler a legenda` |
| 10 | `Estou testando este formato com quem já vende` | `Se esse é seu gargalo, envie PILOTO` |

Expected: nenhuma headline promete um resultado não demonstrado, não usa “método”, “escala”, “viral” ou “garantia” sem evidência e não transforma o Léo Digital no produto.

- [ ] **Step 2: Escrever cada legenda em cinco blocos**

Para cada peça, preencher exatamente nesta ordem:

1. reconhecimento do problema ou pergunta;
2. complemento útil prometido pelo hook;
3. limite factual do formato, quando relevante;
4. relação com conteúdo e negócio;
5. um CTA único.

Para a peça 10, usar `Envie PILOTO por DM` somente se a pessoa já possuir uma oferta; não prometer material, aula, template ou entrega que ainda não exista.

Expected: a legenda é compreensível sem assistir ao vídeo, cumpre a promessa antes do CTA e diferencia curiosidade sobre a ferramenta de interesse comercial real.

- [ ] **Step 3: Definir a qualificação em DM**

Quando alguém enviar `PILOTO`, responder uma pergunta curta por vez:

1. `O que você vende hoje?`
2. após a resposta: `Em que parte da produção de conteúdo você mais trava?`
3. após a resposta: `Você já publica com alguma frequência ou ainda está tentando começar?`

Registrar segmento, oferta existente, gargalo e interesse em conversar; não repetir dados já fornecidos nem apresentar preço final antes de entender o cenário.

- [ ] **Step 4: Commit do pacote editorial**

```powershell
git add -- "docs/content/leodigital/2026-08/series-001/editorial-package.md"
git commit -m "docs: define Leo Digital Reel copy package"
```

## Task 3: Definir a especificação visual e o teste de timing

**Files:**
- Create: `docs/content/leodigital/2026-08/series-001/render-spec.md`
- Read: `brand/BRAND_SYSTEM.md`
- Read: `brand/VISUAL_DIRECTION.md`
- Read: `brand/Color.md`
- Read: `brand/PADRAO-CAPAS.md`
- Read: `brand/LIVE_LAUNCH_PACK.md`

**Interfaces:**
- Consumes: manifesto da Task 1, copy da Task 2 e tokens/regras canônicas da marca.
- Produces: instrução única para renderizar as dez peças e matriz de timing para comparação.

- [ ] **Step 1: Fixar o tratamento visual permitido**

Registrar no render spec:

- canvas 1080×1920 para o export final;
- safe zone de 10% nas laterais e 12% no topo/rodapé;
- fundo e composição preservando o caráter `Dark Product Lab`;
- tipografia aprovada IBM Plex Sans, com IBM Plex Mono apenas quando houver motivo funcional;
- texto com contraste alto, hierarquia clara e contenção visual;
- cor neutra escura e azul de precisão quando necessário, sem glow decorativo ou gradiente;
- headline dominante sem cobrir olhos, mãos, teclado ou evidência visual relevante;
- nenhum avatar, nome de outro perfil, ícone de interface, moldura de screenshot ou emoji copiado das referências anexadas.

- [ ] **Step 2: Fixar a sequência de aparição**

Renderizar a primeira versão de cada peça nesta estrutura inicial:

```text
0.00–2.50 s: vídeo sem a segunda headline; headline principal isolada.
2.50–8.00 s: segunda headline aparece e aponta para a legenda; manter a primeira somente se a leitura continuar limpa.
8.00–10.00 s: preservar a composição final sem introduzir uma terceira mensagem.
```

O intervalo de 2,50 segundos é uma hipótese inicial de produção, não um dado validado. Para as peças 01 e 10, produzir uma comparação adicional com entrada da segunda headline em 3,00 segundos e registrar qual versão é mais legível.

- [ ] **Step 3: Definir nomes de export e rejeição**

Usar o padrão:

```text
reel-01-demo-v01.mp4
reel-01-demo-v02-timing-3s.mp4
reel-02-transparencia-v01.mp4
...
reel-10-convite-piloto-v01.mp4
```

Preservar renders rejeitados em `videos/reels/leodigital/2026-08/series-001/rejected/` com o motivo no nome ou no manifesto.

- [ ] **Step 4: Commit da especificação de render**

```powershell
git add -- "docs/content/leodigital/2026-08/series-001/render-spec.md"
git commit -m "docs: specify Leo Digital Reel rendering"
```

## Task 4: Produzir os renders e executar QA técnico-editorial

**Files:**
- Create: `videos/reels/leodigital/2026-08/series-001/exports/reel-01-demo-v01.mp4` até `reel-10-convite-piloto-v01.mp4`
- Create: `videos/reels/leodigital/2026-08/series-001/rejected/`
- Modify: `docs/content/leodigital/2026-08/series-001/series-manifest.md`
- Modify: `docs/content/leodigital/2026-08/series-001/render-spec.md`

**Interfaces:**
- Consumes: fontes MP4, copy final e render spec.
- Produces: dez renders revisáveis, duas variações de timing para as peças 01 e 10 e registro de QA por arquivo.

- [ ] **Step 1: Gerar as dez composições visuais**

Aplicar a mesma estrutura de duas headlines, adaptando posição e quebra de linha ao enquadramento de cada fonte. Não usar fala sintética, lip-sync, promessa de voz ou texto que exija o áudio.

- [ ] **Step 2: Renderizar as duas variações de timing**

Para as peças 01 e 10, gerar `v01` com entrada em 2,50 s e `v02-timing-3s` com entrada em 3,00 s. Selecionar por legibilidade e não por preferência estética isolada.

- [ ] **Step 3: Validar propriedades do export**

Run:

```powershell
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,codec_name -of csv=p=0 "videos/reels/leodigital/2026-08/series-001/exports/reel-01-demo-v01.mp4"
```

Repetir para os dez arquivos e confirmar: 1080×1920, vídeo H.264 ou codec aceito pelo fluxo de publicação, duração entre 6 e 10 segundos, imagem sem barras e sem crop do rosto.

- [ ] **Step 4: Revisar visualmente frame inicial, transição e frame final**

Para cada arquivo, verificar:

- no primeiro frame, a headline principal é a única camada textual;
- a segunda headline só aparece depois do período inicial;
- ambas são legíveis em tela de celular e não ficam sob elementos da interface do Instagram;
- o rosto, olhos, mãos, teclado e monitor não apresentam defeito de geração que altere o sentido;
- não há terceira headline, CTA duplicado ou promessa incompatível com a legenda;
- a composição preserva contenção e não replica literalmente a estética das screenshots.

- [ ] **Step 5: Rejeitar e registrar falhas**

Mover qualquer arquivo que falhe em um critério para `rejected/` e registrar o motivo no manifesto. Motivos válidos incluem: texto ilegível, headline simultânea no início, erro facial, crop, timing confuso, excesso de texto, artefato de IA, áudio necessário ou ausência de correspondência entre Reel e legenda.

- [ ] **Step 6: Commit dos renders aprovados e do QA**

```powershell
git add -- "videos/reels/leodigital/2026-08/series-001" "docs/content/leodigital/2026-08/series-001/series-manifest.md" "docs/content/leodigital/2026-08/series-001/render-spec.md"
git commit -m "feat: render and validate Leo Digital Reel series"
```

## Task 5: Selecionar a ordem de publicação inicial

**Files:**
- Modify: `docs/content/leodigital/2026-08/series-001/series-manifest.md`
- Modify: `docs/content/leodigital/2026-08/series-001/editorial-package.md`

**Interfaces:**
- Consumes: renders aprovados, QA da Task 4 e matriz editorial.
- Produces: lista final de publicação e quatro peças prioritárias para o primeiro ciclo.

- [ ] **Step 1: Aplicar o critério de força visual e comercial**

Pontuar cada peça de 0 a 2 em cinco dimensões: leitura imediata do hook, qualidade facial/movimento, clareza da transição para a legenda, vínculo com uma dor de negócio e CTA executável. Publicar somente peças com pelo menos 1 em cada dimensão e total mínimo de 7/10.

- [ ] **Step 2: Fixar o primeiro ciclo**

Usar como ordem inicial, sujeita ao QA:

1. peça 01 — demonstração;
2. peça 03 — bastidor;
3. peça 04 — dor;
4. peça 10 — convite ao piloto.

Essa ordem apresenta capacidade visual, explica o trabalho, nomeia a dor e só então filtra quem já possui uma oferta.

- [ ] **Step 3: Manter as seis peças restantes como sequência de aprendizagem**

Publicar as peças 02, 05, 06, 07, 08 e 09 após a leitura do primeiro ciclo, mantendo a função de cada uma e sem publicar dez conteúdos indistintos no mesmo período.

- [ ] **Step 4: Commit da ordem de publicação**

```powershell
git add -- "docs/content/leodigital/2026-08/series-001/series-manifest.md" "docs/content/leodigital/2026-08/series-001/editorial-package.md"
git commit -m "docs: order Leo Digital Reel validation sequence"
```

## Task 6: Publicar com registro de evidência e qualificar conversas

**Files:**
- Create: `docs/content/leodigital/2026-08/series-001/validation-log.md`
- Modify: `cofre-leoferraz-dev/02_EXECUCAO/2026-08/2026-08-28 — Léo Digital e validação de demanda no Instagram.md`

**Interfaces:**
- Consumes: ordem de publicação, legendas, CTAs e critérios de sinal qualificado.
- Produces: registro por publicação, evidência de conversas, classificação de contatos e pendências de acompanhamento.

- [ ] **Step 1: Registrar o estado antes de publicar**

Para cada peça, registrar data/hora, filename do export, headline final, legenda final, CTA, disclosure de IA quando aplicável e destino do CTA (`salvar`, resposta, DM, `leoferraz.dev` ou piloto). Não publicar se algum campo estiver ausente.

- [ ] **Step 2: Publicar o primeiro ciclo**

Publicar as peças 01, 03, 04 e 10 na ordem definida, sem impulsionamento na primeira leitura do experimento. O objetivo é observar a qualidade da mensagem e a origem dos sinais, não comprar alcance.

- [ ] **Step 3: Registrar sinais sem confundir curiosidade com demanda**

Classificar cada interação como:

- `curiosidade_visual`: elogio à semelhança ou pergunta sobre a ferramenta;
- `interesse_conteudo`: salvamento, comentário ou pergunta sobre a ideia;
- `dor_reconhecida`: pessoa descreve gargalo recorrente;
- `interesse_comercial`: pergunta sobre escopo, prazo ou investimento;
- `lead_piloto`: pessoa com oferta real aceita conversar sobre piloto pago.

Não contar visualizações, curtidas ou elogios faciais como validação econômica.

- [ ] **Step 4: Qualificar DMs sem vender antes da hora**

Para cada `PILOTO`, aplicar as três perguntas da Task 2, uma por vez. Registrar as respostas sem coletar informação desnecessária e sem prometer preço, resultado ou entrega não definidos.

- [ ] **Step 5: Atualizar o cofre após cada ciclo**

Registrar separadamente decisão, execução, evidência direta, inferência estratégica e pendência. Se nenhuma conversa qualificada ocorrer, registrar `não observado`; não preencher com estimativa.

- [ ] **Step 6: Commit do registro de execução**

```powershell
git add -- "docs/content/leodigital/2026-08/series-001/validation-log.md" "cofre-leoferraz-dev/02_EXECUCAO/2026-08/2026-08-28 — Léo Digital e validação de demanda no Instagram.md"
git commit -m "docs: record Leo Digital Reel validation evidence"
```

## Task 7: Publicar as seis peças restantes e comparar sinais

**Files:**
- Modify: `docs/content/leodigital/2026-08/series-001/validation-log.md`
- Modify: `cofre-leoferraz-dev/02_EXECUCAO/2026-08/2026-08-28 — Léo Digital e validação de demanda no Instagram.md`

**Interfaces:**
- Consumes: evidência do primeiro ciclo e seis exports restantes aprovados.
- Produces: conjunto completo de dez publicações e comparação por função editorial, segmento e tipo de sinal.

- [ ] **Step 1: Revisar o que deve ser mantido, ajustado ou pausado**

Antes das seis publicações restantes, registrar quais hooks tiveram `dor_reconhecida`, `interesse_comercial` ou `lead_piloto`. Ajustar somente headline, timing ou legenda com problema observável; não mudar a hipótese inteira por uma reação isolada.

- [ ] **Step 2: Publicar as seis peças restantes**

Publicar as peças 02, 05, 06, 07, 08 e 09 com o mesmo registro de estado pré-publicação e a mesma taxonomia de sinais.

- [ ] **Step 3: Comparar segmentos sem declarar ICP**

Agrupar contatos por fundador/empresário, criador e especialista, registrando quantidade de conversas e qualidade da dor. A comparação serve para escolher o próximo experimento; não transforma o grupo com mais comentários no ICP final.

- [ ] **Step 4: Commit do ciclo completo**

```powershell
git add -- "docs/content/leodigital/2026-08/series-001/validation-log.md" "cofre-leoferraz-dev/02_EXECUCAO/2026-08/2026-08-28 — Léo Digital e validação de demanda no Instagram.md"
git commit -m "docs: compare Leo Digital Reel demand signals"
```

## Task 8: Executar o gate econômico e decidir o próximo experimento

**Files:**
- Modify: `docs/content/leodigital/2026-08/series-001/validation-log.md`
- Modify: `cofre-leoferraz-dev/02_EXECUCAO/2026-08/2026-08-28 — Léo Digital e validação de demanda no Instagram.md`

**Interfaces:**
- Consumes: dez publicações, registros de interação, DMs qualificadas e eventuais conversas de piloto.
- Produces: decisão documentada entre avançar para piloto pago, ajustar a hipótese, escolher outro segmento ou encerrar o formato.

- [ ] **Step 1: Separar observação de interpretação**

Registrar em tabelas distintas:

| Camada | Exemplos válidos |
|---|---|
| Evidência direta | pessoa declarou oferta, gargalo, interesse, escopo ou investimento |
| Inferência | hipótese de que o formato silencioso ajuda determinada categoria |
| Não observado | ausência de pagamento, margem, continuidade ou replicabilidade |

- [ ] **Step 2: Aplicar o gate de avanço**

Avançar para desenho de piloto pago somente se houver ao menos uma conversa com pessoa que possui oferta real, reconhece gargalo recorrente e aceita discutir escopo, prazo e investimento. Considerar validação econômica somente após pagamento independente e registro de custo/margem.

- [ ] **Step 3: Escolher uma única próxima hipótese**

O registro final deve escolher uma opção concreta:

- testar um piloto pago com o segmento que demonstrou maior dor e intenção;
- revisar a mensagem para o segmento mais responsivo e repetir uma série menor;
- abandonar a hipótese de operação de conteúdo e testar outra aplicação do Léo Digital.

Não escolher um infoproduto, preço final ou promessa de escala apenas com base na performance orgânica.

- [ ] **Step 4: Commit e publicação do resultado operacional**

```powershell
git add -- "docs/content/leodigital/2026-08/series-001/validation-log.md" "cofre-leoferraz-dev/02_EXECUCAO/2026-08/2026-08-28 — Léo Digital e validação de demanda no Instagram.md"
git commit -m "docs: close Leo Digital demand validation gate"
```

## Verificação final do plano e da execução

Antes de considerar a série concluída, executar:

```powershell
git diff --check
git status --short
```

Expected:

- todos os dez manifests têm fonte, headline principal, headline de transição, legenda e CTA;
- nenhum export publicado falha em resolução, duração, leitura ou sequência de headlines;
- nenhuma promessa não comprovada foi adicionada;
- os sinais estão separados entre curiosidade visual, interesse de conteúdo, dor reconhecida, interesse comercial e lead de piloto;
- o cofre registra decisão, execução, evidência direta, inferência e pendências;
- alterações não relacionadas à série permanecem preservadas;
- a conclusão distingue conteúdo publicado, validação de demanda e existência de um produto pago.
