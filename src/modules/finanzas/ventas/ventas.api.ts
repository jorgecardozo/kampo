import { supabase } from 'lib/supabase'
import { getCampoActual } from 'lib/campoActual'
import { type Page } from '@modules/shared/lib/pagination'

export type AreaVenta = 'campo' | 'ganaderia'

// Línea de venta de un animal: peso × precio/kg = subtotal.
export type VentaAnimalLine = {
  animalId: string
  caravana?: string
  nombre?: string
  categoria?: string
  pesoKg: number
  precioKg: number
}

export type Venta = {
  id: string
  fecha: string
  area: AreaVenta
  concepto: string
  monto: number
  detalle?: string
  animalesCount?: number // cantidad de animales vendidos (0 = ingreso genérico)
}

export type VentasFilters = { search?: string; area?: string; dateFrom?: string; dateTo?: string }

// Input del formulario: si trae `animales`, es una venta de ganado.
export type VentaInput = {
  fecha: string
  area: AreaVenta
  concepto: string
  monto: number
  detalle?: string
  animales?: VentaAnimalLine[]
}

type Row = Record<string, any>
const toVenta = (r: Row): Venta => ({
  id: r.id,
  fecha: r.fecha ?? '',
  area: r.area,
  concepto: r.concepto,
  monto: Number(r.monto ?? 0),
  detalle: r.detalle ?? undefined,
  animalesCount: Array.isArray(r.venta_animales) ? r.venta_animales.length : undefined,
})

const SELECT = '*, venta_animales(id)'

const applyFilters = (q: any, f: VentasFilters) => {
  const campo = getCampoActual()
  if (campo) q = q.eq('campo_id', campo)
  if (f.search) {
    const s = f.search.replace(/[%,]/g, '')
    q = q.or(`concepto.ilike.%${s}%,detalle.ilike.%${s}%`)
  }
  if (f.area) q = q.eq('area', f.area)
  if (f.dateFrom) q = q.gte('fecha', f.dateFrom)
  if (f.dateTo) q = q.lte('fecha', f.dateTo)
  return q
}

// ----- Helpers de estado del animal -----------------------------------------
const setAnimalesEstado = async (ids: string[], estado: 'Activo' | 'Vendido') => {
  if (!ids.length) return
  const { error } = await supabase.from('animales').update({ estado }).in('id', ids)
  if (error) throw error
}

const lineAnimalIds = async (ventaId: string): Promise<string[]> => {
  const { data } = await supabase.from('venta_animales').select('animal_id').eq('venta_id', ventaId)
  return (data ?? []).map((r: any) => r.animal_id)
}

const insertLineas = async (ventaId: string, animales: VentaAnimalLine[]) => {
  if (!animales.length) return
  const rows = animales.map((a) => ({
    venta_id: ventaId,
    animal_id: a.animalId,
    peso_kg: Number(a.pesoKg) || 0,
    precio_kg: Number(a.precioKg) || 0,
    subtotal: (Number(a.pesoKg) || 0) * (Number(a.precioKg) || 0),
  }))
  const { error } = await supabase.from('venta_animales').insert(rows)
  if (error) throw error
  await setAnimalesEstado(animales.map((a) => a.animalId), 'Vendido')
}

// Monto total: si hay animales, es la suma de subtotales; si no, el monto cargado.
const totalDe = (input: VentaInput): number =>
  input.animales?.length
    ? input.animales.reduce((s, a) => s + (Number(a.pesoKg) || 0) * (Number(a.precioKg) || 0), 0)
    : Number(input.monto) || 0

const ventaRow = (input: VentaInput): Row => ({
  fecha: input.fecha || null,
  area: input.area,
  concepto: input.concepto,
  monto: totalDe(input),
  detalle: input.detalle || null,
})

// ----- Queries ---------------------------------------------------------------
export const fetchVentas = async (f: VentasFilters = {}): Promise<Venta[]> => {
  let q = supabase.from('ventas').select(SELECT).is('deleted_at', null).order('fecha', { ascending: false })
  q = applyFilters(q, f)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []).map(toVenta)
}

export const fetchVentasPage = async (
  f: VentasFilters,
  page: number,
  pageSize: number
): Promise<Page<Venta>> => {
  const from = (page - 1) * pageSize
  let q = supabase
    .from('ventas')
    .select(SELECT, { count: 'exact' })
    .is('deleted_at', null)
    .order('fecha', { ascending: false })
    .range(from, from + pageSize - 1)
  q = applyFilters(q, f)
  const { data, error, count } = await q
  if (error) throw error
  return { data: (data ?? []).map(toVenta), total: count ?? 0 }
}

export const fetchVentasArchivedPage = async (
  f: VentasFilters,
  page: number,
  pageSize: number
): Promise<Page<Venta>> => {
  const from = (page - 1) * pageSize
  let q = supabase
    .from('ventas')
    .select(SELECT, { count: 'exact' })
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false })
    .range(from, from + pageSize - 1)
  q = applyFilters(q, f)
  const { data, error, count } = await q
  if (error) throw error
  return { data: (data ?? []).map(toVenta), total: count ?? 0 }
}

// Líneas de animales de una venta (para precargar el formulario de edición).
export const fetchVentaAnimales = async (ventaId: string): Promise<VentaAnimalLine[]> => {
  const { data, error } = await supabase
    .from('venta_animales')
    .select('animal_id, peso_kg, precio_kg, animales(caravana, nombre, categoria)')
    .eq('venta_id', ventaId)
  if (error) throw error
  return (data ?? []).map((r: any) => ({
    animalId: r.animal_id,
    caravana: r.animales?.caravana ?? '',
    nombre: r.animales?.nombre ?? '',
    categoria: r.animales?.categoria ?? '',
    pesoKg: Number(r.peso_kg ?? 0),
    precioKg: Number(r.precio_kg ?? 0),
  }))
}

// ----- Mutaciones ------------------------------------------------------------
export const createVenta = async (input: VentaInput): Promise<Venta> => {
  const row = ventaRow(input)
  const campo = getCampoActual()
  if (campo) row.campo_id = campo
  const { data, error } = await supabase.from('ventas').insert(row).select().single()
  if (error) throw error
  await insertLineas(data.id, input.animales ?? [])
  return toVenta(data)
}

export const updateVenta = async (id: string, input: VentaInput): Promise<Venta> => {
  // Revertir animales de la versión anterior y reemplazar las líneas.
  const prevIds = await lineAnimalIds(id)
  await setAnimalesEstado(prevIds, 'Activo')
  await supabase.from('venta_animales').delete().eq('venta_id', id)

  const { data, error } = await supabase.from('ventas').update(ventaRow(input)).eq('id', id).select().single()
  if (error) throw error
  await insertLineas(id, input.animales ?? [])
  return toVenta(data)
}

// Archivar: saca la venta de la lista y devuelve los animales a 'Activo'.
export const archiveVenta = async (id: string): Promise<void> => {
  await setAnimalesEstado(await lineAnimalIds(id), 'Activo')
  const { error } = await supabase.from('ventas').update({ deleted_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}

export const restoreVenta = async (id: string): Promise<void> => {
  const { error } = await supabase.from('ventas').update({ deleted_at: null }).eq('id', id)
  if (error) throw error
  await setAnimalesEstado(await lineAnimalIds(id), 'Vendido')
}

export const purgeVenta = async (id: string): Promise<void> => {
  // Antes de borrar (cascade elimina las líneas), devolver los animales a 'Activo'.
  await setAnimalesEstado(await lineAnimalIds(id), 'Activo')
  const { error } = await supabase.from('ventas').delete().eq('id', id)
  if (error) throw error
}
