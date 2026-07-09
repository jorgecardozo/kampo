import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import PageHeader from '@modules/shared/ui/PageHeader'
import { ModuleScreen, Panel, PrimaryButton, ScrollArea } from '@modules/shared/ui/primitives'
import { Column, ColumnsToggle, DataTable, useColumnVisibility } from '@modules/shared/ui/DataTable'
import { TrashToggle } from '@modules/shared/ui/TrashToggle'
import { ArchiveButton, TrashRowActions, useTrashState } from '@modules/shared/ui/trash'
import ConfirmDialog from '@modules/shared/ui/ConfirmDialog'
import { useListQuery } from '@modules/shared/hooks/useListQuery'
import { useListMode } from '@modules/shared/hooks/useListMode'
import { InfiniteFooter, ModeToggle, Pagination } from '@modules/shared/ui/ListControls'
import { Drawer } from '@modules/shared/ui/Drawer'
import { Field, inputClass } from '@modules/shared/ui/FormModal'
import {
  Potrero,
  archivePotrero,
  createPotrero,
  fetchPotrerosArchivedPage,
  fetchPotrerosPage,
  purgePotrero,
  restorePotrero,
  updatePotrero,
} from '../potreros.api'

const PAGE_SIZE = 15

const empty: Omit<Potrero, 'id'> = { nombre: '', hectareas: 0, ubicacion: '', capacidad: 0 }

const baseColumns: Column<Potrero>[] = [
  { key: 'nombre', label: 'Nombre', hideable: false, className: 'font-semibold', render: (p) => p.nombre },
  { key: 'ubicacion', label: 'Ubicación', render: (p) => p.ubicacion },
  { key: 'hectareas', label: 'Hectáreas', render: (p) => `${p.hectareas} ha` },
  { key: 'capacidad', label: 'Capacidad', render: (p) => `${p.capacidad} cab.` },
]

export const PotrerosView = () => {
  const qc = useQueryClient()
  const { mode, setMode } = useListMode()
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(empty)
  const { isVisible, toggle } = useColumnVisibility()
  const { view, setView, isTrash, purgeTarget, setPurgeTarget } = useTrashState<Potrero>()

  useEffect(() => setPage(1), [mode, view])

  const lq = useListQuery<Potrero>({
    key: ['config.potreros', view],
    fetcher: (p, ps) => (isTrash ? fetchPotrerosArchivedPage('', p, ps) : fetchPotrerosPage('', p, ps)),
    mode,
    page,
    pageSize: PAGE_SIZE,
  })
  const rows = lq.rows

  const invalidate = () => qc.invalidateQueries({ queryKey: ['config.potreros'] })
  const { mutateAsync: create, isPending: creating } = useMutation({
    mutationFn: createPotrero,
    onSuccess: invalidate,
  })
  const { mutateAsync: update, isPending: updating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Potrero> }) => updatePotrero(id, data),
    onSuccess: invalidate,
  })
  const { mutateAsync: archive, isPending: archiving } = useMutation({
    mutationFn: (id: string) => archivePotrero(id),
    onSuccess: invalidate,
  })
  const { mutateAsync: restore } = useMutation({ mutationFn: (id: string) => restorePotrero(id), onSuccess: invalidate })
  const { mutateAsync: purge, isPending: purging } = useMutation({
    mutationFn: (id: string) => purgePotrero(id),
    onSuccess: invalidate,
  })
  const set = (k: keyof typeof form, v: any) => setForm((p) => ({ ...p, [k]: v }))

  const idx = editingId ? rows.findIndex((p) => p.id === editingId) : -1
  const current = idx >= 0 ? rows[idx] : null
  const canPrev = idx > 0
  const canNext = idx >= 0 && idx < rows.length - 1

  const columns = useMemo(() => {
    if (!isTrash) return baseColumns
    const acciones: Column<Potrero> = {
      key: 'acciones',
      label: 'Acciones',
      hideable: false,
      render: (p) => <TrashRowActions onRestore={() => handleRestore(p)} onPurge={() => setPurgeTarget(p)} />,
    }
    return [...baseColumns, acciones]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTrash])

  const openCreate = () => {
    setEditingId(null)
    setForm(empty)
    setOpen(true)
  }
  const openEdit = (p: Potrero) => {
    setEditingId(p.id)
    setForm({ nombre: p.nombre, ubicacion: p.ubicacion, hectareas: p.hectareas, capacidad: p.capacidad })
    setOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.nombre.trim()) {
      toast.error('El nombre es obligatorio', { theme: 'colored' })
      return
    }
    const data = {
      ...form,
      hectareas: Number(form.hectareas) || 0,
      capacidad: Number(form.capacidad) || 0,
    }
    try {
      if (editingId) {
        await update({ id: editingId, data })
        toast.success('Potrero actualizado', { theme: 'colored' })
      } else {
        await create(data)
        toast.success('Potrero creado', { theme: 'colored' })
      }
      setOpen(false)
    } catch {
      toast.error('Ocurrió un error al guardar el potrero', { theme: 'colored' })
    }
  }

  const handleArchive = async () => {
    if (!editingId) return
    try {
      await archive(editingId)
      toast.success('Potrero archivado · está en la Papelera', { theme: 'colored' })
      setOpen(false)
    } catch {
      toast.error('No se pudo archivar', { theme: 'colored' })
    }
  }
  const handleRestore = async (p: Potrero) => {
    try {
      await restore(p.id)
      toast.success(`${p.nombre} restaurado`, { theme: 'colored' })
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
    : {
        label: 'Todavía no hay potreros',
        description: 'Cargá los potreros/campos para ubicar a los animales.',
        action: <PrimaryButton onClick={() => openCreate()}>Crear primer potrero</PrimaryButton>,
      }

  return (
    <ModuleScreen>
      <PageHeader
        section="CONFIGURACIÓN"
        title="Potreros / Campos"
        actions={
          <div className="flex items-center gap-2">
            <TrashToggle view={view} onChange={setView} />
            {!isTrash && <PrimaryButton onClick={openCreate}>Nuevo potrero</PrimaryButton>}
          </div>
        }
      />
      <ScrollArea onScrollEnd={mode === 'infinite' && lq.hasNext && !lq.isFetchingNext ? lq.fetchNext : undefined}>
        <Panel className="p-2.5 sm:p-4 flex flex-1 flex-col min-h-0">
          <div className="flex items-center justify-end gap-2 mb-3">
            <span className="hidden sm:inline text-sm text-gray-400 mr-auto">
              {lq.total} {isTrash ? 'archivados' : 'potreros'}
            </span>
            <ModeToggle mode={mode} onChange={setMode} />
            <ColumnsToggle columns={columns} isVisible={isVisible} toggle={toggle} />
          </div>
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(p) => p.id}
            isLoading={lq.isLoading}
            emptyLabel={emptyState.label}
            emptyIcon="🌾"
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
        title={editingId ? `Potrero · ${current?.nombre ?? ''}` : 'Nuevo potrero'}
        subtitle={editingId ? current?.ubicacion : undefined}
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
        <Field label="Ubicación">
          <input className={inputClass} value={form.ubicacion} onChange={(e) => set('ubicacion', e.target.value)} />
        </Field>
        <Field label="Hectáreas">
          <input type="number" className={inputClass} value={form.hectareas} onChange={(e) => set('hectareas', e.target.value)} />
        </Field>
        <Field label="Capacidad (cabezas)">
          <input type="number" className={inputClass} value={form.capacidad} onChange={(e) => set('capacidad', e.target.value)} />
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

export default PotrerosView
