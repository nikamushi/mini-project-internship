import { forwardRef, type InputHTMLAttributes } from 'react'
import './DateInput.css'

export interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(function DateInput(
  { invalid, className, ...rest },
  ref,
) {
  const classes = ['lc-date', invalid ? 'lc-date--error' : '', className ?? ''].join(' ').trim()
  return (
    <input
      ref={ref}
      type="date"
      className={classes}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  )
})
