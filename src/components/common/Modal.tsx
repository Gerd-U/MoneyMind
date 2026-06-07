import type { ReactNode } from 'react'
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        style={{ backgroundColor: '#101D32', border: '1px solid #1e3a5f' }}
        className="relative z-10 w-full max-w-md rounded-xl p-6 flex flex-col gap-6 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  )
}