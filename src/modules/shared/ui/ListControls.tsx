import { ChevronLeft, ChevronRight, List, MousePointer2 } from 'lucide-react'
import type { ListMode } from '../hooks/useListQuery'

// Toggle compacto (solo iconos) entre paginado y scroll infinito.
export const ModeToggle = ({
  mode,
  onChange,
}: {
  mode: ListMode
  onChange: (m: ListMode) => void
}) => {
  const base = 'inline-flex items-center justify-center px-2.5 py-2 transition-colors'
  return (
    <div className="hidden sm:inline-flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
      <button
        type="button"
        title="Paginado"
        onClick={() => onChange('paged')}
        className={`${base} ${mode === 'paged' ? 'bg-main-600 text-white' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
      >
        <List size={16} />
      </button>
      <button
        type="button"
        title="Scroll infinito"
        onClick={() => onChange('infinite')}
        className={`${base} border-l border-gray-300 dark:border-gray-600 ${mode === 'infinite' ? 'bg-main-600 text-white' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
      >
        <MousePointer2 size={16} />
      </button>
    </div>
  )
}

// Paginador numerado (modo 'paged').
export const Pagination = ({
  page,
  pageSize,
  total,
  onPage,
}: {
  page: number
  pageSize: number
  total: number
  onPage: (p: number) => void
}) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  if (total === 0) return null

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  // Ventana de páginas alrededor de la actual.
  const windowSize = 5
  let start = Math.max(1, page - Math.floor(windowSize / 2))
  const end = Math.min(totalPages, start + windowSize - 1)
  start = Math.max(1, end - windowSize + 1)
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  const btn =
    'inline-flex h-8 min-w-8 items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 px-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed'

  return (
    <div className="flex items-center justify-between gap-3 pt-4 flex-wrap">
      <span className="text-sm text-gray-500 dark:text-gray-400">
        Mostrando <b>{from}</b>–<b>{to}</b> de <b>{total}</b>
      </span>
      <div className="flex items-center gap-1">
        <button className={btn} onClick={() => onPage(page - 1)} disabled={page <= 1}>
          <ChevronLeft size={16} />
        </button>
        {start > 1 && (
          <>
            <button className={btn} onClick={() => onPage(1)}>1</button>
            {start > 2 && <span className="px-1 text-gray-400">…</span>}
          </>
        )}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={`${btn} ${p === page ? 'bg-main-600 text-white border-main-600 hover:bg-main-700' : ''}`}
          >
            {p}
          </button>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-1 text-gray-400">…</span>}
            <button className={btn} onClick={() => onPage(totalPages)}>{totalPages}</button>
          </>
        )}
        <button className={btn} onClick={() => onPage(page + 1)} disabled={page >= totalPages}>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

// Pie del modo 'infinite'.
export const InfiniteFooter = ({
  shown,
  total,
  isFetchingNext,
  hasNext,
}: {
  shown: number
  total: number
  isFetchingNext: boolean
  hasNext: boolean
}) => (
  <div className="pt-4 text-center text-sm text-gray-400">
    {isFetchingNext
      ? null /* el skeleton al final ya indica la carga */
      : hasNext
        ? `Desplazate para ver más (${shown} de ${total})`
        : total > 0
          ? `Fin de la lista · ${total} en total`
          : null}
  </div>
)
