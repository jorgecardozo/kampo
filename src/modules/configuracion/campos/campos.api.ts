import { supabase } from 'lib/supabase'
import { type Page } from '@modules/shared/lib/pagination'

export type Campo = {
  id: string
  nombre: string
  ubicacion: string
  hectareas: number
}

type Row = Record<string, any>
const toCampo = (r: Row): Campo => ({
  id: r.id,
  nombre: r.nombre,
  ubicacion: r.ubicacion ?? '',
  hectareas: Number(r.hectareas ?? 0),
})
const toRow = (c: Partial<Campo>): Row => {
  const r: Row = {}
  if (c.nombre !== undefined) r.nombre = c.nombre
  if (c.ubicacion !== undefined) r.ubicacion = c.ubicacion
  if (c.hectareas !== undefined) r.hectareas = Number(c.hectareas) || 0
  return r
}

// Todos los campos activos de la cuenta (para el selector y la pantalla).
export const fetchCampos = async (): Promise<Campo[]> => {
  const { data, error } = await supabase.from('campos').select('*').is('deleted_at', null).order('nombre')
  if (error) throw error
  return (data ?? []).map(toCampo)
}

export const fetchCamposPage = async (
  _search: string,
  page: number,
  pageSize: number
): Promise<Page<Campo>> => {
  const all = await fetchCampos()
  const start = (page - 1) * pageSize
  return { data: all.slice(start, start + pageSize), total: all.length }
}

export const createCampo = async (data: Omit<Campo, 'id'>): Promise<Campo> => {
  const { data: row, error } = await supabase.from('campos').insert(toRow(data)).select().single()
  if (error) throw error
  return toCampo(row)
}

export const updateCampo = async (id: string, data: Partial<Campo>): Promise<Campo> => {
  const { data: row, error } = await supabase.from('campos').update(toRow(data)).eq('id', id).select().single()
  if (error) throw error
  return toCampo(row)
}

export const archiveCampo = async (id: string): Promise<void> => {
  const { error } = await supabase.from('campos').update({ deleted_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
