import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Spinner } from '@/components/ui/Spinner'
import './Button.css'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  icon?: ReactNode
  loadingLabel?: string
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    icon,
    loadingLabel = 'Memuat...',
    disabled,
    className,
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  const classes = [
    'lc-btn',
    `lc-btn--${variant}`,
    `lc-btn--${size}`,
    fullWidth ? 'lc-btn--full' : '',
    className ?? '',
  ]
    .join(' ')
    .trim()

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-disabled={disabled || loading || undefined}
      {...rest}
    >
      {loading ? (
        <>
          <Spinner size="sm" aria-hidden="true" />
          <span>{loadingLabel}</span>
        </>
      ) : (
        <>
          {icon ? (
            <span className="lc-btn__icon" aria-hidden="true">
              {icon}
            </span>
          ) : null}
          {children}
        </>
      )}
    </button>
  )
})
