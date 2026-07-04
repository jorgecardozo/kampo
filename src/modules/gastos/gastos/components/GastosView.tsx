import { useEffect, useMemo, useState } from 'react'
import { useDebounce } from 'use-debounce'
import PageHeader from '@modules/shared/ui/PageHeader'
import { Badge, ModuleScreen, Panel, PrimaryButton, ScrollArea, SearchInput } from '@modules/shared/ui/primitives'
import FilterSelect from '@modules/shared/ui/FilterSelect'
import { Column, ColumnsToggle, DataTable, useColumnVisibility } from '@modules/shared/ui/DataTable'
import { useListQuery } from '@modules/shared/hooks/useListQuery'
import { useListMode } from '@modules/shared/hooks/useListMode'
import { InfiniteFooter, ModeToggle, Pagination } from '@modules/shared/ui/ListControls'
import { TrashToggle } from '@modules/shared/ui/TrashToggle'
import { TrashRowActions, useTrashState } from '@modules/shared/ui/trash'
import ConfirmDialog from '@modules/shared/ui/ConfirmDialog'
import { toast } from 'react-toastify'
import { formatCurrency, formatDate } from '@modules/shared/lib/format'
import { DateRangeInputs, FilterField, FiltersBar } from '@modules/shared/ui/FiltersBar'
import { CAMPOS } from '../../shared/constants'
import type { Gasto } from '../../shared/types'
import { useCategorias } from '../../categorias/useCategorias'
import { fetchGastosArchivedPage, fetchGastosPage } from '../gastos.api'
import { usePurgeGasto, useRestoreGasto } from '../useGastos'
import GastoFormDrawer from './GastoFormDrawer'

const PAGE_SIZE = 15

const baseColumns: Column<Gasto>[] = [
  { key: 'fecha', label: 'Fecha', render: (g) => formatDate(g.fecha) },
  { key: 'categoria', label: 'Categoría', render: (g) => <Badge tone="blue">{g.categoriaNombre}</Badge> },
  { key: 'descripcion', label: 'Descripción', hideable: false, className: 'font-medium', render: (g) => g.descripcion },
  { key: 'proveedor', label: 'Proveedor', render: (g) => g.proveedor },
  { key: 'campo', label: 'Campo', render: (g) => g.campo },
  { key: 'medio', label: 'Medio', render: (g) => g.medioPago },
  { key: 'monto', label: 'Monto', className: 'font-semibold', render: (g) => formatCurrency(g.monto) },
]

