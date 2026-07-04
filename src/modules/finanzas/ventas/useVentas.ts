import { useMutation, useQueryClient } from '@tanstack/react-query'
import { VentaInput, archiveVenta, createVenta, purgeVenta, restoreVenta, updateVenta } from './ventas.api'

const KEY = 'finanzas.ventas'

const invalidate = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: [KEY] })
  qc.invalidateQueries({ queryKey: ['dashboard.general'] })
  // La venta de ganado cambia el estado de los animales → refrescar hacienda y dashboard.
  qc.invalidateQueries({ queryKey: ['ganaderia.animales'] })
  qc.invalidateQueries({ queryKey: ['ganaderia.dashboard'] })
}

export const useCreateVenta = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: createVenta, onSuccess: () => invalidate(qc) })
}

export const useUpdateVenta = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: VentaInput }) => updateVenta(id, input),
    onSuccess: () => invalidate(qc),
  })
}

export const useArchiveVenta = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: string) => archiveVenta(id), onSuccess: () => invalidate(qc) })
}
export const useRestoreVenta = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: string) => restoreVenta(id), onSuccess: () => invalidate(qc) })
}
export const usePurgeVenta = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: string) => purgeVenta(id), onSuccess: () => invalidate(qc) })
}
