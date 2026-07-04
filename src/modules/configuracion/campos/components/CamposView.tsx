import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import PageHeader from '@modules/shared/ui/PageHeader'
import { ModuleScreen, Panel, PrimaryButton, ScrollArea } from '@modules/shared/ui/primitives'
import { Column, ColumnsToggle, DataTable, useColumnVisibility } from '@modules/shared/ui/DataTable'
import { useListQuery } from '@modules/shared/hooks/useListQuery'
import { useListMode } from '@modules/shared/hooks/useListMode'
import { InfiniteFooter, ModeToggle, Pagination } from '@modules/shared/ui/ListControls'
import { Drawer } from '@modules/shared/ui/Drawer'
import { Field, inputClass } from '@modules/shared/ui/FormModal'
import { Campo, fetchCamposPage } from '../campos.api'
import { useCreateCampo, useUpdateCampo } from '../useCampos'

const PAGE_SIZE = 15
const empty: Omit<Campo, 'id'> = { nombre: '', ubicacion: '', hectareas: 0 }

const columns: Column<Campo>[] = [
  { key: 'nombre', label: 'Campo', hideable: false, className: 'font-semibold', render: (c) => c.nombre },
  { key: 'ubicacion', label: 'Ubicación', render: (c) => c.ubicacion || '-' },
  { key: 'hectareas', label: 'Hectáreas', render: (c) => `${c.hectareas} ha` },
]

export const CamposView = () => {
  const { mode, setMode } = useListMode()
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(empty)
  const { isVisible, toggle } = useColumnVisibility()

  useEffect(() => setPage(1), [mode])

  const lq = useListQuery<Campo>({
    key: ['config.campos', 'page'],
    fetcher: (p, ps) => fetchCamposPage('', p, ps),
    mode,
    page,
    pageSize: PAGE_SIZE,
  })
  const rows = lq.rows

  const { mutateAsync: create, isPending: creating } = useCreateCampo()
  const { mutateAsync: update, isPending: updating } = useUpdateCampo()
  const set = (k: keyof typeof form, v: any) => setForm((p) => ({ ...p, [k]: v }))

  const idx = editingId ? rows.findIndex((c) => c.id === editingId) : -1
  const current = idx >= 0 ? rows[idx] : null
  const canPrev = idx > 0
  const canNext = idx >= 0 && idx < rows.length - 1

  const openCreate = () => {
    setEditingId(null)
    setForm(empty)
    setOpen(true)
  }
  const openEdit = (c: Campo) => {
    setEditingId(c.id)
    setForm({ nombre: c.nombre, ubicacion: c.ubicacion, hectareas: c.hectareas })
    setOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.nombre.trim()) {
      toast.error('El nombre del campo es obligatorio', { theme: 'colored' })
      return
    }
    const data = { ...form, hectareas: Number(form.hectareas) || 0 }
    try {
      if (editingId) {
        await update({ id: editingId, data })
        toast.success('Campo actualizado', { theme: 'colored' })
      } else {
        await create(data)
        toast.success('Campo creado', { theme: 'colored' })
      }
      setOpen(false)
    } catch {
      toast.error('Ocurrió un error al guardar el campo', { theme: 'colored' })
    }
  }

  return (
    <ModuleScreen>
      <PageHeader
        section="CONFIGURACIÓN"
        title="Campos / Establecimientos"
        actions={<PrimaryButton onClick={openCreate}>Nuevo campo</PrimaryButton>}
      />
      <ScrollArea onScrollEnd={mode === 'infinite' && lq.hasNext && !lq.isFetchingNext ? lq.fetchNext : undefined}>
        <Panel className="p-4 flex flex-1 flex-col min-h-0">
          <div className="flex items-center justify-end gap-3 mb-4">
            <span className="text-sm text-gray-400 mr-auto">{lq.total} campos</span>
            <ModeToggle mode={mode} onChange={setMode} />
            <ColumnsToggle columns={columns} isVisible={isVisible} toggle={toggle} />
          </div>
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(c) => c.id}
            isLoading={lq.isLoading}
            emptyLabel="Todavía no hay campos"
            emptyIcon="🗺️"
            emptyDescription="Cargá tus establecimientos (La Loma, El Bajo…) para separar la hacienda por campo."
            emptyAction={<PrimaryButton onClick={() => openCreate()}>Crear primer campo</PrimaryButton>}
            isVisible={isVisible}
            onRowClick={openEdit}
            selectedKey={open ? editingId : null}
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
        title={editingId ? `Campo · ${current?.nombre ?? ''}` : 'Nuevo campo'}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        submitting={creating || updating}
        submitLabel={editingId ? 'Guardar cambios' : 'Guardar'}
        onPrev={canPrev ? () => openEdit(rows[idx - 1]) : undefined}
        onNext={canNext ? () => openEdit(rows[idx + 1]) : undefined}
        canPrev={canPrev}
        canNext={canNext}
        navLabel={idx >= 0 ? `${idx + 1} / ${rows.length}` : undefined}
      >
        <Field label="Nombre del campo *">
          <input className={inputClass} value={form.nombre} onChange={(e) => set('nombre', e.target.value)} placeholder="Ej: La Loma" />
        </Field>
        <Field label="Ubicación">
          <input className={inputClass} value={form.ubicacion} onChange={(e) => set('ubicacion', e.target.value)} />
        </Field>
        <Field label="Hectáreas">
          <input type="number" className={inputClass} value={form.hectareas} onChange={(e) => set('hectareas', e.target.value)} />
        </Field>
      </Drawer>
    </ModuleScreen>
  )
}

export default CamposView
