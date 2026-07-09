import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { useDebounce } from 'use-debounce'
import PageHeader from '@modules/shared/ui/PageHeader'
import { Badge, ModuleScreen, Panel, PrimaryButton, ScrollArea, SearchInput } from '@modules/shared/ui/primitives'
import { Column, ColumnsToggle, DataTable, useColumnVisibility } from '@modules/shared/ui/DataTable'
import { TrashToggle } from '@modules/shared/ui/TrashToggle'
import { ArchiveButton, TrashRowActions, useTrashState } from '@modules/shared/ui/trash'
import ConfirmDialog from '@modules/shared/ui/ConfirmDialog'
import { useListQuery } from '@modules/shared/hooks/useListQuery'
import { useListMode } from '@modules/shared/hooks/useListMode'
import { InfiniteFooter, ModeToggle, Pagination } from '@modules/shared/ui/ListControls'
import { Drawer } from '@modules/shared/ui/Drawer'
import { Field, inputClass } from '@modules/shared/ui/FormModal'
import FilterSelect from '@modules/shared/ui/FilterSelect'
import { VIAS } from '../../shared/constants'
import type { TipoVacuna } from '../../shared/types'
import { fetchTiposVacunaArchivedPage, fetchTiposVacunaPage } from '../tiposVacuna.api'
import {
  useArchiveTipoVacuna,
  useCreateTipoVacuna,
  usePurgeTipoVacuna,
  useRestoreTipoVacuna,
  useUpdateTipoVacuna,
} from '../useTiposVacuna'

const PAGE_SIZE = 15

const empty: Omit<TipoVacuna, 'id'> = {
  nombre: '',
  enfermedad: '',
  periodicidadDias: 180,
  dosis: '',
  via: 'Subcutánea',
  obligatoria: false,
}

const baseColumns: Column<TipoVacuna>[] = [
  { key: 'nombre', label: 'Vacuna', truncate: true, hideable: false, className: 'font-semibold', render: (t) => t.nombre },
  { key: 'enfermedad', label: 'Enfermedad', truncate: true, render: (t) => t.enfermedad },
  { key: 'periodicidad', label: 'Periodicidad', render: (t) => `cada ${t.periodicidadDias} días` },
  { key: 'dosis', label: 'Dosis', render: (t) => t.dosis },
  { key: 'via', label: 'Vía', render: (t) => t.via },
  {
    key: 'obligatoria',
    label: 'Obligatoria',
    render: (t) => (t.obligatoria ? <Badge tone="red">Obligatoria</Badge> : <Badge tone="gray">Opcional</Badge>),
  },
]

