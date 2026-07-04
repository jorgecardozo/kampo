import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { useDebounce } from 'use-debounce'
import { Archive, RotateCcw, Trash2 } from 'lucide-react'
import PageHeader from '@modules/shared/ui/PageHeader'
import { ModuleScreen, Panel, PrimaryButton, ScrollArea, SearchInput } from '@modules/shared/ui/primitives'
import { Column, ColumnsToggle, DataTable, useColumnVisibility } from '@modules/shared/ui/DataTable'
import { TrashToggle } from '@modules/shared/ui/TrashToggle'
import ConfirmDialog from '@modules/shared/ui/ConfirmDialog'
import { useListQuery } from '@modules/shared/hooks/useListQuery'
import { useListMode } from '@modules/shared/hooks/useListMode'
import { InfiniteFooter, ModeToggle, Pagination } from '@modules/shared/ui/ListControls'
import { Drawer } from '@modules/shared/ui/Drawer'
import { Field, inputClass } from '@modules/shared/ui/FormModal'
import type { Dueno } from '../../shared/types'
import { fetchDuenosArchivedPage, fetchDuenosPage } from '../duenos.api'
import {
  useArchiveDueno,
  useCreateDueno,
  usePurgeDueno,
  useRestoreDueno,
  useUpdateDueno,
} from '../useDuenos'

const PAGE_SIZE = 15
const empty: Omit<Dueno, 'id'> = { nombre: '', alias: '', telefono: '', email: '', documento: '' }

const baseColumns: Column<Dueno>[] = [
  { key: 'nombre', label: 'Nombre', hideable: false, className: 'font-semibold', render: (d) => d.nombre },
  { key: 'alias', label: 'Alias', render: (d) => d.alias || '-' },
  { key: 'telefono', label: 'Teléfono', render: (d) => d.telefono || '-' },
  { key: 'email', label: 'Email', render: (d) => d.email || '-' },
  { key: 'documento', label: 'Documento / CUIT', render: (d) => d.documento || '-' },
]

