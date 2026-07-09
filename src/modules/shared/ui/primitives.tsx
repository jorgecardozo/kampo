import { ReactNode, UIEvent } from 'react'
import { Search, Plus } from 'lucide-react'
import { usePermisos } from '@shared/context/PermisosProvider'

// Contenedor base de cada vista de módulo (header fijo + contenido scrolleable).
export const ModuleScreen = ({ children }: { children: ReactNode }) => (
  <div className="w-full flex flex-col h-full">{children}</div>
)

export const ScrollArea = ({
  children,
  onScrollEnd,
}: {
  children: ReactNode
  onScrollEnd?: () => void
}) => {
  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    if (!onScrollEnd) return
    const el = e.currentTarget
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 250) onScrollEnd()
  }
  return (
    <div
      className="no-scrollbar flex flex-1 flex-col overflow-y-auto overscroll-contain pt-4"
      onScroll={handleScroll}
    >
      {children}
    </div>
  )
}

// Panel tipo card.
export const Panel = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div
    className={`rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${className}`}
  >
    {children}
  </div>
)

// Botón primario reutilizable. Se oculta para usuarios sin permiso de edición
// (rol Lector), ya que siempre representa una acción de crear/registrar.
export const PrimaryButton = ({
  children,
  onClick,
  icon = true,
}: {
  children: ReactNode
  onClick?: () => void
  icon?: boolean
}) => {
  const { puedeEditar } = usePermisos()
  if (!puedeEditar) return null
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg bg-main-600 px-4 py-2 text-sm font-semibold text-white hover:bg-main-700"
    >
      {icon && <Plus size={16} />}
      {children}
    </button>
  )
}

// Barra de búsqueda controlada.
export const SearchInput = ({
  value,
  onChange,
  placeholder = 'Buscar…',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) => (
  <div className="relative w-full md:w-72">
    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 pl-9 pr-3 py-2 text-sm text-gray-800 dark:text-white outline-none focus:border-main-500 focus:ring-1 focus:ring-main-500"
    />
  </div>
)

// Estado vacío.
export const EmptyRow = ({ colSpan, label = 'Sin resultados' }: { colSpan: number; label?: string }) => (
  <tr>
    <td colSpan={colSpan} className="py-10 text-center text-sm text-gray-400">
      {label}
    </td>
  </tr>
)

// Estado vacío: ícono + título + descripción + acción opcional. Centrado y
// con aire, para usar cuando una lista/tabla no tiene datos.
export const EmptyState = ({
  icon,
  title = 'Sin datos',
  description,
  action,
}: {
  icon?: ReactNode
  title?: string
  description?: ReactNode
  action?: ReactNode
}) => (
  <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-main-50 text-main-600 dark:bg-gray-700/50 dark:text-main-400">
      <span className="text-3xl">{icon ?? '📋'}</span>
    </div>
    <h3 className="text-base font-semibold text-gray-700 dark:text-gray-100">{title}</h3>
    {description && (
      <p className="mt-1 max-w-sm text-sm text-gray-400 dark:text-gray-400">{description}</p>
    )}
    {action && <div className="mt-5">{action}</div>}
  </div>
)

// Estado de carga.
export const LoadingRow = ({ colSpan }: { colSpan: number }) => (
  <tr>
    <td colSpan={colSpan} className="py-10 text-center text-sm text-gray-400">
      Cargando…
    </td>
  </tr>
)

// Bloque skeleton genérico (shimmer). Usar para placeholders de carga.
export const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-slate-200 dark:bg-gray-700 ${className}`} />
)

// Placeholder de StatCard mientras carga el dashboard.
export const StatCardSkeleton = () => (
  <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-12 w-12 rounded-xl" />
    </div>
  </div>
)

// Placeholder de dashboard: fila de KPIs + dos paneles (gráficos).
export const DashboardSkeleton = ({ cards = 4 }: { cards?: number }) => (
  <div className="flex flex-col gap-5">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: cards }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {[0, 1].map((i) => (
        <Panel key={i} className="p-5">
          <Skeleton className="h-4 w-40 mb-4" />
          <Skeleton className="h-[260px] w-full rounded-xl" />
        </Panel>
      ))}
    </div>
  </div>
)

// Tabla base con estilos consistentes. Header con el color principal y
// títulos en negrita blanca.
export const Table = ({ head, children }: { head: ReactNode; children: ReactNode }) => (
  <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
    <table className="w-full text-sm">
      <thead className="bg-main-600 text-left text-xs uppercase tracking-wide text-white">
        {head}
      </thead>
      <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">{children}</tbody>
    </table>
  </div>
)

export const Th = ({ children, className = '' }: { children?: ReactNode; className?: string }) => (
  <th className={`whitespace-nowrap px-3 py-3 sm:px-4 sm:py-4 font-bold text-white ${className}`}>{children}</th>
)

export const Td = ({ children, className = '' }: { children?: ReactNode; className?: string }) => (
  <td className={`whitespace-nowrap px-2.5 py-2 sm:px-4 sm:py-3 text-gray-700 dark:text-gray-200 ${className}`}>{children}</td>
)

// Chip / badge de estado.
export const Badge = ({
  children,
  tone = 'gray',
}: {
  children: ReactNode
  tone?: 'gray' | 'green' | 'amber' | 'red' | 'blue'
}) => {
  const tones: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    red: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    blue: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  )
}
