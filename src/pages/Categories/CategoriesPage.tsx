import { useState } from 'react'
import { mockCategorias, mockTiposMovimiento } from '../../data/mockData'

export default function CategoriasPage() {
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 1 | 2>('todos')

  const categoriasFiltradas = mockCategorias.filter(c => {
    if (filtroTipo === 'todos') return true
    return c.idTipoMovimiento === filtroTipo
  })

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Categorías</h1>
          <p className="text-slate-400 text-sm mt-1">{mockCategorias.length} categorías registradas</p>
        </div>
        <button
          style={{ backgroundColor: '#3ecf8e' }}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-black hover:opacity-90 transition-opacity"
        >
          + Nueva categoría
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        {([
          { label: 'Todas', value: 'todos' },
          { label: 'Ingresos', value: 1 },
          { label: 'Egresos', value: 2 },
        ] as const).map(op => (
          <button
            key={op.value}
            onClick={() => setFiltroTipo(op.value)}
            style={{
              backgroundColor: filtroTipo === op.value ? '#101D32' : 'transparent',
              borderColor: filtroTipo === op.value ? '#1e3a5f' : '#1e293b',
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
          >
            <span style={{ color: filtroTipo === op.value ? 'white' : '#64748b' }}>
              {op.label}
            </span>
          </button>
        ))}
      </div>

      {/* Grid de categorías */}
      <div className="grid grid-cols-3 gap-4">
        {categoriasFiltradas.map(c => {
          const tipo = mockTiposMovimiento.find(t => t.idTipoMovimiento === c.idTipoMovimiento)
          const esIngreso = c.idTipoMovimiento === 1

          return (
            <div
              key={c.idCategoria}
              style={{ backgroundColor: '#101D32' }}
              className="rounded-xl p-5 flex flex-col gap-3"
            >
              {/* Badge tipo */}
              <span
                style={{
                  backgroundColor: esIngreso ? '#3ecf8e20' : '#f0706020',
                  color: esIngreso ? '#3ecf8e' : '#f07060',
                }}
                className="text-xs font-medium px-2 py-1 rounded-md w-fit"
              >
                {tipo?.nombreTipo ?? '—'}
              </span>

              {/* Nombre */}
              <p className="text-white font-semibold text-base">{c.nombreCategoria}</p>

              {/* Descripción */}
              <p className="text-slate-400 text-sm">{c.descripcion}</p>

              {/* Estado */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-slate-500 text-xs">
                  {c.estadoCategoria ? 'Activa' : 'Inactiva'}
                </span>
                <div
                  style={{ backgroundColor: c.estadoCategoria ? '#3ecf8e' : '#f07060' }}
                  className="w-2 h-2 rounded-full"
                />
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}