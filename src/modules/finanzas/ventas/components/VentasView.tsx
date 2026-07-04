import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { useDebounce } from 'use-debounce'
import PageHeader from '@modules/shared/ui/PageHeader'
import { Badge, ModuleScreen, Panel, PrimaryButton, ScrollArea } from '@modules/shared/ui/primitives'
import FilterSelect from '@modules/shared/ui/FilterSelect'
import { Column, ColumnsToggle, DataTable, useColumnVisibility } from '@modules/shared/ui/DataTable'
import { TrashToggle } from '@modules/shared/ui/TrashToggle'
import { TrashRowActions, useTrashState } from '@modules/shared/ui/trash'
import ConfirmDialog from '@modules/shared/ui/ConfirmDialog'
import { useListQuery } from '@modules/shared/hooks/useListQuery'
import { useListMode } from '@modules/shared/hooks/useListMode'
import { InfiniteFooter, ModeToggle, Pagination } from '@modules/shared/ui/ListControls'
import { DateRangeInputs, FilterField, FiltersBar } from '@modules/shared/ui/FiltersBar'
import { formatCurrency, formatDate } from '@modules/shared/lib/format'
import { AreaVenta, Venta, fetchVentasArchivedPage, fetchVentasPage } from '../ventas.api'
import { usePurgeVenta, useRestoreVenta } from '../useVentas'
import VentaFormDrawer from './VentaFormDrawer'

const PAGE_SIZE = 15
const areaLabel = (a: AreaVenta) => (a === 'ganaderia' ? 'Ganadería' : 'Campo')

const baseColumns: Column<Venta>[] = [
  { key: 'fecha', label: 'Fecha', render: (v) => formatDate(v.fecha) },
  { key: 'area', label: 'Área', render: (v) => <Badge tone={v.area === 'ganaderia' ? 'green' : 'blue'}>{areaLabel(v.area)}</Badge> },
  { key: 'concepto', label: 'Concepto', hideable: false, className: 'font-medium', render: (v) => v.concepto },
  { key: 'animales', label: 'Animales', render: (v) => (v.animalesCount ? `${v.animalesCount} cab.` : '-') },
  { key: 'detalle', label: 'Detalle', render: (v) => v.detalle || '-' },
  { key: 'monto', label: 'Monto', className: 'font-semibold', render: (v) => formatCurrency(v.monto) },
]

