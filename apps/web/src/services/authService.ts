import { apiClient } from '@/api/client'
import type { User } from '@/api/types'

export interface AuthResponse {
  user: User
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export const authService = {
  register(input: RegisterInput): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/register', input)
  },
  login(input: LoginInput): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', input)
  },
  logout(): Promise<void> {
    return apiClient.post<void>('/auth/logout')
  },
  me(): Promise<AuthResponse> {
    return apiClient.get<AuthResponse>('/auth/me')
  },
}
