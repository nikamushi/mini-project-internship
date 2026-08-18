import { apiClient, type QueryParams } from '@/api/client'
import type { User } from '@/api/types'

export const userService = {
  list(params?: QueryParams) {
    return apiClient.getList<User>('/admin/users', params)
  },
  detail(id: string): Promise<User> {
    return apiClient.get<User>(`/admin/users/${id}`)
  },
  updateStatus(id: string, isActive: boolean): Promise<User> {
    return apiClient.patch<User>(`/admin/users/${id}/status`, { isActive })
  },
}
