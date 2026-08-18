import { type HTMLAttributes, type ReactNode } from 'react'
import './Card.css'

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode
  action?: ReactNode
}

export function Card({ title, action, className, children, ...rest }: CardProps) {
  return (
    <div className={['lc-card', className ?? ''].join(' ').trim()} {...rest}>
      {title ? (
        <div className="lc-card__header">
          <h3 className="lc-card__title">{title}</h3>
          {action ? <div className="lc-card__action">{action}</div> : null}
        </div>
      ) : null}
      {children}
    </div>
  )
}
