// Thin fetch wrapper around the LearnSense API. All calls go through the
// Vite dev proxy at /api -> http://localhost:8000. The access token is
// read from the shared auth store, and an expired token (401) triggers a
// transparent refresh + one retry.

import * as authStore from './authStore'

const BASE = '/api/v1'

export class ApiError extends Error {
  constructor(status, detail) {
    super(detail || `Request failed (${status})`)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
  }
}

async function request(path, { method = 'GET', body, _retry = false } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = authStore.getAccessToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  // Transparent refresh: on an expired access token, refresh once and
  // replay the original request. Auth routes are exempt (no recursion).
  if (res.status === 401 && !_retry && !path.startsWith('/auth/')) {
    try {
      await authStore.refresh()
    } catch {
      throw new ApiError(401, 'Сесія завершилась, увійдіть знову')
    }
    return request(path, { method, body, _retry: true })
  }

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
    request('/auth/login', { method: 'POST', body: { email, password } }),
  signup: (data) => request('/auth/signup', { method: 'POST', body: data }),
  logout: (refreshToken) =>
    request('/auth/logout', {
      method: 'POST',
      body: { refresh_token: refreshToken },
    }),
  me: () => request('/auth/me'),

  listCourses: () => request('/courses/'),
  createCourse: (body) =>
    request('/courses/', { method: 'POST', body }),
  getModules: (courseId) => request(`/courses/${courseId}/modules`),
  createModule: (courseId, body) =>
    request(`/courses/${courseId}/modules`, { method: 'POST', body }),
  updateWeights: (courseId, body) =>
    request(`/courses/${courseId}/weights`, { method: 'PUT', body }),

  modulePerformance: (moduleId) =>
    request(`/analytics/modules/${moduleId}/performance`),

  listRecommendations: () => request('/recommendations/'),
  updateRecommendation: (id, status) =>
    request(`/recommendations/${id}`, {
      method: 'PATCH',
      body: { status },
    }),

  logActivity: (body) =>
    request('/analytics/activity-logs', { method: 'POST', body }),

  materialUploadUrl: (materialId, body) =>
    request(`/courses/materials/${materialId}/file/upload-url`, {
      method: 'POST',
      body,
    }),
  materialDownloadUrl: (materialId) =>
    request(`/courses/materials/${materialId}/file`),

  getQuiz: (materialId) =>
    request(`/courses/materials/${materialId}/quiz`),
  addQuestion: (materialId, body) =>
    request(`/courses/materials/${materialId}/questions`, {
      method: 'POST',
      body,
    }),
  submitQuiz: (materialId, answers) =>
    request(`/analytics/test-results/${materialId}/submit`, {
      method: 'POST',
      body: { answers },
    }),
}

// Upload a file straight to object storage using a presigned PUT URL.
// This bypasses our API entirely — bytes go to MinIO/S3 directly.
export async function putToStorage(uploadUrl, file) {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
  })
  if (!res.ok) {
    throw new ApiError(res.status, 'Не вдалося завантажити файл у сховище')
  }
}
