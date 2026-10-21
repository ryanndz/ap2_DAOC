import { tipos } from '../utils/tipos'
import { geracoes } from '../services/api'

// formulario controlado: os valores vem do estado do Home pelas props
// e qualquer mudança é avisada pelo onChange
function SearchForm({ filtros, onChange, onLimpar }) {

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    onChange(name, type === 'checkbox' ? checked : value)
  }

  function handleSubmit(e) {
    // a busca já filtra enquanto digita, aqui é só pra não recarregar a pagina no enter
    e.preventDefault()
  }

  const estiloCampo = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-200'

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:grid-cols-3 lg:grid-cols-[2fr_1fr_1fr_1fr_auto] lg:items-end"
    >
      <div className="sm:col-span-3 lg:col-span-1">
        <label htmlFor="busca" className="mb-1 block text-sm font-medium text-slate-600">
          Buscar
        </label>
        <input
          id="busca"
          name="busca"
          type="text"
          placeholder="Nome ou número (ex: pikachu, 25)"
          value={filtros.busca}
          onChange={handleChange}
          className={estiloCampo}
        />
      </div>

      <div>
        <label htmlFor="geracao" className="mb-1 block text-sm font-medium text-slate-600">Geração</label>
        <select id="geracao" name="geracao" value={filtros.geracao} onChange={handleChange} className={estiloCampo}>
          {Object.keys(geracoes).map((g) => (
            <option key={g} value={g}>{g}ª geração</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="tipo" className="mb-1 block text-sm font-medium text-slate-600">Tipo</label>
        <select id="tipo" name="tipo" value={filtros.tipo} onChange={handleChange} className={estiloCampo}>
          <option value="">Todos</option>
          {Object.entries(tipos).map(([chave, tipo]) => (
              <option key={chave} value={chave}>{tipo.nome}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="ordem" className="mb-1 block text-sm font-medium text-slate-600">Ordenar por</label>
        <select id="ordem" name="ordem" value={filtros.ordem} onChange={handleChange} className={estiloCampo}>
          <option value="numero">Número</option>
          <option value="nome">Nome (A-Z)</option>
          <option value="mais-forte">Mais forte</option>
          <option value="mais-fraco">Mais fraco</option>
        </select>
      </div>

      <div className="flex items-center justify-between gap-4 sm:col-span-3 lg:col-span-1 lg:py-2">
        <label className="flex cursor-pointer items-center gap-2 text-sm whitespace-nowrap text-slate-600">
          <input
            type="checkbox"
            name="soFavoritos"
            checked={filtros.soFavoritos}
            onChange={handleChange}
            className="h-4 w-4 accent-red-500"
          />
          Só favoritos
        </label>

        <button
          type="button"
          onClick={onLimpar}
          className="cursor-pointer rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
        >
          Limpar
        </button>
      </div>
    </form>
  )
}

export default SearchForm
