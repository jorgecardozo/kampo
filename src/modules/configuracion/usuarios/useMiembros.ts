import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Rol, fetchMiembros, inviteMiembro, removeMiembro, updateMiembroRol } from './miembros.api'

const KEY = 'config.miembros'

const invalidate = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: [KEY] })
  qc.invalidateQueries({ queryKey: ['permisos'] })
}

export const useMiembros = () => useQuery({ queryKey: [KEY], queryFn: fetchMiembros })

export const useInviteMiembro = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ email, rol, nombre }: { email: string; rol: Rol; nombre?: string }) =>
      inviteMiembro(email, rol, nombre),
    onSuccess: () => invalidate(qc),
  })
}

export const useUpdateMiembroRol = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, rol }: { id: string; rol: Rol }) => updateMiembroRol(id, rol),
    onSuccess: () => invalidate(qc),
  })
}

export const useRemoveMiembro = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: string) => removeMiembro(id), onSuccess: () => invalidate(qc) })
}
