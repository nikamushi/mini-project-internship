import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { Spinner } from '@/components/ui/Spinner'
import { RouterErrorPage } from '@/pages/RouterErrorPage'
import { ForbiddenPage } from '@/auth/guards'
import { AdminRoute, GuestRoute, ProtectedRoute } from '@/auth/guards'

/**
 * FE-080 — Lazy loading halaman besar untuk memperkecil bundle awal.
 */

const LoginPage = lazy(() =>
  import('@/pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })),
)
const RegisterPage = lazy(() =>
  import('@/pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })),
)
const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const ReportListPage = lazy(() =>
  import('@/pages/ReportListPage').then((m) => ({ default: m.ReportListPage })),
)
const ReportDetailPage = lazy(() =>
  import('@/pages/ReportDetailPage').then((m) => ({ default: m.ReportDetailPage })),
)
const CreateReportPage = lazy(() =>
  import('@/pages/CreateReportPage').then((m) => ({ default: m.CreateReportPage })),
)
const ReportFormPage = lazy(() =>
  import('@/pages/EditReportPage').then((m) => ({ default: m.EditReportPage })),
)
const MyReportsPage = lazy(() =>
  import('@/pages/MyReportsPage').then((m) => ({ default: m.MyReportsPage })),
)
const ClaimFormPage = lazy(() =>
  import('@/pages/ClaimFormPage').then((m) => ({ default: m.ClaimFormPage })),
)
const MyClaimsPage = lazy(() =>
  import('@/pages/MyClaimsPage').then((m) => ({ default: m.MyClaimsPage })),
)
const ClaimDetailPage = lazy(() =>
  import('@/pages/ClaimDetailPage').then((m) => ({ default: m.ClaimDetailPage })),
)
const NotificationCenterPage = lazy(() =>
  import('@/pages/NotificationCenterPage').then((m) => ({ default: m.NotificationCenterPage })),
)
const ProfilePage = lazy(() =>
  import('@/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })),
)
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)
const AdminDashboardPage = lazy(() =>
  import('@/pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })),
)
const AdminReportListPage = lazy(() =>
  import('@/pages/admin/AdminReportListPage').then((m) => ({ default: m.AdminReportListPage })),
)
const AdminReportDetailPage = lazy(() =>
  import('@/pages/admin/AdminReportDetailPage').then((m) => ({
    default: m.AdminReportDetailPage,
  })),
)
const AdminClaimListPage = lazy(() =>
  import('@/pages/admin/AdminClaimListPage').then((m) => ({ default: m.AdminClaimListPage })),
)
const AdminClaimDetailPage = lazy(() =>
  import('@/pages/admin/AdminClaimDetailPage').then((m) => ({
    default: m.AdminClaimDetailPage,
  })),
)
const AdminCategoriesPage = lazy(() =>
  import('@/pages/admin/AdminCategoriesPage').then((m) => ({ default: m.AdminCategoriesPage })),
)
const AdminUsersPage = lazy(() =>
  import('@/pages/admin/AdminUsersPage').then((m) => ({ default: m.AdminUsersPage })),
)
const AdminUserDetailPage = lazy(() =>
  import('@/pages/admin/AdminUserDetailPage').then((m) => ({ default: m.AdminUserDetailPage })),
)
const AdminActivityLogsPage = lazy(() =>
  import('@/pages/admin/AdminActivityLogsPage').then((m) => ({
    default: m.AdminActivityLogsPage,
  })),
)

function lazyPage(Page: LazyExoticComponent<ComponentType>): React.ReactNode {
  return (
    <Suspense
      fallback={
        <div className="lc-route-loading" role="status" aria-label="Memuat halaman">
          <Spinner size="lg" />
        </div>
      }
    >
      <Page />
    </Suspense>
  )
}

/**
 * Route architecture (docs/TaskFrontend.md FE-090 + FE-016).
 */
export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <RouterErrorPage />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" replace /> },
      { path: '/forbidden', element: <ForbiddenPage /> },
    ],
  },
  {
    element: (
      <AuthLayout>
        <GuestRoute />
      </AuthLayout>
    ),
    errorElement: <RouterErrorPage />,
    children: [
      { path: '/login', element: lazyPage(LoginPage) },
      { path: '/register', element: lazyPage(RegisterPage) },
    ],
  },
  {
    element: (
      <DashboardLayout>
        <ProtectedRoute />
      </DashboardLayout>
    ),
    errorElement: <RouterErrorPage />,
    children: [
      { path: '/dashboard', element: lazyPage(DashboardPage) },
      { path: '/reports', element: lazyPage(ReportListPage) },
      { path: '/reports/:id', element: lazyPage(ReportDetailPage) },
      { path: '/reports/create', element: lazyPage(CreateReportPage) },
      { path: '/reports/:id/edit', element: lazyPage(ReportFormPage) },
      { path: '/reports/:id/claim', element: lazyPage(ClaimFormPage) },
      { path: '/my-reports', element: lazyPage(MyReportsPage) },
      { path: '/my-claims', element: lazyPage(MyClaimsPage) },
      { path: '/my-claims/:id', element: lazyPage(ClaimDetailPage) },
      { path: '/notifications', element: lazyPage(NotificationCenterPage) },
      { path: '/profile', element: lazyPage(ProfilePage) },
    ],
  },
  {
    element: (
      <AdminLayout>
        <AdminRoute />
      </AdminLayout>
    ),
    errorElement: <RouterErrorPage />,
    children: [
      { path: '/admin', element: lazyPage(AdminDashboardPage) },
      { path: '/admin/reports', element: lazyPage(AdminReportListPage) },
      { path: '/admin/reports/:id', element: lazyPage(AdminReportDetailPage) },
      { path: '/admin/claims', element: lazyPage(AdminClaimListPage) },
      { path: '/admin/claims/:id', element: lazyPage(AdminClaimDetailPage) },
      { path: '/admin/categories', element: lazyPage(AdminCategoriesPage) },
      { path: '/admin/users', element: lazyPage(AdminUsersPage) },
      { path: '/admin/users/:id', element: lazyPage(AdminUserDetailPage) },
      { path: '/admin/activity-logs', element: lazyPage(AdminActivityLogsPage) },
    ],
  },
  {
    path: '*',
    element: lazyPage(NotFoundPage),
  },
])
