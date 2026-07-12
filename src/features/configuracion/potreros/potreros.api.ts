import { supabase } from 'lib/supabase'
import { getCampoActual } from 'lib/campoActual'
import { type Page } from '@features/shared/lib/pagination'

export type Potrero = {
  id: string
  nombre: string
  hectareas: number
  ubicacion: string
  capacidad: number
}

type Row = Record<string, any>
const toPotrero = (r: Row): Potrero => ({
  id: r.id,
  nombre: r.nombre,
  hectareas: Number(r.hectareas),
  ubicacion: r.ubicacion ?? '',
  capacidad: Number(r.capacidad),
})
const toRow = (p: Partial<Potrero>): Row => {
  const r: Row = {}
  if (p.nombre !== undefined) r.nombre = p.nombre
  if (p.hectareas !== undefined) r.hectareas = p.hectareas
  if (p.ubicacion !== undefined) r.ubicacion = p.ubicacion
  if (p.capacidad !== undefined) r.capacidad = p.capacidad
  return r
}

export const fetchPotreros = async (): Promise<Potrero[]> => {
  let q = supabase.from('potreros').select('*').is('deleted_at', null).order('nombre')
  const campo = getCampoActual()
  if (campo) q = q.eq('campo_id', campo)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []).map(toPotrero)
}

export const fetchPotrerosPage = async (
  _search: string,
  page: number,
  pageSize: number
): Promise<Page<Potrero>> => {
  const from = (page - 1) * pageSize
  let q = supabase
    .from('potreros')
    .select('*', { count: 'exact' })
    .is('deleted_at', null)
    .order('nombre')
    .range(from, from + pageSize - 1)
  const campo = getCampoActual()
  if (campo) q = q.eq('campo_id', campo)
  const { data, error, count } = await q
  if (error) throw error
  return { data: (data ?? []).map(toPotrero), total: count ?? 0 }
}

export const fetchPotrerosArchivedPage = async (
  _search: string,
  page: number,
  pageSize: number
): Promise<Page<Potrero>> => {
  const from = (page - 1) * pageSize
  const { data, error, count } = await supabase
    .from('potreros')
    .select('*', { count: 'exact' })
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false })
    .range(from, from + pageSize - 1)
  if (error) throw error
  return { data: (data ?? []).map(toPotrero), total: count ?? 0 }
}

export const createPotrero = async (data: Omit<Potrero, 'id'>): Promise<Potrero> => {
  const row = toRow(data)
  const campo = getCampoActual()
  if (campo) row.campo_id = campo
  const { data: created, error } = await supabase.from('potreros').insert(row).select().single()
  if (error) throw error
  return toPotrero(created)
}

export const updatePotrero = async (id: string, data: Partial<Potrero>): Promise<Potrero> => {
  const { data: row, error } = await supabase.from('potreros').update(toRow(data)).eq('id', id).select().single()
  if (error) throw error
  return toPotrero(row)
}

export const archivePotrero = async (id: string): Promise<void> => {
  const { error } = await supabase.from('potreros').update({ deleted_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
export const restorePotrero = async (id: string): Promise<void> => {
  const { error } = await supabase.from('potreros').update({ deleted_at: null }).eq('id', id)
  if (error) throw error
}
export const purgePotrero = async (id: string): Promise<void> => {
  const { error } = await supabase.from('potreros').delete().eq('id', id)
  if (error) throw error
}
