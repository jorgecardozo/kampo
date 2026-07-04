import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import PageHeader from '@modules/shared/ui/PageHeader'
import { ModuleScreen, Panel, PrimaryButton, ScrollArea } from '@modules/shared/ui/primitives'
import { inputClass } from '@modules/shared/ui/FormModal'
import { formatCurrency } from '@modules/shared/lib/format'
import { PrecioKg } from '../precios.api'
import { usePrecios, useSavePrecios } from '../usePrecios'

export const PreciosView = () => {
  const { data } = usePrecios()
  const { mutateAsync, isPending } = useSavePrecios()
  const [precios, setPrecios] = useState<PrecioKg[]>([])

  useEffect(() => {
    if (data) setPrecios(data)
  }, [data])

  const setPrecio = (categoria: string, precioKg: number) =>
    setPrecios((prev) => prev.map((p) => (p.categoria === categoria ? { ...p, precioKg } : p)))

  const handleSave = async () => {
    await mutateAsync(precios.map((p) => ({ ...p, precioKg: Number(p.precioKg) || 0 })))
    toast.success('Precios actualizados', { theme: 'colored' })
  }

  return (
    <ModuleScreen>
      <PageHeader
        section="CONFIGURACIÓN"
        title="Precio por kg"
        actions={<PrimaryButton icon={false} onClick={handleSave}>{isPending ? 'Guardando…' : 'Guardar precios'}</PrimaryButton>}
      />
      <ScrollArea>
        <Panel className="p-6 max-w-2xl">
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            Definí el precio del kilo vivo por categoría. Se usa para calcular el valor de cada animal y el
            capital de ganado.
          </p>
          <div className="space-y-3">
            {precios.map((p) => (
              <div key={p.categoria} className="flex items-center gap-4">
                <span className="w-40 font-medium text-gray-700 dark:text-gray-200">{p.categoria}</span>
                <div className="relative flex-1 max-w-xs">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    className={`${inputClass} w-full pl-7`}
                    value={p.precioKg}
                    onChange={(e) => setPrecio(p.categoria, Number(e.target.value))}
                  />
                </div>
                <span className="text-sm text-gray-400">/ kg ({formatCurrency(p.precioKg)})</span>
              </div>
            ))}
          </div>
        </Panel>
      </ScrollArea>
    </ModuleScreen>
  )
}

export default PreciosView
