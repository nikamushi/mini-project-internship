import { createContext } from 'react'
import type { User, UserRole } from '@/api/types'
import type { LoginInput, RegisterInput } from '@/services/authService'

export interface AuthContextValue {
  /** Data user yang sedang login (dari session server). */
  currentUser: User | null
  /** Alias `currentUser` — data session per FE-012. */
  session: User | null
  role: UserRole | null
  isAuthenticated: boolean
  loading: boolean
  login: (input: LoginInput) => Promise<User>
  register: (input: RegisterInput) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
