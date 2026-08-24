# Jogos em desenvolvimento no site — Design

**Status:** approved
**Data:** 2026-08-24
**Escopo:** homepage e `/laboratorio/` do site `leoferraz.dev`

## Objetivo

Exibir `Sproutbound — Salto ao Sol` como produto próprio em desenvolvimento na página inicial e no laboratório, sem apresentá-lo como lançado, validado ou publicamente jogável.

## Estado factual

- O jogo está em desenvolvimento.
- O jogo está em revisão de distribuição.
- Não existe, nesta etapa, uma URL pública oficial aprovada para jogar.
- O card não terá link nem botão.
- Após aprovação de uma plataforma, o card poderá receber a URL oficial e o botão `Jogar na Plataforma`.

## Arquitetura

Os dados dos jogos próprios em desenvolvimento serão centralizados em `src/data/games-in-development.ts`. O registro do Sproutbound terá nome, status, descrição, imagem e um campo de destino opcional, inicialmente ausente.

Um componente `src/components/site/GameCard.astro` será responsável pela apresentação visual do registro. O componente não deverá transformar o card em link quando o destino estiver ausente. A mesma fonte de dados e o mesmo componente serão usados em `src/pages/index.astro` e `src/pages/laboratorio/index.astro`, evitando divergência entre as páginas.

A imagem aprovada de capa será copiada do repositório do jogo para um caminho versionado em `public/` do site. A arte continuará representando a identidade própria do Sproutbound; o site apenas a enquadrará na estrutura visual da Master Brand.

## Conteúdo e posicionamento

### Homepage

A seção será inserida entre `Sistemas em operação` e `Onde acompanhar`:

- eyebrow: `JOGOS EM DESENVOLVIMENTO`;
- título: `Produtos próprios em construção.`;
- item: `Sproutbound — Salto ao Sol`;
- status: `Em desenvolvimento · Em revisão de distribuição`;
- descrição factual curta sobre Pip, folhas, gotas de sol e espinhos;
- sem link e sem CTA de jogo.

### Laboratório

A seção será inserida antes de `Trabalho com clientes`, com o mesmo card e conteúdo. A separação visual e textual deixará claro que se trata de produto próprio, não de trabalho realizado para clientes.

## Evolução futura

O modelo de dados comportará um destino opcional. Enquanto esse campo estiver vazio, o card permanecerá informativo. Quando houver uma URL oficial aprovada, a alteração deverá:

1. adicionar o destino ao registro do jogo;
2. renderizar o botão `Jogar na Plataforma` apenas quando o destino existir;
3. preservar o status factual atualizado;
4. validar a URL pública separadamente da validação local e do build.

Nenhuma plataforma, URL, status de aprovação, número de usuários ou resultado econômico será inventado nesta implementação.

## Acessibilidade e responsividade

- A imagem terá texto alternativo descritivo.
- O status será texto visível, não dependerá apenas de cor.
- O card funcionará sem interação quando não houver destino.
- A composição deverá respeitar o comportamento responsivo já usado pelo site e não criar overflow horizontal em viewport estreita.

## Validação

Será executado o build existente do site. A validação deverá confirmar:

- homepage gerada com a nova seção;
- `/laboratorio/` gerada com a nova seção;
- texto do status presente nas duas rotas;
- nenhuma URL ou CTA de jogo renderizado enquanto o destino estiver ausente;
- imagem copiada e referenciada por caminho público válido;
- working tree preservada, com apenas os arquivos intencionais incluídos no commit da implementação.

## Pendências

- URL oficial da plataforma de distribuição: aguardando aprovação pública.
- Definição do texto e destino do CTA futuro: somente quando a URL existir.
