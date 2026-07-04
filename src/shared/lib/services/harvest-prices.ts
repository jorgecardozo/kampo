import { baseFetch } from './api'

export const fetchGetHarvestPrices = async (data) => {
  const { productId } = data
  return await baseFetch({
    url: `/api/harvest_prices/${productId}`,
    method: 'POST',
    data: { data },
  })
}
