---
document: SIGNATURE
brand: Leo Ferraz
version: 0.2.0
status: approved
authority: Leo Ferraz
decision_basis: founder_visual_review
selected_system: Editorial Tech Lockup
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

The approved signature system is `Editorial Tech Lockup`.

> The name is the identity. The system provides the recognition; the marker provides a restrained structural cue.

The signature is a deterministic typographic system for identifying the author beside real products, artifacts and evidence. It uses a small removable structural marker, not an abstract AI symbol, illustrative logo or proprietary monogram.

## Primary Wordmark

```text
Primary Wordmark:
Leo Ferraz

Typeface:
IBM Plex Sans

Weight:
500

Signature Tracking:
-0.035em

Construction:
typographic wordmark with optional structural marker
```

The wordmark uses the unmodified text `Leo Ferraz` in IBM Plex Sans at weight 500 with signature tracking `-0.035em`. It does not use custom lettering, glyph alterations or a manually authored SVG.

```text
primary_identity:
Leo Ferraz

primary_symbol:
none

structural_marker:
square · 8px · #4DA3FF · optional
```

## Descriptor

```text
Descriptor:
Building with AI
```

`Building with AI` complements `Leo Ferraz` as a subordinate descriptor. It is optional, removable and context-dependent; it is not inseparable from the Master Brand and does not replace it.

### Primary Lockup

```text
Leo Ferraz
Building with AI
```

The name is primary. The descriptor is subordinate and may be omitted where space, context or artifact priority requires it.

## Structural Marker

```text
Shape:
square

Size:
8px

Gap:
8px

Color:
#4DA3FF

Role:
functional structural cue only

Compact behavior:
optional when space or artifact priority requires
```

The marker sits beside the primary wordmark and is removable without changing the identity. It is not a monogram, AI symbol, logo, decorative ornament or standalone asset. It must not use glow, gradient, shadow, animation or any color outside the approved Precision / Product system. In monochrome contexts it adopts the active text color.

### Institutional Lockup

```text
Leo Ferraz
Building with AI
AI-Native Product Lab
```

The institutional category is a separate supporting line with an explicit lower hierarchy. It is not a logo element, slogan or manifesto.

## Utility Mark

```text
core_monogram:
none

secondary_utility_mark:
LF

utility_mark_typeface:
IBM Plex Sans

utility_mark_weight:
500
```

`LF` is a plain typographic abbreviation for extremely constrained digital contexts.

> LF is a secondary utility identifier, not the primary Leo Ferraz signature.

`LF` is not the primary logo. It may be used for a favicon, browser shortcut, small avatar, compact digital identity marker or an extremely constrained interface. It must not be used in a hero, a website header with space, institutional communication, a social cover, an editorial signature, a brandbook title, a presentation cover or a major marketing application.

Circle and square crops are platform-imposed containers only; neither is a proprietary identity shape.

## Behavior and Reproduction

The primary signature must survive in monochrome and does not depend on `#4DA3FF`. Gradients, glow and decorative shadows are prohibited. The signature identifies authorship and must remain subordinate to the product artifact.

> The signature identifies the author. It does not compete with the artifact.

The factual reasons for selecting Editorial Tech Lockup are direct founder recognition, high artifact compatibility, strong monochrome behavior, low trend dependency, high deterministic reproducibility and compatibility with Product / Editorial typography. The marker adds a restrained repeatable cue without becoming a symbol. These are decision reasons, not a claim of universal superiority.

The historical exploration recorded possible generic SaaS/system character as the risk of Structured / Product, and metadata/system treatment competing with the founder name and artifacts as the risk of Signature / System. Both remain historical evidence; neither is classified as rejected, failed, invalid or deprecated.

## Open Technical Values

```text
wordmark_minimum_size:
18px

utility_mark_minimum_size:
16px × 16px

signature_clear_space:
wordmark: 0.5em
utility mark: 0.25em

marker:
size: 8px
gap: 8px
color: #4DA3FF
```

Minimum size and clear space are approved signature constraints and are encoded in `tokens/tokens.json`.

## Assets and Projection

The implementation derives outlined SVG assets from the approved typographic signature. No manually authored logo asset is introduced:

```text
logo.svg:
not_created

wordmark.svg:
not_created

monogram.svg:
not_created

lf.svg:
secondary utility asset
```

The Review Lab is retained at `/brand/review/signature/` for local development and evidence only. It must return HTTP 200 in development and remain absent from the production build. The public `/brand/` projection shows only the approved Editorial Tech Lockup signature.

## Unchanged Governance States

```text
semantic_colors:
not_defined

light_mode:
not_defined

tokens:
implemented in DESIGN_TOKENS.md
```

No other open brand decision is resolved by this document.
