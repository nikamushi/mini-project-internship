import { useCallback, useId, type ReactNode } from 'react'
import './Tabs.css'

export interface TabItem {
  value: string
  label: ReactNode
}

export interface TabsProps {
  items: TabItem[]
  value: string
  onChange: (value: string) => void
  'aria-label'?: string
  className?: string
}

export function Tabs({ items, value, onChange, ...rest }: TabsProps) {
  const baseId = useId()
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.value === value),
  )

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
      event.preventDefault()
      const direction = event.key === 'ArrowRight' ? 1 : -1
      const next = (activeIndex + direction + items.length) % items.length
      onChange(items[next].value)
      document.getElementById(`${baseId}-tab-${items[next].value}`)?.focus()
    },
    [activeIndex, baseId, items, onChange],
  )

  return (
    <div
      className={['lc-tabs', rest.className ?? ''].join(' ').trim()}
      role="tablist"
      aria-label={rest['aria-label']}
      onKeyDown={onKeyDown}
    >
      {items.map((item) => {
        const selected = item.value === value
        return (
          <button
            key={item.value}
            id={`${baseId}-tab-${item.value}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`${baseId}-panel-${item.value}`}
            tabIndex={selected ? 0 : -1}
            className={['lc-tabs__tab', selected ? 'lc-tabs__tab--active' : ''].join(' ').trim()}
            onClick={() => onChange(item.value)}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
