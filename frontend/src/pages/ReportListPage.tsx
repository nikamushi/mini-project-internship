import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowDownWideNarrow, ArrowUpWideNarrow, PlusCircle } from 'lucide-react'
import { SearchInput } from '@/components/ui/SearchInput'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { ReportCard } from '@/components/report/ReportCard'
import { categoryService } from '@/services/categoryService'
import { reportService } from '@/services/reportService'
import type { ReportStatus } from '@/api/types'
import './ReportListPage.css'

const REPORT_STATUSES: ReportStatus[] = ['ACTIVE', 'FOUND', 'CLAIMED', 'COMPLETED']

export function ReportListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('q') ?? '')

  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1)
  const q = searchParams.get('q') ?? ''
  const type = searchParams.get('type') ?? ''
  const categoryId = searchParams.get('category') ?? ''
  const status = searchParams.get('status') ?? ''
  const location = searchParams.get('location') ?? ''
  const sortOrder = searchParams.get('sort') === 'asc' ? 'asc' : 'desc'

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current)
          if (debouncedSearch) {
            next.set('q', debouncedSearch)
          } else {
            next.delete('q')
          }
          next.delete('page')
          return next
        },
        { replace: true },
      )
    }, 400)
    return () => window.clearTimeout(timer)
  }, [debouncedSearch, setSearchParams])

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.list(),
  })

  const reportsQuery = useQuery({
    queryKey: ['reports', { page, q, type, categoryId, status, location, sortOrder }],
    queryFn: () =>
      reportService.list({
        page,
        limit: 12,
        search: q || undefined,
        type: type || undefined,
        categoryId: categoryId || undefined,
        status: status || undefined,
        location: location || undefined,
        sortBy: 'createdAt',
        sortOrder,
      }),
    placeholderData: (previous) => previous,
  })

  const updateParam = (key: string, value: string) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      if (value) {
        next.set(key, value)
      } else {
        next.delete(key)
      }
      next.delete('page')
      return next
    })
  }

  const reports = reportsQuery.data?.data ?? []
  const meta = reportsQuery.data?.meta

  return (
    <div className="lc-report-list">
      <div className="lc-report-list__header">
        <div>
          <h1 className="lc-report-list__title">Laporan</h1>
          <p className="lc-report-list__subtitle">Cari barang hilang atau ditemukan di kampus.</p>
        </div>
        <Link to="/reports/create" className="lc-btn lc-btn--primary">
          <PlusCircle size={18} aria-hidden="true" />
          Buat Laporan
        </Link>
      </div>

      <div className="lc-report-list__filters" aria-label="Filter laporan">
        <SearchInput
          value={debouncedSearch}
          onChange={setDebouncedSearch}
          placeholder="Cari nama barang, deskripsi, lokasi..."
          aria-label="Cari laporan"
        />
        <Select
          value={type}
          onChange={(event) => updateParam('type', event.target.value)}
          aria-label="Tipe laporan"
          className="lc-report-list__filter"
        >
          <option value="">Semua Tipe</option>
          <option value="LOST">Hilang</option>
          <option value="FOUND">Ditemukan</option>
        </Select>
        <Select
          value={categoryId}
          onChange={(event) => updateParam('category', event.target.value)}
          aria-label="Kategori"
          className="lc-report-list__filter"
        >
          <option value="">Semua Kategori</option>
          {(categoriesQuery.data ?? []).map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        <Select
          value={status}
          onChange={(event) => updateParam('status', event.target.value)}
          aria-label="Status"
          className="lc-report-list__filter"
        >
          <option value="">Semua Status</option>
          {REPORT_STATUSES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <Input
          value={location}
          onChange={(event) => updateParam('location', event.target.value)}
          placeholder="Lokasi..."
          aria-label="Lokasi"
          className="lc-report-list__filter"
        />
        <Button
          variant="outline"
          icon={
            sortOrder === 'desc' ? (
              <ArrowDownWideNarrow size={18} />
            ) : (
              <ArrowUpWideNarrow size={18} />
            )
          }
          onClick={() => updateParam('sort', sortOrder === 'desc' ? 'asc' : 'desc')}
        >
          {sortOrder === 'desc' ? 'Terbaru' : 'Terlama'}
        </Button>
      </div>

      {reportsQuery.isError ? (
        <ErrorState title="Gagal memuat laporan" onRetry={() => void reportsQuery.refetch()} />
      ) : reportsQuery.isPending && reports.length === 0 ? (
        <div className="lc-report-list__grid" aria-busy="true">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} height="240px" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <EmptyState
          title="Tidak ada laporan"
          description="Coba ubah kata kunci atau filter pencarian Anda."
        />
      ) : (
        <div className="lc-report-list__grid">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 ? (
        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          onChange={(nextPage) => updateParam('page', String(nextPage))}
        />
      ) : null}
    </div>
  )
}
