import { ReactNode } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { SearchInput } from './primitives'
import { inputClass } from './FormModal'

export type FilterChip = { key: string; label: string; onClear: () => void }

// Campo etiquetado para el panel de filtros.
export const FilterField = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="flex flex-col gap-1">
    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
    {children}
  </label>
)

// Rango de fechas con inputs nativos (Desde / Hasta) para usar dentro del panel.
export const DateRangeInputs = ({
  from,
  to,
  onFrom,
  onTo,
}: {
  from: string
  to: string
  onFrom: (v: string) => void
  onTo: (v: string) => void
}) => (
  <div className="grid grid-cols-2 gap-2">
    <label className="flex flex-col gap-1">
      <span className="text-[11px] text-gray-400">Desde</span>
      <input type="date" className={inputClass} value={from} onChange={(e) => onFrom(e.target.value)} />
    </label>
    <label className="flex flex-col gap-1">
      <span className="text-[11px] text-gray-400">Hasta</span>
      <input type="date" className={inputClass} value={to} onChange={(e) => onTo(e.target.value)} />
    </label>
  </div>
)

type Props = {
  search: string
  onSearch: (v: string) => void
  searchPlaceholder?: string
  children: ReactNode // controles del panel de filtros
  chips?: FilterChip[]
  onClearAll?: () => void
  right?: ReactNode // acciones a la derecha (contador, modo, columnas)
}

// Barra de filtros: búsqueda + botón "Filtros (N)" con panel + chips de activos.
export const FiltersBar = ({ search, onSearch, searchPlaceholder, children, chips = [], onClearAll, right }: Props) => (
  <div className="mb-2 sm:mb-4 flex flex-col gap-2 sm:gap-3">
    {/* Todo en una línea: buscador (crece) + controles + Filtros (ícono) */}
    <div className="flex items-center gap-2">
      <div className="min-w-0 flex-1">
        <SearchInput value={search} onChange={onSearch} placeholder={searchPlaceholder} />
      </div>
      {right}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            title="Filtros"
            className="relative inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2.5 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <SlidersHorizontal size={16} />
            {chips.length > 0 && (
              <span className="absolute -right-1.5 -top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-main-600 px-1 text-[10px] font-semibold text-white">
                {chips.length}
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-72 p-4 grid gap-3">
          {children}
          {chips.length > 0 && onClearAll && (
            <button type="button" onClick={onClearAll} className="mt-1 text-sm font-medium text-main-600 hover:text-main-700">
              Limpiar filtros
            </button>
          )}
        </PopoverContent>
      </Popover>
    </div>

    {chips.length > 0 && (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-400">Activos:</span>
        {chips.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={c.onClear}
            className="inline-flex items-center gap-1 rounded-full bg-main-50 dark:bg-gray-800 border border-main-200 dark:border-gray-700 px-2.5 py-1 text-xs font-medium text-main-700 dark:text-main-400 hover:bg-main-100 dark:hover:bg-gray-700"
          >
            {c.label} <X size={12} />
          </button>
        ))}
        {onClearAll && (
          <button type="button" onClick={onClearAll} className="text-xs font-medium text-gray-400 hover:text-gray-600">
            Limpiar todo
          </button>
        )}
      </div>
    )}
  </div>
)

export default FiltersBar
