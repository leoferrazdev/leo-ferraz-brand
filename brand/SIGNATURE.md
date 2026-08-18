---
document: SIGNATURE
brand: Leo Ferraz
version: 0.4.0
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

The primary lockup is the formal combined signature for standalone brand introductions, presentations, press materials and public surfaces where neither the platform interface nor another nearby signature already identifies the brand. It is not a universal default.

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

The wordmark uses a logo-specific optical weight so its stems match the Constructed LF geometry. This weight belongs to the signature only and does not change the approved body or interface typography. The name-only asset is the name-led signature for website navigation, footer identity, authorship, bylines, credits, editorial covers and contexts where the symbol would compete with the content.

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

## Responsive signature distribution

The signature system is responsive. Context, available space, surrounding platform identity and content hierarchy determine which approved variant is used.

```text
Primary Symbol:
compact recognition

Wordmark Only:
name-led authorship

Primary Lockup:
formal standalone introduction

Descriptor Lockup:
brand plus proposition

Institutional Lockup:
governance and institutional contexts
```

Canonical application matrix:

| Context | Canonical variant |
|---|---|
| Avatar, favicon, app icon | Primary Symbol |
| Persistent OBS brand bug | Primary Symbol |
| YouTube thumbnail | Primary Symbol |
| Story/Reels cover | Primary Symbol |
| Constrained interface identity | Primary Symbol |
| Website header | Wordmark Only |
| Website footer | Wordmark Only |
| Editorial authorship and byline | Wordmark Only |
| Instagram carousel/feed cover | Wordmark Only |
| Social square | Wordmark Only |
| OBS scene | Wordmark Only |
| Formal standalone brand surface | Primary Lockup |
| YouTube and Twitch channel banner | Descriptor Lockup |
| OBS lower third | Descriptor Lockup |
| Homepage Open Graph default | Descriptor Lockup |
| Brandbook and signature review | Institutional Lockup |
| Press and formal institutional material | Institutional Lockup |

The combined lockup must not be repeated merely because space is available. A persistent brand bug and another complete scene signature must not be active simultaneously. Product artifacts, editorial headlines and evidence retain visual priority.

Website hierarchy:

```text
Favicon:
Primary Symbol

Header:
Wordmark Only

Hero:
no repeated signature
AI-NATIVE PRODUCT LAB
Building with AI
Construindo produtos reais com IA.

Footer:
Wordmark Only
institutional metadata remains separate
```

The homepage hero does not repeat the Master Brand after the header has identified it. `AI-Native Product Lab` appears only once in the hero composition.

## Compact behavior

The Constructed LF symbol is the compact identity for:

- avatar;
- favicon;
- browser shortcut;
- app or web icon;
- persistent OBS brand bug;
- YouTube thumbnail marker;
- Story/Reels marker;
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
