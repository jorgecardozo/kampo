import { baseFetch } from './api'

export const fetchGetBaggings = async (data) => {
  const { productId } = data
  return await baseFetch({
    url: `/api/baggings/${productId}`,
    method: 'POST',
    data: { data },
  })
}
