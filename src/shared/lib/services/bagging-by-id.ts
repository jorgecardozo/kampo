import { baseFetch } from './api'

export const fetchGetBaggingById = async (baggingId) => {
  return await baseFetch({
    url: `/api/bagging_by_id/${baggingId}`,
    method: 'GET',
  })
}
