import { useEffect, useState } from 'react'
import { usePaymentMethodStore } from '../../store/paymentMethodStore'
import Modal from '../../components/common/Modal'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'

export default function PaymentMethodsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [methodName, setMethodName] = useState('')

  const { paymentMethods, isLoading, error, load, add, remove } = usePaymentMethodStore()

  useEffect(() => {
    void load()
  }, [load])

  const handleSubmit = async () => {
    if (!methodName.trim()) return
    await add({ methodName: methodName.trim() })
    setIsModalOpen(false)
    setMethodName('')
  }

  const inputStyle = {
    backgroundColor: '#0D1520',
    border: '1px solid #1e3a5f',
    color: 'white',
  }

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} onRetry={() => void load()} />

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Métodos de pago</h1>
          <p className="text-slate-400 text-sm mt-1">{paymentMethods.length} métodos registrados</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{ backgroundColor: '#3ecf8e' }}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-black hover:opacity-90 transition-opacity"
        >
          + Nuevo
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paymentMethods.map(m => (
          <div
            key={m.idPaymentMethod}
            style={{ backgroundColor: '#101D32' }}
            className="rounded-xl p-5 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-white font-semibold text-base">{m.methodName}</p>
              <span
                style={{ backgroundColor: '#3ecf8e20', color: '#3ecf8e' }}
                className="text-xs font-medium px-2 py-1 rounded-md"
              >
                Activo
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-slate-500 text-xs">ID #{m.idPaymentMethod}</span>
              <button
                onClick={() => void remove(m.idPaymentMethod)}
                className="text-slate-600 hover:text-red-400 transition-colors text-xs"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nuevo método de pago"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-xs">Nombre del método</label>
            <input
              type="text"
              value={methodName}
              onChange={e => setMethodName(e.target.value)}
              placeholder="ej. PayPal"
              style={inputStyle}
              className="rounded-lg px-3 py-2.5 text-sm outline-none placeholder-slate-600"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSubmit}
              style={{ backgroundColor: '#3ecf8e' }}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-black hover:opacity-90 transition-opacity"
            >
              Guardar método
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