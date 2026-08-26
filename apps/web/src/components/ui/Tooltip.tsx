import type { ReactNode } from 'react'
import './Tooltip.css'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  label: string
  placement?: TooltipPlacement
  children: ReactNode
  className?: string
}

export function Tooltip({ label, placement = 'top', children, className }: TooltipProps) {
  return (
    <span
      className={['lc-tooltip', `lc-tooltip--${placement}`, className ?? ''].join(' ').trim()}
      data-tooltip={label}
    >
      {children}
    </span>
  )
}
