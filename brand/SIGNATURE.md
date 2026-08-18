---
document: SIGNATURE
brand: Leo Ferraz
version: 0.3.0
status: approved
authority: Leo Ferraz
decision_basis: delegated_deterministic_review
selected_system: Constructed LF Lockup
depends_on:
  - BRAND_FOUNDATION.md
  - TYPOGRAPHY.md
  - TYPOGRAPHY_IMPLEMENTATION.md
  - COLOR.md
  - VISUAL_FOUNDATIONS.md
  - SIGNATURE_OPTIONS.md
---

# Signature

## Decision

The approved signature system is `Constructed LF Lockup`.

> The symbol creates recognition. The name preserves authorship. The product remains the proof.

The system is hybrid: a custom geometric `LF` symbol is paired with the Master Brand wordmark `Leo Ferraz`. This replaces the typeset-only `Editorial Tech Lockup`, whose small square marker did not create enough ownable recognition in avatars, favicons and compact applications.

## Identity hierarchy

```text
Master Brand:
Leo Ferraz

Primary Symbol:
Constructed LF

Descriptor:
Building with AI

Institutional Category:
AI-Native Product Lab
```

The symbol does not rename the brand. `Leo Ferraz` remains the permanent Master Brand and the first verbal reading of the primary lockup.

## Primary symbol

```text
Name:
Constructed LF

Type:
custom geometric monogram

Construction Grid:
64 × 64 viewBox · 4px modular grid

Primary Geometry:
#F3F6FA

Active Module:
#4DA3FF
```

Exact geometry:

```text
L foundation:
M8 8H20V44H28V56H8Z

F structure:
M28 8H56V20H40V28H48V36H40V56H28Z

Active module:
x=48 y=28 width=8 height=8
```

The `L` and `F` are drawn as custom vector geometry and are not font glyphs. Their shared structural junction makes the mark one constructed unit. The active blue module is a controlled product-state signal; it is not an AI metaphor and the mark must remain recognizable without it.

## Primary lockup

```text
[Constructed LF] Leo Ferraz
```

The primary lockup is the default signature for headers, channel covers, institutional surfaces, editorial authorship and public brand applications.

### Wordmark-only application

```text
Text:
Leo Ferraz

Typeface:
IBM Plex Sans

Weight:
700

Tracking:
-0.035em
```

The wordmark uses a logo-specific optical weight so its stems match the Constructed LF geometry. This weight belongs to the signature only and does not change the approved body or interface typography. The name-only asset is a valid signature for authorship, bylines, credits and contexts where the symbol would compete with the content.

### Public accent underline

The public lockup uses a flat functional underline only beneath `Leo Ferraz`:

```text
Line:
#4DA3FF · full wordmark width · 2px

Terminal module:
#86C5FF · 8px × 2px

Offset:
8px below baseline
```

This treatment is the default for public wordmark, descriptor, institutional, channel, social and live exports. The unlined geometry is retained only as an internal construction reference; delivery assets must use the underlined lockup whenever the full name is present. It must not receive glow, blur, gradient, animation, dark-blue track or increased thickness, and it never extends beneath the symbol.

## Descriptor and institutional lockups

```text
[Constructed LF] Leo Ferraz
                 Building with AI
```

```text
[Constructed LF] Leo Ferraz
                 Building with AI
                 AI-Native Product Lab
```

`Building with AI` remains optional, removable and subordinate. `AI-Native Product Lab` remains a separate contextual line and is never part of the symbol.

Canonical asset roles are explicit:

```text
primary lockup:
Constructed LF + Leo Ferraz

wordmark-only:
Leo Ferraz

descriptor lockup:
Constructed LF + Leo Ferraz + Building with AI

institutional lockup:
Constructed LF + Leo Ferraz + Building with AI + AI-Native Product Lab

primary symbol:
Constructed LF
```

The lockup is not mandatory in every application. Symbol-only remains the compact identity; wordmark-only remains the name-led identity. These are coordinated applications of one signature system, not competing brands.

## Compact behavior

The Constructed LF symbol is the compact identity for:

- avatar;
- favicon;
- browser shortcut;
- app or web icon;
- OBS brand bug when the full name would be too small;
- constrained UI identity.

The former plain typed `LF` utility mark is superseded. It must not be used as the canonical avatar or favicon after regeneration.

## Color and monochrome

Default on dark:

```text
Primary Geometry: #F3F6FA
Active Module: #4DA3FF
```

Monochrome light uses one light foreground color. Monochrome dark uses `#0D1117`. The system must not use gradients, glow, decorative shadow, outline, rotation or transparency effects.

## Clear space and minimum size

```text
Symbol clear space:
0.25 × symbol width

Full lockup clear space:
0.5 × wordmark cap-height

Symbol minimum digital box:
16px functional · 24px preferred

Full lockup minimum width:
120px
```

Platform safe zones are additional constraints and do not replace logo clear space. Safe-zone guides must not appear in delivery files.

## Product relationship

The symbol identifies the Master Brand but must not visually absorb independent products.

> The Master Brand frames products. It does not visually absorb them.

Product artifacts, screenshots and evidence remain visually prior in product-led compositions.

## Assets and projection

```text
leo-ferraz-logo-horizontal.svg:
legacy compatibility alias for the primary lockup

leo-ferraz-primary-lockup.svg:
canonical hybrid logo

leo-ferraz-symbol.svg:
primary symbol

leo-ferraz-wordmark.svg:
legacy compatibility alias for the primary lockup

leo-ferraz-wordmark-only.svg:
canonical name-only wordmark

leo-ferraz-wordmark-underline.svg:
legacy compatibility alias for the primary lockup

leo-ferraz-descriptor-lockup.svg:
canonical descriptor lockup

leo-ferraz-institutional-lockup.svg:
canonical institutional lockup

avatar-*:
Constructed LF symbol

favicon-*:
Constructed LF symbol
```

Identity SVGs contain vector outlines and geometry only. Font binaries, `<text>`, scripts, external URLs, gradients and filters are prohibited.

## Superseded system

`Editorial Tech Lockup` remains historical evidence of the prior approved stage. Its square marker and typed `LF` utility treatment are superseded by the Constructed LF primary symbol. They must not coexist as competing canonical signatures.

## Preserved governance states

No Master Brand, descriptor, category, handle, domain, language, typography-family, color-palette or visual-foundation decision is changed by this revision.
