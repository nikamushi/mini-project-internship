import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'
import { useAuth } from '@/auth/useAuth'
import './guards.css'

function roleHome(role: 'USER' | 'ADMIN'): string {
  return role === 'ADMIN' ? '/admin' : '/dashboard'
}

/** Menunggu hydrasi session /auth/me. */
function GuardLoading() {
  return (
    <div className="lc-guard-loading" role="status" aria-label="Memeriksa sesi">
      <Spinner size="lg" />
      <span className="lc-guard-loading__text">Memeriksa sesi...</span>
    </div>
  )
}

/** Hanya untuk pengguna yang sudah login; sisanya diarahkan ke /login. */
export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) return <GuardLoading />
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}

/** Hanya untuk ADMIN; USER yang mencoba masuk diarahkan ke halaman terlarang. */
export function AdminRoute() {
  const { role, isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) return <GuardLoading />
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (role !== 'ADMIN') return <Navigate to="/forbidden" replace />
  return <Outlet />
}

/** Halaman yang hanya boleh diakses saat belum login (login/register). */
export function GuestRoute() {
  const { isAuthenticated, role, loading } = useAuth()

  if (loading) return <GuardLoading />
  if (isAuthenticated) return <Navigate to={roleHome(role ?? 'USER')} replace />
  return <Outlet />
}

export function ForbiddenPage() {
  return (
    <div className="lc-guard-forbidden">
      <span className="lc-guard-forbidden__icon" aria-hidden="true">
        <ShieldAlert size={40} />
      </span>
      <h1 className="lc-guard-forbidden__title">Akses Ditolak</h1>
      <p className="lc-guard-forbidden__text">
        Halaman ini hanya dapat diakses oleh Administrator.
      </p>
    </div>
  )
}
