import { baseFetch } from './api'

export const fetchGetDailyWorks = async (data) => {
  const { productId } = data
  return await baseFetch({
    url: `/api/daily_works/${productId}`,
    method: 'POST',
    data: { data },
  })
}
