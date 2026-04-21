import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

const ICONS = {
  success: CheckCircle,
  warning: AlertTriangle,
  error:   XCircle,
}
const BG = {
  success: 'bg-blue-800',
  warning: 'bg-amber-600',
  error:   'bg-red-600',
}

export default function Toast({ toast }) {
  if (!toast) return null
  const Icon = ICONS[toast.type] ?? CheckCircle
  return (
    <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 ${BG[toast.type]} text-white text-[11px] font-semibold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg animate-fade-in-up`}>
      <Icon size={12} />
      {toast.message}
    </div>
  )
}
