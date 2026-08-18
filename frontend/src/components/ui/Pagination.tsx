import { ChevronLeft, ChevronRight } from 'lucide-react'
import './Pagination.css'

export interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
  className?: string
}

function pageList(
  page: number,
  totalPages: number,
): (number | 'ellipsis-start' | 'ellipsis-end')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }
  const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [1]
  if (page > 4) pages.push('ellipsis-start')
  const start = Math.max(2, page - 1)
  const end = Math.min(totalPages - 1, page + 1)
  for (let i = start; i <= end; i += 1) pages.push(i)
  if (page < totalPages - 3) pages.push('ellipsis-end')
  pages.push(totalPages)
  return pages
}

export function Pagination({ page, totalPages, onChange, className }: PaginationProps) {
  if (totalPages <= 1) return null
  const pages = pageList(page, totalPages)
  const prevDisabled = page <= 1
  const nextDisabled = page >= totalPages

  return (
    <nav className={['lc-pagination', className ?? ''].join(' ').trim()} aria-label="Paginasi">
      <button
        type="button"
        className="lc-pagination__btn"
        disabled={prevDisabled}
        aria-label="Halaman sebelumnya"
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeft size={16} aria-hidden="true" />
        <span className="lc-pagination__btn-label">Sebelumnya</span>
      </button>

      <ol className="lc-pagination__pages">
        {pages.map((item) =>
          item === 'ellipsis-start' || item === 'ellipsis-end' ? (
            <li key={item} className="lc-pagination__ellipsis" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                className={[
                  'lc-pagination__page',
                  item === page ? 'lc-pagination__page--active' : '',
                ]
                  .join(' ')
                  .trim()}
                aria-current={item === page ? 'page' : undefined}
                aria-label={`Halaman ${item}`}
                onClick={() => onChange(item)}
              >
                {item}
              </button>
            </li>
          ),
        )}
      </ol>

      <button
        type="button"
        className="lc-pagination__btn"
        disabled={nextDisabled}
        aria-label="Halaman berikutnya"
        onClick={() => onChange(page + 1)}
      >
        <span className="lc-pagination__btn-label">Berikutnya</span>
        <ChevronRight size={16} aria-hidden="true" />
      </button>

      <span className="lc-pagination__mobile" aria-hidden="true">
        Halaman {page} dari {totalPages}
      </span>
    </nav>
  )
}
