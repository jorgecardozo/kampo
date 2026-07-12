import { GiCow } from 'react-icons/gi'
import { FaSyringe, FaVenusMars } from 'react-icons/fa'
import { AlertTriangle } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import PageHeader from '@features/shared/ui/PageHeader'
import StatCard from '@features/shared/ui/StatCard'
import { DashboardSkeleton, ModuleScreen, Panel, ScrollArea, Table, Td, Th, EmptyRow } from '@features/shared/ui/primitives'
import { formatCurrency, formatDate } from '@features/shared/lib/format'
import { useGanaderiaDashboard } from '../useGanaderiaDashboard'

const PIE_COLORS = ['#14b8a6', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

export const GanaderiaDashboardView = () => {
  const { data, isLoading } = useGanaderiaDashboard()

  return (
    <ModuleScreen>
      <PageHeader section="GANADERÍA" title="Dashboard" />
      <ScrollArea>
        {isLoading || !data ? (
          <DashboardSkeleton cards={5} />
        ) : (
          <div className="flex flex-col gap-5">
            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Cabezas activas" value={data.totalActivos} icon={<GiCow />} accent="emerald" />
              <StatCard
                label="Hembras / Machos"
                value={`${data.totalHembras} / ${data.totalMachos}`}
                icon={<FaVenusMars />}
                accent="sky"
              />
              <StatCard
                label="Vacunas vencidas"
                value={data.vencidas}
                icon={<AlertTriangle size={18} />}
                accent="rose"
                hint="Requieren atención"
              />
              <StatCard
                label="Próximas 30 días"
                value={data.proximas30}
                icon={<FaSyringe />}
                accent="amber"
              />
              <StatCard
                label="Capital de ganado"
                value={formatCurrency(data.capitalGanado)}
                icon={<GiCow />}
                accent="main"
                hint="Valor de la hacienda activa"
              />
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Panel className="p-5">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Distribución por categoría</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={data.porCategoria}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                    >
                      {data.porCategoria.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Panel>

              <Panel className="p-5">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Animales por potrero</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.porPotrero}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
            </div>

            {/* Próximas dosis + costo */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <Panel className="p-5 lg:col-span-2">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Próximas dosis</h3>
                <Table
                  head={
                    <tr>
                      <Th>Animal</Th>
                      <Th>Vacuna</Th>
                      <Th>Fecha</Th>
                      <Th>Veterinario</Th>
                    </tr>
                  }
                >
                  {data.proximasDosis.length === 0 ? (
                    <EmptyRow colSpan={4} label="Sin dosis programadas" />
                  ) : (
                    data.proximasDosis.map((v) => (
                      <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                        <Td className="font-semibold">{v.animalCaravana}</Td>
                        <Td>{v.tipoVacunaNombre}</Td>
                        <Td>{formatDate(v.proximaFecha)}</Td>
                        <Td>{v.veterinarioNombre}</Td>
                      </tr>
                    ))
                  )}
                </Table>
              </Panel>

              <StatCard
                label="Inversión en vacunación"
                value={formatCurrency(data.costoVacunacion)}
                icon={<FaSyringe />}
                accent="main"
                hint="Acumulado histórico (mock)"
              />
            </div>
          </div>
        )}
      </ScrollArea>
    </ModuleScreen>
  )
}

export default GanaderiaDashboardView
