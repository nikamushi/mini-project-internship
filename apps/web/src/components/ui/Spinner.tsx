import './Spinner.css'

export type SpinnerSize = 'sm' | 'md' | 'lg'

export interface SpinnerProps {
  size?: SpinnerSize
  label?: string
  className?: string
}

export function Spinner({ size = 'md', label = 'Memuat...', className }: SpinnerProps) {
  const classes = ['lc-spinner', `lc-spinner--${size}`, className ?? ''].join(' ').trim()
  return (
    <span className={classes} role="status">
      <span className="lc-spinner__ring" aria-hidden="true" />
      <span className="visually-hidden">{label}</span>
    </span>
  )
}
