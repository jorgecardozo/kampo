import { baseFetch } from './api'

export const fetchCreateFarmField = async (farmField: any) => {
  return await baseFetch({
    url: `/api/farm_field/${null}`,
    method: 'POST',
    data: { farmField },
  })
}

export const fetchUpdateFarmField = async (farmField: any) => {
  return await baseFetch({
    url: `/api/farm_field/${farmField.id}`,
    method: 'PUT',
    data: { farmField },
  })
}

export const fetchDeleteFarmField = async (farmFieldId: string) => {
  return await baseFetch({
    url: `/api/farm_field/${farmFieldId}`,
    method: 'DELETE',
  })
}
