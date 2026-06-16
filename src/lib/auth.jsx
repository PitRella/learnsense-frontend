import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { api } from './api'
import * as authStore from './authStore'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(authStore.getState)

  // Mirror store changes into React state so a forced logout (a failed
  // background refresh) re-renders the app and bounces to /login.
  useEffect(() => authStore.subscribe(setSession), [])

  const login = useCallback(async (email, password) => {
    const res = await api.login(email, password)
    authStore.setSession(authStore.sessionFromTokens(res))
  }, [])

  const logout = useCallback(async () => {
    const current = authStore.getState()
    if (current?.refresh) {
      try {
        await api.logout(current.refresh)
      } catch {
        // Best-effort: clear locally even if the call fails.
      }
    }
    authStore.clearSession()
  }, [])

  const value = useMemo(
    () => ({
      token: session?.access || null,
      role: session?.role || null,
      userId: session?.userId || null,
      isAuthenticated: Boolean(session?.access),
      isTeacher: session?.role === 'TEACHER',
      login,
      logout,
    }),
    [session, login, logout],
  )

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
