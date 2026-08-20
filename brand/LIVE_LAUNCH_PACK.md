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
Signature: Constructed LF Lockup
Typography: Product / Editorial
Color: Precision / Product
Visual Foundations: Modular / Product
Primary Symbol: Constructed LF
Secondary Utility Mark: superseded
```

`Leo Ferraz` permanece a Master Brand. A assinatura primária combina o símbolo geométrico proprietário `Constructed LF` com o wordmark `Leo Ferraz`. O módulo ativo usa `#4DA3FF` como sinal funcional; avatar, favicon e contextos compactos usam o símbolo sem o wordmark.

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

Os wordmarks externos são SVGs outlined, derivados do arquivo Fontsource IBM Plex Sans 700 instalado para correspondência óptica com o símbolo. Nenhuma fonte é distribuída ou incorporada nos SVGs.

Comandos:

```bash
npm run brand-assets:build
npm run brand-assets:validate
npm run brand:render -- --template youtube-thumbnail --content live-001
npm run brand:render -- --template instagram-carousel-slide --content SEU-CONTEUDO
```

O conteúdo é separado do template. O render falha fechado para template ou conteúdo desconhecido.

Toda saída de `brand:render` vai por padrão para `brand-assets/content-renders/`, fora de `brand-assets/exports/`. Isso é proposital: `brand-assets:build` apaga e regenera `brand-assets/exports/` inteira a cada execução (inclusive como pré-requisito de `npm run dev` e `npm run build`), e um render ad-hoc salvo dentro dessa árvore seria apagado silenciosamente na próxima vez que alguém rodasse o site.

`instagram-carousel-slide` gera as telas internas de um carrossel (cover continua sendo `instagram-carousel`) a partir de um `slides: []` no JSON de conteúdo, uma imagem por item, com paginação `n / total` e assinatura compacta (`wordmark-only`) subordinada ao conteúdo. `carousel-slide-demo` em `brand-assets/sources/content/` é demonstração de template, não conteúdo publicável. `launch-day-0` contém a peça de lançamento derivada apenas da bio/manifesto já aprovados, pronta para os formatos de imagem única (thumbnail, story, square, capa de carrossel).

## Export map

```text
brand-assets/exports/day-1/01-profile/
→ logos, accent underline variant, lockups, símbolo, avatars e crops

brand-assets/exports/day-1/02-channels/
→ YouTube e Twitch banners

brand-assets/exports/day-1/03-live/obs/
→ cenas 01, 03, 04, 05, 06, 07 e sobreposições transparentes
→ a cena 02 (câmera cheia) não tem fundo, só sobreposições
→ arquivos `-guia` trazem as coordenadas de montagem e não vão ao ar

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
- `Constructed LF`: isolado somente em avatar, favicon ou contexto realmente compacto;
- `Leo Ferraz`: usar o lockup híbrido com underline funcional nas aplicações públicas; o underline fica somente sob o wordmark;
- não usar barra azul vertical junto ao lockup; sinais de autoria devem respeitar a área segura e o underline do sistema;
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

## Safe-zone contract

Safe zones are applied by `scripts/build-brand-assets.mjs` and recorded per export in `brand-assets/manifest.json`. They are placement constraints, not visible artwork or review guides.

```text
YouTube banner 2560×1440: x=508, y=508, width=1544, height=423
Twitch banner 1200×480: x=48, y=48, width=1050, height=300
Story/Reels 9:16: horizontal 10%; vertical 12%
Thumbnails 16:9: horizontal and vertical 8%
Social square, carousel and Open Graph: horizontal and vertical 8%
OBS scenes: horizontal and vertical 10%
Avatars and web icons: optical inset 16% on each side
Wordmarks: clear space 0.5em
Constructed LF symbol: clear space 0.25em
Transparent overlays: minimum 16px inset
```

The validator fails if an export lacks safe-zone metadata, exceeds its canvas bounds or contains a dashed safe-area guide. The final delivery files contain no visible safe-zone annotation.

## Live workflow

```text
1. definir título da live
2. gerar thumbnail
3. gerar anúncio Instagram
4. gerar Story/Reels
5. configurar Twitch/YouTube
6. montar as cenas no OBS seguindo live/obs/MONTAGEM.md
7. iniciar transmissão
8. abrir na cena 01 (Começando em breve)
9. entrar na 02 (Câmera) ou 03 (Ao vivo)
10. alternar para a 04 (Construção / Artefato) ao mostrar tela
11. usar a 05 (Já volto) nas pausas
12. fechar com a 06 (Encerrando)
```

A 07 (Fora do ar) não entra no fluxo: é o banner que a Twitch exibe fora da transmissão.

## Day-1 decision

```text
operational_assets_status: approved
canonical_brand_status: unchanged
platform_uploads: manual
site_deploy: existing GitHub Actions workflow / post-push
```

A aprovação operacional não promove nenhum documento de identidade nem altera `v1.0.0`.