export const VentasView = () => {
  const [search, setSearch] = useState('')
  const [debounced] = useDebounce(search, 300)
  const [areaF, setAreaF] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const { mode, setMode } = useListMode()
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Venta | null>(null)
  const { isVisible, toggle } = useColumnVisibility()
  const { view, setView, isTrash, purgeTarget, setPurgeTarget } = useTrashState<Venta>()
  const { mutateAsync: restore } = useRestoreVenta()
  const { mutateAsync: purge, isPending: purging } = usePurgeVenta()

  const filters = useMemo(
    () => ({ search: debounced, area: areaF, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined }),
    [debounced, areaF, dateFrom, dateTo]
  )
  useEffect(() => setPage(1), [filters, mode, view])

  const chips = useMemo(() => {
    const c: { key: string; label: string; onClear: () => void }[] = []
    if (areaF) c.push({ key: 'area', label: areaF === 'ganaderia' ? 'Ganadería' : 'Campo', onClear: () => setAreaF('') })
    if (dateFrom || dateTo) c.push({ key: 'fec', label: `Fecha: ${dateFrom || '…'} → ${dateTo || '…'}`, onClear: () => { setDateFrom(''); setDateTo('') } })
    return c
  }, [areaF, dateFrom, dateTo])

  const clearAll = () => { setAreaF(''); setDateFrom(''); setDateTo('') }

  const lq = useListQuery<Venta>({
    key: ['finanzas.ventas', view, filters],
    fetcher: (p, ps) => (isTrash ? fetchVentasArchivedPage(filters, p, ps) : fetchVentasPage(filters, p, ps)),
    mode,
    page,
    pageSize: PAGE_SIZE,
  })
  const rows = lq.rows
  const totalVisible = useMemo(() => rows.reduce((s, v) => s + v.monto, 0), [rows])

  const handleRestore = async (v: Venta) => {
    try {
      await restore(v.id)
      toast.success('Venta restaurada', { theme: 'colored' })
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
      toast.error('No se pudo eliminar', { theme: 'colored' })
    }
  }

  const columns = useMemo(() => {
    if (!isTrash) return baseColumns
    const acciones: Column<Venta> = {
      key: 'acciones',
      label: 'Acciones',
      hideable: false,
      render: (v) => <TrashRowActions onRestore={() => handleRestore(v)} onPurge={() => setPurgeTarget(v)} />,
    }
    return [...baseColumns, acciones]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTrash])

  const openCreate = () => {
    setSelected(null)
    setOpen(true)
  }
  const openEdit = (v: Venta) => {
    setSelected(v)
    setOpen(true)
  }

  const emptyState = isTrash
    ? { label: 'La papelera está vacía', description: 'Lo que archives va a aparecer acá y vas a poder restaurarlo.' }
    : debounced || areaF || dateFrom || dateTo
    ? { label: 'Sin resultados', description: 'No hay ventas que coincidan con la búsqueda o los filtros.' }
    : {
        label: 'Todavía no hay ventas',
        description: 'Registrá una venta de ganado (elegís los animales) o cualquier otro ingreso.',
        action: <PrimaryButton onClick={() => openCreate()}>Registrar primera venta</PrimaryButton>,
      }

  return (
    <ModuleScreen>
      <PageHeader
        section="FINANZAS"
        title="Ventas / Ingresos"
        actions={
          <div className="flex items-center gap-2">
            <TrashToggle view={view} onChange={setView} />
            {!isTrash && <PrimaryButton onClick={openCreate}>Registrar venta</PrimaryButton>}
          </div>
        }
      />
      <ScrollArea onScrollEnd={mode === 'infinite' && lq.hasNext && !lq.isFetchingNext ? lq.fetchNext : undefined}>
        <Panel className="p-4 flex flex-1 flex-col min-h-0">
          <FiltersBar
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Buscar concepto o detalle…"
            chips={chips}
            onClearAll={clearAll}
            right={
              <>
                <div className="text-sm whitespace-nowrap">
                  <span className="text-gray-400">Total visible: </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalVisible)}</span>
                </div>
                <ModeToggle mode={mode} onChange={setMode} />
                <ColumnsToggle columns={columns} isVisible={isVisible} toggle={toggle} />
              </>
            }
          >
            <FilterField label="Área">
              <FilterSelect
                value={areaF}
                onChange={setAreaF}
                placeholder="Todas"
                options={[
                  { value: '', label: 'Todas las áreas' },
                  { value: 'campo', label: 'Campo' },
                  { value: 'ganaderia', label: 'Ganadería' },
                ]}
              />
            </FilterField>
            <FilterField label="Fecha">
              <DateRangeInputs from={dateFrom} to={dateTo} onFrom={setDateFrom} onTo={setDateTo} />
            </FilterField>
          </FiltersBar>
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(v) => v.id}
            isLoading={lq.isLoading}
            emptyLabel={emptyState.label}
            emptyIcon="💵"
            emptyDescription={emptyState.description}
            emptyAction={emptyState.action}
            isVisible={isVisible}
            onRowClick={isTrash ? undefined : openEdit}
            selectedKey={!isTrash && open ? selected?.id : null}
            loadingMore={mode === 'infinite' && lq.isFetchingNext}
          />
          {mode === 'paged' ? (
            <Pagination page={page} pageSize={PAGE_SIZE} total={lq.total} onPage={setPage} />
          ) : (
            <InfiniteFooter shown={rows.length} total={lq.total} isFetchingNext={lq.isFetchingNext} hasNext={lq.hasNext} />
          )}
        </Panel>
      </ScrollArea>

      <VentaFormDrawer
        open={open}
        initial={selected}
        items={rows}
        onNavigate={setSelected}
        onClose={() => setOpen(false)}
      />

      <ConfirmDialog
        open={!!purgeTarget}
        title="Eliminar definitivamente"
        message={
          <>
            Vas a eliminar la venta <b>{purgeTarget?.concepto}</b> de forma permanente. Los animales de la venta
            vuelven a estado Activo. Esta acción no se puede deshacer.
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

export default VentasView
