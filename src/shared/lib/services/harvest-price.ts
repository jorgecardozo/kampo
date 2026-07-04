import { baseFetch } from './api'

export const fetchCreateHarvestPrice = async (harvestPrice: any) => {
  return await baseFetch({
    url: `/api/harvest_price/${null}`,
    method: 'POST',
    data: { harvestPrice },
  })
}

export const fetchUpdateHarvestPrice = async (harvestPrice: any) => {
  return await baseFetch({
    url: `/api/harvest_price/${harvestPrice.id}`,
    method: 'PUT',
    data: { harvestPrice },
  })
}

export const fetchDeleteHarvestPrice = async (harvestPriceId: string) => {
  return await baseFetch({
    url: `/api/harvest_price/${harvestPriceId}`,
    method: 'DELETE',
  })
}
