import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
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
import { daysUntil, formatCurrency, formatDate } from '@modules/shared/lib/format'
import { DateRangeInputs, FilterField, FiltersBar } from '@modules/shared/ui/FiltersBar'
import type { Vacunacion } from '../../shared/types'
import { useTiposVacuna } from '../../tipos-vacuna/useTiposVacuna'
import { fetchVacunacionById, fetchVacunacionesArchivedPage, fetchVacunacionesPage } from '../vacunaciones.api'
import { usePurgeVacunacion, useRestoreVacunacion } from '../useVacunaciones'
import VacunacionFormDrawer from './VacunacionFormDrawer'
import VacunacionLoteDrawer from './VacunacionLoteDrawer'

const PAGE_SIZE = 15

const proximaBadge = (proximaFecha: string) => {
  const d = daysUntil(proximaFecha)
  const cls =
    d < 0
      ? 'text-rose-600 dark:text-rose-400'
      : d <= 30
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-emerald-600 dark:text-emerald-400'
  return <span className={`font-medium ${cls}`}>{d < 0 ? `Vencida (${Math.abs(d)}d)` : `En ${d}d`}</span>
}

const baseColumns: Column<Vacunacion>[] = [
  { key: 'animal', label: 'Animal', hideable: false, className: 'font-semibold', render: (v) => v.animalCaravana },
  { key: 'vacuna', label: 'Vacuna', render: (v) => v.tipoVacunaNombre },
  { key: 'aplicacion', label: 'Aplicación', render: (v) => formatDate(v.fechaAplicacion) },
  { key: 'proxima', label: 'Próxima dosis', render: (v) => formatDate(v.proximaFecha) },
  { key: 'estado', label: 'Estado', render: (v) => proximaBadge(v.proximaFecha) },
  { key: 'veterinario', label: 'Veterinario', render: (v) => v.veterinarioNombre },
  { key: 'lote', label: 'Lote', render: (v) => v.loteProducto },
  { key: 'costo', label: 'Costo', render: (v) => formatCurrency(v.costo) },
]

