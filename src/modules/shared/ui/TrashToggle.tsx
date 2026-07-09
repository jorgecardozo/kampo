import { Archive, List } from 'lucide-react'

export type TrashView = 'activos' | 'papelera'

// Segmentado Activos / Papelera, reutilizable en todas las listas.
export const TrashToggle = ({
  view,
  onChange,
}: {
  view: TrashView
  onChange: (v: TrashView) => void
}) => {
  // En mobile solo íconos (ahorra ancho); desde sm muestra el texto.
  const base = 'inline-flex items-center gap-1.5 rounded-md px-2.5 sm:px-3 py-1.5 text-sm font-medium transition-colors'
  const active = 'bg-main-600 text-white shadow-sm'
  const idle = 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white'
  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-1">
      <button type="button" title="Activos" onClick={() => onChange('activos')} className={`${base} ${view === 'activos' ? active : idle}`}>
        <List size={15} /> <span className="hidden sm:inline">Activos</span>
      </button>
      <button type="button" title="Papelera" onClick={() => onChange('papelera')} className={`${base} ${view === 'papelera' ? active : idle}`}>
        <Archive size={15} /> <span className="hidden sm:inline">Papelera</span>
      </button>
    </div>
  )
}

export default TrashToggle
