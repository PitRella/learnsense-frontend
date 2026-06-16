// Framework-agnostic auth token store, shared by the API layer (for the
// Authorization header + transparent refresh) and the React AuthProvider
// (for render state). Persisted to localStorage; notifies subscribers on
// every change so a forced logout (failed refresh) propagates to the UI.

const KEY = 'learnsense.auth'
const listeners = new Set()
let refreshing = null

export function decodeUserId(token) {
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

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

let state = read()

function emit() {
  for (const fn of listeners) fn(state)
}

export function getState() {
  return state
}

export function getAccessToken() {
  return state?.access || null
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function sessionFromTokens(data) {
  return {
    access: data.access_token,
    refresh: data.refresh_token,
    role: data.user_role,
    userId: decodeUserId(data.access_token),
  }
}

export function setSession(session) {
  state = session
  localStorage.setItem(KEY, JSON.stringify(session))
  emit()
}

export function clearSession() {
  state = null
  localStorage.removeItem(KEY)
  emit()
}

// Single-flight refresh: concurrent 401s share one in-flight request.
export function refresh() {
  if (!state?.refresh) return Promise.reject(new Error('no-refresh-token'))
  if (!refreshing) {
    refreshing = (async () => {
      const res = await fetch('/api/v1/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: state.refresh }),
      })
      if (!res.ok) {
        clearSession()
        throw new Error('refresh-failed')
      }
      setSession(sessionFromTokens(await res.json()))
      return getAccessToken()
    })().finally(() => {
      refreshing = null
    })
  }
  return refreshing
}
