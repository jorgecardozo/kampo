import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Veterinario } from '../shared/types'
import {
  archiveVeterinario,
  createVeterinario,
  fetchVeterinarios,
  purgeVeterinario,
  restoreVeterinario,
  updateVeterinario,
} from './veterinarios.api'

const KEY = 'ganaderia.veterinarios'

export const useVeterinarios = (search = '') =>
  useQuery({ queryKey: [KEY, search], queryFn: () => fetchVeterinarios(search) })

export const useCreateVeterinario = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createVeterinario,
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}

export const useUpdateVeterinario = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Veterinario> }) => updateVeterinario(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}

export const useArchiveVeterinario = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: string) => archiveVeterinario(id), onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }) })
}
export const useRestoreVeterinario = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: string) => restoreVeterinario(id), onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }) })
}
export const usePurgeVeterinario = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: string) => purgeVeterinario(id), onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }) })
}
