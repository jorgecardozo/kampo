import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { Drawer } from '@features/shared/ui/Drawer'
import { Field, inputClass } from '@features/shared/ui/FormModal'
import FilterSelect from '@features/shared/ui/FilterSelect'
import { SearchInput } from '@features/shared/ui/primitives'
import { addDays, formatDate, toISODate } from '@features/shared/lib/format'
import { CATEGORIAS, POTREROS } from '../../shared/constants'
import { useAnimales } from '../../animales/useAnimales'
import { useDuenos } from '../../duenos/useDuenos'
import { useTiposVacuna } from '../../tipos-vacuna/useTiposVacuna'
import { useVeterinarios } from '../../veterinarios/useVeterinarios'
import { useCreateVacunacionesLote } from '../useVacunaciones'

type Props = { open: boolean; onClose: () => void }

const emptyForm = () => ({
  tipoVacunaId: '',
  fechaAplicacion: toISODate(new Date()),
  veterinarioId: '',
  loteProducto: '',
  costo: 0,
  observaciones: '',
})

export const VacunacionLoteDrawer = ({ open, onClose }: Props) => {
  const [form, setForm] = useState(emptyForm())
  const [search, setSearch] = useState('')
  const [fPotrero, setFPotrero] = useState('')
  const [fCategoria, setFCategoria] = useState('')
  const [fDueno, setFDueno] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const { data: animales } = useAnimales({ estado: 'Activo' })
  const { data: tipos } = useTiposVacuna()
  const { data: vets } = useVeterinarios()
  const { data: duenos } = useDuenos()
  const { mutateAsync, isPending } = useCreateVacunacionesLote()

  const set = (k: keyof ReturnType<typeof emptyForm>, v: any) => setForm((p) => ({ ...p, [k]: v }))

  useEffect(() => {
    if (open) {
      setForm(emptyForm())
      setSearch('')
      setFPotrero('')
      setFCategoria('')
      setFDueno('')
      setSelected(new Set())
    }
  }, [open])

  // Animales filtrados por los filtros de la lista.
  const filtrados = useMemo(() => {
    const q = search.toLowerCase()
    return (animales ?? []).filter(
      (a) =>
        (!q || a.caravana.toLowerCase().includes(q) || (a.nombre?.toLowerCase().includes(q) ?? false)) &&
        (!fPotrero || a.potrero === fPotrero) &&
        (!fCategoria || a.categoria === fCategoria) &&
        (!fDueno || a.dueno === fDueno)
    )
  }, [animales, search, fPotrero, fCategoria, fDueno])

  const allFilteredSelected = filtrados.length > 0 && filtrados.every((a) => selected.has(a.id))

  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })

  const toggleAllFiltered = () =>
    setSelected((prev) => {
      const n = new Set(prev)
      if (allFilteredSelected) filtrados.forEach((a) => n.delete(a.id))
      else filtrados.forEach((a) => n.add(a.id))
      return n
    })

  const proximaPreview = useMemo(() => {
    const tipo = tipos?.find((t) => t.id === form.tipoVacunaId)
    if (!tipo || !form.fechaAplicacion) return null
    return addDays(new Date(form.fechaAplicacion), tipo.periodicidadDias)
  }, [tipos, form.tipoVacunaId, form.fechaAplicacion])

  const handleSubmit = async () => {
    if (!form.tipoVacunaId || !form.veterinarioId) {
      toast.error('Elegí vacuna y veterinario', { theme: 'colored' })
      return
    }
    if (selected.size === 0) {
      toast.error('Seleccioná al menos un animal', { theme: 'colored' })
      return
    }
    try {
      const n = await mutateAsync({
        input: { ...form, costo: Number(form.costo) || 0 },
        animalIds: Array.from(selected),
      })
      toast.success(`${n} vacunaciones registradas`, { theme: 'colored' })
      onClose()
    } catch {
      toast.error('Ocurrió un error al registrar el lote', { theme: 'colored' })
    }
  }

  return (
    <Drawer
      open={open}
      title="Vacunar en lote"
      subtitle={`${selected.size} animal(es) seleccionado(s)`}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitting={isPending}
      submitLabel={`Registrar ${selected.size} vacunaciones`}
    >
      {/* Datos de la vacunación */}
      <Field label="Vacuna *">
        <FilterSelect
          value={form.tipoVacunaId}
          onChange={(v) => set('tipoVacunaId', v)}
          placeholder="Seleccionar…"
          options={(tipos ?? []).map((t) => ({ value: t.id, label: `${t.nombre} (cada ${t.periodicidadDias} días)` }))}
        />
      </Field>
      <Field label="Fecha de aplicación *">
        <input type="date" className={inputClass} value={form.fechaAplicacion} onChange={(e) => set('fechaAplicacion', e.target.value)} />
      </Field>
      <Field label="Veterinario *">
        <FilterSelect
          isSearchable
          value={form.veterinarioId}
          onChange={(v) => set('veterinarioId', v)}
          placeholder="Seleccionar…"
          options={(vets ?? []).map((v) => ({ value: v.id, label: `${v.nombre} (${v.matricula})` }))}
        />
      </Field>
      <Field label="Próxima dosis (calculada)">
        <input
          className={`${inputClass} bg-gray-100 dark:bg-gray-800`}
          value={proximaPreview ? formatDate(proximaPreview) : 'Elegí vacuna y fecha'}
          readOnly
        />
      </Field>
      <Field label="Lote del producto">
        <input className={inputClass} value={form.loteProducto} onChange={(e) => set('loteProducto', e.target.value)} />
      </Field>
      <Field label="Costo por animal ($)">
        <input type="number" className={inputClass} value={form.costo} onChange={(e) => set('costo', e.target.value)} />
      </Field>

      {/* Selección de animales */}
      <div className="md:col-span-2">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Animales a vacunar</h3>
          <span className="text-xs text-gray-400">{filtrados.length} en la lista · {selected.size} elegidos</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar caravana o nombre…" />
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

        <label className="flex items-center gap-2 py-2 text-sm font-medium text-main-700 dark:text-main-400 cursor-pointer">
          <input type="checkbox" checked={allFilteredSelected} onChange={toggleAllFiltered} className="h-4 w-4 accent-main-600" />
          Seleccionar todos los filtrados ({filtrados.length})
        </label>

        <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700/60">
          {filtrados.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400">No hay animales que coincidan</p>
          ) : (
            filtrados.map((a) => (
              <label
                key={a.id}
                className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-main-50 dark:hover:bg-gray-700/40"
              >
                <input type="checkbox" checked={selected.has(a.id)} onChange={() => toggleOne(a.id)} className="h-4 w-4 accent-main-600" />
                <span className="font-semibold text-gray-800 dark:text-white">{a.caravana}</span>
                <span className="text-gray-500 dark:text-gray-400">
                  {a.nombre ? `${a.nombre} · ` : ''}{a.categoria} · {a.potrero}
                  {a.dueno ? ` · ${a.dueno}` : ''}
                </span>
              </label>
            ))
          )}
        </div>
      </div>
    </Drawer>
  )
}

export default VacunacionLoteDrawer
