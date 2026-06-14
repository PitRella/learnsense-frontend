import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '../lib/api'
import { useAuth } from '../lib/auth'

export function useCourses() {
  const { token } = useAuth()
  return useQuery({
    queryKey: ['courses'],
    queryFn: () => api.listCourses(token),
    enabled: Boolean(token),
  })
}

export function useModules(courseId) {
  const { token } = useAuth()
  return useQuery({
    queryKey: ['modules', courseId],
    queryFn: () => api.getModules(token, courseId),
    enabled: Boolean(token && courseId),
  })
}

export function useModulePerformance(moduleId, { poll = false } = {}) {
  const { token } = useAuth()
  return useQuery({
    queryKey: ['performance', moduleId],
    queryFn: () => api.modulePerformance(token, moduleId),
    enabled: Boolean(token && moduleId),
    // Background refresh so freshly computed indices appear without a
    // manual reload — mirrors the client polling pattern from the spec.
    refetchInterval: poll ? 4000 : false,
  })
}

export function useCreateCourse() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body) => api.createCourse(token, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
  })
}

export function useCreateModule(courseId) {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body) => api.createModule(token, courseId, body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['modules', courseId] }),
  })
}

export function useRecommendations({ poll = false } = {}) {
  const { token } = useAuth()
  return useQuery({
    queryKey: ['recommendations'],
    queryFn: () => api.listRecommendations(token),
    enabled: Boolean(token),
    // Recommendations are produced asynchronously by the Celery engine;
    // poll so freshly generated ones surface without a manual reload.
    refetchInterval: poll ? 5000 : false,
  })
}

export function useUpdateRecommendation() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }) =>
      api.updateRecommendation(token, id, status),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['recommendations'] }),
  })
}

export function useUpdateWeights(courseId) {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body) => api.updateWeights(token, courseId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['courses'] })
    },
  })
}
