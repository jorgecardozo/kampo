import { useQuery } from '@tanstack/react-query'
import { fetchGeneralMetrics } from './general.api'

export const useGeneralDashboard = () =>
  useQuery({ queryKey: ['dashboard.general'], queryFn: fetchGeneralMetrics })
