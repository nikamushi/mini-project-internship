import { type ReactNode } from 'react'
import './Badge.css'

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

export interface BadgeProps {
  tone?: BadgeTone
  size?: 'sm' | 'lg'
  icon?: ReactNode
  children: ReactNode
  className?: string
}

export function Badge({ tone = 'neutral', size = 'sm', icon, children, className }: BadgeProps) {
  return (
    <span
      className={['lc-badge', `lc-badge--${tone}`, `lc-badge--${size}`, className ?? '']
        .join(' ')
        .trim()}
    >
      {icon ? (
        <span className="lc-badge__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
    </span>
  )
}
