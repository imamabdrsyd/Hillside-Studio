interface ToastProps {
  show: boolean
  message: string
  type: 'success' | 'error'
}

export default function Toast({ show, message, type }: ToastProps) {
  return (
    <div
      className={`toast fixed bottom-8 right-8 px-6 py-4 rounded-xl flex items-center gap-3 shadow-xl z-50 text-white ${
        show ? 'show' : ''
      } ${type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}
    >
      <span>{type === 'success' ? '✅' : '❌'}</span>
      <span>{message}</span>
    </div>
  )
}
