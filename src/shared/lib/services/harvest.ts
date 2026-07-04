import { baseFetch } from './api'

export const fetchCreateHarvest = async (harvest: any) => {
  return await baseFetch({
    url: `/api/harvest/${null}`,
    method: 'POST',
    data: { harvest },
  })
}

export const fetchUpdateHarvest = async (harvest: any) => {
  return await baseFetch({
    url: `/api/harvest/${harvest.id}`,
    method: 'PUT',
    data: { harvest },
  })
}

export const fetchDeleteHarvest = async (harvestId: string) => {
  return await baseFetch({
    url: `/api/harvest/${harvestId}`,
    method: 'DELETE',
  })
}
