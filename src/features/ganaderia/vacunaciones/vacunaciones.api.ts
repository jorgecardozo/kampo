import { supabase } from 'lib/supabase'
import { getCampoActual } from 'lib/campoActual'
import { addDays, toISODate } from '@features/shared/lib/format'
import { type Page } from '@features/shared/lib/pagination'
import type { Vacunacion } from '../shared/types'

export type VacunacionesFilters = {
  search?: string
  tipoVacunaId?: string
  dateField?: 'aplicacion' | 'proxima'
  dateFrom?: string
  dateTo?: string
}

// Datos que envía el formulario; el resto se deriva acá (nombres + próxima fecha).
export type VacunacionInput = {
  animalId: string
  tipoVacunaId: string
  fechaAplicacion: string
  veterinarioId: string
  loteProducto: string
  costo: number
  observaciones?: string
}

// Traemos los nombres relacionados con embeds (joins) en la misma consulta.
const SELECT = '*, animales(caravana), tipos_vacuna(nombre), veterinarios(nombre)'

type Row = Record<string, any>
const toVacunacion = (r: Row): Vacunacion => ({
  id: r.id,
  animalId: r.animal_id,
  animalCaravana: r.animales?.caravana ?? '—',
  tipoVacunaId: r.tipo_vacuna_id,
  tipoVacunaNombre: r.tipos_vacuna?.nombre ?? '—',
  fechaAplicacion: r.fecha_aplicacion ?? '',
  proximaFecha: r.proxima_fecha ?? '',
  veterinarioId: r.veterinario_id ?? '',
  veterinarioNombre: r.veterinarios?.nombre ?? '—',
  loteProducto: r.lote_producto ?? '',
  dosis: r.dosis ?? '',
  costo: Number(r.costo ?? 0),
  observaciones: r.observaciones ?? undefined,
  campaniaId: r.campania_id ?? undefined,
})

// Periodicidad y dosis del tipo de vacuna (para calcular próxima fecha + dosis).
const tipoInfo = async (tipoVacunaId: string): Promise<{ periodicidadDias: number; dosis: string }> => {
  const { data } = await supabase
    .from('tipos_vacuna')
    .select('periodicidad_dias, dosis')
    .eq('id', tipoVacunaId)
    .single()
  return { periodicidadDias: Number(data?.periodicidad_dias ?? 0), dosis: data?.dosis ?? '' }
}

const calcProxima = (fechaAplicacion: string, periodicidadDias: number): string =>
  periodicidadDias > 0 ? toISODate(addDays(new Date(fechaAplicacion), periodicidadDias)) : fechaAplicacion

export const fetchVacunaciones = async (f: VacunacionesFilters = {}): Promise<Vacunacion[]> => {
  let q = supabase
    .from('vacunaciones')
    .select(SELECT)
    .is('deleted_at', null)
    .order('proxima_fecha', { ascending: true })
  const campo = getCampoActual()
  if (campo) q = q.eq('campo_id', campo)
  if (f.tipoVacunaId) q = q.eq('tipo_vacuna_id', f.tipoVacunaId)
  if (f.dateFrom || f.dateTo) {
    const col = f.dateField === 'proxima' ? 'proxima_fecha' : 'fecha_aplicacion'
    if (f.dateFrom) q = q.gte(col, f.dateFrom)
    if (f.dateTo) q = q.lte(col, f.dateTo)
  }
  const { data, error } = await q
  if (error) throw error
  let res = (data ?? []).map(toVacunacion)
  // Búsqueda por nombres relacionados: se aplica en memoria (escala de campo).
  if (f.search) {
    const s = f.search.toLowerCase()
    res = res.filter(
      (v) =>
        v.animalCaravana.toLowerCase().includes(s) ||
        v.tipoVacunaNombre.toLowerCase().includes(s) ||
        v.veterinarioNombre.toLowerCase().includes(s)
    )
  }
  return res
}

export const fetchVacunacionesPage = async (
  f: VacunacionesFilters,
  page: number,
  pageSize: number
): Promise<Page<Vacunacion>> => {
  const all = await fetchVacunaciones(f)
  const start = (page - 1) * pageSize
  return { data: all.slice(start, start + pageSize), total: all.length }
}

export const fetchVacunacionesArchivedPage = async (
  f: VacunacionesFilters,
  page: number,
  pageSize: number
): Promise<Page<Vacunacion>> => {
  let aq = supabase
    .from('vacunaciones')
    .select(SELECT)
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false })
  const campoA = getCampoActual()
  if (campoA) aq = aq.eq('campo_id', campoA)
  const { data, error } = await aq
  if (error) throw error
  let res = (data ?? []).map(toVacunacion)
  if (f.search) {
    const s = f.search.toLowerCase()
    res = res.filter(
      (v) =>
        v.animalCaravana.toLowerCase().includes(s) ||
        v.tipoVacunaNombre.toLowerCase().includes(s) ||
        v.veterinarioNombre.toLowerCase().includes(s)
    )
  }
  const start = (page - 1) * pageSize
  return { data: res.slice(start, start + pageSize), total: res.length }
}

