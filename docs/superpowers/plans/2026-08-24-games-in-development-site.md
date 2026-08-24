# Jogos em desenvolvimento no site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox ([ ] syntax) for tracking.

**Goal:** Exibir Sproutbound — Salto ao Sol como produto próprio em desenvolvimento na homepage e em /laboratorio/, sem link público ou CTA enquanto a distribuição estiver em revisão.

**Architecture:** Centralizar os dados em src/data/games-in-development.ts e renderizá-los por meio de src/components/site/GameCard.astro. As duas páginas importarão a mesma lista e o mesmo componente; o campo opcional platformUrl permanecerá ausente para o Sproutbound. A capa existente será versionada em public/ do site.

**Tech Stack:** Astro 7.2.2, TypeScript via Astro, CSS global com tokens Leo Ferraz, Node.js 22.19+, npm.

## Global Constraints

- O jogo deve aparecer como produto próprio, separado de “Trabalho com clientes”.
- Usar exatamente o nome “Sproutbound — Salto ao Sol”.
- Usar o status público “Em desenvolvimento · Em revisão de distribuição”.
- Não adicionar URL, link, botão ou promessa de jogo público nesta etapa.
- O campo platformUrl?: string deve permitir CTA futuro sem refatorar o componente.
- Não inventar plataforma, URL, aprovação, usuários, métricas, receita ou validação externa.
- Preservar a identidade própria do Sproutbound; o site apenas enquadra a capa no sistema visual Leo Ferraz.
- Usar pt-BR para a copy editorial desta seção.
- Preservar alterações não relacionadas já presentes na working tree.
- Registrar decisão, execução, evidência e pendências em cofre-leoferraz-dev/.
- Publicar a implementação validada na branch main.

---

## Arquivos e responsabilidades

- Create: src/data/games-in-development.ts — contrato e registro dos jogos próprios.
- Create: src/components/site/GameCard.astro — apresentação acessível do jogo e CTA condicional futuro.
- Create: public/evidence/sproutbound-1280x720.jpg — cópia da capa aprovada.
- Modify: src/pages/index.astro — seção da homepage entre prova de trabalho e canais.
- Modify: src/pages/laboratorio/index.astro — seção de produtos próprios antes do trabalho com clientes.
- Modify: src/styles/global.css — estilos do card e comportamento responsivo.
- Create: cofre-leoferraz-dev/02_EXECUCAO/2026-08/2026-08-24 — Jogos em desenvolvimento no site.md — registro operacional.

## Interfaces

src/data/games-in-development.ts exportará:

~~~ts
export type GameInDevelopment = {
  name: string;
  status: string;
  description: string;
  image: string;
  imageAlt: string;
  platformUrl?: string;
};

export const gamesInDevelopment: GameInDevelopment[];
~~~

GameCard.astro consumirá:

~~~ts
interface Props {
  game: GameInDevelopment;
}
~~~

O componente produzirá um article informativo. Se game.platformUrl existir, produzirá também o link externo Jogar na Plataforma →. Se estiver ausente, não produzirá nenhum link relativo ao jogo.

### Task 1: Add the canonical game record and approved cover

**Files:**
- Create: src/data/games-in-development.ts
- Create: public/evidence/sproutbound-1280x720.jpg
- Source asset: D:\LEONARDO\Games\sproutbound\submission\gamedistribution-assets\sproutbound-1280x720.jpg

**Interfaces:**
- Produces: GameInDevelopment and gamesInDevelopment for Tasks 2 and 3.

- [ ] **Step 1: Copy the approved cover without modifying the game repository**

Run from D:\LEONARDO\Leo Ferraz:

~~~powershell
Copy-Item -LiteralPath 'D:\LEONARDO\Games\sproutbound\submission\gamedistribution-assets\sproutbound-1280x720.jpg' -Destination 'public\evidence\sproutbound-1280x720.jpg'
Test-Path 'public\evidence\sproutbound-1280x720.jpg'
git -C 'D:\LEONARDO\Games\sproutbound' status --short
~~~

Expected: the path check is True and the Sproutbound repository reports no change caused by this task.

- [ ] **Step 2: Add the typed data source**

Create src/data/games-in-development.ts:

~~~ts
export type GameInDevelopment = {
  name: string;
  status: string;
  description: string;
  image: string;
  imageAlt: string;
  platformUrl?: string;
};

export const gamesInDevelopment: GameInDevelopment[] = [
  {
    name: 'Sproutbound — Salto ao Sol',
    status: 'Em desenvolvimento · Em revisão de distribuição',
    description: 'Pip salta entre folhas, coleta gotas de sol e tenta alcançar o topo sem tocar nos espinhos.',
    image: '/evidence/sproutbound-1280x720.jpg',
    imageAlt: 'Pip saltando entre folhas iluminadas em Sproutbound.',
  },
];
~~~

Do not add platformUrl to this record.

- [ ] **Step 3: Verify the data contract**

Run:

~~~powershell
rg -n "Sproutbound|Em desenvolvimento|Em revisão de distribuição|platformUrl" src\data\games-in-development.ts
~~~

