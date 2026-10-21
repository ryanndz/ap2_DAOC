import { useEffect } from 'react'
import useFetch from '../hooks/useFetch'
import { urlPokemon, imagemPokemon, calcularPoder } from '../services/api'
import { tipos } from '../utils/tipos'
import { nomesStatus, corDoStatus, larguraDoStatus } from '../utils/status'
import LoadingSpinner from './LoadingSpinner'

// modal com os detalhes do pokemon que foi clicado
function ItemDetails({ id, favorito, onFavoritar, onFechar }) {
  // reaproveita o mesmo hook da lista, so muda a url
  const { dados: pokemon, carregando, erro, recarregar } = useFetch(urlPokemon(id))

  // fecha com ESC e trava o scroll da pagina enquanto o modal ta aberto
  useEffect(() => {
    function aoApertarTecla(e) {
      if (e.key === 'Escape') onFechar()
    }

    document.addEventListener('keydown', aoApertarTecla)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', aoApertarTecla)
      document.body.style.overflow = ''
    }
  }, [onFechar])

  // fundo da imagem com a cor do primeiro tipo, igual no card
  const fundo = pokemon ? tipos[pokemon.types[0].type.name]?.fundo ?? 'from-slate-100' : 'from-slate-100'

  return (
    <div
      onClick={onFechar}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
    >
      {/* scrollbar escondida: se a tela for muito baixa ainda rola, mas sem aparecer a barra */}
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white p-6 shadow-xl [scrollbar-width:none] sm:rounded-3xl [&::-webkit-scrollbar]:hidden"
      >
        <button
          onClick={onFechar}
          aria-label="Fechar"
          className="absolute top-3 right-4 cursor-pointer text-3xl leading-none text-slate-400 hover:text-slate-700"
        >
          &times;
        </button>

        {carregando && <LoadingSpinner texto="Buscando detalhes..." />}

        {erro && (
          <div className="py-10 text-center">
            <p className="text-red-500">{erro}</p>
            <button onClick={recarregar} className="mt-3 cursor-pointer text-sm text-slate-600 underline">Tentar de novo</button>
          </div>
        )}

        {pokemon && !carregando && (
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            {/* coluna da esquerda: imagem e informações */}
            <div>
              <div className={`rounded-2xl bg-linear-to-b ${fundo} to-white`}>
                <img
                  src={pokemon.sprites.other['official-artwork'].front_default || imagemPokemon(pokemon.id)}
                  alt={pokemon.name}
                  className="mx-auto h-28 w-28 object-contain drop-shadow-lg sm:h-48 sm:w-48"
                />
              </div>

              <div className="mt-2 text-center">
                <p className="text-sm font-semibold text-slate-400">#{String(pokemon.id).padStart(3, '0')}</p>
                <h2 className="text-2xl font-extrabold text-slate-800 capitalize sm:text-3xl">{pokemon.name}</h2>

                <div className="mt-3 flex justify-center gap-2">
                  {pokemon.types.map((t) => (
                    <span
                      key={t.type.name}
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${tipos[t.type.name]?.cor ?? 'bg-slate-400 text-white'}`}
                    >
                      {tipos[t.type.name]?.nome ?? t.type.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* a api manda altura em decimetros e peso em hectogramas, por isso o /10 */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-xl bg-slate-100 p-2">
                  <p className="text-xs text-slate-500">Altura</p>
                  <p className="font-bold text-slate-700">{(pokemon.height / 10).toLocaleString('pt-BR')} m</p>
                </div>
                <div className="rounded-xl bg-slate-100 p-2">
                  <p className="text-xs text-slate-500">Peso</p>
                  <p className="font-bold text-slate-700">{(pokemon.weight / 10).toLocaleString('pt-BR')} kg</p>
                </div>
              </div>
            </div>

            {/* coluna da direita: habilidades e status */}
            <div className="flex flex-col">
            <h3 className="mb-2 font-bold text-slate-700">Habilidades</h3>
            <ul className="flex flex-wrap gap-2">
              {pokemon.abilities.map((a) => (
                <li key={a.ability.name} className="rounded-lg bg-slate-100 px-3 py-1 text-sm text-slate-600 capitalize">
                  {a.ability.name.replaceAll('-', ' ')}
                  {a.is_hidden && <span className="text-slate-400"> (oculta)</span>}
                </li>
              ))}
            </ul>

            <h3 className="mt-5 mb-2 font-bold text-slate-700">Status base</h3>
            <div className="space-y-2">
              {pokemon.stats.map((s) => (
                <div key={s.stat.name} className="flex items-center gap-3 text-sm">
                  <span className="w-24 shrink-0 text-slate-500">{nomesStatus[s.stat.name]}</span>
                  <span className="w-8 shrink-0 text-right font-semibold text-slate-700">{s.base_stat}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full ${corDoStatus(s.base_stat)}`}
                      style={{ width: larguraDoStatus(s.base_stat) }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-3 border-t border-slate-200 pt-3 text-sm">
              <span className="w-24 shrink-0 font-bold text-slate-700">Total (poder)</span>
              <span className="w-8 shrink-0 text-right font-extrabold text-red-600">{calcularPoder(pokemon.stats)}</span>
            </div>

            {/* mt-auto empurra o botão pro final da coluna */}
            <div className="mt-auto pt-5">
              <button
                onClick={() => onFavoritar(pokemon.id)}
                className={`w-full cursor-pointer rounded-xl py-3 font-semibold transition ${
                  favorito ? 'bg-yellow-400 text-yellow-950 hover:bg-yellow-300' : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {favorito ? '★ Remover dos favoritos' : '☆ Adicionar aos favoritos'}
              </button>
            </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ItemDetails
