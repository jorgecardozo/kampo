import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useDebounce } from 'use-debounce'
import PageHeader from '@modules/shared/ui/PageHeader'
import {
  EmptyRow,
  LoadingRow,
  ModuleScreen,
  Panel,
  PrimaryButton,
  ScrollArea,
  SearchInput,
  Table,
  Td,
  Th,
} from '@modules/shared/ui/primitives'
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
import { addDays, formatCurrency, formatDate, toISODate } from '@modules/shared/lib/format'
import { useTiposVacuna } from '../../tipos-vacuna/useTiposVacuna'
import { useVeterinarios } from '../../veterinarios/useVeterinarios'
import type { Campania } from '../../shared/types'
import {
  CampaniaConTotal,
  fetchCampaniaById,
  fetchCampaniasArchivedPage,
  fetchCampaniasPage,
  fetchVacunacionesByCampania,
} from '../campanias.api'
import { useArchiveCampania, usePurgeCampania, useRestoreCampania, useUpdateCampania } from '../useCampanias'
import VacunacionLoteDrawer from '../../vacunaciones/components/VacunacionLoteDrawer'

const PAGE_SIZE = 15

const baseColumns: Column<CampaniaConTotal>[] = [
  { key: 'fecha', label: 'Fecha', render: (c) => formatDate(c.fechaAplicacion) },
  { key: 'vacuna', label: 'Vacuna', hideable: false, className: 'font-semibold', render: (c) => c.tipoVacunaNombre },
  { key: 'animales', label: 'Animales', render: (c) => `${c.cantidad}` },
  { key: 'proxima', label: 'Próxima dosis', render: (c) => formatDate(c.proximaFecha) },
  { key: 'veterinario', label: 'Veterinario', render: (c) => c.veterinarioNombre },
  { key: 'lote', label: 'Lote', render: (c) => c.loteProducto },
  { key: 'costoTotal', label: 'Costo total', render: (c) => formatCurrency(c.costoTotal) },
]

