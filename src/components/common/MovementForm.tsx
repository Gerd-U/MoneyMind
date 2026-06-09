import { useState } from 'react'
import { useCategoryStore } from '../../store/CategoryStore'
import { usePaymentMethodStore } from '../../store/paymentMethodStore'
import type { Movimiento } from '../../types'

interface MovementFormProps {
  onSubmit: (data: Omit<Movimiento, 'idMovimiento' | 'idUsuario' | 'fechaRegistro'>) => void
  onCancel: () => void
}

export default function MovementForm({ onSubmit, onCancel }: MovementFormProps) {
  const { categories } = useCategoryStore()
  const { paymentMethods } = usePaymentMethodStore()

  const [form, setForm] = useState({
    idCategoria: 0,
    idMetodoPago: 0,
    monto: '',
    descripcion: '',
    fechaMovimiento: new Date().toISOString().split('T')[0],
  })

  const handleSubmit = () => {
    if (!form.idCategoria || !form.idMetodoPago || !form.monto || !form.descripcion) return
    onSubmit({
      idCategoria: form.idCategoria,
      idMetodoPago: form.idMetodoPago,
      monto: parseFloat(form.monto),
      descripcion: form.descripcion,
      fechaMovimiento: form.fechaMovimiento,
    })
  }

  const inputStyle = {
    backgroundColor: '#0D1520',
    border: '1px solid #1e3a5f',
    color: 'white',
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Descripción */}
      <div className="flex flex-col gap-1.5">
        <label className="text-slate-400 text-xs">Descripción</label>
        <input
          type="text"
          value={form.descripcion}
          onChange={e => setForm({ ...form, descripcion: e.target.value })}
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
          value={form.monto}
          onChange={e => setForm({ ...form, monto: e.target.value })}
          placeholder="0"
          style={inputStyle}
          className="rounded-lg px-3 py-2.5 text-sm outline-none placeholder-slate-600"
        />
      </div>

      {/* Categoría */}
      <div className="flex flex-col gap-1.5">
        <label className="text-slate-400 text-xs">Categoría</label>
        <select
          value={form.idCategoria}
          onChange={e => setForm({ ...form, idCategoria: Number(e.target.value) })}
          style={inputStyle}
          className="rounded-lg px-3 py-2.5 text-sm outline-none"
        >
          <option value={0} disabled>Seleccioná una categoría</option>
          {categories
            .filter(c => c.active)
            .map(c => (
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
          value={form.idMetodoPago}
          onChange={e => setForm({ ...form, idMetodoPago: Number(e.target.value) })}
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
          value={form.fechaMovimiento}
          onChange={e => setForm({ ...form, fechaMovimiento: e.target.value })}
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