# Cashback do Casamento

Aplicacao web feita em `Vue 3 + TypeScript + Vite` para funcionar como uma lista de presentes de casamento com pagamento via Pix e geracao de cartoes personalizados.

O projeto foi pensado para duas etapas:

1. A pessoa escolhe um ou mais presentes simbolicos.
2. A pessoa vai para a tela de cartao, personaliza a mensagem, copia o Pix e baixa um cartao em PNG.

## Visao geral

Nao existe backend neste projeto.

Tudo acontece no navegador:

- a lista de presentes vem de um arquivo local;
- o carrinho fica salvo no `localStorage`;
- o codigo Pix e montado no front-end;
- o QR Code e gerado no front-end;
- o cartao e renderizado na tela e exportado como imagem no navegador.

## Tecnologias usadas

- `Vue 3`
- `TypeScript`
- `Vite`
- `vue-router`
- `pix-payload`
- `qrcode`
- `html2canvas`

## Como rodar o projeto

### Requisitos

- `Node.js` 18 ou superior
- `npm`

### Instalacao

```bash
npm install
```

### Ambiente de desenvolvimento

```bash
npm run dev
```

O Vite vai abrir o projeto localmente, normalmente em algo como `http://localhost:5173`.

### Build de producao

```bash
npm run build
```

Os arquivos finais sao gerados na pasta `dist/`.

### Visualizar build localmente

```bash
npm run preview
```

### Deploy

```bash
npm run deploy
```

Esse comando publica a pasta `dist/` com `gh-pages`.

O processo de build tambem cria `dist/404.html` a partir de `dist/index.html`. Isso e importante porque o projeto usa `vue-router` com `createWebHistory`, e o GitHub Pages nao sabe resolver rotas como `/cartao` sozinho em um refresh direto. Com o `404.html`, o Pages devolve a aplicacao e a rota volta a funcionar.

## Como fazer o deploy funcionar no GitHub Pages

Para o deploy funcionar de ponta a ponta, confira estes pontos:

### 1. Confirmar o nome do repositorio

Em `vite.config.ts`, o projeto esta configurado com:

```ts
base: '/casamento-jacqueline-marcello/'
```

Esse valor precisa bater exatamente com o nome do repositorio publicado no GitHub.

Exemplo:

- repositorio: `https://github.com/usuario/casamento-jacqueline-marcello`
- `base`: `/casamento-jacqueline-marcello/`

Se o repositorio tiver outro nome, altere o `base`.

Se for publicar na raiz de um dominio proprio, o mais comum e usar:

```ts
base: '/'
```

### 2. Gerar a build

```bash
npm run build
```

Depois desse comando, a pasta `dist/` precisa conter pelo menos:

- `index.html`
- `404.html`
- `assets/...`

O `404.html` e o fallback necessario para o refresh das rotas.

### 3. Publicar no branch do GitHub Pages

```bash
npm run deploy
```

Esse script envia a pasta `dist/` para o branch `gh-pages`.

### 4. Configurar o GitHub Pages no repositorio

No GitHub:

1. Abra `Settings`.
2. Entre em `Pages`.
3. Em `Build and deployment`, selecione `Deploy from a branch`.
4. Escolha o branch `gh-pages`.
5. Escolha a pasta `/ (root)`.
6. Salve.

### 5. Abrir a URL final

Depois da publicacao, a URL normalmente fica neste formato:

```txt
https://SEU-USUARIO.github.io/casamento-jacqueline-marcello/
```

### 6. Problemas comuns de deploy

- Tela branca logo ao abrir: normalmente o `base` esta errado.
- `404` ao atualizar `/cartao`: acontece quando o `404.html` nao foi publicado.
- Imagens ou CSS quebrados: quase sempre e o `base` apontando para o caminho errado.
- Deploy aparentemente certo, mas site antigo no ar: aguarde alguns minutos e faca um hard refresh no navegador.

## Como o projeto funciona

### 1. Tela inicial: lista de presentes

