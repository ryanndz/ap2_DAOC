import { useState, useCallback } from 'react'
import useFetch from '../hooks/useFetch'
import useLocalStorage from '../hooks/useLocalStorage'
import useDetalhes from '../hooks/useDetalhes'
import { urlListaPokemons, urlTipo, formatarLista, pegarId } from '../services/api'
import SearchForm from '../components/SearchForm'
import ItemList from '../components/ItemList'
import ItemDetails from '../components/ItemDetails'
import LoadingSpinner from '../components/LoadingSpinner'

const filtrosIniciais = {
  busca: '',
  geracao: '1',
  tipo: '',
  ordem: 'numero',
  soFavoritos: false,
}

function Home() {
  const [filtros, setFiltros] = useState(filtrosIniciais)
  const [selecionado, setSelecionado] = useState(null) // id do pokemon aberto no modal
  const [favoritos, setFavoritos] = useLocalStorage('pokedex-favoritos', [])

  // toda vez que muda a geracao a url muda e o useFetch busca de novo
  const lista = useFetch(urlListaPokemons(filtros.geracao))
  // o filtro de tipo usa outro endpoint, so busca se tiver um tipo escolhido
  const tipo = useFetch(filtros.tipo ? urlTipo(filtros.tipo) : null)
  // poder, tipos e status de cada pokemon da geração (pra mostrar no card)
  const detalhes = useDetalhes(filtros.geracao)
  const ordenarPorPoder = filtros.ordem === 'mais-forte' || filtros.ordem === 'mais-fraco'

  function alterarFiltro(campo, valor) {
    setFiltros((anterior) => ({ ...anterior, [campo]: valor }))
  }

  function limparFiltros() {
    setFiltros(filtrosIniciais)
  }

  function alternarFavorito(id) {
    if (favoritos.includes(id)) {
      setFavoritos(favoritos.filter((fav) => fav !== id))
    } else {
      setFavoritos([...favoritos, id])
    }
  }

  // useCallback pra funcao nao mudar a cada render (ela vai no array de dependencias do ItemDetails)
  const fecharDetalhes = useCallback(() => setSelecionado(null), [])

  function tentarDeNovo() {
    lista.recarregar()
    if (filtros.tipo) tipo.recarregar()
    detalhes.recarregar()
  }

  // ---- filtros ----
  let pokemons = lista.dados ? formatarLista(lista.dados.results) : []
  // junta poder, tipos e status em cada um (fica undefined enquanto nao carrega)
  pokemons = pokemons.map((p) => ({ ...p, ...detalhes.porId[p.id] }))

  if (filtros.tipo && tipo.dados) {
    const idsDoTipo = tipo.dados.pokemon.map((p) => pegarId(p.pokemon.url))
    pokemons = pokemons.filter((p) => idsDoTipo.includes(p.id))
  }

  const termo = filtros.busca.trim().toLowerCase()
  if (termo) {
    pokemons = pokemons.filter(
      (p) => p.nome.includes(termo) || p.id === Number(termo.replace('#', ''))
    )
  }

  if (filtros.soFavoritos) {
    pokemons = pokemons.filter((p) => favoritos.includes(p.id))
  }

  // ---- ordenação ----
  // (se for 'numero' nao precisa fazer nada, a api ja manda em ordem)
  if (filtros.ordem === 'nome') {
    pokemons.sort((a, b) => a.nome.localeCompare(b.nome))
  } else if (filtros.ordem === 'mais-forte') {
    pokemons.sort((a, b) => (b.poder || 0) - (a.poder || 0))
  } else if (filtros.ordem === 'mais-fraco') {
    pokemons.sort((a, b) => (a.poder || 0) - (b.poder || 0))
  }

  // se for ordenar por poder tem que esperar os detalhes, senão a ordem fica errada
  // (nos outros casos os cards ja aparecem e os status vão preenchendo)
  const carregandoPoder = ordenarPorPoder && detalhes.carregando
  const carregando = lista.carregando || tipo.carregando || carregandoPoder
  const erro = lista.erro || tipo.erro || detalhes.erro

  return (
    <>
      <SearchForm filtros={filtros} onChange={alterarFiltro} onLimpar={limparFiltros} />

      <div className="my-4 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
        <span>
          {carregando ? 'Carregando...' : `${pokemons.length} pokémon(s) encontrado(s)`}
        </span>
        <span className="rounded-full bg-yellow-100 px-3 py-1 font-medium text-yellow-800">
          ★ {favoritos.length} favorito(s)
        </span>
      </div>

      {erro ? (
        <div className="rounded-2xl bg-red-50 py-12 text-center ring-1 ring-red-200">
          <p className="font-medium text-red-600">Ops, não foi possível carregar os pokémons.</p>
          <p className="text-sm text-red-400">{erro}</p>
          <button
            onClick={tentarDeNovo}
            className="mt-4 cursor-pointer rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
          >
            Tentar de novo
          </button>
        </div>
      ) : carregando ? (
        <LoadingSpinner texto={carregandoPoder ? 'Calculando o poder dos pokémons...' : 'Buscando pokémons...'} />
      ) : (
        <ItemList
          pokemons={pokemons}
          favoritos={favoritos}
          onSelecionar={setSelecionado}
          onFavoritar={alternarFavorito}
        />
      )}

      {selecionado && (
        <ItemDetails
          id={selecionado}
          favorito={favoritos.includes(selecionado)}
          onFavoritar={alternarFavorito}
          onFechar={fecharDetalhes}
        />
      )}
    </>
  )
}

export default Home
