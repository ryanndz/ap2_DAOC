import { tipos } from '../utils/tipos'
import { nomesCurtos, corDoStatus, larguraDoStatus } from '../utils/status'

// card de cada pokemon da lista
// mostra o poder em destaque e todos os status sem precisar abrir o modal
function ItemCard({ pokemon, favorito, onSelecionar, onFavoritar }) {
  const numero = '#' + String(pokemon.id).padStart(3, '0')

  // o fundo do topo usa a cor do primeiro tipo (enquanto não carrega fica cinza)
  const fundo = pokemon.tipos ? tipos[pokemon.tipos[0]]?.fundo : 'from-slate-100'

  return (
    <article className="group relative overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <button
        type="button"
        onClick={() => onSelecionar(pokemon.id)}
        className="w-full cursor-pointer text-left"
      >
        <div className={`bg-linear-to-b ${fundo} to-white px-5 pt-4`}>
          <span className="text-sm font-bold text-slate-500/70">{numero}</span>
          <img
            src={pokemon.imagem}
            alt={pokemon.nome}
            loading="lazy"
            className="mx-auto -mt-2 h-36 w-36 object-contain drop-shadow-lg transition duration-300 group-hover:scale-110 sm:h-40 sm:w-40"
          />
        </div>

        <div className="px-5 pb-5">
          <h3 className="truncate text-center text-xl font-extrabold text-slate-800 capitalize">{pokemon.nome}</h3>

          {pokemon.status ? (
            <>
              <div className="mt-2 flex justify-center gap-1.5">
                {pokemon.tipos.map((t) => (
                  <span key={t} className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase ${tipos[t]?.cor ?? 'bg-slate-400 text-white'}`}>
                    {tipos[t]?.nome ?? t}
                  </span>
                ))}
              </div>

              {/* poder = numero principal do card */}
              <div className="my-4 text-center">
                <p className="bg-linear-to-r from-red-500 to-orange-400 bg-clip-text text-5xl leading-none font-black text-transparent">
                  {pokemon.poder}
                </p>
                <p className="mt-1 text-[11px] font-bold tracking-[0.25em] text-slate-400">⚡ PODER</p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {pokemon.status.map((s) => (
                  <div key={s.nome} className="rounded-xl bg-slate-50 px-2 py-1.5 text-center ring-1 ring-slate-100">
                    <p className="text-[10px] font-semibold whitespace-nowrap text-slate-400">{nomesCurtos[s.nome]}</p>
                    <p className="text-base leading-tight font-bold text-slate-700">{s.valor}</p>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-slate-200">
                      <div className={`h-full rounded-full ${corDoStatus(s.valor)}`} style={{ width: larguraDoStatus(s.valor) }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            // esqueleto enquanto os status ainda estão carregando
            <div className="animate-pulse">
              <div className="mx-auto mt-2 h-5 w-24 rounded-full bg-slate-200"></div>
              <div className="my-4 flex flex-col items-center gap-2">
                <div className="h-12 w-24 rounded-lg bg-slate-200"></div>
                <div className="h-3 w-16 rounded bg-slate-200"></div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="h-14 rounded-xl bg-slate-100"></div>
                ))}
              </div>
            </div>
          )}
        </div>
      </button>

      {/* botao de favoritar fica por cima do card */}
      <button
        type="button"
        onClick={() => onFavoritar(pokemon.id)}
        title={favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        className={`absolute top-3 right-3 cursor-pointer rounded-full bg-white/70 px-2 text-2xl backdrop-blur-sm transition hover:scale-125 ${favorito ? 'text-yellow-400' : 'text-slate-400'}`}
      >
        {favorito ? '★' : '☆'}
      </button>
    </article>
  )
}

export default ItemCard
