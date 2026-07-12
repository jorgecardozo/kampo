import { supabase } from 'lib/supabase'
import { type Page } from '@features/shared/lib/pagination'
import type { TipoVacuna } from '../shared/types'

type Row = Record<string, any>
const toTipo = (r: Row): TipoVacuna => ({
  id: r.id,
  nombre: r.nombre,
  enfermedad: r.enfermedad ?? '',
  periodicidadDias: r.periodicidad_dias ?? 0,
  dosis: r.dosis ?? '',
  via: r.via,
  obligatoria: r.obligatoria ?? false,
})
const toRow = (t: Partial<TipoVacuna>): Row => {
  const r: Row = {}
  if (t.nombre !== undefined) r.nombre = t.nombre
  if (t.enfermedad !== undefined) r.enfermedad = t.enfermedad
  if (t.periodicidadDias !== undefined) r.periodicidad_dias = t.periodicidadDias
  if (t.dosis !== undefined) r.dosis = t.dosis
  if (t.via !== undefined) r.via = t.via
  if (t.obligatoria !== undefined) r.obligatoria = t.obligatoria
  return r
}
const applySearch = (q: any, search: string) => {
  if (!search) return q
  const s = search.replace(/[%,]/g, '')
  return q.or(`nombre.ilike.%${s}%,enfermedad.ilike.%${s}%`)
}

export const fetchTiposVacuna = async (search = ''): Promise<TipoVacuna[]> => {
  let q = supabase.from('tipos_vacuna').select('*').is('deleted_at', null).order('nombre')
  q = applySearch(q, search)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []).map(toTipo)
}

export const fetchTiposVacunaPage = async (
  search: string,
  page: number,
  pageSize: number
): Promise<Page<TipoVacuna>> => {
  const from = (page - 1) * pageSize
  let q = supabase
    .from('tipos_vacuna')
    .select('*', { count: 'exact' })
    .is('deleted_at', null)
    .order('nombre')
    .range(from, from + pageSize - 1)
  q = applySearch(q, search)
  const { data, error, count } = await q
  if (error) throw error
  return { data: (data ?? []).map(toTipo), total: count ?? 0 }
}

export const fetchTiposVacunaArchivedPage = async (
  search: string,
  page: number,
  pageSize: number
): Promise<Page<TipoVacuna>> => {
  const from = (page - 1) * pageSize
  let q = supabase
    .from('tipos_vacuna')
    .select('*', { count: 'exact' })
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false })
    .range(from, from + pageSize - 1)
  q = applySearch(q, search)
  const { data, error, count } = await q
  if (error) throw error
  return { data: (data ?? []).map(toTipo), total: count ?? 0 }
}

export const createTipoVacuna = async (data: Omit<TipoVacuna, 'id'>): Promise<TipoVacuna> => {
  const { data: row, error } = await supabase.from('tipos_vacuna').insert(toRow(data)).select().single()
  if (error) throw error
  return toTipo(row)
}

export const updateTipoVacuna = async (id: string, data: Partial<TipoVacuna>): Promise<TipoVacuna> => {
  const { data: row, error } = await supabase.from('tipos_vacuna').update(toRow(data)).eq('id', id).select().single()
  if (error) throw error
  return toTipo(row)
}

export const archiveTipoVacuna = async (id: string): Promise<void> => {
  const { error } = await supabase.from('tipos_vacuna').update({ deleted_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
export const restoreTipoVacuna = async (id: string): Promise<void> => {
  const { error } = await supabase.from('tipos_vacuna').update({ deleted_at: null }).eq('id', id)
  if (error) throw error
}
export const purgeTipoVacuna = async (id: string): Promise<void> => {
  const { error } = await supabase.from('tipos_vacuna').delete().eq('id', id)
  if (error) throw error
}
