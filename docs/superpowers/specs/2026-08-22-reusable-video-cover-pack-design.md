---
title: Reusable Video Cover Pack Design
date: 2026-08-22
status: approved
implementation_status: implemented
---

# Reusable Video Cover Pack Design

## Objective

Create a deterministic reusable master pack for YouTube thumbnails and vertical
video covers. The system must implement `brand/PADRAO-CAPAS.md`, use only the
approved transparent founder portraits, and keep horizontal and vertical
outputs visually equivalent.

The first pack uses demonstrative PT-BR copy. It is a reusable production
system, not a campaign launch and not evidence that any example claim occurred.

## Selected approach

Use one configuration-driven generator rather than duplicated static templates
or a combinatorial export of every portrait and headline.

Each cover entry declares:

- identifier;
- category label;
- headline lines;
- approved portrait source;
- horizontal portrait focal behavior;
- vertical portrait focal behavior.

The same content entry generates both canonical formats. Layout, typography,
colors, grid and safe-zone logic remain in the renderer rather than being
repeated in every content record.

## Canonical inputs

The implementation depends on:

- `brand/PADRAO-CAPAS.md` for the cover structure;
- `brand/COLOR.md` for the `Precision / Product` palette;
- `brand/TYPOGRAPHY.md` for IBM Plex Sans and IBM Plex Mono;
- `brand/VISUAL_FOUNDATIONS.md` for the flat structural grid;
- `brand/SIGNATURE.md` for the compact signature distribution;
- `brand/LANGUAGE_ARCHITECTURE.md` for PT-BR channel communication;
- `brand-assets/profile/leo-ferraz/*.png` for approved founder cutouts.

No portrait may be regenerated, repainted or synthetically extended by the
cover generator.

## Formats

### YouTube thumbnail

```text
canvas: 1280 x 720
grid cell: 48px
content language: pt-BR
portrait zone: right half, bleeding through the bottom edge
```

### Vertical video cover

```text
canvas: 1080 x 1920
grid cell: 60px
content language: pt-BR
portrait zone: lower field, bleeding through the bottom edge
```

The vertical composition must preserve:

- the face between `y=950` and `y=1450` when the selected portrait permits;
- no essential information below `y=1620`;
- no essential information to the right of `x=930`.

## Visual system

### Background

- solid `#0D1117`;
- flat low-contrast construction grid using `#405064`;
- no gradient, glow, perspective or decorative texture.

### Category badge

- upper-left placement;
- blue `#4DA3FF` capsule;
- dark `#0D1117` text and dot;
- IBM Plex Sans 700;
- uppercase;
- one concise category label.

The capsule is the single dominant chromatic signal. Red remains reserved for
live-state communication and violet must not be introduced decoratively.

### Headline

- IBM Plex Sans 700;
- `#F3F6FA`;
- left aligned;
- two or three short lines;
- line-height `0.95`;
- tracking `-0.028em`;
- no colored keyword, outline, shadow or glow.

The nominal sizes are 90 px horizontal and 118 px vertical. The renderer may
reduce the size within an explicit bounded range when required, but it must
never silently clip or overflow the text column.

### Founder portrait

- use the source PNG alpha channel directly;
- preserve face, hair, beard, clothing, expression, lighting and silhouette;
- no matte, halo, generated background or fade mask;
- scale with high-quality deterministic resampling;
- bleed through the bottom edge;
- never cover the headline.

### Brand signature

Use only the approved `Constructed LF` primary symbol as a small authorship
marker. This reconciles the cover standard with the application matrix in
`brand/SIGNATURE.md`, which assigns `Primary Symbol` to YouTube thumbnails and
Story/Reels covers.

Do not use the full lockup, wordmark, descriptor or institutional lockup. The
symbol must remain secondary to the headline and founder portrait.

## Demonstrative content set

The initial master pack contains four examples:

| ID | Category | Headline |
|---|---|---|
| `produtos-reais` | `CONSTRUINDO COM IA` | `PRODUTOS REAIS, NÃO PROMESSA.` |
| `do-zero-ao-produto` | `EM CONSTRUÇÃO` | `DO ZERO AO PRODUTO REAL.` |
| `isso-nao-funcionou` | `EXPERIMENTO` | `ISSO NÃO FUNCIONOU.` |
| `coloquei-no-ar` | `LANÇAMENTO` | `COLOQUEI NO AR. E AGORA?` |

These strings are demonstrative editorial copy, not new institutional
taglines, promises, product claims or canonical channel copy.

## Portrait distribution

The pack uses a purposeful subset instead of every possible combination:

- `front` for direct product-building communication;
- `present-right` or `present-left` when the gesture supports the text field;
- `neutral` for failure and learning communication;
- `smile-three-quarter` for launch communication.

`arms-crossed` remains the canonical social avatar source but is not mandatory
for editorial covers. The generator may use its wider portrait framing only
when the composition benefits from authority rather than gesture.

## Output structure

```text
brand-assets/capas/master-pack/
  horizontal/
    demo-<id>-1280x720.png
    demo-<id>-1280x720.jpg
  vertical/
    demo-<id>-1080x1920.png
    demo-<id>-1080x1920.jpg
  review/
    demo-master-pack-contact-sheet.png
```

The `demo-` prefix is mandatory so demonstrative covers cannot be mistaken for
published editorial claims. PNG is the lossless master; JPG is the optimized
upload derivative.

## Reuse interface

The generator must support rebuilding the complete pack and rendering one
content entry without editing layout code. A future production cover should
require changing only content data and choosing an approved portrait.

The content model must reject:

- missing identifiers;
- duplicate identifiers;
- unsupported portrait filenames;
- empty categories or headlines;
- unsupported formats;
- headline lines outside the approved count;
- text that cannot fit after bounded resizing.

## Validation

Automated validation must confirm:

- exact dimensions for every PNG and JPG;
- expected output count: 8 PNG and 8 JPG covers;
- one review contact sheet;
- background and palette values remain canonical;
- all source portraits belong to the approved founder cutout directory;
- headline and category fit their safe areas;
- symbol and text stay inside platform-safe boundaries;
- essential vertical content stays above `y=1620` and left of `x=930`;
- no gradient, glow, lower accent bar or noncanonical font is introduced;
- repository tests, brand asset validation and Astro build pass;
- unrelated untracked files remain untouched.

## Implementation evidence

- `npm run video-cover-pack:test`: 9 of 9 focused tests passed, with 0
  failures; the three-entry and five-entry rejection cases also confirmed that
  no derivative output directory or files were written.
- `npm run brand-assets:validate`: 78 assets passed signature, pixel-safe-zone,
  mirror, format, transparency, color, font, URL and dimension validation.
- Generated pack: 17 output files observed — 16 cover derivatives comprising
  8 PNG and 8 JPG files, plus one 2400×2400 PNG review contact sheet.
- `npm run build`: 86 required token paths validated with no drift, 78 brand
  assets generated, and Astro generated 6 static pages without error.
- `git diff --check`: completed with no output.
- Visual review: all 8 compositions in the contact sheet passed the complete
  audit checklist at original detail; no visual defect or regeneration was
  required.

## Governance and delivery

Implementation must:

1. preserve `brand/PADRAO-CAPAS.md` as the governing visual rule;
2. add a reusable deterministic renderer and content configuration;
3. generate the initial demonstrative pack;
4. add focused automated tests;
5. register implementation evidence in the Obsidian vault;
6. audit and stage only intentional files;
7. commit to `main` and push to `origin/main` after validation.

No platform upload, publication, deploy or replacement of existing live covers
is included in this scope.
