---
document: LIVE_LAUNCH_PACK
brand: Leo Ferraz
brand_system: 1.0.0
purpose: day-1 public launch readiness
status: approved
authority: delegated operational implementation
derived_from: v1.0.0
---

# Leo Ferraz Day-1 Launch Pack

Este documento governa somente a projeção operacional da identidade aprovada em canais, templates, live kit e website. Não substitui nem altera os documentos canônicos de `brand/`.

## Fonte de identidade

```text
Brand System source: v1.0.0
Source commit: b2ae95cca8d6b62c6579c415113852b8ef8c8b09
Master Brand: Leo Ferraz
Descriptor: Building with AI
Institutional Category: AI-Native Product Lab
Signature: Editorial Tech Lockup
Typography: Product / Editorial
Color: Precision / Product
Visual Foundations: Modular / Product
Primary Symbol: none · structural marker only
Secondary Utility Mark: LF
```

`Leo Ferraz` permanece a assinatura primária. O marcador estrutural quadrado de `8px` usa `#4DA3FF` apenas como sinal funcional e pode ser removido em contextos compactos. `LF` é somente o utility mark para contextos compactos, como avatar, favicon e bug de transmissão.

## Asset pipeline

```text
brand-assets/sources/
  content.json
  content/live-001.json
      ↓
scripts/build-brand-assets.mjs
      ↓
brand-assets/exports/day-1/
      ↓
scripts/validate-brand-assets.mjs
```

Os wordmarks externos são SVGs outlined, derivados do arquivo Fontsource IBM Plex Sans 500 instalado. Nenhuma fonte é distribuída ou incorporada nos SVGs.

Comandos:

```bash
npm run brand-assets:build
npm run brand-assets:validate
npm run brand:render -- --template youtube-thumbnail --content live-001
```

O conteúdo é separado do template. O render falha fechado para template ou conteúdo desconhecido.

## Export map

```text
brand-assets/exports/day-1/01-profile/
→ wordmarks, lockups, LF, avatars e crops

brand-assets/exports/day-1/02-channels/
→ YouTube e Twitch banners

brand-assets/exports/day-1/03-live/obs/
→ Starting Soon, Live, BRB, Ending, Offline

brand-assets/exports/day-1/04-social/
→ Instagram, Story/Reels e square

brand-assets/exports/day-1/05-youtube/
→ thumbnails

brand-assets/exports/day-1/06-web/
→ favicon, manifest e Open Graph
```

O mapa rápido para upload está em `brand-assets/exports/README.md`.

## Template rules

Estas são regras operacionais dos templates, não novas regras universais do Brand System:

- headline: máximo de 2 linhas; overflow falha em vez de reduzir indefinidamente;
- headline: permanece a informação primária quando há produto, screenshot ou evidência;
- artifact: ocupa o slot principal disponível e não é coberto pela assinatura;
- signature: permanece subordinada ao artifact e usa `Leo Ferraz` quando houver espaço;
- `LF`: somente em avatar, favicon, bug ou contexto realmente compacto;
- fontes: somente IBM Plex Sans e IBM Plex Mono;
- cor: somente tokens aprovados, sem glow, gradient ou efeito decorativo;
- live canvas: 1920×1080; identidade ocupa somente a camada de autoria;
- overlays: alpha real quando aplicável.

Exemplo demonstrativo inicial:

```text
brand-assets/exports/day-1/05-youtube/live-001-youtube-thumbnail-1280x720.png
```

O exemplo é explicitamente demonstrativo e não declara audiência, resultado ou promessa.

## Platform delivery requirements

As dimensões abaixo são requisitos de entrega de plataformas, não decisões permanentes da marca. As fontes e a data de consulta estão registradas em `brand/CHANNEL_SETUP_CHECKLIST.md`.

```text
YouTube banner: 2560×1440; conteúdo essencial na área segura central
YouTube thumbnail: 16:9; master 3840×2160; export rápido 1280×720
Twitch profile banner: 1200×480
Instagram Reels: 9:16; cover crop 420×654
Instagram Story: 1080×1920
Instagram carousel/feed: 1080×1350
Social square: 1080×1080
Open Graph: 1200×630
```

## Live workflow

```text
1. definir título da live
2. gerar thumbnail
3. gerar anúncio Instagram
4. gerar Story/Reels
5. configurar Twitch/YouTube
6. carregar scenes no OBS
7. iniciar transmissão
8. usar Starting Soon
9. entrar em Live/Main
10. usar BRB quando necessário
11. usar Ending
```

## Day-1 decision

```text
operational_assets_status: approved
canonical_brand_status: unchanged
platform_uploads: manual
site_deploy: existing GitHub Actions workflow / post-push
```

A aprovação operacional não promove nenhum documento de identidade nem altera `v1.0.0`.
