import { baseFetch } from './api'

export const fetchGetDailyWorkById = async (dailyWorkId) => {
  return await baseFetch({
    url: `/api/daily_work_by_id/${dailyWorkId}`,
    method: 'GET',
  })
}
