import { supabase } from 'lib/supabase'
import { type Page } from '@modules/shared/lib/pagination'
import type { Dueno } from '../shared/types'

type Row = Record<string, any>

const toDueno = (r: Row): Dueno => ({
  id: r.id,
  nombre: r.nombre,
  alias: r.alias ?? '',
  telefono: r.telefono ?? '',
  email: r.email ?? '',
  documento: r.documento ?? '',
})

const toRow = (d: Partial<Dueno>): Row => {
  const r: Row = {}
  if (d.nombre !== undefined) r.nombre = d.nombre
  if (d.alias !== undefined) r.alias = d.alias
  if (d.telefono !== undefined) r.telefono = d.telefono
  if (d.email !== undefined) r.email = d.email
  if (d.documento !== undefined) r.documento = d.documento
  return r
}

const applySearch = (q: any, search: string) => {
  if (!search) return q
  const s = search.replace(/[%,]/g, '')
  return q.or(`nombre.ilike.%${s}%,alias.ilike.%${s}%,documento.ilike.%${s}%`)
}

export const fetchDuenos = async (search = ''): Promise<Dueno[]> => {
  let q = supabase.from('duenos').select('*').is('deleted_at', null).order('nombre', { ascending: true })
  q = applySearch(q, search)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []).map(toDueno)
}

export const fetchDuenosPage = async (
  search: string,
  page: number,
  pageSize: number
): Promise<Page<Dueno>> => {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  let q = supabase
    .from('duenos')
    .select('*', { count: 'exact' })
    .is('deleted_at', null)
    .order('nombre', { ascending: true })
    .range(from, to)
  q = applySearch(q, search)
  const { data, error, count } = await q
  if (error) throw error
  return { data: (data ?? []).map(toDueno), total: count ?? 0 }
}

export const fetchDuenosArchivedPage = async (
  search: string,
  page: number,
  pageSize: number
): Promise<Page<Dueno>> => {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  let q = supabase
    .from('duenos')
    .select('*', { count: 'exact' })
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false })
    .range(from, to)
  q = applySearch(q, search)
  const { data, error, count } = await q
  if (error) throw error
  return { data: (data ?? []).map(toDueno), total: count ?? 0 }
}

export const createDueno = async (data: Omit<Dueno, 'id'>): Promise<Dueno> => {
  const { data: row, error } = await supabase.from('duenos').insert(toRow(data)).select().single()
  if (error) throw error
  return toDueno(row)
}

export const updateDueno = async (id: string, data: Partial<Dueno>): Promise<Dueno> => {
  const { data: row, error } = await supabase
    .from('duenos')
    .update(toRow(data))
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return toDueno(row)
}

export const archiveDueno = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('duenos')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export const restoreDueno = async (id: string): Promise<void> => {
  const { error } = await supabase.from('duenos').update({ deleted_at: null }).eq('id', id)
  if (error) throw error
}

export const purgeDueno = async (id: string): Promise<void> => {
  const { error } = await supabase.from('duenos').delete().eq('id', id)
  if (error) throw error
}
