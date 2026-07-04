import { MapPin } from 'lucide-react'
import { useCampo } from '@shared/context/CampoProvider'
import FilterSelect from './FilterSelect'

// Selector del campo (establecimiento) activo. Se muestra en el header de todas
// las vistas. Con un solo campo aparece como etiqueta; con varios, como dropdown.
export const CampoSelector = () => {
  const { campos, campoId, campoActual, setCampoId } = useCampo()

  if (!campos.length) return null

  if (campos.length === 1) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-200">
        <MapPin size={15} className="text-main-600" />
        {campoActual?.nombre ?? campos[0].nombre}
      </span>
    )
  }

  return (
    <div className="flex items-center gap-1.5">
      <MapPin size={16} className="shrink-0 text-main-600" />
      <div className="w-44 sm:w-52">
        <FilterSelect
          isSearchable
          value={campoId ?? ''}
          onChange={(v) => v && setCampoId(v)}
          placeholder="Campo…"
          options={campos.map((c) => ({ value: c.id, label: c.nombre }))}
        />
      </div>
    </div>
  )
}

export default CampoSelector
