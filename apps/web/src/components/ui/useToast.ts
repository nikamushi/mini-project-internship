import { useContext } from 'react'
import { ToastContext, type ToastContextValue } from '@/components/ui/toastContext'

export function useToast(): ToastContextValue['toast'] {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast harus digunakan di dalam ToastProvider.')
  }
  return context.toast
}
