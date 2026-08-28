---
title: "Léo Digital — Geração de Cena e Movimento Originais"
document_type: generation_architecture_design
status: approved
implementation_status: implemented
external_test_status: pending
authority: Leo Ferraz
date: 2026-08-28
project: Leo Ferraz
approval_basis: user_approved_in_conversation
---

# Léo Digital — Geração de Cena e Movimento Originais

## 1. Objetivo

Corrigir o fluxo de geração externa que devolveu um vídeo praticamente igual ao vídeo 08 quando o objetivo era criar uma cena e um movimento diferentes, mantendo a aparência do Léo Ferraz.

O resultado esperado é um Reel silencioso, vertical e curto, com identidade facial consistente, mas com composição, cenário, trajetória de câmera e ação visual originais. O vídeo deve servir de base para a montagem posterior das duas headlines e da legenda; a ferramenta externa não deve gerar a copy.

## 2. Diagnóstico determinístico

### Evidência direta das screenshots

- A operação foi aberta no fluxo `Face Swap Video Variations`.
- O pedido instruiu a plataforma a usar o vídeo-base como referência de duração, movimento de câmera, enquadramento e ação.
- O mesmo pedido determinou a preservação do cenário, iluminação, mesa, teclado, monitores, ritmo, progressão de trabalho e fechamento do vídeo-base.
- O prompt adicional da peça 01 também começou com `Preserve a progressão de trabalho no laptop, as aproximações e o fechamento com gesto de aprovação`.
- Na primeira captura, há evidência visual de um thumbnail de vídeo anexado. A captura não permite confirmar que o conjunto de fotos estava vinculado como entrada de identidade daquela operação; mencionar fotos no texto não substitui anexá-las e selecioná-las no campo correto da plataforma.
- Na segunda captura, o preview devolvido mantém a mesma cena-base de trabalho no laptop, com composição e movimento visualmente correspondentes ao vídeo de referência.

### Causa-raiz

O fluxo e o prompt deram prioridade operacional ao vídeo-base para quase todas as dimensões que precisavam mudar. A instrução `substitua somente a identidade visual` restringiu a transformação à aparência da pessoa, enquanto `preserve` foi aplicado à cena, à ação, à câmera, ao ritmo e ao fechamento. O comportamento observado — cópia do vídeo 08 — é, portanto, coerente com o pedido enviado, e não uma falha que possa ser corrigida apenas acrescentando uma frase ao mesmo prompt.

## 3. Decisão de arquitetura

Para criar cenas e movimentos diferentes, a geração deve separar as funções das entradas:

| Entrada | Função | Regra |
|---|---|---|
| Fotos reais autorizadas do Léo | identidade visual | preservam rosto, olhos, cabelo, barba, rugas, proporções e aparência geral |
| Prompt de cena | direção visual | define cenário, enquadramento, câmera, ação, expressão e ritmo novos |
| Vídeo-base 08 | referência histórica | não anexar como fonte primária nesta modalidade |
| Copy final | comunicação | aplicar depois, na montagem, fora da geração visual |

O modo preferencial é `image-to-video` ou `text-to-video` com imagens de referência de identidade. A escolha exata do nome depende da plataforma externa. O requisito é funcional: a ferramenta precisa permitir que a identidade venha das fotos sem obrigar a copiar a cena e o movimento de um vídeo-base.

Se a plataforma disponível oferecer apenas `Face Swap Video Variations`, ela não atende a este objetivo específico. Nesse caso, não usar o vídeo 08 com um prompt contraditório; selecionar outro modo ou outra plataforma que aceite geração de cena original.

## 4. Fluxo operacional aprovado

1. Selecionar fotos reais autorizadas, com ângulos frontal, 3/4 e perfil quando disponíveis.
2. Anexar as fotos no campo de referência de identidade da plataforma externa.
3. Não anexar o vídeo 08 como vídeo-base para o teste de cena original.
4. Informar no prompt a cena, o enquadramento, a trajetória de câmera, a ação, a expressão e a duração pretendida.
5. Repetir as restrições de silêncio, ausência de texto e ausência de elementos de interface.
6. Gerar uma versão por peça e registrar modelo, modo, custo, data, versão e observações.
7. Verificar primeiro a identidade e a cena/movimento; só depois montar as duas headlines.
8. Rejeitar qualquer resultado que apenas replique a cena de referência, mesmo que a semelhança facial seja excelente.

## 5. Contrato do prompt externo

Todo prompt de uma peça deverá conter, nesta ordem:

1. **Identidade:** usar somente as fotos autorizadas como referência da aparência do Léo Ferraz.
2. **Cena nova:** declarar explicitamente que não deve copiar nenhum vídeo-base e descrever o ambiente desejado.
3. **Enquadramento e câmera:** declarar plano, posição do personagem, direção do olhar e movimento de câmera.
4. **Ação:** descrever uma sequência curta de ações novas, sem fala e sem lip-sync.
5. **Estética:** manter realismo, iluminação de laboratório de produto e continuidade facial, sem transformar a cena em publicidade de resultado.
6. **Restrições:** sem texto, legendas, logo, avatar, interface, pessoas novas, objetos não solicitados, marca d'água ou áudio necessário.
7. **Saída:** vertical 9:16, curta, natural e adequada para receber texto na montagem posterior.

