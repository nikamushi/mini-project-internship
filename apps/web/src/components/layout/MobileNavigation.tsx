import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { LogOut, Search, X } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import type { NavItem } from '@/components/layout/navItems'
import type { User } from '@/api/types'
import './MobileNavigation.css'

export interface MobileNavigationProps {
  items: NavItem[]
  open: boolean
  onClose: () => void
  user?: User | null
  onLogout?: () => void
}

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function MobileNavigation({
  items,
  open,
  onClose,
  user = null,
  onLogout,
}: MobileNavigationProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return undefined

    previouslyFocused.current = document.activeElement as HTMLElement | null
    panelRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const panel = panelRef.current
      if (!panel) return
      const focusable = panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      if (focusable.length === 0) {
        event.preventDefault()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      previouslyFocused.current?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="lc-drawer">
      <div className="lc-drawer__overlay" aria-hidden="true" onClick={onClose} />
      <div
        ref={panelRef}
        className="lc-drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi"
        tabIndex={-1}
      >
        <div className="lc-drawer__header">
          <span className="lc-drawer__brand" aria-hidden="true">
            <Search size={20} />
          </span>
          <button
            type="button"
            className="lc-drawer__close"
            aria-label="Tutup menu"
            onClick={onClose}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {user ? (
          <div className="lc-drawer__user">
            <Avatar name={user.name} size="md" />
            <div className="lc-drawer__user-info">
              <span className="lc-drawer__user-name">{user.name}</span>
              <span className="lc-drawer__user-email">{user.email}</span>
            </div>
          </div>
        ) : null}

        <nav className="lc-drawer__nav" aria-label="Menu navigasi">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                ['lc-drawer__link', isActive ? 'lc-drawer__link--active' : ''].join(' ').trim()
              }
              onClick={onClose}
            >
              <item.icon size={20} aria-hidden="true" />
              <span className="lc-drawer__link-label">{item.label}</span>
              {item.badge && item.badge > 0 ? (
                <span className="lc-drawer__badge" aria-label={`${item.badge} belum dibaca`}>
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>

        {onLogout ? (
          <div className="lc-drawer__footer">
            <button type="button" className="lc-drawer__logout" onClick={onLogout}>
              <LogOut size={20} aria-hidden="true" />
              Keluar
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
