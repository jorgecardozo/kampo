import { ReactNode, useState } from 'react'
import { ChevronDown, Columns3 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EmptyState, Td, Th } from './primitives'

export type Column<T> = {
  key: string
  label: string
  align?: 'left' | 'right' | 'center'
  hideable?: boolean // default true; false = siempre visible y no aparece en el toggle
  className?: string
  truncate?: boolean // recorta con "…" (para textos largos: nombre, descripción)
  render: (row: T) => ReactNode
}

const alignClass = (a?: Column<any>['align']) =>
  a === 'right' ? 'text-right' : a === 'center' ? 'text-center' : ''

// Filas skeleton (shimmer). En carga inicial (fade=false) van todas opacas;
// al cargar más páginas en scroll infinito (fade=true) la opacidad decrece
// para dar el efecto de difuminado al final de la tabla.
function SkeletonRows<T>({
  cols,
  count = 4,
  fade = true,
}: {
  cols: Column<T>[]
  count?: number
  fade?: boolean
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, r) => (
        <tr key={`sk-${r}`} style={fade ? { opacity: Math.max(0.15, 1 - r * 0.24) } : undefined}>
          {cols.map((c, ci) => (
            <td key={c.key} className="px-4 py-3.5">
              <div
                className="h-4 rounded bg-slate-200 dark:bg-gray-700 animate-pulse"
                style={{ width: `${55 + ((r + ci) % 4) * 12}%` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

// Hook de visibilidad de columnas.
export function useColumnVisibility() {
  const [hidden, setHidden] = useState<Record<string, boolean>>({})
  const isVisible = (key: string) => !hidden[key]
  const toggle = (key: string) => setHidden((p) => ({ ...p, [key]: !p[key] }))
  return { isVisible, toggle }
}

// Botón "Columnas" con checkboxes (shadcn DropdownMenu).
export function ColumnsToggle<T>({
  columns,
  isVisible,
  toggle,
}: {
  columns: Column<T>[]
  isVisible: (key: string) => boolean
  toggle: (key: string) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2.5 sm:px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
          <Columns3 size={16} /> <span className="hidden sm:inline">Columnas</span> <ChevronDown size={16} className="hidden sm:inline" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Mostrar columnas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns
          .filter((c) => c.hideable !== false)
          .map((c) => (
            <DropdownMenuCheckboxItem
              key={c.key}
              checked={isVisible(c.key)}
              onCheckedChange={() => toggle(c.key)}
              onSelect={(e) => e.preventDefault()}
            >
              {c.label}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Tabla genérica que respeta la visibilidad de columnas.
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  isLoading,
  emptyLabel = 'Sin resultados',
  isVisible,
  onRowClick,
  selectedKey,
  loadingMore = false,
  emptyIcon,
  emptyDescription,
  emptyAction,
}: {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
  isLoading?: boolean
  emptyLabel?: string
  isVisible: (key: string) => boolean
  onRowClick?: (row: T) => void
  selectedKey?: string | null
  loadingMore?: boolean
  emptyIcon?: ReactNode
  emptyDescription?: ReactNode
  emptyAction?: ReactNode
}) {
  const cols = columns.filter((c) => isVisible(c.key))
  const showEmpty = !isLoading && rows.length === 0 && !loadingMore

  // Con filas: contenedor de altura automática → el scroll vertical lo maneja
  // el ScrollArea (así funciona el scroll infinito). Vacío: crece (flex-1) para
  // centrar el estado vacío. (overflow-x-auto sobre un flex-1 capturaba el scroll
  // vertical y rompía el infinito en mobile.)
  return (
    <div
      className={`${
        showEmpty ? 'flex flex-1 flex-col' : ''
      } overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700`}
    >
      <table className="w-full text-sm">
        <thead className="bg-main-600 text-left text-xs uppercase tracking-wide text-white">
          <tr>
            {cols.map((c) => (
              <Th key={c.key} className={alignClass(c.align)}>
                {c.label}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
          {isLoading ? (
            <SkeletonRows cols={cols} count={10} fade={false} />
          ) : (
            <>
              {rows.map((r, i) => {
                const selected = selectedKey != null && rowKey(r) === selectedKey
                return (
                  <tr
                    key={rowKey(r)}
                    onClick={onRowClick ? () => onRowClick(r) : undefined}
                    className={`transition-colors ${onRowClick ? 'cursor-pointer' : ''} ${
                      selected
                        ? 'bg-main-100 dark:bg-gray-700 shadow-[inset_3px_0_0_0_#3d61e0]'
                        : `${i % 2 === 1 ? 'bg-slate-50 dark:bg-gray-700/30' : 'bg-white dark:bg-gray-800'} hover:bg-main-50 dark:hover:bg-gray-700/60`
                    }`}
                  >
                    {cols.map((c) => (
                      <Td key={c.key} className={`${alignClass(c.align)} ${c.className ?? ''}`}>
                        {c.truncate ? (
                          <span className="block max-w-[120px] sm:max-w-[200px] truncate">{c.render(r)}</span>
                        ) : (
                          c.render(r)
                        )}
                      </Td>
                    ))}
                  </tr>
                )
              })}
              {loadingMore && <SkeletonRows cols={cols} />}
            </>
          )}
        </tbody>
      </table>

      {/* Estado vacío centrado en el espacio restante del contenedor. */}
      {showEmpty && (
        <div className="flex flex-1 items-center justify-center">
          <EmptyState
            icon={emptyIcon}
            title={emptyLabel}
            description={emptyDescription}
            action={emptyAction}
          />
        </div>
      )}
    </div>
  )
}
