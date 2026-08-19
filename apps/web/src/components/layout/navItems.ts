import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  FileText,
  Handshake,
  LayoutDashboard,
  PlusCircle,
  Search,
  Settings,
  Users,
} from 'lucide-react'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
}

export const userNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Laporan', to: '/reports', icon: Search },
  { label: 'Buat Laporan', to: '/reports/create', icon: PlusCircle },
  { label: 'Laporan Saya', to: '/my-reports', icon: FileText },
  { label: 'Klaim Saya', to: '/my-claims', icon: Handshake },
]

export const adminNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { label: 'Laporan', to: '/admin/reports', icon: Search },
  { label: 'Klaim', to: '/admin/claims', icon: Handshake },
  { label: 'Kategori', to: '/admin/categories', icon: Settings },
  { label: 'Pengguna', to: '/admin/users', icon: Users },
  { label: 'Log Aktivitas', to: '/admin/activity-logs', icon: Activity },
]
