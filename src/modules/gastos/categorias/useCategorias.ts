import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  archiveCategoria,
  createCategoria,
  fetchCategorias,
  fetchCategoriasConTotales,
  purgeCategoria,
  restoreCategoria,
  updateCategoria,
} from './categorias.api'

const KEY = 'gastos.categorias'

const invalidateCat = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: [KEY] })
  qc.invalidateQueries({ queryKey: ['dashboard.general'] })
}

export const useCategorias = () => useQuery({ queryKey: [KEY], queryFn: fetchCategorias })

export const useCategoriasConTotales = () =>
  useQuery({ queryKey: [KEY, 'totales'], queryFn: fetchCategoriasConTotales })

export const useCreateCategoria = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ nombre, area }: { nombre: string; area: 'campo' | 'ganaderia' }) =>
      createCategoria(nombre, area),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] })
      qc.invalidateQueries({ queryKey: ['dashboard.general'] })
    },
  })
}

export const useUpdateCategoria = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, nombre, area }: { id: string; nombre: string; area: 'campo' | 'ganaderia' }) =>
      updateCategoria(id, nombre, area),
    onSuccess: () => invalidateCat(qc),
  })
}

export const useArchiveCategoria = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: string) => archiveCategoria(id), onSuccess: () => invalidateCat(qc) })
}
export const useRestoreCategoria = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: string) => restoreCategoria(id), onSuccess: () => invalidateCat(qc) })
}
export const usePurgeCategoria = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: string) => purgeCategoria(id), onSuccess: () => invalidateCat(qc) })
}
