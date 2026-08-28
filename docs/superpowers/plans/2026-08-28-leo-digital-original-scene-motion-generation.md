# Léo Digital — Geração de Cena e Movimento Originais Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preparar o pacote documental para gerar externamente Reels do Léo Digital com identidade baseada em fotos e cena/movimento originais, sem copiar o vídeo 08.

**Architecture:** `PROMPT-002` separa identidade, direção de cena e restrições de saída; `GUIA-002` define a operação na plataforma externa e impede o uso acidental do vídeo-base. O `PROMPT-001` e o `GUIA-001` continuam preservados para o caso distinto de variação de uma cena existente, com seu escopo explicitado.

**Tech Stack:** Markdown compatível com Obsidian; wikilinks; plataforma externa em modo funcionalmente equivalente a `image-to-video` ou `text-to-video` com fotos de referência; `ffprobe`/`ffmpeg` somente para inspeção posterior de arquivos devolvidos; Git em `main`.

## Global Constraints

- Usar fotos reais autorizadas do Léo Ferraz como referência de identidade.
- Não anexar o vídeo 08 como fonte primária no teste de cena original.
- Usar somente um modo externo que permita gerar cena e movimento a partir do prompt, sem copiar obrigatoriamente um vídeo-base.
- Gerar vídeo vertical 9:16, curto, realista e silencioso, inicialmente entre 6 e 10 segundos.
- Não gerar texto, headlines, CTA, legenda, logo, avatar, interface ou marca d'água dentro da plataforma externa.
- Aplicar a copy das duas headlines depois, fora da geração visual.
- Não gerar fala, voz ou lip-sync.
- Preservar a identidade facial sem transformar o Léo Digital em um avatar de demonstração de ferramenta.
- Não inventar cliente, produto, contrato, dinheiro, receita, depoimento, métrica ou resultado.
- Manter `PROMPT-001` como registro histórico do fluxo de face swap/video variation; não sobrescrevê-lo.
- Produzir localmente somente copy, prompts, instruções, registros e QA; não gerar vídeo neste repositório.
- Registrar modelo, modo, custo, data, versão, arquivo devolvido, marca d'água, áudio e observações antes de considerar uma peça pronta para QA.
- Interromper a operação se a plataforma só oferecer face swap com preservação da cena; registrar a limitação em vez de mascará-la com um prompt mais longo.

---

### Task 1: Criar o pacote de prompts para cenas originais

**Files:**
- Create: `cofre-leoferraz-dev/03_CONTEUDO/PROMPT-002 - Léo Digital Cenas Originais.md`
- Read: `docs/superpowers/specs/2026-08-28-leo-digital-original-scene-motion-generation-design.md`
- Read: `cofre-leoferraz-dev/03_CONTEUDO/COPY-001 - Léo Digital Série 001.md`
- Read: `brand/BRAND_SYSTEM.md`
- Read: `brand/VOICE_AND_LANGUAGE.md`
- Read: `brand/VISUAL_DIRECTION.md`

**Interfaces:**
- Consumes: contrato de prompt, riscos e critérios de aceitação da especificação aprovada; função editorial das dez peças no `COPY-001`; regras canônicas de construção, evidência, contenção e `builder not guru`.
- Produces: prompt-base copiável e dez prompts adicionais, cada um com cena, enquadramento, câmera, ação e expressão originais, sem vídeo-base.

- [x] **Step 1: Confirmar o contrato de entradas**

Registrar no frontmatter e na instrução de uso que o único anexo visual desta modalidade é o conjunto autorizado de fotos reais do Léo Ferraz. A operação deve declarar `vídeo-base: nenhum` e não pode usar screenshots como referência facial.

Expected: o arquivo não contém qualquer instrução que faça o vídeo 08 comandar duração, câmera, enquadramento, ação, cenário ou ritmo.

- [x] **Step 2: Escrever o prompt-base comum**

Usar este bloco como base literal para cada peça:

```text
Use somente as fotos reais autorizadas do Léo Ferraz como referência de identidade. Gere uma cena original. Não use, não copie e não reproduza nenhum vídeo-base, enquadramento, trajetória de câmera, cenário ou sequência de ação de um vídeo de referência.

Crie um vídeo vertical 9:16, realista, silencioso e curto, com movimento humano contido e contínuo. A cena deve parecer um momento de construção de produto digital em um laboratório escuro e preciso, sem telas legíveis e sem aparência de anúncio de resultado. Preserve a identidade facial das fotos: formato do rosto, olhos, cor dos olhos, cabelo, barba, rugas e proporções.

Não adicione texto, headline, legenda, CTA, logo, avatar, elementos de interface, marca d'água, pessoas novas, fala, voz, movimento de boca, lip-sync, cliente, produto, dinheiro, contrato, depoimento, métrica ou resultado. Não transforme a expressão em euforia, choque, autoridade artificial ou promessa comercial. Entregue somente o vídeo, com composição limpa para receber a copy na montagem posterior.
```

