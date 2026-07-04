import { useQuery } from '@tanstack/react-query'
import { fetchGastosMetrics } from './gastosDashboard.api'

export const useGastosDashboard = () =>
  useQuery({ queryKey: ['gastos.dashboard'], queryFn: fetchGastosMetrics })
