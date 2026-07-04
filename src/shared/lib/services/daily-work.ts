import { baseFetch } from './api'

export const fetchCreateDailyWork = async (dailyWork: any) => {
  return await baseFetch({
    url: `/api/daily_work/${null}`,
    method: 'POST',
    data: { dailyWork },
  })
}

export const fetchUpdateDailyWork = async (dailyWork: any) => {
  return await baseFetch({
    url: `/api/daily_work/${dailyWork.id}`,
    method: 'PUT',
    data: { dailyWork },
  })
}

export const fetchDeleteDailyWork = async (dailyWorkId: string) => {
  return await baseFetch({
    url: `/api/daily_work/${dailyWorkId}`,
    method: 'DELETE',
  })
}
