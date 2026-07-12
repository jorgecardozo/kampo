import { useState } from 'react'
import { Archive, RotateCcw, Trash2 } from 'lucide-react'
import { usePermisos } from '@shared/context/PermisosProvider'

export type TrashView = 'activos' | 'papelera'

// Estado común de una lista con papelera.
export const useTrashState = <T,>() => {
  const [view, setView] = useState<TrashView>('activos')
  const [purgeTarget, setPurgeTarget] = useState<T | null>(null)
  return { view, setView, isTrash: view === 'papelera', purgeTarget, setPurgeTarget }
}

// Botones de la columna "Acciones" en modo papelera (Restaurar / Eliminar).
export const TrashRowActions = ({
  onRestore,
  onPurge,
}: {
  onRestore: () => void
  onPurge: () => void
}) => {
  const { puedeEditar } = usePermisos()
  if (!puedeEditar) return <span className="text-xs text-gray-400">—</span>
  return (
  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
    <button
      type="button"
      onClick={onRestore}
      className="inline-flex items-center gap-1 rounded-md border border-emerald-200 dark:border-emerald-900 px-2.5 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
    >
      <RotateCcw size={13} /> Restaurar
    </button>
    <button
      type="button"
      onClick={onPurge}
      className="inline-flex items-center gap-1 rounded-md border border-rose-200 dark:border-rose-900 px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30"
    >
      <Trash2 size={13} /> Eliminar
    </button>
  </div>
  )
}

// Botón "Archivar" para el footer del Drawer (secondaryActions).
export const ArchiveButton = ({ onClick, pending }: { onClick: () => void; pending?: boolean }) => {
  const { puedeEditar } = usePermisos()
  if (!puedeEditar) return null
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 dark:border-rose-900 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 disabled:opacity-60"
    >
      <Archive size={16} /> {pending ? 'Archivando…' : 'Archivar'}
    </button>
  )
}
