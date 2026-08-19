import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/userService'
import { useAuth } from '@/auth/useAuth'
import { useToast } from '@/components/ui/useToast'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { useState } from 'react'
import { formatDate } from '@/utils/format'
import './AdminPages.css'

export function AdminUserDetailPage() {
  const { id = '' } = useParams()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { currentUser } = useAuth()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const userQuery = useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: () => userService.detail(id),
    enabled: id.length > 0,
  })

  const statusMutation = useMutation({
    mutationFn: (isActive: boolean) => userService.updateStatus(id, isActive),
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast(
        updated.isActive === false ? 'Akun pengguna dinonaktifkan.' : 'Akun pengguna diaktifkan.',
        {
          tone: 'success',
        },
      )
      setConfirmOpen(false)
    },
  })

  if (userQuery.isPending) {
    return (
      <div className="lc-admin-page" aria-busy="true">
        <Skeleton height="48px" width="40%" />
        <Skeleton height="300px" />
      </div>
    )
  }

  if (userQuery.isError || !userQuery.data) {
    return <ErrorState title="Gagal memuat pengguna" onRetry={() => void userQuery.refetch()} />
  }

  const user = userQuery.data
  const isSelf = currentUser?.id === user.id

  return (
    <div className="lc-admin-page">
      <section className="lc-admin-page__header">
        <div>
          <h1 className="lc-admin-page__title">Detail Pengguna</h1>
          <p className="lc-admin-page__subtitle">
            <Link to="/admin/users" className="lc-admin-page__link">
              Kembali ke daftar
            </Link>
          </p>
        </div>
      </section>

      <section className="lc-admin-page__section">
        <div className="lc-admin-page__user-detail-header">
          <Avatar name={user.name} size="lg" />
          <div>
            <p className="lc-admin-page__user-detail-name">{user.name}</p>
            <p className="lc-admin-page__muted">{user.email}</p>
          </div>
        </div>

        <dl className="lc-admin-page__detail-list">
          <div className="lc-admin-page__detail-item">
            <dt>ID</dt>
            <dd>{user.id}</dd>
          </div>
          <div className="lc-admin-page__detail-item">
            <dt>Peran</dt>
            <dd>
              <Badge tone={user.role === 'ADMIN' ? 'primary' : 'neutral'}>
                {user.role === 'ADMIN' ? 'Administrator' : 'Pengguna'}
              </Badge>
            </dd>
          </div>
          <div className="lc-admin-page__detail-item">
            <dt>Status Akun</dt>
            <dd>
              <Badge tone={user.isActive === false ? 'neutral' : 'success'}>
                {user.isActive === false ? 'Nonaktif' : 'Aktif'}
              </Badge>
            </dd>
          </div>
          <div className="lc-admin-page__detail-item">
            <dt>Terdaftar</dt>
            <dd>{user.createdAt ? formatDate(user.createdAt) : '—'}</dd>
          </div>
        </dl>
      </section>

      {!isSelf ? (
        <section className="lc-admin-page__section">
          <h2 className="lc-admin-page__section-title">Aksi</h2>
          <Button
            variant={user.isActive === false ? 'primary' : 'danger'}
            onClick={() => setConfirmOpen(true)}
          >
            {user.isActive === false ? 'Aktifkan Akun' : 'Nonaktifkan Akun'}
          </Button>
        </section>
      ) : (
        <p className="lc-admin-page__muted">Anda tidak dapat menonaktifkan akun Anda sendiri.</p>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title={user.isActive === false ? 'Aktifkan akun ini?' : 'Nonaktifkan akun ini?'}
        message={
          user.isActive === false
            ? 'Pengguna dapat kembali masuk setelah akun diaktifkan.'
            : 'Pengguna nonaktif tidak dapat masuk ke aplikasi.'
        }
        confirmLabel={user.isActive === false ? 'Ya, Aktifkan' : 'Ya, Nonaktifkan'}
        cancelLabel="Batal"
        tone={user.isActive === false ? 'primary' : 'danger'}
        loading={statusMutation.isPending}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => statusMutation.mutate(user.isActive === false)}
      />
    </div>
  )
}
