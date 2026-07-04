import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { TipoVacuna } from '../shared/types'
import {
  archiveTipoVacuna,
  createTipoVacuna,
  fetchTiposVacuna,
  purgeTipoVacuna,
  restoreTipoVacuna,
  updateTipoVacuna,
} from './tiposVacuna.api'

const KEY = 'ganaderia.tiposVacuna'

export const useTiposVacuna = (search = '') =>
  useQuery({ queryKey: [KEY, search], queryFn: () => fetchTiposVacuna(search) })

export const useCreateTipoVacuna = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createTipoVacuna,
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}

export const useUpdateTipoVacuna = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TipoVacuna> }) => updateTipoVacuna(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}

export const useArchiveTipoVacuna = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: string) => archiveTipoVacuna(id), onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }) })
}
export const useRestoreTipoVacuna = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: string) => restoreTipoVacuna(id), onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }) })
}
export const usePurgeTipoVacuna = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: string) => purgeTipoVacuna(id), onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }) })
}
