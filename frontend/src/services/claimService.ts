import { apiClient, type QueryParams } from '@/api/client'
import type { ClaimDetail, ClaimStatus, ClaimSummary, CreateClaimInput } from '@/api/types'

export const claimService = {
  listMy(params?: QueryParams) {
    return apiClient.getList<ClaimDetail>('/claims', params)
  },
  detail(id: string): Promise<ClaimDetail> {
    return apiClient.get<ClaimDetail>(`/claims/${id}`)
  },
  create(reportId: string, input: CreateClaimInput): Promise<ClaimSummary> {
    return apiClient.post<ClaimSummary>(`/reports/${reportId}/claims`, input)
  },
  cancel(id: string) {
    return apiClient.patch<{ id: number; status: ClaimStatus }>(`/claims/${id}/cancel`)
  },
  listByReport(reportId: string, params?: QueryParams) {
    return apiClient.getList<ClaimDetail>(`/reports/${reportId}/claims`, params)
  },
}
