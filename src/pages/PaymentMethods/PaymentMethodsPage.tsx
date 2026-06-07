import { mockMetodosPago } from '../../data/mockData'

export default function PaymentMethodsPage() {
  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Métodos de pago</h1>
          <p className="text-slate-400 text-sm mt-1">{mockMetodosPago.length} métodos registrados</p>
        </div>
        <button
          style={{ backgroundColor: '#3ecf8e' }}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-black hover:opacity-90 transition-opacity"
        >
          + Nuevo
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockMetodosPago.map(m => (
          <div
            key={m.idMetodoPago}
            style={{ backgroundColor: '#101D32' }}
            className="rounded-xl p-5 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-white font-semibold text-base">{m.nombreMetodo}</p>
              <span
                style={{ backgroundColor: '#3ecf8e20', color: '#3ecf8e' }}
                className="text-xs font-medium px-2 py-1 rounded-md"
              >
                Activo
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-slate-500 text-xs">ID #{m.idMetodoPago}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}