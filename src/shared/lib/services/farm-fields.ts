import { baseFetch } from './api'

export const fetchGetFarmFields = async (data) => {
  return await baseFetch({
    url: '/api/farm_fields',
    method: 'POST',
    data: { data },
  })
}