O prompt não deve conter instruções como `preserve a progressão`, `mantenha o mesmo cenário`, `use o vídeo-base como referência de movimento`, `repita os planos`, `mantenha o fechamento` ou equivalentes, salvo quando a peça tiver sido deliberadamente classificada como variação da cena original.

## 6. Exemplo operacional da peça 01

O texto abaixo é uma especificação de direção para o novo `PROMPT-002`; não é ainda o arquivo final de produção.

```text
Use somente as fotos reais autorizadas do Léo Ferraz como referência de identidade. Gere uma cena original; não copie nenhum vídeo-base, enquadramento, trajetória de câmera, cenário ou sequência de ação de um vídeo de referência.

Crie um Reel vertical 9:16, realista e silencioso, em um ambiente escuro de laboratório de produto digital. O Léo está sentado diante de uma bancada limpa, em plano médio 3/4, com luz azul de precisão vindo lateralmente e fundo discreto, sem telas legíveis. A câmera faz um movimento lento de aproximação. Ele começa olhando para uma folha com anotações, fecha o caderno, levanta os olhos para a câmera por um instante com expressão concentrada e segura, faz um pequeno aceno de compreensão e volta o olhar para a bancada. O movimento deve ser humano, contido e contínuo, sem fala, sem movimento de boca e sem lip-sync.

Preserve a identidade facial das fotos: formato do rosto, olhos, cor dos olhos, cabelo, barba, rugas e proporções. Não adicione texto, legendas, logo, avatar, elementos de interface, pessoas novas, marca d'água, promessa de resultado, dinheiro, cliente, depoimento ou objeto não solicitado. Não use o vídeo 08 como referência. Entregue apenas o vídeo, sem copy, em formato vertical 9:16, com composição limpa para receber duas headlines na edição posterior.
```

## 7. Critérios de aceitação

O resultado só passa para a montagem se cumprir todos os critérios abaixo:

- identidade facial reconhecível e consistente durante todo o vídeo;
- cena diferente do vídeo 08 em pelo menos cenário, enquadramento e ação;
- trajetória de câmera própria, sem reprodução dos mesmos planos ou aproximações;
- ação compreensível sem áudio e sem fala;
- composição limpa para receber a headline principal e a headline de encaminhamento;
- nenhum texto, logo, avatar, interface ou marca d'água gerado pela plataforma;
- nenhum objeto, pessoa, cliente, produto, dinheiro ou resultado inventado;
- duração curta compatível com o formato aprovado, inicialmente entre 6 e 10 segundos;
- arquivo devolvido com peça, versão, modo, modelo, custo e observações registrados.

O critério principal desta revisão é a mudança efetiva de cena e movimento. Uma cópia visualmente fiel do vídeo 08 deve ser marcada como `rejeitado — cópia da cena/movimento`, ainda que o rosto esteja correto.

## 8. Relação com os artefatos existentes

- `PROMPT-001 - Léo Digital Série 001` permanece preservado como registro do fluxo anterior de face swap/video variation. Ele é adequado quando a intenção for manter deliberadamente a cena original e trocar ou estabilizar a identidade.
- Um novo `PROMPT-002` deverá conter prompts para geração de cena original e não deverá sobrescrever o `PROMPT-001`.
- A copy de duas headlines continua separada da geração visual, conforme `COPY-001 - Léo Digital Série 001`.
- O vídeo continuará sendo gerado fora deste repositório; localmente serão preparados copy, prompts, instruções e QA dos arquivos eventualmente devolvidos.

## 9. Limitações e riscos

- A qualidade facial alcançada com o Léo não prova replicabilidade para qualquer pessoa.
- A consistência pode variar conforme quantidade, qualidade e diversidade das fotos, custo e modelo da plataforma.
- A criação de cena original pode reduzir a fidelidade facial em comparação com um face swap de cena fixa; isso será medido no QA.
- O custo de uma geração não garante que o resultado seja utilizável.
- A identificação ou redução de distribuição de conteúdo gerado ou alterado por IA continua sendo risco de publicação; esta arquitetura não promete alcance.
- Se o modo externo não separar referência de identidade e referência de movimento, a limitação deve ser registrada, não mascarada com um prompt mais longo.

## 10. Fora de escopo

- gerar o vídeo nesta etapa;
- contratar API, ElevenLabs ou qualquer serviço externo;
- construir áudio, voz ou lip-sync;
- alterar a identidade canônica da marca;
- publicar o Reel sem QA;
- afirmar que a nova modalidade já foi validada antes de um arquivo externo ser recebido e inspecionado.

## 11. Próximo passo

Após a revisão escrita desta especificação, criar o plano de implementação e o `PROMPT-002`, contendo a matriz de cenas originais para as dez peças. A primeira geração de teste deve ser a peça 01, com uma única variação controlada, para verificar se a arquitetura realmente rompe a cópia do vídeo 08.
