import { apiClient, type QueryParams } from '@/api/client'
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '@/api/types'

export const categoryService = {
  list(params?: QueryParams) {
    return apiClient.get<Category[]>('/categories', params)
  },
  detail(id: number): Promise<Category> {
    return apiClient.get<Category>(`/categories/${id}`)
  },
  create(input: CreateCategoryInput): Promise<Category> {
    return apiClient.post<Category>('/categories', input)
  },
  update(id: number, input: UpdateCategoryInput): Promise<Category> {
    return apiClient.patch<Category>(`/categories/${id}`, input)
  },
  remove(id: number): Promise<void> {
    return apiClient.delete(`/categories/${id}`)
  },
}
