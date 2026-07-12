import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Archive, Plus } from 'lucide-react'
import { toast } from 'react-toastify'
import { Drawer } from '@modules/shared/ui/Drawer'
import { Field, inputClass } from '@modules/shared/ui/FormModal'
import FilterSelect from '@modules/shared/ui/FilterSelect'
import { EmptyRow, LoadingRow, Table, Td, Th } from '@modules/shared/ui/primitives'
import { formatDate, toISODate } from '@modules/shared/lib/format'
import { CATEGORIAS, COLORES, ESTADOS, POTREROS, RAZAS, SEXOS } from '../../shared/constants'
import type { Animal } from '../../shared/types'
import { useDuenos } from '../../duenos/useDuenos'
import { fetchVacunacionesByAnimal } from '../../vacunaciones/vacunaciones.api'
import { useArchiveAnimal, useCreateAnimal, useUpdateAnimal } from '../useAnimales'

const toOpts = (arr: readonly string[]) => arr.map((v) => ({ value: v, label: v }))

type Props = {
  open: boolean
  onClose: () => void
  initial?: Animal | null
  items?: Animal[]
  onNavigate?: (a: Animal) => void
}

const empty: Omit<Animal, 'id'> = {
  caravana: '',
  nombre: '',
  categoria: 'Vaca',
  raza: RAZAS[0],
  sexo: 'Hembra',
  fechaNacimiento: toISODate(new Date()),
  pesoKg: 0,
  color: COLORES[0],
  potrero: POTREROS[0],
  dueno: '',
  estado: 'Activo',
  fechaIngreso: toISODate(new Date()),
}

