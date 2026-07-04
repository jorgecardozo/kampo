import { ReactNode } from 'react'

type StatCardProps = {
  label: string
  value: ReactNode
  icon?: ReactNode
  hint?: string
  accent?: 'main' | 'emerald' | 'amber' | 'rose' | 'sky'
}

const accentMap: Record<NonNullable<StatCardProps['accent']>, string> = {
  main: 'from-main-500/15 to-main-600/5 text-main-600 dark:text-main-400',
  emerald: 'from-emerald-500/15 to-emerald-600/5 text-emerald-600 dark:text-emerald-400',
  amber: 'from-amber-500/15 to-amber-600/5 text-amber-600 dark:text-amber-400',
  rose: 'from-rose-500/15 to-rose-600/5 text-rose-600 dark:text-rose-400',
  sky: 'from-sky-500/15 to-sky-600/5 text-sky-600 dark:text-sky-400',
}

// Tarjeta de métrica para los dashboards.
export const StatCard = ({ label, value, icon, hint, accent = 'main' }: StatCardProps) => (
  <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
        {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      </div>
      {icon && (
        <div className={`rounded-xl bg-gradient-to-br p-3 text-xl ${accentMap[accent]}`}>{icon}</div>
      )}
    </div>
  </div>
)

export default StatCard
