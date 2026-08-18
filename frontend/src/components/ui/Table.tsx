import { type ReactNode } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Skeleton } from '@/components/ui/Skeleton'
import type { SortOrder } from '@/api/types'
import './Table.css'

export interface TableColumn<T> {
  key: string
  header: ReactNode
  sortable?: boolean
  align?: 'left' | 'right' | 'center'
  render?: (row: T) => ReactNode
}

export interface TableProps<T> {
  columns: TableColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string
  sort?: { sortBy?: string; sortOrder?: SortOrder }
  onSort?: (sortBy: string) => void
  loading?: boolean
  emptyMessage?: string
  'aria-label'?: string
}

export function Table<T>({
  columns,
  rows,
  rowKey,
  sort,
  onSort,
  loading = false,
  emptyMessage = 'Tidak ada data.',
  ...rest
}: TableProps<T>) {
  const renderCell = (row: T, column: TableColumn<T>) =>
    column.render ? column.render(row) : String((row as Record<string, unknown>)[column.key] ?? '')

  return (
    <div className="lc-table">
      <table aria-label={rest['aria-label']} aria-busy={loading || undefined}>
        <thead>
          <tr>
            {columns.map((column) => {
              const active = sort?.sortBy === column.key
              const SortIcon = active && sort?.sortOrder === 'asc' ? ChevronUp : ChevronDown
              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={
                    active ? (sort?.sortOrder === 'asc' ? 'ascending' : 'descending') : undefined
                  }
                  className={
                    [
                      column.align ? `lc-table__align--${column.align}` : '',
                      column.sortable ? 'lc-table__sortable' : '',
                    ]
                      .join(' ')
                      .trim() || undefined
                  }
                >
                  {column.sortable && onSort ? (
                    <button
                      type="button"
                      className="lc-table__sort-btn"
                      onClick={() => onSort(column.key)}
                      aria-label={`Urutkan berdasarkan ${String(column.header)}`}
                    >
                      <span>{column.header}</span>
                      {active ? <SortIcon size={14} aria-hidden="true" /> : null}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 3 }, (_, rowIndex) => (
              <tr key={`skeleton-${rowIndex}`}>
                {columns.map((column) => (
                  <td key={column.key}>
                    <Skeleton height="1em" />
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="lc-table__empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={column.align ? `lc-table__align--${column.align}` : undefined}
                  >
                    {renderCell(row, column)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
