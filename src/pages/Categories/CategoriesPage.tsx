import { useState } from 'react'
import { mockTiposMovimiento } from '../../data/mockData'
import { useCategoryStore } from '../../store/CategoryStore'
import Modal from '../../components/common/Modal'

export default function CategoriasPage() {
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 1 | 2>('todos')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({
    idTipoMovimiento: 0,
    nombreCategoria: '',
    descripcion: '',
    estadoCategoria: true,
  })

  const { categories, add, remove, toggleStatus } = useCategoryStore()

  const categoriasFiltradas = categories.filter(c => {
    if (filtroTipo === 'todos') return true
    return c.idTipoMovimiento === filtroTipo
  })

  const handleSubmit = () => {
    if (!form.idTipoMovimiento || !form.nombreCategoria) return
    add(form)
    setIsModalOpen(false)
    setForm({ idTipoMovimiento: 0, nombreCategoria: '', descripcion: '', estadoCategoria: true })
  }

  const inputStyle = {
    backgroundColor: '#0D1520',
    border: '1px solid #1e3a5f',
    color: 'white',
  }

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Categorías</h1>
          <p className="text-slate-400 text-sm mt-1">{categories.length} categorías registradas</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{ backgroundColor: '#3ecf8e' }}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-black hover:opacity-90 transition-opacity"
        >
          + Nueva
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

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoriasFiltradas.map(c => {
          const tipo = mockTiposMovimiento.find(t => t.idTipoMovimiento === c.idTipoMovimiento)
          const esIngreso = c.idTipoMovimiento === 1

          return (
            <div
              key={c.idCategoria}
              style={{ backgroundColor: '#101D32' }}
              className="rounded-xl p-5 flex flex-col gap-3"
            >
              <span
                style={{
                  backgroundColor: esIngreso ? '#3ecf8e20' : '#f0706020',
                  color: esIngreso ? '#3ecf8e' : '#f07060',
                }}
                className="text-xs font-medium px-2 py-1 rounded-md w-fit"
              >
                {tipo?.nombreTipo ?? '—'}
              </span>

              <p className="text-white font-semibold text-base">{c.nombreCategoria}</p>
              <p className="text-slate-400 text-sm">{c.descripcion}</p>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <button
                  onClick={() => toggleStatus(c.idCategoria)}
                  style={{ color: c.estadoCategoria ? '#3ecf8e' : '#f07060' }}
                  className="text-xs hover:opacity-70 transition-opacity"
                >
                  {c.estadoCategoria ? 'Activa' : 'Inactiva'}
                </button>
                <button
                  onClick={() => remove(c.idCategoria)}
                  className="text-slate-600 hover:text-red-400 transition-colors text-xs"
                >
                  Eliminar
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nueva categoría"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-xs">Nombre</label>
            <input
              type="text"
              value={form.nombreCategoria}
              onChange={e => setForm({ ...form, nombreCategoria: e.target.value })}
              placeholder="ej. Alimentación"
              style={inputStyle}
              className="rounded-lg px-3 py-2.5 text-sm outline-none placeholder-slate-600"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-xs">Descripción</label>
            <input
              type="text"
              value={form.descripcion}
              onChange={e => setForm({ ...form, descripcion: e.target.value })}
              placeholder="ej. Supermercado y restaurantes"
              style={inputStyle}
              className="rounded-lg px-3 py-2.5 text-sm outline-none placeholder-slate-600"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-xs">Tipo</label>
            <select
              value={form.idTipoMovimiento}
              onChange={e => setForm({ ...form, idTipoMovimiento: Number(e.target.value) })}
              style={inputStyle}
              className="rounded-lg px-3 py-2.5 text-sm outline-none"
            >
              <option value={0} disabled>Seleccioná un tipo</option>
              {mockTiposMovimiento.map(t => (
                <option key={t.idTipoMovimiento} value={t.idTipoMovimiento}>
                  {t.nombreTipo}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSubmit}
              style={{ backgroundColor: '#3ecf8e' }}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-black hover:opacity-90 transition-opacity"
            >
              Guardar categoría
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              style={{ borderColor: '#1e3a5f' }}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium border text-slate-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

    </div>
  )
}