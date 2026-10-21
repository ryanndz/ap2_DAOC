// Configuração da API - PokeAPI (não precisa de chave)
// docs: https://pokeapi.co/docs/v2

const BASE_URL = 'https://pokeapi.co/api/v2'

// cada geracao começa num offset diferente na lista da api
export const geracoes = {
  1: { offset: 0, limite: 151 },
  2: { offset: 151, limite: 100 },
  3: { offset: 251, limite: 135 },
  4: { offset: 386, limite: 107 },
  5: { offset: 493, limite: 156 },
  6: { offset: 649, limite: 72 },
  7: { offset: 721, limite: 88 },
  8: { offset: 809, limite: 96 },
  9: { offset: 905, limite: 120 },
}

export function urlListaPokemons(geracao) {
  const { offset, limite } = geracoes[geracao]
  return `${BASE_URL}/pokemon?limit=${limite}&offset=${offset}`
}

export const urlTipo = (tipo) => `${BASE_URL}/type/${tipo}`

export const urlPokemon = (id) => `${BASE_URL}/pokemon/${id}`

// faz o fetch e já devolve o json (usado no useFetch e no usePoder)
export async function buscarJson(url, signal) {
  const resposta = await fetch(url, { signal })
  if (!resposta.ok) {
    throw new Error('Erro ' + resposta.status + ' ao buscar os dados')
  }
  return resposta.json()
}

// ids de todos os pokemons de uma geracao, ex: geracao 1 -> [1, 2, ..., 151]
export function idsDaGeracao(geracao) {
  const { offset, limite } = geracoes[geracao]
  return Array.from({ length: limite }, (_, i) => offset + i + 1)
}

// "poder" = soma dos 6 status base (hp, ataque, defesa, atq esp, def esp e velocidade)
export function calcularPoder(stats) {
  return stats.reduce((total, s) => total + s.base_stat, 0)
}

// a lista só traz o nome e a url, entao o id eu pego do final da url
// ex: https://pokeapi.co/api/v2/pokemon/25/  -> 25
export function pegarId(url) {
  const partes = url.split('/').filter(Boolean)
  return Number(partes[partes.length - 1])
}

export function imagemPokemon(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

// deixa os dados da lista num formato mais facil de usar nos componentes
export function formatarLista(results) {
  return results.map((item) => {
    const id = pegarId(item.url)
    return {
      id,
      nome: item.name,
      imagem: imagemPokemon(id),
    }
  })
}
