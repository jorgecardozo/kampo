import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Drawer } from '@features/shared/ui/Drawer'
import { ArchiveButton } from '@features/shared/ui/trash'
import { Field, inputClass } from '@features/shared/ui/FormModal'
import FilterSelect from '@features/shared/ui/FilterSelect'
import { formatDate, toISODate } from '@features/shared/lib/format'

const toOpts = (arr: readonly string[]) => arr.map((v) => ({ value: v, label: v }))
import { CAMPOS, MEDIOS_PAGO, PROVEEDORES, RESPONSABLES } from '../../shared/constants'
import type { Gasto } from '../../shared/types'
import { useCategorias } from '../../categorias/useCategorias'
import { GastoInput } from '../gastos.api'
import { useArchiveGasto, useCreateGasto, useUpdateGasto } from '../useGastos'

type Props = {
  open: boolean
  onClose: () => void
  initial?: Gasto | null
  items?: Gasto[]
  onNavigate?: (g: Gasto) => void
}

const emptyInput = (): GastoInput => ({
  fecha: toISODate(new Date()),
  categoriaId: '',
  descripcion: '',
  monto: 0,
  proveedor: PROVEEDORES[0],
  medioPago: MEDIOS_PAGO[0],
  campo: CAMPOS[0],
  responsable: RESPONSABLES[0],
})

export const GastoFormDrawer = ({ open, onClose, initial, items, onNavigate }: Props) => {
  const isEdit = !!initial
  const idx = items && initial ? items.findIndex((x) => x.id === initial.id) : -1
  const canPrev = idx > 0
  const canNext = idx >= 0 && idx < (items?.length ?? 0) - 1
  const [form, setForm] = useState<GastoInput>(emptyInput())
  const { data: categorias } = useCategorias()
  const { mutateAsync: create, isPending: creating } = useCreateGasto()
  const { mutateAsync: update, isPending: updating } = useUpdateGasto()
  const { mutateAsync: archive, isPending: archiving } = useArchiveGasto()

  useEffect(() => {
    if (!open) return
    setForm(
      initial
        ? {
            fecha: initial.fecha,
            categoriaId: initial.categoriaId,
            descripcion: initial.descripcion,
            monto: initial.monto,
            proveedor: initial.proveedor,
            medioPago: initial.medioPago,
            campo: initial.campo,
            responsable: initial.responsable,
          }
        : emptyInput()
    )
  }, [open, initial])

  const set = (k: keyof GastoInput, v: any) => setForm((p) => ({ ...p, [k]: v }))

  const handleArchive = async () => {
    if (!isEdit) return
    try {
      await archive(initial!.id)
      toast.success('Gasto archivado · está en la Papelera', { theme: 'colored' })
      onClose()
    } catch {
      toast.error('No se pudo archivar el gasto', { theme: 'colored' })
    }
  }

  const handleSubmit = async () => {
    if (!form.categoriaId) {
      toast.error('Elegí una categoría', { theme: 'colored' })
      return
    }
    if (!form.descripcion.trim()) {
      toast.error('La descripción es obligatoria', { theme: 'colored' })
      return
    }
    const data = { ...form, monto: Number(form.monto) || 0 }
    try {
      if (isEdit) {
        await update({ id: initial!.id, data })
        toast.success('Gasto actualizado', { theme: 'colored' })
      } else {
        await create(data)
        toast.success('Gasto registrado', { theme: 'colored' })
      }
      onClose()
    } catch {
      toast.error('Ocurrió un error al guardar el gasto', { theme: 'colored' })
    }
  }

  return (
    <Drawer
      open={open}
      title={isEdit ? `Gasto · ${initial!.descripcion}` : 'Registrar gasto'}
      subtitle={isEdit ? `${formatDate(initial!.fecha)} · ${initial!.campo}` : 'Cargá un nuevo gasto'}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitting={creating || updating}
      submitLabel={isEdit ? 'Guardar cambios' : 'Registrar gasto'}
      onPrev={onNavigate && canPrev ? () => onNavigate(items![idx - 1]) : undefined}
      onNext={onNavigate && canNext ? () => onNavigate(items![idx + 1]) : undefined}
      canPrev={canPrev}
      canNext={canNext}
      navLabel={idx >= 0 && items ? `${idx + 1} / ${items.length}` : undefined}
      secondaryActions={isEdit ? <ArchiveButton onClick={handleArchive} pending={archiving} /> : undefined}
    >
      <Field label="Fecha">
        <input type="date" className={inputClass} value={form.fecha} onChange={(e) => set('fecha', e.target.value)} />
      </Field>
      <Field label="Categoría *">
        <FilterSelect
          isSearchable
          value={form.categoriaId}
          onChange={(v) => set('categoriaId', v)}
          placeholder="Seleccionar…"
          options={(categorias ?? []).map((c) => ({ value: c.id, label: c.nombre }))}
        />
      </Field>
      <Field label="Descripción *" full>
        <input className={inputClass} value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} />
      </Field>
      <Field label="Monto ($)">
        <input type="number" className={inputClass} value={form.monto} onChange={(e) => set('monto', e.target.value)} />
      </Field>
      <Field label="Medio de pago">
        <FilterSelect value={form.medioPago} onChange={(v) => set('medioPago', v)} options={toOpts(MEDIOS_PAGO)} />
      </Field>
      <Field label="Proveedor">
        <FilterSelect isSearchable value={form.proveedor} onChange={(v) => set('proveedor', v)} options={toOpts(PROVEEDORES)} />
      </Field>
      <Field label="Campo / Potrero">
        <FilterSelect value={form.campo} onChange={(v) => set('campo', v)} options={toOpts(CAMPOS)} />
      </Field>
      <Field label="Responsable">
        <FilterSelect value={form.responsable} onChange={(v) => set('responsable', v)} options={toOpts(RESPONSABLES)} />
      </Field>
    </Drawer>
  )
}

export default GastoFormDrawer
