import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Trash2 } from 'lucide-react'
import { Drawer } from '@features/shared/ui/Drawer'
import { ArchiveButton } from '@features/shared/ui/trash'
import { Field, inputClass } from '@features/shared/ui/FormModal'
import FilterSelect from '@features/shared/ui/FilterSelect'
import { SearchInput } from '@features/shared/ui/primitives'
import { formatCurrency, toISODate } from '@features/shared/lib/format'
import { useAnimales } from '@features/ganaderia/animales/useAnimales'
import { useDuenos } from '@features/ganaderia/duenos/useDuenos'
import { usePrecios } from '@features/ganaderia/precios/usePrecios'
import { CATEGORIAS, POTREROS } from '@features/ganaderia/shared/constants'
import type { Animal } from '@features/ganaderia/shared/types'
import { AreaVenta, Venta, VentaAnimalLine, VentaInput, fetchVentaAnimales } from '../ventas.api'
import { useArchiveVenta, useCreateVenta, useUpdateVenta } from '../useVentas'

type Props = {
  open: boolean
  onClose: () => void
  initial?: Venta | null
  items?: Venta[]
  onNavigate?: (v: Venta) => void
}

type Mode = 'animales' | 'otro'

// Identificador legible: caravana → nombre → "Sin caravana #xxxx" (código corto
// derivado del id, como desempate cuando el animal no tiene chapita ni nombre).
const animalLabel = (a: { caravana?: string; nombre?: string; id?: string; animalId?: string }) => {
  if (a.caravana) return a.caravana
  if (a.nombre) return a.nombre
  const ref = a.id || a.animalId
  return ref ? `Sin caravana #${ref.slice(0, 4)}` : 'Sin caravana'
}

// Detalle para distinguir animales sin caravana en el selector.
const animalDetalle = (a: Animal) =>
  [a.categoria, a.raza, a.color, a.potrero, a.dueno, `${a.pesoKg}kg`].filter(Boolean).join(' · ')

