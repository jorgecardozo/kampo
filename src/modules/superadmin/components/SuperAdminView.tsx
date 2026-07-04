import { Fragment, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Building2, ChevronDown, ChevronRight, ShieldAlert, Users, Ban, RotateCcw } from 'lucide-react'
import PageHeader from '@modules/shared/ui/PageHeader'
import StatCard from '@modules/shared/ui/StatCard'
import { Badge, EmptyState, ModuleScreen, Panel, PrimaryButton, ScrollArea, Table, Td, Th } from '@modules/shared/ui/primitives'
import { Drawer } from '@modules/shared/ui/Drawer'
import { Field, inputClass } from '@modules/shared/ui/FormModal'
import ConfirmDialog from '@modules/shared/ui/ConfirmDialog'
import { formatDate } from '@modules/shared/lib/format'
import { usePermisos } from '@shared/context/PermisosProvider'
import { Cuenta, createCuentaConAdmin, fetchCuentas, setCuentaActiva } from '../cuentas.api'

const rolTone: Record<string, 'green' | 'blue' | 'amber' | 'gray'> = {
  admin: 'green',
  encargado: 'blue',
  editor: 'amber',
  lector: 'gray',
}

export const SuperAdminView = () => {
  const { isSuperAdmin, loading } = usePermisos()
  const qc = useQueryClient()
  const { data: cuentas, isLoading } = useQuery({
    queryKey: ['superadmin.cuentas'],
    queryFn: fetchCuentas,
    enabled: isSuperAdmin,
  })
  const invalidate = () => qc.invalidateQueries({ queryKey: ['superadmin.cuentas'] })
  const { mutateAsync: crear, isPending } = useMutation({ mutationFn: createCuentaConAdmin, onSuccess: invalidate })
  const { mutateAsync: setActiva } = useMutation({
    mutationFn: ({ id, activa }: { id: string; activa: boolean }) => setCuentaActiva(id, activa),
    onSuccess: invalidate,
  })

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ nombre: '', adminEmail: '', contacto: '', telefono: '' })
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [suspender, setSuspender] = useState<Cuenta | null>(null)

  const stats = useMemo(() => {
    const list = cuentas ?? []
    return {
      total: list.length,
      activas: list.filter((c) => c.activa).length,
      usuarios: list.reduce((s, c) => s + c.miembros.length, 0),
    }
  }, [cuentas])

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })

  if (!loading && !isSuperAdmin) {
    return (
      <ModuleScreen>
        <PageHeader section="PLATAFORMA" title="Super-admin" />
        <ScrollArea>
          <Panel className="p-4">
            <EmptyState icon={<ShieldAlert className="text-rose-500" />} title="Acceso restringido" description="Esta sección es solo para el dueño del SaaS." />
          </Panel>
        </ScrollArea>
      </ModuleScreen>
    )
  }

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }))

  const handleCrear = async () => {
    if (!form.nombre.trim()) return toast.error('Poné un nombre de cuenta', { theme: 'colored' })
    if (!form.adminEmail.includes('@')) return toast.error('Email de admin inválido', { theme: 'colored' })
    try {
      await crear({ nombre: form.nombre, adminEmail: form.adminEmail, contacto: form.contacto, telefono: form.telefono })
      toast.success('Cuenta creada · el admin ya puede entrar', { theme: 'colored' })
      setOpen(false)
      setForm({ nombre: '', adminEmail: '', contacto: '', telefono: '' })
    } catch {
      toast.error('No se pudo crear la cuenta', { theme: 'colored' })
    }
  }

  const handleSuspender = async () => {
    if (!suspender) return
    try {
      await setActiva({ id: suspender.id, activa: !suspender.activa })
      toast.success(suspender.activa ? 'Cuenta suspendida' : 'Cuenta reactivada', { theme: 'colored' })
      setSuspender(null)
    } catch {
      toast.error('No se pudo cambiar el estado', { theme: 'colored' })
    }
  }

  const adminDe = (c: Cuenta) => c.miembros.find((m) => m.rol === 'admin')?.email ?? '—'

  return (
    <ModuleScreen>
      <PageHeader section="PLATAFORMA" title="Super-admin · Cuentas" actions={<PrimaryButton onClick={() => setOpen(true)}>Nueva cuenta</PrimaryButton>} />
      <ScrollArea>
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Cuentas totales" value={stats.total} icon={<Building2 />} accent="main" />
            <StatCard label="Cuentas activas" value={stats.activas} icon={<Building2 />} accent="emerald" />
            <StatCard label="Usuarios totales" value={stats.usuarios} icon={<Users />} accent="sky" />
          </div>

          <Panel className="p-4">
            <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
              Cada cuenta es un cliente del SaaS con sus datos aislados. Tocá una fila para ver sus usuarios.
            </p>
            <Table
              head={
                <tr>
                  <Th className="w-8" />
                  <Th>Cuenta</Th>
                  <Th>Admin</Th>
                  <Th>Contacto</Th>
                  <Th className="text-right">Usuarios</Th>
                  <Th className="text-right">Campos</Th>
                  <Th>Creada</Th>
                  <Th>Estado</Th>
                  <Th className="text-right">Acciones</Th>
                </tr>
              }
            >
              {isLoading ? (
                <tr><Td className="text-gray-400">Cargando…</Td></tr>
              ) : (cuentas?.length ?? 0) === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <EmptyState icon={<Building2 className="text-main-600" />} title="No hay cuentas todavía" description="Creá la primera cuenta del SaaS." action={<PrimaryButton onClick={() => setOpen(true)}>Nueva cuenta</PrimaryButton>} />
                  </td>
                </tr>
              ) : (
                cuentas!.map((c, i) => {
                  const isOpen = expanded.has(c.id)
                  return (
                    <Fragment key={c.id}>
                      <tr onClick={() => toggle(c.id)} className={`cursor-pointer ${i % 2 === 1 ? 'bg-slate-50 dark:bg-gray-700/30' : 'bg-white dark:bg-gray-800'} hover:bg-main-50 dark:hover:bg-gray-700/60`}>
                        <Td>{isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</Td>
                        <Td className="font-semibold">{c.nombre}</Td>
                        <Td>{adminDe(c)}</Td>
                        <Td>{c.contacto || c.telefono ? `${c.contacto}${c.telefono ? ` · ${c.telefono}` : ''}` : '-'}</Td>
                        <Td className="text-right">{c.miembros.length}</Td>
                        <Td className="text-right">{c.campos}</Td>
                        <Td>{c.createdAt ? formatDate(c.createdAt) : '-'}</Td>
                        <Td>{c.activa ? <Badge tone="green">Activa</Badge> : <Badge tone="red">Suspendida</Badge>}</Td>
                        <Td className="text-right">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setSuspender(c) }}
                            className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium ${c.activa ? 'border-rose-200 dark:border-rose-900 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30' : 'border-emerald-200 dark:border-emerald-900 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'}`}
                          >
                            {c.activa ? <><Ban size={13} /> Suspender</> : <><RotateCcw size={13} /> Reactivar</>}
                          </button>
                        </Td>
                      </tr>
                      {isOpen && (
                        <tr className="bg-slate-50 dark:bg-gray-900/40">
                          <td colSpan={9} className="px-6 py-3">
                            <p className="mb-2 text-xs font-semibold uppercase text-gray-400">Usuarios ({c.miembros.length})</p>
                            {c.miembros.length === 0 ? (
                              <p className="text-sm text-gray-400">Sin usuarios.</p>
                            ) : (
                              <div className="flex flex-col gap-1.5">
                                {c.miembros.map((m) => (
                                  <div key={m.email} className="flex items-center gap-2 text-sm">
                                    <Badge tone={rolTone[m.rol] ?? 'gray'}>{m.rol}</Badge>
                                    <span className="font-medium text-gray-700 dark:text-gray-200">{m.email}</span>
                                    {m.nombre && <span className="text-gray-400">· {m.nombre}</span>}
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })
              )}
            </Table>
          </Panel>
        </div>
      </ScrollArea>

      <Drawer open={open} title="Nueva cuenta" subtitle="Alta de un cliente del SaaS" onClose={() => setOpen(false)} onSubmit={handleCrear} submitting={isPending} submitLabel="Crear cuenta">
        <Field label="Nombre de la cuenta *" full>
          <input className={inputClass} value={form.nombre} onChange={(e) => set('nombre', e.target.value)} placeholder="Ej: Estancia de Pedro" />
        </Field>
        <Field label="Email del Admin *" full>
          <input className={inputClass} value={form.adminEmail} onChange={(e) => set('adminEmail', e.target.value)} placeholder="pedro@gmail.com" />
        </Field>
        <Field label="Contacto (responsable)">
          <input className={inputClass} value={form.contacto} onChange={(e) => set('contacto', e.target.value)} placeholder="Pedro González" />
        </Field>
        <Field label="Teléfono">
          <input className={inputClass} value={form.telefono} onChange={(e) => set('telefono', e.target.value)} />
        </Field>
      </Drawer>

      <ConfirmDialog
        open={!!suspender}
        title={suspender?.activa ? 'Suspender cuenta' : 'Reactivar cuenta'}
        tone={suspender?.activa ? 'danger' : 'main'}
        message={
          suspender?.activa
            ? <>Vas a <b>suspender</b> "{suspender?.nombre}". Sus usuarios no van a poder entrar hasta reactivarla.</>
            : <>Vas a <b>reactivar</b> "{suspender?.nombre}". Sus usuarios vuelven a tener acceso.</>
        }
        confirmLabel={suspender?.activa ? 'Suspender' : 'Reactivar'}
        onConfirm={handleSuspender}
        onClose={() => setSuspender(null)}
      />
    </ModuleScreen>
  )
}

export default SuperAdminView
