---
title: Arms-Crossed Founder Social Avatar Design
date: 2026-08-22
status: approved
implementation_status: implemented
supersedes: 2026-08-22-founder-social-avatar-design.md
---

# Arms-Crossed Founder Social Avatar Design

## Objective

Replace the current neutral founder portrait with the founder-approved
`Arms-Crossed Authority` portrait as the canonical avatar for every social
network listed in `brand/CHANNEL_SETUP_CHECKLIST.md`.

The change increases perceived authority while preserving the existing dark,
direct and technical brand language. The founder-approved close-crop revision
prioritizes facial recognition over complete visibility of the crossed-arm
posture.

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
- Background rationale: use the canonical `Precision / Product` foundation so
  the portrait visually merges with the dark-neutral channel system.
- Background texture: none. The Construction Grid remains appropriate for
  banners and editorial surfaces, but is prohibited inside the compact avatar
  because it would add noise and weaken the founder silhouette.
- Crop source: close square crop, centered horizontally and anchored at the top.
- Approved source crop: `left: 151`, `top: 0`, `width: 820`, `height: 820`.
- Subject: horizontally centered.
- Hair and face: fully retained inside the circular safe area.
- Face priority: the head and facial features dominate the circular crop.
- Posture cue: shoulders and upper torso may communicate authority, but the
  crossed arms do not need to remain fully visible in the avatar.
- Small-size priority: facial recognition takes precedence at every profile
  size, especially at 64 px and below.
- Edge treatment: preserve the intentional blue rim light while removing every
  white, grey or checkerboard-derived matte pixel at the cutout boundary.
- Compositing order: crop at source resolution, flatten onto `#0D1117`, then
  resize the opaque master. Resizing a still-transparent cutout before
  flattening is prohibited because it can blend light hidden RGB values into
  the visible silhouette.
- Defringe boundary: edge decontamination may affect only the anti-aliased
  transition pixels around the silhouette. It must not reshape hair, ears,
  beard, shoulders, arms or hands.

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
- no light matte, white halo or checkerboard residue around the silhouette;

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
- no light-pixel contamination in the cutout boundary after compositing;
- natural hair and beard detail remain intact after edge decontamination;
- identical composition across all three exports;
- face recognition at 64 px and 32 px;
- no clipping of hair, eyes, ears, nose, mouth or chin in a circular crop;
- face remains visually dominant at 256 px and above;
- shoulders remain sufficient to avoid a floating-head effect;
- no checkerboard residue, halo, text, symbol or decorative treatment;
- the six approved founder cutouts remain byte-identical;
- only intentional pipeline, documentation and canonical avatar files enter
  the implementation commit.

## Governance impact

Implementation must:

- update the deterministic avatar builder and its automated test to use the
  approved arms-crossed source and crop;
- enforce native-resolution flattening before resize and validate the perimeter
  against bright fringe contamination;
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
