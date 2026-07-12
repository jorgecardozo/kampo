import { FaMoneyBillWave, FaCalendarDay, FaChartLine, FaReceipt } from 'react-icons/fa'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import PageHeader from '@features/shared/ui/PageHeader'
import StatCard from '@features/shared/ui/StatCard'
import { DashboardSkeleton, EmptyRow, ModuleScreen, Panel, ScrollArea, Table, Td, Th } from '@features/shared/ui/primitives'
import { formatCurrency, formatDate } from '@features/shared/lib/format'
import { useGastosDashboard } from '../useGastosDashboard'

const PIE_COLORS = ['#14b8a6', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981', '#ec4899', '#6366f1']
const money = (v: number) => formatCurrency(v)

export const GastosDashboardView = () => {
  const { data, isLoading } = useGastosDashboard()

  return (
    <ModuleScreen>
      <PageHeader section="GASTOS DEL CAMPO" title="Dashboard" />
      <ScrollArea>
        {isLoading || !data ? (
          <DashboardSkeleton cards={4} />
        ) : (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Gasto del mes" value={money(data.totalMes)} icon={<FaCalendarDay />} accent="rose" />
              <StatCard label="Gasto total" value={money(data.totalGeneral)} icon={<FaMoneyBillWave />} accent="main" />
              <StatCard label="Movimientos del mes" value={data.cantidadMes} icon={<FaReceipt />} accent="sky" />
              <StatCard label="Gasto promedio" value={money(data.promedioGasto)} icon={<FaChartLine />} accent="amber" />
            </div>

            <Panel className="p-5">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Tendencia de gasto (últimos 6 meses)</h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={data.tendencia}>
                  <defs>
                    <linearGradient id="gastoArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} width={80} tickFormatter={(v) => money(v)} />
                  <Tooltip formatter={(v: number) => money(v)} />
                  <Area type="monotone" dataKey="total" stroke="#14b8a6" strokeWidth={2} fill="url(#gastoArea)" />
                </AreaChart>
              </ResponsiveContainer>
            </Panel>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Panel className="p-5">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Gasto por categoría</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={data.porCategoria} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                      {data.porCategoria.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => money(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </Panel>

              <Panel className="p-5">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Gasto por campo</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.porCampo} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => money(v)} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} />
                    <Tooltip formatter={(v: number) => money(v)} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
            </div>

            <Panel className="p-5">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Últimos gastos</h3>
              <Table
                head={
                  <tr>
                    <Th>Fecha</Th>
                    <Th>Categoría</Th>
                    <Th>Descripción</Th>
                    <Th>Campo</Th>
                    <Th className="text-right">Monto</Th>
                  </tr>
                }
              >
                {data.ultimos.length === 0 ? (
                  <EmptyRow colSpan={5} />
                ) : (
                  data.ultimos.map((g) => (
                    <tr key={g.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <Td>{formatDate(g.fecha)}</Td>
                      <Td>{g.categoriaNombre}</Td>
                      <Td className="font-medium">{g.descripcion}</Td>
                      <Td>{g.campo}</Td>
                      <Td className="text-right font-semibold">{money(g.monto)}</Td>
                    </tr>
                  ))
                )}
              </Table>
            </Panel>
          </div>
        )}
      </ScrollArea>
    </ModuleScreen>
  )
}

export default GastosDashboardView
