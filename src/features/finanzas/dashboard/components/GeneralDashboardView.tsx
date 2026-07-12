import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Banknote, Coins, TrendingDown, TrendingUp } from 'lucide-react'
import PageHeader from '@features/shared/ui/PageHeader'
import StatCard from '@features/shared/ui/StatCard'
import { DashboardSkeleton, ModuleScreen, Panel, ScrollArea } from '@features/shared/ui/primitives'
import { formatCurrency } from '@features/shared/lib/format'
import { useGeneralDashboard } from '../useGeneral'

const money = (v: number) => formatCurrency(v)

const AreaCard = ({ titulo, ingresos, gastos, resultado }: { titulo: string; ingresos: number; gastos: number; resultado: number }) => (
  <Panel className="p-5">
    <h3 className="font-semibold text-gray-800 dark:text-white mb-3">{titulo}</h3>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Ingresos</span><span className="font-medium text-emerald-600 dark:text-emerald-400">{money(ingresos)}</span></div>
      <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Gastos</span><span className="font-medium text-rose-600 dark:text-rose-400">{money(gastos)}</span></div>
      <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
        <span className="font-semibold text-gray-700 dark:text-gray-200">Resultado</span>
        <span className={`font-bold ${resultado >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>{money(resultado)}</span>
      </div>
    </div>
  </Panel>
)

export const GeneralDashboardView = () => {
  const { data, isLoading } = useGeneralDashboard()

  return (
    <ModuleScreen>
      <PageHeader section="INICIO" title="Dashboard General" />
      <ScrollArea>
        {isLoading || !data ? (
          <DashboardSkeleton cards={4} />
        ) : (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Ingresos" value={money(data.ingresos)} icon={<Banknote size={18} />} accent="emerald" />
              <StatCard label="Gastos" value={money(data.gastosTotal)} icon={<TrendingDown size={18} />} accent="rose" />
              <StatCard
                label="Resultado"
                value={money(data.resultado)}
                icon={data.resultado >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                accent={data.resultado >= 0 ? 'emerald' : 'rose'}
                hint={data.resultado >= 0 ? 'Ganancia' : 'Pérdida'}
              />
              <StatCard label="Capital de ganado" value={money(data.capitalGanado)} icon={<Coins size={18} />} accent="main" hint={`${data.cabezas} cabezas`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <AreaCard titulo="🌾 Campo" {...data.campo} />
              <AreaCard titulo="🐄 Ganadería" {...data.ganaderia} />
            </div>

            <Panel className="p-5">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Ingresos vs Gastos por área</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { name: 'Campo', Ingresos: data.campo.ingresos, Gastos: data.campo.gastos },
                    { name: 'Ganadería', Ingresos: data.ganaderia.ingresos, Gastos: data.ganaderia.gastos },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} width={80} tickFormatter={(v) => money(v)} />
                  <Tooltip formatter={(v: number) => money(v)} />
                  <Legend />
                  <Bar dataKey="Ingresos" fill="#10b981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Gastos" fill="#ef4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </div>
        )}
      </ScrollArea>
    </ModuleScreen>
  )
}

export default GeneralDashboardView
