import { supabase } from 'lib/supabase'
import { getCampoActual } from 'lib/campoActual'
import { addDays, toISODate } from '@modules/shared/lib/format'
import { type Page } from '@modules/shared/lib/pagination'
import type { Campania, Vacunacion } from '../shared/types'

export type CampaniaConTotal = Campania & { cantidad: number; costoTotal: number }

const SELECT = '*, tipos_vacuna(nombre), veterinarios(nombre)'
const SELECT_VAC = '*, animales(caravana), tipos_vacuna(nombre), veterinarios(nombre)'

type Row = Record<string, any>
const toCampania = (r: Row): Campania => ({
  id: r.id,
  fechaAplicacion: r.fecha_aplicacion ?? '',
  proximaFecha: r.proxima_fecha ?? '',
  tipoVacunaId: r.tipo_vacuna_id,
  tipoVacunaNombre: r.tipos_vacuna?.nombre ?? '—',
  veterinarioId: r.veterinario_id ?? '',
  veterinarioNombre: r.veterinarios?.nombre ?? '—',
  loteProducto: r.lote_producto ?? '',
  costo: Number(r.costo ?? 0),
  observaciones: r.observaciones ?? undefined,
  createdAt: r.created_at ?? r.fecha_aplicacion ?? '',
})

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

export const fetchCampaniasPage = async (
  search: string,
  page: number,
  pageSize: number
): Promise<Page<CampaniaConTotal>> => {
  let cq = supabase
    .from('campanias')
    .select(SELECT)
    .is('deleted_at', null)
    .order('fecha_aplicacion', { ascending: false })
  const campo = getCampoActual()
  if (campo) cq = cq.eq('campo_id', campo)
  const { data, error } = await cq
  if (error) throw error

  // Totales (cantidad de animales + costo) por campaña, desde sus vacunaciones.
  const { data: vac, error: vErr } = await supabase
    .from('vacunaciones')
    .select('campania_id, costo')
    .is('deleted_at', null)
    .not('campania_id', 'is', null)
  if (vErr) throw vErr

  let campanias = (data ?? []).map(toCampania).map((c): CampaniaConTotal => {
    const items = (vac ?? []).filter((v: any) => v.campania_id === c.id)
    return { ...c, cantidad: items.length, costoTotal: items.reduce((s: number, v: any) => s + Number(v.costo || 0), 0) }
  })

  if (search) {
    const q = search.toLowerCase()
    campanias = campanias.filter(
      (c) => c.tipoVacunaNombre.toLowerCase().includes(q) || c.veterinarioNombre.toLowerCase().includes(q)
    )
  }

  const start = (page - 1) * pageSize
  return { data: campanias.slice(start, start + pageSize), total: campanias.length }
}

export const fetchCampaniaById = async (id: string): Promise<Campania | null> => {
  const { data, error } = await supabase.from('campanias').select(SELECT).eq('id', id).maybeSingle()
  if (error) throw error
  return data ? toCampania(data) : null
}

export const fetchVacunacionesByCampania = async (id: string): Promise<Vacunacion[]> => {
  const { data, error } = await supabase
    .from('vacunaciones')
    .select(SELECT_VAC)
    .eq('campania_id', id)
    .is('deleted_at', null)
    .order('fecha_aplicacion', { ascending: false })
  if (error) throw error
  return (data ?? []).map(toVacunacion)
}

export type CampaniaInput = {
  fechaAplicacion: string
  veterinarioId: string
  loteProducto: string
  costo: number
  observaciones?: string
}

// Editar la campaña propaga los cambios a todas sus vacunaciones (vet, fecha,
// lote, costo y próxima dosis recalculada).
export const updateCampania = async (id: string, input: CampaniaInput): Promise<Campania> => {
  // Tipo de vacuna de la campaña → periodicidad para recalcular próxima fecha.
  const { data: camp } = await supabase.from('campanias').select('tipo_vacuna_id').eq('id', id).single()
  let periodicidadDias = 0
  if (camp?.tipo_vacuna_id) {
    const { data: tipo } = await supabase
      .from('tipos_vacuna')
      .select('periodicidad_dias')
      .eq('id', camp.tipo_vacuna_id)
      .single()
    periodicidadDias = Number(tipo?.periodicidad_dias ?? 0)
  }
  const proxima =
    periodicidadDias > 0 ? toISODate(addDays(new Date(input.fechaAplicacion), periodicidadDias)) : input.fechaAplicacion

  const patch = {
    fecha_aplicacion: input.fechaAplicacion || null,
    proxima_fecha: proxima,
    veterinario_id: input.veterinarioId || null,
    lote_producto: input.loteProducto || '',
    costo: Number(input.costo) || 0,
    observaciones: input.observaciones || null,
  }

  const { data, error } = await supabase.from('campanias').update(patch).eq('id', id).select(SELECT).single()
  if (error) throw error

  // Propagar a las aplicaciones de la campaña (sin tocar el animal ni el tipo).
  const { error: pErr } = await supabase
    .from('vacunaciones')
    .update({
      fecha_aplicacion: input.fechaAplicacion || null,
      proxima_fecha: proxima,
      veterinario_id: input.veterinarioId || null,
      lote_producto: input.loteProducto || '',
      costo: Number(input.costo) || 0,
    })
    .eq('campania_id', id)
  if (pErr) throw pErr

  return toCampania(data)
}

export const fetchCampaniasArchivedPage = async (
  search: string,
  page: number,
  pageSize: number
): Promise<Page<CampaniaConTotal>> => {
  let aq = supabase
    .from('campanias')
    .select(SELECT)
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false })
  const campo = getCampoActual()
  if (campo) aq = aq.eq('campo_id', campo)
  const { data, error } = await aq
  if (error) throw error
  const { data: vac } = await supabase
    .from('vacunaciones')
    .select('campania_id, costo')
    .not('campania_id', 'is', null)
  let campanias = (data ?? []).map(toCampania).map((c): CampaniaConTotal => {
    const items = (vac ?? []).filter((v: any) => v.campania_id === c.id)
    return { ...c, cantidad: items.length, costoTotal: items.reduce((s: number, v: any) => s + Number(v.costo || 0), 0) }
  })
  if (search) {
    const q = search.toLowerCase()
    campanias = campanias.filter(
      (c) => c.tipoVacunaNombre.toLowerCase().includes(q) || c.veterinarioNombre.toLowerCase().includes(q)
    )
  }
  const start = (page - 1) * pageSize
  return { data: campanias.slice(start, start + pageSize), total: campanias.length }
}

export const purgeCampania = async (id: string): Promise<void> => {
  const { error } = await supabase.from('campanias').delete().eq('id', id)
  if (error) throw error
}

export const archiveCampania = async (id: string): Promise<void> => {
  const { error } = await supabase.from('campanias').update({ deleted_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
export const restoreCampania = async (id: string): Promise<void> => {
  const { error } = await supabase.from('campanias').update({ deleted_at: null }).eq('id', id)
  if (error) throw error
}
