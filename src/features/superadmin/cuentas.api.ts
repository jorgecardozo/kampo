import { supabase } from 'lib/supabase'

export type CuentaMiembro = { email: string; nombre: string; rol: string }

export type Cuenta = {
  id: string
  nombre: string
  contacto: string
  telefono: string
  createdAt: string
  activa: boolean
  campos: number
  miembros: CuentaMiembro[]
}

// Todas las cuentas del SaaS con sus usuarios y cantidad de campos (super-admin).
export const fetchCuentas = async (): Promise<Cuenta[]> => {
  const { data, error } = await supabase
    .from('cuentas')
    .select('id, nombre, contacto, telefono, created_at, deleted_at, miembros(email, nombre, rol), campos(id)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map((r: any) => ({
    id: r.id,
    nombre: r.nombre,
    contacto: r.contacto ?? '',
    telefono: r.telefono ?? '',
    createdAt: r.created_at ?? '',
    activa: !r.deleted_at,
    campos: Array.isArray(r.campos) ? r.campos.length : 0,
    miembros: Array.isArray(r.miembros)
      ? r.miembros.map((m: any) => ({ email: m.email, nombre: m.nombre ?? '', rol: m.rol }))
      : [],
  }))
}

export type NuevaCuenta = { nombre: string; adminEmail: string; contacto?: string; telefono?: string }

// Crea una cuenta nueva con su Admin y un campo por defecto.
export const createCuentaConAdmin = async (input: NuevaCuenta): Promise<void> => {
  const { data: cuenta, error } = await supabase
    .from('cuentas')
    .insert({ nombre: input.nombre, contacto: input.contacto ?? '', telefono: input.telefono ?? '' })
    .select('id')
    .single()
  if (error) throw error

  const { error: mErr } = await supabase
    .from('miembros')
    .insert({ cuenta_id: cuenta.id, email: input.adminEmail.trim().toLowerCase(), rol: 'admin' })
  if (mErr) throw mErr

  const { error: cErr } = await supabase.from('campos').insert({ cuenta_id: cuenta.id, nombre: 'Mi campo' })
  if (cErr) throw cErr
}

// Suspender / reactivar una cuenta (bloquea o restaura el acceso de sus miembros).
export const setCuentaActiva = async (id: string, activa: boolean): Promise<void> => {
  const { error } = await supabase
    .from('cuentas')
    .update({ deleted_at: activa ? null : new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}
