import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  GastoInput,
  GastosFilters,
  archiveGasto,
  createGasto,
  fetchGastos,
  purgeGasto,
  restoreGasto,
  updateGasto,
} from './gastos.api'

const KEY = 'gastos.lista'

const invalidateGasto = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: [KEY] })
  qc.invalidateQueries({ queryKey: ['gastos.dashboard'] })
  qc.invalidateQueries({ queryKey: ['dashboard.general'] })
}

export const useGastos = (filters: GastosFilters) =>
  useQuery({ queryKey: [KEY, filters], queryFn: () => fetchGastos(filters) })

export const useCreateGasto = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createGasto,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] })
      qc.invalidateQueries({ queryKey: ['gastos.dashboard'] })
    },
  })
}

export const useUpdateGasto = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: GastoInput }) => updateGasto(id, data),
    onSuccess: () => invalidateGasto(qc),
  })
}

export const useArchiveGasto = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: string) => archiveGasto(id), onSuccess: () => invalidateGasto(qc) })
}
export const useRestoreGasto = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: string) => restoreGasto(id), onSuccess: () => invalidateGasto(qc) })
}
export const usePurgeGasto = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: string) => purgeGasto(id), onSuccess: () => invalidateGasto(qc) })
}
