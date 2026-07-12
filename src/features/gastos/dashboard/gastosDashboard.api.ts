import { fetchGastos } from '../gastos/gastos.api'
import type { Gasto } from '../shared/types'

export type GastosMetrics = {
  totalGeneral: number
  totalMes: number
  cantidadMes: number
  promedioGasto: number
  porCategoria: { name: string; value: number }[]
  porCampo: { name: string; value: number }[]
  tendencia: { name: string; total: number }[]
  ultimos: Gasto[]
}

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const sumBy = (items: Gasto[], key: (g: Gasto) => string) => {
  const map = new Map<string, number>()
  items.forEach((g) => map.set(key(g), (map.get(key(g)) ?? 0) + g.monto))
  return Array.from(map, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
}

export const fetchGastosMetrics = async (): Promise<GastosMetrics> => {
  const gastos = await fetchGastos()
  const now = new Date()
  const mesActual = now.getMonth()
  const anioActual = now.getFullYear()

  const delMes = gastos.filter((g) => {
    const d = new Date(g.fecha)
    return d.getMonth() === mesActual && d.getFullYear() === anioActual
  })

  // Tendencia últimos 6 meses.
  const tendencia: { name: string; total: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const ref = new Date(anioActual, mesActual - i, 1)
    const total = gastos
      .filter((g) => {
        const d = new Date(g.fecha)
        return d.getMonth() === ref.getMonth() && d.getFullYear() === ref.getFullYear()
      })
      .reduce((s, g) => s + g.monto, 0)
    tendencia.push({ name: MESES[ref.getMonth()], total })
  }

  return {
    totalGeneral: gastos.reduce((s, g) => s + g.monto, 0),
    totalMes: delMes.reduce((s, g) => s + g.monto, 0),
    cantidadMes: delMes.length,
    promedioGasto: gastos.length ? Math.round(gastos.reduce((s, g) => s + g.monto, 0) / gastos.length) : 0,
    porCategoria: sumBy(gastos, (g) => g.categoriaNombre),
    porCampo: sumBy(gastos, (g) => g.campo),
    tendencia,
    ultimos: [...gastos].slice(0, 6),
  }
}