Expected: the exact name, status, image path and optional field are present; platformUrl appears only in the type declaration.

- [ ] **Step 4: Commit only the data and asset**

~~~powershell
git add -- 'src/data/games-in-development.ts' 'public/evidence/sproutbound-1280x720.jpg'
git diff --cached --check
git diff --cached --name-only
git commit -m "feat: add sproutbound game record"
~~~

Expected: only the data file and image are committed.

### Task 2: Build the reusable game card and responsive styles

**Files:**
- Create: src/components/site/GameCard.astro
- Modify: src/styles/global.css

**Interfaces:**
- Consumes: GameInDevelopment from src/data/games-in-development.ts.
- Produces: GameCard for Task 3.

- [ ] **Step 1: Create the component**

Create src/components/site/GameCard.astro:

~~~astro
---
import type { GameInDevelopment } from '../../data/games-in-development';

interface Props {
  game: GameInDevelopment;
}

const { game } = Astro.props;
---

<article class="game-card">
  <figure class="game-card__visual">
    <img src={game.image} alt={game.imageAlt} width="1280" height="720" loading="lazy" decoding="async" />
  </figure>
  <div class="game-card__body">
    <div class="game-card__meta">
      <h3>{game.name}</h3>
      <p class="game-card__status">{game.status}</p>
    </div>
    <p class="game-card__description">{game.description}</p>
    {game.platformUrl && (
      <a class="game-card__cta" href={game.platformUrl} target="_blank" rel="noopener noreferrer">
        Jogar na Plataforma →
      </a>
    )}
  </div>
</article>
~~~

The current record has no platformUrl, so the rendered card must have no game link or CTA.

- [ ] **Step 2: Add token-based styles**

Add these rules next to the existing homepage and client-work rules in src/styles/global.css:

~~~css
.games-in-development {
  display: grid;
  gap: var(--lf-spacing-block-content);
}

.game-card {
  display: grid;
  gap: var(--lf-spacing-block-content);
  padding-top: var(--lf-spacing-block-content);
  border-top: var(--lf-border-width-standard) solid var(--lf-color-border-default);
}

.game-card__visual {
  margin: 0;
  border: var(--lf-border-width-standard) solid var(--lf-color-border-default);
  background: var(--lf-color-surface-1);
  line-height: 0;
}

.game-card__visual img {
  display: block;
  width: 100%;
  height: auto;
}

.game-card__body {
  display: grid;
  gap: var(--lf-spacing-inline-standard);
  align-content: start;
}

.game-card__meta h3 {
  margin: 0 0 var(--lf-spacing-inline-compact);
  font-size: var(--lf-type-h3-size-large);
  font-weight: var(--lf-type-h3-weight);
}

.game-card__status {
  margin: 0;
  color: var(--lf-color-experimental-primary);
  font-family: var(--lf-font-family-mono);
  font-size: var(--lf-type-label-size-large);
  letter-spacing: var(--lf-type-label-tracking);
  text-transform: uppercase;
}

.game-card__description {
  max-width: 60ch;
  margin: 0;
  color: var(--lf-color-text-secondary);
  font-size: var(--lf-type-body-size-large);
  line-height: 1.55;
}

.game-card__cta {
  justify-self: start;
}

@media (min-width: 900px) {
  .game-card {
    grid-template-columns: minmax(0, 1.35fr) minmax(0, 0.65fr);
    align-items: center;
    gap: var(--lf-spacing-block-major);
  }
}
~~~

Keep the mobile layout single-column. Do not add a new color or gradient.

- [ ] **Step 3: Audit the component/style diff**

Run:

~~~powershell
git diff --check
rg -n "game-card|games-in-development|platformUrl" src\components\site\GameCard.astro src\styles\global.css
~~~

Expected: no whitespace errors and all component selectors plus the conditional field are present.

- [ ] **Step 4: Commit the reusable component and styles**

~~~powershell
git add -- 'src/components/site/GameCard.astro' 'src/styles/global.css'
git diff --cached --check
git diff --cached --name-only
git commit -m "feat: add reusable game card"
~~~

Expected: only the component and stylesheet are committed.

### Task 3: Render the section on homepage and laboratory

**Files:**
- Modify: src/pages/index.astro
- Modify: src/pages/laboratorio/index.astro

**Interfaces:**
- Consumes: gamesInDevelopment and GameCard from Tasks 1 and 2.
- Produces: the same Sproutbound card in both public routes, with no game link or CTA.

- [ ] **Step 1: Add imports to both pages**

In src/pages/index.astro:

~~~ts
import GameCard from '../components/site/GameCard.astro';
import { gamesInDevelopment } from '../data/games-in-development';
~~~

In src/pages/laboratorio/index.astro:

~~~ts
import GameCard from '../../components/site/GameCard.astro';
import { gamesInDevelopment } from '../../data/games-in-development';
~~~

- [ ] **Step 2: Insert the homepage section**

Place after homepage__proof and before homepage__follow:

~~~astro
<section class="homepage__products" aria-labelledby="games-title">
  <div class="homepage__section-heading">
    <div>
      <p class="eyebrow">JOGOS EM DESENVOLVIMENTO</p>
      <h2 id="games-title">Produtos próprios em construção.</h2>
    </div>
  </div>
  <div class="games-in-development">
    {gamesInDevelopment.map((game) => <GameCard game={game} />)}
  </div>
</section>
~~~

- [ ] **Step 3: Insert the laboratory section**

Place after the hero and before the existing homepage__products section for client work:

~~~astro
<section class="homepage__products" aria-labelledby="games-title">
  <div class="homepage__section-heading">
    <div>
      <p class="eyebrow">JOGOS EM DESENVOLVIMENTO</p>
      <h2 id="games-title">Produtos próprios em construção.</h2>
    </div>
    <p>Produto próprio · sem link público nesta etapa</p>
  </div>
  <div class="games-in-development">
    {gamesInDevelopment.map((game) => <GameCard game={game} />)}
  </div>
</section>
~~~

Both are separate HTML documents, so games-title is unique within each route.

- [ ] **Step 4: Build and inspect generated HTML**

Run:

~~~powershell
npm run build
rg -n -F 'Sproutbound — Salto ao Sol' dist\index.html dist\laboratorio\index.html
rg -n -F 'Em desenvolvimento · Em revisão de distribuição' dist\index.html dist\laboratorio\index.html
rg -n -F 'Jogar na Plataforma' dist\index.html dist\laboratorio\index.html
rg -n -F 'src="/evidence/sproutbound-1280x720.jpg"' dist\index.html dist\laboratorio\index.html
~~~

Expected: name, status and image path occur in both routes; Jogar na Plataforma has zero matches; npm run build exits successfully.

- [ ] **Step 5: Commit the route integration**

~~~powershell
git add -- 'src/pages/index.astro' 'src/pages/laboratorio/index.astro'
git diff --cached --check
git diff --cached --name-only
git commit -m "feat: show sproutbound in site sections"
~~~

Expected: only the two page files are committed.

### Task 4: Record the delivery and complete validation

**Files:**
- Create: cofre-leoferraz-dev/02_EXECUCAO/2026-08/2026-08-24 — Jogos em desenvolvimento no site.md

**Interfaces:**
- Consumes: validation evidence from Tasks 1–3.
- Produces: an Obsidian-compatible operational record separating decision, execution, evidence and pending platform URL.

- [ ] **Step 1: Run final validation**

Run:

~~~powershell
npm run build
git diff --check HEAD~3..HEAD
git status --short --branch
~~~

Expected: build passes; the three implementation commits have no whitespace errors; unrelated pre-existing files remain untracked and untouched.

- [ ] **Step 2: Write the operational record**

Create the note with this content, replacing the build line with the observed result before saving:

~~~markdown
---
title: "2026-08-24 — Jogos em desenvolvimento no site"
date: 2026-08-24
document_type: operational-record
status: completed
tags:
  - cofre/execucao
  - tema/site
  - tema/produtos
project: Leo Ferraz
---

# Jogos em desenvolvimento no site

## Decisão

Exibir Sproutbound — Salto ao Sol como produto próprio em desenvolvimento na homepage e no laboratório. O card permanece sem link porque o jogo está em revisão de distribuição e ainda não possui destino público oficial aprovado.

## Execução

- Dados centralizados em src/data/games-in-development.ts.
- Card reutilizável em src/components/site/GameCard.astro.
- Capa versionada em public/evidence/sproutbound-1280x720.jpg.
- Seção adicionada à homepage e ao laboratório.
- CTA Jogar na Plataforma preparado condicionalmente, mas não renderizado sem platformUrl.

## Evidência

- npm run build: PASS, com o resultado observado no terminal.
- Homepage: nome, status e imagem renderizados; sem CTA.
- Laboratório: nome, status e imagem renderizados; sem CTA.
- Repositório D:\LEONARDO\Games\sproutbound: não alterado por esta entrega.

## Pendências

- Aguardar aprovação de distribuição e URL pública oficial.
- Quando existir URL aprovada, atualizar apenas o registro do jogo, validar a página pública e confirmar o botão Jogar na Plataforma.
~~~

Do not claim public availability or distribution approval beyond the status supplied for this task.

- [ ] **Step 3: Audit and commit the operational record**

~~~powershell
git add -- 'cofre-leoferraz-dev/02_EXECUCAO/2026-08/2026-08-24 — Jogos em desenvolvimento no site.md'
git diff --cached --check
git diff --cached --name-only
git commit -m "docs: record sproutbound site delivery"
~~~

Expected: only the operational note is staged and committed.

- [ ] **Step 4: Confirm branch coherence and publish**

Run:

~~~powershell
git status --short --branch
git log -5 --oneline --decorate
git push origin main
git status --short --branch
~~~

Expected: origin/main points to the final implementation commit, no unrelated file is staged, and pre-existing untracked files remain preserved.