Expected: o prompt-base separa identidade e direção de cena, e a copy continua explicitamente fora da geração.

- [x] **Step 3: Adicionar os dez prompts de cena**

Usar a seguinte matriz como direção concreta, sem anexar vídeo de referência:

| Peça | Função | Cena, enquadramento e movimento originais |
|---|---|---|
| 01 | Demonstração | Plano médio 3/4 em bancada escura; Léo examina uma folha sem texto legível, fecha o caderno, olha brevemente para a câmera e retorna à bancada; aproximação lenta e única. |
| 02 | Transparência | Plano lateral médio em mesa de laboratório; Léo organiza três cartões sem escrita, observa um deles e os coloca lado a lado; câmera faz deslocamento lateral curto, sem projeção de código. |
| 03 | Bastidor | Plano alto diagonal de uma estação de trabalho; Léo posiciona uma folha em branco, ajusta uma luminária e muda de lugar para observar a composição; câmera desce suavemente para um plano médio. |
| 04 | Dor | Close médio 3/4 junto a uma janela escura; Léo interrompe o que faz, respira, fecha os olhos por um instante e encara a bancada com concentração; câmera permanece quase fixa, com micro movimento de aproximação. |
| 05 | Gargalo | Plano aberto em corredor interno de laboratório; Léo caminha até uma mesa vazia, para, olha para a cadeira e se senta; travelling curto acompanhando a entrada, sem gesto dramático. |
| 06 | Formato | Plano médio frontal em uma mesa limpa; Léo posiciona um cartão sem texto diante da câmera, recua a mão e olha para o cartão; câmera faz pequeno pull-back revelando o contexto. |
| 07 | Estratégia | Plano médio 3/4 em pé diante de uma parede neutra sem escrita; Léo alterna o olhar entre dois pontos da parede, toca levemente o queixo e escolhe um deles; arco lateral discreto, sem pose de guru. |
| 08 | Aplicação | Plano médio lateral em duas bancadas próximas; Léo pega um caderno fechado em uma bancada, atravessa um passo e o coloca na outra; câmera acompanha em pan curto e termina no rosto. |
| 09 | Pesquisa | Plano americano em sala escura com cartões abstratos sem texto ao fundo; Léo observa o conjunto, aproxima-se um passo e inclina a cabeça; câmera faz rack focus do fundo abstrato para o rosto, sem dados fictícios. |
| 10 | Convite ao piloto | Plano médio 3/4 em mesa limpa; Léo se inclina ligeiramente em direção à câmera, mantém contato visual por um instante e abre a mão sobre a bancada; dolly-in curto, expressão acolhedora e contida, sem fala. |

Para cada peça, repetir as restrições do prompt-base e declarar que a câmera, a ação e o cenário devem ser novos. Não usar `preserve a progressão`, `mantenha o fechamento`, `repita os planos` ou equivalentes.

Expected: as dez peças são visualmente diferenciadas por ação e câmera, mas continuam pertencendo ao mesmo território de laboratório de produto e builder.

- [x] **Step 4: Adicionar o teste controlado da peça 01**

Registrar que a primeira operação externa deve gerar somente `reel-01-demo-v01.mp4`, usando o prompt-base mais o bloco da peça 01, sem vídeo 08 anexado. O objetivo do teste é comparar se cena, enquadramento e movimento deixam de reproduzir o vídeo 08; não comparar apenas a semelhança facial.

Expected: o primeiro teste fica isolado, auditável e sem custo de dez gerações simultâneas.

- [x] **Step 5: Commit do pacote de prompts**

```powershell
git add -f -- "cofre-leoferraz-dev/03_CONTEUDO/PROMPT-002 - Léo Digital Cenas Originais.md"
git commit -m "docs: add original-scene Leo Digital prompts"
```

---

### Task 2: Criar o handoff da modalidade de cena original

**Files:**
- Create: `cofre-leoferraz-dev/03_CONTEUDO/GUIA-002 - Léo Digital Cenas Originais Handoff Externo.md`
- Modify: `cofre-leoferraz-dev/03_CONTEUDO/GUIA-001 - Léo Digital Série 001 Handoff Externo.md`
- Read: `cofre-leoferraz-dev/03_CONTEUDO/PROMPT-002 - Léo Digital Cenas Originais.md`
- Read: `cofre-leoferraz-dev/02_EXECUCAO/2026-08/2026-08-28 — Diagnóstico da Cópia do Vídeo-Base na Geração Externa.md`

