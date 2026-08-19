import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import './Checkbox.css'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, id, className, disabled, ...rest },
  ref,
) {
  if (label === undefined) {
    return (
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className={className}
        disabled={disabled}
        {...rest}
      />
    )
  }
  return (
    <label
      className={['lc-checkbox', disabled ? 'lc-checkbox--disabled' : '', className ?? '']
        .join(' ')
        .trim()}
      htmlFor={id}
    >
      <input ref={ref} id={id} type="checkbox" disabled={disabled} {...rest} />
      <span className="lc-checkbox__label">{label}</span>
    </label>
  )
})
