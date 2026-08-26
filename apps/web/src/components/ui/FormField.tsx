import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react'
import { FormError } from '@/components/ui/FormError'
import './FormField.css'

export interface FormFieldProps {
  label?: ReactNode
  required?: boolean
  helper?: ReactNode
  error?: string
  htmlFor?: string
  children: ReactNode
  className?: string
}

export function FormField({
  label,
  required = false,
  helper,
  error,
  htmlFor,
  children,
  className,
}: FormFieldProps) {
  const errorId = htmlFor ? `${htmlFor}-error` : undefined
  const helperId = htmlFor ? `${htmlFor}-helper` : undefined

  const content =
    required && children !== null && children !== undefined
      ? Children.map(children, (child) =>
          isValidElement(child)
            ? cloneElement(child as ReactElement<{ 'aria-required'?: boolean }>, {
                'aria-required': true,
              })
            : child,
        )
      : children

  return (
    <div className={['lc-form-field', className ?? ''].join(' ').trim()}>
      {label ? (
        <label className="lc-form-field__label" htmlFor={htmlFor}>
          {label}
          {required ? (
            <span className="lc-form-field__required" aria-hidden="true">
              {' '}
              *
            </span>
          ) : null}
        </label>
      ) : null}
      {content}
      {helper && !error ? (
        <p className="lc-form-field__helper" id={helperId}>
          {helper}
        </p>
      ) : null}
      {error ? <FormError id={errorId}>{error}</FormError> : null}
    </div>
  )
}
