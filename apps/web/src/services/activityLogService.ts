import { apiClient, type QueryParams } from '@/api/client'
import type { ActivityLog } from '@/api/types'

export const activityLogService = {
  list(params?: QueryParams) {
    return apiClient.getList<ActivityLog>('/admin/activity-logs', params)
  },
}