export const DuenosView = () => {
  const [search, setSearch] = useState('')
  const [debounced] = useDebounce(search, 300)
  const { mode, setMode } = useListMode()
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(empty)
  const { isVisible, toggle } = useColumnVisibility()
  const [view, setView] = useState<'activos' | 'papelera'>('activos')
  const [purgeTarget, setPurgeTarget] = useState<Dueno | null>(null)
  const isTrash = view === 'papelera'

  useEffect(() => setPage(1), [debounced, mode, view])

  const lq = useListQuery<Dueno>({
    key: ['ganaderia.duenos', view, debounced],
    fetcher: (p, ps) =>
      isTrash ? fetchDuenosArchivedPage(debounced, p, ps) : fetchDuenosPage(debounced, p, ps),
    mode,
    page,
    pageSize: PAGE_SIZE,
  })
  const rows = lq.rows

  const { mutateAsync: create, isPending: creating } = useCreateDueno()
  const { mutateAsync: update, isPending: updating } = useUpdateDueno()
  const { mutateAsync: archive, isPending: archiving } = useArchiveDueno()
  const { mutateAsync: restore } = useRestoreDueno()
  const { mutateAsync: purge, isPending: purging } = usePurgeDueno()
  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }))

  const handleArchive = async () => {
    if (!editingId) return
    try {
      await archive(editingId)
      toast.success('Dueño archivado · está en la Papelera', { theme: 'colored' })
      setOpen(false)
    } catch {
      toast.error('No se pudo archivar', { theme: 'colored' })
    }
  }

  const handleRestore = async (d: Dueno) => {
    try {
      await restore(d.id)
      toast.success(`${d.nombre} restaurado`, { theme: 'colored' })
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

  const columns = useMemo(() => {
    if (!isTrash) return baseColumns
    const acciones: Column<Dueno> = {
      key: 'acciones',
      label: 'Acciones',
      hideable: false,
      render: (d) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => handleRestore(d)}
            className="inline-flex items-center gap-1 rounded-md border border-emerald-200 dark:border-emerald-900 px-2.5 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
          >
            <RotateCcw size={13} /> Restaurar
          </button>
          <button
            type="button"
            onClick={() => setPurgeTarget(d)}
            className="inline-flex items-center gap-1 rounded-md border border-rose-200 dark:border-rose-900 px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30"
          >
            <Trash2 size={13} /> Eliminar
          </button>
        </div>
      ),
    }
    return [...baseColumns, acciones]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTrash])

  const idx = editingId ? rows.findIndex((d) => d.id === editingId) : -1
  const current = idx >= 0 ? rows[idx] : null
  const canPrev = idx > 0
  const canNext = idx >= 0 && idx < rows.length - 1

  const openCreate = () => {
    setEditingId(null)
    setForm(empty)
    setOpen(true)
  }
  const openEdit = (d: Dueno) => {
    setEditingId(d.id)
    setForm({ nombre: d.nombre, alias: d.alias, telefono: d.telefono, email: d.email, documento: d.documento })
    setOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.nombre.trim()) {
      toast.error('El nombre es obligatorio', { theme: 'colored' })
      return
    }
    try {
      if (editingId) {
        await update({ id: editingId, data: form })
        toast.success('Dueño actualizado', { theme: 'colored' })
      } else {
        await create(form)
        toast.success('Dueño registrado', { theme: 'colored' })
      }
      setOpen(false)
    } catch {
      toast.error('Ocurrió un error al guardar el dueño', { theme: 'colored' })
    }
  }

  const emptyState = isTrash
    ? { label: 'La papelera está vacía', description: 'Lo que archives va a aparecer acá y vas a poder restaurarlo.' }
    : debounced
    ? { label: 'Sin resultados', description: 'No hay dueños que coincidan con la búsqueda.' }
    : {
        label: 'Todavía no hay dueños',
        description: 'Registrá a los dueños para poder asignarlos a los animales.',
        action: <PrimaryButton onClick={() => openCreate()}>Cargar primer dueño</PrimaryButton>,
      }

  return (
    <ModuleScreen>
      <PageHeader
        section="GANADERÍA"
        title="Dueños"
        actions={
          <div className="flex items-center gap-2">
            <TrashToggle view={view} onChange={setView} />
            {!isTrash && <PrimaryButton onClick={openCreate}>Nuevo dueño</PrimaryButton>}
          </div>
        }
      />
      <ScrollArea onScrollEnd={mode === 'infinite' && lq.hasNext && !lq.isFetchingNext ? lq.fetchNext : undefined}>
        <Panel className="p-4 flex flex-1 flex-col min-h-0">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
            <SearchInput value={search} onChange={setSearch} placeholder="Buscar nombre, alias o documento…" />
            <div className="md:ml-auto flex items-center gap-3">
              <span className="text-sm text-gray-400">
                {lq.total} {isTrash ? 'archivados' : 'dueños'}
              </span>
              <ModeToggle mode={mode} onChange={setMode} />
              <ColumnsToggle columns={columns} isVisible={isVisible} toggle={toggle} />
            </div>
          </div>
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(d) => d.id}
            isLoading={lq.isLoading}
            emptyLabel={emptyState.label}
            emptyIcon="👤"
            emptyDescription={emptyState.description}
            emptyAction={emptyState.action}
            isVisible={isVisible}
            onRowClick={isTrash ? undefined : openEdit}
            selectedKey={!isTrash && open ? editingId : null}
            loadingMore={mode === 'infinite' && lq.isFetchingNext}
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
        title={editingId ? `Dueño · ${current?.alias || current?.nombre || ''}` : 'Nuevo dueño'}
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
        secondaryActions={
          editingId ? (
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
        <Field label="Nombre *">
          <input className={inputClass} value={form.nombre} onChange={(e) => set('nombre', e.target.value)} />
        </Field>
        <Field label="Alias">
          <input className={inputClass} value={form.alias} onChange={(e) => set('alias', e.target.value)} />
        </Field>
        <Field label="Teléfono">
          <input className={inputClass} value={form.telefono} onChange={(e) => set('telefono', e.target.value)} />
        </Field>
        <Field label="Email">
          <input className={inputClass} value={form.email} onChange={(e) => set('email', e.target.value)} />
        </Field>
        <Field label="Documento / CUIT" full>
          <input className={inputClass} value={form.documento} onChange={(e) => set('documento', e.target.value)} />
        </Field>
      </Drawer>

      <ConfirmDialog
        open={!!purgeTarget}
        title="Eliminar definitivamente"
        message={
          <>
            Vas a eliminar a <b>{purgeTarget?.nombre}</b> de forma permanente. Esta acción no se
            puede deshacer.
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

export default DuenosView
