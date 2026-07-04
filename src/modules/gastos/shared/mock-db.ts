// Base de datos mock en memoria del dominio Gastos del Campo.
import { addDays, nextId, toISODate } from '@modules/shared/lib/format'
import { CAMPOS, CATEGORIAS_INICIALES, MEDIOS_PAGO, PROVEEDORES, RESPONSABLES } from './constants'
import type { AreaGasto, CategoriaGasto, Gasto } from './types'

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

// Área por defecto de cada categoría inicial (editable después).
const AREA_POR_CATEGORIA: Record<string, AreaGasto> = {
  Veterinaria: 'ganaderia',
  'Alimento/Forraje': 'ganaderia',
  Semillas: 'campo',
  Fertilizantes: 'campo',
  Agroquímicos: 'campo',
  Combustible: 'campo',
  'Mano de obra': 'campo',
  Maquinaria: 'campo',
  Servicios: 'campo',
  Impuestos: 'campo',
  Otros: 'campo',
}

// --- Categorías ---
export const categorias: CategoriaGasto[] = CATEGORIAS_INICIALES.map((nombre, i) => ({
  id: `cat-${i + 1}`,
  nombre,
  area: AREA_POR_CATEGORIA[nombre] ?? 'campo',
}))

const descripcionPorCategoria: Record<string, string[]> = {
  Semillas: ['Semilla de maíz', 'Semilla de soja', 'Semilla de pasturas'],
  Fertilizantes: ['Urea x tonelada', 'Fosfato diamónico', 'Fertilizante foliar'],
  Agroquímicos: ['Glifosato', 'Herbicida selectivo', 'Insecticida'],
  Combustible: ['Gasoil tractores', 'Nafta camioneta', 'Lubricantes'],
  'Mano de obra': ['Jornales cosecha', 'Pago peones', 'Changas'],
  Maquinaria: ['Repuesto tractor', 'Service cosechadora', 'Alquiler maquinaria'],
  Veterinaria: ['Vacunas hacienda', 'Antiparasitario', 'Visita veterinario'],
  'Alimento/Forraje': ['Rollos de alfalfa', 'Balanceado', 'Sales minerales'],
  Servicios: ['Energía eléctrica', 'Internet rural', 'Flete'],
  Impuestos: ['Inmobiliario rural', 'Tasa vial', 'Ingresos brutos'],
  Otros: ['Gastos varios', 'Herramientas', 'Insumos generales'],
}

const buildGastos = (n: number): Gasto[] => {
  const out: Gasto[] = []
  for (let i = 1; i <= n; i++) {
    const cat = pick(categorias)
    const descs = descripcionPorCategoria[cat.nombre] ?? ['Gasto']
    out.push({
      id: `gasto-${i}`,
      fecha: toISODate(addDays(new Date(), -randInt(0, 175))),
      categoriaId: cat.id,
      categoriaNombre: cat.nombre,
      area: cat.area,
      descripcion: pick(descs),
      monto: randInt(5, 480) * 1000,
      proveedor: pick(PROVEEDORES),
      medioPago: pick(MEDIOS_PAGO),
      campo: pick(CAMPOS),
      responsable: pick(RESPONSABLES),
    })
  }
  return out.sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
}

export const gastos: Gasto[] = buildGastos(48)

export const addGasto = (data: Omit<Gasto, 'id'>): Gasto => {
  const gasto: Gasto = { ...data, id: `gasto-${nextId()}` }
  gastos.unshift(gasto)
  return gasto
}

export const addCategoria = (nombre: string, area: AreaGasto): CategoriaGasto => {
  const cat: CategoriaGasto = { id: `cat-${nextId()}`, nombre, area }
  categorias.push(cat)
  return cat
}

export const updateGasto = (id: string, data: Partial<Gasto>): Gasto => {
  const idx = gastos.findIndex((g) => g.id === id)
  if (idx === -1) throw new Error('Gasto no encontrado')
  gastos[idx] = { ...gastos[idx], ...data, id }
  return gastos[idx]
}

export const updateCategoria = (id: string, nombre: string, area: AreaGasto): CategoriaGasto => {
  const idx = categorias.findIndex((c) => c.id === id)
  if (idx === -1) throw new Error('Categoría no encontrada')
  categorias[idx] = { ...categorias[idx], nombre, area, id }
  return categorias[idx]
}
