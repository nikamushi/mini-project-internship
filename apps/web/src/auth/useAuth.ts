import { useContext } from 'react'
import { AuthContext, type AuthContextValue } from '@/auth/authContext'

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider.')
  }
  return context
}
