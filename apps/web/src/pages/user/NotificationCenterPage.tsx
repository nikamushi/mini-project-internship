import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BellOff, CheckCheck, Megaphone, PackageSearch, UserCheck } from 'lucide-react'
import { notificationService } from '@/services/notificationService'
import { Tabs, type TabItem } from '@/components/ui/Tabs'
import { Pagination } from '@/components/ui/Pagination'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/useToast'
import { formatDateTime } from '@/utils/format'
import type { Notification } from '@/api/types'
import './NotificationCenterPage.css'

function notificationIcon(type: string): typeof Megaphone {
  if (type.startsWith('CLAIM_')) return UserCheck
  if (type.startsWith('REPORT_')) return PackageSearch
  return Megaphone
}

export function NotificationCenterPage() {
  const toast = useToast()
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1)
  const tab = searchParams.get('tab') ?? 'all'

  const notificationsQuery = useQuery({
    queryKey: ['notifications', { page, tab }],
    queryFn: () =>
      notificationService.list({
        page,
        limit: 10,
        unread: tab === 'unread' ? true : undefined,
      }),
    placeholderData: (previous) => previous,
  })

  const markReadMutation = useMutation({
    mutationFn: (id: number) => notificationService.markRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] })
      toast('Notifikasi ditandai sudah dibaca.', { tone: 'success' })
    },
  })

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] })
      toast('Semua notifikasi ditandai sudah dibaca.', { tone: 'success' })
    },
  })

  const updateParam = (key: string, value: string) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      if (value) next.set(key, value)
      else next.delete(key)
      if (key !== 'page') next.delete('page')
      return next
    })
  }

  const handleOpen = useCallback(
    (notification: Notification) => {
      if (!notification.isRead) {
        markReadMutation.mutate(notification.id)
        return
      }
      toast('Notifikasi ditandai sudah dibaca.', { tone: 'success' })
    },
    [markReadMutation, toast],
  )

  const tabs: TabItem[] = [
    { value: 'all', label: 'Semua' },
    { value: 'unread', label: 'Belum Dibaca' },
  ]

  const notifications = notificationsQuery.data?.data ?? []
  const meta = notificationsQuery.data?.meta
  const unreadCount = meta?.total ?? 0

  return (
    <div className="lc-notifications">
      <div className="lc-notifications__header">
        <h1 className="lc-notifications__title">Notifikasi</h1>
        {tab === 'unread' && unreadCount > 0 ? (
          <Button
            variant="outline"
            size="sm"
            loading={markAllReadMutation.isPending}
            onClick={() => markAllReadMutation.mutate()}
          >
            <CheckCheck size={16} aria-hidden="true" />
            Tandai Semua Dibaca
          </Button>
        ) : null}
      </div>

      <Tabs
        items={tabs}
        value={tab}
        onChange={(value) => updateParam('tab', value)}
        aria-label="Filter notifikasi"
      />

      {notificationsQuery.isError ? (
        <ErrorState
          title="Gagal memuat notifikasi"
          onRetry={() => void notificationsQuery.refetch()}
        />
      ) : notificationsQuery.isPending ? (
        <div className="lc-notifications__list" aria-busy="true">
          <Skeleton height="64px" />
          <Skeleton height="64px" />
          <Skeleton height="64px" />
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={<BellOff size={28} aria-hidden="true" />}
          title="Tidak ada notifikasi"
          description="Notifikasi baru akan muncul di sini."
        />
      ) : (
        <>
          <ul className="lc-notifications__list">
            {notifications.map((notification) => {
              const Icon = notificationIcon(notification.type)
              const unread = !notification.isRead
              const content = (
                <>
                  <span
                    className={`lc-notifications__icon${unread ? ' lc-notifications__icon--unread' : ''}`}
                    aria-hidden="true"
                  >
                    <Icon size={18} />
                  </span>
                  <span className="lc-notifications__body">
                    <span className="lc-notifications__title-line">
                      <span className="lc-notifications__item-title">{notification.title}</span>
                      {unread ? (
                        <span className="lc-notifications__dot" aria-label="Belum dibaca" />
                      ) : null}
                    </span>
                    <span className="lc-notifications__message">{notification.message}</span>
                    <time className="lc-notifications__time" dateTime={notification.createdAt}>
                      {formatDateTime(notification.createdAt)}
                    </time>
                  </span>
                </>
              )
              const className = [
                'lc-notifications__item',
                unread ? 'lc-notifications__item--unread' : '',
              ]
                .join(' ')
                .trim()

              return (
                <li key={notification.id}>
                  <button
                    type="button"
                    className={className}
                    onClick={() => handleOpen(notification)}
                  >
                    {content}
                  </button>
                </li>
              )
            })}
          </ul>
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
