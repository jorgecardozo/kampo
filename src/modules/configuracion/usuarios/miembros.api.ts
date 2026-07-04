import { supabase } from 'lib/supabase'

export type Rol = 'admin' | 'encargado' | 'editor' | 'lector'

export type Miembro = {
  id: string
  email: string
  nombre: string
  rol: Rol
  accesoTodos: boolean
}

export type MiPermiso = {
  esMiembro: boolean
  rol: Rol | null
  isSuperAdmin: boolean
  puedeEditar: boolean // encargado/editor/admin
  puedeGestionarPermisos: boolean // solo admin
}

type Row = Record<string, any>
const toMiembro = (r: Row): Miembro => ({
  id: r.id,
  email: r.email,
  nombre: r.nombre ?? '',
  rol: r.rol,
  accesoTodos: r.acceso_todos ?? true,
})

// ----- Gestión de miembros de la cuenta (pantalla "Usuarios del campo") ------
export const fetchMiembros = async (): Promise<Miembro[]> => {
  const { data, error } = await supabase.from('miembros').select('*').order('created_at')
  if (error) throw error
  return (data ?? []).map(toMiembro)
}

export const inviteMiembro = async (email: string, rol: Rol, nombre = ''): Promise<Miembro> => {
  const { data, error } = await supabase
    .from('miembros')
    .insert({ email: email.trim().toLowerCase(), rol, nombre })
    .select()
    .single()
  if (error) throw error
  return toMiembro(data)
}

export const updateMiembroRol = async (id: string, rol: Rol): Promise<void> => {
  const { error } = await supabase.from('miembros').update({ rol }).eq('id', id)
  if (error) throw error
}

export const removeMiembro = async (id: string): Promise<void> => {
  const { error } = await supabase.from('miembros').delete().eq('id', id)
  if (error) throw error
}

// ----- Permiso del usuario logueado (por email de Auth0) ---------------------
export const fetchMiPermiso = async (email?: string | null): Promise<MiPermiso> => {
  const base: MiPermiso = {
    esMiembro: false,
    rol: null,
    isSuperAdmin: false,
    puedeEditar: false,
    puedeGestionarPermisos: false,
  }
  if (!email) return base
  const mail = email.trim().toLowerCase()

  const [{ data: miembro }, { data: sa }] = await Promise.all([
    supabase.from('miembros').select('rol').eq('email', mail).maybeSingle(),
    supabase.from('plataforma_admins').select('email').eq('email', mail).maybeSingle(),
  ])

  const isSuperAdmin = !!sa
  const rol = (miembro?.rol as Rol) ?? (isSuperAdmin ? 'admin' : null)
  return {
    esMiembro: !!miembro || isSuperAdmin,
    rol,
    isSuperAdmin,
    puedeEditar: rol === 'admin' || rol === 'encargado' || rol === 'editor',
    puedeGestionarPermisos: rol === 'admin' || isSuperAdmin,
  }
}
