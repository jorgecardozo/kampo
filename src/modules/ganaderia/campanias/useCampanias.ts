import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CampaniaInput, archiveCampania, purgeCampania, restoreCampania, updateCampania } from './campanias.api'

const KEY = 'ganaderia.campanias'

const invalidateCamp = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: [KEY] })
  qc.invalidateQueries({ queryKey: ['ganaderia.vacunaciones'] })
  qc.invalidateQueries({ queryKey: ['ganaderia.dashboard'] })
}

export const useUpdateCampania = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: CampaniaInput }) => updateCampania(id, input),
    onSuccess: () => invalidateCamp(qc),
  })
}

export const useArchiveCampania = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: string) => archiveCampania(id), onSuccess: () => invalidateCamp(qc) })
}
export const useRestoreCampania = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: string) => restoreCampania(id), onSuccess: () => invalidateCamp(qc) })
}
export const usePurgeCampania = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: string) => purgeCampania(id), onSuccess: () => invalidateCamp(qc) })
}
