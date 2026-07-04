export type Page<T> = { data: T[]; total: number }

// Helper mock: pagina un array ya filtrado. Con Supabase se reemplaza por
// `.range(from, to)` + count exact, manteniendo la misma firma {data,total}.
export const paginate = <T>(all: T[], page: number, pageSize: number): Page<T> => {
  const start = (page - 1) * pageSize
  return { data: all.slice(start, start + pageSize), total: all.length }
}
