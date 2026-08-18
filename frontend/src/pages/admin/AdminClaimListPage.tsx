import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Eye } from 'lucide-react'
import { adminService } from '@/services/adminService'
import { Select } from '@/components/ui/Select'
import { Table, type TableColumn } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { ErrorState } from '@/components/ui/ErrorState'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatDateTime } from '@/utils/format'
import { CLAIM_STATUSES, humanizeStatus } from '@/utils/constants'
import type { ClaimDetail } from '@/api/types'
import './AdminPages.css'

export function AdminClaimListPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1)
  const status = searchParams.get('status') ?? ''

  const claimsQuery = useQuery({
    queryKey: ['admin', 'claims', { page, status }],
    queryFn: () =>
      adminService.claims({
        page,
        limit: 15,
        status: status || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
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
          <Link to={`/admin/reports/${row.report.id}`} className="lc-admin-page__link">
            {row.report.title}
          </Link>
        ) : (
          <span className="lc-admin-page__muted">Tidak tersedia</span>
        ),
    },
    {
      key: 'claimant',
      header: 'Pengklaim',
      render: (row) =>
        row.claimant ? (
          <span>{row.claimant.name}</span>
        ) : (
          <span className="lc-admin-page__muted">Tidak tersedia</span>
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
        <Link to={`/admin/claims/${row.id}`} className="lc-btn lc-btn--outline lc-btn--sm">
          <Eye size={14} aria-hidden="true" />
          Detail
        </Link>
      ),
    },
  ]

  const rows = claimsQuery.data?.data ?? []
  const meta = claimsQuery.data?.meta

  return (
    <div className="lc-admin-page">
      <section className="lc-admin-page__header">
        <div>
          <h1 className="lc-admin-page__title">Manajemen Klaim</h1>
          <p className="lc-admin-page__subtitle">Tinjau dan putuskan klaim kepemilikan barang.</p>
        </div>
      </section>

      <div className="lc-admin-page__filters">
        <Select
          value={status}
          onChange={(event) => updateParam('status', event.target.value)}
          aria-label="Filter status klaim"
        >
          <option value="">Semua Status</option>
          {CLAIM_STATUSES.map((item) => (
            <option key={item} value={item}>
              {humanizeStatus(item)}
            </option>
          ))}
        </Select>
      </div>

      {claimsQuery.isError ? (
        <ErrorState title="Gagal memuat klaim" onRetry={() => void claimsQuery.refetch()} />
      ) : (
        <>
          <div className="lc-admin-page__table-wrap">
            <Table
              columns={columns}
              rows={rows}
              rowKey={(row) => row.id}
              loading={claimsQuery.isPending}
              emptyMessage="Tidak ada klaim yang cocok dengan filter."
              aria-label="Daftar klaim admin"
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
