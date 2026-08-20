# Chatbox da cena 04 — Design aprovado para revisão

## Objetivo

Adaptar a fonte nativa `Caixa de chat` do Streamlabs Desktop ao slot `CHAT / NOTAS` da cena `04 — Build / Artifact`, preservando a ingestão oficial do chat do YouTube e demais plataformas e aplicando a identidade Leo Ferraz.

## Contexto observado

- A fonte é um `browser_source` chamado `Caixa de chat`.
- O widget usa URL oficial do Streamlabs Chat Box.
- A configuração atual está em 600×600 e o CSS personalizado contém apenas um `body` transparente.
- A instância horizontal atual ainda está fora do slot: `x=0`, `y=240`.
- `live/obs/MONTAGEM.md` define o slot como `x=1592`, `y=326`, `288×669`.
- O fundo `04-construcao.png` já desenha a área visual do painel; o widget não deve adicionar um grande retângulo opaco por cima dele.

## Decisão de arquitetura

Manter o motor nativo do Chat Box. O HTML personalizado deve preservar `#log` e o template `#chatlist_item`, que são os pontos de montagem das mensagens. O CSS controla layout, legibilidade, cores, espaçamento, emotes e animação. O JavaScript apenas reage ao evento `onEventReceived` para aplicar classes de plataforma, atualizar o nome exibido quando houver `display-name` e limitar o histórico visível.

Não haverá API própria, polling, CDN, biblioteca externa, dados falsos ou substituição do transporte do Streamlabs. O código deve funcionar mesmo quando `platform`, `tags`, badges ou emotes estiverem ausentes.

## Direção visual

- Canvas transparente, para respeitar o painel já desenhado no fundo.
- Tipografia `IBM Plex Sans`, com fallback sans-serif local.
- Texto principal claro e nome do usuário com a cor fornecida pelo widget, sem glow.
- Cartões compactos em `rgba(7, 13, 20, .86)`, borda fina e acento funcional `#4DA3FF`.
- Raio pequeno, sem aparência de painel arredondado genérico.
- Mensagens empilhadas de baixo para cima, com oito mensagens visíveis no máximo.
- Quebra de linha no conteúdo; overflow horizontal sempre oculto.
- Animação curta de entrada; mensagens antigas desaparecem por CSS sem deslocar a composição inteira.

## Alterações no Streamlabs

1. Definir a fonte `Caixa de chat` como 288×669.
2. Posicionar sua instância horizontal em `x=1592`, `y=326`, escala 1×1.
3. Inserir o HTML, CSS e JS aprovados nos respectivos painéis de Código personalizado.
4. Atualizar o cache da página e conferir a cena 04; não iniciar transmissão.

## Critérios de aceitação

- O Chat Box continua recebendo mensagens pelo Streamlabs.
- O conteúdo ocupa somente o slot 288×669 da cena 04.
- O fundo da arte permanece visível ao redor das mensagens.
- Mensagens longas quebram sem cortar o canvas.
- Badges e emotes nativos permanecem visíveis.
- O código não depende de rede externa além da própria URL do widget.
- YouTube, Twitch e outras plataformas continuam distinguíveis quando o evento fornecer a plataforma.
- A transmissão não é iniciada e nenhuma credencial é alterada.
