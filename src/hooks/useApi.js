import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api, putToStorage } from '../lib/api'
import { useAuth } from '../lib/auth'

export function useMe() {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['me'],
    queryFn: () => api.me(),
    enabled: isAuthenticated,
    staleTime: 5 * 60_000,
  })
}

export function useCourses() {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['courses'],
    queryFn: () => api.listCourses(),
    enabled: isAuthenticated,
  })
}

export function useModules(courseId) {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['modules', courseId],
    queryFn: () => api.getModules(courseId),
    enabled: isAuthenticated && Boolean(courseId),
  })
}

export function useModulePerformance(moduleId, { poll = false } = {}) {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['performance', moduleId],
    queryFn: () => api.modulePerformance(moduleId),
    enabled: isAuthenticated && Boolean(moduleId),
    // Background refresh so freshly computed indices appear without a
    // manual reload — mirrors the client polling pattern from the spec.
    refetchInterval: poll ? 4000 : false,
  })
}

export function useRecommendations({ poll = false } = {}) {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['recommendations'],
    queryFn: () => api.listRecommendations(),
    enabled: isAuthenticated,
    // Recommendations are produced asynchronously by the Celery engine;
    // poll so freshly generated ones surface without a manual reload.
    refetchInterval: poll ? 5000 : false,
  })
}

export function useMaterialDownload(materialId, enabled) {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['material-file', materialId],
    queryFn: () => api.materialDownloadUrl(materialId),
    enabled: isAuthenticated && Boolean(materialId) && enabled,
    staleTime: 10 * 60_000,
  })
}

export function useCreateCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body) => api.createCourse(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
  })
}

export function useCreateModule(courseId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body) => api.createModule(courseId, body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['modules', courseId] }),
  })
}

export function useUpdateWeights(courseId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body) => api.updateWeights(courseId, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
  })
}

export function useUpdateRecommendation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }) => api.updateRecommendation(id, status),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['recommendations'] }),
  })
}

export function useUploadMaterialFile(courseId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ materialId, file }) => {
      const { upload_url } = await api.materialUploadUrl(materialId, {
        file_name: file.name,
        content_type: file.type || 'application/octet-stream',
      })
      await putToStorage(upload_url, file)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['modules', courseId] }),
  })
}