export const VacunacionesView = () => {
  const [search, setSearch] = useState('')
  const [debounced] = useDebounce(search, 300)
  const [tipoVacunaId, setTipoVacunaId] = useState('')
  const [dateField, setDateField] = useState<'aplicacion' | 'proxima'>('aplicacion')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const { mode, setMode } = useListMode()
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Vacunacion | null>(null)
  const [presetAnimalId, setPresetAnimalId] = useState<string | undefined>(undefined)
  const [loteOpen, setLoteOpen] = useState(false)
  const { isVisible, toggle } = useColumnVisibility()
  const router = useRouter()
  const { view, setView, isTrash, purgeTarget, setPurgeTarget } = useTrashState<Vacunacion>()
  const { mutateAsync: restore } = useRestoreVacunacion()
  const { mutateAsync: purge, isPending: purging } = usePurgeVacunacion()

  const filters = useMemo(
    () => ({ search: debounced, tipoVacunaId, dateField, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined }),
    [debounced, tipoVacunaId, dateField, dateFrom, dateTo]
  )
  useEffect(() => setPage(1), [filters, mode, view])

  const { data: tipos } = useTiposVacuna()

  const handleRestore = async (v: Vacunacion) => {
    try {
      await restore(v.id)
      toast.success('Vacunación restaurada', { theme: 'colored' })
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
    const acciones: Column<Vacunacion> = {
      key: 'acciones',
      label: 'Acciones',
      hideable: false,
      render: (v) => <TrashRowActions onRestore={() => handleRestore(v)} onPurge={() => setPurgeTarget(v)} />,
    }
    return [...baseColumns, acciones]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTrash])

  const chips = useMemo(() => {
    const c: { key: string; label: string; onClear: () => void }[] = []
    if (tipoVacunaId) c.push({ key: 'vac', label: tipos?.find((t) => t.id === tipoVacunaId)?.nombre ?? 'Vacuna', onClear: () => setTipoVacunaId('') })
    if (dateFrom || dateTo)
      c.push({
        key: 'fec',
        label: `${dateField === 'proxima' ? 'Próxima' : 'Aplicación'}: ${dateFrom || '…'} → ${dateTo || '…'}`,
        onClear: () => { setDateFrom(''); setDateTo('') },
      })
    return c
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoVacunaId, dateField, dateFrom, dateTo])

  const clearAll = () => { setTipoVacunaId(''); setDateFrom(''); setDateTo('') }

  const list = useListQuery<Vacunacion>({
    key: ['ganaderia.vacunaciones', view, filters],
    fetcher: (p, ps) =>
      isTrash ? fetchVacunacionesArchivedPage(filters, p, ps) : fetchVacunacionesPage(filters, p, ps),
    mode,
    page,
    pageSize: PAGE_SIZE,
  })

  const hasFilters = !!(debounced || tipoVacunaId || dateFrom || dateTo)
  const emptyState = isTrash
    ? { label: 'La papelera está vacía', description: 'Lo que archives va a aparecer acá y vas a poder restaurarlo.' }
    : hasFilters
    ? { label: 'Sin resultados', description: 'No hay vacunaciones que coincidan con la búsqueda o los filtros.' }
    : {
        label: 'Todavía no hay vacunaciones',
        description: 'Registrá una vacunación o vacuná en lote a varios animales a la vez.',
        action: <PrimaryButton onClick={() => openCreate()}>Registrar vacunación</PrimaryButton>,
      }

  const openCreate = () => {
    setPresetAnimalId(undefined)
    setSelected(null)
    setOpen(true)
  }
  const openEdit = (v: Vacunacion) => {
    setPresetAnimalId(undefined)
    setSelected(v)
    setOpen(true)
  }

  // Deep-links desde el drawer del animal:
  //  ?nuevoAnimal=<id> → abre el alta con ese animal precargado
  //  ?editar=<id>      → abre esa vacunación para editar
  useEffect(() => {
    if (!router.isReady) return
    const { nuevoAnimal, editar } = router.query
    if (nuevoAnimal) {
      setPresetAnimalId(String(nuevoAnimal))
      setSelected(null)
      setOpen(true)
      router.replace('/ganaderia/vacunaciones', undefined, { shallow: true })
    } else if (editar) {
      fetchVacunacionById(String(editar)).then((v) => {
        if (v) {
          setSelected(v)
          setOpen(true)
        }
      })
      router.replace('/ganaderia/vacunaciones', undefined, { shallow: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query.nuevoAnimal, router.query.editar])

  return (
    <ModuleScreen>
      <PageHeader
        section="GANADERÍA"
        title="Vacunaciones"
        actions={
          <div className="flex items-center gap-2">
            <TrashToggle view={view} onChange={setView} />
            {!isTrash && (
              <>
                <button
                  type="button"
                  onClick={() => setLoteOpen(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-main-600 px-4 py-2 text-sm font-semibold text-main-600 hover:bg-main-50 dark:hover:bg-gray-800"
                >
                  Vacunar en lote
                </button>
                <PrimaryButton onClick={openCreate}>Registrar vacunación</PrimaryButton>
              </>
            )}
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
            searchPlaceholder="Buscar caravana, vacuna o veterinario…"
            chips={chips}
            onClearAll={clearAll}
            right={
              <>
                <span className="text-sm text-gray-400 whitespace-nowrap">
                  {list.total} {isTrash ? 'archivadas' : 'registros'}
                </span>
                <ModeToggle mode={mode} onChange={setMode} />
                <ColumnsToggle columns={columns} isVisible={isVisible} toggle={toggle} />
              </>
            }
          >
            <FilterField label="Vacuna">
              <FilterSelect
                isSearchable
                value={tipoVacunaId}
                onChange={setTipoVacunaId}
                placeholder="Todas"
                options={[{ value: '', label: 'Todas las vacunas' }, ...(tipos ?? []).map((t) => ({ value: t.id, label: t.nombre }))]}
              />
            </FilterField>
            <FilterField label="Filtrar fecha por">
              <FilterSelect
                value={dateField}
                onChange={(v) => setDateField(v as 'aplicacion' | 'proxima')}
                options={[
                  { value: 'aplicacion', label: 'Aplicación' },
                  { value: 'proxima', label: 'Próxima dosis' },
                ]}
              />
            </FilterField>
            <FilterField label="Rango de fechas">
              <DateRangeInputs from={dateFrom} to={dateTo} onFrom={setDateFrom} onTo={setDateTo} />
            </FilterField>
          </FiltersBar>

          <DataTable
            columns={columns}
            rows={list.rows}
            rowKey={(v) => v.id}
            isLoading={list.isLoading}
            emptyLabel={emptyState.label}
            emptyIcon="💉"
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

      <VacunacionFormDrawer
        open={open}
        initial={selected}
        items={list.rows}
        presetAnimalId={presetAnimalId}
        onNavigate={setSelected}
        onClose={() => setOpen(false)}
      />

      <VacunacionLoteDrawer open={loteOpen} onClose={() => setLoteOpen(false)} />

      <ConfirmDialog
        open={!!purgeTarget}
        title="Eliminar definitivamente"
        message={
          <>
            Vas a eliminar la vacunación de <b>{purgeTarget?.animalCaravana}</b> ({purgeTarget?.tipoVacunaNombre})
            de forma permanente. Esta acción no se puede deshacer.
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

export default VacunacionesView
