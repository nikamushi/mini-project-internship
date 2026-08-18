import { forwardRef, type TextareaHTMLAttributes } from 'react'
import './Textarea.css'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, className, ...rest },
  ref,
) {
  const classes = ['lc-textarea', invalid ? 'lc-textarea--error' : '', className ?? '']
    .join(' ')
    .trim()
  return <textarea ref={ref} className={classes} aria-invalid={invalid || undefined} {...rest} />
})
