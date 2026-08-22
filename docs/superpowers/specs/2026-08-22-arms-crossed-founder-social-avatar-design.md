---
title: Arms-Crossed Founder Social Avatar Design
date: 2026-08-22
status: approved
implementation_status: pending
supersedes: 2026-08-22-founder-social-avatar-design.md
---

# Arms-Crossed Founder Social Avatar Design

## Objective

Replace the current neutral founder portrait with the founder-approved
`Arms-Crossed Authority` portrait as the canonical avatar for every social
network listed in `brand/CHANNEL_SETUP_CHECKLIST.md`.

The change increases perceived authority and gives the founder portrait a more
distinctive posture while preserving the existing dark, direct and technical
brand language.

## Approved source

Use only:

`brand-assets/profile/leo-ferraz/leo-ferraz-cutout-arms-crossed.png`

Do not regenerate or modify the face, expression, hair, beard, clothing,
lighting, skin texture or body posture. The implementation is a deterministic
composition of the approved transparent cutout.

## Canonical role

`Arms-Crossed Authority` becomes the canonical photographic avatar for all
social profiles. It replaces `Neutral Direct` in the existing canonical export
filenames so every channel continues to consume one stable source.

`leo-ferraz-cutout-smile-three-quarter.png` becomes the declared historical and
alternative portrait for contexts that benefit from a warmer, more approachable
expression. It is not a second canonical avatar and must not create platform
inconsistency.

The neutral portrait remains preserved in the founder cutout pack without an
official avatar role. It must not remain declared as the canonical or preferred
alternative social-avatar source after implementation.

## Composition

- Canvas: square.
- Background: solid `#0D1117`.
- Crop source: full source width, using a square crop anchored at the top.
- Expected source crop: `left: 0`, `top: 0`, `width: 1122`, `height: 1122`.
- Subject: horizontally centered.
- Hair and face: fully retained inside the circular safe area.
- Crossed-arm posture: visibly retained at standard profile sizes where the
  platform crop allows it.
- Small-size priority: facial recognition takes precedence over complete arm
  visibility at 64 px and below.
- Edge treatment: preserve the existing blue rim light; do not add a border,
  halo or artificial contour.

## Prohibited treatments

- no text;
- no wordmark;
- no `LF` symbol;
- no construction grid;
- no decorative border;
- no gradient;
- no glow;
- no artificial background objects;
- no facial or body retouching;
- no synthetic replacement of any part of the subject.

## Deliverables

Replace the contents of the existing canonical files under
`brand-assets/profile/avatar/`:

- `leo-ferraz-avatar-1024.png` — canonical social-avatar master;
- `leo-ferraz-avatar-512.png` — standard platform export;
- `leo-ferraz-avatar-256.png` — compact platform export.

All outputs must remain opaque PNG files generated from the same 1024-pixel
master through high-quality deterministic downsampling. No new parallel
canonical filenames are introduced.

## Platform scope

The new canonical image applies to every photographic social avatar declared in
`brand/CHANNEL_SETUP_CHECKLIST.md`, including YouTube, Twitch, Instagram,
TikTok, X, LinkedIn, GitHub, Reddit and Substack.

Platform uploads remain manual unless a separately authorized and authenticated
platform-update task is executed. Replacing repository assets does not prove
that third-party profiles were updated.

## Validation

The implementation must verify:

- exact dimensions of 1024×1024, 512×512 and 256×256;
- PNG output without unintended transparency;
- background `#0D1117` at uncontested corner samples;
- identical composition across all three exports;
- face recognition at 64 px and 32 px;
- no clipping of hair, eyes, ears, nose, mouth or chin in a circular crop;
- crossed-arm posture remains perceptible at 256 px and above;
- no checkerboard residue, halo, text, symbol or decorative treatment;
- the six approved founder cutouts remain byte-identical;
- only intentional pipeline, documentation and canonical avatar files enter
  the implementation commit.

## Governance impact

Implementation must:

- update the deterministic avatar builder and its automated test to use the
  approved arms-crossed source and crop;
- regenerate the three canonical exports;
- update the source declaration in `brand/CHANNEL_SETUP_CHECKLIST.md`;
- register the superseding decision in the Obsidian vault;
- declare `leo-ferraz-cutout-smile-three-quarter.png` as the historical and
  alternative portrait without generating a second canonical export set;
- preserve the favicon, Constructed LF symbol, signature system and thumbnail
  portrait pack unchanged.

This specification supersedes the source choice in
`2026-08-22-founder-social-avatar-design.md` without erasing the historical
record of the previously implemented neutral avatar.
