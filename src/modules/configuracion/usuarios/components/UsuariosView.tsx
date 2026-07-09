import { useState } from 'react'
import { toast } from 'react-toastify'
import { Trash2, ShieldAlert } from 'lucide-react'
import PageHeader from '@modules/shared/ui/PageHeader'
import { Badge, EmptyState, ModuleScreen, Panel, PrimaryButton, ScrollArea, Table, Td, Th } from '@modules/shared/ui/primitives'
import { Drawer } from '@modules/shared/ui/Drawer'
import { Field, inputClass } from '@modules/shared/ui/FormModal'
import FilterSelect from '@modules/shared/ui/FilterSelect'
import ConfirmDialog from '@modules/shared/ui/ConfirmDialog'
import { usePermisos } from '@shared/context/PermisosProvider'
import type { Miembro, Rol } from '../miembros.api'
import { useInviteMiembro, useMiembros, useRemoveMiembro, useUpdateMiembroRol } from '../useMiembros'

const ROLES: { value: Rol; label: string; hint: string }[] = [
  { value: 'admin', label: 'Admin', hint: 'Todo + gestionar permisos' },
  { value: 'encargado', label: 'Encargado', hint: 'Todo menos permisos' },
  { value: 'editor', label: 'Editor', hint: 'Crea y edita datos' },
  { value: 'lector', label: 'Lector', hint: 'Solo ver' },
]
const rolTone: Record<Rol, 'green' | 'blue' | 'amber' | 'gray'> = {
  admin: 'green',
  encargado: 'blue',
  editor: 'amber',
  lector: 'gray',
}
const rolLabel = (r: Rol) => ROLES.find((x) => x.value === r)?.label ?? r

export const UsuariosView = () => {
  const { puedeGestionarPermisos } = usePermisos()
  const { data: miembros, isLoading } = useMiembros()
  const { mutateAsync: invite, isPending: inviting } = useInviteMiembro()
  const { mutateAsync: updateRol } = useUpdateMiembroRol()
  const { mutateAsync: remove, isPending: removing } = useRemoveMiembro()

  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [nombre, setNombre] = useState('')
  const [rol, setRol] = useState<Rol>('lector')
  const [target, setTarget] = useState<Miembro | null>(null)

  const handleInvite = async () => {
    if (!email.trim() || !email.includes('@')) {
      toast.error('Ingresá un email válido', { theme: 'colored' })
      return
    }
    try {
      await invite({ email, rol, nombre })
      toast.success('Usuario invitado · ya puede entrar con ese email', { theme: 'colored' })
      setOpen(false)
      setEmail('')
      setNombre('')
      setRol('lector')
    } catch {
      toast.error('No se pudo invitar (¿ya existe ese email?)', { theme: 'colored' })
    }
  }

  const handleRemove = async () => {
    if (!target) return
    try {
      await remove(target.id)
      toast.success('Usuario quitado', { theme: 'colored' })
      setTarget(null)
    } catch {
      toast.error('No se pudo quitar', { theme: 'colored' })
    }
  }

  return (
    <ModuleScreen>
      <PageHeader
        section="CONFIGURACIÓN"
        title="Usuarios del campo"
        actions={puedeGestionarPermisos ? <PrimaryButton onClick={() => setOpen(true)}>Invitar usuario</PrimaryButton> : undefined}
      />
      <ScrollArea>
        {!puedeGestionarPermisos ? (
          <Panel className="p-4">
            <EmptyState
              icon={<ShieldAlert className="text-amber-500" />}
              title="Solo el Admin puede gestionar usuarios"
              description="Pedile al administrador de la cuenta que te dé el permiso si necesitás invitar o cambiar roles."
            />
          </Panel>
        ) : (
          <Panel className="p-2.5 sm:p-4 flex flex-1 flex-col min-h-0">
            <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
              Invitá gente con su <b>email de Google/Facebook</b>. Cuando entren con ese email, verán este campo con
              el rol que les asignes.
            </p>
            <Table
              head={
                <tr>
                  <Th>Email</Th>
                  <Th>Nombre</Th>
                  <Th>Rol</Th>
                  <Th className="text-right">Acciones</Th>
                </tr>
              }
            >
              {isLoading ? (
                <tr><Td className="text-gray-400">Cargando…</Td></tr>
              ) : (miembros?.length ?? 0) === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <EmptyState icon="👥" title="Todavía no invitaste a nadie" description="Invitá a tu papá o a un empleado con su email." action={<PrimaryButton onClick={() => setOpen(true)}>Invitar usuario</PrimaryButton>} />
                  </td>
                </tr>
              ) : (
                miembros!.map((m, i) => (
                  <tr key={m.id} className={i % 2 === 1 ? 'bg-slate-50 dark:bg-gray-700/30' : 'bg-white dark:bg-gray-800'}>
                    <Td className="font-medium">{m.email}</Td>
                    <Td>{m.nombre || '-'}</Td>
                    <Td>
                      <div className="w-40" onClick={(e) => e.stopPropagation()}>
                        <FilterSelect
                          value={m.rol}
                          onChange={(v) => updateRol({ id: m.id, rol: v as Rol })}
                          options={ROLES.map((r) => ({ value: r.value, label: r.label }))}
                        />
                      </div>
                    </Td>
                    <Td className="text-right">
                      <button
                        type="button"
                        onClick={() => setTarget(m)}
                        className="inline-flex items-center gap-1 rounded-md border border-rose-200 dark:border-rose-900 px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30"
                      >
                        <Trash2 size={13} /> Quitar
                      </button>
                    </Td>
                  </tr>
                ))
              )}
            </Table>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {ROLES.map((r) => (
                <div key={r.value} className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                  <Badge tone={rolTone[r.value]}>{r.label}</Badge>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{r.hint}</p>
                </div>
              ))}
            </div>
          </Panel>
        )}
      </ScrollArea>

      <Drawer
        open={open}
        title="Invitar usuario"
        subtitle="Se da acceso por email"
        onClose={() => setOpen(false)}
        onSubmit={handleInvite}
        submitting={inviting}
        submitLabel="Invitar"
      >
        <Field label="Email *" full>
          <input className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="papa@gmail.com" />
        </Field>
        <Field label="Nombre (opcional)">
          <input className={inputClass} value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </Field>
        <Field label="Rol">
          <FilterSelect value={rol} onChange={(v) => setRol(v as Rol)} options={ROLES.map((r) => ({ value: r.value, label: `${r.label} — ${r.hint}` }))} />
        </Field>
      </Drawer>

      <ConfirmDialog
        open={!!target}
        title="Quitar usuario"
        message={<>Vas a quitarle el acceso a <b>{target?.email}</b>. Puede volver a ser invitado después.</>}
        confirmLabel="Quitar"
        loading={removing}
        onConfirm={handleRemove}
        onClose={() => setTarget(null)}
      />
    </ModuleScreen>
  )
}

export default UsuariosView
