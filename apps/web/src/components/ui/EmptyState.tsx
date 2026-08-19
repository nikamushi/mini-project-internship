import { type ReactNode } from 'react'
import { Inbox } from 'lucide-react'
import './EmptyState.css'

export interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={['lc-empty', className ?? ''].join(' ').trim()}>
      <span className="lc-empty__icon" aria-hidden="true">
        {icon ?? <Inbox size={32} />}
      </span>
      <h3 className="lc-empty__title">{title}</h3>
      {description ? <p className="lc-empty__description">{description}</p> : null}
      {action ? <div className="lc-empty__action">{action}</div> : null}
    </div>
  )
}
