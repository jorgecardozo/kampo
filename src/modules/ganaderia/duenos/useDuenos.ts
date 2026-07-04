import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Dueno } from '../shared/types'
import {
  archiveDueno,
  createDueno,
  fetchDuenos,
  purgeDueno,
  restoreDueno,
  updateDueno,
} from './duenos.api'

const KEY = 'ganaderia.duenos'

export const useDuenos = (search = '') =>
  useQuery({ queryKey: [KEY, search], queryFn: () => fetchDuenos(search) })

export const useCreateDueno = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createDueno,
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}

export const useUpdateDueno = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Dueno> }) => updateDueno(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}

export const useArchiveDueno = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => archiveDueno(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}

export const useRestoreDueno = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => restoreDueno(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}

export const usePurgeDueno = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => purgeDueno(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}
