import { useState } from 'react'
import { mockMovimientos, mockCategorias, mockMetodosPago } from '../../data/mockData'


const formatMonto = (monto: number) =>
  new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(monto)

export default function MovimientosPage() {
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'ingreso' | 'egreso'>('todos')

  const movimientosFiltrados = mockMovimientos
    .filter(m => {
      const categoria = mockCategorias.find(c => c.idCategoria === m.idCategoria)
      if (filtroTipo === 'ingreso') return categoria?.idTipoMovimiento === 1
      if (filtroTipo === 'egreso') return categoria?.idTipoMovimiento === 2
      return true
    })
    .sort((a, b) => new Date(b.fechaMovimiento).getTime() - new Date(a.fechaMovimiento).getTime())

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Movimientos</h1>
          <p className="text-slate-400 text-sm mt-1">Junio 2026</p>
        </div>
        <button
          style={{ backgroundColor: '#3ecf8e' }}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-black hover:opacity-90 transition-opacity"
        >
          + Nuevo movimiento
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        {(['todos', 'ingreso', 'egreso'] as const).map(tipo => (
          <button
            key={tipo}
            onClick={() => setFiltroTipo(tipo)}
            style={{
              backgroundColor: filtroTipo === tipo ? '#101D32' : 'transparent',
              borderColor: filtroTipo === tipo ? '#1e3a5f' : '#1e293b',
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium border capitalize transition-colors"
          >
            <span style={{ color: filtroTipo === tipo ? 'white' : '#64748b' }}>
              {tipo === 'todos' ? 'Todos' : tipo === 'ingreso' ? 'Ingresos' : 'Egresos'}
            </span>
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div style={{ backgroundColor: '#101D32' }} className="rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid #1e3a5f' }}>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Descripción</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Categoría</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Método</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Fecha</th>
              <th className="text-right text-slate-400 text-xs font-medium px-6 py-4">Monto</th>
            </tr>
          </thead>
          <tbody>
            {movimientosFiltrados.map((m, index) => {
              const categoria = mockCategorias.find(c => c.idCategoria === m.idCategoria)
              const metodo = mockMetodosPago.find(mp => mp.idMetodoPago === m.idMetodoPago)
              const esIngreso = categoria?.idTipoMovimiento === 1

              return (
                <tr
                  key={m.idMovimiento}
                  style={{ borderBottom: index < movimientosFiltrados.length - 1 ? '1px solid #0D1520' : 'none' }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 text-white text-sm">{m.descripcion}</td>
                  <td className="px-6 py-4">
                    <span
                      style={{
                        backgroundColor: esIngreso ? '#3ecf8e20' : '#f0706020',
                        color: esIngreso ? '#3ecf8e' : '#f07060',
                      }}
                      className="text-xs font-medium px-2 py-1 rounded-md"
                    >
                      {categoria?.nombreCategoria ?? '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{metodo?.nombreMetodo ?? '—'}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{m.fechaMovimiento}</td>
                  <td className="px-6 py-4 text-right">
                    <span
                      style={{ color: esIngreso ? '#3ecf8e' : '#f07060' }}
                      className="text-sm font-semibold"
                    >
                      {esIngreso ? '+' : '-'}{formatMonto(m.monto)}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

    </div>
  )
}