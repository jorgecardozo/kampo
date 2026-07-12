import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Layers } from 'lucide-react'
import { toast } from 'react-toastify'
import { Drawer } from '@modules/shared/ui/Drawer'
import { Field, inputClass } from '@modules/shared/ui/FormModal'
import FilterSelect from '@modules/shared/ui/FilterSelect'
import { addDays, formatDate, toISODate } from '@modules/shared/lib/format'
import type { Vacunacion } from '../../shared/types'
import { useAnimales } from '../../animales/useAnimales'
import { useTiposVacuna } from '../../tipos-vacuna/useTiposVacuna'
import { useVeterinarios } from '../../veterinarios/useVeterinarios'
import { VacunacionInput } from '../vacunaciones.api'
import { ArchiveButton } from '@modules/shared/ui/trash'
import { useArchiveVacunacion, useCreateVacunacion, useUpdateVacunacion } from '../useVacunaciones'

type Props = {
  open: boolean
  onClose: () => void
  initial?: Vacunacion | null
  items?: Vacunacion[]
  onNavigate?: (v: Vacunacion) => void
  presetAnimalId?: string
}

const emptyInput = (): VacunacionInput => ({
  animalId: '',
  tipoVacunaId: '',
  fechaAplicacion: toISODate(new Date()),
  veterinarioId: '',
  loteProducto: '',
  costo: 0,
  observaciones: '',
})

export const VacunacionFormDrawer = ({ open, onClose, initial, items, onNavigate, presetAnimalId }: Props) => {
  const router = useRouter()
  const isEdit = !!initial
  const idx = items && initial ? items.findIndex((x) => x.id === initial.id) : -1
  const canPrev = idx > 0
  const canNext = idx >= 0 && idx < (items?.length ?? 0) - 1
  const [form, setForm] = useState<VacunacionInput>(emptyInput())
  const { data: animales } = useAnimales({})
  const { data: tipos } = useTiposVacuna()
  const { data: vets } = useVeterinarios()
  const { mutateAsync: create, isPending: creating } = useCreateVacunacion()
  const { mutateAsync: update, isPending: updating } = useUpdateVacunacion()
  const { mutateAsync: archive, isPending: archiving } = useArchiveVacunacion()

  useEffect(() => {
    if (!open) return
    setForm(
      initial
        ? {
            animalId: initial.animalId,
            tipoVacunaId: initial.tipoVacunaId,
            fechaAplicacion: initial.fechaAplicacion,
            veterinarioId: initial.veterinarioId,
            loteProducto: initial.loteProducto,
            costo: initial.costo,
            observaciones: initial.observaciones ?? '',
          }
        : { ...emptyInput(), animalId: presetAnimalId ?? '' }
    )
  }, [open, initial, presetAnimalId])

  const set = (k: keyof VacunacionInput, v: any) => setForm((p) => ({ ...p, [k]: v }))

  const proximaPreview = useMemo(() => {
    const tipo = tipos?.find((t) => t.id === form.tipoVacunaId)
    if (!tipo || !form.fechaAplicacion) return null
    return addDays(new Date(form.fechaAplicacion), tipo.periodicidadDias)
  }, [tipos, form.tipoVacunaId, form.fechaAplicacion])

  const handleArchive = async () => {
    if (!isEdit) return
    try {
      await archive(initial!.id)
      toast.success('Vacunación archivada · está en la Papelera', { theme: 'colored' })
      onClose()
    } catch {
      toast.error('No se pudo archivar', { theme: 'colored' })
    }
  }

  const handleSubmit = async () => {
    if (!form.animalId || !form.tipoVacunaId || !form.veterinarioId) {
      toast.error('Animal, vacuna y veterinario son obligatorios', { theme: 'colored' })
      return
    }
    const data = { ...form, costo: Number(form.costo) || 0 }
    try {
      if (isEdit) {
        await update({ id: initial!.id, data })
        toast.success('Vacunación actualizada', { theme: 'colored' })
      } else {
        await create(data)
        toast.success('Vacunación registrada', { theme: 'colored' })
      }
      onClose()
    } catch {
      toast.error('Ocurrió un error al guardar la vacunación', { theme: 'colored' })
    }
  }

  return (
    <Drawer
      open={open}
      title={isEdit ? `Vacunación · ${initial!.animalCaravana}` : 'Registrar vacunación'}
      subtitle={isEdit ? initial!.tipoVacunaNombre : 'Cargá una nueva aplicación'}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitting={creating || updating}
      submitLabel={isEdit ? 'Guardar cambios' : 'Registrar vacunación'}
      onPrev={onNavigate && canPrev ? () => onNavigate(items![idx - 1]) : undefined}
      onNext={onNavigate && canNext ? () => onNavigate(items![idx + 1]) : undefined}
      canPrev={canPrev}
      canNext={canNext}
      navLabel={idx >= 0 && items ? `${idx + 1} / ${items.length}` : undefined}
      secondaryActions={isEdit ? <ArchiveButton onClick={handleArchive} pending={archiving} /> : undefined}
    >
      {isEdit && initial!.campaniaId && (
        <button
          type="button"
          onClick={() => router.push(`/ganaderia/campanias?ver=${initial!.campaniaId}`)}
          className="md:col-span-2 flex items-center gap-2 rounded-lg border border-main-200 dark:border-gray-700 bg-main-50 dark:bg-gray-800 px-3 py-2 text-sm font-medium text-main-700 dark:text-main-400 hover:bg-main-100 dark:hover:bg-gray-700"
        >
          <Layers size={16} /> Parte de una campaña de vacunación · Ver campaña →
        </button>
      )}
      <Field label="Animal *">
        <FilterSelect
          isSearchable
          value={form.animalId}
          onChange={(v) => set('animalId', v)}
          placeholder="Seleccionar…"
          options={(animales ?? [])
            .filter((a) => a.estado === 'Activo' || a.id === form.animalId)
            .map((a) => ({
              value: a.id,
              label: `${a.caravana}${a.nombre ? ` · ${a.nombre}` : ''} (${a.categoria})`,
            }))}
        />
      </Field>
      <Field label="Vacuna *">
        <FilterSelect
          value={form.tipoVacunaId}
          onChange={(v) => set('tipoVacunaId', v)}
          placeholder="Seleccionar…"
          options={(tipos ?? []).map((t) => ({ value: t.id, label: `${t.nombre} (cada ${t.periodicidadDias} días)` }))}
        />
      </Field>
      <Field label="Fecha de aplicación *">
        <input
          type="date"
          className={inputClass}
          value={form.fechaAplicacion}
          onChange={(e) => set('fechaAplicacion', e.target.value)}
        />
      </Field>
      <Field label="Próxima dosis (calculada)">
        <input
          className={`${inputClass} bg-gray-100 dark:bg-gray-800`}
          value={proximaPreview ? formatDate(proximaPreview) : 'Elegí vacuna y fecha'}
          readOnly
        />
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
      <Field label="Lote del producto">
        <input className={inputClass} value={form.loteProducto} onChange={(e) => set('loteProducto', e.target.value)} />
      </Field>
      <Field label="Costo ($)">
        <input type="number" className={inputClass} value={form.costo} onChange={(e) => set('costo', e.target.value)} />
      </Field>
      <Field label="Observaciones del veterinario" full>
        <textarea
          className={inputClass}
          rows={2}
          value={form.observaciones || ''}
          onChange={(e) => set('observaciones', e.target.value)}
        />
      </Field>
    </Drawer>
  )
}

export default VacunacionFormDrawer
