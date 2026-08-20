# Chatbox da cena 04 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar um Chat Box nativo do Streamlabs, visualmente alinhado à identidade Leo Ferraz, no slot `CHAT / NOTAS` da cena `04 — Build / Artifact`.

**Architecture:** Preservar o transporte e o template nativos do Streamlabs (`#log` e `#chatlist_item`). Manter HTML, CSS e JS em arquivos canônicos dentro de `live/obs/chatbox/`, copiar o conteúdo para os três painéis de Código personalizado e ajustar a fonte browser para 288×669 em `x=1592`, `y=326`. O JS será apenas um adaptador de eventos e classes visuais; não haverá API própria, CDN, polling ou dados falsos.

**Tech Stack:** Streamlabs Desktop 1.21.9; Browser Source/Chat Box; HTML; CSS; JavaScript vanilla; `@oai/sky` para controle da interface do Windows; Obsidian Markdown.

## Global Constraints

- Usar a fonte oficial `Caixa de chat` já existente.
- Preservar `#log`, `#chatlist_item`, badges, emotes e o evento `onEventReceived`.
- Usar IBM Plex Sans com fallback sans-serif local.
- Não usar glow, gradiente, CDN, biblioteca externa ou chamada de API própria.
- O slot horizontal é `x=1592`, `y=326`, `288×669`, conforme `live/obs/MONTAGEM.md`.
- Não iniciar transmissão, autenticar contas, alterar chaves ou habilitar integrações externas.
- Preservar alterações não relacionadas no repositório.
- Registrar execução, evidência e pendências em `cofre-leoferraz-dev/`.

---

### Task 1: Criar os arquivos canônicos do widget

**Files:**
- Create: `live/obs/chatbox/leo-ferraz-chat.html`
- Create: `live/obs/chatbox/leo-ferraz-chat.css`
- Create: `live/obs/chatbox/leo-ferraz-chat.js`
- Test: validação estática dos três arquivos com Node.js

**Interfaces:**
- Consumes: template nativo do Streamlabs Chat Box e placeholders `{nameMessageDirection}`, `{from}`, `{messageId}`, `{color}`, `{message}`.
- Produces: HTML com `#log` e `#chatlist_item`; CSS para o viewport transparente de 288×669; JS que recebe `onEventReceived` e aplica `data-platform`/`data-display-name` sem substituir o transporte.

- [ ] **Step 1: Criar o HTML nativo mínimo**

  O arquivo deve conter apenas o `#log` e o template esperado pelo widget, mantendo `.meta`, `.badges`, `.name` e `.message`.

- [ ] **Step 2: Criar o CSS do slot vertical**

  Definir `html, body` em `width:100%; height:100%; overflow:hidden; background:transparent`, empilhar `#log` pelo fundo do viewport, limitar a oito mensagens visíveis, permitir quebra de linha e usar superfícies escuras sem glow.

- [ ] **Step 3: Criar o JS defensivo**

  Escutar `onEventReceived`; localizar a mensagem por `data-id`; normalizar `detail.platform`; aplicar `data-platform`; usar `detail.tags['display-name']` quando disponível; não falhar quando `detail.tags`, `detail.platform` ou `detail.messageId` estiverem ausentes.

- [ ] **Step 4: Validar estrutura e dependências**

  Confirmar que HTML contém `id="log"` e `id="chatlist_item"`, CSS não contém `@import`, URLs externas ou `box-shadow`, e JS não contém `fetch`, `XMLHttpRequest` ou dependências de CDN.

- [ ] **Step 5: Commitar os arquivos canônicos**

  ```bash
  git add live/obs/chatbox/leo-ferraz-chat.html live/obs/chatbox/leo-ferraz-chat.css live/obs/chatbox/leo-ferraz-chat.js
  git commit -m "feat: criar tema de chat da cena de construção"
  git push origin main
  ```

### Task 2: Aplicar HTML, CSS e JS no Streamlabs

