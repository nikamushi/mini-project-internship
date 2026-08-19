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
  id: number
  name: string
  email: string
  role: UserRole
  isActive?: boolean
  createdAt?: string
}

export interface CategoryRef {
  id: number
  name: string
}

export interface Category {
  id: number
  name: string
  description?: string | null
  isActive?: boolean
}

export interface ReporterRef {
  id: number
  name: string
  email?: string
}

export interface ReportImage {
  id: number
  url: string
  sortOrder?: number
}

export interface ReportSummary {
  id: number
  type: ReportType
  itemName: string
  description: string
  category: CategoryRef
  location: string
  occurredAt: string
  status: ReportStatus
  images: ReportImage[]
  createdAt: string
  adminNote?: string | null
}

export interface ReportDetail extends ReportSummary {
  reporter: ReporterRef
}

export interface ClaimSummary {
  id: number
  reportId: number
  status: ClaimStatus
  createdAt: string
}

export interface ClaimReportRef {
  id: number
  type: ReportType
  itemName: string
  location: string
  occurredAt: string
  status: ReportStatus
  category: CategoryRef
  images: ReportImage[]
}

export interface ClaimDetail extends ClaimSummary {
  reason: string
  evidence?: string | null
  reviewReason?: string | null
  updatedAt: string
  claimant?: ReporterRef
  report?: ClaimReportRef | null
}

export interface Notification {
  id: number
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

export interface ActivityLog {
  id: number
  actor: ReporterRef
  entityType: string
  entityId: number
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
  totalUsers: number
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
  categoryId: number
  itemName: string
  description: string
  location: string
  occurredAt: string
}

export interface UpdateReportInput {
  itemName?: string
  description?: string
  location?: string
  occurredAt?: string
}

export interface UpdateReportStatusInput {
  status: ReportStatus
  adminNote?: string
}

export interface CreateClaimInput {
  reason: string
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
  categoryId?: number
  status?: ReportStatus
  q?: string
  location?: string
  reporterId?: number
  sortBy?: string
  sortOrder?: SortOrder
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
