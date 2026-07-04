import { fetchGastos } from '@modules/gastos/gastos/gastos.api'
import { fetchAnimales } from '@modules/ganaderia/animales/animales.api'
import { fetchPrecios } from '@modules/ganaderia/precios/precios.api'
import { fetchVentas } from '../ventas/ventas.api'

type AreaResultado = { ingresos: number; gastos: number; resultado: number }

export type GeneralMetrics = {
  ingresos: number
  gastosTotal: number
  resultado: number
  capitalGanado: number
  cabezas: number
  campo: AreaResultado
  ganaderia: AreaResultado
}

export const fetchGeneralMetrics = async (): Promise<GeneralMetrics> => {
  const [gastos, ventas, animales, precios] = await Promise.all([
    fetchGastos(),
    fetchVentas(),
    fetchAnimales(),
    fetchPrecios(),
  ])
  const precioDe = (cat: string) => precios.find((p) => p.categoria === cat)?.precioKg ?? 0

  const sum = (arr: { monto: number }[]) => arr.reduce((s, x) => s + x.monto, 0)

  const gCampo = sum(gastos.filter((g) => g.area === 'campo'))
  const gGan = sum(gastos.filter((g) => g.area === 'ganaderia'))
  const vCampo = sum(ventas.filter((v) => v.area === 'campo'))
  const vGan = sum(ventas.filter((v) => v.area === 'ganaderia'))

  const activos = animales.filter((a) => a.estado === 'Activo')
  const capitalGanado = activos.reduce((s, a) => s + a.pesoKg * precioDe(a.categoria), 0)

  const campo: AreaResultado = { ingresos: vCampo, gastos: gCampo, resultado: vCampo - gCampo }
  const ganaderia: AreaResultado = { ingresos: vGan, gastos: gGan, resultado: vGan - gGan }

  return {
    ingresos: vCampo + vGan,
    gastosTotal: gCampo + gGan,
    resultado: vCampo + vGan - (gCampo + gGan),
    capitalGanado,
    cabezas: activos.length,
    campo,
    ganaderia,
  }
}
