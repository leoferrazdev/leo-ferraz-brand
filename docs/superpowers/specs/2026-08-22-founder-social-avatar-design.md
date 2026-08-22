---
title: Founder Social Avatar Design
date: 2026-08-22
status: approved
implementation_status: pending
---

# Founder Social Avatar Design

## Objective

Replace the provisional social-profile avatar with a consistent founder portrait that remains recognizable at small sizes and works in both circular and square platform crops.

## Approved source

Use only:

`brand-assets/profile/leo-ferraz/leo-ferraz-cutout-neutral.png`

The approved source provides direct eye contact, a neutral and approachable expression, a black shirt, a clean silhouette and sufficient head-and-shoulders information for compact crops.

Do not regenerate the face, expression, hair, beard, clothing or lighting. The implementation is a deterministic composition of the approved cutout, not a new synthetic portrait.

## Composition

- Canvas: square.
- Background: solid `#0D1117`.
- Subject: optically centered, with the face occupying approximately 70% of the circular crop diameter.
- Eye line: approximately 42% of canvas height.
- Shoulders: retained in the lower quarter to avoid a floating-head effect.
- Safe area: all essential facial features remain inside the central 80% circle.
- Edge treatment: preserve the existing blue rim light; do not add a border or halo.

## Prohibited treatments

- no text;
- no wordmark;
- no `LF` symbol;
- no construction grid;
- no decorative border;
- no gradient;
- no glow;
- no artificial background objects;
- no facial retouching or identity alteration.

## Deliverables

Create the following opaque PNG files under `brand-assets/profile/avatar/`:

- `leo-ferraz-avatar-1024.png` — canonical social avatar master;
- `leo-ferraz-avatar-512.png` — standard platform export;
- `leo-ferraz-avatar-256.png` — compact platform export.

The three outputs must be derived from the same 1024-pixel master using high-quality downsampling. The existing filenames are intentionally retained because `brand/CHANNEL_SETUP_CHECKLIST.md` already references them.

## Validation

The implementation must verify:

- exact dimensions of 1024×1024, 512×512 and 256×256;
- PNG RGB or RGBA output with no unintended transparent background;
- identical composition across all sizes;
- legibility at 64 px and 32 px preview sizes;
- no clipping in a circular crop;
- no visible checkerboard residue or edge contamination;
- only the three intended avatar files change in Git;
- the prior thumbnail cutouts remain unchanged.

## Governance impact

After implementation, update the avatar source declaration in `brand/CHANNEL_SETUP_CHECKLIST.md` and record the replacement in the Obsidian decision log. This design changes only the social avatar source and exports. It does not change the favicon, Constructed LF symbol, signature system or thumbnail portrait pack.
