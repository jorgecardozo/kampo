import { useMemo } from 'react'
import { AlertTriangle, CalendarClock, CheckCircle2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageHeader from '@features/shared/ui/PageHeader'
import { EmptyRow, LoadingRow, ModuleScreen, Panel, ScrollArea, Table, Td, Th } from '@features/shared/ui/primitives'
import { daysUntil, formatDate } from '@features/shared/lib/format'
import { useVacunaciones } from '../../vacunaciones/useVacunaciones'
import type { Vacunacion } from '../../shared/types'

type Group = { vencidas: Vacunacion[]; proximas: Vacunacion[]; futuras: Vacunacion[] }

const SanitarioTable = ({ rows, isLoading }: { rows: Vacunacion[]; isLoading: boolean }) => (
  <Table
    head={
      <tr>
        <Th>Animal</Th>
        <Th>Vacuna</Th>
        <Th>Próxima dosis</Th>
        <Th>Días</Th>
        <Th>Veterinario</Th>
      </tr>
    }
  >
    {isLoading ? (
      <LoadingRow colSpan={5} />
    ) : rows.length === 0 ? (
      <EmptyRow colSpan={5} label="Sin pendientes" />
    ) : (
      rows.map((v, i) => {
        const d = daysUntil(v.proximaFecha)
        return (
          <tr
            key={v.id}
            className={`${i % 2 === 1 ? 'bg-slate-50 dark:bg-gray-700/30' : 'bg-white dark:bg-gray-800'} hover:bg-main-50 dark:hover:bg-gray-700/60`}
          >
            <Td className="font-semibold">{v.animalCaravana}</Td>
            <Td>{v.tipoVacunaNombre}</Td>
            <Td>{formatDate(v.proximaFecha)}</Td>
            <Td className={d < 0 ? 'text-rose-500' : d <= 30 ? 'text-amber-500' : ''}>
              {d < 0 ? `vencida hace ${Math.abs(d)}d` : `en ${d}d`}
            </Td>
            <Td>{v.veterinarioNombre}</Td>
          </tr>
        )
      })
    )}
  </Table>
)

// Trigger de tab con color principal cuando está activa y azul suave en hover.
const triggerClass =
  'gap-2 text-gray-600 dark:text-gray-300 hover:bg-main-50 hover:text-main-700 dark:hover:bg-gray-700 data-[state=active]:bg-main-600 data-[state=active]:text-white data-[state=active]:shadow-sm'

export const CalendarioSanitarioView = () => {
  const { data, isLoading } = useVacunaciones({})

  const groups: Group = useMemo(() => {
    const g: Group = { vencidas: [], proximas: [], futuras: [] }
    ;(data ?? []).forEach((v) => {
      const d = daysUntil(v.proximaFecha)
      if (d < 0) g.vencidas.push(v)
      else if (d <= 30) g.proximas.push(v)
      else g.futuras.push(v)
    })
    return g
  }, [data])

  return (
    <ModuleScreen>
      <PageHeader section="GANADERÍA" title="Calendario Sanitario" />
      <ScrollArea>
        <Panel className="p-4">
          <Tabs defaultValue="vencidas">
            <TabsList className="bg-slate-100 dark:bg-gray-800 h-auto p-1">
              <TabsTrigger value="vencidas" className={triggerClass}>
                <AlertTriangle size={15} /> Vencidas
                <span className="opacity-70">({groups.vencidas.length})</span>
              </TabsTrigger>
              <TabsTrigger value="proximas" className={triggerClass}>
                <CalendarClock size={15} /> Próximas 30 días
                <span className="opacity-70">({groups.proximas.length})</span>
              </TabsTrigger>
              <TabsTrigger value="futuras" className={triggerClass}>
                <CheckCircle2 size={15} /> Programadas
                <span className="opacity-70">({groups.futuras.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vencidas" className="mt-4">
              <SanitarioTable rows={groups.vencidas} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="proximas" className="mt-4">
              <SanitarioTable rows={groups.proximas} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="futuras" className="mt-4">
              <SanitarioTable rows={groups.futuras} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        </Panel>
      </ScrollArea>
    </ModuleScreen>
  )
}

export default CalendarioSanitarioView
