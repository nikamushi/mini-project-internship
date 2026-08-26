import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Tooltip } from '@/components/ui/Tooltip'
import './PasswordInput.css'

export type PasswordInputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ invalid, className, disabled, ...rest }, ref) {
    const [visible, setVisible] = useState(false)
    return (
      <div className={['lc-password', className ?? ''].join(' ').trim()}>
        <Input
          ref={ref}
          type={visible ? 'text' : 'password'}
          invalid={invalid}
          disabled={disabled}
          {...rest}
        />
        <Tooltip label={visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}>
          <button
            type="button"
            className="lc-password__toggle"
            aria-label={visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
            aria-pressed={visible}
            disabled={disabled}
            onClick={() => setVisible((current) => !current)}
          >
            {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
          </button>
        </Tooltip>
      </div>
    )
  },
)
