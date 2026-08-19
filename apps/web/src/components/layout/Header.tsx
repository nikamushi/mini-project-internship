import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Bell, LogOut, Menu, Search, User as UserIcon } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { MobileNavigation } from '@/components/layout/MobileNavigation'
import { Avatar } from '@/components/ui/Avatar'
import { Dropdown } from '@/components/ui/Dropdown'
import { userNavItems, type NavItem } from '@/components/layout/navItems'
import { useAuth } from '@/auth/useAuth'
import type { User } from '@/api/types'
import './Header.css'

export interface HeaderProps {
  navItems?: NavItem[]
  user?: User | null
  notificationCount?: number
  onNotificationsClick?: () => void
}

export function Header({
  navItems = userNavItems,
  user: userOverride,
  notificationCount = 0,
  onNotificationsClick,
}: HeaderProps) {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const user = userOverride !== undefined ? userOverride : currentUser

  const handleLogout = async () => {
    setMobileOpen(false)
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="lc-header">
      <Container className="lc-header__inner">
        <Link to="/dashboard" className="lc-header__brand">
          <span className="lc-header__logo" aria-hidden="true">
            <Search size={20} />
          </span>
          <span className="lc-header__brand-text">Kehilangan Kampus</span>
        </Link>

        <nav className="lc-header__nav" aria-label="Navigasi utama">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                ['lc-header__link', isActive ? 'lc-header__link--active' : ''].join(' ').trim()
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="lc-header__actions">
          {onNotificationsClick ? (
            <button
              type="button"
              className="lc-header__icon-btn"
              aria-label={`Notifikasi${notificationCount > 0 ? ` (${notificationCount} belum dibaca)` : ''}`}
              onClick={onNotificationsClick}
            >
              <Bell size={20} aria-hidden="true" />
              {notificationCount > 0 ? (
                <span className="lc-header__badge" aria-hidden="true">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              ) : null}
            </button>
          ) : null}

          {user ? (
            <Dropdown
              label="Menu pengguna"
              trigger={
                <span className="lc-header__user">
                  <Avatar name={user.name} size="sm" />
                  <span className="lc-header__user-name">{user.name}</span>
                </span>
              }
              items={[
                {
                  label: 'Profil',
                  icon: <UserIcon size={16} />,
                  onSelect: () => navigate('/profile'),
                },
                {
                  label: 'Keluar',
                  danger: true,
                  icon: <LogOut size={16} />,
                  onSelect: () => void handleLogout(),
                },
              ]}
            />
          ) : (
            <Link to="/login" className="lc-btn lc-btn--primary lc-btn--sm">
              Masuk
            </Link>
          )}

          <button
            type="button"
            className="lc-header__icon-btn lc-header__menu-btn"
            aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} aria-hidden="true" />
          </button>
        </div>
      </Container>

      <MobileNavigation
        items={navItems}
        user={user}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onLogout={user ? () => void handleLogout() : undefined}
      />
    </header>
  )
}
