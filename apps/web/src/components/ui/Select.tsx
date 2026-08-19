import { forwardRef, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import './Select.css'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { invalid, className, children, ...rest },
  ref,
) {
  const classes = ['lc-select', invalid ? 'lc-select--error' : '', className ?? ''].join(' ').trim()
  return (
    <span className="lc-select__wrapper">
      <select ref={ref} className={classes} aria-invalid={invalid || undefined} {...rest}>
        {children}
      </select>
      <ChevronDown className="lc-select__chevron" size={16} aria-hidden="true" />
    </span>
  )
})
