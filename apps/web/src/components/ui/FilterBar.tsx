import { type ReactNode } from 'react'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import './FilterBar.css'

export interface FilterBarProps {
  search?: ReactNode
  onReset?: () => void
  hasActiveFilters?: boolean
  resetLabel?: string
  ariaLabel?: string
  resultInfo?: { total: number; label?: string }
  children?: ReactNode
}

export function FilterBar({
  search,
  onReset,
  hasActiveFilters = false,
  resetLabel = 'Reset Filter',
  ariaLabel,
  resultInfo,
  children,
}: FilterBarProps) {
  const showTopRow = Boolean(search) || (Boolean(onReset) && hasActiveFilters)

  return (
    <div className="lc-filter-bar" aria-label={ariaLabel}>
      {showTopRow ? (
        <div className="lc-filter-bar__row-top">
          {search ? <div className="lc-filter-bar__search">{search}</div> : null}
          {onReset && hasActiveFilters ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              icon={<RotateCcw size={14} aria-hidden="true" />}
              onClick={onReset}
            >
              {resetLabel}
            </Button>
          ) : null}
        </div>
      ) : null}
      {children ? <div className="lc-filter-bar__row-filters">{children}</div> : null}
      {resultInfo ? (
        <p className="lc-filter-bar__count" aria-live="polite" aria-atomic="true">
          Ditemukan <strong>{resultInfo.total}</strong> {resultInfo.label ?? 'data'}
        </p>
      ) : null}
    </div>
  )
}