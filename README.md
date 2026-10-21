# Pokédex - Catálogo Interativo de Pokémons

Trabalho da **AP2** da disciplina de **Desenvolvimento de Aplicação Orientada a Componentes** (ADS - ULBRA Torres), prof. Juliano Ramos Matos.

**Acadêmico:** Ryan Lopes

A aplicação é um catálogo de pokémons feito em React que consome a [PokeAPI](https://pokeapi.co). Dá pra ver os pokémons de cada geração, buscar pelo nome ou número, filtrar por tipo, ordenar pelo poder, marcar favoritos e abrir os detalhes de cada um. Cada card já mostra o poder do pokémon em destaque, os tipos e todos os status base, sem precisar abrir.

## Funcionalidades

- Listagem dos pokémons por geração (1ª até a 9ª)
- Busca por nome ou número (ex: `pikachu`, `25` ou `#025`)
- Filtro por tipo (Fogo, Água, Planta...)
- Ordenação por número, nome (A-Z), mais forte ou mais fraco
- "Poder" de cada pokémon (soma dos 6 status base, ex: Mewtwo = 680, Pikachu = 320)
- Card com o poder em destaque, os tipos e os 6 status (HP, ataque, defesa, atq. especial, def. especial e velocidade) com barrinhas, e a cor do fundo muda conforme o tipo
- Favoritos salvos no navegador (não somem quando recarrega a página)
- Filtro "Só favoritos"
- Modal com os detalhes do pokémon (fecha no X, clicando fora ou com ESC)
- Loading enquanto carrega e mensagem de erro com botão de tentar de novo
- Layout responsivo (celular, tablet e desktop)

## Tecnologias utilizadas

- [React 19](https://react.dev)
- [Vite](https://vite.dev)
- [Tailwind CSS 4](https://tailwindcss.com) (com o plugin `@tailwindcss/vite`)
- JavaScript (ES6+), Fetch API e localStorage

## Como instalar e rodar

Precisa ter o [Node.js](https://nodejs.org) instalado (usei a versão 24).

```bash
# clonar o repositorio
git clone https://github.com/ryanndz/ap2_DAOC.git
cd ap2_DAOC

# instalar as dependencias
npm install

# rodar em modo desenvolvimento
npm run dev
```

Depois é só abrir o endereço que aparecer no terminal (normalmente http://localhost:5173).

Para gerar a versão de produção: `npm run build` (e `npm run preview` para testar o build).

## API utilizada

**PokeAPI** - https://pokeapi.co (é gratuita e não precisa de chave)

| Endpoint | Pra que foi usado |
|---|---|
| `GET https://pokeapi.co/api/v2/pokemon?limit={limite}&offset={offset}` | Lista dos pokémons da geração escolhida |
| `GET https://pokeapi.co/api/v2/type/{tipo}` | Pokémons de um tipo (usado no filtro) |
| `GET https://pokeapi.co/api/v2/pokemon/{id}` | Detalhes de um pokémon (modal) e tipos/status de cada card |

As imagens vêm do repositório de sprites da própria PokeAPI:
`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png`

Como a lista só retorna `name` e `url`, o id é tirado do final da url (função `pegarId` em `services/api.js`).

A lista também não traz os tipos nem os status, então pra mostrar isso no card é preciso buscar os detalhes de cada pokémon da geração (151 requisições na 1ª geração). As requisições são feitas todas juntas com `Promise.all` (demorou uns 0,5s nos testes) e o resultado fica em cache, então voltar pra uma geração já carregada não busca de novo. Enquanto não chega, os cards já aparecem com a imagem e o nome e um "esqueleto" animado no lugar dos status.

## Estrutura do projeto

```
src/
├── components/
│   ├── ItemCard.jsx         # card de cada pokémon com poder e status (recebe props)
│   ├── ItemList.jsx         # grid com a lista, renderiza os ItemCard
│   ├── SearchForm.jsx       # formulário controlado de busca/filtros
│   ├── ItemDetails.jsx      # modal com os detalhes do pokémon selecionado
│   └── LoadingSpinner.jsx   # loading (pokébola girando)
├── hooks/
│   ├── useFetch.js          # custom hook para as requisições HTTP
│   ├── useLocalStorage.js   # custom hook pra salvar os favoritos
│   └── useDetalhes.js       # custom hook que busca poder, tipos e status da geração
├── services/
│   └── api.js               # url base, endpoints e funções da API
├── utils/
│   ├── tipos.js             # nomes dos tipos em português e as cores
│   └── status.js            # nomes dos status e cor/tamanho das barrinhas
├── pages/
│   └── Home.jsx             # página principal (estados e filtros)
├── App.jsx                  # layout (cabeçalho, conteúdo e rodapé)
├── main.jsx
└── index.css                # configuração do Tailwind
```

## Como os requisitos foram feitos

**Componentização e props** - Cada parte da tela é um componente separado. O `Home` guarda os estados e passa tudo por props: o `ItemList` recebe a lista e repassa cada pokémon pro `ItemCard`. Os componentes filhos avisam o pai por callbacks (`onSelecionar`, `onFavoritar`, `onChange`, `onLimpar`, `onFechar`).

**useState** - No `Home`: `filtros` (busca, geração, tipo, ordem e só favoritos), `selecionado` (id do pokémon aberto no modal) e os `favoritos`. Dentro do `useFetch`: `dados`, `carregando` e `erro`.

**useEffect e consumo da API** - As requisições ficam no `useEffect` dentro do `useFetch`, com `[url, tentativa]` no array de dependências. Então só busca de novo quando a url muda (por exemplo quando troca a geração ou o tipo) ou quando clica em "tentar de novo". Também usei `AbortController` pra cancelar a requisição anterior se o usuário trocar o filtro antes de terminar. No `ItemDetails` tem outro `useEffect` que adiciona o evento da tecla ESC e remove no cleanup.

**Custom hooks**
- `useFetch(url)` - retorna `{ dados, carregando, erro, recarregar }`. Ele é reutilizado em 3 lugares: lista da geração, filtro por tipo e detalhes do pokémon. Se a url for `null` ele não faz a requisição (usado quando não tem tipo selecionado).
- `useLocalStorage(chave, valorInicial)` - funciona igual o `useState` mas salva no localStorage. Usado nos favoritos.
- `useDetalhes(geracao)` - busca os detalhes de todos os pokémons da geração e retorna `{ porId, carregando, erro, recarregar }`, onde `porId` é um objeto `{ id: { poder, tipos, status } }`. Tem `[geracao, tentativa]` no array de dependências, então busca de novo quando troca a geração (ou usa o cache se já buscou).

**Formulário controlado** - O `SearchForm` tem um input de texto, três selects e um checkbox. Todos têm `value`/`checked` vindo do estado e atualizam pelo `onChange`. Um único `handleChange` usa o `name` do campo pra saber qual filtro alterar.

**Tailwind CSS** - Tudo foi estilizado com classes utilitárias. A responsividade usa os breakpoints `sm`, `lg` e `xl` (o grid vai de 1 coluna no celular até 4 no desktop, e o formulário empilha no celular). Também usei `hover`, `focus`, `group-hover`, transições, `animate-spin`, `animate-pulse` (esqueleto), gradiente (no fundo do card e no texto do poder com `bg-clip-text`), `drop-shadow`, `backdrop-blur` e uma cor própria criada com `@theme` no `index.css` (`bg-pokedex`).