**Files:**
- Read: `live/obs/chatbox/leo-ferraz-chat.html`
- Read: `live/obs/chatbox/leo-ferraz-chat.css`
- Read: `live/obs/chatbox/leo-ferraz-chat.js`
- Modify: fonte local `Caixa de chat` no Streamlabs Desktop

**Interfaces:**
- Consumes: os três arquivos canônicos da Task 1.
- Produces: Código personalizado salvo nos painéis HTML, CSS e JS da fonte nativa.

- [ ] **Step 1: Abrir o editor de Código personalizado**

  Usar a janela já aberta da fonte `Caixa de chat` e entrar em `Edit Custom Code`. Não alterar Custom Fields nesta tarefa.

- [ ] **Step 2: Colar o HTML**

  Substituir o conteúdo do painel HTML pelo arquivo canônico e confirmar que o template conserva os placeholders nativos.

- [ ] **Step 3: Colar o CSS**

  Substituir o CSS padrão transparente pelo arquivo canônico, mantendo transparência do `body` e layout dentro do viewport.

- [ ] **Step 4: Colar o JS**

  Substituir o painel JS pelo adaptador defensivo de eventos e salvar o editor.

### Task 3: Ajustar tamanho e posição da fonte

**Files:**
- Modify: fonte `Caixa de chat` em `C:\Users\leona\AppData\Roaming\slobs-client\SceneCollections\ebecae4c-4c2e-4d79-a0c7-25fa9b4ff769.json` somente via Streamlabs Desktop

**Interfaces:**
- Consumes: fonte browser 600×600 e instância atual deslocada.
- Produces: fonte browser 288×669 e item horizontal em `x=1592`, `y=326`, escala 1×1.

- [ ] **Step 1: Definir Browser Settings**

  Alterar Width para `288` e Height para `669`; preservar a URL oficial e o comportamento de desligamento existente.

- [ ] **Step 2: Posicionar a instância horizontal**

  Ajustar o item da cena `04 — Build / Artifact` para `x=1592`, `y=326`, `scaleX=1`, `scaleY=1`, sem alterar as fontes horizontais de fundo, tela ou câmera.

- [ ] **Step 3: Atualizar o cache**

  Acionar `Atualizar o cache da página atual`, fechar a configuração e reabrir a cena 04 para o widget renderizar com o novo viewport.

### Task 4: Validar o widget sem iniciar transmissão

**Files:**
- Read: `live/obs/MONTAGEM.md`
- Read: `live/obs/chatbox/leo-ferraz-chat.html`
- Read: `live/obs/chatbox/leo-ferraz-chat.css`
- Read: `live/obs/chatbox/leo-ferraz-chat.js`
- Update: `cofre-leoferraz-dev/02_EXECUCAO/2026-08/2026-08-20 — Sistema de Cenas ao Vivo.md`

**Interfaces:**
- Consumes: código salvo, coleção ativa e coordenadas canônicas.
- Produces: evidência separada de código, fonte, posição, cache e limites de segurança.

- [ ] **Step 1: Validar os arquivos canônicos**

  Reexecutar a validação estática e `npm run brand-assets:validate`.

- [ ] **Step 2: Validar o estado local do Streamlabs**

  Ler a coleção local e confirmar fonte `Caixa de chat`, URL preservada, width `288`, height `669`, item horizontal em `1592,326` e código customizado presente no estado exposto pelo aplicativo.

- [ ] **Step 3: Conferir a cena 04**

  Confirmar que o chat está dentro do painel, que o fundo permanece visível e que a captura de tela e câmera mantêm as posições da montagem.

- [ ] **Step 4: Registrar execução**

  Atualizar o cofre com decisão, execução, evidência direta, validações e pendências de teste real de mensagens em YouTube/Twitch.

- [ ] **Step 5: Publicar documentação e código**

  Auditar o diff, manter arquivos não relacionados fora do commit, commitar na `main`, publicar em `origin/main` e comparar os hashes local/remoto.
