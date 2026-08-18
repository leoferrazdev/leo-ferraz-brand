# Brand asset sources

This directory contains deterministic source data for the post-v1 operational pack.

- `content.json` holds reusable, review-safe content values.
- `scripts/build-brand-assets.mjs` is the generator of record.
- `exports/` contains generated delivery files and must not be edited manually.

The generator derives outlined identity assets from the installed IBM Plex Sans 500 Fontsource asset. Font binaries are not copied into the exports.
