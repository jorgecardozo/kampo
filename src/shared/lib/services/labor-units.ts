import { baseFetch } from './api'

export const fetchGetLaborUnits = async (data) => {
  return await baseFetch({
    url: '/api/labor_units',
    method: 'POST',
    data: { data },
  })
}
