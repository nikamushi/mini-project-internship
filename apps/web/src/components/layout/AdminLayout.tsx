import { useEffect, useState, type ReactNode } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Menu, Search } from 'lucide-react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Container } from '@/components/layout/Container'
import { MobileNavigation } from '@/components/layout/MobileNavigation'
import { Tooltip } from '@/components/ui/Tooltip'
import { adminNavItems, type NavItem } from '@/components/layout/navItems'
import { useAuth } from '@/auth/useAuth'
import type { SidebarProps } from '@/components/layout/Sidebar'
import type { User } from '@/api/types'
import './AdminLayout.css'

export interface AdminLayoutProps extends Partial<SidebarProps> {
  children?: ReactNode
  navItems?: NavItem[]
  user?: User | null
}

export function AdminLayout({
  children,
  navItems = adminNavItems,
  user: userOverride,
  ...sidebarProps
}: AdminLayoutProps) {
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

  const handleLogout = async () => {
    setMobileOpen(false)
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="lc-admin">
      <a href="#main-content" className="lc-skip-link">
        Lewati ke konten utama
      </a>
      <div className="lc-admin__mobile-bar">
        <span className="lc-admin__mobile-logo" aria-hidden="true">
          <Search size={20} />
        </span>
        <span className="lc-admin__mobile-title">Kehilangan Kampus</span>
        <Tooltip label="Menu">
          <button
            type="button"
            className="lc-admin__menu-btn"
            aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} aria-hidden="true" />
          </button>
        </Tooltip>
      </div>

      <Sidebar
        items={navItems}
        user={user}
        onLogout={() => void handleLogout()}
        roleLabel="Administrator"
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((value) => !value)}
        {...sidebarProps}
      />

      <main id="main-content" tabIndex={-1} className="lc-admin__main">
        <Container className="lc-admin__content">{children ?? <Outlet />}</Container>
      </main>

      <MobileNavigation
        items={navItems}
        user={user}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onLogout={user ? () => void handleLogout() : undefined}
      />
    </div>
  )
}
