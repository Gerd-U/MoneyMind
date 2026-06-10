import { useState, useEffect } from 'react'
import { useCategoryStore } from '../../store/CategoryStore'
import { usePaymentMethodStore } from '../../store/paymentMethodStore'
import { getAllMovementTypes } from '../../services/MovementTypeService'
import type { MovementRequest } from '../../models/requests/MovementRequest'
import type { MovementTypeResponse } from '../../models/responses/MovementTypeResponse'

interface MovementFormProps {
  onSubmit: (data: Omit<MovementRequest, 'idUsuario'>) => void
  onCancel: () => void
}

export default function MovementForm({ onSubmit, onCancel }: MovementFormProps) {
  const { categories } = useCategoryStore()
  const { paymentMethods } = usePaymentMethodStore()

  const [movementTypes, setMovementTypes] = useState<MovementTypeResponse[]>([])
  const [selectedType, setSelectedType] = useState<number>(0)
  const [loadingTypes, setLoadingTypes] = useState(false)
  const [errorTypes, setErrorTypes] = useState<string | null>(null)

  const [form, setForm] = useState({
    idCategory: 0,
    idPaymentMethod: 0,
    amount: '',
    description: '',
    transactionDate: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    const fetchMovementTypes = async () => {
      setLoadingTypes(true)
      setErrorTypes(null)
      try {
        const data = await getAllMovementTypes()
        setMovementTypes(data)
      } catch {
        setErrorTypes('No se pudieron cargar los tipos de movimiento.')
      } finally {
        setLoadingTypes(false)
      }
    }
    fetchMovementTypes()
  }, [])

  const filteredCategories = selectedType
    ? categories.filter(c => c.idMovementType === selectedType && c.active)
    : categories.filter(c => c.active)

  const handleSubmit = () => {
    if (!form.idCategory || !form.idPaymentMethod || !form.amount || !form.description) return
    onSubmit({
      idCategory: form.idCategory,
      idPaymentMethod: form.idPaymentMethod,
      amount: parseFloat(form.amount),
      description: form.description,
      transactionDate: form.transactionDate,
    })
  }

  const inputStyle = {
    backgroundColor: '#0D1520',
    border: '1px solid #1e3a5f',
    color: 'white',
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Tipo de movimiento */}
      <div className="flex flex-col gap-1.5">
        <label className="text-slate-400 text-xs">Tipo de movimiento</label>
        {loadingTypes ? (
          <p className="text-slate-500 text-xs">Cargando tipos...</p>
        ) : errorTypes ? (
          <p style={{ color: '#f07060' }} className="text-xs">{errorTypes}</p>
        ) : (
          <select
            value={selectedType}
            onChange={e => {
              setSelectedType(Number(e.target.value))
              setForm({ ...form, idCategory: 0 })
            }}
            style={inputStyle}
            className="rounded-lg px-3 py-2.5 text-sm outline-none"
          >
            <option value={0} disabled>Seleccioná un tipo</option>
            {movementTypes.map(type => (
              <option key={type.idMovementType} value={type.idMovementType}>
                {type.typeName}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Descripción */}
      <div className="flex flex-col gap-1.5">
        <label className="text-slate-400 text-xs">Descripción</label>
        <input
          type="text"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          placeholder="ej. Salario mensual"
          style={inputStyle}
          className="rounded-lg px-3 py-2.5 text-sm outline-none placeholder-slate-600"
        />
      </div>

      {/* Monto */}
      <div className="flex flex-col gap-1.5">
        <label className="text-slate-400 text-xs">Monto</label>
        <input
          type="number"
          value={form.amount}
          onChange={e => setForm({ ...form, amount: e.target.value })}
          placeholder="0"
          style={inputStyle}
          className="rounded-lg px-3 py-2.5 text-sm outline-none placeholder-slate-600"
        />
      </div>

      {/* Categoría */}
      <div className="flex flex-col gap-1.5">
        <label className="text-slate-400 text-xs">Categoría</label>
        <select
          value={form.idCategory}
          onChange={e => setForm({ ...form, idCategory: Number(e.target.value) })}
          style={inputStyle}
          className="rounded-lg px-3 py-2.5 text-sm outline-none"
        >
          <option value={0} disabled>Seleccioná una categoría</option>
          {filteredCategories.map(c => (
            <option key={c.idCategory} value={c.idCategory}>
              {c.categoryName}
            </option>
          ))}
        </select>
      </div>

      {/* Método de pago */}
      <div className="flex flex-col gap-1.5">
        <label className="text-slate-400 text-xs">Método de pago</label>
        <select
          value={form.idPaymentMethod}
          onChange={e => setForm({ ...form, idPaymentMethod: Number(e.target.value) })}
          style={inputStyle}
          className="rounded-lg px-3 py-2.5 text-sm outline-none"
        >
          <option value={0} disabled>Seleccioná un método</option>
          {paymentMethods.map(m => (
            <option key={m.idPaymentMethod} value={m.idPaymentMethod}>
              {m.methodName}
            </option>
          ))}
        </select>
      </div>

      {/* Fecha */}
      <div className="flex flex-col gap-1.5">
        <label className="text-slate-400 text-xs">Fecha</label>
        <input
          type="date"
          value={form.transactionDate}
          onChange={e => setForm({ ...form, transactionDate: e.target.value })}
          style={inputStyle}
          className="rounded-lg px-3 py-2.5 text-sm outline-none"
        />
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSubmit}
          style={{ backgroundColor: '#3ecf8e' }}
          className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-black hover:opacity-90 transition-opacity"
        >
          Guardar movimiento
        </button>
        <button
          onClick={onCancel}
          style={{ borderColor: '#1e3a5f' }}
          className="flex-1 py-2.5 rounded-lg text-sm font-medium border text-slate-400 hover:text-white transition-colors"
        >
          Cancelar
        </button>
      </div>

    </div>
  )
}