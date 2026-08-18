---
title: Responsive Signature Distribution
date: 2026-08-18
document_type: design-specification
status: approved
scope: canonical-signature-assets-and-site
source_brand_system: v1.0.0
---

# Responsive Signature Distribution

## Decision

The Leo Ferraz identity remains a hybrid system, but the combined primary lockup is no longer a universal default. Each approved signature variant has one functional role:

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

The variants are coordinated expressions of one brand. They are not competing logos and must not be assembled ad hoc from separate text or CSS.

## Canonical Distribution

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

## Website Hierarchy

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

The homepage hero must not repeat the Master Brand already identified by the header. `AI-Native Product Lab` must appear only once in the hero composition.

## Asset Composition Rules

- Delivery assets consume canonical vector signature primitives.
- The public underline remains part of every wordmark-bearing variant.
- Social and video templates prioritize content over signature size.
- A persistent brand bug and a full scene signature must not be displayed simultaneously.
- The homepage Open Graph image identifies the brand once and must not repeat `Leo Ferraz` as both lockup and headline.
- Existing dimensions, safe zones, colors, typography families and canonical copy remain unchanged.
- Legacy aliases remain available for compatibility but are not used by new compositions.

## Validation Contract

Each generated application asset records a `signature_variant` in `brand-assets/manifest.json`. Validation fails when a known role is generated with the wrong variant.

Expected values:

```text
primary-symbol
wordmark-only
primary-lockup
descriptor-lockup
institutional-lockup
none
```

## Non-goals

- no new symbol geometry;
- no new wordmark geometry;
- no color, typography or underline changes;
- no new public copy;
- no changes to product identities;
- no manual deployment.

## Acceptance Criteria

- `brand/SIGNATURE.md` contains the responsive distribution rule;
- all Day-1 exports are regenerated from the updated mapping;
- avatars and web icons remain symbol-only;
- channel banners use descriptor lockup;
- social and video assets use compact variants by role;
- the site header uses wordmark-only;
- the homepage hero contains no second logo;
- the footer uses wordmark-only with separate metadata;
- asset validation and two static builds pass;
- only intentional files are committed and pushed to `origin/main`.
