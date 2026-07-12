import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  VacunacionInput,
  VacunacionesFilters,
  archiveVacunacion,
  createVacunacion,
  createVacunacionesLote,
  fetchVacunaciones,
  purgeVacunacion,
  restoreVacunacion,
  updateVacunacion,
} from './vacunaciones.api'

const KEY = 'ganaderia.vacunaciones'

const invalidateVac = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: [KEY] })
  qc.invalidateQueries({ queryKey: ['ganaderia.dashboard'] })
}

export const useVacunaciones = (filters: VacunacionesFilters) =>
  useQuery({ queryKey: [KEY, filters], queryFn: () => fetchVacunaciones(filters) })

export const useCreateVacunacion = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createVacunacion,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] })
      qc.invalidateQueries({ queryKey: ['ganaderia.dashboard'] })
    },
  })
}

export const useCreateVacunacionesLote = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ input, animalIds }: { input: Omit<VacunacionInput, 'animalId'>; animalIds: string[] }) =>
      createVacunacionesLote(input, animalIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] })
      qc.invalidateQueries({ queryKey: ['ganaderia.dashboard'] })
    },
  })
}

export const useUpdateVacunacion = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: VacunacionInput }) => updateVacunacion(id, data),
    onSuccess: () => invalidateVac(qc),
  })
}

export const useArchiveVacunacion = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: string) => archiveVacunacion(id), onSuccess: () => invalidateVac(qc) })
}
export const useRestoreVacunacion = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: string) => restoreVacunacion(id), onSuccess: () => invalidateVac(qc) })
}
export const usePurgeVacunacion = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: string) => purgeVacunacion(id), onSuccess: () => invalidateVac(qc) })
}
