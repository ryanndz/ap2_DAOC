// loading em formato de pokebola girando
function LoadingSpinner({ texto = 'Carregando...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="relative h-14 w-14 animate-spin rounded-full border-4 border-slate-800 bg-linear-to-b from-red-500 from-50% to-white to-50%">
        <div className="absolute top-1/2 left-0 h-1 w-full -translate-y-1/2 bg-slate-800"></div>
        <div className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-slate-800 bg-white"></div>
      </div>
      <p className="text-sm text-slate-500">{texto}</p>
    </div>
  )
}

export default LoadingSpinner
