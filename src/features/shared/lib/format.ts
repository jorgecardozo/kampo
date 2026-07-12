// Utilidades de formato compartidas por los módulos.

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value || 0)

export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return '-'
  return new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
}

export const toISODate = (date: Date): string => date.toISOString().split('T')[0]

// Fecha en formato yyyy-mm-dd usando la zona local (evita corrimiento de día
// que produce toISOString en husos horarios negativos). Útil para límites de filtros.
export const toLocalISODate = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

export const addDays = (date: Date, days: number): Date => {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export const addMonths = (date: Date, months: number): Date => {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

// Diferencia en días enteros entre hoy y una fecha objetivo (negativo = vencido).
export const daysUntil = (date: string | Date): number => {
  const target = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

// Simula latencia de red para los mocks.
export const mockDelay = (ms = 350): Promise<void> => new Promise((r) => setTimeout(r, ms))

let __id = 1000
export const nextId = (): string => String(++__id)
