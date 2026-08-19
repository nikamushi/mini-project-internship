import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { ToastContext, type ToastOptions, type ToastTone } from '@/components/ui/toastContext'
import './Toast.css'

interface ToastItem {
  id: number
  message: string
  tone: ToastTone
}

const TOAST_ICONS: Record<ToastTone, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
}

const DEFAULT_DURATION_MS = 4_000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const counter = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((item) => item.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, options?: ToastOptions) => {
      counter.current += 1
      const id = counter.current
      const tone = options?.tone ?? 'info'
      setToasts((current) => [...current, { id, message, tone }])
      window.setTimeout(() => dismiss(id), options?.duration ?? DEFAULT_DURATION_MS)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="lc-toast-region" aria-live="polite" aria-label="Notifikasi">
        {toasts.map((item) => {
          const Icon = TOAST_ICONS[item.tone]
          return (
            <div
              key={item.id}
              className={`lc-toast lc-toast--${item.tone}`}
              role={item.tone === 'error' ? 'alert' : 'status'}
            >
              <Icon size={18} className="lc-toast__icon" aria-hidden="true" />
              <span className="lc-toast__message">{item.message}</span>
              <button
                type="button"
                className="lc-toast__close"
                aria-label="Tutup notifikasi"
                onClick={() => dismiss(item.id)}
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
