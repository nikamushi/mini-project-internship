import { type HTMLAttributes } from 'react'
import './Container.css'

export function Container({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={['lc-container', className ?? ''].join(' ').trim()} {...rest}>
      {children}
    </div>
  )
}
