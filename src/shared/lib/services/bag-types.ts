import { baseFetch } from './api'

export const fetchGetBagTypes = async (data) => {
  const { productId } = data
  return await baseFetch({
    url: `/api/bag_types/${productId}`,
    method: 'POST',
    data: { data },
  })
}
