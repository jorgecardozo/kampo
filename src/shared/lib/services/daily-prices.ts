import { baseFetch } from './api'

export const fetchGetDailyPrices = async (data) => {
  const { productId } = data
  return await baseFetch({
    url: `/api/daily_prices/${productId}`,
    method: 'POST',
    data: { data },
  })
}
