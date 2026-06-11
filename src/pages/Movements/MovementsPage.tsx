import { useEffect, useState } from 'react'
import { useMovementStore } from '../../store/MovementStore'
import { useCategoryStore } from '../../store/CategoryStore'
import { usePaymentMethodStore } from '../../store/paymentMethodStore'
import { useAuth } from '../../context/AuthContext'
import Modal from '../../components/common/Modal'
import MovementForm from '../../components/common/MovementForm'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import type { MovementRequest } from '../../models/requests/MovementRequest'
import type { MovementResponse } from '../../models/responses/MovementResponse'

const formatMonto = (monto: number) =>
  new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(monto)

const now = new Date()
const startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
const endDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-30`

export default function MovementsPage() {
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'ingreso' | 'egreso'>('todos')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMovement, setEditingMovement] = useState<MovementResponse | null>(null)

  const { idUsuario } = useAuth()
  const { movements, isLoading, error, load, add, update, remove } = useMovementStore()
  const { categories, load: loadCategories } = useCategoryStore()
  const { load: loadPaymentMethods } = usePaymentMethodStore()

  useEffect(() => {
    if (!idUsuario) return
    void load(startDate, endDate, idUsuario)
    void loadCategories()
    void loadPaymentMethods()
  }, [load, loadCategories, loadPaymentMethods, idUsuario])

  const movimientosFiltrados = movements
    .filter(m => {
      const categoria = categories.find(c => c.idCategory === m.idCategory)
      if (filtroTipo === 'ingreso') return categoria?.idMovementType === 1
      if (filtroTipo === 'egreso') return categoria?.idMovementType === 2
      return true
    })
    .sort((a, b) => new Date(b.movementDate).getTime() - new Date(a.movementDate).getTime())

  const handleNewMovement = async (data: Omit<MovementRequest, 'idUsuario'>) => {
    if (!idUsuario) return
    await add({ ...data, idUsuario })
    setIsModalOpen(false)
  }

  const handleUpdateMovement = async (data: Omit<MovementRequest, 'idUsuario'>) => {
    if (!idUsuario || !editingMovement) return
    await update(editingMovement.idMovement, { ...data, idUsuario })
    setIsModalOpen(false)
    setEditingMovement(null)
  }

  const handleEditClick = (m: MovementResponse) => {
    setEditingMovement(m)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingMovement(null)
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Movimientos</h1>
          <p className="text-slate-400 text-sm mt-1">
            {now.toLocaleString('es-CR', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => { setEditingMovement(null); setIsModalOpen(true) }}
          style={{ backgroundColor: '#3ecf8e' }}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-black hover:opacity-90 transition-opacity"
        >
          + Nuevo
        </button>
      </div>

      {/* Error no bloqueante */}
      {error && <ErrorMessage message={error} onRetry={() => idUsuario && void load(startDate, endDate, idUsuario)} />}

      {/* Filtros */}
      {!error && (
        <div className="flex gap-2">
          {([
            { label: 'Todos', value: 'todos' },
            { label: 'Ingresos', value: 'ingreso' },
            { label: 'Egresos', value: 'egreso' },
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
      )}

      {/* Vacío */}
      {!error && movements.length === 0 && (
        <div style={{ backgroundColor: '#101D32' }} className="rounded-xl p-10 flex flex-col items-center gap-3">
          <p className="text-white font-medium text-sm">No hay movimientos registrados</p>
          <p className="text-slate-500 text-xs text-center">Registrá tu primer movimiento usando el botón de arriba.</p>
        </div>
      )}

      {/* Tabla — desktop */}
      {!error && movements.length > 0 && (
        <div style={{ backgroundColor: '#101D32' }} className="rounded-xl overflow-hidden hidden md:block">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #1e3a5f' }}>
                <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Descripción</th>
                <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Categoría</th>
                <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Método</th>
                <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Fecha</th>
                <th className="text-right text-slate-400 text-xs font-medium px-6 py-4">Monto</th>
                <th className="text-right text-slate-400 text-xs font-medium px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {movimientosFiltrados.map((m, index) => {
                const categoria = categories.find(c => c.idCategory === m.idCategory)
                const esIngreso = categoria?.idMovementType === 1

                return (
                  <tr
                    key={m.idMovement}
                    style={{ borderBottom: index < movimientosFiltrados.length - 1 ? '1px solid #0D1520' : 'none' }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-white text-sm">{m.description}</td>
                    <td className="px-6 py-4">
                      <span
                        style={{
                          backgroundColor: esIngreso ? '#3ecf8e20' : '#f0706020',
                          color: esIngreso ? '#3ecf8e' : '#f07060',
                        }}
                        className="text-xs font-medium px-2 py-1 rounded-md"
                      >
                        {m.categoryName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{m.paymentMethodName}</td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{m.movementDate}</td>
                    <td className="px-6 py-4 text-right">
                      <span
                        style={{ color: esIngreso ? '#3ecf8e' : '#f07060' }}
                        className="text-sm font-semibold"
                      >
                        {esIngreso ? '+' : '-'}{formatMonto(m.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleEditClick(m)}
                          className="text-slate-400 hover:text-white transition-colors text-xs"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => void remove(m.idMovement)}
                          className="text-slate-600 hover:text-red-400 transition-colors text-xs"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Cards — mobile */}
      {!error && movements.length > 0 && (
        <div className="flex flex-col gap-3 md:hidden">
          {movimientosFiltrados.map(m => {
            const categoria = categories.find(c => c.idCategory === m.idCategory)
            const esIngreso = categoria?.idMovementType === 1

            return (
              <div
                key={m.idMovement}
                style={{ backgroundColor: '#101D32' }}
                className="rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-white text-sm font-medium">{m.description}</span>
                  <span className="text-slate-500 text-xs">{m.categoryName} · {m.paymentMethodName}</span>
                  <span className="text-slate-600 text-xs">{m.movementDate}</span>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    style={{ color: esIngreso ? '#3ecf8e' : '#f07060' }}
                    className="text-sm font-semibold"
                  >
                    {esIngreso ? '+' : '-'}{formatMonto(m.amount)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(m)}
                      className="text-slate-400 hover:text-white transition-colors text-xs"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => void remove(m.idMovement)}
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
        title={editingMovement ? 'Editar movimiento' : 'Nuevo movimiento'}
      >
        <MovementForm
          onSubmit={editingMovement ? handleUpdateMovement : handleNewMovement}
          onCancel={handleCloseModal}
          initialData={editingMovement ?? undefined}
        />
      </Modal>

    </div>
  )
}