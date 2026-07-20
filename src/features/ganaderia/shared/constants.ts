import type { CategoriaAnimal, EstadoAnimal, SexoAnimal, ViaAplicacion } from './types'

export const CATEGORIAS: CategoriaAnimal[] = ['Ternero/a', 'Vaquillona', 'Novillo', 'Vaca', 'Toro']
export const SEXOS: SexoAnimal[] = ['Hembra', 'Macho']

// Peso estimado (kg) por categoría. Se usa para autocompletar el peso al crear un
// animal sin peso, así el capital (peso × precio/kg) no queda en 0 hasta pesarlo.
export const PESO_ESTIMADO_POR_CATEGORIA: Record<CategoriaAnimal, number> = {
  'Ternero/a': 180,
  Vaquillona: 320,
  Novillo: 430,
  Vaca: 480,
  Toro: 600,
}
export const pesoEstimado = (categoria: string): number =>
  PESO_ESTIMADO_POR_CATEGORIA[categoria as CategoriaAnimal] ?? 0
export const ESTADOS: EstadoAnimal[] = ['Activo', 'Vendido', 'Muerto']
export const VIAS: ViaAplicacion[] = ['Subcutánea', 'Intramuscular', 'Oral', 'Intranasal']

export const RAZAS = [
  'Angus',
  'Hereford',
  'Brangus',
  'Braford',
  'Holando',
  'Criollo',
  'Limousin',
]

export const COLORES = ['Negro', 'Colorado', 'Overo', 'Barcino', 'Blanco', 'Tobiano']

export const POTREROS = [
  'Potrero 1 - Norte',
  'Potrero 2 - Sur',
  'Potrero 3 - Laguna',
  'Potrero 4 - Monte',
  'Corral Central',
]