export const CampaniasView = () => {
  const [search, setSearch] = useState('')
  const [debounced] = useDebounce(search, 300)
  const { mode, setMode } = useListMode()
  const [page, setPage] = useState(1)
  const [loteOpen, setLoteOpen] = useState(false)
  const [editing, setEditing] = useState<Campania | null>(null)
  const { isVisible, toggle } = useColumnVisibility()
  const router = useRouter()
  const { view, setView, isTrash, purgeTarget, setPurgeTarget } = useTrashState<CampaniaConTotal>()
  const { mutateAsync: restore } = useRestoreCampania()
  const { mutateAsync: purge, isPending: purging } = usePurgeCampania()

  useEffect(() => setPage(1), [debounced, mode, view])

  const lq = useListQuery<CampaniaConTotal>({
    key: ['ganaderia.campanias', view, debounced],
    fetcher: (p, ps) =>
      isTrash ? fetchCampaniasArchivedPage(debounced, p, ps) : fetchCampaniasPage(debounced, p, ps),
    mode,
    page,
    pageSize: PAGE_SIZE,
  })

  const handleRestore = async (c: CampaniaConTotal) => {
    try {
      await restore(c.id)
      toast.success('Campaña restaurada', { theme: 'colored' })
    } catch {
      toast.error('No se pudo restaurar', { theme: 'colored' })
    }
  }
  const handlePurge = async () => {
    if (!purgeTarget) return
    try {
      await purge(purgeTarget.id)
      toast.success('Campaña eliminada definitivamente', { theme: 'colored' })
      setPurgeTarget(null)
    } catch {
      toast.error('No se pudo eliminar', { theme: 'colored' })
    }
  }

  const columns = useMemo(() => {
    if (!isTrash) return baseColumns
    const acciones: Column<CampaniaConTotal> = {
      key: 'acciones',
      label: 'Acciones',
      hideable: false,
      render: (c) => <TrashRowActions onRestore={() => handleRestore(c)} onPurge={() => setPurgeTarget(c)} />,
    }
    return [...baseColumns, acciones]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTrash])

  const emptyState = isTrash
    ? { label: 'La papelera está vacía', description: 'Lo que archives va a aparecer acá y vas a poder restaurarlo.' }
    : debounced
    ? { label: 'Sin resultados', description: 'No hay campañas que coincidan con la búsqueda.' }
    : {
        label: 'Todavía no hay campañas',
        description: 'Vacuná en lote a varios animales y se agruparán como una campaña.',
        action: <PrimaryButton onClick={() => setLoteOpen(true)}>Nueva campaña</PrimaryButton>,
      }

  // Deep-link desde una vacunación: ?ver=<campaniaId> abre esa campaña.
  useEffect(() => {
    if (!router.isReady) return
    const id = router.query.ver
    if (id) {
      fetchCampaniaById(String(id)).then((c) => c && setEditing(c))
      router.replace('/ganaderia/campanias', undefined, { shallow: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query.ver])

  return (
    <ModuleScreen>
      <PageHeader
        section="GANADERÍA"
        title="Campañas de Vacunación"
        actions={
          <div className="flex items-center gap-2">
            <TrashToggle view={view} onChange={setView} />
            {!isTrash && <PrimaryButton onClick={() => setLoteOpen(true)}>Nueva campaña</PrimaryButton>}
          </div>
        }
      />
      <ScrollArea onScrollEnd={mode === 'infinite' && lq.hasNext && !lq.isFetchingNext ? lq.fetchNext : undefined}>
        <Panel className="p-2.5 sm:p-4 flex flex-1 flex-col min-h-0">
          <div className="flex items-center gap-2 mb-3">
            <SearchInput value={search} onChange={setSearch} placeholder="Buscar vacuna o veterinario…" />
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden sm:inline text-sm text-gray-400">
                {lq.total} {isTrash ? 'archivadas' : 'campañas'}
              </span>
              <ModeToggle mode={mode} onChange={setMode} />
              <ColumnsToggle columns={columns} isVisible={isVisible} toggle={toggle} />
            </div>
          </div>
          <DataTable
            columns={columns}
            rows={lq.rows}
            rowKey={(c) => c.id}
            isLoading={lq.isLoading}
            isVisible={isVisible}
            onRowClick={isTrash ? undefined : setEditing}
            selectedKey={!isTrash ? editing?.id ?? null : null}
            loadingMore={mode === 'infinite' && lq.isFetchingNext}
            onReachEnd={mode === 'infinite' && lq.hasNext && !lq.isFetchingNext ? lq.fetchNext : undefined}
            emptyLabel={emptyState.label}
            emptyIcon="🗓️"
            emptyDescription={emptyState.description}
            emptyAction={emptyState.action}
          />
          {mode === 'paged' ? (
            <Pagination page={page} pageSize={PAGE_SIZE} total={lq.total} onPage={setPage} />
          ) : (
            <InfiniteFooter shown={lq.rows.length} total={lq.total} isFetchingNext={lq.isFetchingNext} hasNext={lq.hasNext} />
          )}
        </Panel>
      </ScrollArea>

      <VacunacionLoteDrawer open={loteOpen} onClose={() => setLoteOpen(false)} />
      <CampaniaEditDrawer campania={editing} onClose={() => setEditing(null)} />

      <ConfirmDialog
        open={!!purgeTarget}
        title="Eliminar campaña definitivamente"
        message={
          <>
            Vas a eliminar la campaña <b>{purgeTarget?.tipoVacunaNombre}</b> de forma permanente. Las
            vacunaciones individuales NO se borran (quedan sin campaña asociada).
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

// --- Drawer de edición de campaña (propaga cambios a sus aplicaciones) ---
const CampaniaEditDrawer = ({ campania, onClose }: { campania: Campania | null; onClose: () => void }) => {
  const open = !!campania
  const [form, setForm] = useState({ fechaAplicacion: '', veterinarioId: '', loteProducto: '', costo: 0, observaciones: '' })
  const { data: vets } = useVeterinarios()
  const { data: tipos } = useTiposVacuna()
  const { mutateAsync, isPending } = useUpdateCampania()
  const { mutateAsync: archive, isPending: archiving } = useArchiveCampania()

  const { data: aplicaciones, isLoading } = useQuery({
    queryKey: ['ganaderia.campanias', 'apps', campania?.id],
    queryFn: () => fetchVacunacionesByCampania(campania!.id),
    enabled: open,
  })

  useEffect(() => {
    if (campania) {
      setForm({
        fechaAplicacion: campania.fechaAplicacion,
        veterinarioId: campania.veterinarioId,
        loteProducto: campania.loteProducto,
        costo: campania.costo,
        observaciones: campania.observaciones ?? '',
      })
    }
  }, [campania])

  const set = (k: keyof typeof form, v: any) => setForm((p) => ({ ...p, [k]: v }))

  const proximaPreview = useMemo(() => {
    const tipo = tipos?.find((t) => t.id === campania?.tipoVacunaId)
    if (!tipo || !form.fechaAplicacion) return null
    return addDays(new Date(form.fechaAplicacion), tipo.periodicidadDias)
  }, [tipos, campania, form.fechaAplicacion])

  const handleArchive = async () => {
    if (!campania) return
    try {
      await archive(campania.id)
      toast.success('Campaña archivada · está en la Papelera', { theme: 'colored' })
      onClose()
    } catch {
      toast.error('No se pudo archivar', { theme: 'colored' })
    }
  }

  const handleSubmit = async () => {
    if (!form.veterinarioId) {
      toast.error('Elegí un veterinario', { theme: 'colored' })
      return
    }
    try {
      await mutateAsync({ id: campania!.id, input: { ...form, costo: Number(form.costo) || 0 } })
      toast.success('Campaña actualizada (se aplicó a todos los animales)', { theme: 'colored' })
      onClose()
    } catch {
      toast.error('Ocurrió un error al actualizar la campaña', { theme: 'colored' })
    }
  }

  return (
    <Drawer
      open={open}
      title={campania ? `Campaña · ${campania.tipoVacunaNombre}` : ''}
      subtitle={campania ? `${formatDate(campania.fechaAplicacion)} · ${aplicaciones?.length ?? 0} animales` : undefined}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitting={isPending}
      submitLabel="Guardar (aplica a todos)"
      secondaryActions={campania ? <ArchiveButton onClick={handleArchive} pending={archiving} /> : undefined}
    >
      <Field label="Vacuna">
        <input className={`${inputClass} bg-gray-100 dark:bg-gray-800`} value={campania?.tipoVacunaNombre ?? ''} readOnly />
      </Field>
      <Field label="Fecha de aplicación">
        <input type="date" className={inputClass} value={form.fechaAplicacion} onChange={(e) => set('fechaAplicacion', e.target.value)} />
      </Field>
      <Field label="Veterinario *">
        <FilterSelect
          isSearchable
          value={form.veterinarioId}
          onChange={(v) => set('veterinarioId', v)}
          placeholder="Seleccionar…"
          options={(vets ?? []).map((v) => ({ value: v.id, label: `${v.nombre} (${v.matricula})` }))}
        />
      </Field>
      <Field label="Próxima dosis (calculada)">
        <input className={`${inputClass} bg-gray-100 dark:bg-gray-800`} value={proximaPreview ? formatDate(proximaPreview) : '-'} readOnly />
      </Field>
      <Field label="Lote del producto">
        <input className={inputClass} value={form.loteProducto} onChange={(e) => set('loteProducto', e.target.value)} />
      </Field>
      <Field label="Costo por animal ($)">
        <input type="number" className={inputClass} value={form.costo} onChange={(e) => set('costo', e.target.value)} />
      </Field>

      <div className="md:col-span-2 mt-2">
        <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
          Animales de la campaña ({aplicaciones?.length ?? 0})
        </h3>
        <Table
          head={
            <tr>
              <Th>Animal</Th>
              <Th>Aplicación</Th>
              <Th>Próxima dosis</Th>
            </tr>
          }
        >
          {isLoading ? (
            <LoadingRow colSpan={3} />
          ) : (aplicaciones?.length ?? 0) === 0 ? (
            <EmptyRow colSpan={3} />
          ) : (
            aplicaciones!.map((v, i) => (
              <tr key={v.id} className={i % 2 === 1 ? 'bg-slate-50 dark:bg-gray-700/30' : 'bg-white dark:bg-gray-800'}>
                <Td className="font-medium">{v.animalCaravana}</Td>
                <Td>{formatDate(v.fechaAplicacion)}</Td>
                <Td>{formatDate(v.proximaFecha)}</Td>
              </tr>
            ))
          )}
        </Table>
      </div>
    </Drawer>
  )
}

export default CampaniasView
