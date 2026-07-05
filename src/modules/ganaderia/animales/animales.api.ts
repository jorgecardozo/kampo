import { supabase } from 'lib/supabase'
import { getCampoActual } from 'lib/campoActual'
import { type Page } from '@modules/shared/lib/pagination'
import type { Animal } from '../shared/types'

// Valor especial para filtrar los animales SIN dueño asignado.
export const SIN_DUENO = '__sin_dueno__'

export type AnimalesFilters = {
  search?: string
  categoria?: string
  estado?: string
  dueno?: string
  dateFrom?: string
  dateTo?: string
}

// ----- Mapeo fila Postgres (snake_case) <-> Animal (camelCase) ---------------
type Row = Record<string, any>

const toAnimal = (r: Row): Animal => ({
  id: r.id,
  caravana: r.caravana,
  nombre: r.nombre ?? undefined,
  categoria: r.categoria,
  raza: r.raza,
  sexo: r.sexo,
  fechaNacimiento: r.fecha_nacimiento ?? '',
  pesoKg: Number(r.peso_kg ?? 0),
  color: r.color ?? '',
  potrero: r.potrero ?? '',
  dueno: r.dueno ?? '',
  estado: r.estado,
  fechaIngreso: r.fecha_ingreso ?? '',
  observaciones: r.observaciones ?? undefined,
})

const toRow = (a: Partial<Animal>): Row => {
  const r: Row = {}
  if (a.caravana !== undefined) r.caravana = a.caravana?.trim() ? a.caravana.trim() : null
  if (a.nombre !== undefined) r.nombre = a.nombre || null
  if (a.categoria !== undefined) r.categoria = a.categoria
  if (a.raza !== undefined) r.raza = a.raza
  if (a.sexo !== undefined) r.sexo = a.sexo
  if (a.fechaNacimiento !== undefined) r.fecha_nacimiento = a.fechaNacimiento || null
  if (a.pesoKg !== undefined) r.peso_kg = Number(a.pesoKg) || 0
  if (a.color !== undefined) r.color = a.color
  if (a.potrero !== undefined) r.potrero = a.potrero
  if (a.dueno !== undefined) r.dueno = a.dueno
  if (a.estado !== undefined) r.estado = a.estado
  if (a.fechaIngreso !== undefined) r.fecha_ingreso = a.fechaIngreso || null
  if (a.observaciones !== undefined) r.observaciones = a.observaciones || null
  return r
}

// Aplica los filtros comunes sobre un query builder de supabase.
const applyFilters = (q: any, f: AnimalesFilters) => {
  const campo = getCampoActual()
  if (campo) q = q.eq('campo_id', campo)
  if (f.search) {
    const s = f.search.replace(/[%,]/g, '')
    q = q.or(`caravana.ilike.%${s}%,raza.ilike.%${s}%,nombre.ilike.%${s}%`)
  }
  if (f.categoria) q = q.eq('categoria', f.categoria)
  if (f.estado) q = q.eq('estado', f.estado)
  if (f.dueno === SIN_DUENO) q = q.or('dueno.is.null,dueno.eq.')
  else if (f.dueno) q = q.eq('dueno', f.dueno)
  if (f.dateFrom) q = q.gte('fecha_ingreso', f.dateFrom)
  if (f.dateTo) q = q.lte('fecha_ingreso', f.dateTo)
  return q
}

export const fetchAnimales = async (f: AnimalesFilters = {}): Promise<Animal[]> => {
  let q = supabase.from('animales').select('*').is('deleted_at', null).order('caravana', { ascending: true })
  q = applyFilters(q, f)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []).map(toAnimal)
}

export const fetchAnimalesPage = async (
  f: AnimalesFilters,
  page: number,
  pageSize: number
): Promise<Page<Animal>> => {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  let q = supabase
    .from('animales')
    .select('*', { count: 'exact' })
    .is('deleted_at', null)
    .order('caravana', { ascending: true })
    .range(from, to)
  q = applyFilters(q, f)
  const { data, error, count } = await q
  if (error) throw error
  return { data: (data ?? []).map(toAnimal), total: count ?? 0 }
}

// Papelera: animales archivados (deleted_at no nulo), más recientes primero.
export const fetchAnimalesArchivedPage = async (
  f: AnimalesFilters,
  page: number,
  pageSize: number
): Promise<Page<Animal>> => {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  let q = supabase
    .from('animales')
    .select('*', { count: 'exact' })
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false })
    .range(from, to)
  q = applyFilters(q, f)
  const { data, error, count } = await q
  if (error) throw error
  return { data: (data ?? []).map(toAnimal), total: count ?? 0 }
}

// Próximo código automático "V-###" (mira todas las caravanas con ese patrón,
// incluidas las archivadas, para no repetir números).
const nextAutoCaravana = async (): Promise<string> => {
  const { data } = await supabase.from('animales').select('caravana').ilike('caravana', 'V-%')
  let max = 0
  for (const r of data ?? []) {
    const m = /^V-(\d+)$/.exec((r as any).caravana ?? '')
    if (m) max = Math.max(max, parseInt(m[1], 10))
  }
  return `V-${String(max + 1).padStart(3, '0')}`
}

export const createAnimal = async (data: Omit<Animal, 'id'>): Promise<Animal> => {
  const row = toRow(data)
  // Sin caravana → se asigna un código correlativo automático (V-001, V-002…).
  if (!row.caravana) row.caravana = await nextAutoCaravana()
  const campo = getCampoActual()
  if (campo) row.campo_id = campo
  const { data: created, error } = await supabase.from('animales').insert(row).select().single()
  if (error) throw error
  return toAnimal(created)
}

export const updateAnimal = async (id: string, data: Partial<Animal>): Promise<Animal> => {
  const { data: row, error } = await supabase
    .from('animales')
    .update(toRow(data))
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return toAnimal(row)
}

// Soft delete: marca deleted_at. El registro sale de las listas pero sigue
// existiendo (las relaciones se mantienen) y se puede restaurar.
export const archiveAnimal = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('animales')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export const restoreAnimal = async (id: string): Promise<void> => {
  const { error } = await supabase.from('animales').update({ deleted_at: null }).eq('id', id)
  if (error) throw error
}

// Borrado físico definitivo (solo desde la Papelera, con confirmación).
export const purgeAnimal = async (id: string): Promise<void> => {
  const { error } = await supabase.from('animales').delete().eq('id', id)
  if (error) throw error
}
