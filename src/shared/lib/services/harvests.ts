import { baseFetch } from './api'

export const fetchGetHarvests = async (data) => {
  const { productId } = data
  return await baseFetch({
    url: `/api/harvests/${productId}`,
    method: 'POST',
    data: { data },
  })
}
