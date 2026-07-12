import { createContext, useContext, ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useUser } from '@auth0/nextjs-auth0/client'
import { Rol, fetchMiPermiso } from '@features/configuracion/usuarios/miembros.api'

type PermisosCtx = {
  rol: Rol | null
  isSuperAdmin: boolean
  puedeEditar: boolean
  puedeGestionarPermisos: boolean
  loading: boolean
}

// Por defecto (cargando / sin auth / usuario aún no dado de alta como miembro)
// dejamos acceso completo, para no bloquear al dueño mientras configura.
// El candado real es la Fase 2 (RLS). Acá solo ocultamos acciones al Lector.
const Ctx = createContext<PermisosCtx>({
  rol: null,
  isSuperAdmin: false,
  puedeEditar: true,
  puedeGestionarPermisos: true,
  loading: true,
})

export const PermisosProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser()
  const email = (user?.email as string) || null

  const { data, isLoading } = useQuery({
    queryKey: ['permisos', email],
    queryFn: () => fetchMiPermiso(email),
    enabled: !!email,
  })

  const rol = data?.rol ?? null
  const value: PermisosCtx = {
    rol,
    isSuperAdmin: data?.isSuperAdmin ?? false,
    // Solo restringimos si SABEMOS que es lector. Sin rol asignado = acceso pleno (bootstrap).
    puedeEditar: rol ? rol !== 'lector' : true,
    puedeGestionarPermisos: rol ? rol === 'admin' || (data?.isSuperAdmin ?? false) : true,
    loading: isLoading,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const usePermisos = () => useContext(Ctx)
