import type { CSSProperties } from 'react'
import './Skeleton.css'

export interface SkeletonProps {
  width?: string | number
  height?: string | number
  radius?: string | number
  circle?: boolean
  className?: string
}

export function Skeleton({ width, height, radius, circle = false, className }: SkeletonProps) {
  const style: CSSProperties = {
    width: width ?? '100%',
    height: circle ? undefined : (height ?? '1em'),
    borderRadius: circle ? 'var(--radius-full)' : (radius ?? 'var(--radius-xs)'),
  }
  return (
    <span
      className={['lc-skeleton', className ?? ''].join(' ').trim()}
      style={style}
      aria-hidden="true"
    />
  )
}
