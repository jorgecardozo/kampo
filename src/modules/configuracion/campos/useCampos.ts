import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Campo, archiveCampo, createCampo, fetchCampos, updateCampo } from './campos.api'

const KEY = 'config.campos'

// Invalida la lista y el selector de campo del header.
const invalidate = (qc: ReturnType<typeof useQueryClient>) => qc.invalidateQueries({ queryKey: [KEY] })

export const useCampos = () => useQuery({ queryKey: [KEY], queryFn: fetchCampos })

export const useCreateCampo = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: createCampo, onSuccess: () => invalidate(qc) })
}

export const useUpdateCampo = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Campo> }) => updateCampo(id, data),
    onSuccess: () => invalidate(qc),
  })
}

export const useArchiveCampo = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: string) => archiveCampo(id), onSuccess: () => invalidate(qc) })
}
