import { baseFetch } from './api'

export const fetchGetProducts = async (page, size, query) => {
  return await baseFetch({
    url: '/api/products',
    method: 'POST',
    data: { page, size, query },
  })
}
