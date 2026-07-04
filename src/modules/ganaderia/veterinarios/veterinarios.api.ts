import { supabase } from 'lib/supabase'
import { type Page } from '@modules/shared/lib/pagination'
import type { Veterinario } from '../shared/types'

type Row = Record<string, any>
const toVet = (r: Row): Veterinario => ({
  id: r.id,
  nombre: r.nombre,
  matricula: r.matricula ?? '',
  telefono: r.telefono ?? '',
  email: r.email ?? '',
})
const toRow = (v: Partial<Veterinario>): Row => {
  const r: Row = {}
  if (v.nombre !== undefined) r.nombre = v.nombre
  if (v.matricula !== undefined) r.matricula = v.matricula
  if (v.telefono !== undefined) r.telefono = v.telefono
  if (v.email !== undefined) r.email = v.email
  return r
}
const applySearch = (q: any, search: string) => {
  if (!search) return q
  const s = search.replace(/[%,]/g, '')
  return q.or(`nombre.ilike.%${s}%,matricula.ilike.%${s}%`)
}

export const fetchVeterinarios = async (search = ''): Promise<Veterinario[]> => {
  let q = supabase.from('veterinarios').select('*').is('deleted_at', null).order('nombre')
  q = applySearch(q, search)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []).map(toVet)
}

export const fetchVeterinariosPage = async (
  search: string,
  page: number,
  pageSize: number
): Promise<Page<Veterinario>> => {
  const from = (page - 1) * pageSize
  let q = supabase
    .from('veterinarios')
    .select('*', { count: 'exact' })
    .is('deleted_at', null)
    .order('nombre')
    .range(from, from + pageSize - 1)
  q = applySearch(q, search)
  const { data, error, count } = await q
  if (error) throw error
  return { data: (data ?? []).map(toVet), total: count ?? 0 }
}

export const fetchVeterinariosArchivedPage = async (
  search: string,
  page: number,
  pageSize: number
): Promise<Page<Veterinario>> => {
  const from = (page - 1) * pageSize
  let q = supabase
    .from('veterinarios')
    .select('*', { count: 'exact' })
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false })
    .range(from, from + pageSize - 1)
  q = applySearch(q, search)
  const { data, error, count } = await q
  if (error) throw error
  return { data: (data ?? []).map(toVet), total: count ?? 0 }
}

export const createVeterinario = async (data: Omit<Veterinario, 'id'>): Promise<Veterinario> => {
  const { data: row, error } = await supabase.from('veterinarios').insert(toRow(data)).select().single()
  if (error) throw error
  return toVet(row)
}

export const updateVeterinario = async (id: string, data: Partial<Veterinario>): Promise<Veterinario> => {
  const { data: row, error } = await supabase.from('veterinarios').update(toRow(data)).eq('id', id).select().single()
  if (error) throw error
  return toVet(row)
}

export const archiveVeterinario = async (id: string): Promise<void> => {
  const { error } = await supabase.from('veterinarios').update({ deleted_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
export const restoreVeterinario = async (id: string): Promise<void> => {
  const { error } = await supabase.from('veterinarios').update({ deleted_at: null }).eq('id', id)
  if (error) throw error
}
export const purgeVeterinario = async (id: string): Promise<void> => {
  const { error } = await supabase.from('veterinarios').delete().eq('id', id)
  if (error) throw error
}
