import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div
      style={{ backgroundColor: '#0D1520' }}
      className="min-h-screen flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-6 text-center px-4">

        {/* Número */}
        <span
          style={{ color: '#1e3a5f' }}
          className="text-9xl font-bold tracking-tight select-none"
        >
          404
        </span>

        {/* Texto */}
        <div className="flex flex-col gap-2">
          <h1 className="text-white text-2xl font-bold">Página no encontrada</h1>
          <p className="text-slate-400 text-sm max-w-sm">
            La página que estás buscando no existe o fue movida a otra dirección.
          </p>
        </div>

        {/* Botón */}
        <button
          onClick={() => navigate('/')}
          style={{ backgroundColor: '#3ecf8e' }}
          className="px-6 py-2.5 rounded-lg text-sm font-semibold text-black hover:opacity-90 transition-opacity"
        >
          Volver al Dashboard
        </button>

      </div>
    </div>
  )
}