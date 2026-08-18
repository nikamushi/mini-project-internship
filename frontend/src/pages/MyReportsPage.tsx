import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Pencil } from 'lucide-react'
import { useAuth } from '@/auth/useAuth'
import { reportService } from '@/services/reportService'
import { Tabs, type TabItem } from '@/components/ui/Tabs'
import { Table, type TableColumn } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { Select } from '@/components/ui/Select'
import { ErrorState } from '@/components/ui/ErrorState'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Badge } from '@/components/ui/Badge'
import { formatDateTime } from '@/utils/format'
import type { ReportStatus, ReportSummary } from '@/api/types'
import './MyReportsPage.css'

const MY_REPORT_STATUSES: ReportStatus[] = [
  'PENDING_VERIFICATION',
  'ACTIVE',
  'FOUND',
  'CLAIMED',
  'COMPLETED',
  'REJECTED',
  'CANCELLED',
]

const TYPE_LABEL: Record<ReportSummary['type'], string> = {
  LOST: 'Hilang',
  FOUND: 'Ditemukan',
}

export function MyReportsPage() {
  const { currentUser } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1)
  const tab = searchParams.get('tab') ?? 'all'
  const status = searchParams.get('status') ?? ''

  const reportsQuery = useQuery({
    queryKey: ['my-reports', { page, tab, status }],
    queryFn: () =>
      reportService.list({
        page,
        limit: 10,
        reporterId: currentUser?.id,
        type: tab === 'all' ? undefined : (tab.toUpperCase() as 'LOST' | 'FOUND'),
        status: status || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
    enabled: Boolean(currentUser),
    placeholderData: (previous) => previous,
  })

  const tabs: TabItem[] = [
    { value: 'all', label: 'Semua' },
    { value: 'lost', label: 'Hilang' },
    { value: 'found', label: 'Ditemukan' },
  ]

  const updateParam = (key: string, value: string) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      if (value) next.set(key, value)
      else next.delete(key)
      next.delete('page')
      return next
    })
  }

  const columns: TableColumn<ReportSummary>[] = [
    {
      key: 'title',
      header: 'Barang',
      render: (row) => (
        <div className="lc-my-reports__title-cell">
          <Badge tone={row.type === 'LOST' ? 'danger' : 'success'} size="sm">
            {TYPE_LABEL[row.type]}
          </Badge>
          <Link to={`/reports/${row.id}`} className="lc-my-reports__title">
            {row.title}
          </Link>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} kind="report" />,
    },
    {
      key: 'eventAt',
      header: 'Waktu Kejadian',
      render: (row) => formatDateTime(row.eventAt),
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (row) => (
        <Link to={`/reports/${row.id}/edit`} className="lc-btn lc-btn--outline lc-btn--sm">
          <Pencil size={14} aria-hidden="true" />
          Edit
        </Link>
      ),
    },
  ]

  const rows = reportsQuery.data?.data ?? []
  const meta = reportsQuery.data?.meta

  return (
    <div className="lc-my-reports">
      <div className="lc-my-reports__header">
        <h1 className="lc-my-reports__title">Laporan Saya</h1>
        <Select
          value={status}
          onChange={(event) => updateParam('status', event.target.value)}
          aria-label="Filter status"
          className="lc-my-reports__status-filter"
        >
          <option value="">Semua Status</option>
          {MY_REPORT_STATUSES.map((item) => (
            <option key={item} value={item}>
              {item
                .replaceAll('_', ' ')
                .toLowerCase()
                .replace(/^\w/, (c) => c.toUpperCase())}
            </option>
          ))}
        </Select>
      </div>

      <Tabs
        items={tabs}
        value={tab}
        onChange={(value) => updateParam('tab', value)}
        aria-label="Filter tipe laporan"
      />

      {reportsQuery.isError ? (
        <ErrorState title="Gagal memuat laporan" onRetry={() => void reportsQuery.refetch()} />
      ) : (
        <>
          <Table
            columns={columns}
            rows={rows}
            rowKey={(row) => row.id}
            loading={reportsQuery.isPending}
            emptyMessage="Belum ada laporan pada kategori ini."
            aria-label="Laporan saya"
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
