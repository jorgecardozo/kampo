import { baseFetch } from './api'

export const fetchRejectRequest = async (id, data) => {
  return await baseFetch({
    url: `/api/reject_request/${id}`,
    data: data,
    method: 'POST',
  })
}

export const fetchApproveRequest = async (
  id: string,
  pointOfSaleIds: Array<number>
) => {
  return await baseFetch({
    url: `/api/approve_request/${id}`,
    data: pointOfSaleIds,
    method: 'POST',
  })
}
