import Home from './pages/Home'

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="bg-pokedex text-white shadow-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-5">
          <img src="/pokebola.svg" alt="" className="h-10 w-10" />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Pokédex</h1>
            <p className="text-sm text-red-100">Catálogo de pokémons usando a PokeAPI</p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Home />
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        AP2 - Desenvolvimento de Aplicação Orientada a Componentes | ULBRA Torres
        <br />
        Dados de <a href="https://pokeapi.co" target="_blank" rel="noreferrer" className="underline hover:text-slate-600">pokeapi.co</a>
      </footer>
    </div>
  )
}

export default App
