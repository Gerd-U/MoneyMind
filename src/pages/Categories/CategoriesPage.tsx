import { useEffect, useState } from 'react'
import { useCategoryStore } from '../../store/CategoryStore'
import Modal from '../../components/common/Modal'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import type { CategoryResponse } from '../../models/responses/CategoryResponse'
import { useAuth } from '../../context/AuthContext'

export default function CategoriesPage() {
  const [filterMovementType, setFilterMovementType] = useState<'todos' | number>('todos')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(null)
  const [form, setForm] = useState({
    idMovementType: 0,
    categoryName: '',
    description: '',
    active: true,
  })

  const { idUsuario } = useAuth()
  const { categories, movementTypes, isLoading, error, load, add, update, remove, toggleStatus } = useCategoryStore()

  useEffect(() => {
    if (!idUsuario) return
    void load(idUsuario)
  }, [load, idUsuario])

  const filteredCategories = categories.filter(c => {
    if (filterMovementType === 'todos') return true
    return c.idMovementType === filterMovementType
  })

  const handleSubmit = async () => {
    if (!idUsuario || !form.idMovementType || !form.categoryName.trim()) return
    if (editingCategory) {
      await update(editingCategory.idCategory, {
        idUsuario,
        ...form,
        categoryName: form.categoryName.trim(),
        description: form.description.trim(),
      })
    } else {
      await add({
        idUsuario,
        ...form,
        categoryName: form.categoryName.trim(),
        description: form.description.trim(),
      })
    }
    handleCloseModal()
  }

  const handleEditClick = (c: CategoryResponse) => {
    setEditingCategory(c)
    setForm({
      idMovementType: c.idMovementType,
      categoryName: c.categoryName,
      description: c.description,
      active: c.active,
    })
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
    setForm({ idMovementType: 0, categoryName: '', description: '', active: true })
  }

  const inputStyle = {
    backgroundColor: '#0D1520',
    border: '1px solid #1e3a5f',
    color: 'white',
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Categorías</h1>
          <p className="text-slate-400 text-sm mt-1">{categories.length} categorías registradas</p>
        </div>
        <button
          onClick={() => { setEditingCategory(null); setIsModalOpen(true) }}
          style={{ backgroundColor: '#3ecf8e' }}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-black hover:opacity-90 transition-opacity"
        >
          + Nueva
        </button>
      </div>

      {/* Error no bloqueante */}
      {error && <ErrorMessage message={error} onRetry={() => idUsuario && void load(idUsuario)} />}

      {/* Filtros */}
      {!error && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterMovementType('todos')}
            style={{
              backgroundColor: filterMovementType === 'todos' ? '#101D32' : 'transparent',
              borderColor: filterMovementType === 'todos' ? '#1e3a5f' : '#1e293b',
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
          >
            <span style={{ color: filterMovementType === 'todos' ? 'white' : '#64748b' }}>
              Todas
            </span>
          </button>
          {movementTypes.map(type => (
            <button
              key={type.idMovementType}
              onClick={() => setFilterMovementType(type.idMovementType)}
              style={{
                backgroundColor: filterMovementType === type.idMovementType ? '#101D32' : 'transparent',
                borderColor: filterMovementType === type.idMovementType ? '#1e3a5f' : '#1e293b',
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
            >
              <span style={{ color: filterMovementType === type.idMovementType ? 'white' : '#64748b' }}>
                {type.typeName}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Vacío */}
      {!error && categories.length === 0 && (
        <div style={{ backgroundColor: '#101D32' }} className="rounded-xl p-10 flex flex-col items-center gap-3">
          <p className="text-white font-medium text-sm">No hay categorías registradas</p>
          <p className="text-slate-500 text-xs text-center">Creá una categoría para empezar a registrar movimientos.</p>
        </div>
      )}

      {/* Grid */}
      {!error && filteredCategories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map(c => {
            const esIngreso = c.idMovementType === 1
            return (
              <div
                key={c.idCategory}
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
                  {c.movementTypeName}
                </span>
                <p className="text-white font-semibold text-base">{c.categoryName}</p>
                <p className="text-slate-400 text-sm">{c.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <button
                    onClick={() => void toggleStatus(c.idCategory)}
                    style={{ color: c.active ? '#3ecf8e' : '#f07060' }}
                    className="text-xs hover:opacity-70 transition-opacity"
                  >
                    {c.active ? 'Activa' : 'Inactiva'}
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditClick(c)}
                      className="text-slate-400 hover:text-white transition-colors text-xs"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => void remove(c.idCategory)}
                      className="text-slate-600 hover:text-red-400 transition-colors text-xs"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCategory ? 'Editar categoría' : 'Nueva categoría'}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-xs">Nombre</label>
            <input
              type="text"
              value={form.categoryName}
              onChange={e => setForm({ ...form, categoryName: e.target.value })}
              placeholder="ej. Alimentación"
              style={inputStyle}
              className="rounded-lg px-3 py-2.5 text-sm outline-none placeholder-slate-600"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-xs">Descripción</label>
            <input
              type="text"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="ej. Supermercado y restaurantes"
              style={inputStyle}
              className="rounded-lg px-3 py-2.5 text-sm outline-none placeholder-slate-600"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-xs">Tipo</label>
            <select
              value={form.idMovementType}
              onChange={e => setForm({ ...form, idMovementType: Number(e.target.value) })}
              style={inputStyle}
              className="rounded-lg px-3 py-2.5 text-sm outline-none"
            >
              <option value={0} disabled>Seleccioná un tipo</option>
              {movementTypes.map(t => (
                <option key={t.idMovementType} value={t.idMovementType}>
                  {t.typeName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => void handleSubmit()}
              style={{ backgroundColor: '#3ecf8e' }}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-black hover:opacity-90 transition-opacity"
            >
              {editingCategory ? 'Actualizar categoría' : 'Guardar categoría'}
            </button>
            <button
              onClick={handleCloseModal}
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