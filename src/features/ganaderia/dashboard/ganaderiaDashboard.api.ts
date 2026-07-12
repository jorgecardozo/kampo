import { daysUntil } from '@features/shared/lib/format'
import { fetchAnimales } from '../animales/animales.api'
import { fetchVacunaciones } from '../vacunaciones/vacunaciones.api'
import { fetchPrecios } from '../precios/precios.api'
import type { Vacunacion } from '../shared/types'

export type GanaderiaMetrics = {
  totalActivos: number
  totalHembras: number
  totalMachos: number
  vencidas: number
  proximas30: number
  costoVacunacion: number
  capitalGanado: number
  porCategoria: { name: string; value: number }[]
  porPotrero: { name: string; value: number }[]
  proximasDosis: Vacunacion[]
}

const countBy = <T>(items: T[], key: (i: T) => string) => {
  const map = new Map<string, number>()
  items.forEach((i) => {
    const k = key(i)
    map.set(k, (map.get(k) ?? 0) + 1)
  })
  return Array.from(map, ([name, value]) => ({ name, value }))
}

export const fetchGanaderiaMetrics = async (): Promise<GanaderiaMetrics> => {
  const [animales, vacunaciones, precios] = await Promise.all([
    fetchAnimales(),
    fetchVacunaciones(),
    fetchPrecios(),
  ])
  const precioDe = (cat: string) => precios.find((p) => p.categoria === cat)?.precioKg ?? 0
  const activos = animales.filter((a) => a.estado === 'Activo')

  let vencidas = 0
  let proximas30 = 0
  vacunaciones.forEach((v) => {
    const d = daysUntil(v.proximaFecha)
    if (d < 0) vencidas++
    else if (d <= 30) proximas30++
  })

  const proximasDosis = [...vacunaciones]
    .filter((v) => daysUntil(v.proximaFecha) >= 0)
    .sort((a, b) => (a.proximaFecha < b.proximaFecha ? -1 : 1))
    .slice(0, 6)

  return {
    totalActivos: activos.length,
    totalHembras: activos.filter((a) => a.sexo === 'Hembra').length,
    totalMachos: activos.filter((a) => a.sexo === 'Macho').length,
    vencidas,
    proximas30,
    costoVacunacion: vacunaciones.reduce((s, v) => s + v.costo, 0),
    capitalGanado: activos.reduce((s, a) => s + a.pesoKg * precioDe(a.categoria), 0),
    porCategoria: countBy(activos, (a) => a.categoria),
    porPotrero: countBy(activos, (a) => a.potrero),
    proximasDosis,
  }
}
