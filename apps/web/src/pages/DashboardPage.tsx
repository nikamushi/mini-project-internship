import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Bell, Eye, PackageSearch, Search } from 'lucide-react'
import { useAuth } from '@/auth/useAuth'
import { notificationService } from '@/services/notificationService'
import { reportService } from '@/services/reportService'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { ReportCard } from '@/components/report/ReportCard'
import type { ReportSummary } from '@/api/types'
import './DashboardPage.css'

function useReportCount(type?: 'LOST' | 'FOUND') {
  return useQuery({
    queryKey: ['reports', 'count', type ?? 'all'],
    queryFn: () => reportService.list(type ? { type, limit: 1 } : { limit: 1 }),
    select: (result) => result.meta.total,
  })
}

export function DashboardPage() {
  const { currentUser } = useAuth()

  const totalQuery = useReportCount()
  const lostQuery = useReportCount('LOST')
  const foundQuery = useReportCount('FOUND')

  const recentQuery = useQuery({
    queryKey: ['reports', 'recent'],
    queryFn: () => reportService.list({ limit: 5 }),
  })

  const recentFoundQuery = useQuery({
    queryKey: ['reports', 'recent-found'],
    queryFn: () => reportService.list({ type: 'FOUND', limit: 5 }),
  })

  const unreadQuery = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationService.list({ unread: true, limit: 1 }),
    select: (result) => result.meta.total,
  })

  return (
    <div className="lc-dashboard">
      <section className="lc-dashboard__welcome">
        <h1 className="lc-dashboard__title">
          Selamat datang{currentUser ? `, ${currentUser.name}` : ''}!
        </h1>
        <p className="lc-dashboard__subtitle">
          Kelola dan pantau laporan barang hilang atau ditemukan di lingkungan kampus.
        </p>
      </section>

      <section className="lc-dashboard__stats" aria-label="Ringkasan laporan">
        <StatCard
          icon={<Search size={20} />}
          label="Total Laporan"
          value={totalQuery.data}
          loading={totalQuery.isPending}
        />
        <StatCard
          icon={<Eye size={20} />}
          label="Barang Hilang"
          value={lostQuery.data}
          loading={lostQuery.isPending}
        />
        <StatCard
          icon={<PackageSearch size={20} />}
          label="Barang Ditemukan"
          value={foundQuery.data}
          loading={foundQuery.isPending}
        />
        <StatCard
          icon={<Bell size={20} />}
          label="Notifikasi Belum Dibaca"
          value={unreadQuery.data}
          loading={unreadQuery.isPending}
        />
      </section>

      <section className="lc-dashboard__actions" aria-label="Aksi cepat">
        <QuickAction
          to="/reports/create?type=LOST"
          icon={<Search size={18} />}
          label="Laporkan Barang Hilang"
        />
        <QuickAction
          to="/reports/create?type=FOUND"
          icon={<PackageSearch size={18} />}
          label="Laporkan Barang Ditemukan"
        />
        <QuickAction to="/reports?type=LOST" icon={<Eye size={18} />} label="Lihat Barang Hilang" />
        <QuickAction
          to="/reports?type=FOUND"
          icon={<PackageSearch size={18} />}
          label="Lihat Barang Ditemukan"
        />
      </section>

      <div className="lc-dashboard__grid">
        <Card
          title="Laporan Terbaru"
          action={
            <Link to="/reports" className="lc-dashboard__more">
              Lihat semua
            </Link>
          }
        >
          <ReportSection
            query={recentQuery}
            emptyMessage="Belum ada laporan."
            onRetry={() => void recentQuery.refetch()}
          />
        </Card>

        <Card title="Barang Ditemukan Terbaru">
          <ReportSection
            query={recentFoundQuery}
            emptyMessage="Belum ada barang ditemukan."
            onRetry={() => void recentFoundQuery.refetch()}
          />
        </Card>
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: ReactNode
  label: string
  value?: number
  loading: boolean
}

function StatCard({ icon, label, value, loading }: StatCardProps) {
  return (
    <div className="lc-dashboard__stat">
      <span className="lc-dashboard__stat-icon" aria-hidden="true">
        {icon}
      </span>
      <div className="lc-dashboard__stat-body">
        <span className="lc-dashboard__stat-value">
          {loading ? <Skeleton width="3ch" height="1.4em" /> : (value ?? 0)}
        </span>
        <span className="lc-dashboard__stat-label">{label}</span>
      </div>
    </div>
  )
}

interface QuickActionProps {
  to: string
  icon: ReactNode
  label: string
}

function QuickAction({ to, icon, label }: QuickActionProps) {
  return (
    <Link to={to} className="lc-dashboard__quick">
      <span className="lc-dashboard__quick-icon" aria-hidden="true">
        {icon}
      </span>
      {label}
    </Link>
  )
}

interface ReportSectionProps {
  query: {
    data?: { data: ReportSummary[] }
    isPending: boolean
    isError: boolean
    refetch: () => Promise<unknown>
  }
  emptyMessage: string
  onRetry: () => void
}

function ReportSection({ query, emptyMessage, onRetry }: ReportSectionProps) {
  if (query.isPending) {
    return (
      <div className="lc-dashboard__skeleton-list" aria-busy="true">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} height="72px" />
        ))}
      </div>
    )
  }
  if (query.isError) {
    return <ErrorState title="Gagal memuat laporan" onRetry={onRetry} />
  }
  if (!query.data || query.data.data.length === 0) {
    return <EmptyState title={emptyMessage} />
  }
  return (
    <ul className="lc-dashboard__report-list">
      {query.data.data.map((report) => (
        <li key={report.id}>
          <ReportCard report={report} />
        </li>
      ))}
    </ul>
  )
}
