import { useEffect, useMemo, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { RotateCcw, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import PageHeader from '@modules/shared/ui/PageHeader'
import { Badge, ModuleScreen, Panel, PrimaryButton, ScrollArea, SearchInput } from '@modules/shared/ui/primitives'
import FilterSelect from '@modules/shared/ui/FilterSelect'
import { Column, ColumnsToggle, DataTable, useColumnVisibility } from '@modules/shared/ui/DataTable'
import { TrashToggle } from '@modules/shared/ui/TrashToggle'
import ConfirmDialog from '@modules/shared/ui/ConfirmDialog'
import { useListQuery } from '@modules/shared/hooks/useListQuery'
import { useListMode } from '@modules/shared/hooks/useListMode'
import { InfiniteFooter, ModeToggle, Pagination } from '@modules/shared/ui/ListControls'
import { formatCurrency, formatDate } from '@modules/shared/lib/format'
import { DateRangeInputs, FilterField, FiltersBar } from '@modules/shared/ui/FiltersBar'
import { CATEGORIAS, ESTADOS } from '../../shared/constants'
import type { Animal, EstadoAnimal } from '../../shared/types'
import { useDuenos } from '../../duenos/useDuenos'
import { usePrecios } from '../../precios/usePrecios'
import { SIN_DUENO, fetchAnimalesArchivedPage, fetchAnimalesPage } from '../animales.api'
import { usePurgeAnimal, useRestoreAnimal } from '../useAnimales'
import AnimalFormDrawer from './AnimalFormDrawer'

const PAGE_SIZE = 15

const estadoTone: Record<EstadoAnimal, 'green' | 'gray' | 'red'> = {
  Activo: 'green',
  Vendido: 'gray',
  Muerto: 'red',
}

const buildColumns = (precioDe: (cat: string) => number): Column<Animal>[] => [
  { key: 'caravana', label: 'Caravana', hideable: false, className: 'font-semibold', render: (a) => a.caravana || '—' },
  { key: 'nombre', label: 'Nombre', truncate: true, render: (a) => a.nombre || '-' },
  { key: 'categoria', label: 'Categoría', render: (a) => a.categoria },
  { key: 'raza', label: 'Raza', render: (a) => a.raza },
  { key: 'sexo', label: 'Sexo', render: (a) => a.sexo },
  { key: 'peso', label: 'Peso', render: (a) => `${a.pesoKg} kg` },
  { key: 'valor', label: 'Valor', className: 'font-medium', render: (a) => formatCurrency(a.pesoKg * precioDe(a.categoria)) },
  { key: 'potrero', label: 'Potrero', render: (a) => a.potrero },
  { key: 'dueno', label: 'Dueño', render: (a) => a.dueno || '-' },
  { key: 'ingreso', label: 'Ingreso', render: (a) => formatDate(a.fechaIngreso) },
  { key: 'estado', label: 'Estado', render: (a) => <Badge tone={estadoTone[a.estado]}>{a.estado}</Badge> },
]

export const AnimalesView = () => {
  const [search, setSearch] = useState('')
  const [debounced] = useDebounce(search, 300)
  const [categoria, setCategoria] = useState('')
  const [estado, setEstado] = useState('')
  const [dueno, setDueno] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const { mode, setMode } = useListMode()
  const { data: duenos } = useDuenos()
  const { data: precios } = usePrecios()
  const [view, setView] = useState<'activos' | 'papelera'>('activos')
  const [purgeTarget, setPurgeTarget] = useState<Animal | null>(null)
  const { mutateAsync: restore } = useRestoreAnimal()
  const { mutateAsync: purge, isPending: purging } = usePurgeAnimal()
  const isTrash = view === 'papelera'

  const handleRestore = async (a: Animal) => {
    try {
      await restore(a.id)
      toast.success(`${a.caravana} restaurado`, { theme: 'colored' })
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
    const precioDe = (cat: string) => precios?.find((p) => p.categoria === cat)?.precioKg ?? 0
    const cols = buildColumns(precioDe)
    if (!isTrash) return cols
    // En papelera: acciones de restaurar / eliminar definitivo.
    const acciones: Column<Animal> = {
      key: 'acciones',
      label: 'Acciones',
      hideable: false,
      render: (a) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => handleRestore(a)}
            className="inline-flex items-center gap-1 rounded-md border border-emerald-200 dark:border-emerald-900 px-2.5 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
          >
            <RotateCcw size={13} /> Restaurar
          </button>
          <button
            type="button"
            onClick={() => setPurgeTarget(a)}
            className="inline-flex items-center gap-1 rounded-md border border-rose-200 dark:border-rose-900 px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30"
          >
            <Trash2 size={13} /> Eliminar
          </button>
        </div>
      ),
    }
    return [...cols, acciones]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [precios, isTrash])
  const [page, setPage] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selected, setSelected] = useState<Animal | null>(null)
  const { isVisible, toggle } = useColumnVisibility()

  const filters = useMemo(
    () => ({ search: debounced, categoria, estado, dueno, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined }),
    [debounced, categoria, estado, dueno, dateFrom, dateTo]
  )
  useEffect(() => setPage(1), [filters, mode, view])

  const chips = useMemo(() => {
    const c: { key: string; label: string; onClear: () => void }[] = []
    if (categoria) c.push({ key: 'cat', label: categoria, onClear: () => setCategoria('') })
    if (estado) c.push({ key: 'est', label: estado, onClear: () => setEstado('') })
    if (dueno) c.push({ key: 'due', label: dueno === SIN_DUENO ? 'Sin dueño' : `Dueño: ${dueno}`, onClear: () => setDueno('') })
    if (dateFrom || dateTo) c.push({ key: 'fec', label: `Ingreso: ${dateFrom || '…'} → ${dateTo || '…'}`, onClear: () => { setDateFrom(''); setDateTo('') } })
    return c
  }, [categoria, estado, dueno, dateFrom, dateTo])

  const clearAll = () => { setCategoria(''); setEstado(''); setDueno(''); setDateFrom(''); setDateTo('') }

  const list = useListQuery<Animal>({
    key: ['ganaderia.animales', view, filters],
    fetcher: (p, ps) =>
      isTrash ? fetchAnimalesArchivedPage(filters, p, ps) : fetchAnimalesPage(filters, p, ps),
    mode,
    page,
    pageSize: PAGE_SIZE,
  })

  const hasFilters = !!(debounced || categoria || estado || dueno || dateFrom || dateTo)

  // Mensaje/acción del estado vacío según contexto.
  const emptyState = isTrash
    ? { label: 'La papelera está vacía', description: 'Lo que archives va a aparecer acá y vas a poder restaurarlo.' }
    : hasFilters
    ? { label: 'Sin resultados', description: 'No hay animales que coincidan con la búsqueda o los filtros.' }
    : {
        label: 'Todavía no hay animales',
        description: 'Cargá tu primer animal para empezar a llevar el control de la hacienda.',
        action: <PrimaryButton onClick={() => openCreate()}>Cargar primer animal</PrimaryButton>,
      }

  const openCreate = () => {
    setSelected(null)
    setDrawerOpen(true)
  }
  const openEdit = (a: Animal) => {
    setSelected(a)
    setDrawerOpen(true)
  }

  return (
    <ModuleScreen>
      <PageHeader
        section="GANADERÍA"
        title="Animales"
        actions={
          <div className="flex items-center gap-2">
            <TrashToggle view={view} onChange={setView} />
            {!isTrash && <PrimaryButton onClick={openCreate}>Nuevo animal</PrimaryButton>}
          </div>
        }
      />

      <ScrollArea
        onScrollEnd={
          mode === 'infinite' && list.hasNext && !list.isFetchingNext ? list.fetchNext : undefined
        }
      >
        <Panel className="p-2.5 sm:p-4 flex flex-1 flex-col min-h-0">
          <FiltersBar
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Buscar caravana, nombre o raza…"
            chips={chips}
            onClearAll={clearAll}
            right={
              <>
                <span className="text-sm text-gray-400 whitespace-nowrap">
                  {list.total} {isTrash ? 'archivados' : 'animales'}
                </span>
                <ModeToggle mode={mode} onChange={setMode} />
                <ColumnsToggle columns={columns} isVisible={isVisible} toggle={toggle} />
              </>
            }
          >
            <FilterField label="Categoría">
              <FilterSelect
                value={categoria}
                onChange={setCategoria}
                placeholder="Todas"
                options={[{ value: '', label: 'Todas las categorías' }, ...CATEGORIAS.map((c) => ({ value: c, label: c }))]}
              />
            </FilterField>
            <FilterField label="Estado">
              <FilterSelect
                value={estado}
                onChange={setEstado}
                placeholder="Todos"
                options={[{ value: '', label: 'Todos los estados' }, ...ESTADOS.map((s) => ({ value: s, label: s }))]}
              />
            </FilterField>
            <FilterField label="Dueño">
              <FilterSelect
                isSearchable
                value={dueno}
                onChange={setDueno}
                placeholder="Todos"
                options={[
                  { value: '', label: 'Todos los dueños' },
                  { value: SIN_DUENO, label: '⚠️ Sin dueño' },
                  ...(duenos ?? []).map((d) => ({ value: d.nombre, label: d.nombre })),
                ]}
              />
            </FilterField>
            <FilterField label="Ingreso">
              <DateRangeInputs from={dateFrom} to={dateTo} onFrom={setDateFrom} onTo={setDateTo} />
            </FilterField>
          </FiltersBar>

          <DataTable
            columns={columns}
            rows={list.rows}
            rowKey={(a) => a.id}
            isLoading={list.isLoading}
            emptyLabel={emptyState.label}
            emptyIcon="🐄"
            emptyDescription={emptyState.description}
            emptyAction={emptyState.action}
            isVisible={isVisible}
            onRowClick={isTrash ? undefined : openEdit}
            selectedKey={!isTrash && drawerOpen ? selected?.id : null}
            loadingMore={mode === 'infinite' && list.isFetchingNext}
          />

          {mode === 'paged' ? (
            <Pagination page={page} pageSize={PAGE_SIZE} total={list.total} onPage={setPage} />
          ) : (
            <InfiniteFooter
              shown={list.rows.length}
              total={list.total}
              isFetchingNext={list.isFetchingNext}
              hasNext={list.hasNext}
            />
          )}
        </Panel>
      </ScrollArea>

      <AnimalFormDrawer
        open={drawerOpen}
        initial={selected}
        items={list.rows}
        onNavigate={setSelected}
        onClose={() => setDrawerOpen(false)}
      />

      <ConfirmDialog
        open={!!purgeTarget}
        title="Eliminar definitivamente"
        message={
          <>
            Vas a eliminar <b>{purgeTarget?.caravana}</b> de forma permanente. Esta acción no se
            puede deshacer y se perderá su historial de vacunaciones.
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

export default AnimalesView
