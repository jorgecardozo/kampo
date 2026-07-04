import { baseFetch } from './api'

export const fetchCreateBagType = async (bagType: any) => {
  return await baseFetch({
    url: `/api/bag_type/${null}`,
    method: 'POST',
    data: { bagType },
  })
}

export const fetchUpdateBagType = async (bagType: any) => {
  return await baseFetch({
    url: `/api/bag_type/${bagType.id}`,
    method: 'PUT',
    data: { bagType },
  })
}

export const fetchDeleteBagType = async (bagTypeId: string) => {
  return await baseFetch({
    url: `/api/bag_type/${bagTypeId}`,
    method: 'DELETE',
  })
}
