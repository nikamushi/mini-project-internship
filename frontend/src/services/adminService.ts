import { apiClient, type QueryParams } from '@/api/client'
import type {
  AdminDashboard,
  ClaimDetail,
  ReportDetail,
  ReviewClaimInput,
  UpdateReportStatusInput,
} from '@/api/types'

export const adminService = {
  dashboard(): Promise<AdminDashboard> {
    return apiClient.get<AdminDashboard>('/admin/dashboard')
  },
  reports(params?: QueryParams) {
    return apiClient.getList<ReportDetail>('/admin/reports', params)
  },
  reportDetail(id: string): Promise<ReportDetail> {
    return apiClient.get<ReportDetail>(`/admin/reports/${id}`)
  },
  updateReportStatus(id: string, input: UpdateReportStatusInput): Promise<ReportDetail> {
    return apiClient.patch<ReportDetail>(`/admin/reports/${id}/status`, input)
  },
  deleteReport(id: string): Promise<void> {
    return apiClient.delete(`/admin/reports/${id}`)
  },
  claims(params?: QueryParams) {
    return apiClient.getList<ClaimDetail>('/admin/claims', params)
  },
  claimDetail(id: string): Promise<ClaimDetail> {
    return apiClient.get<ClaimDetail>(`/admin/claims/${id}`)
  },
  reviewClaim(id: string, input: ReviewClaimInput): Promise<ClaimDetail> {
    return apiClient.patch<ClaimDetail>(`/admin/claims/${id}/status`, input)
  },
}
