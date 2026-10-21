import { useState, useEffect } from 'react'
import { buscarJson } from '../services/api'

// hook pra fazer requisição GET
// retorna os dados, se esta carregando, o erro (se tiver) e uma funcao pra tentar de novo
function useFetch(url) {
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    // sem url não busca nada (ex: quando nenhum tipo ta selecionado)
    if(!url) {
      setDados(null)
      return
    }

    // usado pra cancelar a requisição se a url mudar antes de terminar
    const controller = new AbortController()

    async function buscarDados() {
      setCarregando(true)
      setErro(null)

      try {
        const json = await buscarJson(url, controller.signal)
        // console.log(json)
        setDados(json)
      } catch (e) {
        // AbortError é quando a gente mesmo cancelou, nao precisa mostrar
        if (e.name !== 'AbortError') {
          setErro(e.message)
        }
      } finally {
        if (!controller.signal.aborted) setCarregando(false)
      }
    }

    buscarDados()

    return () => controller.abort()
  }, [url, tentativa])

  function recarregar() {
    setTentativa((t) => t + 1)
  }

  return { dados, carregando, erro, recarregar }
}

export default useFetch
