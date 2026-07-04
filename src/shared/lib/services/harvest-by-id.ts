import { baseFetch } from './api'

export const fetchGetHarvestById = async (harvestId) => {
  return await baseFetch({
    url: `/api/harvest_by_id/${harvestId}`,
    method: 'GET',
  })
}
