import { baseFetch } from './api'

export const fetchCreateBagging = async (bagging: any) => {
  return await baseFetch({
    url: `/api/bagging/${null}`,
    method: 'POST',
    data: { bagging },
  })
}

export const fetchUpdateBagging = async (bagging: any) => {
  return await baseFetch({
    url: `/api/bagging/${bagging.id}`,
    method: 'PUT',
    data: { bagging },
  })
}

export const fetchDeleteBagging = async (baggingId: string) => {
  return await baseFetch({
    url: `/api/bagging/${baggingId}`,
    method: 'DELETE',
  })
}