Rota: `/`

Essa tela mostra os presentes disponiveis em formato de cards.

Cada presente possui:

- `id`
- `name`
- `description`
- `price`
- `imageUrl`
- `dynamicMessage`

Quando a pessoa clica para presentear:

- o presente e adicionado ao carrinho;
- se o mesmo presente for escolhido de novo, a quantidade aumenta;
- um aviso visual aparece confirmando a adicao.

Os presentes sao definidos manualmente em `src/data/gifts.ts`.

## 2. Carrinho

O carrinho nao fica em banco de dados. Ele e salvo no navegador usando `localStorage`.

Chave usada:

```txt
cashback-casamento-cart
```

Com isso:

- ao recarregar a pagina, os itens continuam salvos;
- a quantidade total aparece no cabecalho;
- a tela de cartao usa os itens do carrinho para montar o resumo e o valor do Pix.

Regra importante:

- `addGift` soma quantidade se o item ja existir;
- `removeGift` remove completamente o item do carrinho.

Na tela `/cartao`, o botao `-` foi implementado de um jeito especifico:

- se a quantidade for `1`, o item some;
- se a quantidade for maior que `1`, o item e removido e adicionado de novo, voltando com quantidade `1`.

Ou seja: hoje o botao de diminuir nao reduz de `3` para `2`; ele reinicia o item para uma unidade.

## 3. Tela de criacao de cartao

Rota: `/cartao`

Essa tela tem tres blocos principais:

- preview do cartao;
- formulario de personalizacao;
- resumo do presente + pagamento Pix.

### Preview do cartao

O preview mostra:

- mensagens dinamicas baseadas nos presentes escolhidos;
- nome de quem esta presenteando;
- mensagem personalizada;
- estilo visual do cartao.

Se nenhum presente tiver sido escolhido, o preview informa isso.

### Personalizacao

A pessoa pode ajustar:

- nome;
- mensagem;
- formato do cartao;
- modo de fundo: cor solida ou imagem;
- cor de fundo;
- cor do texto;
- fonte;
- negrito;
- italico.

Quando o fundo escolhido e uma imagem:

- as imagens disponiveis sao as dos presentes que estao no carrinho;
- tambem podem aparecer imagens secretas desbloqueadas por frases na mensagem.

### Download do cartao

Ao clicar em baixar:

- o projeto valida se o nome foi preenchido;
- o preview e capturado com `html2canvas`;
- um arquivo `.png` e baixado automaticamente.

Nome do arquivo gerado:

```txt
cartao-{nome-do-convidado}.png
```

## 4. Pagamento Pix

O Pix e gerado automaticamente sempre que o carrinho muda.

O valor enviado para o Pix e a soma total dos presentes escolhidos.

Fluxo:

1. O carrinho calcula o total.
2. A tela `/cartao` chama `generatePixPayload`.
3. O payload Pix e criado com a biblioteca `pix-payload`.
4. O QR Code e gerado com a biblioteca `qrcode`.
5. A pessoa pode copiar o codigo Pix ou escanear o QR Code.

Os dados fixos do recebedor ficam em `src/config/pix.ts`:

- `key`
- `name`
- `city`

Se outra pessoa baixar esse projeto para usar em outro evento, esse e um dos primeiros arquivos que precisa alterar.

## 5. Easter eggs e fundos secretos

O projeto tem um sistema de imagens secretas liberadas por frases digitadas no campo de mensagem.

Como funciona:

- a mensagem e normalizada;
- acentos e pontuacao sao removidos;
- o texto vira varias combinacoes de palavras;
- cada combinacao e comparada por hash com uma lista interna;
- quando ha correspondencia, uma ou mais imagens secretas sao liberadas.

Essas imagens ficam em `public/images/memes/`.

O comportamento principal esta em `src/composables/useEasterEgg.ts`.

As pistas documentadas para desenvolvedores estao em `MEME_TRIGGERS.md`.

Exemplo citado na interface:

```txt
qui ama
```

Ao desbloquear uma imagem secreta:

- o modo de fundo muda para imagem;
- a imagem secreta mais recente passa a ser selecionada automaticamente;
- um aviso visual aparece no formulario.

## Estrutura principal de pastas

```txt
src/
  components/
    card/        -> formulario, preview e carrossel do cartao
    gift/        -> card de presente
    layout/      -> header e footer
    ui/          -> componentes base reutilizaveis
  composables/   -> logicas reutilizaveis, incluindo easter egg
  config/        -> configuracoes fixas, como Pix
  data/          -> lista estatica de presentes
  pages/         -> paginas principais das rotas
  router/        -> definicao das rotas
  stores/        -> estado compartilhado do carrinho
  styles/        -> tokens e estilos globais
  types/         -> tipagens TypeScript
  utils/         -> utilitarios, como geracao do payload Pix

public/
  images/memes/  -> imagens secretas desbloqueaveis
```

## Arquivos mais importantes

- `src/data/gifts.ts`: cadastra os presentes exibidos na lista
- `src/stores/giftCart.ts`: controla carrinho, totais e persistencia
- `src/pages/GiftsPage.vue`: tela da lista de presentes
- `src/pages/CardPage.vue`: tela de personalizacao, Pix e download
- `src/components/card/CardForm.vue`: formulario do cartao
- `src/components/card/CardPreview.vue`: preview do cartao
- `src/composables/useEasterEgg.ts`: desbloqueio de fundos secretos
- `src/config/pix.ts`: dados do Pix
- `src/utils/pix.ts`: montagem do payload Pix

## Personalizacoes mais comuns

### Alterar os dados do Pix

Edite `src/config/pix.ts`.

### Alterar os presentes

Edite `src/data/gifts.ts`.

Cada item precisa seguir a estrutura:

```ts
{
  id: 'identificador-unico',
  name: 'Nome do presente',
  description: 'Descricao exibida no card',
  price: 100,
  imageUrl: 'https://...',
  dynamicMessage: 'Mensagem usada no preview do cartao',
}
```

### Alterar o nome do casal

Hoje o nome `Jacqueline e Marcello` esta fixo em:

- `src/components/layout/Header.vue`
- `src/components/layout/Footer.vue`

### Alterar ou adicionar memes secretos

Arquivos envolvidos:

- `public/images/memes/`
- `src/composables/useEasterEgg.ts`
- `MEME_TRIGGERS.md`

Observacao importante: o sistema nao compara frases em texto puro dentro do codigo. Ele compara hashes. Entao, para adicionar novas frases, nao basta escrever o texto diretamente no array atual sem ajustar a mesma logica usada para gerar os hashes.

## Como adicionar um meme novo

Hoje o sistema de memes funciona assim:

1. A imagem precisa existir em `public/images/memes/`.
2. O arquivo `src/composables/useEasterEgg.ts` precisa conhecer essa imagem.
3. Cada frase gatilho precisa ser convertida para hash `SHA-256`.
4. O hash e salvo dentro do array `defs`.
5. Opcionalmente, voce documenta as frases em `MEME_TRIGGERS.md`.

### Passo 1. Adicionar a imagem

Coloque a imagem em `public/images/memes/`.

Exemplo:

```txt
public/images/memes/17.jpg
```

### Passo 2. Escolher as frases gatilho

Exemplo de frases:

- `meu deus`
- `meu deuso`
- `que loucura`

O projeto normaliza a mensagem antes de comparar. Isso significa que:

- tudo vira minusculo;
- acentos sao removidos;
- pontuacao e removida;
- espacos duplicados sao ajustados.

Entao frases como `Meu Deus!` e `meu deus` acabam virando a mesma coisa internamente.

### Passo 3. Gerar os hashes das frases

Voce precisa gerar o hash da frase ja normalizada.

Um jeito simples e rodar este comando na raiz do projeto:

```bash
node -e "const crypto=require('node:crypto'); const normalize=(text)=>text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\w\s]/g,'').replace(/\s+/g,' ').trim(); ['meu deus','meu deuso','que loucura'].forEach((text)=>{ const normalized=normalize(text); const hash=crypto.createHash('sha256').update(normalized).digest('hex'); const words=normalized.split(' ').filter(Boolean).length; console.log({ text, normalized, words, hash }); });"
```

Esse comando mostra:

- a frase original;
- a frase normalizada;
- a quantidade de palavras;
- o hash final.

Guarde dois valores de cada frase:

- `words`: quantidade de palavras da frase normalizada;
- `hash`: valor `sha256`.

### Passo 4. Cadastrar o meme em `useEasterEgg.ts`

Adicione um novo bloco dentro de `defs` em `src/composables/useEasterEgg.ts`.

Exemplo:

```ts
{
  i: getAsset('images/memes/17.jpg'),
  k: [
    {
      w: 2,
      h: 'HASH_DA_FRASE_MEU_DEUS',
    },
    {
      w: 2,
      h: 'HASH_DA_FRASE_MEU_DEUSO',
    },
    {
      w: 2,
      h: 'HASH_DA_FRASE_QUE_LOUCURA',
    },
  ],
}
```

Sobre os campos:

- `i`: caminho da imagem;
- `k`: lista de gatilhos;
- `w`: quantidade de palavras da frase;
- `h`: hash da frase normalizada.

### Passo 5. Documentar o gatilho

Atualize `MEME_TRIGGERS.md` para manter uma referencia humana do que foi cadastrado.

Exemplo:

```md
## 17.jpg

- `meu deus`
- `meu deuso`
- `que loucura`
```

### Passo 6. Testar localmente

1. Rode `npm run dev`.
2. Adicione qualquer presente.
3. Entre em `/cartao`.
4. No campo de mensagem, digite uma das frases gatilho.
5. Mude o fundo para `Foto de fundo`, se necessario.
6. Verifique se a imagem secreta aparece no carrossel ou e selecionada automaticamente.

### Erros comuns ao adicionar meme

- A imagem foi colocada fora de `public/images/memes/`.
- O caminho em `getAsset('images/memes/...')` nao bate com o nome do arquivo.
- O hash foi gerado sem aplicar a mesma normalizacao do projeto.
- O `w` foi salvo com quantidade de palavras errada.
- A frase foi documentada no `MEME_TRIGGERS.md`, mas nao foi adicionada em `defs`.

## Comportamentos importantes para quem for manter

- O projeto nao usa API nem banco de dados.
- O projeto depende de `localStorage`, entao o carrinho e local de cada navegador.
- O valor do Pix depende somente dos itens escolhidos no navegador atual.
- As imagens dos presentes usam URLs externas.
- O fallback de rota redireciona qualquer caminho desconhecido para `/`.
- O layout tem navegacao diferente para desktop e mobile.

## Limitacoes atuais

- Nao existe painel administrativo para editar presentes.
- Nao existe confirmacao real de pagamento.
- Nao existe envio automatico do cartao para outra pessoa.
- O carrinho nao sincroniza entre dispositivos.
- O decremento de quantidade nao e tradicional; ele reseta o item para uma unidade.
- Os dados do Pix estao hardcoded no front-end.

## Resumo rapido do fluxo do usuario

1. Entrar na pagina inicial.
2. Escolher um ou mais presentes.
3. Ir para a pagina `/cartao`.
4. Conferir o resumo e o valor total.
5. Copiar o codigo Pix ou pagar pelo QR Code.
6. Personalizar o cartao.
7. Baixar o cartao em PNG.

## Melhorias futuras sugeridas

- mover dados do Pix para variaveis de ambiente;
- criar uma forma correta de diminuir quantidade no carrinho;
- adicionar painel para editar presentes;
- persistir configuracoes em backend;
- registrar pagamentos ou comprovantes;
- permitir compartilhar o cartao direto por link ou WhatsApp.
