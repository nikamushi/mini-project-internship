import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Eye } from 'lucide-react'
import { claimService } from '@/services/claimService'
import { Tabs, type TabItem } from '@/components/ui/Tabs'
import { Table, type TableColumn } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { ErrorState } from '@/components/ui/ErrorState'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatDateTime } from '@/utils/format'
import type { ClaimDetail } from '@/api/types'
import './MyClaimsPage.css'

const CLAIM_TABS: TabItem[] = [
  { value: 'all', label: 'Semua' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Disetujui' },
  { value: 'REJECTED', label: 'Ditolak' },
  { value: 'CANCELLED', label: 'Dibatalkan' },
]

export function MyClaimsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1)
  const status = searchParams.get('status') ?? ''

  const claimsQuery = useQuery({
    queryKey: ['my-claims', { page, status }],
    queryFn: () =>
      claimService.listMy({
        page,
        limit: 10,
        status: status || undefined,
      }),
    placeholderData: (previous) => previous,
  })

  const updateParam = (key: string, value: string) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      if (value) next.set(key, value)
      else next.delete(key)
      next.delete('page')
      return next
    })
  }

  const columns: TableColumn<ClaimDetail>[] = [
    {
      key: 'report',
      header: 'Laporan',
      render: (row) =>
        row.report ? (
          <Link to={`/reports/${row.report.id}`} className="lc-my-claims__title">
            {row.report.title}
          </Link>
        ) : (
          <span className="lc-my-claims__title lc-my-claims__title--muted">Tidak tersedia</span>
        ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} kind="claim" />,
    },
    {
      key: 'createdAt',
      header: 'Diajukan',
      render: (row) => formatDateTime(row.createdAt),
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (row) => (
        <Link to={`/my-claims/${row.id}`} className="lc-btn lc-btn--outline lc-btn--sm">
          <Eye size={14} aria-hidden="true" />
          Detail
        </Link>
      ),
    },
  ]

  const rows = claimsQuery.data?.data ?? []
  const meta = claimsQuery.data?.meta

  return (
    <div className="lc-my-claims">
      <div className="lc-my-claims__header">
        <h1 className="lc-my-claims__title">Klaim Saya</h1>
      </div>

      <Tabs
        items={CLAIM_TABS}
        value={status || 'all'}
        onChange={(value) => updateParam('status', value === 'all' ? '' : value)}
        aria-label="Filter status klaim"
      />

      {claimsQuery.isError ? (
        <ErrorState title="Gagal memuat klaim" onRetry={() => void claimsQuery.refetch()} />
      ) : (
        <>
          <Table
            columns={columns}
            rows={rows}
            rowKey={(row) => row.id}
            loading={claimsQuery.isPending}
            emptyMessage="Belum ada klaim pada status ini."
            aria-label="Klaim saya"
          />
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
