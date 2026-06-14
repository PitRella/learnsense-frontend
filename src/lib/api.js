// Thin fetch wrapper around the LearnSense API. All calls go through the
// Vite dev proxy at /api -> http://localhost:8000.

const BASE = '/api/v1'

export class ApiError extends Error {
  constructor(status, detail) {
    super(detail || `Request failed (${status})`)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
  }
}

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) return null

  let payload = null
  const text = await res.text()
  if (text) {
    try {
      payload = JSON.parse(text)
    } catch {
      payload = text
    }
  }

  if (!res.ok) {
    const detail =
      payload && typeof payload === 'object'
        ? payload.detail || JSON.stringify(payload)
        : payload
    throw new ApiError(res.status, detail)
  }
  return payload
}

export const api = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),
  signup: (data) =>
    request('/auth/signup', { method: 'POST', body: data }),

  listCourses: (token) => request('/courses/', { token }),
  createCourse: (token, body) =>
    request('/courses/', { method: 'POST', token, body }),
  getModules: (token, courseId) =>
    request(`/courses/${courseId}/modules`, { token }),
  createModule: (token, courseId, body) =>
    request(`/courses/${courseId}/modules`, {
      method: 'POST',
      token,
      body,
    }),
  updateWeights: (token, courseId, body) =>
    request(`/courses/${courseId}/weights`, {
      method: 'PUT',
      token,
      body,
    }),

  modulePerformance: (token, moduleId) =>
    request(`/analytics/modules/${moduleId}/performance`, { token }),

  listRecommendations: (token) => request('/recommendations/', { token }),
  updateRecommendation: (token, id, status) =>
    request(`/recommendations/${id}`, {
      method: 'PATCH',
      token,
      body: { status },
    }),
}
