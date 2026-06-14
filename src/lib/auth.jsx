import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

import { api } from './api'

const AuthContext = createContext(null)
const STORAGE_KEY = 'learnsense.auth'

// Decode the `sub` (user id) from a JWT payload without verifying it —
// the backend does not expose a /me endpoint, so we read the subject
// client-side purely for UI scoping (filtering a teacher's own courses).
function decodeUserId(token) {
  try {
    const [, payload] = token.split('.')
    const json = JSON.parse(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/')),
    )
    return json.sub ? Number(json.sub) : null
  } catch {
    return null
  }
}

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStored)

  const login = useCallback(async (email, password) => {
    const res = await api.login(email, password)
    const next = {
      token: res.access_token,
      refreshToken: res.refresh_token,
      role: res.user_role,
      userId: decodeUserId(res.access_token),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setSession(next)
    return next
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setSession(null)
  }, [])

  const value = useMemo(
    () => ({
      ...session,
      isAuthenticated: Boolean(session?.token),
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
