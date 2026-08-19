import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import './ErrorState.css'

export interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  retryLabel?: string
  className?: string
}

export function ErrorState({
  title = 'Terjadi kesalahan',
  description = 'Data tidak dapat dimuat. Silakan coba lagi.',
  onRetry,
  retryLabel = 'Coba Lagi',
  className,
}: ErrorStateProps) {
  return (
    <div className={['lc-error', className ?? ''].join(' ').trim()} role="alert">
      <span className="lc-error__icon" aria-hidden="true">
        <AlertTriangle size={32} />
      </span>
      <h3 className="lc-error__title">{title}</h3>
      {description ? <p className="lc-error__description">{description}</p> : null}
      {onRetry ? (
        <div className="lc-error__action">
          <Button variant="secondary" onClick={onRetry}>
            {retryLabel}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
