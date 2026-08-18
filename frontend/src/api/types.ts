/**
 * FE-010 — API types berdasarkan docs/API.md (response DTO, bukan database schema).
 * ID diperlakukan sebagai string opaque (UUID, bukan integer).
 * Timestamp ISO 8601.
 */

export type UserRole = 'USER' | 'ADMIN'

export type ReportType = 'LOST' | 'FOUND'

export type ReportStatus =
  'PENDING_VERIFICATION' | 'ACTIVE' | 'FOUND' | 'CLAIMED' | 'COMPLETED' | 'REJECTED' | 'CANCELLED'

export type ClaimStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'

export type SortOrder = 'asc' | 'desc'

/* ============================================================
 * Entities
 * ============================================================ */

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  isActive?: boolean
  createdAt?: string
}

export interface CategoryRef {
  id: string
  name: string
}

export interface Category {
  id: string
  name: string
  description?: string | null
  isActive?: boolean
}

export interface ReporterRef {
  id: string
  name: string
}

export interface ReportImageRef {
  url: string
}

export interface ReportImage {
  id: string
  url: string
  sortOrder?: number
}

export interface ReportSummary {
  id: string
  type: ReportType
  title: string
  description: string
  category: CategoryRef
  location: string
  eventAt: string
  status: ReportStatus
  image: ReportImageRef | null
  createdAt: string
  adminNote?: string | null
}

export interface ReportDetail extends Omit<ReportSummary, 'image'> {
  images: ReportImage[]
  reporter: ReporterRef
}

export interface ClaimSummary {
  id: string
  reportId: string
  status: ClaimStatus
  createdAt: string
}

export interface ClaimDetail extends ClaimSummary {
  description: string
  evidence?: string | null
  reason?: string | null
  reviewedAt?: string | null
  claimant?: ReporterRef
  report?: ReportSummary | null
}

export type NotificationReferenceType = 'REPORT' | 'CLAIM' | 'SYSTEM'

export interface Notification {
  id: string
  type: string
  title: string
  message: string
  referenceType: NotificationReferenceType
  referenceId: string
  readAt: string | null
  createdAt: string
}

export interface ActivityLog {
  id: string
  actor: ReporterRef
  entityType: string
  entityId: string
  action: string
  metadata: Record<string, unknown>
  createdAt: string
}

export interface AdminDashboard {
  reports: {
    total: number
    pendingVerification: number
    active: number
    completed: number
  }
  lostReports: number
  foundReports: number
  pendingClaims: number
}

/* ============================================================
 * Pagination / Envelope
 * ============================================================ */

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: true
  data: T
}

export interface ApiListResponse<T> {
  success: true
  data: T[]
  meta: PaginationMeta
}

export interface ApiErrorBody {
  success: false
  error?: {
    code?: string
    message?: string
    details?: Record<string, string | string[]>
  }
  message?: string
  errors?: Record<string, string>
}

/* ============================================================
 * Request DTO (docs/API.md #83–85)
 * ============================================================ */

export interface CreateReportInput {
  type: ReportType
  categoryId: string
  title: string
  description: string
  location: string
  eventAt: string
}

export interface UpdateReportInput {
  title?: string
  description?: string
  location?: string
  eventAt?: string
}

export interface UpdateReportStatusInput {
  status: ReportStatus
  adminNote?: string
}

export interface CreateClaimInput {
  description: string
  evidence?: string
}

export interface ReviewClaimInput {
  status: 'APPROVED' | 'REJECTED'
  reason?: string
}

export interface CreateCategoryInput {
  name: string
  description?: string
}

export interface UpdateCategoryInput {
  name?: string
  description?: string
  isActive?: boolean
}

/* ============================================================
 * List query params
 * ============================================================ */

export interface ReportListParams {
  page?: number
  limit?: number
  type?: ReportType
  categoryId?: string
  status?: ReportStatus
  search?: string
  location?: string
  sortBy?: string
  sortOrder?: SortOrder
}

export interface AdminReportListParams extends ReportListParams {
  reporterId?: string
  dateFrom?: string
  dateTo?: string
}

export interface ClaimListParams {
  page?: number
  limit?: number
  status?: ClaimStatus
}

export interface AdminClaimListParams {
  page?: number
  limit?: number
  status?: ClaimStatus
  reportId?: string
  claimantId?: string
  dateFrom?: string
  dateTo?: string
}

export interface NotificationListParams {
  page?: number
  limit?: number
  unread?: boolean
}

export interface UserListParams {
  page?: number
  limit?: number
  search?: string
  role?: UserRole
  isActive?: boolean
}

export interface ActivityLogListParams {
  page?: number
  limit?: number
  entityType?: string
  action?: string
  actorId?: string
  dateFrom?: string
  dateTo?: string
}