export const AnimalFormDrawer = ({ open, onClose, initial, items, onNavigate }: Props) => {
  const router = useRouter()
  const isEdit = !!initial
  const idx = items && initial ? items.findIndex((x) => x.id === initial.id) : -1
  const canPrev = idx > 0
  const canNext = idx >= 0 && idx < (items?.length ?? 0) - 1
  const [form, setForm] = useState<Omit<Animal, 'id'>>(empty)
  const { mutateAsync: create, isPending: creating } = useCreateAnimal()
  const { mutateAsync: update, isPending: updating } = useUpdateAnimal()
  const { mutateAsync: archive, isPending: archiving } = useArchiveAnimal()
  const { data: duenos } = useDuenos()

  // Historial de vacunaciones de este animal (solo en edición).
  const { data: historial, isLoading: loadingHist } = useQuery({
    queryKey: ['ganaderia.vacunaciones', 'byAnimal', initial?.id],
    queryFn: () => fetchVacunacionesByAnimal(initial!.id),
    enabled: isEdit && open,
  })

  // Prefill al abrir / al cambiar de fila seleccionada.
  useEffect(() => {
    if (open) setForm(initial ? { ...empty, ...initial } : empty)
  }, [open, initial])

  const set = (k: keyof typeof form, v: any) => setForm((p) => ({ ...p, [k]: v }))

  // El sexo se deduce de la categoría (Ternero/a es ambiguo → no se toca).
  const sexoPorCategoria: Record<string, 'Hembra' | 'Macho'> = {
    Vaca: 'Hembra',
    Vaquillona: 'Hembra',
    Toro: 'Macho',
    Novillo: 'Macho',
  }
  const setCategoria = (v: string) =>
    setForm((p) => ({ ...p, categoria: v, ...(sexoPorCategoria[v] ? { sexo: sexoPorCategoria[v] } : {}) }))

  const handleArchive = async () => {
    if (!initial) return
    try {
      await archive(initial.id)
      toast.success('Animal archivado · podés restaurarlo desde la Papelera', { theme: 'colored' })
      onClose()
    } catch {
      toast.error('No se pudo archivar el animal', { theme: 'colored' })
    }
  }

  const handleSubmit = async () => {
    const data = { ...form, pesoKg: Number(form.pesoKg) || 0 }
    try {
      if (isEdit) {
        await update({ id: initial!.id, data })
        toast.success('Animal actualizado', { theme: 'colored' })
      } else {
        await create(data)
        toast.success('Animal registrado', { theme: 'colored' })
      }
      onClose()
    } catch {
      toast.error('Ocurrió un error al guardar el animal', { theme: 'colored' })
    }
  }

  return (
    <Drawer
      open={open}
      title={isEdit ? `Animal · ${initial!.caravana || initial!.nombre || 'sin caravana'}` : 'Nuevo animal'}
      subtitle={isEdit ? `${initial!.categoria} · ${initial!.raza}` : 'Cargá un nuevo animal'}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitting={creating || updating}
      submitLabel={isEdit ? 'Guardar cambios' : 'Registrar animal'}
      onPrev={onNavigate && idx > 0 ? () => onNavigate(items![idx - 1]) : undefined}
      onNext={onNavigate && canNext ? () => onNavigate(items![idx + 1]) : undefined}
      canPrev={canPrev}
      canNext={canNext}
      navLabel={idx >= 0 && items ? `${idx + 1} / ${items.length}` : undefined}
      secondaryActions={
        isEdit ? (
          <button
            type="button"
            onClick={handleArchive}
            disabled={archiving}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 dark:border-rose-900 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 disabled:opacity-60"
          >
            <Archive size={16} /> {archiving ? 'Archivando…' : 'Archivar'}
          </button>
        ) : undefined
      }
    >
      <Field label="Caravana (opcional)">
        <input
          className={inputClass}
          value={form.caravana}
          onChange={(e) => set('caravana', e.target.value)}
          placeholder="Si lo dejás vacío, se asigna un código (V-001, V-002…)"
        />
      </Field>
      <Field label="Nombre (opcional)">
        <input className={inputClass} value={form.nombre} onChange={(e) => set('nombre', e.target.value)} />
      </Field>
      <Field label="Categoría">
        <FilterSelect value={form.categoria} onChange={setCategoria} options={toOpts(CATEGORIAS)} />
      </Field>
      <Field label="Sexo">
        <FilterSelect value={form.sexo} onChange={(v) => set('sexo', v)} options={toOpts(SEXOS)} />
      </Field>
      <Field label="Raza">
        <FilterSelect isSearchable value={form.raza} onChange={(v) => set('raza', v)} options={toOpts(RAZAS)} />
      </Field>
      <Field label="Color">
        <FilterSelect value={form.color} onChange={(v) => set('color', v)} options={toOpts(COLORES)} />
      </Field>
      <Field label="Peso (kg)">
        <input type="number" className={inputClass} value={form.pesoKg} onChange={(e) => set('pesoKg', e.target.value)} />
      </Field>
      <Field label="Potrero">
        <FilterSelect value={form.potrero} onChange={(v) => set('potrero', v)} options={toOpts(POTREROS)} />
      </Field>
      <Field label="Dueño">
        <FilterSelect
          isSearchable
          value={form.dueno}
          onChange={(v) => set('dueno', v)}
          placeholder="Sin asignar"
          options={(duenos ?? []).map((d) => ({ value: d.nombre, label: d.alias ? `${d.nombre} (${d.alias})` : d.nombre }))}
        />
      </Field>
      <Field label="Fecha de nacimiento">
        <input type="date" className={inputClass} value={form.fechaNacimiento} onChange={(e) => set('fechaNacimiento', e.target.value)} />
      </Field>
      <Field label="Fecha de ingreso">
        <input type="date" className={inputClass} value={form.fechaIngreso} onChange={(e) => set('fechaIngreso', e.target.value)} />
      </Field>
      <Field label="Estado">
        <FilterSelect value={form.estado} onChange={(v) => set('estado', v)} options={toOpts(ESTADOS)} />
      </Field>
      <Field label="Observaciones" full>
        <textarea
          className={inputClass}
          rows={2}
          value={form.observaciones || ''}
          onChange={(e) => set('observaciones', e.target.value)}
        />
      </Field>

      {/* Historial de vacunaciones de esta vaca (solo en edición) */}
      {isEdit && (
        <div className="md:col-span-2 mt-2">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Vacunaciones de {initial!.caravana || initial!.nombre || 'este animal'}
            </h3>
            <button
              type="button"
              onClick={() => router.push(`/ganaderia/vacunaciones?nuevoAnimal=${initial!.id}`)}
              className="inline-flex items-center gap-1 rounded-lg bg-main-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-main-700"
            >
              <Plus size={14} /> Registrar vacunación
            </button>
          </div>
          <Table
            head={
              <tr>
                <Th>Vacuna</Th>
                <Th>Aplicación</Th>
                <Th>Próxima dosis</Th>
                <Th>Veterinario</Th>
              </tr>
            }
          >
            {loadingHist ? (
              <LoadingRow colSpan={4} />
            ) : (historial?.length ?? 0) === 0 ? (
              <EmptyRow colSpan={4} label="Esta vaca no tiene vacunaciones registradas" />
            ) : (
              historial!.map((v, i) => (
                <tr
                  key={v.id}
                  onClick={() => router.push(`/ganaderia/vacunaciones?editar=${v.id}`)}
                  className={`cursor-pointer hover:bg-main-50 dark:hover:bg-gray-700/60 ${i % 2 === 1 ? 'bg-slate-50 dark:bg-gray-700/30' : 'bg-white dark:bg-gray-800'}`}
                >
                  <Td className="font-medium">{v.tipoVacunaNombre}</Td>
                  <Td>{formatDate(v.fechaAplicacion)}</Td>
                  <Td>{formatDate(v.proximaFecha)}</Td>
                  <Td>{v.veterinarioNombre}</Td>
                </tr>
              ))
            )}
          </Table>
        </div>
      )}
    </Drawer>
  )
}

export default AnimalFormDrawer