export const GastosView = () => {
  const [search, setSearch] = useState('')
  const [debounced] = useDebounce(search, 300)
  const [categoriaId, setCategoriaId] = useState('')
  const [campo, setCampo] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const { mode, setMode } = useListMode()
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Gasto | null>(null)
  const { isVisible, toggle } = useColumnVisibility()
  const { view, setView, isTrash, purgeTarget, setPurgeTarget } = useTrashState<Gasto>()
  const { mutateAsync: restore } = useRestoreGasto()
  const { mutateAsync: purge, isPending: purging } = usePurgeGasto()

  const filters = useMemo(
    () => ({ search: debounced, categoriaId, campo, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined }),
    [debounced, categoriaId, campo, dateFrom, dateTo]
  )
  useEffect(() => setPage(1), [filters, mode, view])

  const { data: categorias } = useCategorias()

  const handleRestore = async (g: Gasto) => {
    try {
      await restore(g.id)
      toast.success('Gasto restaurado', { theme: 'colored' })
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
    const acciones: Column<Gasto> = {
      key: 'acciones',
      label: 'Acciones',
      hideable: false,
      render: (g) => <TrashRowActions onRestore={() => handleRestore(g)} onPurge={() => setPurgeTarget(g)} />,
    }
    return [...baseColumns, acciones]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTrash])

  const chips = useMemo(() => {
    const c: { key: string; label: string; onClear: () => void }[] = []
    if (categoriaId) c.push({ key: 'cat', label: categorias?.find((x) => x.id === categoriaId)?.nombre ?? 'Categoría', onClear: () => setCategoriaId('') })
    if (campo) c.push({ key: 'cam', label: campo, onClear: () => setCampo('') })
    if (dateFrom || dateTo) c.push({ key: 'fec', label: `Fecha: ${dateFrom || '…'} → ${dateTo || '…'}`, onClear: () => { setDateFrom(''); setDateTo('') } })
    return c
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriaId, campo, dateFrom, dateTo])

  const clearAll = () => { setCategoriaId(''); setCampo(''); setDateFrom(''); setDateTo('') }

  const list = useListQuery<Gasto>({
    key: ['gastos.lista', view, filters],
    fetcher: (p, ps) => (isTrash ? fetchGastosArchivedPage(filters, p, ps) : fetchGastosPage(filters, p, ps)),
    mode,
    page,
    pageSize: PAGE_SIZE,
  })

  const totalMonto = useMemo(() => list.rows.reduce((s, g) => s + g.monto, 0), [list.rows])

  const hasFilters = !!(debounced || categoriaId || campo || dateFrom || dateTo)
  const emptyState = isTrash
    ? { label: 'La papelera está vacía', description: 'Lo que archives va a aparecer acá y vas a poder restaurarlo.' }
    : hasFilters
    ? { label: 'Sin resultados', description: 'No hay gastos que coincidan con la búsqueda o los filtros.' }
    : {
        label: 'Todavía no hay gastos',
        description: 'Registrá los gastos del campo y de ganadería para llevar el control.',
        action: <PrimaryButton onClick={() => openCreate()}>Registrar primer gasto</PrimaryButton>,
      }

  const openCreate = () => {
    setSelected(null)
    setOpen(true)
  }
  const openEdit = (g: Gasto) => {
    setSelected(g)
    setOpen(true)
  }

  return (
    <ModuleScreen>
      <PageHeader
        section="GASTOS DEL CAMPO"
        title="Gastos"
        actions={
          <div className="flex items-center gap-2">
            <TrashToggle view={view} onChange={setView} />
            {!isTrash && <PrimaryButton onClick={openCreate}>Registrar gasto</PrimaryButton>}
          </div>
        }
      />
      <ScrollArea
        onScrollEnd={
          mode === 'infinite' && list.hasNext && !list.isFetchingNext ? list.fetchNext : undefined
        }
      >
        <Panel className="p-4 flex flex-1 flex-col min-h-0">
          <FiltersBar
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Buscar descripción o proveedor…"
            chips={chips}
            onClearAll={clearAll}
            right={
              <>
                <div className="text-sm whitespace-nowrap">
                  <span className="text-gray-400">Total visible: </span>
                  <span className="font-bold text-main-600 dark:text-main-400">{formatCurrency(totalMonto)}</span>
                </div>
                <ModeToggle mode={mode} onChange={setMode} />
                <ColumnsToggle columns={columns} isVisible={isVisible} toggle={toggle} />
              </>
            }
          >
            <FilterField label="Categoría">
              <FilterSelect
                isSearchable
                value={categoriaId}
                onChange={setCategoriaId}
                placeholder="Todas"
                options={[{ value: '', label: 'Todas las categorías' }, ...(categorias ?? []).map((c) => ({ value: c.id, label: c.nombre }))]}
              />
            </FilterField>
            <FilterField label="Campo">
              <FilterSelect
                value={campo}
                onChange={setCampo}
                placeholder="Todos"
                options={[{ value: '', label: 'Todos los campos' }, ...CAMPOS.map((c) => ({ value: c, label: c }))]}
              />
            </FilterField>
            <FilterField label="Fecha">
              <DateRangeInputs from={dateFrom} to={dateTo} onFrom={setDateFrom} onTo={setDateTo} />
            </FilterField>
          </FiltersBar>

          <DataTable
            columns={columns}
            rows={list.rows}
            rowKey={(g) => g.id}
            isLoading={list.isLoading}
            emptyLabel={emptyState.label}
            emptyIcon="🧾"
            emptyDescription={emptyState.description}
            emptyAction={emptyState.action}
            isVisible={isVisible}
            onRowClick={isTrash ? undefined : openEdit}
            selectedKey={!isTrash && open ? selected?.id : null}
            loadingMore={mode === 'infinite' && list.isFetchingNext}
          />

          {mode === 'paged' ? (
            <Pagination page={page} pageSize={PAGE_SIZE} total={list.total} onPage={setPage} />
          ) : (
            <InfiniteFooter shown={list.rows.length} total={list.total} isFetchingNext={list.isFetchingNext} hasNext={list.hasNext} />
          )}
        </Panel>
      </ScrollArea>

      <GastoFormDrawer
        open={open}
        initial={selected}
        items={list.rows}
        onNavigate={setSelected}
        onClose={() => setOpen(false)}
      />

      <ConfirmDialog
        open={!!purgeTarget}
        title="Eliminar definitivamente"
        message={
          <>
            Vas a eliminar el gasto <b>{purgeTarget?.descripcion}</b> de forma permanente. Esta acción no se
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

export default GastosView