export const fetchVacunacionById = async (id: string): Promise<Vacunacion | null> => {
  const { data, error } = await supabase.from('vacunaciones').select(SELECT).eq('id', id).maybeSingle()
  if (error) throw error
  return data ? toVacunacion(data) : null
}

// Historial de vacunaciones de un animal (para el drawer del animal).
export const fetchVacunacionesByAnimal = async (animalId: string): Promise<Vacunacion[]> => {
  const { data, error } = await supabase
    .from('vacunaciones')
    .select(SELECT)
    .eq('animal_id', animalId)
    .is('deleted_at', null)
    .order('fecha_aplicacion', { ascending: false })
  if (error) throw error
  return (data ?? []).map(toVacunacion)
}

export const createVacunacion = async (input: VacunacionInput): Promise<Vacunacion> => {
  const { periodicidadDias, dosis } = await tipoInfo(input.tipoVacunaId)
  const row = {
    animal_id: input.animalId,
    tipo_vacuna_id: input.tipoVacunaId,
    veterinario_id: input.veterinarioId || null,
    fecha_aplicacion: input.fechaAplicacion || null,
    proxima_fecha: calcProxima(input.fechaAplicacion, periodicidadDias),
    lote_producto: input.loteProducto || '',
    dosis,
    costo: Number(input.costo) || 0,
    observaciones: input.observaciones || null,
    ...(getCampoActual() ? { campo_id: getCampoActual() } : {}),
  }
  const { data, error } = await supabase.from('vacunaciones').insert(row).select(SELECT).single()
  if (error) throw error
  return toVacunacion(data)
}

// Vacunación en lote: crea la campaña y una vacunación por animal seleccionado.
export const createVacunacionesLote = async (
  input: Omit<VacunacionInput, 'animalId'>,
  animalIds: string[]
): Promise<number> => {
  const { periodicidadDias, dosis } = await tipoInfo(input.tipoVacunaId)
  const proxima = calcProxima(input.fechaAplicacion, periodicidadDias)

  const campo = getCampoActual()
  const { data: campania, error: cErr } = await supabase
    .from('campanias')
    .insert({
      fecha_aplicacion: input.fechaAplicacion || null,
      proxima_fecha: proxima,
      tipo_vacuna_id: input.tipoVacunaId,
      veterinario_id: input.veterinarioId || null,
      lote_producto: input.loteProducto || '',
      costo: Number(input.costo) || 0,
      observaciones: input.observaciones || null,
      ...(campo ? { campo_id: campo } : {}),
    })
    .select('id')
    .single()
  if (cErr) throw cErr

  const rows = animalIds.map((animalId) => ({
    animal_id: animalId,
    tipo_vacuna_id: input.tipoVacunaId,
    veterinario_id: input.veterinarioId || null,
    campania_id: campania.id,
    fecha_aplicacion: input.fechaAplicacion || null,
    proxima_fecha: proxima,
    lote_producto: input.loteProducto || '',
    dosis,
    costo: Number(input.costo) || 0,
    observaciones: input.observaciones || null,
    ...(campo ? { campo_id: campo } : {}),
  }))
  const { error } = await supabase.from('vacunaciones').insert(rows)
  if (error) throw error
  return animalIds.length
}

export const updateVacunacion = async (id: string, input: VacunacionInput): Promise<Vacunacion> => {
  const { periodicidadDias, dosis } = await tipoInfo(input.tipoVacunaId)
  const row = {
    animal_id: input.animalId,
    tipo_vacuna_id: input.tipoVacunaId,
    veterinario_id: input.veterinarioId || null,
    fecha_aplicacion: input.fechaAplicacion || null,
    proxima_fecha: calcProxima(input.fechaAplicacion, periodicidadDias),
    lote_producto: input.loteProducto || '',
    dosis,
    costo: Number(input.costo) || 0,
    observaciones: input.observaciones || null,
  }
  const { data, error } = await supabase.from('vacunaciones').update(row).eq('id', id).select(SELECT).single()
  if (error) throw error
  return toVacunacion(data)
}

export const archiveVacunacion = async (id: string): Promise<void> => {
  const { error } = await supabase.from('vacunaciones').update({ deleted_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
export const restoreVacunacion = async (id: string): Promise<void> => {
  const { error } = await supabase.from('vacunaciones').update({ deleted_at: null }).eq('id', id)
  if (error) throw error
}
export const purgeVacunacion = async (id: string): Promise<void> => {
  const { error } = await supabase.from('vacunaciones').delete().eq('id', id)
  if (error) throw error
}
