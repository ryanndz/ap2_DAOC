import ItemCard from './ItemCard'

function ItemList({ pokemons, favoritos, onSelecionar, onFavoritar }) {

  if (pokemons.length === 0) {
    return (
      <div className="py-16 text-center text-slate-500">
        <p className="text-lg font-medium">Nenhum pokémon encontrado :(</p>
        <p className="text-sm">Tente mudar a busca ou os filtros</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {pokemons.map((pokemon) => (
        <ItemCard
          key={pokemon.id}
          pokemon={pokemon}
          favorito={favoritos.includes(pokemon.id)}
          onSelecionar={onSelecionar}
          onFavoritar={onFavoritar}
        />
      ))}
    </div>
  )
}

export default ItemList
