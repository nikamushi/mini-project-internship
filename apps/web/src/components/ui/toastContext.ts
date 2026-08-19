import { createContext } from 'react'

export type ToastTone = 'success' | 'error' | 'info' | 'warning'

export interface ToastOptions {
  tone?: ToastTone
  duration?: number
}

export interface ToastContextValue {
  toast: (message: string, options?: ToastOptions) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
