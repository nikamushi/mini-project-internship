import { type ReactNode } from 'react'
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react'
import './Alert.css'

export type AlertTone = 'info' | 'success' | 'warning' | 'danger'

export interface AlertProps {
  tone?: AlertTone
  title?: ReactNode
  children: ReactNode
  className?: string
}

const ALERT_ICONS: Record<AlertTone, typeof Info> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
}

export function Alert({ tone = 'info', title, children, className }: AlertProps) {
  const Icon = ALERT_ICONS[tone]
  return (
    <div
      className={['lc-alert', `lc-alert--${tone}`, className ?? ''].join(' ').trim()}
      role={tone === 'danger' ? 'alert' : 'status'}
    >
      <Icon size={18} className="lc-alert__icon" aria-hidden="true" />
      <div className="lc-alert__content">
        {title ? <p className="lc-alert__title">{title}</p> : null}
        <div className="lc-alert__message">{children}</div>
      </div>
    </div>
  )
}
