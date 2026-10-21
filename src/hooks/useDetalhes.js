import { useState, useEffect } from 'react'
import { buscarJson, urlPokemon, idsDaGeracao, calcularPoder } from '../services/api'

// guarda o que ja foi buscado, assim se voltar pra mesma geração não busca tudo de novo
const cache = {}

// a lista da api só traz nome e url, entao pra mostrar o poder, os tipos e
// os status direto no card tem que buscar os detalhes de cada pokemon da geração
function useDetalhes(geracao) {
  const [porId, setPorId] = useState({}) // { id: { poder, tipos, status } }
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    if (cache[geracao]) {
      setPorId(cache[geracao])
      setCarregando(false)
      return
    }

    const controller = new AbortController()

    async function buscarTodos() {
      setCarregando(true)
      setErro(null)

      try {
        // dispara todas as requisições juntas e espera todas terminarem
        const lista = await Promise.all(
          idsDaGeracao(geracao).map((id) => buscarJson(urlPokemon(id), controller.signal))
        )

        // guarda só o que vai usar no card (o json completo é bem grande)
        const resultado = {}
        lista.forEach((p) => {
          resultado[p.id] = {
            poder: calcularPoder(p.stats),
            tipos: p.types.map((t) => t.type.name),
            status: p.stats.map((s) => ({ nome: s.stat.name, valor: s.base_stat })),
          }
        })

        cache[geracao] = resultado
        setPorId(resultado)
      } catch (e) {
        if (e.name !== 'AbortError') setErro(e.message)
      } finally {
        if (!controller.signal.aborted) setCarregando(false)
      }
    }

    buscarTodos()

    return () => controller.abort()
  }, [geracao, tentativa])

  function recarregar() {
    setTentativa((t) => t + 1)
  }

  return { porId, carregando, erro, recarregar }
}

export default useDetalhes