export const VentaFormDrawer = ({ open, onClose, initial, items, onNavigate }: Props) => {
  const isEdit = !!initial
  const idx = items && initial ? items.findIndex((x) => x.id === initial.id) : -1
  const canPrev = idx > 0
  const canNext = idx >= 0 && idx < (items?.length ?? 0) - 1

  const [mode, setMode] = useState<Mode>('animales')
  const [fecha, setFecha] = useState(toISODate(new Date()))
  const [area, setArea] = useState<AreaVenta>('ganaderia')
  const [concepto, setConcepto] = useState('')
  const [monto, setMonto] = useState<number | string>(0)
  const [detalle, setDetalle] = useState('')
  const [lines, setLines] = useState<VentaAnimalLine[]>([])
  const [search, setSearch] = useState('')
  const [fPotrero, setFPotrero] = useState('')
  const [fCategoria, setFCategoria] = useState('')
  const [fDueno, setFDueno] = useState('')

  const { data: animales } = useAnimales({ estado: 'Activo' })
  const { data: duenos } = useDuenos()
  const { data: precios } = usePrecios()
  const { mutateAsync: create, isPending: creating } = useCreateVenta()
  const { mutateAsync: update, isPending: updating } = useUpdateVenta()
  const { mutateAsync: archive, isPending: archiving } = useArchiveVenta()

  const precioDe = (categoria?: string) => precios?.find((p) => p.categoria === categoria)?.precioKg ?? 0

  // Al editar una venta de ganado, traemos sus líneas de animales.
  const { data: lineasExistentes } = useQuery({
    queryKey: ['finanzas.ventas', 'lineas', initial?.id],
    queryFn: () => fetchVentaAnimales(initial!.id),
    enabled: isEdit && open && (initial?.animalesCount ?? 0) > 0,
  })

  useEffect(() => {
    if (!open) return
    if (initial) {
      const esGanado = (initial.animalesCount ?? 0) > 0
      setMode(esGanado ? 'animales' : 'otro')
      setFecha(initial.fecha)
      setArea(initial.area)
      setConcepto(initial.concepto)
      setMonto(initial.monto)
      setDetalle(initial.detalle ?? '')
      setLines([])
    } else {
      setMode('animales')
      setFecha(toISODate(new Date()))
      setArea('ganaderia')
      setConcepto('')
      setMonto(0)
      setDetalle('')
      setLines([])
    }
    setSearch('')
    setFPotrero('')
    setFCategoria('')
    setFDueno('')
  }, [open, initial])

  // Cuando llegan las líneas existentes (edición de venta de ganado), precargar.
  useEffect(() => {
    if (lineasExistentes) setLines(lineasExistentes)
  }, [lineasExistentes])

  const total = useMemo(
    () => lines.reduce((s, l) => s + (Number(l.pesoKg) || 0) * (Number(l.precioKg) || 0), 0),
    [lines]
  )

  const selectedIds = useMemo(() => new Set(lines.map((l) => l.animalId)), [lines])

  // Animales activos que matchean los filtros del picker.
  const filtrados = useMemo(() => {
    const q = search.toLowerCase()
    return (animales ?? []).filter(
      (a) =>
        (!q ||
          (a.caravana?.toLowerCase().includes(q) ?? false) ||
          (a.nombre?.toLowerCase().includes(q) ?? false) ||
          a.raza.toLowerCase().includes(q) ||
          a.color.toLowerCase().includes(q)) &&
        (!fPotrero || a.potrero === fPotrero) &&
        (!fCategoria || a.categoria === fCategoria) &&
        (!fDueno || a.dueno === fDueno)
    )
  }, [animales, search, fPotrero, fCategoria, fDueno])

  const allFilteredSelected = filtrados.length > 0 && filtrados.every((a) => selectedIds.has(a.id))

  const addAnimal = (a: Animal) =>
    setLines((prev) => [
      ...prev,
      {
        animalId: a.id,
        caravana: a.caravana,
        nombre: a.nombre,
        categoria: a.categoria,
        pesoKg: a.pesoKg,
        precioKg: precioDe(a.categoria),
      },
    ])
  const removeLine = (animalId: string) => setLines((prev) => prev.filter((l) => l.animalId !== animalId))
  const toggleAnimal = (a: Animal) => (selectedIds.has(a.id) ? removeLine(a.id) : addAnimal(a))
  const toggleAllFiltered = () =>
    allFilteredSelected
      ? setLines((prev) => prev.filter((l) => !filtrados.some((a) => a.id === l.animalId)))
      : setLines((prev) => {
          const usados = new Set(prev.map((l) => l.animalId))
          const nuevos = filtrados
            .filter((a) => !usados.has(a.id))
            .map((a) => ({
              animalId: a.id,
              caravana: a.caravana,
              nombre: a.nombre,
              categoria: a.categoria,
              pesoKg: a.pesoKg,
              precioKg: precioDe(a.categoria),
            }))
          return [...prev, ...nuevos]
        })
  const setLine = (animalId: string, k: 'pesoKg' | 'precioKg', v: any) =>
    setLines((prev) => prev.map((l) => (l.animalId === animalId ? { ...l, [k]: v } : l)))

  const handleSubmit = async () => {
    let input: VentaInput
    if (mode === 'animales') {
      if (lines.length === 0) {
        toast.error('Agregá al menos un animal', { theme: 'colored' })
        return
      }
      input = {
        fecha,
        area: 'ganaderia',
        concepto: concepto.trim() || `Venta de ${lines.length} animal(es)`,
        monto: total,
        detalle,
        animales: lines.map((l) => ({ ...l, pesoKg: Number(l.pesoKg) || 0, precioKg: Number(l.precioKg) || 0 })),
      }
    } else {
      if (!concepto.trim()) {
        toast.error('El concepto es obligatorio', { theme: 'colored' })
        return
      }
      input = { fecha, area, concepto: concepto.trim(), monto: Number(monto) || 0, detalle }
    }
    try {
      if (isEdit) {
        await update({ id: initial!.id, input })
        toast.success('Venta actualizada', { theme: 'colored' })
      } else {
        await create(input)
        toast.success(
          mode === 'animales' ? `Venta registrada · ${lines.length} animal(es) marcados como Vendido` : 'Venta registrada',
          { theme: 'colored' }
        )
      }
      onClose()
    } catch {
      toast.error('Ocurrió un error al guardar la venta', { theme: 'colored' })
    }
  }

  const handleArchive = async () => {
    if (!isEdit) return
    try {
      await archive(initial!.id)
      toast.success('Venta archivada · los animales volvieron a Activo', { theme: 'colored' })
      onClose()
    } catch {
      toast.error('No se pudo archivar', { theme: 'colored' })
    }
  }

  const modeBtn = (m: Mode, label: string) => (
    <button
      type="button"
      onClick={() => setMode(m)}
      disabled={isEdit}
      className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
        mode === m ? 'bg-main-600 text-white shadow-sm' : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white'
      } ${isEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      {label}
    </button>
  )

  return (
    <Drawer
      open={open}
      title={isEdit ? 'Editar venta' : 'Registrar venta'}
      subtitle={mode === 'animales' ? 'Venta de ganado' : 'Otro ingreso'}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitting={creating || updating}
      submitLabel={isEdit ? 'Guardar cambios' : 'Registrar venta'}
      onPrev={onNavigate && canPrev ? () => onNavigate(items![idx - 1]) : undefined}
      onNext={onNavigate && canNext ? () => onNavigate(items![idx + 1]) : undefined}
      canPrev={canPrev}
      canNext={canNext}
      navLabel={idx >= 0 && items ? `${idx + 1} / ${items.length}` : undefined}
      secondaryActions={isEdit ? <ArchiveButton onClick={handleArchive} pending={archiving} /> : undefined}
    >
      {/* Selector de tipo de venta (bloqueado al editar) */}
      <div className="md:col-span-2">
        <div className="inline-flex w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-1">
          {modeBtn('animales', '🐄 Venta de animales')}
          {modeBtn('otro', '💵 Otro ingreso')}
        </div>
        {isEdit && <p className="mt-1 text-xs text-gray-400">El tipo de venta no se puede cambiar al editar.</p>}
      </div>

      <Field label="Fecha">
        <input type="date" className={inputClass} value={fecha} onChange={(e) => setFecha(e.target.value)} />
      </Field>

      {mode === 'otro' && (
        <Field label="Área">
          <FilterSelect
            value={area}
            onChange={(v) => setArea(v as AreaVenta)}
            options={[
              { value: 'campo', label: 'Campo' },
              { value: 'ganaderia', label: 'Ganadería' },
            ]}
          />
        </Field>
      )}

      <Field label="Concepto" full={mode === 'animales'}>
        <input
          className={inputClass}
          value={concepto}
          onChange={(e) => setConcepto(e.target.value)}
          placeholder={mode === 'animales' ? `Ej: Venta a frigorífico (se autocompleta)` : 'Ej: Venta de soja (12 t)'}
        />
      </Field>

      {mode === 'otro' && (
        <Field label="Monto ($)">
          <input type="number" className={inputClass} value={monto} onChange={(e) => setMonto(e.target.value)} />
        </Field>
      )}

      <Field label="Detalle / comprador" full={mode === 'animales'}>
        <input className={inputClass} value={detalle} onChange={(e) => setDetalle(e.target.value)} />
      </Field>

      {/* Venta de animales: picker (buscador + filtros) + precios por animal */}
      {mode === 'animales' && (
        <div className="md:col-span-2 space-y-3">
          {/* Picker: elegí qué animales estás vendiendo */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Elegí los animales</h3>
              <span className="text-xs text-gray-400">
                {filtrados.length} en la lista · {lines.length} elegidos
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
              <SearchInput value={search} onChange={setSearch} placeholder="Buscar caravana, nombre, raza o color…" />
              <FilterSelect
                value={fPotrero}
                onChange={setFPotrero}
                placeholder="Todos los potreros"
                options={[{ value: '', label: 'Todos los potreros' }, ...POTREROS.map((p) => ({ value: p, label: p }))]}
              />
              <FilterSelect
                value={fCategoria}
                onChange={setFCategoria}
                placeholder="Todas las categorías"
                options={[{ value: '', label: 'Todas las categorías' }, ...CATEGORIAS.map((c) => ({ value: c, label: c }))]}
              />
              <FilterSelect
                isSearchable
                value={fDueno}
                onChange={setFDueno}
                placeholder="Todos los dueños"
                options={[{ value: '', label: 'Todos los dueños' }, ...(duenos ?? []).map((d) => ({ value: d.nombre, label: d.nombre }))]}
              />
            </div>

            <label className="flex items-center gap-2 py-1 text-sm font-medium text-main-700 dark:text-main-400 cursor-pointer">
              <input type="checkbox" checked={allFilteredSelected} onChange={toggleAllFiltered} className="h-4 w-4 accent-main-600" />
              Seleccionar todos los filtrados ({filtrados.length})
            </label>

            <div className="max-h-56 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700/60">
              {filtrados.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-400">No hay animales activos que coincidan</p>
              ) : (
                filtrados.map((a) => (
                  <label
                    key={a.id}
                    className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-main-50 dark:hover:bg-gray-700/40"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.has(a.id)}
                      onChange={() => toggleAnimal(a)}
                      className="h-4 w-4 accent-main-600"
                    />
                    <span className="font-semibold text-gray-800 dark:text-white">{animalLabel(a)}</span>
                    <span className="text-gray-500 dark:text-gray-400">{animalDetalle(a)}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Precios de los animales elegidos */}
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Precio de los {lines.length} animal(es) vendidos
          </h3>
          {lines.length === 0 ? (
            <p className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 py-8 text-center text-sm text-gray-400">
              Marcá arriba los animales que estás vendiendo. El precio sale del peso × precio/kg (editable).
            </p>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 dark:bg-gray-700/50 text-left text-xs uppercase text-gray-500 dark:text-gray-300">
                  <tr>
                    <th className="px-3 py-2">Animal</th>
                    <th className="px-3 py-2 w-28">Peso (kg)</th>
                    <th className="px-3 py-2 w-32">Precio/kg</th>
                    <th className="px-3 py-2 w-32 text-right">Subtotal</th>
                    <th className="px-2 py-2 w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                  {lines.map((l) => (
                    <tr key={l.animalId} className="bg-white dark:bg-gray-800">
                      <td className="px-3 py-2">
                        <span className="font-semibold text-gray-800 dark:text-white">{animalLabel(l)}</span>
                        <span className="ml-1 text-xs text-gray-400">{l.categoria}</span>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          className={`${inputClass} py-1`}
                          value={l.pesoKg}
                          onChange={(e) => setLine(l.animalId, 'pesoKg', e.target.value)}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          className={`${inputClass} py-1`}
                          value={l.precioKg}
                          onChange={(e) => setLine(l.animalId, 'precioKg', e.target.value)}
                        />
                      </td>
                      <td className="px-3 py-2 text-right font-medium text-gray-700 dark:text-gray-200">
                        {formatCurrency((Number(l.pesoKg) || 0) * (Number(l.precioKg) || 0))}
                      </td>
                      <td className="px-2 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeLine(l.animalId)}
                          className="rounded-md p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30"
                          title="Quitar"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 dark:bg-gray-700/40">
                    <td className="px-3 py-2 font-semibold text-gray-700 dark:text-gray-200" colSpan={3}>
                      Total
                    </td>
                    <td className="px-3 py-2 text-right text-base font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(total)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
          <p className="mt-2 text-xs text-gray-400">
            Al guardar, estos animales pasan a estado <b>Vendido</b> y salen del capital de ganado.
          </p>
        </div>
      )}
    </Drawer>
  )
}

export default VentaFormDrawer
