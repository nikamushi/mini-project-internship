import { useEffect, useState, type ReactNode } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Menu, Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Sidebar } from '@/components/layout/Sidebar'
import { Container } from '@/components/layout/Container'
import { MobileNavigation } from '@/components/layout/MobileNavigation'
import { Tooltip } from '@/components/ui/Tooltip'
import { userNavItems, type NavItem } from '@/components/layout/navItems'
import { notificationService } from '@/services/notificationService'
import { useAuth } from '@/auth/useAuth'
import type { SidebarProps } from '@/components/layout/Sidebar'
import type { User } from '@/api/types'
import './DashboardLayout.css'

export interface DashboardLayoutProps extends Partial<SidebarProps> {
  children?: ReactNode
  navItems?: NavItem[]
  user?: User | null
}

export function DashboardLayout({
  children,
  navItems = userNavItems,
  user: userOverride,
  ...sidebarProps
}: DashboardLayoutProps) {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('sidebar-collapsed') === 'true',
  )

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(collapsed))
  }, [collapsed])

  const user = userOverride !== undefined ? userOverride : currentUser

  const unreadQuery = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationService.list({ unread: true, limit: 1 }),
    refetchInterval: 30_000,
  })

  const unreadCount = unreadQuery.data?.meta.total ?? 0
  const navItemsWithBadge = navItems.map((item) =>
    item.to === '/notifications' ? { ...item, badge: unreadCount } : item,
  )

  const handleLogout = async () => {
    setMobileOpen(false)
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="lc-app-dashboard">
      <a href="#main-content" className="lc-skip-link">
        Lewati ke konten utama
      </a>
      <div className="lc-app-dashboard__mobile-bar">
        <span className="lc-app-dashboard__mobile-logo" aria-hidden="true">
          <Search size={20} />
        </span>
        <span className="lc-app-dashboard__mobile-title">Kehilangan Kampus</span>
        <Tooltip label="Menu">
          <button
            type="button"
            className="lc-app-dashboard__menu-btn"
            aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} aria-hidden="true" />
          </button>
        </Tooltip>
      </div>

      <Sidebar
        items={navItemsWithBadge}
        user={user}
        onLogout={() => void handleLogout()}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((value) => !value)}
        {...sidebarProps}
      />

      <main id="main-content" tabIndex={-1} className="lc-app-dashboard__main">
        <Container className="lc-app-dashboard__content">{children ?? <Outlet />}</Container>
      </main>

      <MobileNavigation
        items={navItemsWithBadge}
        user={user}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onLogout={user ? () => void handleLogout() : undefined}
      />
    </div>
  )
}