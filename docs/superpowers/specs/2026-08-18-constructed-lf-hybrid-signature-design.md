---
title: Constructed LF Hybrid Signature
date: 2026-08-18
document_type: design-specification
status: approved
authority: delegated by Leo Ferraz
scope: primary-symbol-wordmark-and-derived-assets
---

# Constructed LF Hybrid Signature

## Problem

The `Editorial Tech Lockup` is systematic and reproducible, but its public exports still read as typeset text with a small marker. It does not provide a sufficiently ownable mark for avatars, favicons or compact recognition.

## Explored directions

### A — Constructed LF

A custom `LF` mark built on a 4px modular grid, paired with the existing name-led wordmark. It provides direct ownership, survives compact use and does not require a generic AI metaphor.

### B — Build Loop

An abstract open loop derived from `Idea → Build → Ship → Measure → Learn → Repeat`. It communicates iteration, but risks reading as a generic process or software icon.

### C — Proof Frame

A frame around a solid artifact module derived from `The product is the proof.` It supports the product narrative, but risks reading as a crop, scanner or camera symbol.

## Selected system

```text
Selected Signature System:
Constructed LF Lockup

Primary Symbol:
Constructed LF

Primary Lockup:
Constructed LF + Leo Ferraz
```

Direction A is selected because it creates the clearest proprietary identity at compact sizes while preserving the Master Brand name as the dominant public reading.

## Symbol construction

The symbol uses a `64 × 64` viewBox and a flat modular construction:

```text
L foundation:
M8 8H20V44H28V56H8Z

F structure:
M28 8H56V20H40V28H48V36H40V56H28Z

Active module:
x=48 y=28 width=8 height=8
```

The `L` and `F` are custom vector geometry, not font glyphs. The forms share a structural junction, creating one compact mark rather than two typed letters.

## Color behavior

- default primary geometry: `#F3F6FA`;
- active module: `#4DA3FF`;
- reversed/dark monochrome geometry: `#0D1117`;
- monochrome versions use one active foreground color for every module;
- no gradient, glow, shadow, outline or transparency effect.

The active module is a restrained signal. Recognition must remain intact without blue.

## Wordmark and lockups

`Leo Ferraz` remains the first verbal reading. IBM Plex Sans 500 and `-0.035em` tracking remain in the lockup to preserve continuity with Product / Editorial typography.

```text
Primary horizontal:
[Constructed LF] Leo Ferraz

Descriptor:
[Constructed LF] Leo Ferraz
                 Building with AI

Institutional:
[Constructed LF] Leo Ferraz
                 Building with AI
                 AI-Native Product Lab

Compact:
[Constructed LF]
```

The symbol and the wordmark may be separated only in explicitly compact contexts. `Building with AI` remains optional and subordinate. `AI-Native Product Lab` remains contextual and is never part of the symbol.

## Clear space and minimum size

```text
Symbol clear space:
0.25 × symbol width

Full lockup clear space:
0.5 × wordmark cap-height

Symbol minimum digital box:
16px functional minimum
24px preferred minimum

Full lockup minimum width:
120px
```

All platform exports must apply their own safe zones in addition to logo clear space. Safe-zone guides must never appear in delivery files.

## Asset architecture

The deterministic generator produces:

- primary horizontal logo;
- descriptor and institutional lockups;
- symbol-only positive and dark SVGs;
- avatar and favicon families using the symbol;
- channel, social, OBS and Open Graph assets using the hybrid lockup;
- manifest metadata and deterministic hash.

The legacy `leo-ferraz-wordmark.*` paths remain as compatibility aliases for the primary hybrid lockup. New canonical symbol files use `leo-ferraz-symbol.*`.

## Validation

The implementation must prove:

- all identity SVGs use vector outlines and geometry only;
- the constructed mark is present in every primary signature export;
- no typed `LF` remains in avatar or favicon assets;
- 16, 24, 32, 48, 64, 128, 256, 512 and 1024px outputs remain legible;
- full-color and monochrome variants survive;
- every export has safe-zone metadata within its canvas;
- no visible safe-zone guide is exported;
- build and static-site generation pass without new client JavaScript.

## Preserved decisions

This revision does not change the Master Brand, descriptor, category, handle, domain, canonical bio, manifesto, product universe, language architecture, typography families, color values or visual foundations.
