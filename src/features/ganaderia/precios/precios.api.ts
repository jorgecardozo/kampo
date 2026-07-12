import { supabase } from 'lib/supabase'
import { getCampoActual } from 'lib/campoActual'
import type { CategoriaAnimal } from '../shared/types'

export type PrecioKg = { categoria: CategoriaAnimal; precioKg: number }

// Precios por kg del CAMPO actual (cada establecimiento tiene los suyos).
export const fetchPrecios = async (): Promise<PrecioKg[]> => {
  const campo = getCampoActual()
  let q = supabase.from('precios_por_kg').select('*').order('categoria')
  if (campo) q = q.eq('campo_id', campo)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []).map((r) => ({ categoria: r.categoria, precioKg: Number(r.precio_kg ?? 0) }))
}

export const savePrecios = async (precios: PrecioKg[]): Promise<void> => {
  const campo = getCampoActual()
  if (!campo) throw new Error('No hay un campo seleccionado')
  const rows = precios.map((p) => ({
    campo_id: campo,
    categoria: p.categoria,
    precio_kg: Number(p.precioKg) || 0,
  }))
  // upsert por PK compuesta (campo_id, categoria).
  const { error } = await supabase.from('precios_por_kg').upsert(rows, { onConflict: 'campo_id,categoria' })
  if (error) throw error
}
