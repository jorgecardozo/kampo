import { baseFetch } from './api'

export const fetchGetBagPrices = async (data) => {
  const { productId } = data
  return await baseFetch({
    url: `/api/bag_prices/${productId}`,
    method: 'POST',
    data: { data },
  })
}
