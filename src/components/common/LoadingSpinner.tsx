export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full py-16">
      <div
        style={{ borderColor: '#1e3a5f', borderTopColor: '#3ecf8e' }}
        className="w-8 h-8 rounded-full border-2 animate-spin"
      />
    </div>
  )
}