**Interfaces:**
- Consumes: prompts `PROMPT-002`, diagnóstico da cópia e nomenclatura já aprovada para devolução.
- Produces: procedimento copiável que impede confundir criação de cena original com face swap e uma ressalva explícita no guia histórico.

- [x] **Step 1: Definir a preparação correta da operação**

Escrever no `GUIA-002` a sequência abaixo:

1. selecionar o modo equivalente a `image-to-video` ou `text-to-video` com referência de identidade;
2. anexar somente as fotos reais autorizadas do Léo Ferraz;
3. confirmar que nenhum vídeo-base está anexado;
4. colar o prompt-base e o bloco da peça em `PROMPT-002`;
5. confirmar que a plataforma não adicionou texto, voz, lip-sync ou marca d'água automaticamente;
6. confirmar o modelo, o custo e o modo antes de aprovar;
7. gerar somente a versão solicitada;
8. salvar o arquivo e os metadados da operação;
9. devolver o arquivo para QA antes da montagem das headlines.

Expected: o procedimento torna impossível tratar a presença de um vídeo-base como requisito desta modalidade.

- [x] **Step 2: Definir a regra de parada**

Registrar que a geração deve ser interrompida se a ferramenta só aceitar o fluxo `Face Swap Video Variations` ou insistir em copiar a cena anexada. O resultado deve ser classificado como `não gerado — modo incompatível` ou `rejeitado — cópia da cena/movimento`; não iniciar uma segunda tentativa sem registrar o custo da primeira.

- [x] **Step 3: Definir nomenclatura e ficha de devolução**

Usar `reel-01-demo-v01.mp4` no primeiro teste e exigir, junto do arquivo:

- peça e versão;
- conjunto de fotos utilizado;
- vídeo-base utilizado: `nenhum`;
- modo e modelo;
- data e hora;
- custo em créditos;
- presença de marca d'água;
- presença de áudio técnico;
- defeitos faciais, de cena, câmera ou movimento;
- confirmação de que não há texto nem elementos não solicitados.

- [x] **Step 4: Delimitar o guia histórico**

Adicionar ao `GUIA-001` uma nota no início informando que ele serve somente para variações que preservam deliberadamente a cena original. Encaminhar o leitor ao `GUIA-002` quando o objetivo for mudar cena ou movimento.

- [x] **Step 5: Commit do handoff**

```powershell
git add -f -- "cofre-leoferraz-dev/03_CONTEUDO/GUIA-002 - Léo Digital Cenas Originais Handoff Externo.md" "cofre-leoferraz-dev/03_CONTEUDO/GUIA-001 - Léo Digital Série 001 Handoff Externo.md"
git commit -m "docs: define original-scene external handoff"
```

---

### Task 3: Atualizar a navegação e o estado operacional do cofre

**Files:**
- Modify: `cofre-leoferraz-dev/03_CONTEUDO/README.md`
- Modify: `cofre-leoferraz-dev/02_EXECUCAO/2026-08/2026-08-28 — Diagnóstico da Cópia do Vídeo-Base na Geração Externa.md`
- Modify: `cofre-leoferraz-dev/01_DECISOES/DECISAO-026 - Fonte de Identidade Separada da Cena e do Movimento.md`
- Modify: `cofre-leoferraz-dev/02_EXECUCAO/2026-08/2026-08-28 — Léo Digital e validação de demanda no Instagram.md`
- Modify: `docs/superpowers/specs/2026-08-28-leo-digital-original-scene-motion-generation-design.md`
- Modify: `cofre-leoferraz-dev/02_EXECUCAO/2026-08/README.md`

**Interfaces:**
- Consumes: dois novos artefatos de conteúdo, resultado da revisão da especificação e estado atual do diagnóstico.
- Produces: cofre navegável, sem ambiguidade sobre qual prompt usar, com implementação documental distinguida da geração audiovisual ainda pendente.

- [x] **Step 1: Indexar `PROMPT-002` e `GUIA-002`**

Adicionar os dois wikilinks ao índice de `03_CONTEUDO`, classificando `PROMPT-002` como geração de cena original e `GUIA-002` como handoff externo correspondente.

- [x] **Step 2: Atualizar os estados sem declarar vídeo gerado**

Marcar a especificação como documentalmente implementada somente depois que `PROMPT-002` e `GUIA-002` existirem. Manter no diagnóstico as caixas de geração externa e QA audiovisual desmarcadas. Atualizar `DECISAO-026` para registrar que o pacote local está preparado, mas o teste externo continua pendente.

- [x] **Step 3: Confirmar links internos**

Usar wikilinks para notas internas do cofre e caminhos Markdown/textuais para a especificação fora do cofre. Não transformar caminho de Windows ou screenshot temporário em wikilink Obsidian.

- [x] **Step 4: Commit do estado do cofre**

