import { baseFetch } from './api'

export const fetchCreateBagPrice = async (bagPrice: any) => {
  return await baseFetch({
    url: `/api/bag_price/${null}`,
    method: 'POST',
    data: { bagPrice },
  })
}

export const fetchUpdateBagPrice = async (bagPrice: any) => {
  return await baseFetch({
    url: `/api/bag_price/${bagPrice.id}`,
    method: 'PUT',
    data: { bagPrice },
  })
}

export const fetchDeleteBagPrice = async (bagPriceId: string) => {
  return await baseFetch({
    url: `/api/bag_price/${bagPriceId}`,
    method: 'DELETE',
  })
}
