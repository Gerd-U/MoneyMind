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

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const YEARS = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i)

export default function MovementsPage() {
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'ingreso' | 'egreso'>('todos')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMovement, setEditingMovement] = useState<MovementResponse | null>(null)
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [search, setSearch] = useState('')

  const { idUsuario } = useAuth()
  const { movements, isLoading, error, load, add, update, remove } = useMovementStore()
  const { categories, load: loadCategories } = useCategoryStore()
  const { load: loadPaymentMethods } = usePaymentMethodStore()

  const startDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`
  const endDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-30`

  useEffect(() => {
    if (!idUsuario) return
    void load(startDate, endDate, idUsuario)
  }, [load, idUsuario, selectedMonth, selectedYear])

  useEffect(() => {
    void loadCategories()
    void loadPaymentMethods()
  }, [loadCategories, loadPaymentMethods])

  const movimientosFiltrados = movements
    .filter(m => {
      const categoria = categories.find(c => c.idCategory === m.idCategory)
      if (filtroTipo === 'ingreso') return categoria?.idMovementType === 1
      if (filtroTipo === 'egreso') return categoria?.idMovementType === 2
      return true
    })
    .filter(m =>
      search.trim() === '' ||
      m.description.toLowerCase().includes(search.toLowerCase())
    )
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

  const selectStyle = {
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
          <h1 className="text-white text-2xl font-bold">Movimientos</h1>
          <p className="text-slate-400 text-sm mt-1">
            {MESES[selectedMonth - 1]} {selectedYear}
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

      {/* Filtros de mes y año */}
      <div className="flex gap-3 flex-wrap items-center">
        <select
          value={selectedMonth}
          onChange={e => setSelectedMonth(Number(e.target.value))}
          style={selectStyle}
          className="rounded-lg px-3 py-2 text-sm outline-none"
        >
          {MESES.map((mes, index) => (
            <option key={index + 1} value={index + 1}>{mes}</option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={e => setSelectedYear(Number(e.target.value))}
          style={selectStyle}
          className="rounded-lg px-3 py-2 text-sm outline-none"
        >
          {YEARS.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        {/* Search */}
        <div className="relative flex-1 sm:flex-none">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por descripción..."
            style={selectStyle}
            className="w-full sm:w-72 rounded-lg px-3 py-2 text-sm outline-none placeholder-slate-600"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Error no bloqueante */}
      {error && <ErrorMessage message={error} onRetry={() => idUsuario && void load(startDate, endDate, idUsuario)} />}

      {/* Filtros de tipo */}
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
          <p className="text-slate-500 text-xs text-center">
            No hay movimientos en {MESES[selectedMonth - 1]} {selectedYear}.
          </p>
        </div>
      )}

      {/* Sin resultados de búsqueda */}
      {!error && movements.length > 0 && movimientosFiltrados.length === 0 && (
        <div style={{ backgroundColor: '#101D32' }} className="rounded-xl p-10 flex flex-col items-center gap-3">
          <p className="text-white font-medium text-sm">No se encontraron resultados</p>
          <p className="text-slate-500 text-xs text-center">Intentá con otra descripción.</p>
        </div>
      )}

      {/* Tabla — desktop */}
      {!error && movimientosFiltrados.length > 0 && (
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
      {!error && movimientosFiltrados.length > 0 && (
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