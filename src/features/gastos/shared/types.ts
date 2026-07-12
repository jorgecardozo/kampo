export type AreaGasto = 'campo' | 'ganaderia'

export type CategoriaGasto = {
  id: string
  nombre: string
  area: AreaGasto
}

export type Gasto = {
  id: string
  fecha: string
  categoriaId: string
  categoriaNombre: string
  area: AreaGasto
  descripcion: string
  monto: number
  proveedor: string
  medioPago: string
  campo: string
  responsable: string
}
