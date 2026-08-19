import { type ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import './FormError.css'

export interface FormErrorProps {
  id?: string
  children: ReactNode
  className?: string
}

export function FormError({ id, children, className }: FormErrorProps) {
  return (
    <p id={id} className={['lc-form-error', className ?? ''].join(' ').trim()} role="alert">
      <AlertCircle size={14} className="lc-form-error__icon" aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}
