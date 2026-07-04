import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
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
import FilterSelect from '@modules/shared/ui/FilterSelect'
import { Badge } from '@modules/shared/ui/primitives'
import { formatCurrency } from '@modules/shared/lib/format'
import type { AreaGasto } from '../../shared/types'
import { CategoriaConTotal, fetchCategoriasArchivedPage, fetchCategoriasConTotalesPage } from '../categorias.api'
import {
  useArchiveCategoria,
  useCreateCategoria,
  usePurgeCategoria,
  useRestoreCategoria,
  useUpdateCategoria,
} from '../useCategorias'

const PAGE_SIZE = 15

const areaLabel = (a: AreaGasto) => (a === 'ganaderia' ? 'Ganadería' : 'Campo')

const baseColumns: Column<CategoriaConTotal>[] = [
  { key: 'nombre', label: 'Categoría', hideable: false, className: 'font-semibold', render: (c) => c.nombre },
  {
    key: 'area',
    label: 'Área',
    render: (c) => <Badge tone={c.area === 'ganaderia' ? 'green' : 'blue'}>{areaLabel(c.area)}</Badge>,
  },
  { key: 'cantidad', label: 'Gastos registrados', render: (c) => c.cantidad },
  { key: 'total', label: 'Total acumulado', className: 'font-semibold', render: (c) => formatCurrency(c.totalGastado) },
]

export const CategoriasView = () => {
  const { mode, setMode } = useListMode()
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [nombre, setNombre] = useState('')
  const [area, setArea] = useState<AreaGasto>('campo')
  const { isVisible, toggle } = useColumnVisibility()
  const { view, setView, isTrash, purgeTarget, setPurgeTarget } = useTrashState<CategoriaConTotal>()

  useEffect(() => setPage(1), [mode, view])

  const lq = useListQuery<CategoriaConTotal>({
    key: ['gastos.categorias', 'totales', view],
    fetcher: (p, ps) =>
      isTrash ? fetchCategoriasArchivedPage('', p, ps) : fetchCategoriasConTotalesPage('', p, ps),
    mode,
    page,
    pageSize: PAGE_SIZE,
  })
  const rows = lq.rows

  const { mutateAsync: create, isPending: creating } = useCreateCategoria()
  const { mutateAsync: update, isPending: updating } = useUpdateCategoria()
  const { mutateAsync: archive, isPending: archiving } = useArchiveCategoria()
  const { mutateAsync: restore } = useRestoreCategoria()
  const { mutateAsync: purge, isPending: purging } = usePurgeCategoria()

  const idx = editingId ? rows.findIndex((c) => c.id === editingId) : -1
  const current = idx >= 0 ? rows[idx] : null
  const canPrev = idx > 0
  const canNext = idx >= 0 && idx < rows.length - 1

  const columns = useMemo(() => {
    if (!isTrash) return baseColumns
    const acciones: Column<CategoriaConTotal> = {
      key: 'acciones',
      label: 'Acciones',
      hideable: false,
      render: (c) => <TrashRowActions onRestore={() => handleRestore(c)} onPurge={() => setPurgeTarget(c)} />,
    }
    return [...baseColumns, acciones]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTrash])

  const openCreate = () => {
    setEditingId(null)
    setNombre('')
    setArea('campo')
    setOpen(true)
  }
  const openEdit = (c: CategoriaConTotal) => {
    setEditingId(c.id)
    setNombre(c.nombre)
    setArea(c.area)
    setOpen(true)
  }

  const handleSubmit = async () => {
    if (!nombre.trim()) {
      toast.error('El nombre es obligatorio', { theme: 'colored' })
      return
    }
    try {
      if (editingId) {
        await update({ id: editingId, nombre: nombre.trim(), area })
        toast.success('Categoría actualizada', { theme: 'colored' })
      } else {
        await create({ nombre: nombre.trim(), area })
        toast.success('Categoría creada', { theme: 'colored' })
      }
      setOpen(false)
    } catch {
      toast.error('Ocurrió un error al guardar la categoría', { theme: 'colored' })
    }
  }

  const handleArchive = async () => {
    if (!editingId) return
    try {
      await archive(editingId)
      toast.success('Categoría archivada · está en la Papelera', { theme: 'colored' })
      setOpen(false)
    } catch {
      toast.error('No se pudo archivar', { theme: 'colored' })
    }
  }
  const handleRestore = async (c: CategoriaConTotal) => {
    try {
      await restore(c.id)
      toast.success(`${c.nombre} restaurada`, { theme: 'colored' })
    } catch {
      toast.error('No se pudo restaurar', { theme: 'colored' })
    }
  }
  const handlePurge = async () => {
    if (!purgeTarget) return
    try {
      await purge(purgeTarget.id)
      toast.success('Eliminada definitivamente', { theme: 'colored' })
      setPurgeTarget(null)
    } catch {
      toast.error('No se pudo eliminar (puede tener gastos asociados)', { theme: 'colored' })
    }
  }

  const emptyState = isTrash
    ? { label: 'La papelera está vacía', description: 'Lo que archives va a aparecer acá y vas a poder restaurarlo.' }
    : {
        label: 'Todavía no hay categorías',
        description: 'Creá categorías (Sanidad, Combustible, etc.) para clasificar tus gastos.',
        action: <PrimaryButton onClick={() => openCreate()}>Crear primera categoría</PrimaryButton>,
      }

  return (
    <ModuleScreen>
      <PageHeader
        section="GASTOS DEL CAMPO"
        title="Categorías"
        actions={
          <div className="flex items-center gap-2">
            <TrashToggle view={view} onChange={setView} />
            {!isTrash && <PrimaryButton onClick={openCreate}>Nueva categoría</PrimaryButton>}
          </div>
        }
      />
      <ScrollArea onScrollEnd={mode === 'infinite' && lq.hasNext && !lq.isFetchingNext ? lq.fetchNext : undefined}>
        <Panel className="p-4 flex flex-1 flex-col min-h-0">
          <div className="flex items-center justify-end gap-3 mb-4">
            <span className="text-sm text-gray-400 mr-auto">
              {lq.total} {isTrash ? 'archivadas' : 'categorías'}
            </span>
            <ModeToggle mode={mode} onChange={setMode} />
            <ColumnsToggle columns={columns} isVisible={isVisible} toggle={toggle} />
          </div>
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(c) => c.id}
            isLoading={lq.isLoading}
            emptyLabel={emptyState.label}
            emptyIcon="🏷️"
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
        title={editingId ? `Categoría · ${current?.nombre ?? ''}` : 'Nueva categoría de gasto'}
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
          <input className={inputClass} value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </Field>
        <Field label="Área">
          <FilterSelect
            value={area}
            onChange={(v) => setArea(v as AreaGasto)}
            options={[
              { value: 'campo', label: 'Campo' },
              { value: 'ganaderia', label: 'Ganadería' },
            ]}
          />
        </Field>
      </Drawer>

      <ConfirmDialog
        open={!!purgeTarget}
        title="Eliminar definitivamente"
        message={
          <>
            Vas a eliminar <b>{purgeTarget?.nombre}</b> de forma permanente. Si tiene gastos asociados, no se
            podrá eliminar (archivala en su lugar).
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

export default CategoriasView
