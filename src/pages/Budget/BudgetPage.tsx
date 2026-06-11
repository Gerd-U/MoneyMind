import { useEffect, useState } from 'react'
import { useBudgetStore } from '../../store/BudgetStore'
import { useCategoryStore } from '../../store/CategoryStore'
import { useAuth } from '../../context/AuthContext'
import Modal from '../../components/common/Modal'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'

const formatMonto = (monto: number) =>
  new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(monto)

const now = new Date()

export default function BudgetPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({
    idCategory: 0,
    limitAmount: '',
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  })

  const { idUsuario } = useAuth()
  const { budgets, isLoading: loadingBudgets, error: errorBudgets, load, add, edit, remove } = useBudgetStore()
  const { categories, isLoading: loadingCategories, load: loadCategories } = useCategoryStore()

  useEffect(() => {
    if (!idUsuario) return
    void load(now.getMonth() + 1, now.getFullYear(), idUsuario)
    void loadCategories()
  }, [load, loadCategories, idUsuario])

  const handleSubmit = async () => {
    if (!idUsuario || !form.idCategory || !form.limitAmount) return
    if (editingId !== null) {
      await edit(editingId, {
        idCategory: form.idCategory,
        limitAmount: parseFloat(form.limitAmount),
        month: form.month,
        year: form.year,
      }, idUsuario)
    } else {
      await add({
        idCategory: form.idCategory,
        limitAmount: parseFloat(form.limitAmount),
        month: form.month,
        year: form.year,
      }, idUsuario)
    }
    setIsModalOpen(false)
    setEditingId(null)
    setForm({ idCategory: 0, limitAmount: '', month: now.getMonth() + 1, year: now.getFullYear() })
  }

  const handleEdit = (budget: typeof budgets[0]) => {
    setEditingId(budget.idBudget)
    setForm({
      idCategory: budget.idCategory,
      limitAmount: String(budget.limitAmount),
      month: budget.month,
      year: budget.year,
    })
    setIsModalOpen(true)
  }

  const inputStyle = {
    backgroundColor: '#0D1520',
    border: '1px solid #1e3a5f',
    color: 'white',
  }

  if (loadingBudgets || loadingCategories) return <LoadingSpinner />

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Presupuestos</h1>
          <p className="text-slate-400 text-sm mt-1">{budgets.length} presupuestos del mes</p>
        </div>
        <button
          onClick={() => { setEditingId(null); setIsModalOpen(true) }}
          style={{ backgroundColor: '#3ecf8e' }}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-black hover:opacity-90 transition-opacity"
        >
          + Nuevo
        </button>
      </div>

      {/* Error */}
      {errorBudgets && (
        <ErrorMessage
          message={errorBudgets}
          onRetry={() => idUsuario && void load(now.getMonth() + 1, now.getFullYear(), idUsuario)}
        />
      )}

      {/* Vacío */}
      {!errorBudgets && budgets.length === 0 && (
        <div style={{ backgroundColor: '#101D32' }} className="rounded-xl p-10 flex flex-col items-center gap-3">
          <p className="text-white font-medium text-sm">No hay presupuestos registrados</p>
          <p className="text-slate-500 text-xs text-center">Creá un presupuesto para controlar tus gastos por categoría.</p>
        </div>
      )}

      {/* Grid */}
      {!errorBudgets && budgets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map(b => (
            <div
              key={b.idBudget}
              style={{ backgroundColor: '#101D32' }}
              className="rounded-xl p-5 flex flex-col gap-3"
            >
              <p className="text-white font-semibold text-base">{b.categoryName}</p>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Límite</span>
                <span style={{ color: '#3ecf8e' }} className="font-semibold">
                  {formatMonto(b.limitAmount)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Mes {b.month} / {b.year}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <button
                  onClick={() => handleEdit(b)}
                  className="text-slate-400 hover:text-white transition-colors text-xs"
                >
                  Editar
                </button>
                <button
                  onClick={() => void remove(b.idBudget)}
                  className="text-slate-600 hover:text-red-400 transition-colors text-xs"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingId(null) }}
        title={editingId !== null ? 'Editar presupuesto' : 'Nuevo presupuesto'}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-xs">Categoría</label>
            <select
              value={form.idCategory}
              onChange={e => setForm({ ...form, idCategory: Number(e.target.value) })}
              style={inputStyle}
              className="rounded-lg px-3 py-2.5 text-sm outline-none"
            >
              <option value={0} disabled>Seleccioná una categoría</option>
              {categories.filter(c => c.active).map(c => (
                <option key={c.idCategory} value={c.idCategory}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-xs">Monto límite</label>
            <input
              type="number"
              value={form.limitAmount}
              onChange={e => setForm({ ...form, limitAmount: e.target.value })}
              placeholder="0"
              style={inputStyle}
              className="rounded-lg px-3 py-2.5 text-sm outline-none placeholder-slate-600"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-slate-400 text-xs">Mes</label>
              <input
                type="number"
                min={1}
                max={12}
                value={form.month}
                onChange={e => setForm({ ...form, month: Number(e.target.value) })}
                style={inputStyle}
                className="rounded-lg px-3 py-2.5 text-sm outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-slate-400 text-xs">Año</label>
              <input
                type="number"
                value={form.year}
                onChange={e => setForm({ ...form, year: Number(e.target.value) })}
                style={inputStyle}
                className="rounded-lg px-3 py-2.5 text-sm outline-none"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => void handleSubmit()}
              style={{ backgroundColor: '#3ecf8e' }}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-black hover:opacity-90 transition-opacity"
            >
              {editingId !== null ? 'Actualizar' : 'Guardar presupuesto'}
            </button>
            <button
              onClick={() => { setIsModalOpen(false); setEditingId(null) }}
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