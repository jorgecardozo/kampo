import Link from 'next/link'
import { GiCow } from 'react-icons/gi'
import { FaMoneyBillWave, FaSyringe, FaArrowRight, FaCalendarAlt, FaTags } from 'react-icons/fa'
import PageHeader from '@features/shared/ui/PageHeader'
import { ModuleScreen, Panel, ScrollArea } from '@features/shared/ui/primitives'
import { paths } from 'lib/utils/paths'

const accesos = [
  { title: 'Dashboard Ganadería', desc: 'Hacienda, vacunas y alertas sanitarias', icon: <GiCow />, path: paths.ganaderia.dashboard.path, color: 'text-emerald-500' },
  { title: 'Dashboard Gastos', desc: 'Gastos del campo por categoría y campo', icon: <FaMoneyBillWave />, path: paths.gastos.dashboard.path, color: 'text-main-500' },
  { title: 'Vacunaciones', desc: 'Registrar y consultar vacunaciones', icon: <FaSyringe />, path: paths.ganaderia.vacunaciones.path, color: 'text-sky-500' },
  { title: 'Calendario Sanitario', desc: 'Próximas dosis y vencidas', icon: <FaCalendarAlt />, path: paths.ganaderia.calendario.path, color: 'text-amber-500' },
  { title: 'Animales', desc: 'Inventario de hacienda', icon: <GiCow />, path: paths.ganaderia.animales.path, color: 'text-emerald-500' },
  { title: 'Categorías de gasto', desc: 'Rubros del campo', icon: <FaTags />, path: paths.gastos.categorias.path, color: 'text-rose-500' },
]

const DashboardViewTemplate = () => (
  <ModuleScreen>
    <PageHeader section="INICIO" title="Dashboard" />
    <ScrollArea>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Gestión del Campo</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Accesos rápidos a Ganadería y Gastos del Campo.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {accesos.map((a) => (
          <Link key={a.path} href={a.path}>
            <Panel className="p-5 h-full hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-start justify-between">
                <div className={`text-3xl ${a.color}`}>{a.icon}</div>
                <FaArrowRight className="text-gray-300 group-hover:text-main-500 transition-colors" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-800 dark:text-white">{a.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{a.desc}</p>
            </Panel>
          </Link>
        ))}
      </div>
    </ScrollArea>
  </ModuleScreen>
)

export default DashboardViewTemplate
