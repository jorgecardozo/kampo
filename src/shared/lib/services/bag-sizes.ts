import { baseFetch } from './api'

export const fetchGetBagSizes = async (data) => {
  const { productId } = data
  return await baseFetch({
    url: `/api/bag_sizes/${productId}`,
    method: 'POST',
    data: { data },
  })
}
