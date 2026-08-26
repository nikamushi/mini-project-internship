import { forwardRef } from 'react'
import { Search, X } from 'lucide-react'
import { Input, type InputProps } from '@/components/ui/Input'
import { Tooltip } from '@/components/ui/Tooltip'
import './SearchInput.css'

export interface SearchInputProps extends Omit<
  InputProps,
  'type' | 'className' | 'value' | 'onChange'
> {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  loading?: boolean
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  {
    value,
    onChange,
    onClear,
    loading,
    disabled,
    placeholder,
    invalid,
    'aria-label': ariaLabel,
    ...rest
  },
  ref,
) {
  return (
    <div className="lc-search">
      <Search className="lc-search__icon" size={16} aria-hidden="true" />
      <Input
        ref={ref}
        type="search"
        className="lc-search__input"
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        invalid={invalid}
        aria-label={ariaLabel ?? 'Cari'}
        onChange={(event) => onChange(event.target.value)}
        {...rest}
      />
      {loading ? <span className="lc-search__loader" aria-hidden="true" /> : null}
      {value && !disabled ? (
        <Tooltip label="Hapus pencarian">
          <button
            type="button"
            className="lc-search__clear"
            aria-label="Hapus pencarian"
            onClick={() => {
              onChange('')
              onClear?.()
            }}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </Tooltip>
      ) : null}
    </div>
  )
})
