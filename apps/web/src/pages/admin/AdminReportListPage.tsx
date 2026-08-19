import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Eye } from 'lucide-react'
import { adminService } from '@/services/adminService'
import { categoryService } from '@/services/categoryService'
import { SearchInput } from '@/components/ui/SearchInput'
import { Select } from '@/components/ui/Select'
import { Table, type TableColumn } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { ErrorState } from '@/components/ui/ErrorState'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Badge } from '@/components/ui/Badge'
import { formatDateTime } from '@/utils/format'
import { humanizeStatus, REPORT_STATUSES } from '@/utils/constants'
import type { ReportDetail } from '@/api/types'
import './AdminPages.css'

const TYPE_OPTIONS = [
  { value: 'LOST', label: 'Hilang' },
  { value: 'FOUND', label: 'Ditemukan' },
]

const REPORT_STATUS_OPTIONS = REPORT_STATUSES.map((status) => ({
  value: status,
  label: humanizeStatus(status),
}))

export function AdminReportListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '')

  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1)
  const type = searchParams.get('type') ?? ''
  const status = searchParams.get('status') ?? ''
  const categoryId = searchParams.get('categoryId') ?? ''
  const search = searchParams.get('search') ?? ''

  const updateParam = (key: string, value: string) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      if (value) next.set(key, value)
      else next.delete(key)
      next.delete('page')
      return next
    })
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      updateParam('search', searchInput.trim())
    }, 400)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  const reportsQuery = useQuery({
    queryKey: ['admin', 'reports', { page, type, status, categoryId, search }],
    queryFn: () =>
      adminService.reports({
        page,
        limit: 15,
        type: type || undefined,
        status: status || undefined,
        categoryId: categoryId || undefined,
        q: search || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
    placeholderData: (previous) => previous,
  })

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.list(),
  })

  const columns: TableColumn<ReportDetail>[] = [
    {
      key: 'itemName',
      header: 'Barang',
      render: (row) => (
        <div className="lc-admin-page__table-title">
          <Badge tone={row.type === 'LOST' ? 'danger' : 'success'} size="sm">
            {row.type === 'LOST' ? 'Hilang' : 'Ditemukan'}
          </Badge>
          <Link to={`/admin/reports/${row.id}`} className="lc-admin-page__link">
            {row.itemName}
          </Link>
        </div>
      ),
    },
    {
      key: 'reporter',
      header: 'Pelapor',
      render: (row) => <span className="lc-admin-page__muted">{row.reporter.name}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} kind="report" />,
    },
    {
      key: 'occurredAt',
      header: 'Waktu Kejadian',
      render: (row) => formatDateTime(row.occurredAt),
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (row) => (
        <Link to={`/admin/reports/${row.id}`} className="lc-btn lc-btn--outline lc-btn--sm">
          <Eye size={14} aria-hidden="true" />
          Detail
        </Link>
      ),
    },
  ]

  const rows = reportsQuery.data?.data ?? []
  const meta = reportsQuery.data?.meta

  return (
    <div className="lc-admin-page">
      <section className="lc-admin-page__header">
        <div>
          <h1 className="lc-admin-page__title">Manajemen Laporan</h1>
          <p className="lc-admin-page__subtitle">
            Verifikasi, kelola status, dan pantau seluruh laporan.
          </p>
        </div>
      </section>

      <div className="lc-admin-page__filters">
        <SearchInput
          value={searchInput}
          onChange={setSearchInput}
          placeholder="Cari laporan..."
          aria-label="Cari laporan"
        />
        <Select
          value={type}
          onChange={(event) => updateParam('type', event.target.value)}
          aria-label="Filter tipe"
        >
          <option value="">Semua Tipe</option>
          {TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select
          value={status}
          onChange={(event) => updateParam('status', event.target.value)}
          aria-label="Filter status"
        >
          <option value="">Semua Status</option>
          {REPORT_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select
          value={categoryId}
          onChange={(event) => updateParam('categoryId', event.target.value)}
          aria-label="Filter kategori"
        >
          <option value="">Semua Kategori</option>
          {(categoriesQuery.data ?? []).map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </div>

      {reportsQuery.isError ? (
        <ErrorState title="Gagal memuat laporan" onRetry={() => void reportsQuery.refetch()} />
      ) : (
        <>
          <div className="lc-admin-page__table-wrap">
            <Table
              columns={columns}
              rows={rows}
              rowKey={(row) => row.id}
              loading={reportsQuery.isPending}
              emptyMessage="Tidak ada laporan yang cocok dengan filter."
              aria-label="Daftar laporan admin"
            />
          </div>
          {meta && meta.totalPages > 1 ? (
            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              onChange={(nextPage) => updateParam('page', String(nextPage))}
            />
          ) : null}
        </>
      )}
    </div>
  )
}
