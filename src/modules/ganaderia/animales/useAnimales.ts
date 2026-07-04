import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Animal } from '../shared/types'
import {
  AnimalesFilters,
  archiveAnimal,
  createAnimal,
  fetchAnimales,
  purgeAnimal,
  restoreAnimal,
  updateAnimal,
} from './animales.api'

const KEY = 'ganaderia.animales'

export const useAnimales = (filters: AnimalesFilters) =>
  useQuery({
    queryKey: [KEY, filters],
    queryFn: () => fetchAnimales(filters),
  })

export const useCreateAnimal = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createAnimal,
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}

export const useUpdateAnimal = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Animal> }) => updateAnimal(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}

export const useArchiveAnimal = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => archiveAnimal(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}

export const useRestoreAnimal = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => restoreAnimal(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}

export const usePurgeAnimal = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => purgeAnimal(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}
