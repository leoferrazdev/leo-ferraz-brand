# Plano executado — Sistema de cenas ao vivo no Streamlabs

## Objetivo

Configurar a coleção `Leo Ferraz — YouTube / Twitch` no Streamlabs Desktop 1.21.9 para lives 16:9 em 1920×1080, sem iniciar transmissão, autenticar contas ou inserir chaves.

## Fonte de verdade dos assets

Usar `live/obs/`, que espelha os exports aprovados. `MONTAGEM.md` define as coordenadas; arquivos `-guia` são somente referência e nunca entram no ar.

## Composição executada

| Cena | Fontes horizontais |
| --- | --- |
| 01 — Starting Soon | `BG — Starting Soon` → `01-comecando-em-breve.png` em 0, 0 |
| 02 — Camera Only | `Video Capture Device`; `Overlay — Ao vivo` em 1620, 60; `Overlay — Identificação` em 60, 840; `Overlay — Rodapé link` em 60, 950 |
| 03 — Live Main | `BG — Ao vivo`; câmera em 240, 120 · 1440×810; `ASSUNTO DE AGORA` em 240, 962 · 1000×62 |
| 04 — Build / Artifact | `BG — Construção`; `O QUE ESTOU CONSTRUINDO` em 360, 40 · 1200×64; `Screen Capture` em 40, 140 · 1520×855; câmera em 1592, 140 · 288×162 |
| 05 — Be Right Back | `BG — Já volto` → `05-ja-volto.png` em 0, 0 |
| 06 — Stream Ending | `BG — Encerrando` → `06-encerrando.png` em 0, 0 |
| 07 — Offline | `BG — Fora do ar` → `07-fora-do-ar.png` em 0, 0 |

Fontes reutilizáveis preservadas: `Desktop Audio`, `Mic/Aux`, `Screen Capture` e `Video Capture Device`. O `brand-bug.png` não foi usado nas cenas porque as artes de fundo já carregam assinatura; os textos dinâmicos permanecem editáveis no Streamlabs.

## Verificação

- [x] Coleção ativa carregada após reabrir o Streamlabs.
- [x] Oito cenas presentes, incluindo a cena-raiz da coleção.
- [x] Quinze fontes presentes: quatro reutilizáveis, nove imagens e dois textos.
- [x] Todas as imagens apontam para arquivos existentes em `live/obs/`.
- [x] Canvas horizontal validado em 1920×1080.
- [x] A cena `01 — Starting Soon` ficou selecionada como cena ativa.
- [x] A transmissão não foi iniciada; nenhuma conta, chave ou integração externa foi alterada.

## Registro

Execução, evidência e pendências foram registradas em `cofre-leoferraz-dev/02_EXECUCAO/2026-08/2026-08-20 — Sistema de Cenas ao Vivo.md`.