export const TiposVacunaView = () => {
  const [search, setSearch] = useState('')
  const [debounced] = useDebounce(search, 300)
  const { mode, setMode } = useListMode()
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(empty)
  const { isVisible, toggle } = useColumnVisibility()
  const { view, setView, isTrash, purgeTarget, setPurgeTarget } = useTrashState<TipoVacuna>()

  useEffect(() => setPage(1), [debounced, mode, view])

  const lq = useListQuery<TipoVacuna>({
    key: ['ganaderia.tiposVacuna', view, debounced],
    fetcher: (p, ps) =>
      isTrash ? fetchTiposVacunaArchivedPage(debounced, p, ps) : fetchTiposVacunaPage(debounced, p, ps),
    mode,
    page,
    pageSize: PAGE_SIZE,
  })
  const rows = lq.rows

  const { mutateAsync: create, isPending: creating } = useCreateTipoVacuna()
  const { mutateAsync: update, isPending: updating } = useUpdateTipoVacuna()
  const { mutateAsync: archive, isPending: archiving } = useArchiveTipoVacuna()
  const { mutateAsync: restore } = useRestoreTipoVacuna()
  const { mutateAsync: purge, isPending: purging } = usePurgeTipoVacuna()
  const set = (k: keyof typeof form, v: any) => setForm((p) => ({ ...p, [k]: v }))

  const idx = editingId ? rows.findIndex((t) => t.id === editingId) : -1
  const current = idx >= 0 ? rows[idx] : null
  const canPrev = idx > 0
  const canNext = idx >= 0 && idx < rows.length - 1

  const columns = useMemo(() => {
    if (!isTrash) return baseColumns
    const acciones: Column<TipoVacuna> = {
      key: 'acciones',
      label: 'Acciones',
      hideable: false,
      render: (t) => <TrashRowActions onRestore={() => handleRestore(t)} onPurge={() => setPurgeTarget(t)} />,
    }
    return [...baseColumns, acciones]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTrash])

  const openCreate = () => {
    setEditingId(null)
    setForm(empty)
    setOpen(true)
  }
  const openEdit = (t: TipoVacuna) => {
    setEditingId(t.id)
    setForm({
      nombre: t.nombre,
      enfermedad: t.enfermedad,
      periodicidadDias: t.periodicidadDias,
      dosis: t.dosis,
      via: t.via,
      obligatoria: t.obligatoria,
    })
    setOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.nombre.trim()) {
      toast.error('El nombre es obligatorio', { theme: 'colored' })
      return
    }
    const data = { ...form, periodicidadDias: Number(form.periodicidadDias) || 0 }
    try {
      if (editingId) {
        await update({ id: editingId, data })
        toast.success('Tipo de vacuna actualizado', { theme: 'colored' })
      } else {
        await create(data)
        toast.success('Tipo de vacuna creado', { theme: 'colored' })
      }
      setOpen(false)
    } catch {
      toast.error('Ocurrió un error al guardar el tipo de vacuna', { theme: 'colored' })
    }
  }

  const handleArchive = async () => {
    if (!editingId) return
    try {
      await archive(editingId)
      toast.success('Tipo de vacuna archivado · está en la Papelera', { theme: 'colored' })
      setOpen(false)
    } catch {
      toast.error('No se pudo archivar', { theme: 'colored' })
    }
  }
  const handleRestore = async (t: TipoVacuna) => {
    try {
      await restore(t.id)
      toast.success(`${t.nombre} restaurado`, { theme: 'colored' })
    } catch {
      toast.error('No se pudo restaurar', { theme: 'colored' })
    }
  }
  const handlePurge = async () => {
    if (!purgeTarget) return
    try {
      await purge(purgeTarget.id)
      toast.success('Eliminado definitivamente', { theme: 'colored' })
      setPurgeTarget(null)
    } catch {
      toast.error('No se pudo eliminar', { theme: 'colored' })
    }
  }

  const emptyState = isTrash
    ? { label: 'La papelera está vacía', description: 'Lo que archives va a aparecer acá y vas a poder restaurarlo.' }
    : debounced
    ? { label: 'Sin resultados', description: 'No hay tipos de vacuna que coincidan con la búsqueda.' }
    : {
        label: 'Todavía no hay tipos de vacuna',
        description: 'Definí las vacunas que usás (Aftosa, Brucelosis, etc.) para registrar las aplicaciones.',
        action: <PrimaryButton onClick={() => openCreate()}>Crear primer tipo</PrimaryButton>,
      }

  return (
    <ModuleScreen>
      <PageHeader
        section="CONFIGURACIÓN"
        title="Tipos de Vacuna"
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <TrashToggle view={view} onChange={setView} />
            {!isTrash && <PrimaryButton onClick={openCreate}>Nuevo tipo</PrimaryButton>}
          </div>
        }
      />
      <ScrollArea onScrollEnd={mode === 'infinite' && lq.hasNext && !lq.isFetchingNext ? lq.fetchNext : undefined}>
        <Panel className="p-2.5 sm:p-4 flex flex-1 flex-col min-h-0">
          <div className="flex items-center gap-2 mb-3">
            <SearchInput value={search} onChange={setSearch} placeholder="Buscar vacuna o enfermedad…" />
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden sm:inline text-sm text-gray-400">
                {lq.total} {isTrash ? 'archivados' : 'tipos'}
              </span>
              <ModeToggle mode={mode} onChange={setMode} />
              <ColumnsToggle columns={columns} isVisible={isVisible} toggle={toggle} />
            </div>
          </div>
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(t) => t.id}
            isLoading={lq.isLoading}
            emptyLabel={emptyState.label}
            emptyIcon="💉"
            emptyDescription={emptyState.description}
            emptyAction={emptyState.action}
            isVisible={isVisible}
            onRowClick={isTrash ? undefined : openEdit}
            selectedKey={!isTrash && open ? editingId : null}
            loadingMore={mode === 'infinite' && lq.isFetchingNext}
            onReachEnd={mode === 'infinite' && lq.hasNext && !lq.isFetchingNext ? lq.fetchNext : undefined}
          />
          {mode === 'paged' ? (
            <Pagination page={page} pageSize={PAGE_SIZE} total={lq.total} onPage={setPage} />
          ) : (
            <InfiniteFooter shown={rows.length} total={lq.total} isFetchingNext={lq.isFetchingNext} hasNext={lq.hasNext} />
          )}
        </Panel>
      </ScrollArea>

      <Drawer
        open={open}
        title={editingId ? `Tipo de vacuna · ${current?.nombre ?? ''}` : 'Nuevo tipo de vacuna'}
        subtitle={editingId ? current?.enfermedad : undefined}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        submitting={creating || updating}
        submitLabel={editingId ? 'Guardar cambios' : 'Guardar'}
        onPrev={canPrev ? () => openEdit(rows[idx - 1]) : undefined}
        onNext={canNext ? () => openEdit(rows[idx + 1]) : undefined}
        canPrev={canPrev}
        canNext={canNext}
        navLabel={idx >= 0 ? `${idx + 1} / ${rows.length}` : undefined}
        secondaryActions={editingId ? <ArchiveButton onClick={handleArchive} pending={archiving} /> : undefined}
      >
        <Field label="Nombre *">
          <input className={inputClass} value={form.nombre} onChange={(e) => set('nombre', e.target.value)} />
        </Field>
        <Field label="Enfermedad que previene">
          <input className={inputClass} value={form.enfermedad} onChange={(e) => set('enfermedad', e.target.value)} />
        </Field>
        <Field label="Periodicidad (días)">
          <input
            type="number"
            className={inputClass}
            value={form.periodicidadDias}
            onChange={(e) => set('periodicidadDias', e.target.value)}
          />
        </Field>
        <Field label="Dosis">
          <input className={inputClass} value={form.dosis} onChange={(e) => set('dosis', e.target.value)} />
        </Field>
        <Field label="Vía de aplicación">
          <FilterSelect
            value={form.via}
            onChange={(v) => set('via', v)}
            options={VIAS.map((v) => ({ value: v, label: v }))}
          />
        </Field>
        <Field label="¿Obligatoria?">
          <FilterSelect
            value={form.obligatoria ? 'si' : 'no'}
            onChange={(v) => set('obligatoria', v === 'si')}
            options={[
              { value: 'no', label: 'No' },
              { value: 'si', label: 'Sí' },
            ]}
          />
        </Field>
      </Drawer>

      <ConfirmDialog
        open={!!purgeTarget}
        title="Eliminar definitivamente"
        message={
          <>
            Vas a eliminar <b>{purgeTarget?.nombre}</b> de forma permanente. Esta acción no se puede deshacer.
          </>
        }
        confirmLabel="Eliminar definitivo"
        loading={purging}
        onConfirm={handlePurge}
        onClose={() => setPurgeTarget(null)}
      />
    </ModuleScreen>
  )
}

export default TiposVacunaView