```powershell
git add -f -- "cofre-leoferraz-dev/03_CONTEUDO/README.md" "cofre-leoferraz-dev/02_EXECUCAO/2026-08/2026-08-28 — Diagnóstico da Cópia do Vídeo-Base na Geração Externa.md" "cofre-leoferraz-dev/01_DECISOES/DECISAO-026 - Fonte de Identidade Separada da Cena e do Movimento.md" "cofre-leoferraz-dev/02_EXECUCAO/2026-08/README.md" "docs/superpowers/specs/2026-08-28-leo-digital-original-scene-motion-generation-design.md"
git commit -m "docs: index original-scene Leo Digital workflow"
```

---

### Task 4: Validar o pacote documental e preparar a execução externa

**Files:**
- Read: `cofre-leoferraz-dev/03_CONTEUDO/PROMPT-002 - Léo Digital Cenas Originais.md`
- Read: `cofre-leoferraz-dev/03_CONTEUDO/GUIA-002 - Léo Digital Cenas Originais Handoff Externo.md`
- Read: `cofre-leoferraz-dev/01_DECISOES/DECISAO-026 - Fonte de Identidade Separada da Cena e do Movimento.md`
- Read: `docs/superpowers/specs/2026-08-28-leo-digital-original-scene-motion-generation-design.md`

**Interfaces:**
- Consumes: pacote local completo.
- Produces: evidência de que o pacote está pronto para ser copiado na ferramenta externa, sem alegar que a ferramenta já foi testada.

- [ ] **Step 1: Executar auditoria textual de cópia indevida**

Run:

```powershell
rg -n -i "vídeo-base|video-base|preserve a progressão|mantenha o mesmo cenário|repita os planos|mantenha o fechamento|vídeo-base utilizado" "cofre-leoferraz-dev/03_CONTEUDO/PROMPT-002 - Léo Digital Cenas Originais.md" "cofre-leoferraz-dev/03_CONTEUDO/GUIA-002 - Léo Digital Cenas Originais Handoff Externo.md"
```

Expected: menções a vídeo-base aparecem somente como proibição, como `nenhum` no registro ou como regra de parada; não aparecem como instrução de preservação ou anexo obrigatório.

- [ ] **Step 2: Validar o frontmatter e a higiene do cofre**

Run:

```powershell
git diff --check
obsidian vault="cofre-leoferraz-dev" unresolved total
obsidian vault="cofre-leoferraz-dev" orphans total
```

Expected: `git diff --check` sem saída, `0` links não resolvidos e `0` notas órfãs.

- [ ] **Step 3: Auditar o escopo do commit**

Run:

```powershell
git status --short
git log --oneline --name-only --format="COMMIT %h %s" 77bcc40..HEAD
```

Expected: os commits novos listam somente os arquivos deste plano; `brand-assets/capas/capa-live-recorrente.png`, `.claude/`, `brand-assets/profile/`, `create_cutout.py`, `live/descricao live.txt` e `referencias/` permanecem preservados fora do escopo. A confirmação remota do último commit deve ser feita separadamente com `git ls-remote origin refs/heads/main`.

- [ ] **Step 4: Registrar o gate externo**

Deixar explícito no diagnóstico que o pacote local está `ready_for_external_test`, enquanto geração, recebimento, QA audiovisual, montagem e publicação permanecem pendentes. O próximo arquivo esperado é `reel-01-demo-v01.mp4`, gerado sem anexar o vídeo 08.

- [ ] **Step 5: Commit final do registro de validação**

```powershell
git add -f -- "cofre-leoferraz-dev/02_EXECUCAO/2026-08/2026-08-28 — Diagnóstico da Cópia do Vídeo-Base na Geração Externa.md"
git commit -m "docs: validate original-scene generation package"
git push origin main
```

## Pós-plano: etapa externa não executada aqui

Depois deste plano, a operação na plataforma externa deve seguir `GUIA-002`. A primeira geração deverá ser a peça 01, com fotos autorizadas e sem vídeo 08. O retorno do arquivo abre um novo ciclo de QA audiovisual; nenhuma conclusão sobre qualidade da cena, movimento, custo ou distribuição será afirmada antes desse retorno.

## Verificação final do plano

- A especificação de arquitetura é coberta pelas Tasks 1–4.
- A separação entre identidade e cena está coberta por `PROMPT-002` e `GUIA-002`.
- A preservação do `PROMPT-001` e do fluxo histórico está coberta pela Task 2.
- As dez peças possuem direção concreta de cena, câmera e ação na Task 1.
- O primeiro experimento está isolado na peça 01 e não depende de um vídeo-base.
- Nenhum passo declara geração, QA ou publicação como concluídos.
- O plano contém comandos executáveis, critérios esperados e nenhum placeholder operacional.
