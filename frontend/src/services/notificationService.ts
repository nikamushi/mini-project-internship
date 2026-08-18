import { apiClient, type QueryParams } from '@/api/client'
import type { Notification } from '@/api/types'

export const notificationService = {
  list(params?: QueryParams) {
    return apiClient.getList<Notification>('/notifications', params)
  },
  markRead(id: string) {
    return apiClient.patch<{ id: string; readAt: string | null }>(`/notifications/${id}/read`)
  },
  markAllRead(): Promise<void> {
    return apiClient.patch<void>('/notifications/read-all')
  },
}
