interface ErrorMessageProps {
  message?: string
  onRetry?: () => void
}

export default function ErrorMessage({
  message = 'Ocurrió un error al cargar los datos.',
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full py-16 gap-4">
      <div
        style={{ backgroundColor: '#f0706020', color: '#f07060' }}
        className="px-4 py-3 rounded-lg text-sm text-center max-w-sm"
      >
        {message}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{ borderColor: '#1e3a5f' }}
          className="px-4 py-2 rounded-lg text-sm font-medium border text-slate-400 hover:text-white transition-colors"
        >
          Reintentar
        </button>
      )}
    </div>
  )
}