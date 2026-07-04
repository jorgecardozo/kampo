import { supabase } from 'lib/supabase'
import { type Page } from '@modules/shared/lib/pagination'
import type { AreaGasto, CategoriaGasto } from '../shared/types'

export type CategoriaConTotal = CategoriaGasto & { totalGastado: number; cantidad: number }

type Row = Record<string, any>
const toCategoria = (r: Row): CategoriaGasto => ({ id: r.id, nombre: r.nombre, area: r.area })

// Trae los gastos activos (solo categoria_id + monto) para calcular totales.
const fetchGastosResumen = async (): Promise<{ categoria_id: string; monto: number }[]> => {
  const { data, error } = await supabase
    .from('gastos')
    .select('categoria_id, monto')
    .is('deleted_at', null)
  if (error) throw error
  return (data ?? []) as any
}

const withTotales = (cats: CategoriaGasto[], gastos: { categoria_id: string; monto: number }[]): CategoriaConTotal[] =>
  cats.map((c) => {
    const items = gastos.filter((g) => g.categoria_id === c.id)
    return { ...c, cantidad: items.length, totalGastado: items.reduce((s, g) => s + Number(g.monto || 0), 0) }
  })

export const fetchCategorias = async (): Promise<CategoriaGasto[]> => {
  const { data, error } = await supabase
    .from('categorias_gasto')
    .select('*')
    .is('deleted_at', null)
    .order('nombre')
  if (error) throw error
  return (data ?? []).map(toCategoria)
}

export const fetchCategoriasConTotales = async (): Promise<CategoriaConTotal[]> => {
  const [cats, gastos] = await Promise.all([fetchCategorias(), fetchGastosResumen()])
  return withTotales(cats, gastos)
}

export const fetchCategoriasConTotalesPage = async (
  _search: string,
  page: number,
  pageSize: number
): Promise<Page<CategoriaConTotal>> => {
  const all = await fetchCategoriasConTotales()
  const start = (page - 1) * pageSize
  return { data: all.slice(start, start + pageSize), total: all.length }
}

export const fetchCategoriasArchivedPage = async (
  _search: string,
  page: number,
  pageSize: number
): Promise<Page<CategoriaConTotal>> => {
  const { data, error } = await supabase
    .from('categorias_gasto')
    .select('*')
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false })
  if (error) throw error
  const gastos = await fetchGastosResumen()
  const all = withTotales((data ?? []).map(toCategoria), gastos)
  const start = (page - 1) * pageSize
  return { data: all.slice(start, start + pageSize), total: all.length }
}

export const createCategoria = async (nombre: string, area: AreaGasto): Promise<CategoriaGasto> => {
  const { data, error } = await supabase.from('categorias_gasto').insert({ nombre, area }).select().single()
  if (error) throw error
  return toCategoria(data)
}

export const updateCategoria = async (id: string, nombre: string, area: AreaGasto): Promise<CategoriaGasto> => {
  const { data, error } = await supabase
    .from('categorias_gasto')
    .update({ nombre, area })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return toCategoria(data)
}

export const archiveCategoria = async (id: string): Promise<void> => {
  const { error } = await supabase.from('categorias_gasto').update({ deleted_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
export const restoreCategoria = async (id: string): Promise<void> => {
  const { error } = await supabase.from('categorias_gasto').update({ deleted_at: null }).eq('id', id)
  if (error) throw error
}
export const purgeCategoria = async (id: string): Promise<void> => {
  const { error } = await supabase.from('categorias_gasto').delete().eq('id', id)
  if (error) throw error
}
