---
title: "Homepage Conversion Layer for Instagram Traffic"
date: 2026-09-02
document_type: design-specification
status: review
implementation_status: pending_user_spec_review
scope: application-layer
project: Leo Ferraz
---

# Homepage Conversion Layer for Instagram Traffic

## Decision under review

Transformar a homepage em um primeiro estágio mensurável do funil Instagram → site → conversa, sem lançar infoproduto, checkout ou formulário. O site continuará apresentando portfólio e evidências, mas passará a oferecer uma única próxima ação: descrever um gargalo de presença ou produção de conteúdo pelo WhatsApp.

## Authority and scope

Esta especificação é subordinada a:

- `brand/BRAND_FOUNDATION.md`;
- `brand/BRAND_ARCHITECTURE.md`;
- `brand/LANGUAGE_ARCHITECTURE.md`;
- `brand/VOICE_AND_LANGUAGE.md`;
- `cofre-leoferraz-dev/01_DECISOES/DECISAO-029 - Monetizacao apos Trafego Organico.md`;
- `cofre-leoferraz-dev/01_DECISOES/DECISAO-030 - UTM para Atribuicao do Instagram.md`.

Não altera:

- Master Brand, descriptor ou categoria institucional;
- oferta de infoproduto, preço ou promessa de resultado;
- o portfólio ou as páginas do laboratório;
- o link canônico do domínio;
- a política de privacidade quanto à inexistência de formulário, cadastro e pagamento no site.

O escopo é uma alteração pontual da homepage e da medição do clique no CTA. A troca da URL no perfil do Instagram permanece uma operação manual separada.

## Problem

O tráfego chega ao site, mas o portfólio encerra a jornada sem indicar uma decisão posterior. O GA4 registra visitas, porém não há ação comercial mensurável depois da leitura. O site também não deve converter uma hipótese de interesse em um produto educacional antes de existir evidência de dor, conversa qualificada e disposição de investimento.

## Primary audience and task

O visitante prioritário é fundador, empresário, criador ou especialista que já possui uma oferta e reconhece um gargalo recorrente de presença ou produção de conteúdo.

A tarefa única do visitante é decidir se quer descrever esse gargalo para iniciar uma conversa exploratória sobre um possível piloto.

## Proposed page flow

```text
Instagram/Reel
  ↓ link da bio com UTM (operação manual separada)
Homepage
  ↓ apresentação curta do Léo e do trabalho
Bloco Próximo passo
  ↓ CTA único
WhatsApp com mensagem pré-preenchida
  ↓ conversa e qualificação fora do site
Eventual piloto pago
  ↓ somente após evidência
Produto educacional ou infoproduto
```

## Homepage architecture

A ordem da homepage deverá ser:

```text
Header
↓
Hero editorial existente
↓
Bloco de conversão “Próximo passo”
↓
Trabalho recente / evidências existentes
↓
Produtos próprios em construção
↓
Onde acompanhar
↓
Como eu trabalho
↓
Footer existente
```

O bloco de conversão entra imediatamente depois do hero e antes do portfólio para que o visitante receba uma próxima ação antes de sair da página. O conteúdo existente não será removido.

## Copy approved for implementation

```text
PRÓXIMO PASSO

Você já vende, mas trava na produção de conteúdo?

Estou conversando com fundadores, empresários, criadores e especialistas que já possuem uma oferta e enfrentam um gargalo recorrente de presença ou produção.

Descreva o seu gargalo para avaliarmos se uma conversa ou um piloto faz sentido.

Descrever meu gargalo →
```

O texto não afirma que existe um produto disponível, não promete alcance e não apresenta o piloto como oferta fechada.

## CTA destination

O CTA usa o WhatsApp já existente no footer, com mensagem pré-preenchida:

```text
Olá, Leo. Eu já vendo algo e quero descrever meu gargalo de presença ou produção de conteúdo.
```

O destino técnico será o `wa.me` já utilizado pelo site, com `target="_blank"`, `rel="noopener noreferrer"` e acessibilidade equivalente ao link existente. Não criar formulário, armazenamento de leads ou integração externa.

## Measurement

Adicionar um único evento de clique ao CTA:

```text
event: pilot_interest_click
channel: whatsapp
location: homepage_conversion_block
campaign: leo_digital_s001
```

Os parâmetros não devem conter nome, telefone, texto da conversa ou qualquer dado pessoal. O clique mede intenção inicial; não equivale a conversa qualificada ou pagamento.

O evento deve falhar silenciosamente se o Analytics estiver bloqueado ou indisponível. O link do WhatsApp deve continuar funcionando sem JavaScript, como melhoria progressiva.

## Visual and responsive behavior

- reutilizar tokens, tipografia, bordas e superfícies já existentes;
- usar a mesma gramática editorial da homepage, sem criar uma landing page separada;
- dar ao bloco hierarquia de ação clara, sem segundo CTA concorrente;
- manter contraste e foco visível em teclado;
- empilhar o conteúdo naturalmente no mobile;
- manter o CTA com área de toque adequada;
- não adicionar pop-up, urgência artificial, contagem regressiva ou selo de garantia;
- não usar números de audiência ou prova social não validada no bloco.

## States and boundaries

### Normal

O bloco renderiza copy, CTA e link externo. O clique abre o WhatsApp com a mensagem pré-preenchida e registra o evento quando o GA4 estiver disponível.

### Analytics unavailable

O CTA continua navegável. Nenhuma mensagem de erro deve interromper a jornada.

### WhatsApp unavailable

Não haverá fallback automático nesta primeira versão, para preservar uma única ação e evitar duplicação de canais. O e-mail existente continua disponível no footer como contato institucional secundário.

### Out of scope

- checkout;
- preço;
- infoproduto;
- formulário;
- banco de leads;
- automação de WhatsApp;
- alteração automática do perfil do Instagram;
- criação de nova conta ou propriedade de Analytics.

## Acceptance criteria

- o bloco aparece após o hero e antes das evidências do portfólio;
- existe somente um CTA primário no bloco;
- a copy corresponde exatamente ao texto aprovado nesta especificação;
- o CTA abre o WhatsApp com a mensagem pré-preenchida;
- o clique dispara `pilot_interest_click` com os parâmetros definidos, sem dados pessoais;
- a navegação permanece funcional com JavaScript ou Analytics indisponível;
- a composição funciona em desktop e mobile;
- nenhuma promessa de produto, preço, alcance ou resultado é adicionada;
- a política de privacidade continua coerente com a ausência de formulário, cadastro e pagamento;
- o build existente passa sem regressões.

## Validation plan

1. executar `npm run build`;
2. inspecionar o HTML gerado para confirmar a copy, o destino do WhatsApp e a presença do evento;
3. verificar que nenhuma página existente foi removida ou alterada fora do escopo;
4. validar links e notas do cofre;
5. realizar inspeção visual manual somente se o usuário solicitar QA no navegador;
6. registrar cliques, conversas qualificadas e eventuais pilotos fora do site antes de promover a hipótese a oferta.

## Open decision

Esta especificação aguarda revisão final do fundador antes da criação do plano de implementação. A recomendação continua sendo começar por uma conversa qualificada, não por um infoproduto.
