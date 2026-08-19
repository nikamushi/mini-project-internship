import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Eye } from 'lucide-react'
import { userService } from '@/services/userService'
import { SearchInput } from '@/components/ui/SearchInput'
import { Select } from '@/components/ui/Select'
import { Table, type TableColumn } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { ErrorState } from '@/components/ui/ErrorState'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { formatDate } from '@/utils/format'
import type { User } from '@/api/types'
import './AdminPages.css'

export function AdminUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '')

  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1)
  const role = searchParams.get('role') ?? ''
  const isActive = searchParams.get('isActive') ?? ''
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

  const usersQuery = useQuery({
    queryKey: ['admin', 'users', { page, role, isActive, search }],
    queryFn: () =>
      userService.list({
        page,
        limit: 15,
        role: role || undefined,
        isActive: isActive === '' ? undefined : isActive === 'true',
        search: search || undefined,
      }),
    placeholderData: (previous) => previous,
  })

  const columns: TableColumn<User>[] = [
    {
      key: 'user',
      header: 'Pengguna',
      render: (row) => (
        <div className="lc-admin-page__user-cell">
          <Avatar name={row.name} size="sm" />
          <div className="lc-admin-page__user-text">
            <Link to={`/admin/users/${row.id}`} className="lc-admin-page__link">
              {row.name}
            </Link>
            <span className="lc-admin-page__muted">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Peran',
      render: (row) => (
        <Badge tone={row.role === 'ADMIN' ? 'primary' : 'neutral'} size="sm">
          {row.role === 'ADMIN' ? 'Administrator' : 'Pengguna'}
        </Badge>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (row) => (
        <Badge tone={row.isActive === false ? 'neutral' : 'success'} size="sm">
          {row.isActive === false ? 'Nonaktif' : 'Aktif'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Terdaftar',
      render: (row) => (row.createdAt ? formatDate(row.createdAt) : '—'),
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (row) => (
        <Link to={`/admin/users/${row.id}`} className="lc-btn lc-btn--outline lc-btn--sm">
          <Eye size={14} aria-hidden="true" />
          Detail
        </Link>
      ),
    },
  ]

  const rows = usersQuery.data?.data ?? []
  const meta = usersQuery.data?.meta

  return (
    <div className="lc-admin-page">
      <section className="lc-admin-page__header">
        <div>
          <h1 className="lc-admin-page__title">Pengguna</h1>
          <p className="lc-admin-page__subtitle">Kelola akun pengguna dan administrator.</p>
        </div>
      </section>

      <div className="lc-admin-page__filters">
        <SearchInput
          value={searchInput}
          onChange={setSearchInput}
          placeholder="Cari nama atau email..."
          aria-label="Cari pengguna"
        />
        <Select
          value={role}
          onChange={(event) => updateParam('role', event.target.value)}
          aria-label="Filter peran"
        >
          <option value="">Semua Peran</option>
          <option value="USER">Pengguna</option>
          <option value="ADMIN">Administrator</option>
        </Select>
        <Select
          value={isActive}
          onChange={(event) => updateParam('isActive', event.target.value)}
          aria-label="Filter status akun"
        >
          <option value="">Semua Status</option>
          <option value="true">Aktif</option>
          <option value="false">Nonaktif</option>
        </Select>
      </div>

      {usersQuery.isError ? (
        <ErrorState title="Gagal memuat pengguna" onRetry={() => void usersQuery.refetch()} />
      ) : (
        <>
          <div className="lc-admin-page__table-wrap">
            <Table
              columns={columns}
              rows={rows}
              rowKey={(row) => row.id}
              loading={usersQuery.isPending}
              emptyMessage="Tidak ada pengguna yang cocok dengan filter."
              aria-label="Daftar pengguna"
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
