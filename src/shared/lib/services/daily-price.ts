import { baseFetch } from './api'

export const fetchCreateDailyPrice = async (dailyPrice: any) => {
  return await baseFetch({
    url: `/api/daily_price/${null}`,
    method: 'POST',
    data: { dailyPrice },
  })
}

export const fetchUpdateDailyPrice = async (dailyPrice: any) => {
  return await baseFetch({
    url: `/api/daily_price/${dailyPrice.id}`,
    method: 'PUT',
    data: { dailyPrice },
  })
}

export const fetchDeleteDailyPrice = async (dailyPriceId: string) => {
  return await baseFetch({
    url: `/api/daily_price/${dailyPriceId}`,
    method: 'DELETE',
  })
}
