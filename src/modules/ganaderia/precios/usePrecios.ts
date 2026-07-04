import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PrecioKg, fetchPrecios, savePrecios } from './precios.api'

const KEY = 'ganaderia.precios'

export const usePrecios = () => useQuery({ queryKey: [KEY], queryFn: fetchPrecios })

export const useSavePrecios = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (precios: PrecioKg[]) => savePrecios(precios),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] })
      qc.invalidateQueries({ queryKey: ['ganaderia.dashboard'] })
      qc.invalidateQueries({ queryKey: ['dashboard.general'] })
    },
  })
}
