import { NavLink } from 'react-router-dom'
import { LogOut, Search } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { adminNavItems, type NavItem } from '@/components/layout/navItems'
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
          {onLogout ? (
            <button
              type="button"
              className="lc-sidebar__logout"
              aria-label="Keluar"
              title="Keluar"
              onClick={onLogout}
            >
              <LogOut size={18} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      ) : null}
    </aside>
  )
}
