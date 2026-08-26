import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  ClipboardCheck,
  Clock,
  PackageCheck,
  PackageSearch,
  ScrollText,
  Search,
} from 'lucide-react'
import { adminService } from '@/services/adminService'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import './AdminPages.css'
import './AdminDashboardPage.css'

interface MetricCardProps {
  icon: React.ReactNode
  label: string
  value?: number
  loading: boolean
  to?: string
  tone?: 'primary' | 'warning' | 'info' | 'success' | 'danger'
}

function MetricCard({ icon, label, value, loading, to, tone = 'primary' }: MetricCardProps) {
  const statClassName = [
    'lc-admin-dashboard__stat',
    `lc-admin-dashboard__stat--${tone}`,
    ...(to ? ['lc-admin-dashboard__stat--link'] : []),
  ].join(' ')
  const body = (
    <>
      <span
        className={[
          'lc-admin-dashboard__stat-icon',
          `lc-admin-dashboard__stat-icon--${tone}`,
        ].join(' ')}
        aria-hidden="true"
      >
        {icon}
      </span>
      <div className="lc-admin-dashboard__stat-body">
        <span className="lc-admin-dashboard__stat-value">
          {loading ? <Skeleton width="3ch" height="1.4em" /> : (value ?? 0)}
        </span>
        <span className="lc-admin-dashboard__stat-label">{label}</span>
      </div>
    </>
  )
  return to ? (
    <Link to={to} className={statClassName}>
      {body}
    </Link>
  ) : (
    <div className={statClassName}>{body}</div>
  )
}

export function AdminDashboardPage() {
  const dashboardQuery = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminService.dashboard(),
  })

  const loading = dashboardQuery.isPending
  const data = dashboardQuery.data

  if (dashboardQuery.isError) {
    return (
      <div className="lc-admin-page">
        <ErrorState title="Gagal memuat dashboard" onRetry={() => void dashboardQuery.refetch()} />
      </div>
    )
  }

  return (
    <div className="lc-admin-page">
      <section className="lc-admin-page__header">
        <div>
          <h1 className="lc-admin-page__title">Dashboard Admin</h1>
          <p className="lc-admin-page__subtitle">Ringkasan aktivitas sistem kehilangan kampus.</p>
        </div>
      </section>

      <section className="lc-admin-dashboard__stats" aria-label="Metrik laporan">
        <MetricCard
          icon={<ClipboardCheck size={20} />}
          label="Total Laporan"
          value={data?.reports.total}
          loading={loading}
          to="/admin/reports"
          tone="primary"
        />
        <MetricCard
          icon={<Clock size={20} />}
          label="Menunggu Verifikasi"
          value={data?.reports.pendingVerification}
          loading={loading}
          to="/admin/reports?status=PENDING_VERIFICATION"
          tone="warning"
        />
        <MetricCard
          icon={<Search size={20} />}
          label="Laporan Aktif"
          value={data?.reports.active}
          loading={loading}
          to="/admin/reports?status=ACTIVE"
          tone="info"
        />
        <MetricCard
          icon={<PackageCheck size={20} />}
          label="Selesai"
          value={data?.reports.completed}
          loading={loading}
          to="/admin/reports?status=COMPLETED"
          tone="success"
        />
      </section>

      <section className="lc-admin-dashboard__stats" aria-label="Metrik tambahan">
        <MetricCard
          icon={<PackageSearch size={20} />}
          label="Barang Hilang"
          value={data?.lostReports}
          loading={loading}
          to="/admin/reports?type=LOST"
          tone="danger"
        />
        <MetricCard
          icon={<PackageSearch size={20} />}
          label="Barang Ditemukan"
          value={data?.foundReports}
          loading={loading}
          to="/admin/reports?type=FOUND"
          tone="success"
        />
        <MetricCard
          icon={<ScrollText size={20} />}
          label="Klaim Menunggu"
          value={data?.pendingClaims}
          loading={loading}
          to="/admin/claims?status=PENDING"
          tone="warning"
        />
      </section>

      <Card title="Tindakan Admin">
        <div className="lc-admin-dashboard__quick">
          <Link
            to="/admin/reports?status=PENDING_VERIFICATION"
            className="lc-admin-dashboard__quick-link"
          >
            Verifikasi laporan yang menunggu
          </Link>
          <Link to="/admin/claims?status=PENDING" className="lc-admin-dashboard__quick-link">
            Tinjau klaim yang menunggu
          </Link>
          <Link to="/admin/categories" className="lc-admin-dashboard__quick-link">
            Kelola kategori
          </Link>
        </div>
      </Card>
    </div>
  )
}
