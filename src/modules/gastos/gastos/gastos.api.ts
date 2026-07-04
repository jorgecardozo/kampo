import { supabase } from 'lib/supabase'
import { getCampoActual } from 'lib/campoActual'
import { type Page } from '@modules/shared/lib/pagination'
import type { AreaGasto, Gasto } from '../shared/types'

export type GastosFilters = {
  search?: string
  categoriaId?: string
  campo?: string
  dateFrom?: string
  dateTo?: string
}

export type GastoInput = Omit<Gasto, 'id' | 'categoriaNombre' | 'area'>

// Embebemos la categoría para traer su nombre y área en la misma consulta.
const SELECT = '*, categorias_gasto(nombre, area)'

type Row = Record<string, any>
const toGasto = (r: Row): Gasto => ({
  id: r.id,
  fecha: r.fecha ?? '',
  categoriaId: r.categoria_id,
  categoriaNombre: r.categorias_gasto?.nombre ?? '—',
  area: (r.area ?? r.categorias_gasto?.area ?? 'campo') as AreaGasto,
  descripcion: r.descripcion ?? '',
  monto: Number(r.monto ?? 0),
  proveedor: r.proveedor ?? '',
  medioPago: r.medio_pago ?? '',
  campo: r.campo ?? '',
  responsable: r.responsable ?? '',
})

// Área de una categoría (se copia a la fila de gasto, como hacía el mock).
const categoriaArea = async (categoriaId: string): Promise<AreaGasto> => {
  const { data } = await supabase.from('categorias_gasto').select('area').eq('id', categoriaId).single()
  return (data?.area ?? 'campo') as AreaGasto
}

const toRow = (input: GastoInput, area: AreaGasto): Row => ({
  fecha: input.fecha || null,
  categoria_id: input.categoriaId,
  area,
  descripcion: input.descripcion,
  monto: Number(input.monto) || 0,
  proveedor: input.proveedor || '',
  medio_pago: input.medioPago || '',
  campo: input.campo || '',
  responsable: input.responsable || '',
})

const applyFilters = (q: any, f: GastosFilters) => {
  const campo = getCampoActual()
  if (campo) q = q.eq('campo_id', campo)
  if (f.search) {
    const s = f.search.replace(/[%,]/g, '')
    q = q.or(`descripcion.ilike.%${s}%,proveedor.ilike.%${s}%`)
  }
  if (f.categoriaId) q = q.eq('categoria_id', f.categoriaId)
  if (f.campo) q = q.eq('campo', f.campo)
  if (f.dateFrom) q = q.gte('fecha', f.dateFrom)
  if (f.dateTo) q = q.lte('fecha', f.dateTo)
  return q
}

export const fetchGastos = async (f: GastosFilters = {}): Promise<Gasto[]> => {
  let q = supabase.from('gastos').select(SELECT).is('deleted_at', null).order('fecha', { ascending: false })
  q = applyFilters(q, f)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []).map(toGasto)
}

export const fetchGastosPage = async (
  f: GastosFilters,
  page: number,
  pageSize: number
): Promise<Page<Gasto>> => {
  const from = (page - 1) * pageSize
  let q = supabase
    .from('gastos')
    .select(SELECT, { count: 'exact' })
    .is('deleted_at', null)
    .order('fecha', { ascending: false })
    .range(from, from + pageSize - 1)
  q = applyFilters(q, f)
  const { data, error, count } = await q
  if (error) throw error
  return { data: (data ?? []).map(toGasto), total: count ?? 0 }
}

export const fetchGastosArchivedPage = async (
  f: GastosFilters,
  page: number,
  pageSize: number
): Promise<Page<Gasto>> => {
  const from = (page - 1) * pageSize
  let q = supabase
    .from('gastos')
    .select(SELECT, { count: 'exact' })
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false })
    .range(from, from + pageSize - 1)
  q = applyFilters(q, f)
  const { data, error, count } = await q
  if (error) throw error
  return { data: (data ?? []).map(toGasto), total: count ?? 0 }
}

export const createGasto = async (input: GastoInput): Promise<Gasto> => {
  const area = await categoriaArea(input.categoriaId)
  const row = toRow(input, area)
  const campo = getCampoActual()
  if (campo) row.campo_id = campo
  const { data, error } = await supabase.from('gastos').insert(row).select(SELECT).single()
  if (error) throw error
  return toGasto(data)
}

export const updateGasto = async (id: string, input: GastoInput): Promise<Gasto> => {
  const area = await categoriaArea(input.categoriaId)
  const { data, error } = await supabase.from('gastos').update(toRow(input, area)).eq('id', id).select(SELECT).single()
  if (error) throw error
  return toGasto(data)
}

export const archiveGasto = async (id: string): Promise<void> => {
  const { error } = await supabase.from('gastos').update({ deleted_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
export const restoreGasto = async (id: string): Promise<void> => {
  const { error } = await supabase.from('gastos').update({ deleted_at: null }).eq('id', id)
  if (error) throw error
}
export const purgeGasto = async (id: string): Promise<void> => {
  const { error } = await supabase.from('gastos').delete().eq('id', id)
  if (error) throw error
}
