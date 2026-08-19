import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { activityLogService } from '@/services/activityLogService'
import { Select } from '@/components/ui/Select'
import { Table, type TableColumn } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { ErrorState } from '@/components/ui/ErrorState'
import { Badge } from '@/components/ui/Badge'
import { formatDateTime } from '@/utils/format'
import type { ActivityLog } from '@/api/types'
import './AdminPages.css'

const ENTITY_TYPES = ['USER', 'REPORT', 'CLAIM', 'CATEGORY', 'SYSTEM']

export function AdminActivityLogsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1)
  const entityType = searchParams.get('entityType') ?? ''

  const logsQuery = useQuery({
    queryKey: ['admin', 'activity-logs', { page, entityType }],
    queryFn: () =>
      activityLogService.list({
        page,
        limit: 15,
        entityType: entityType || undefined,
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

  const columns: TableColumn<ActivityLog>[] = [
    {
      key: 'actor',
      header: 'Aktor',
      render: (row) => (
        <span>
          {row.actor.name} <span className="lc-admin-page__muted">({row.actor.id})</span>
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Aksi',
      render: (row) => (
        <Badge tone="neutral" size="sm">
          {row.action.replaceAll('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'entityType',
      header: 'Entitas',
      render: (row) => <span className="lc-admin-page__muted">{row.entityType}</span>,
    },
    {
      key: 'entityId',
      header: 'ID Entitas',
      render: (row) =>
        row.entityType === 'REPORT' || row.entityType === 'CLAIM' ? (
          <Link
            to={`/admin/${row.entityType.toLowerCase()}s/${row.entityId}`}
            className="lc-admin-page__link"
          >
            {row.entityId}
          </Link>
        ) : (
          <span className="lc-admin-page__muted">{row.entityId}</span>
        ),
    },
    {
      key: 'createdAt',
      header: 'Waktu',
      render: (row) => formatDateTime(row.createdAt),
    },
  ]

  const rows = logsQuery.data?.data ?? []
  const meta = logsQuery.data?.meta

  return (
    <div className="lc-admin-page">
      <section className="lc-admin-page__header">
        <div>
          <h1 className="lc-admin-page__title">Log Aktivitas</h1>
          <p className="lc-admin-page__subtitle">Riwayat perubahan sistem secara read-only.</p>
        </div>
      </section>

      <div className="lc-admin-page__filters">
        <Select
          value={entityType}
          onChange={(event) => updateParam('entityType', event.target.value)}
          aria-label="Filter entitas"
        >
          <option value="">Semua Entitas</option>
          {ENTITY_TYPES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </div>

      {logsQuery.isError ? (
        <ErrorState title="Gagal memuat log aktivitas" onRetry={() => void logsQuery.refetch()} />
      ) : (
        <>
          <div className="lc-admin-page__table-wrap">
            <Table
              columns={columns}
              rows={rows}
              rowKey={(row) => row.id}
              loading={logsQuery.isPending}
              emptyMessage="Belum ada aktivitas yang tercatat."
              aria-label="Log aktivitas"
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
