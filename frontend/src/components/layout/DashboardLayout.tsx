import { type ReactNode } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'
import { notificationService } from '@/services/notificationService'
import type { HeaderProps } from '@/components/layout/Header'
import './DashboardLayout.css'

export interface DashboardLayoutProps extends Partial<HeaderProps> {
  children?: ReactNode
}

export function DashboardLayout({ children, ...headerProps }: DashboardLayoutProps) {
  const navigate = useNavigate()

  const unreadQuery = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationService.list({ unread: true, limit: 1 }),
    refetchInterval: 30_000,
  })

  return (
    <div className="lc-app">
      <Header
        {...headerProps}
        notificationCount={unreadQuery.data?.meta.total ?? 0}
        onNotificationsClick={() => navigate('/notifications')}
      />
      <main className="lc-app__main">
        <Container className="lc-dashboard">{children ?? <Outlet />}</Container>
      </main>
      <Footer />
    </div>
  )
}
