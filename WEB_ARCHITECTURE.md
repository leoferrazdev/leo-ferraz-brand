---
document: WEB_ARCHITECTURE
project: leoferraz.dev
version: 0.1.0
status: approved
authority: Leo Ferraz
---

# Web Architecture

Este documento registra a infraestrutura inicial da representação web executável do Brand System.

## Arquitetura principal

```text
Repository
↓
Canonical Brand Documents
↓
Executable Website
↓
Astro Static Build
↓
dist/
↓
document root of leoferraz.dev
```

```text
Repository = source of truth
Website = executable representation
dist/ = generated deployment artifact
```

## Decisões técnicas

```text
Framework:
Astro

Language:
TypeScript

Development / Build Runtime:
Node.js

Package Manager:
npm

Node Runtime Line:
22 LTS

Effective Minimum Node:
22.19.0

Validated Development Runtime:
22.23.2

Validated npm:
10.9.8

Astro:
7.2.2

Rendering Strategy:
Static Site Generation

Astro Output:
static

Build Directory:
dist/

Build Format:
directory

Trailing Slash:
always

Public Base:
/

Production Domain:
https://leoferraz.dev

Deployment:
npm run build
↓
dist/
↓
contents of dist/
↓
public_html/
↓
https://leoferraz.dev/

Hosting Provider:
Hostinger

Production Document Root:
public_html

Initial Deployment Method:
manual static deployment

GitHub Deployment Integration:
not_used

Production Status:
deployed

Initial Public Routes:
/
/brand/

deployment_automation:
not_defined

Runtime Server:
not_required

Server Adapter:
none

CMS:
none

Database:
none

Client Framework:
none

Site I18n Routing:
not_defined

Font Loading Strategy:
not_defined

Design Tokens:
not_created

Site Stage:
foundation
```

```text
Node.js
→ desenvolvimento e build

Produção
→ arquivos estáticos
```

## Princípio de runtime

```text
Static by default.
Server only when the product requires it.
```

Este é um princípio técnico interno, não uma tagline pública.

## Fontes e camadas

```text
brand/*.md
→ canonical source

src/pages/brand/*
→ public/executable projection
```

O site não lê o cofre operacional e não transforma páginas públicas em fonte canônica.

## Cofre operacional

```text
Operational project vault:
cofre-leoferraz-dev/

Role:
local operational memory and project records

Canonical brand source:
brand/*.md

Vault versioning/synchronization:
not_defined
```

## Rotas atuais

Somente estas rotas existem nesta etapa:

- `/` — web shell inicial em estado `foundation`.
- `/brand/` — Living Brandbook público com decisões aprovadas.

Arquitetura futura conceitual, ainda não implementada:

```text
/
├── projects
├── build-log
├── about
└── brand
```

## Conteúdo futuro

```text
Astro Content Collections:
planned for structured repeatable content
```

Possíveis usos futuros: projects, build logs, articles e experiments. Nenhuma collection é implementada nesta etapa.

## Pontes de implementação

- `site_i18n_routing: not_defined` — não há roteamento i18n nesta versão.
- `font_loading_strategy: not_defined` — IBM Plex Sans e IBM Plex Mono são declaradas com fallbacks; nenhum binário foi adicionado.
- Media queries mínimas no CSS são `implementation bridge`, não breakpoints canônicos.
- `dist/` é gerado pelo build, ignorado pelo Git e proibido como fonte de edição manual.
