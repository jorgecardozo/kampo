import { baseFetch } from './api'

export const fetchCreateBagSize = async (bagSize: any) => {
  return await baseFetch({
    url: `/api/bag_size/${null}`,
    method: 'POST',
    data: { bagSize },
  })
}

export const fetchUpdateBagSize = async (bagSize: any) => {
  return await baseFetch({
    url: `/api/bag_size/${bagSize.id}`,
    method: 'PUT',
    data: { bagSize },
  })
}

export const fetchDeleteBagSize = async (bagSizeId: string) => {
  return await baseFetch({
    url: `/api/bag_size/${bagSizeId}`,
    method: 'DELETE',
  })
}
