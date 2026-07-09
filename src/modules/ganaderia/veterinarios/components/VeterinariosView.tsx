import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { useDebounce } from 'use-debounce'
import PageHeader from '@modules/shared/ui/PageHeader'
import { ModuleScreen, Panel, PrimaryButton, ScrollArea, SearchInput } from '@modules/shared/ui/primitives'
import { Column, ColumnsToggle, DataTable, useColumnVisibility } from '@modules/shared/ui/DataTable'
import { TrashToggle } from '@modules/shared/ui/TrashToggle'
import { ArchiveButton, TrashRowActions, useTrashState } from '@modules/shared/ui/trash'
import ConfirmDialog from '@modules/shared/ui/ConfirmDialog'
import { useListQuery } from '@modules/shared/hooks/useListQuery'
import { useListMode } from '@modules/shared/hooks/useListMode'
import { InfiniteFooter, ModeToggle, Pagination } from '@modules/shared/ui/ListControls'
import { Drawer } from '@modules/shared/ui/Drawer'
import { Field, inputClass } from '@modules/shared/ui/FormModal'
import type { Veterinario } from '../../shared/types'
import { fetchVeterinariosArchivedPage, fetchVeterinariosPage } from '../veterinarios.api'
import {
  useArchiveVeterinario,
  useCreateVeterinario,
  usePurgeVeterinario,
  useRestoreVeterinario,
  useUpdateVeterinario,
} from '../useVeterinarios'

const PAGE_SIZE = 15
const empty: Omit<Veterinario, 'id'> = { nombre: '', matricula: '', telefono: '', email: '' }

const baseColumns: Column<Veterinario>[] = [
  { key: 'nombre', label: 'Nombre', truncate: true, hideable: false, className: 'font-semibold', render: (v) => v.nombre },
  { key: 'matricula', label: 'Matrícula', render: (v) => v.matricula },
  { key: 'telefono', label: 'Teléfono', render: (v) => v.telefono || '-' },
  { key: 'email', label: 'Email', render: (v) => v.email || '-' },
]

export const VeterinariosView = () => {
  const [search, setSearch] = useState('')
  const [debounced] = useDebounce(search, 300)
  const { mode, setMode } = useListMode()
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(empty)
  const { isVisible, toggle } = useColumnVisibility()
  const { view, setView, isTrash, purgeTarget, setPurgeTarget } = useTrashState<Veterinario>()

  useEffect(() => setPage(1), [debounced, mode, view])

  const lq = useListQuery<Veterinario>({
    key: ['ganaderia.veterinarios', view, debounced],
    fetcher: (p, ps) =>
      isTrash ? fetchVeterinariosArchivedPage(debounced, p, ps) : fetchVeterinariosPage(debounced, p, ps),
    mode,
    page,
    pageSize: PAGE_SIZE,
  })
  const rows = lq.rows

  const { mutateAsync: create, isPending: creating } = useCreateVeterinario()
  const { mutateAsync: update, isPending: updating } = useUpdateVeterinario()
  const { mutateAsync: archive, isPending: archiving } = useArchiveVeterinario()
  const { mutateAsync: restore } = useRestoreVeterinario()
  const { mutateAsync: purge, isPending: purging } = usePurgeVeterinario()
  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }))

  const idx = editingId ? rows.findIndex((v) => v.id === editingId) : -1
  const current = idx >= 0 ? rows[idx] : null
  const canPrev = idx > 0
  const canNext = idx >= 0 && idx < rows.length - 1

  const columns = useMemo(() => {
    if (!isTrash) return baseColumns
    const acciones: Column<Veterinario> = {
      key: 'acciones',
      label: 'Acciones',
      hideable: false,
      render: (v) => (
        <TrashRowActions onRestore={() => handleRestore(v)} onPurge={() => setPurgeTarget(v)} />
      ),
    }
    return [...baseColumns, acciones]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTrash])

  const openCreate = () => {
    setEditingId(null)
    setForm(empty)
    setOpen(true)
  }
  const openEdit = (v: Veterinario) => {
    setEditingId(v.id)
    setForm({ nombre: v.nombre, matricula: v.matricula, telefono: v.telefono, email: v.email })
    setOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.nombre.trim() || !form.matricula.trim()) {
      toast.error('Nombre y matrícula son obligatorios', { theme: 'colored' })
      return
    }
    try {
      if (editingId) {
        await update({ id: editingId, data: form })
        toast.success('Veterinario actualizado', { theme: 'colored' })
      } else {
        await create(form)
        toast.success('Veterinario registrado', { theme: 'colored' })
      }
      setOpen(false)
    } catch {
      toast.error('Ocurrió un error al guardar el veterinario', { theme: 'colored' })
    }
  }

  const handleArchive = async () => {
    if (!editingId) return
    try {
      await archive(editingId)
      toast.success('Veterinario archivado · está en la Papelera', { theme: 'colored' })
      setOpen(false)
    } catch {
      toast.error('No se pudo archivar', { theme: 'colored' })
    }
  }
  const handleRestore = async (v: Veterinario) => {
    try {
      await restore(v.id)
      toast.success(`${v.nombre} restaurado`, { theme: 'colored' })
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
    ? { label: 'Sin resultados', description: 'No hay veterinarios que coincidan con la búsqueda.' }
    : {
        label: 'Todavía no hay veterinarios',
        description: 'Registrá a los veterinarios para asignarlos a las vacunaciones.',
        action: <PrimaryButton onClick={() => openCreate()}>Cargar primer veterinario</PrimaryButton>,
      }

  return (
    <ModuleScreen>
      <PageHeader
        section="GANADERÍA"
        title="Veterinarios"
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <TrashToggle view={view} onChange={setView} />
            {!isTrash && <PrimaryButton onClick={openCreate}>Nuevo veterinario</PrimaryButton>}
          </div>
        }
      />
      <ScrollArea onScrollEnd={mode === 'infinite' && lq.hasNext && !lq.isFetchingNext ? lq.fetchNext : undefined}>
        <Panel className="p-2.5 sm:p-4 flex flex-1 flex-col min-h-0">
          <div className="flex items-center gap-2 mb-3">
            <SearchInput value={search} onChange={setSearch} placeholder="Buscar nombre o matrícula…" />
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden sm:inline text-sm text-gray-400">
                {lq.total} {isTrash ? 'archivados' : 'veterinarios'}
              </span>
              <ModeToggle mode={mode} onChange={setMode} />
              <ColumnsToggle columns={columns} isVisible={isVisible} toggle={toggle} />
            </div>
          </div>
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(v) => v.id}
            isLoading={lq.isLoading}
            emptyLabel={emptyState.label}
            emptyIcon="🩺"
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
        title={editingId ? `Veterinario · ${current?.matricula ?? ''}` : 'Nuevo veterinario'}
        subtitle={editingId ? current?.nombre : undefined}
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
        <Field label="Matrícula *">
          <input className={inputClass} value={form.matricula} onChange={(e) => set('matricula', e.target.value)} />
        </Field>
        <Field label="Teléfono">
          <input className={inputClass} value={form.telefono} onChange={(e) => set('telefono', e.target.value)} />
        </Field>
        <Field label="Email">
          <input className={inputClass} value={form.email} onChange={(e) => set('email', e.target.value)} />
        </Field>
      </Drawer>

      <ConfirmDialog
        open={!!purgeTarget}
        title="Eliminar definitivamente"
        message={
          <>
            Vas a eliminar a <b>{purgeTarget?.nombre}</b> de forma permanente. Esta acción no se puede deshacer.
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

export default VeterinariosView
