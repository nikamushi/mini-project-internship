import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import './Radio.css'

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, id, className, disabled, ...rest },
  ref,
) {
  if (label === undefined) {
    return (
      <input ref={ref} id={id} type="radio" className={className} disabled={disabled} {...rest} />
    )
  }
  return (
    <label
      className={['lc-radio', disabled ? 'lc-radio--disabled' : '', className ?? '']
        .join(' ')
        .trim()}
      htmlFor={id}
    >
      <input ref={ref} id={id} type="radio" disabled={disabled} {...rest} />
      <span className="lc-radio__label">{label}</span>
    </label>
  )
})
