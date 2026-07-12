import { useQuery } from '@tanstack/react-query'
import { fetchGanaderiaMetrics } from './ganaderiaDashboard.api'

export const useGanaderiaDashboard = () =>
  useQuery({ queryKey: ['ganaderia.dashboard'], queryFn: fetchGanaderiaMetrics })
