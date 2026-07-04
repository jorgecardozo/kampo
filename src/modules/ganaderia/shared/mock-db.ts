// Base de datos mock en memoria del dominio Ganadería.
// Fuente única de datos para las vistas (animales, vacunaciones) y el dashboard.
import { addDays, nextId, toISODate } from '@modules/shared/lib/format'
import { COLORES, POTREROS, RAZAS } from './constants'
import type { Animal, Campania, Dueno, TipoVacuna, Vacunacion, Veterinario } from './types'

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

// --- Veterinarios ---
export const veterinarios: Veterinario[] = [
  { id: 'vet-1', nombre: 'Dr. Martín Quiroga', matricula: 'MV-1042', telefono: '+54 9 351 555-1042', email: 'mquiroga@vet.com' },
  { id: 'vet-2', nombre: 'Dra. Lucía Ferreyra', matricula: 'MV-2087', telefono: '+54 9 351 555-2087', email: 'lferreyra@vet.com' },
  { id: 'vet-3', nombre: 'Dr. Pablo Andrade', matricula: 'MV-3311', telefono: '+54 9 351 555-3311', email: 'pandrade@vet.com' },
]

// --- Tipos de vacuna ---
export const tiposVacuna: TipoVacuna[] = [
  { id: 'tv-1', nombre: 'Aftosa', enfermedad: 'Fiebre aftosa', periodicidadDias: 180, dosis: '2 ml', via: 'Subcutánea', obligatoria: true },
  { id: 'tv-2', nombre: 'Brucelosis', enfermedad: 'Brucelosis bovina', periodicidadDias: 365, dosis: '2 ml', via: 'Subcutánea', obligatoria: true },
  { id: 'tv-3', nombre: 'Carbunclo', enfermedad: 'Carbunclo bacteridiano', periodicidadDias: 365, dosis: '1 ml', via: 'Subcutánea', obligatoria: true },
  { id: 'tv-4', nombre: 'Clostridiales', enfermedad: 'Mancha y gangrena', periodicidadDias: 180, dosis: '5 ml', via: 'Subcutánea', obligatoria: false },
  { id: 'tv-5', nombre: 'Diarrea Neonatal', enfermedad: 'Diarrea de terneros', periodicidadDias: 365, dosis: '2 ml', via: 'Intramuscular', obligatoria: false },
  { id: 'tv-6', nombre: 'Desparasitación', enfermedad: 'Parásitos internos', periodicidadDias: 90, dosis: '10 ml', via: 'Oral', obligatoria: false },
]

// --- Precio por kg (vivo) por categoría ---
import type { CategoriaAnimal } from './types'
export const preciosPorKg: { categoria: CategoriaAnimal; precioKg: number }[] = [
  { categoria: 'Ternero/a', precioKg: 2800 },
  { categoria: 'Vaquillona', precioKg: 2500 },
  { categoria: 'Novillo', precioKg: 2600 },
  { categoria: 'Vaca', precioKg: 2200 },
  { categoria: 'Toro', precioKg: 2400 },
]
export const precioDeCategoria = (categoria: string): number =>
  preciosPorKg.find((p) => p.categoria === categoria)?.precioKg ?? 0
export const updatePrecioPorKg = (categoria: CategoriaAnimal, precioKg: number) => {
  const row = preciosPorKg.find((p) => p.categoria === categoria)
  if (row) row.precioKg = precioKg
}

// --- Dueños ---
export const duenos: Dueno[] = [
  { id: 'due-1', nombre: 'Jorge Cardozo', alias: 'Yo', telefono: '+54 9 351 555-1000', email: 'jorge@campo.com', documento: '20-12345678-9' },
  { id: 'due-2', nombre: 'Papá', alias: 'Papá', telefono: '+54 9 351 555-2000', email: '', documento: '20-23456789-0' },
  { id: 'due-3', nombre: 'Sociedad El Campo', alias: 'Sociedad', telefono: '', email: 'sociedad@campo.com', documento: '30-34567890-1' },
]

// --- Animales ---
const categoriasPorSexo = {
  Hembra: ['Ternero/a', 'Vaquillona', 'Vaca'] as const,
  Macho: ['Ternero/a', 'Novillo', 'Toro'] as const,
}

const buildAnimales = (n: number): Animal[] => {
  const out: Animal[] = []
  for (let i = 1; i <= n; i++) {
    const sexo = Math.random() > 0.45 ? 'Hembra' : 'Macho'
    const categoria = pick([...categoriasPorSexo[sexo]])
    const nacimiento = addDays(new Date(), -randInt(120, 2200))
    const ingreso = addDays(nacimiento, randInt(0, 60))
    out.push({
      id: `an-${i}`,
      caravana: `AR-${String(1000 + i)}`,
      nombre: Math.random() > 0.7 ? pick(['Manchada', 'Negra', 'Lucero', 'Estrella', 'Pampa', 'Rubia']) : undefined,
      categoria,
      raza: pick(RAZAS),
      sexo,
      fechaNacimiento: toISODate(nacimiento),
      pesoKg: randInt(45, 620),
      color: pick(COLORES),
      potrero: pick(POTREROS),
      dueno: pick(duenos).nombre,
      estado: Math.random() > 0.92 ? pick(['Vendido', 'Muerto'] as const) : 'Activo',
      fechaIngreso: toISODate(ingreso),
    })
  }
  return out
}

export const animales: Animal[] = buildAnimales(28)

