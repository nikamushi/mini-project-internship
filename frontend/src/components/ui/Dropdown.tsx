import { useEffect, useRef, useState, type ReactNode } from 'react'
import './Dropdown.css'

export interface DropdownItem {
  label: ReactNode
  onSelect?: () => void
  danger?: boolean
  disabled?: boolean
  icon?: ReactNode
}

export interface DropdownProps {
  trigger: ReactNode
  items: DropdownItem[]
  align?: 'start' | 'end'
  label: string
  className?: string
}

export function Dropdown({ trigger, items, align = 'end', label, className }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return undefined
    const handlePointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className={['lc-dropdown', className ?? ''].join(' ').trim()}>
      <button
        type="button"
        className="lc-dropdown__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {trigger}
      </button>
      {open ? (
        <ul
          className={`lc-dropdown__menu lc-dropdown__menu--${align}`}
          role="menu"
          aria-label={label}
        >
          {items.map((item, index) => (
            <li key={index}>
              <button
                type="button"
                role="menuitem"
                className={['lc-dropdown__item', item.danger ? 'lc-dropdown__item--danger' : '']
                  .join(' ')
                  .trim()}
                disabled={item.disabled}
                onClick={() => {
                  setOpen(false)
                  item.onSelect?.()
                }}
              >
                {item.icon ? (
                  <span className="lc-dropdown__icon" aria-hidden="true">
                    {item.icon}
                  </span>
                ) : null}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
