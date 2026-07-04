import { baseFetch } from './api'

export const fetchGetRequests = async (
  page: number,
  size: number,
  query: string
) => {
  return await baseFetch({
    method: 'POST',
    url: '/api/requests/get_requests',
    data: { page, size, query },
  })
}