// --- Vacunaciones (cada animal activo recibe 1-3 aplicaciones) ---
const buildVacunaciones = (): Vacunacion[] => {
  const out: Vacunacion[] = []
  let seq = 0
  animales
    .filter((a) => a.estado === 'Activo')
    .forEach((animal) => {
      const cant = randInt(1, 3)
      const usados = new Set<string>()
      for (let j = 0; j < cant; j++) {
        const tipo = pick(tiposVacuna)
        if (usados.has(tipo.id)) continue
        usados.add(tipo.id)
        const vet = pick(veterinarios)
        // Última aplicación: entre hace 30 y 360 días → algunas próximas/vencidas.
        const aplicacion = addDays(new Date(), -randInt(30, 360))
        const proxima = addDays(aplicacion, tipo.periodicidadDias)
        seq++
        out.push({
          id: `vac-${seq}`,
          animalId: animal.id,
          animalCaravana: animal.caravana,
          tipoVacunaId: tipo.id,
          tipoVacunaNombre: tipo.nombre,
          fechaAplicacion: toISODate(aplicacion),
          proximaFecha: toISODate(proxima),
          veterinarioId: vet.id,
          veterinarioNombre: vet.nombre,
          loteProducto: `L-${randInt(2024, 2026)}-${randInt(100, 999)}`,
          dosis: tipo.dosis,
          costo: randInt(800, 4500),
        })
      }
    })
  return out
}

export const vacunaciones: Vacunacion[] = buildVacunaciones()

// --- Campañas (lotes de vacunación) ---
export const campanias: Campania[] = []

const buildCampanias = () => {
  const activos = animales.filter((a) => a.estado === 'Activo')
  for (let k = 1; k <= 2; k++) {
    const tipo = pick(tiposVacuna)
    const vet = pick(veterinarios)
    const aplicacion = addDays(new Date(), -randInt(10, 120))
    const proxima = addDays(aplicacion, tipo.periodicidadDias)
    const campId = `camp-${k}`
    const lote = `L-${randInt(2024, 2026)}-${randInt(100, 999)}`
    const costo = randInt(800, 4500)
    campanias.push({
      id: campId,
      fechaAplicacion: toISODate(aplicacion),
      proximaFecha: toISODate(proxima),
      tipoVacunaId: tipo.id,
      tipoVacunaNombre: tipo.nombre,
      veterinarioId: vet.id,
      veterinarioNombre: vet.nombre,
      loteProducto: lote,
      costo,
      createdAt: toISODate(aplicacion),
    })
    const sample = [...activos].sort(() => 0.5 - Math.random()).slice(0, randInt(6, 10))
    sample.forEach((animal, j) => {
      vacunaciones.unshift({
        id: `vac-${campId}-${j}`,
        animalId: animal.id,
        animalCaravana: animal.caravana,
        tipoVacunaId: tipo.id,
        tipoVacunaNombre: tipo.nombre,
        fechaAplicacion: toISODate(aplicacion),
        proximaFecha: toISODate(proxima),
        veterinarioId: vet.id,
        veterinarioNombre: vet.nombre,
        loteProducto: lote,
        dosis: tipo.dosis,
        costo,
        campaniaId: campId,
      })
    })
  }
}
buildCampanias()

// --- Mutadores (alta) ---
export const addAnimal = (data: Omit<Animal, 'id'>): Animal => {
  const animal: Animal = { ...data, id: `an-${nextId()}` }
  animales.unshift(animal)
  return animal
}

export const addVeterinario = (data: Omit<Veterinario, 'id'>): Veterinario => {
  const vet: Veterinario = { ...data, id: `vet-${nextId()}` }
  veterinarios.unshift(vet)
  return vet
}

export const addTipoVacuna = (data: Omit<TipoVacuna, 'id'>): TipoVacuna => {
  const tv: TipoVacuna = { ...data, id: `tv-${nextId()}` }
  tiposVacuna.unshift(tv)
  return tv
}

export const addVacunacion = (data: Omit<Vacunacion, 'id'>): Vacunacion => {
  const vac: Vacunacion = { ...data, id: `vac-${nextId()}` }
  vacunaciones.unshift(vac)
  return vac
}

// --- Mutadores (edición): actualizan el registro en su lugar por id ---
const updateInPlace = <T extends { id: string }>(arr: T[], id: string, data: Partial<T>): T => {
  const idx = arr.findIndex((x) => x.id === id)
  if (idx === -1) throw new Error('Registro no encontrado')
  arr[idx] = { ...arr[idx], ...data, id }
  return arr[idx]
}

export const updateAnimal = (id: string, data: Partial<Animal>) => updateInPlace(animales, id, data)
export const updateVeterinario = (id: string, data: Partial<Veterinario>) =>
  updateInPlace(veterinarios, id, data)
export const updateTipoVacuna = (id: string, data: Partial<TipoVacuna>) =>
  updateInPlace(tiposVacuna, id, data)
export const updateVacunacion = (id: string, data: Partial<Vacunacion>) =>
  updateInPlace(vacunaciones, id, data)

export const addDueno = (data: Omit<Dueno, 'id'>): Dueno => {
  const d: Dueno = { ...data, id: `due-${nextId()}` }
  duenos.unshift(d)
  return d
}
export const updateDueno = (id: string, data: Partial<Dueno>) => updateInPlace(duenos, id, data)

export const addCampania = (data: Omit<Campania, 'id'>): Campania => {
  const c: Campania = { ...data, id: `camp-${nextId()}` }
  campanias.unshift(c)
  return c
}
export const updateCampania = (id: string, data: Partial<Campania>) => updateInPlace(campanias, id, data)
