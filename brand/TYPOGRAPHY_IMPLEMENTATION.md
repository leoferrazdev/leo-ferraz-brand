---
document: TYPOGRAPHY_IMPLEMENTATION
brand: Leo Ferraz
version: 0.1.0
status: approved
authority: Leo Ferraz
decision_basis: founder_visual_review
selected_system: Product / Editorial
depends_on:
  - TYPOGRAPHY.md
  - TYPOGRAPHY_IMPLEMENTATION_OPTIONS.md
  - COLOR.md
  - VISUAL_FOUNDATIONS.md
---

# Typography Implementation

Este documento registra a implementação tipográfica selecionada após a comparação visual humana. Ele é uma camada subordinada aos documentos tipográficos superiores e não os reescreve nem substitui.

## Selected system

```text
Product / Editorial
```

Este é o sistema de escala e comportamento selecionado para a implementação. A base tipográfica continua sendo o `Plex Product System` registrado em `TYPOGRAPHY.md`:

```text
Brand / Display:
IBM Plex Sans

UI / Body:
IBM Plex Sans

Technical / Mono:
IBM Plex Mono
```

## Selected scale

```text
DISPLAY
58px / 500

H1
46px / 500

H2
30px / 500

H3
21px / 500

BODY LARGE
20px / 400

BODY
17px / 400

BODY SMALL
14px / 400

METADATA
12px / 500

LABEL
11px / 500

CODE / MONO
12px / 500
```

### Line heights

```text
display: 1.02
headings: 1.18
body: 1.55
small: 1.40
mono: 1.34
```

### Tracking

```text
display: -0.035em
labels: +0.075em
metadata: +0.040em
mono: +0.010em
```

## Font Loading Strategy

```text
Font Loading Strategy:
Astro Fonts API

Source:
npm-managed Fontsource packages

Resolution:
local package resolution only

Remote Fallback:
disabled

External Font Runtime Requests:
prohibited

System-installed Font Dependency:
none

Manual Font Binaries:
not_used
```

The project uses the Astro `fonts` configuration with the NPM provider and `remote: false`. The package lock records the installed Fontsource versions. Production font assets are emitted by Astro into the build output and are served by the site itself.

```text
runtime_external_font_dependency: none
system_font_dependency: none
manual_font_binaries: none
npm_version_locking: yes
remote_font_fallback: disabled
```

## Weight boundary

The selected roles use only:

```text
IBM Plex Sans:
400
500

IBM Plex Mono:
500
```

The variable Sans package may technically expose a range, but no other weight is introduced into the identity roles by this implementation.

## Responsive Typography

```text
responsive_typography:
not_defined
```

The selected sizes are the approved base scale. Responsive mappings remain open and are not converted into a complete responsive system in this stage.

## Tokens

```text
typography_tokens:
not_created
```

No definitive typography token API or CSS custom-property scale is created in this stage.

## Review implementation

```text
Brand Review Lab:
/brand/review/typography/

Development:
available through npm run dev only

Production build:
route absent from dist/

intentional_client_javascript:
none
```

The development-only route is injected by an Astro integration only when the command is `dev`. It is not discovered from `src/pages`, so the static production build remains limited to the public routes.

## Scope limits

This document does not define a logo, wordmark, new color, light mode, semantic color system, component API, template or responsive breakpoint. It does not modify any superior approved brand document.
