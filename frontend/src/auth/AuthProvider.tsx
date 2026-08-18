import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { setUnauthorizedHandler } from '@/api/client'
import { AuthContext, type AuthContextValue } from '@/auth/authContext'
import { authService } from '@/services/authService'
import type { User } from '@/api/types'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    authService
      .me()
      .then(({ user: sessionUser }) => {
        if (!cancelled) setUser(sessionUser)
      })
      .catch(() => {
        if (!cancelled) setUser(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null)
      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    })
    return () => setUnauthorizedHandler(null)
  }, [])

  const login = useCallback(async (input: Parameters<AuthContextValue['login']>[0]) => {
    const { user: sessionUser } = await authService.login(input)
    setUser(sessionUser)
    return sessionUser
  }, [])

  const register = useCallback(async (input: Parameters<AuthContextValue['register']>[0]) => {
    await authService.register(input)
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      setUser(null)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser: user,
      session: user,
      role: user?.role ?? null,
      isAuthenticated: user !== null,
      loading,
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
