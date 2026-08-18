import { apiClient, type QueryParams } from '@/api/client'
import type {
  CreateReportInput,
  ReportDetail,
  ReportImage,
  ReportStatus,
  ReportSummary,
  ReportType,
  UpdateReportInput,
} from '@/api/types'

export interface CreateReportResult {
  id: string
  type: ReportType
  status: ReportStatus
}

export const reportService = {
  list(params?: QueryParams) {
    return apiClient.getList<ReportSummary>('/reports', params)
  },
  detail(id: string): Promise<ReportDetail> {
    return apiClient.get<ReportDetail>(`/reports/${id}`)
  },
  create(input: CreateReportInput): Promise<CreateReportResult> {
    return apiClient.post<CreateReportResult>('/reports', input)
  },
  update(id: string, input: UpdateReportInput): Promise<ReportDetail> {
    return apiClient.patch<ReportDetail>(`/reports/${id}`, input)
  },
  remove(id: string): Promise<void> {
    return apiClient.delete(`/reports/${id}`)
  },
  uploadImage(reportId: string, file: File): Promise<ReportImage> {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.upload<ReportImage>(`/reports/${reportId}/images`, formData)
  },
  deleteImage(reportId: string, imageId: string): Promise<void> {
    return apiClient.delete(`/reports/${reportId}/images/${imageId}`)
  },
}
