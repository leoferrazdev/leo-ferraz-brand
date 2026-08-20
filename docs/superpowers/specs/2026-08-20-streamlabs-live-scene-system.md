# Streamlabs Live Scene System

## Objetivo

Criar uma coleção operacional de cenas 16:9 em 1080p para transmissões do projeto Leo Ferraz no YouTube e Twitch, usando os assets live aprovados e as fontes já disponíveis no Streamlabs Desktop.

## Arquitetura aprovada

Coleção: `Leo Ferraz — YouTube / Twitch`

- `01 — Starting Soon`: `live/obs/01-comecando-em-breve.png` em tela cheia, sem câmera.
- `02 — Camera Only`: câmera em tela cheia, selo `AO VIVO`, lower third e rodapé de link.
- `03 — Live Main`: `03-ao-vivo.png`, câmera em 240, 120 com 1440×810 e texto editável do assunto em 240, 962 com 1000×62.
- `04 — Build / Artifact`: `04-construcao.png`, texto editável no topo, tela em 40, 140 com 1520×855 e câmera em 1592, 140 com 288×162.
- `05 — Be Right Back`: `live/obs/05-ja-volto.png` em tela cheia.
- `06 — Stream Ending`: `live/obs/06-encerrando.png` em tela cheia.
- `07 — Offline`: `live/obs/07-fora-do-ar.png` em tela cheia.

## Fontes

Reutilizar `Video Capture Device`, `Screen Capture`, `Desktop Audio` e `Mic/Aux` quando possível. Assets estáticos serão adicionados como fontes de imagem; `ASSUNTO DE AGORA` e `O QUE ESTOU CONSTRUINDO` serão fontes de texto editáveis. O `brand-bug.png` não entra nas cenas que já possuem assinatura na arte.

Os arquivos de montagem são `live/obs/MONTAGEM.md`, `03-ao-vivo-guia.png` e `04-construcao-guia.png`. Os arquivos `-guia` são somente referência e nunca entram no ar.

## Limites

Não iniciar transmissão nesta etapa. Não autenticar contas, inserir chaves de transmissão ou configurar integrações externas de widgets sem instrução específica. Não apagar fontes existentes sem substituir por equivalente funcional.

## Critério de sucesso

Todas as sete cenas existem na coleção aprovada, possuem composição coerente com sua função, usam 16:9/1080p e permanecem editáveis no Streamlabs.
