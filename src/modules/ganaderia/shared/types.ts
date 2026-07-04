export type CategoriaAnimal = 'Ternero/a' | 'Vaquillona' | 'Novillo' | 'Vaca' | 'Toro'
export type SexoAnimal = 'Hembra' | 'Macho'
export type EstadoAnimal = 'Activo' | 'Vendido' | 'Muerto'
export type ViaAplicacion = 'Subcutánea' | 'Intramuscular' | 'Oral' | 'Intranasal'

export type Dueno = {
  id: string
  nombre: string
  alias: string
  telefono: string
  email: string
  documento: string
}

export type Animal = {
  id: string
  caravana: string
  nombre?: string
  categoria: CategoriaAnimal
  raza: string
  sexo: SexoAnimal
  fechaNacimiento: string
  pesoKg: number
  color: string
  potrero: string
  dueno: string
  estado: EstadoAnimal
  fechaIngreso: string
  observaciones?: string
}

export type Veterinario = {
  id: string
  nombre: string
  matricula: string
  telefono: string
  email: string
}

export type TipoVacuna = {
  id: string
  nombre: string
  enfermedad: string
  periodicidadDias: number
  dosis: string
  via: ViaAplicacion
  obligatoria: boolean
}

export type Vacunacion = {
  id: string
  animalId: string
  animalCaravana: string
  tipoVacunaId: string
  tipoVacunaNombre: string
  fechaAplicacion: string
  proximaFecha: string
  veterinarioId: string
  veterinarioNombre: string
  loteProducto: string
  dosis: string
  costo: number
  observaciones?: string
  campaniaId?: string
}

// Campaña de vacunación: agrupa varias vacunaciones cargadas juntas (mismo
// tipo, fecha, veterinario, lote). Editarla propaga los cambios a sus aplicaciones.
export type Campania = {
  id: string
  fechaAplicacion: string
  proximaFecha: string
  tipoVacunaId: string
  tipoVacunaNombre: string
  veterinarioId: string
  veterinarioNombre: string
  loteProducto: string
  costo: number
  observaciones?: string
  createdAt: string
}
