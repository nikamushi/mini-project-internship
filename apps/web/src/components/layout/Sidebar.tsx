import { NavLink } from 'react-router-dom'
import { LogOut, Moon, Search, Sun } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Tooltip } from '@/components/ui/Tooltip'
import { adminNavItems, type NavItem } from '@/components/layout/navItems'
import { useTheme } from '@/hooks/useTheme'
import type { User } from '@/api/types'
import './Sidebar.css'

export interface SidebarProps {
  items?: NavItem[]
  user?: User | null
  onLogout?: () => void
  roleLabel?: string
}

export function Sidebar({
  items = adminNavItems,
  user = null,
  onLogout,
  roleLabel = 'Pengguna',
}: SidebarProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <aside className="lc-sidebar">
      <div className="lc-sidebar__brand">
        <span className="lc-sidebar__logo" aria-hidden="true">
          <Search size={20} />
        </span>
        <span className="lc-sidebar__brand-text">Kehilangan Kampus</span>
      </div>

      <nav className="lc-sidebar__nav" aria-label="Navigasi utama">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              ['lc-sidebar__link', isActive ? 'lc-sidebar__link--active' : ''].join(' ').trim()
            }
          >
            <item.icon size={20} aria-hidden="true" />
            <span className="lc-sidebar__link-label">{item.label}</span>
            {item.badge && item.badge > 0 ? (
              <span className="lc-sidebar__badge" aria-label={`${item.badge} belum dibaca`}>
                {item.badge > 9 ? '9+' : item.badge}
              </span>
            ) : null}
          </NavLink>
        ))}
      </nav>

      {user ? (
        <div className="lc-sidebar__user">
          <Avatar name={user.name} size="sm" />
          <div className="lc-sidebar__user-info">
            <span className="lc-sidebar__user-name">{user.name}</span>
            <span className="lc-sidebar__user-role">{roleLabel}</span>
          </div>
          <Tooltip label={theme === 'dark' ? 'Mode terang' : 'Mode gelap'}>
            <button
              type="button"
              className="lc-sidebar__logout lc-sidebar__theme-btn"
              aria-label={theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
            </button>
          </Tooltip>
          {onLogout ? (
            <Tooltip label="Keluar">
              <button
                type="button"
                className="lc-sidebar__logout"
                aria-label="Keluar"
                onClick={onLogout}
              >
                <LogOut size={18} aria-hidden="true" />
              </button>
            </Tooltip>
          ) : null}
        </div>
      ) : null}
    </aside>
  )
}
